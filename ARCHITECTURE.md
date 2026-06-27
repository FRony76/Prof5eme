# Architecture — Défis d'apprentissage 5ème

## Vue d'ensemble

Application React mono-composant (`App`) sans backend propre. L'IA est appelée directement depuis le navigateur via l'API Google Gemini.

```
defis_apprentissage.jsx
├── Données statiques   CARDS, EXERCISES, SUBS, P (palette)
├── Utilitaires         callGemini(), downscaleToResult()
├── Composant           PhotoCapture
└── Composant principal App  (navigation par état `screen`)
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

### `callGemini(system, userMsg, imageBase64?, imageMediaType?)`

Appel direct à `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent` (header `x-goog-api-key`). Accepte du texte **ou** une image en base64.

```
system      → system_instruction.parts[0].text
Texte seul  → contents[0].parts = [{ text: userMsg }]
Avec image  → parts += { inline_data: { mime_type, data: base64 } }
```

Retourne un objet JSON parsé. Le mode JSON natif (`generationConfig.responseMimeType:"application/json"`) garantit une sortie propre ; le strip de fences markdown reste comme filet de sécurité. Le modèle est isolé dans la constante `GEMINI_MODEL`.

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
