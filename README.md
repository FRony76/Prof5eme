# Défis d'apprentissage — 5ème

Application React interactive d'entraînement pour les élèves de 5ème en **Mathématiques** et **Physique-Chimie**.

## Fonctionnalités

| Écran | Description |
|---|---|
| **Défis / Quiz** | Questions générées par l'IA Google Gemini, correction instantanée, score et série |
| **Fiches de révision** | Cartes recto/verso par thème, à feuilleter librement |
| **Banque d'exercices** | Exercices à 3 niveaux avec indice et corrigé consultable |
| **Validation photo** | L'élève peut soumettre une photo de sa copie manuscrite à la place du texte |

### Matières couvertes

- **Mathématiques** — Fractions, Nombres relatifs, Puissances, Calcul littéral, Équations, Proportionnalité, Fonctions, Repérage, Géométrie, Symétrie centrale, Parallélogrammes, Solides et volumes, Statistiques, Probabilités
- **Physique-Chimie** — La lumière, États de la matière, Mélanges et solutions, Le son, Électricité, Mouvement et vitesse, L'énergie
- **Problèmes mixtes** — Situations croisant maths et physique

## Démarrage rapide

### Prérequis

- Node.js ≥ 18
- Une clé API Google Gemini (pour les défis IA et la correction photo) — obtenue via [Google AI Studio](https://aistudio.google.com/apikey)

### Installation

```bash
# Dans votre projet React (Vite, CRA, Next.js…)
cp defis_apprentissage.jsx src/

# Installer React si besoin
npm install react react-dom
```

### Clé API

L'application appelle directement `generativelanguage.googleapis.com` depuis le navigateur (la fonction `callGemini`). Configurez votre clé via une variable d'environnement exposée côté client, dans un fichier `.env.local` à la racine :

```
VITE_GEMINI_API_KEY=AIza...
```

La clé est lue par le header `x-goog-api-key` dans `callGemini()`. Un changement de `.env.local` nécessite un redémarrage du serveur Vite.

> **Attention** : exposer une clé API côté client n'est adapté qu'à un usage interne / scolaire contrôlé. En production publique, passez par un backend proxy.

### Intégration

```jsx
import App from "./defis_apprentissage";

function Root() {
  return <App />;
}
```

## Structure du contenu

Tout le contenu pédagogique est déclaré en haut du fichier JSX :

```
CARDS      → fiches de révision  { f: "recto", b: "verso" }
EXERCISES  → banque d'exercices  { lvl: 1|2|3, q: "énoncé", hint: "indice", a: "corrigé" }
SUBS       → sujets et leurs thèmes
LVL        → libellés des niveaux (Débutant / Intermédiaire / Expert)
```

## Modèle IA utilisé

`gemini-3.5-flash` — génération de questions et correction (texte et vision). Défini dans la constante `GEMINI_MODEL` en haut de `callGemini` (point unique à ajuster).

## Licence

Usage scolaire interne — contenu soumis au droit d'auteur de l'auteur.
