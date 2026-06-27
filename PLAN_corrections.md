# Plan de corrections & modifications — à exécuter par Sonnet

Cible : `defis_apprentissage.jsx` (composant unique). Réalisé après relecture complète du code.

Priorité : **A** (fonctionnel, bloquant) > **B** (bug) > **C** (qualité / DRY).

---

## A. Feature demandée — Capture caméra en direct (sans fichier intermédiaire)

### Besoin
Prendre une photo **directement depuis la caméra** (webcam d'ordinateur ou caméra de téléphone/tablette), sans passer par l'app photo de l'OS ni par un fichier. Aujourd'hui `PhotoCapture` (ligne 654) n'utilise que `<input type="file" capture="environment">` : sur PC ça ouvre un sélecteur de fichier (pas de caméra), sur mobile ça passe par l'app caméra de l'OS qui produit un fichier.

### Solution : `navigator.mediaDevices.getUserMedia`
API navigateur standard (pas de bibliothèque à ajouter). Flux vidéo live → capture d'une frame sur `<canvas>` → même format de sortie `{ dataUrl, base64, mediaType }` que l'existant.

### Réécriture de `PhotoCapture` — 3 états

1. **`idle`** : deux boutons côte à côte
   - `📷 Prendre une photo` → démarre la caméra live (nouveau)
   - `📁 Choisir un fichier` → conserve l'`<input type="file">` actuel (fallback)
2. **`camera`** : `<video autoPlay playsInline muted>` affichant le flux + bouton `Capturer` + bouton `Annuler`
3. **`captured`** : aperçu miniature actuel + bouton `✕ Reprendre` (déjà existant)

### Points techniques à respecter

```js
// Démarrage caméra
const stream = await navigator.mediaDevices.getUserMedia({
  video: { facingMode: { ideal: "environment" } },  // caméra arrière sur mobile
  audio: false
});
videoRef.current.srcObject = stream;

// Capture d'une frame (réutilise la logique de downscale, cf. section C)
const canvas = document.createElement("canvas");
// downscale depuis video.videoWidth / video.videoHeight, max 1600px
// puis canvas.toDataURL("image/jpeg", 0.8) → { dataUrl, base64, mediaType }
```

- **Libérer la caméra** : `stream.getTracks().forEach(t => t.stop())` après capture, après `Annuler`, ET dans un `useEffect(() => () => stop(), [])` (cleanup au démontage). Le toggle Texte/Photo démonte `PhotoCapture` → le cleanup doit couper le flux.
- **Garder une ref au stream** (`streamRef`) pour pouvoir le stopper.
- **Contexte sécurisé** : `getUserMedia` ne marche qu'en HTTPS (ou `localhost`). En HTTP simple il échoue → afficher l'erreur et rester sur le fallback fichier.
- **Fallback gracieux** : si `getUserMedia` rejette (pas de permission, pas de caméra, contexte non sécurisé), afficher un message court (« Caméra indisponible, choisis un fichier ») et garder le bouton fichier fonctionnel.
- **Mobile** : `playsInline` obligatoire (sinon iOS passe en plein écran). `muted` pour autoriser l'autoplay.

### Impact
`PhotoCapture` est déjà partagé entre le Quiz (ligne 1209) et la Banque (ligne 889) via les props `{ photo, setPhoto, color }`. **Aucun changement d'API du composant** : les deux écrans bénéficient de la caméra sans modification ailleurs.

---

## B. Bugs à corriger

### B1. `callClaude` n'envoie aucun header d'authentification (BLOQUANT) — ligne 613
Le `fetch` ne contient que `Content-Type`. Sans `x-api-key` + `anthropic-version`, l'API renvoie 401 et toute l'app (génération + correction) échoue silencieusement (cf. B2). Ajouter :

```js
headers: {
  "Content-Type": "application/json",
  "x-api-key": import.meta.env.VITE_ANTHROPIC_API_KEY,
  "anthropic-version": "2023-06-01",
  "anthropic-dangerous-direct-browser-access": "true",
},
```
> Adapter le nom de la variable d'env selon le bundler. Documenté dans le README.

### B2. `callClaude` n'inspecte pas `res.ok` — ligne 623
Si l'API renvoie une erreur (401, 429, 500), `data.content` est `undefined` → la fonction retourne `{}` parsé. En correction, `d.correct` vaut `undefined` → l'élève voit « Pas tout à fait… » au lieu d'un message d'erreur. Ajouter un contrôle :

```js
if (!res.ok) throw new Error(`API ${res.status}`);
```
Les `try/catch` appelants afficheront alors le message d'erreur prévu (« Erreur de correction »).

### B3. Tableau de niveaux redupliqué — ligne 848
`const lvlLabel = ["", "Débutant", "Intermédiaire", "Expert"][ex.lvl];` recrée la constante globale `LVL` (ligne 18). Remplacer par `LVL[ex.lvl]`.

---

## C. Qualité / DRY / éviter de réinventer une fonction existante

### C1. `compressImage` : utiliser `createImageBitmap` (built-in) — ligne 628
La version actuelle enchaîne `FileReader.readAsDataURL` → `new Image()` → `onload`. Le navigateur fournit `createImageBitmap(file)` qui décode l'image directement (plus court, décodage hors thread principal) :

```js
async function downscaleToResult(source, maxDim = 1600, quality = 0.8) {
  // source = File | Blob | ImageBitmap | HTMLVideoElement
  const bmp = source instanceof HTMLVideoElement ? source : await createImageBitmap(source);
  let w = bmp.videoWidth || bmp.width, h = bmp.videoHeight || bmp.height;
  if (w > maxDim || h > maxDim) {
    const r = maxDim / Math.max(w, h);
    w = Math.round(w * r); h = Math.round(h * r);
  }
  const canvas = document.createElement("canvas");
  canvas.width = w; canvas.height = h;
  canvas.getContext("2d").drawImage(bmp, 0, 0, w, h);
  const dataUrl = canvas.toDataURL("image/jpeg", quality);
  return { dataUrl, base64: dataUrl.split(",")[1], mediaType: "image/jpeg" };
}
```
**Bénéfice clé** : cette fonction unique sert à la fois au fichier (section A fallback) ET à la capture caméra (frame vidéo), supprimant la duplication. Garder un fallback `new Image()` si `createImageBitmap` indisponible (Safari ancien) — sinon on peut s'en passer, support large aujourd'hui.

### C2. Logique « hasAnswer » répétée — lignes 789, 811, 892-894, 1217-1218
L'expression `answerMode === "text" ? answer.trim() : !!photo` (et son équivalent banque) est répétée ~6 fois, dont 4 fois dans le seul style du bouton ligne 893. Extraire une variable locale par écran :
```js
const canSubmit = (answerMode === "text" ? answer.trim() : photo) && !loading;
```
puis réutiliser pour `disabled`, `background`, `color`, `cursor`.

### C3. Unifier le calcul du bonus de série — lignes 804 vs 1232
Le score utilise `streak >= 2` (ancienne valeur) et l'affichage `streak > 2` (valeur incrémentée). Les deux sont **équivalents** aujourd'hui mais fragiles car dupliqués. Extraire :
```js
const STREAK_BONUS = 5;
const bonusFor = (s) => (s >= 2 ? STREAK_BONUS : 0);
```
et l'utiliser aux deux endroits sur la même base de `streak`.

### C4. Texte « 15 exercices par thème » codé en dur — lignes 955, 1107
Plusieurs thèmes n'ont pas exactement 15 exercices. Le compteur du Home est déjà dynamique (ligne 1107 calcule le total réel), mais la phrase « 15 exercices par thème » est fausse pour certains. Remplacer par une formulation neutre (« exercices progressifs, du simple au complexe ») ou calculer un min/max réel.

### C5. (Optionnel) `max_tokens: 1000` — ligne 618
Peut tronquer un `answer_guide` de problème mixte niveau 3. Passer à `1500` si des corrigés apparaissent coupés. À vérifier en test, pas prioritaire.

---

## Ordre d'exécution conseillé pour Sonnet

1. **B1 + B2** (rendre l'API fonctionnelle — sans ça rien n'est testable).
2. **C1** : créer `downscaleToResult` (socle réutilisable).
3. **A** : réécrire `PhotoCapture` (caméra live + fallback fichier) en s'appuyant sur `downscaleToResult`.
4. **B3, C3, C4** : corrections rapides.
5. **C2** : refactor `canSubmit` dans Quiz puis Banque.
6. Tester selon la checklist ci-dessous.

## Checklist de validation manuelle

- [ ] Génération d'un défi (API répond) — sinon B1/B2 à revoir
- [ ] Erreur API → message d'erreur visible (pas « Pas tout à fait… »)
- [ ] PC : « Prendre une photo » ouvre la webcam, capture, aperçu, correction
- [ ] Mobile/tablette : caméra arrière, `playsInline` (pas de plein écran iOS)
- [ ] « Choisir un fichier » fonctionne toujours (fallback)
- [ ] Caméra coupée (voyant éteint) après capture, après Annuler, et au passage Texte/Photo
- [ ] Contexte HTTP/non-sécurisé → message + fallback fichier
- [ ] Score/série : bonus identique entre points crédités et badge affiché
