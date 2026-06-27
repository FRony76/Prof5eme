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

## Architecture (hébergement Vercel)

L'application est un front React (Vite) servé en statique, avec des **fonctions serverless** sous `/api` :

```
Navigateur (React)  ──►  /api/login · /api/session · /api/logout   (authentification)
                    ──►  /api/gemini  ──►  Google Gemini           (proxy, clé côté serveur)
```

Points clés de sécurité :
- **La clé Gemini ne quitte jamais le serveur.** Le navigateur appelle `/api/gemini`, qui vérifie la session puis relaie la requête avec `GEMINI_API_KEY`. Aucune variable `VITE_*` ne contient de secret.
- **Authentification par cookie de session signé** (HMAC-SHA256), `HttpOnly` + `Secure` + `SameSite=Strict`. Mot de passe stocké **hashé** (scrypt), jamais en clair.
- Voir [docs/SECURITY](#sécurité--authentification) plus bas.

## Démarrage rapide

### Prérequis

- Node.js ≥ 18
- [Vercel CLI](https://vercel.com/docs/cli) (`npm i -g vercel`) — pour exécuter les fonctions `/api` en local
- Une clé API Google Gemini — via [Google AI Studio](https://aistudio.google.com/apikey)

### Configuration

Copier `.env.example` vers `.env.local` et renseigner les valeurs :

```bash
cp .env.example .env.local

# Générer le hash du mot de passe
npm run hash-password "monMotDePasse"     # → colle le résultat dans AUTH_PASSWORD_HASH

# Générer le secret de session
node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))"   # → SESSION_SECRET
```

Variables (toutes **côté serveur**, sans préfixe `VITE_`) : `GEMINI_API_KEY`, `GEMINI_MODEL` (optionnel), `AUTH_USERNAME`, `AUTH_PASSWORD_HASH`, `SESSION_SECRET`.

### Lancer en local

```bash
npm install
vercel dev            # front + fonctions /api (port 3000)
```

> `npm run dev` (Vite seul, port 5173) sert l'UI mais **pas** les routes `/api` → la connexion échouera. Utiliser `vercel dev` pour le full-stack.

### Déployer sur Vercel

1. Importer le dépôt GitHub dans Vercel (preset **Vite** auto-détecté).
2. Renseigner les variables d'environnement (mêmes clés que `.env.local`) dans **Settings → Environment Variables**.
3. Déployer. Les fichiers `/api/*.js` deviennent automatiquement des fonctions serverless (offre gratuite).

## Sécurité — authentification

| Protection | Mise en œuvre |
|---|---|
| Clé API non exposée | Appel Gemini côté serveur uniquement (`/api/gemini`) |
| Session infalsifiable | Jeton HMAC-SHA256 signé avec `SESSION_SECRET`, expiration 7 j |
| Vol de cookie (XSS) | Cookie `HttpOnly` + `Secure` |
| CSRF | `SameSite=Strict` + contrôle d'origine (`sameOrigin`) |
| Mot de passe | Hash scrypt + comparaison à temps constant (`timingSafeEqual`) |
| Énumération / timing | Vérifications systématiques, message d'erreur générique |
| Brute force | Limitation de débit best-effort par IP (renforçable via Vercel KV) |

Un seul compte (login/mot de passe) via `AUTH_USERNAME` / `AUTH_PASSWORD_HASH`. Extensible à plusieurs comptes en adaptant `api/login.js` et `api/_lib/auth.js`.

## Structure du contenu

Tout le contenu pédagogique est déclaré en haut du fichier JSX :

```
CARDS      → fiches de révision  { f: "recto", b: "verso" }
EXERCISES  → banque d'exercices  { lvl: 1|2|3, q: "énoncé", hint: "indice", a: "corrigé" }
SUBS       → sujets et leurs thèmes
LVL        → libellés des niveaux (Débutant / Intermédiaire / Expert)
```

## Modèle IA utilisé

`gemini-3.5-flash` — génération de questions et correction (texte et vision). Défini côté serveur dans `api/gemini.js` (variable d'env `GEMINI_MODEL`, défaut `gemini-3.5-flash`).

## Licence

Usage scolaire interne — contenu soumis au droit d'auteur de l'auteur.
