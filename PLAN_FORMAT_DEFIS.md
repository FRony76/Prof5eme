# Mise en forme des défis IA — plan pour Sonnet (1 session)

> **Prompt type à donner à Sonnet :**
> Lis `PLAN_FORMAT_DEFIS.md` à la racine et exécute-le intégralement. Applique exactement les modifications décrites, vérifie, commite.

## Contexte et diagnostic (validé le 01/07/2026)

Les défis générés par l'IA (mode Quiz) s'affichent en bloc : énoncés multi-étapes, feedback et corrigé modèle arrivent sur une seule ligne. Deux causes cumulées :

1. **Prompts** : `genQuestion` et `validate` dans [src/screens/QuizScreen.jsx](src/screens/QuizScreen.jsx) ne demandent jamais à Gemini de structurer le texte avec des retours à la ligne (`\n`). Idem pour le `feedback` de `checkBankAnswer` dans [src/screens/BankView.jsx](src/screens/BankView.jsx).
2. **Rendu** : dans QuizScreen, la question (l.103), le hint (l.106), le feedback (l.165) et le corrigé (l.175) sont rendus **sans** `whiteSpace:"pre-wrap"` — les `\n` seraient écrasés même si Gemini en produisait. Le corrigé est en plus un `<span>` inline collé au label « Réponse : ». Dans BankView, le feedback IA (l.118) a le même défaut.

**Modèle à suivre** : `AttemptDetailScreen.jsx` et l'affichage de `ex.q`/`ex.a` dans BankView utilisent déjà `whiteSpace:"pre-wrap"` — c'est le pattern du projet, s'y conformer.

## Garde-fous

- Ne modifier QUE `src/screens/QuizScreen.jsx` et `src/screens/BankView.jsx`. Ne pas toucher à `api/`, aux données, ni au schéma JSON des réponses Gemini (mêmes champs : `question/hint/answer_guide` et `result_correct/formula_recalled/well_written/feedback/correct_answer`).
- Ne pas changer la logique de scoring, de dispatch ni `recordAttempt`.
- Utiliser `whiteSpace:"pre-wrap"` (pas `pre-line`) pour rester cohérent avec l'existant.
- Diffs minimaux.

## A. Prompts — QuizScreen.jsx `genQuestion` (l.19-32)

Ajouter une consigne de mise en forme aux DEUX branches (mixte et simple) :

1. **Branche mixte** : dans les « Exigences », ajouter la puce :
   `- MISE EN FORME de "question" : va à la ligne (\n) entre la mise en situation, chaque donnée importante et la ou les questions posées ; si plusieurs sous-questions, les écrire a) b) c) chacune sur sa propre ligne`
2. **Branche simple** : dans le JSON EXACT, remplacer `"question":"énoncé complet"` par :
   `"question":"énoncé complet, avec un retour à la ligne (\n) entre la situation, les données et la question ; sous-questions a) b) chacune sur sa ligne"`

## B. Prompts — QuizScreen.jsx `validate` (l.52-53)

Dans les deux `userMsg` (photo et texte), remplacer la description de `correct_answer` :
`"correct_answer":"rédaction modèle complète : formule(s) + étapes + résultat avec unité, si faux ou partiel"`
par :
`"correct_answer":"rédaction modèle complète si faux ou partiel, avec un retour à la ligne (\n) entre la formule, chaque étape du calcul et le résultat final avec unité"`

Et pour `feedback` (les deux modes), compléter : `"feedback":"2-3 phrases encourageantes…"` → ajouter à la fin de la description ` (une phrase par ligne, séparées par \n)`.

## C. Prompt — BankView.jsx `checkBankAnswer` (l.27-28)

Même complément sur `feedback` dans les deux `userMsg` : ajouter ` (une phrase par ligne, séparées par \n)` à la description.

## D. Rendu — QuizScreen.jsx

1. **Question** (l.103) : ajouter `whiteSpace:"pre-wrap"` au style du `<p>`.
2. **Hint** (l.105-107) : ajouter `whiteSpace:"pre-wrap"` au style du `<div>`.
3. **Feedback** (l.165) : ajouter `whiteSpace:"pre-wrap"` au style du `<p>`.
4. **Corrigé modèle** (l.172-177) : restructurer le bloc — le label au-dessus, le texte en bloc pre-wrap (s'inspirer du bloc « Corrigé modèle » d'AttemptDetailScreen l.90-94) :
   ```jsx
   {!feedback._ok && feedback.correct_answer && (
     <div style={{ background: "rgba(0,0,0,0.04)", borderRadius: 6, padding: "10px 12px", fontSize: 13 }}>
       <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 6, color: "#9CA3AF" }}>Réponse modèle</div>
       <p style={{ color: "#111827", fontWeight: 600, margin: 0, whiteSpace: "pre-wrap", lineHeight: 1.7 }}>{feedback.correct_answer}</p>
     </div>
   )}
   ```

## E. Rendu — BankView.jsx

**Feedback IA** (l.118) : ajouter `whiteSpace:"pre-wrap"` au style du `<p>`.

## Vérification

1. `npm run lint` (0 erreur) et `npm test` (17/17 — les prompts restent côté client, le proxy est intact).
2. Vérifier au diff que seuls les 2 fichiers listés sont modifiés et que les champs JSON n'ont pas changé de nom.
3. Test end-to-end si l'environnement le permet (`vercel dev` + `.env.local`) : générer un défi mixte niveau 3 → l'énoncé doit s'afficher sur plusieurs lignes ; répondre faux → le corrigé modèle doit afficher formule / étapes / résultat sur des lignes séparées. Sinon, le signaler dans le commit et laisser la vérification visuelle à l'utilisateur.
4. Robustesse : si Gemini ignore la consigne et renvoie tout sur une ligne, l'affichage reste identique à aujourd'hui (pre-wrap sans \n = aucun changement) — pas de régression possible.

## Commit

`fix(quiz): mise en forme des défis IA — retours à la ligne (prompts + rendu pre-wrap)` sur la branche `fix/revue-contenu` (ou celle indiquée par l'utilisateur), puis push.
