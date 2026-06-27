# Guide d'onboarding — Défis d'apprentissage 5ème

Bienvenue sur le projet. Ce guide vous permet de comprendre la base de code et d'être opérationnel en moins de 30 minutes.

## 1. Fichiers à connaître

```
defis_apprentissage.jsx   → tout le code (données + composants + logique)
PLAN_validation_photo.md  → plan de la fonctionnalité photo (déjà implémentée)
ARCHITECTURE.md           → vue d'ensemble technique
CONTRIBUTING.md           → ajouter du contenu ou des fonctionnalités
```

Il n'y a **pas** de backend, pas de base de données, pas de système d'authentification. Tout tient dans un seul fichier JSX.

## 2. Mise en place locale

```bash
# 1. Cloner / récupérer le repo
git clone <url>
cd Prof5eme

# 2. Créer un projet React (si pas déjà fait)
npm create vite@latest mon-app -- --template react
cd mon-app

# 3. Copier le composant
cp ../defis_apprentissage.jsx src/

# 4. Installer les dépendances
npm install

# 5. Configurer la clé API Google Gemini
echo "VITE_GEMINI_API_KEY=AIza..." >> .env.local

# 6. Lancer
npm run dev
```

### Comment la clé est lue

Dans `defis_apprentissage.jsx`, la fonction `callGemini` (ligne ~606) effectue un fetch vers `generativelanguage.googleapis.com`. La clé est injectée via le header `x-goog-api-key` :

```js
headers: {
  "Content-Type": "application/json",
  "x-goog-api-key": import.meta.env.VITE_GEMINI_API_KEY ?? "",
}
```

Aucun header supplémentaire n'est requis : l'endpoint Gemini autorise les appels navigateur (CORS) avec une clé API.

## 3. Orientation dans le code

Le fichier est organisé de haut en bas dans cet ordre :

| Lignes (approx.) | Contenu |
|---|---|
| 1–10 | Palette de couleurs `P` |
| 11–18 | Sujets et thèmes `SUBS` |
| 19–20 | Niveaux `LVL` / `LVL_D` |
| 21–135 | Fiches de révision `CARDS` |
| 138–604 | Banque d'exercices `EXERCISES` |
| 606–630 | Fonction API `callGemini` (+ constante `GEMINI_MODEL`) |
| 634–664 | Downscale image `downscaleToResult` |
| 666–789 | Composant `PhotoCapture` (caméra live + fichier) |
| 727–fin | Composant principal `App` |

## 4. Comprendre la navigation

La navigation est gérée par un simple `useState("home")`. Pas de router. Chaque écran est un bloc `if (screen === "xxx") return (...)` dans `App`.

Pour explorer un écran, cherchez `if (screen === "nom-ecran")` dans le fichier.

```
home → setup → quiz        (défis IA avec correction)
home → cards → cards-view  (fiches de révision)
home → bank  → bank-view   (exercices avec corrigé)
```

## 5. Tâches fréquentes

### Ajouter un thème à une matière

1. Dans `SUBS`, ajouter le libellé dans `topics` de la matière concernée.
2. Dans `CARDS`, ajouter un tableau de fiches pour ce thème.
3. Dans `EXERCISES`, ajouter un tableau d'exercices pour ce thème (au moins 1 par niveau).

### Tester la correction IA

1. Lancer l'app, aller dans **Défis**.
2. Choisir Maths > Fractions > Débutant.
3. Répondre à la question et cliquer Valider.
4. La réponse de l'IA s'affiche (vert/orange/rouge + explication).

### Tester la validation photo

1. Aller dans Défis ou Banque.
2. Cliquer l'onglet "Photo" sous la question.
3. Sur mobile : la caméra s'ouvre. Sur PC : sélecteur de fichier.
4. Choisir une image → aperçu → Valider.

### Modifier un prompt IA

- Génération de question : fonction `genQuestion()` dans `App` (~ligne 763).
- Correction texte/photo quiz : fonction `validate()` (~ligne 788).
- Correction banque : fonction `checkBankAnswer()` (~ligne 810).

## 6. Points d'attention

- **Pas de build séparé pour les données** : ajouter du contenu = modifier directement le JSX.
- **L'API est appelée côté client** : la clé API est visible dans les DevTools. Convient pour un usage scolaire interne uniquement.
- **La compression image se fait via `<canvas>`** : fonctionne dans tous les navigateurs modernes, mais nécessite un contexte DOM (pas de SSR).
- **Pas de persistance** : le score et le streak sont remis à zéro au rechargement de la page.

## 7. À qui poser des questions ?

Voir `CONTRIBUTING.md` pour les conventions du projet.
