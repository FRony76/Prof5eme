# Guide de contribution

Comment ajouter du contenu, corriger des exercices, ou étendre l'application.

## Ajouter du contenu pédagogique

### Une nouvelle fiche de révision

Les fiches sont dans l'objet `CARDS` au début du fichier. Chaque fiche a deux faces :

```js
CARDS.maths["Fractions"].push({
  f: "Titre de la fiche (recto)",
  b: "Contenu détaillé (verso)\n\nFormules, exemples, règles à retenir"
});
```

Conventions :
- `f` — court, c'est le titre affiché sur la face avant
- `b` — peut contenir des retours à la ligne `\n`, des tableaux en ASCII, des symboles mathématiques Unicode (², ÷, ×, π…)
- Pas de HTML, pas de Markdown — texte brut uniquement

### Un nouvel exercice

Les exercices sont dans `EXERCISES`. Structure :

```js
EXERCISES.maths["Fractions"].push({
  lvl: 2,                          // 1 = Débutant, 2 = Intermédiaire, 3 = Expert
  q:  "Énoncé complet de l'exercice.",
  hint: "Indice utile sans donner la réponse.",
  a:  "Corrigé complet avec toutes les étapes."
});
```

Conventions :
- Minimum 3 exercices par thème par niveau (1, 2, 3)
- Le corrigé `a` doit inclure la démarche, pas seulement la réponse finale
- L'indice `hint` oriente sans spoiler (mentionner la méthode, pas le calcul)

### Un nouveau thème

1. Ajouter le libellé dans `SUBS` :

```js
SUBS.maths.topics.push("Trigonométrie");
```

2. Créer le tableau de fiches correspondant dans `CARDS` :

```js
CARDS.maths["Trigonométrie"] = [
  { f: "Sinus, cosinus, tangente", b: "..." },
  // …
];
```

3. Créer le tableau d'exercices dans `EXERCISES` :

```js
EXERCISES.maths["Trigonométrie"] = [
  { lvl: 1, q: "…", hint: "…", a: "…" },
  // …
];
```

> Le nom du thème doit être identique dans `SUBS.topics`, `CARDS` et `EXERCISES` (correspondance exacte par clé).

### Une nouvelle matière

1. Ajouter dans `SUBS` :
```js
SUBS.histoire = {
  label: "Histoire-Géographie",
  emoji: "🗺️",
  topics: ["Moyen-Âge", "Renaissance"]
};
```

2. Ajouter une entrée dans la palette `P` (couleur principale, fond clair, fond medium, texte) :
```js
P.histoire = { pri: "#2D6A4F", lit: "#D8F3DC", med: "#95D5B2", txt: "#1B4332" };
```

3. Ajouter les données dans `CARDS.histoire` et `EXERCISES.histoire`.

4. Ajouter un bouton sur l'écran `home` (chercher `SUBS` dans le JSX du bloc `screen === "home"`).

## Modifier les prompts IA

Les prompts sont inline dans les fonctions. Chercher ces fonctions dans `App` :

| Fonction | Prompt à modifier |
|---|---|
| `genQuestion()` | Génération de la question IA |
| `validate()` | Correction de la réponse texte ou photo (quiz) |
| `checkBankAnswer()` | Correction de la réponse texte ou photo (banque) |

Le modèle est `gemini-3.5-flash`. Pour changer le modèle, modifier la constante `GEMINI_MODEL` au-dessus de `callGemini()`.

Le format de réponse attendu est toujours du JSON pur. Il est garanti côté API par `generationConfig.responseMimeType:"application/json"` et renforcé par le system prompt (`"JSON VALIDE UNIQUEMENT, zéro backtick"`). Ne pas casser cette contrainte, sinon le `JSON.parse()` dans `callGemini` échouera.

## Conventions de code

- **Pas de commentaires** sauf si le pourquoi est non-évident.
- **Pas de bibliothèques UI externes** : styles inline, pas de Tailwind ni de composants tiers.
- **État minimal** : ne pas ajouter de state si une valeur peut être dérivée.
- **Toujours réinitialiser le mode photo** lors d'un changement de question : `setPhoto(null); setAnswerMode("text")`.

## Tests

Il n'y a pas de suite de tests automatisés. Protocole de vérification manuelle avant chaque modification significative :

- [ ] Défis maths : générer une question, répondre par texte, vérifier le feedback
- [ ] Défis physique : idem
- [ ] Quiz photo : soumettre une photo, vérifier la correction IA
- [ ] Banque : naviguer dans les exercices, afficher indice, afficher corrigé, vérifier réponse
- [ ] Fiches : feuilleter, retourner une carte
- [ ] Vérifier que le score et le streak s'incrémentent correctement

## Déploiement

L'application est un composant React standard. Pour la déployer :

```bash
npm run build    # génère dist/
# Déposer dist/ sur n'importe quel hébergeur statique (Netlify, Vercel, GitHub Pages…)
```

Penser à configurer la variable d'environnement `VITE_GEMINI_API_KEY` sur la plateforme d'hébergement.
