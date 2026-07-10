# Plan — Refonte UI « Revizo » pour Prof5eme

## Objectif

Appliquer à Prof5eme le même design « Revizo » que celui déployé sur ProfSolange
(commit `eae6002` du repo ProfSolange), **sans aucun changement de logique** :
mêmes dispatchs, mêmes appels API, mêmes prompts IA, même navigation (v3.0 par thème).
Refonte purement graphique + coquille AppShell.

## Références (à lire avant de coder)

1. **Implémentation de référence (la plus importante)** : le repo ProfSolange sur ce
   poste, `C:\Users\ronal\Documents\repos\ProfSolange`, à son HEAD actuel.
   ProfSolange a été scaffoldé depuis Prof5eme : les deux apps ont les **mêmes noms
   d'écrans et la même architecture** (`src/screens/*`, `src/components/*`,
   `src/state/AppContext.jsx`, `src/theme.js`, `src/constants.js`). Chaque fichier
   ProfSolange sert de modèle direct pour le fichier Prof5eme homonyme.
   - Voir aussi le diff complet : `git -C C:\Users\ronal\Documents\repos\ProfSolange show eae6002`
2. **Maquette d'origine** : `C:\Users\ronal\Documents\repos\ProfSolange\docs\SiteTemplate.zip`
   (contient `Revizo.dc.html` + `support.js`). Utile seulement en cas de doute sur un
   détail visuel ; l'implémentation React de ProfSolange fait foi.

## Design system (tokens Revizo)

- **Polices** (Google Fonts, à ajouter dans `index.html`) :
  - Titres : `Bricolage Grotesque` (500–800), letter-spacing léger négatif
  - Texte : `Figtree` (400–700)
- **Couleurs de coquille** : fond crème `#F4F2EC` (body `#EDEAE1`), sidebar violette
  `#5B5488` (hover/actif `#7B74B2`, encarts `#6A63A0`), accent principal indigo
  `#5B4FE9`, texte `#191927`, bordures `#E7E4DB` / `#E1DDD2`
- **Cartes** : blanches, radius 16–22, bordure 1px `#E7E4DB`
- **Animations** : `revFade`, `revPop`, `revBar` (voir AppShell ProfSolange)
- **Responsive ≤ 780px** : sidebar devient barre de navigation en bas, grilles en
  1 colonne (classes `rev-grid3`, `rev-grid2`, `rev-grid4`, `rev-pad`, `rev-hero`…)

## Adaptations spécifiques Prof5eme (ne pas copier ProfSolange aveuglément)

### 1. Palettes matières — `src/theme.js`

Prof5eme a 3 matières (`maths`, `physique`, `mixte`) au lieu de 6. Recolorer dans la
famille Revizo (mêmes valeurs que ProfSolange, réparties) :

```js
export const P = {
  maths:    { pri:"#5B4FE9", lit:"#ECEAFC", med:"#C9C4F5", txt:"#3D34B8" }, // indigo (accent)
  physique: { pri:"#E0972B", lit:"#FBF0DC", med:"#F2D9AC", txt:"#A86D14" }, // orange
  mixte:    { pri:"#1F9D6B", lit:"#E2F3EC", med:"#B6E3CE", txt:"#157A52" }, // vert
  ok:       { pri:"#1F9D6B", lit:"#E9F6F0", txt:"#157A52" },
  warn:     { pri:"#E0972B", lit:"#FBF0DC", txt:"#A86D14" },
  err:      { pri:"#E8563F", lit:"#FCEAE6", txt:"#B93A28" }
};
```

`KIND_STYLE` : Prof5eme a `bonus` (au lieu de `tip`/`francais`). Garder les 4 clés
actuelles et leurs labels, styles Revizo (ajouter `bg`) :

```js
export const KIND_STYLE = {
  method:  { borderColor:"#5B4FE9", label:"Méthode",   labelColor:"#3D34B8", bg:"#ECEAFC" },
  example: { borderColor:"#1F9D6B", label:"Exemple",   labelColor:"#157A52", bg:"#E9F6F0" },
  warning: { borderColor:"#E0972B", label:"Attention", labelColor:"#A86D14", bg:"#FBF0DC" },
  bonus:   { borderColor:"#C74AA0", label:"Approfondissement · vu en 4e", labelColor:"#9C3379", bg:"#F8E6F2" },
};
```

### 2. `src/constants.js`

- Ajouter un glyphe `mono` par matière (comme ProfSolange) : `maths: "∑"`,
  `physique: "⚡"`, `mixte: "◆"`. Ne toucher à rien d'autre (topics, LVL, LVL_D).
- `APP_VERSION` → `"4.0"` (refonte majeure, convention du repo).

### 3. `src/components/AppShell.jsx` (nouveau fichier)

Partir de `ProfSolange/src/components/AppShell.jsx` avec ces adaptations :
- Logo : pastille « 5 », nom « Prof5eme ».
- **Carte profil : l'app est multi-élèves** — ne PAS coder un prénom en dur.
  Afficher `state.user` (initiale en majuscule dans l'avatar, nom complet dessous),
  sous-titre « Classe de 5ᵉ ». Pour alimenter `state.user` :
  - `api/session.js` renvoie déjà `{ authed, user }` ; dans `AppContext.jsx`,
    stocker `user: d.user ?? null` dans le payload du fetch `/api/session` existant.
  - Dans `App.jsx`, le `onSuccess` de `LoginScreen` passe le username saisi :
    `onSuccess={(u) => dispatch({ type:"SET", payload:{ authed:true, user:u } })}`
    et dans `LoginScreen.jsx` appeler `onSuccess(username)`.
  - Ajouter `user: null` à `initialState`. C'est la SEULE modification d'état admise.
- Mapping nav identique à ProfSolange : `HOME_SCREENS = ["home","topics","topic","cards-view","bank-view","setup","quiz"]`,
  `PROGRESS_SCREENS = ["history","attempt"]` (les noms d'écrans sont les mêmes).
- Streak/pastilles semaine : reprendre `computeWeekActivity` tel quel
  (basé sur `historyData.recent`).

### 4. Écrans — restyler chacun sur le modèle ProfSolange homonyme

Pour chaque fichier ci-dessous : ouvrir la version ProfSolange comme modèle visuel,
mais **conserver la logique Prof5eme actuelle** (hooks, dispatchs, appels
`callGemini`, garde-fous, textes pédagogiques). En cas de divergence de logique entre
les deux repos, la logique Prof5eme gagne toujours.

| Fichier Prof5eme | Modèle ProfSolange | Points d'attention |
|---|---|---|
| `index.html` | idem | fonts Google + titre « Prof5eme — Révisions 5ᵉ » |
| `src/App.jsx` | idem | envelopper les écrans post-login dans `<AppShell>` ; garder le badge version et l'hydratation history |
| `src/screens/HomeScreen.jsx` | idem | tableau de bord : carte « Reprendre », 3 tuiles stats, grille des 3 matières avec barres de maîtrise depuis `historyData.byTopic` ; états vides gérés ; aucune donnée de démo |
| `src/screens/TopicListScreen.jsx` | idem | lignes numérotées + % maîtrise |
| `src/screens/TopicHubScreen.jsx` | idem | |
| `src/components/CourseView.jsx` | idem | encart « À retenir » ; `KIND_STYLE.bonus` doit rester rendu |
| `src/screens/CardsView.jsx` | idem | |
| `src/screens/SetupScreen.jsx` | idem | choix de niveau |
| `src/screens/QuizScreen.jsx` | idem | ⚠️ **préserver le fix #15** : `whiteSpace:"pre-wrap"` sur question, indice, feedback et `correct_answer` (commit `197a333`). Le QuizScreen ProfSolange ne l'a pas — le réintroduire dans la version restylée. Préserver aussi `PhotoCapture` (réponse photo) |
| `src/screens/BankView.jsx` | idem | même vigilance pre-wrap (fix #15) + PhotoCapture |
| `src/screens/HistoryScreen.jsx` | idem | barres par matière + par thème, dernières tentatives |
| `src/screens/AttemptDetailScreen.jsx` | idem | |
| `src/components/LoginScreen.jsx` | idem | + `onSuccess(username)` (cf. §3) |
| `src/components/Table.jsx` | idem | |

`PhotoCapture.jsx` et `Dot.jsx` : ne les restyler que si nécessaire pour la cohérence
(ProfSolange ne les avait pas touchés).

## Contraintes dures

- Aucun changement de logique métier : dispatchs, réducteurs (hors ajout `user`),
  appels API, prompts IA, calculs de points/streak, navigation strictement identiques.
- Aucune donnée de démo : toutes les stats viennent de `historyData` ; états vides gérés.
- Ne pas toucher à `api/`, `src/lib/`, `src/data/`, `src/figures/`, ni aux prompts.
- Garder le badge de version flottant.

## Vérifications avant commit

1. `npm run lint` → 0 erreur.
2. `npm run build` → OK.
3. Lancer `npm run dev` via l'outil de preview et vérifier visuellement : login,
   tableau de bord, liste de thèmes, hub, cours, quiz (mise en page seulement — les
   appels IA nécessitent les clés serveur), progression, responsive 375px (nav en bas).
4. Vérifier qu'aucun `dispatch(...)` n'a changé par rapport à `origin/master`
   (hors ajout du champ `user`).

## Git

- Partir de `origin/master` (`197a333`) : `git checkout -b feat/ui-revizo origin/master`.
- Committer ce plan + la refonte (un ou deux commits), pousser la branche,
  ouvrir une PR vers `master` (master est protégée ; c'est le workflow du repo).
- Message de commit sur le modèle de `eae6002` de ProfSolange.
