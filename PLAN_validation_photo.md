# Plan — Validation des réponses par photo

## 1. Objectif

Permettre à l'élève de prendre en photo sa solution manuscrite (calculs, schéma, démarche) et de la faire corriger par le système, en complément (ou à la place) de la saisie au clavier. Le mode photo remplace la zone de texte sur un même écran : l'élève choisit librement texte **ou** photo pour valider un exercice.

Concerne les deux écrans qui ont une validation aujourd'hui :
- **Quiz / Défis** (`screen === "quiz"`) — questions générées par IA, déjà corrigées via `callClaude`.
- **Banque d'exercices** (`screen === "bank-view"`) — actuellement l'élève ne fait que révéler un corrigé fixe (pas de correction de sa propre réponse). On y ajoute la possibilité de soumettre une photo et d'obtenir un verdict, en s'appuyant sur le corrigé `ex.a` déjà écrit.

## 2. Contraintes et choix retenus

- Plateforme : ordinateur **et** mobile/tablette → un seul `<input type="file" accept="image/*" capture="environment">` couvre les deux cas (ouvre l'appareil photo sur mobile, le sélecteur de fichier sur ordi).
- Le mode photo **remplace** la zone de texte au moment de répondre : toggle "✍️ Texte" / "📷 Photo", un seul des deux est actif et nécessaire pour valider.
- Correction : retour pédagogique complet, équivalent à la correction texte (correct / partiel / faux + explication bienveillante), en utilisant la vision de Claude (`claude-sonnet-4-6` accepte des images en `content` de type `image`).
- Pas de backend propre : l'app appelle directement `api.anthropic.com` comme le fait déjà `callClaude` — on étend cette fonction pour accepter une image en base64.

## 3. Flux utilisateur

1. L'élève arrive sur la question (Quiz) ou l'exercice (Banque).
2. Il choisit l'onglet "Photo" au lieu de "Texte".
3. Il clique sur "📷 Prendre une photo / choisir un fichier" → sélection native (caméra ou fichier).
4. Aperçu de l'image affiché immédiatement (miniature), avec bouton "✕ Reprendre".
5. Bouton "Valider" devient actif dès qu'une image est chargée (remplace la condition `answer.trim()`).
6. Pendant la correction : indicateur de chargement ("Lecture de ta copie…").
7. Résultat affiché exactement comme aujourd'hui (carte verte/orange/rouge + explication + bonne réponse si besoin).

## 4. Modifications techniques

### 4.1 `callClaude` → `callClaudeVision`

Nouvelle fonction (ou extension de l'existante) acceptant soit du texte, soit une image :

```js
async function callClaude(system, userMsg, imageBase64 = null, imageMediaType = "image/jpeg") {
  const content = imageBase64
    ? [
        { type: "image", source: { type: "base64", media_type: imageMediaType, data: imageBase64 } },
        { type: "text", text: userMsg }
      ]
    : userMsg;
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-6",
      max_tokens: 1000,
      system,
      messages: [{ role: "user", content }]
    })
  });
  const data = await res.json();
  const text = data.content?.find(b => b.type === "text")?.text || "{}";
  return JSON.parse(text.replace(/```(?:json)?\s*|\s*```/g, "").trim());
}
```

Compatible avec tous les appels existants (image optionnelle, valeur par défaut `null`).

### 4.2 Capture / conversion de l'image

- Composant réutilisable `PhotoCapture` :
  - `<input type="file" accept="image/*" capture="environment" onChange={...}>` caché, déclenché par un bouton stylé.
  - À la sélection : lecture via `FileReader.readAsDataURL`, extraction du base64 brut (après la virgule) et du `media_type` (`file.type`).
  - **Compression côté client avant envoi** : redimensionner via `<canvas>` (max ~1600px de large, qualité JPEG ~0.8) pour limiter le poids de la requête et accélérer l'upload — important sur mobile (photos de 4000px+ sinon).
  - État local : `{ dataUrl, base64, mediaType }` pour aperçu + envoi.
  - Bouton "✕ Reprendre" qui réinitialise l'état et permet de rouvrir le sélecteur.

### 4.3 État de l'écran Quiz (`App`)

Nouveaux states à ajouter à côté de `answer` :
- `answerMode` : `"text" | "photo"` (toggle, défaut `"text"`).
- `photo` : `{ base64, mediaType, dataUrl } | null`.

Toggle UI juste au-dessus de la zone de réponse actuelle :
```
[ ✍️ Texte ]  [ 📷 Photo ]
```

Si `answerMode === "photo"` → afficher `PhotoCapture` à la place du `<textarea>`.
Bouton "Valider" actif si (`answerMode === "text" && answer.trim()`) **ou** (`answerMode === "photo" && photo`).

### 4.4 Fonction `validate()` — adaptation

```js
const validate = async () => {
  const hasAnswer = answerMode === "text" ? answer.trim() : !!photo;
  if (!hasAnswer || loading) return;
  setLoading(true);
  try {
    const system = "Tu corriges la réponse d'un élève de 5ème. Bienveillant et pédagogue. " +
      (answerMode === "photo" ? "La réponse est une photo de la copie manuscrite de l'élève : lis attentivement les calculs et le raisonnement écrits à la main, y compris s'ils sont raturés ou peu nets. " : "") +
      "JSON VALIDE UNIQUEMENT, zéro backtick.";
    const userMsg = answerMode === "photo"
      ? `Question : "${qData.question}"\nGuide : "${qData.answer_guide}"\nLa réponse de l'élève est fournie en photo ci-joint (copie manuscrite). Analyse la démarche et le résultat visibles sur la photo.\nJSON : {"correct":true,"partially_correct":false,"feedback":"2-3 phrases encourageantes, mentionne si l'écriture/un passage était illisible","correct_answer":"réponse complète si faux ou partiel"}`
      : `Question : "${qData.question}"\nGuide : "${qData.answer_guide}"\nRéponse élève : "${answer}"\nJSON : {"correct":true,"partially_correct":false,"feedback":"2-3 phrases encourageantes","correct_answer":"réponse complète si faux ou partiel"}`;
    const d = await callClaude(system, userMsg, answerMode === "photo" ? photo.base64 : null, photo?.mediaType);
    // ... reste inchangé (ok/half/score/streak)
  } catch { /* inchangé, ajouter message générique si erreur de lecture image */ }
  setLoading(false);
};
```

Au moment de `genQuestion()` (nouveau défi), réinitialiser aussi `photo` et remettre `answerMode` à `"text"`.

### 4.5 Écran Banque (`bank-view`)

Actuellement : juste un bouton "Voir le corrigé" (pas de saisie élève). Ajout :
- Bloc "📷 Vérifie ta réponse" sous l'énoncé, avant le bouton "Voir l'indice/corrigé" : toggle texte/photo identique, bouton "Faire corriger ma réponse".
- Appel à `callClaude` avec le corrigé fixe `ex.a` comme `answer_guide` (pas besoin de générer une question, elle existe déjà) :
  ```
  Question : "${ex.q}"
  Corrigé attendu : "${ex.a}"
  [Réponse élève en texte OU image jointe]
  JSON : {"correct":..., "partially_correct":..., "feedback":..., "correct_answer": ex.a}
  ```
- Résultat affiché dans une carte sous le bloc, même charte que le Quiz (vert/orange/rouge).
- États additionnels : `bankAnswerMode`, `bankPhoto`, `bankAnswer`, `bankFeedback`, `bankLoading` — remis à zéro à chaque changement d'exercice (`bankIdx`).

### 4.6 UI — détails de `PhotoCapture`

États visuels :
1. **Vide** : bouton large "📷 Prendre une photo ou choisir un fichier".
2. **Image chargée** : miniature (max-height ~180px, `object-fit: contain`, bordure), bouton "✕ Reprendre" à côté.
3. **Erreur** (fichier trop lourd après compression, format non supporté) : message inline discret + on reste sur l'état vide.

Limites pratiques :
- Taille max acceptée avant compression : ne pas bloquer (la compression canvas gère la plupart des cas), mais plafonner le résultat final à ~1.5 Mo de base64 pour rester sous les limites de payload raisonnables.
- Formats acceptés : `image/*` (jpeg, png, heic si le navigateur le convertit — Safari iOS convertit HEIC en JPEG via `<input>` de toute façon dans la plupart des cas modernes).

## 5. Ce qui ne change pas

- Le système de score/streak/points reste identique, qu'on valide par texte ou par photo.
- Les écrans Fiches de révision (`cards-view`) ne sont pas concernés (pas de validation, juste lecture).
- Le bouton "Voir le corrigé" dans la Banque reste disponible indépendamment de la nouvelle correction par photo (l'élève peut toujours juste lire le corrigé sans se faire évaluer).

## 6. Étapes d'implémentation (ordre conseillé)

1. Étendre `callClaude` pour accepter une image (rétrocompatible).
2. Créer le composant `PhotoCapture` (input caché + compression canvas + aperçu).
3. Intégrer le toggle texte/photo + `PhotoCapture` dans l'écran Quiz, adapter `validate()` et `genQuestion()`.
4. Tester en conditions réelles : photo nette, photo floue/sombre, écriture raturée — ajuster le prompt système si la lecture échoue trop souvent.
5. Dupliquer le mécanisme (toggle + capture + appel + affichage résultat) dans l'écran Banque, en se basant sur `ex.a` comme corrigé.
6. Vérification finale : test sur mobile réel (ouverture caméra), test sur ordinateur (sélection fichier), vérifier que le score/streak ne sont affectés que pour le Quiz (la Banque n'a pas de score actuellement — décider si on en ajoute un ou si on reste en mode "feedback seul").

## 7. Point ouvert à trancher avant de coder

La Banque d'exercices n'a pas de notion de score aujourd'hui. Faut-il :
- (a) garder la correction par photo dans la Banque comme un simple feedback sans points, ou
- (b) lui donner aussi un score/streak comme le Quiz ?

À défaut de réponse, le plan ci-dessus part sur (a) — feedback seul, pas de gamification dans la Banque — pour rester cohérent avec son rôle actuel de « consultation libre ».
