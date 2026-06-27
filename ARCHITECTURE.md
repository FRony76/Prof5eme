# Architecture — Défis d'apprentissage 5ème

## Vue d'ensemble

Front React (Vite) + **fonctions serverless Vercel** (`/api`). L'IA n'est jamais appelée directement par le navigateur : un proxy serveur détient la clé et exige une session authentifiée.

```
defis_apprentissage.jsx (client)
├── Données statiques   CARDS, EXERCISES, SUBS, P (palette)
├── Utilitaires         callGemini() → /api/gemini, downscaleToResult()
├── Composants          LoginScreen, PhotoCapture
└── Composant principal App  (gate d'auth + navigation par état `screen`)

api/ (serverless)
├── login.js     POST  vérifie identifiants → pose le cookie de session
├── session.js   GET   200 si session valide, 401 sinon
├── logout.js    POST  efface le cookie
├── gemini.js    POST  vérifie session → relaie vers Gemini (clé serveur)
└── _lib/auth.js helpers : cookies, HMAC, scrypt, rate limit, sameOrigin
```

## Authentification & flux réseau

```
Au montage de App :
  GET /api/session ──► 200 {authed:true}  → rend l'app
                  └──► 401                → rend <LoginScreen>

Connexion :
  LoginScreen → POST /api/login {username,password}
    → safeEqualStr(user) ET verifyPassword(scrypt)   (toujours les deux)
    → Set-Cookie session=<body>.<HMAC>  (HttpOnly, Secure, SameSite=Strict, 7 j)

Appel IA :
  callGemini → POST /api/gemini {system,userMsg,imageBase64?}
    → verifySession(cookie) sinon 401 (→ event "auth-expired" → LoginScreen)
    → fetch Gemini avec GEMINI_API_KEY (jamais envoyée au client)
    → { text } → JSON.parse côté client
```

## Navigation (machine d'états `screen`)

```
                    ┌─────────────────────┐
                    │        home         │
                    └──┬──────┬──────┬───┘
              [quiz] ──┘      │      └── [bank]
                    ▼    [cards]    ▼
                  setup    ▼     bank
                    │    cards   (liste topics)
                    ▼      │        │
                  quiz   cards-   bank-
               (défis)    view    view
```

### Écrans

| `screen` | Rôle |
|---|---|
| `home` | Choix matière + accès fiches / banque |
| `setup` | Choix thème + niveau avant un quiz |
| `quiz` | Question IA → réponse texte ou photo → feedback |
| `cards` | Sélection thème pour les fiches |
| `cards-view` | Feuilletage des fiches (flip recto/verso) |
| `bank` | Sélection thème pour la banque |
| `bank-view` | Exercice : indice, vérification réponse, corrigé |

## État global (`App`)

### Quiz
| State | Type | Rôle |
|---|---|---|
| `subj` | `"maths" \| "physique" \| "mixte"` | Matière active |
| `topic` | `string` | Thème sélectionné |
| `level` | `1 \| 2 \| 3` | Niveau de difficulté |
| `qData` | `{ question, hint, answer_guide }` | Question générée par l'IA |
| `answer` | `string` | Saisie texte de l'élève |
| `answerMode` | `"text" \| "photo"` | Mode de réponse |
| `photo` | `{ base64, mediaType, dataUrl } \| null` | Image compressée |
| `feedback` | `{ _ok, _half, feedback, correct_answer }` | Correction IA |
| `phase` | `"q" \| "fb"` | Phase question / feedback |
| `score` | `number` | Score cumulé |
| `streak` | `number` | Série de bonnes réponses consécutives |

### Banque
| State | Type | Rôle |
|---|---|---|
| `bankSubj / bankTopic` | `string` | Matière et thème actifs |
| `bankIdx` | `number` | Index de l'exercice courant |
| `bankAnswerMode / bankAnswer / bankPhoto` | — | Miroir des états quiz |
| `bankFeedback` | objet | Retour IA sur la réponse banque |
| `bankShowHint / bankShowAnswer` | `boolean` | Affichage indice / corrigé |

## Fonctions clés

### `callGemini(system, userMsg, imageBase64?, imageMediaType?)` (client)

`POST /api/gemini` avec `{ system, userMsg, imageBase64, imageMediaType }`. Sur **401** émet l'event `auth-expired` (→ retour au `LoginScreen`). Retourne `JSON.parse(text)`. La construction de la requête Gemini (`system_instruction`, `contents/parts`, `inline_data`, `responseMimeType:"application/json"`) et la clé API sont **côté serveur** dans `api/gemini.js` ; le modèle vient de l'env `GEMINI_MODEL`.

### `downscaleToResult(source, maxDim=1600, quality=0.8)`

Redimensionne via `<canvas>` (built-in `createImageBitmap`) avant envoi. `source` accepte un `File`/`Blob` (upload) **ou** un `HTMLVideoElement` (frame caméra). Retourne `{ dataUrl, base64, mediaType }` ; `base64` est brut, directement utilisable par `inline_data.data`.

### `PhotoCapture({ photo, setPhoto, color })`

Composant d'entrée photo partagé Quiz + Banque, à 3 états :
1. **idle** : boutons « Caméra en direct » (`getUserMedia`) et « Choisir un fichier »
2. **camera** : `<video>` live + Capturer / Annuler (flux libéré au démontage)
3. **captured** : miniature + bouton « Reprendre »

## Flux de correction IA

### Quiz

```
genQuestion()
  → callGemini(sys_prof, prompt_question)
  → setQData({ question, hint, answer_guide })

validate()
  → si photo : callGemini(sys_correcteur, prompt_photo, photo.base64)
  → si texte  : callGemini(sys_correcteur, prompt_texte)
  → setFeedback({ _ok, _half, feedback, correct_answer })
  → mise à jour score / streak
```

### Banque

```
checkBankAnswer(ex)
  → callGemini(sys_correcteur, prompt, base64?)
  → setBankFeedback({ _ok, _half, feedback })
  (pas de score ni de streak dans la banque)
```

## Système de score (Quiz uniquement)

```
Bonne réponse   : +level×10 pts (+5 bonus si streak ≥ 2)
Réponse partielle : +level×3 pts, streak remis à 0
Mauvaise réponse  : streak remis à 0
```

## Palette de couleurs

```js
P.maths    → bleu   (#185FA5)
P.physique → orange (#854F0B)
P.mixte    → violet (#7C3AED)
P.ok       → vert   (#0F6E56)
P.warn     → ambre  (#B45309)
P.err      → rouge  (#A32D2D)
```

Chaque élément de l'UI lit sa couleur dans `P[subj]` pour rester cohérent avec la matière active.
