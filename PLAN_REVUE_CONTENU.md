# Revue du contenu des révisions — instructions pour les sessions Sonnet

> **Prompt type à donner à Sonnet à chaque session :**
> Lis `PLAN_REVUE_CONTENU.md` puis `REVUE_CONTENU_SUIVI.md` à la racine. Exécute la prochaine session marquée ⬜ en suivant strictement la méthode de validation. Recalcule chaque résultat toi-même avant de lire la réponse fournie. Termine par la mise à jour du suivi, les vérifications et le commit.

## Objectif

Valider que chaque contenu pédagogique de l'appli est **exact** (calculs, réponses, définitions, faits scientifiques) et **corriger directement** les erreurs trouvées. Les manques (chapitres du programme absents, thèmes incomplets) sont **listés seulement** — la création de contenu est un chantier séparé.

Le contenu vit dans deux fichiers :
- `src/data/cards.js` — 28 fiches de cours (17 maths + 11 physique)
- `src/data/exercises.js` — 463 exercices `{lvl, q, hint, a}` sur 34 thèmes (17 maths, 11 physique, 6 mixtes)

## Garde-fous critiques

- ⚠️ **Ne modifier QUE `src/data/cards.js` et `src/data/exercises.js`** (et, en session 8 uniquement, `src/constants.js` pour le bump de version). Le fichier racine `defis_apprentissage.jsx` est un héritage du monolithe, importé nulle part — **ne pas y toucher**.
- Ne pas changer le schéma des données : exercices `{lvl, q, hint, a}` ; fiches `{intro, sections:[{h, b, kind?, fig?, table?}], keypoints}`.
- Texte brut + symboles Unicode (`×`, `÷`, `−`, `²`, `³`, `→`, `≠`, `≤`…), **pas de LaTeX**. Respecter le style existant.
- Diffs minimaux : corriger l'erreur, ne pas réécrire le style.
- Ne pas ajouter ni supprimer d'exercices, sauf réécriture d'un exercice irrécupérable (voir règles de correction).
- Travailler sur la branche `fix/revue-contenu`.

## Découpage en 8 sessions

| # | Lot | Thèmes (nb d'exercices) | Volume |
|---|-----|--------|--------|
| 1 | Maths A — nombres | Fractions (15), Nombres relatifs (15), Divisibilité (9), Puissances (15) | 54 ex + 4 fiches |
| 2 | Maths B — algèbre | Calcul littéral (15), Équations (15), Proportionnalité (15), Fonctions (15) | 60 ex + 4 fiches |
| 3 | Maths C — géométrie | Repérage (15), Géométrie (15), Symétrie centrale (15), Symétrie axiale (8), Parallélogrammes (15) | 68 ex + 5 fiches |
| 4 | Maths D — mesures & données | Solides et volumes (15), Statistiques (15), Probabilités (15), Durées (8) | 53 ex + 4 fiches |
| 5 | Physique A — matière & lumière | La lumière (15), États de la matière (15), Mélanges et solutions (15), Masse et volume (8), Acidité et pH (8), Composition de l'air (8) | 69 ex + 6 fiches |
| 6 | Physique B — énergie & signaux | Le son (15), Électricité (15), Mouvement et vitesse (15), L'énergie (15), Le système solaire (9) | 69 ex + 5 fiches |
| 7 | Mixte | Vitesse et distances, Circuits et calculs, Solutions et proportionnalité, Lumière et géométrie, Son et fréquences, Énergie et puissances (6×15) | 90 ex (pas de fiches) |
| 8 | Transversal & bilan | Couverture programme, cohérence globale, bilan, bump version | — |

Une session = un lot complet. Si le contexte devient trop long avant la fin d'un lot, terminer le thème en cours, consigner précisément dans le suivi où on s'est arrêté (statut 🔶 + liste des thèmes faits), vérifier et commiter.

## Méthode de validation

### Pour chaque exercice
1. **Recalculer la réponse de façon indépendante AVANT de lire `a`** (poser le calcul dans le raisonnement, jamais dans le repo). Toute divergence = erreur à corriger.
2. `a` répond bien à la question posée, avec **toutes les étapes** et **l'unité** quand il y en a une.
3. `hint` est cohérent avec la méthode attendue et ne contient pas d'erreur ni ne dévoile la réponse.
4. `lvl` plausible : 1 = application directe, 2 = deux étapes, 3 = problème rédigé multi-étapes.
5. Énoncé soluble, non ambigu, données suffisantes.
6. Orthographe/grammaire française ; symboles Unicode cohérents (`−` pas `-` pour le moins, `×` pas `*`).
7. Physique : faits exacts et adaptés au niveau 5ème (v_lumière ≈ 300 000 km/s, v_son ≈ 340 m/s dans l'air, air ≈ 78 % N₂ / 21 % O₂, échelle pH 0–14, masse volumique de l'eau 1 g/cm³, ordre des planètes, etc.).

### Pour chaque fiche de cours

Une fiche = une entrée `CARDS.<matière>["<Thème>"]` dans `src/data/cards.js`, de la forme :

```js
"Fractions":{
  intro:"Phrase d'introduction du thème.",
  sections:[
    {h:"Titre de section", b:"Corps de texte (retours à la ligne en \\n)", kind:"method", fig:"fractionBar"},
    // kind (optionnel) : "method" | "example" | "warning" | "bonus" (= approfondissement hors 5ème)
    // fig (optionnel) : nom d'une figure SVG de src/figures/index.jsx
    // table (optionnel) : [["ligne1..."],["ligne2..."]]
  ],
  keypoints:["À retenir 1","À retenir 2","À retenir 3"]
}
```

Vérifier, dans l'ordre :
1. **Recalculer tous les exemples numériques**, chiffre par chiffre, dans `intro`, dans le `b` de CHAQUE section, et dans `keypoints`. Exemple d'erreur réelle trouvée en session 0 : la fiche Durées affirmait « 14h25 + 1h47 = 14h72 = 15h12 » — le bon calcul est 15h72 = 16h12. C'est ce niveau de relecture qui est attendu.
2. Chaque **définition et formule** est exacte (pas de simplification fausse, pas de notation abusive — ex. corrigé en session 0 : « p% = ×0,0p », faux dès que p ≥ 10).
3. Si la fiche a un `fig:`, le nom existe dans `src/figures/index.jsx` (les 19 références actuelles sont valides — revérifier seulement si on en modifie une).
4. Les `keypoints` résument fidèlement les sections (pas de contradiction, pas de formule qui n'apparaît nulle part).
5. Cohérence fiche ↔ exercices du même thème : mêmes méthodes, mêmes notations, mêmes formules.
6. **Appliquer le marquage programme** prévu pour ce module : colonne « Action » du tableau « Verdict par module » (plus bas), en suivant le « Mode d'emploi du marquage ». Si le module est ✅, il n'y a rien à marquer.

### Règles de correction
- Erreur de calcul/fait/typo → **corriger directement** + entrée au journal du suivi (avant → après).
- Exercice irrécupérable (énoncé insoluble) → le réécrire en conservant thème et niveau + journal.
- Doute pédagogique (niveau, formulation) → ne pas toucher, consigner dans « À arbitrer ».
- Manque de contenu (thème < 15 exercices, chapitre du programme absent) → consigner dans « Manques », **ne rien créer**.

### Session 8 — transversal
1. ~~Couverture programme~~ → **déjà faite en session 0** (voir section « Validation des fiches par rapport au programme » ci-dessous). Vérifier seulement que les marquages « approfondissement » demandés dans les sessions 1–6 ont bien été appliqués.
2. **Thèmes incomplets** à lister : Divisibilité (9 ex), Symétrie axiale (8), Durées (8), Masse et volume (8), Acidité et pH (8), Composition de l'air (8), Système solaire (9) — vs standard de 15.
3. Cohérence clés CARDS ↔ EXERCISES (les 6 thèmes mixtes n'ont pas de fiche : comportement attendu, vérifier que l'UI le gère).
4. Rédiger le **bilan final** dans `REVUE_CONTENU_SUIVI.md`.
5. Bumper `APP_VERSION` dans `src/constants.js`.

## Validation des fiches par rapport au programme — ✅ FAITE (session 0, 01/07/2026)

Références utilisées : **nouveau programme de mathématiques cycle 4 (BO du 5 mars 2026, applicable en 5ème à la rentrée 2026)** — en 5ème : relatifs (addition/soustraction), fractions (égalité, simplification, comparaison, addition/soustraction simples), priorités opératoires, initiation au calcul littéral (distributivité simple), équations `a+x=b` et `ax=b`, puissances **limitées au carré et au cube**, proportionnalité, statistiques (moyenne, fréquences, diagrammes), probabilités (équiprobabilité), repérage, symétrie centrale, angles et parallélisme, triangles (droites remarquables, inégalité triangulaire), parallélogrammes, prismes et cylindres, aires/durées/vitesse. Pour la **physique-chimie** : programme cycle 4 en vigueur + repères annuels de progression (le son détaillé, la composition de l'air et les lois électriques formalisées relèvent de la 4ème ; le pH de la 3ème).

### Mode d'emploi du marquage « approfondissement »

Principe : un contenu au-delà de la 5ème n'est **jamais supprimé** — il est signalé comme approfondissement. Trois cas :

**Cas 1 — marquer UNE SECTION** (le cas général) : passer `kind` à `"bonus"` (l'ajouter s'il est absent, remplacer `"method"`/`"example"`/`"warning"` s'il est présent) et préfixer le `b` par le bandeau suivi de `\n\n`. Bandeau exact : `▶ APPROFONDISSEMENT — VU EN 4e ◀` (ou `VU EN 3e` selon le niveau indiqué dans le tableau). Avant/après réel :

```js
// AVANT
{h:"Multiplication",kind:"method",b:"Numérateur × Numérateur\nDénominateur × Dénominateur\n..."}
// APRÈS
{h:"Multiplication",kind:"bonus",b:"▶ APPROFONDISSEMENT — VU EN 4e ◀\n\nNumérateur × Numérateur\nDénominateur × Dénominateur\n..."}
```

Modèles déjà en place dans `cards.js` : sections « Pythagore » (fiche Géométrie) et « Loi d'Ohm » (fiche Électricité) — s'y référer en cas de doute.

**Cas 2 — marquer un MODULE ENTIER** (uniquement « Composition de l'air », session 5) : préfixer `intro` par `▶ APPROFONDISSEMENT — VU EN 4e ◀ ` et ne pas toucher aux sections.

**Cas 3 — NE PAS TOUCHER** : fiches « Fonctions » et « Acidité et pH ». Elles sont en attente d'une décision utilisateur (section « À arbitrer » du suivi). Les valider pour l'exactitude uniquement — **aucun marquage, aucune restructuration**.

Cas particulier « Électricité » (session 6) : ne PAS mettre les sections « Circuit en série » et « Circuit en dérivation » en bonus — les circuits qualitatifs sont bien au programme de 5ème. Ajouter seulement, à la fin du `b` de chacune de ces deux sections : `\n\n(Les lois en formules — I₁=I₂, U=U₁+U₂… — sont formalisées en 4e.)`

Chaque marquage appliqué = une entrée dans le journal du suivi, préfixée « marquage programme : ».

### Verdict par module (fiches `cards.js`)

Légende : ✅ conforme 5ème (rien à marquer) · 🟡 sections précises à marquer (Cas 1) · 🔴 module entier en anticipation (Cas 2 ou Cas 3). La colonne « Session » indique QUI applique l'action ; les actions « bandeau » suivent le mode d'emploi ci-dessus.

| Module | Session | Verdict | Action à faire dans la session |
|---|---|---|---|
| Fractions | 1 | 🟡 | Cas 1, `VU EN 4e` sur les sections « Multiplication » et « Exemple » (la recette divise par une fraction = 4ème). |
| Nombres relatifs | 1 | 🟡 | Cas 1, `VU EN 4e` sur la section « Multiplication et division ». |
| Divisibilité | 1 | ✅ | Rien à marquer. |
| Puissances | 1 | 🟡 | Cas 1, `VU EN 4e` sur la section « Puissances de 10 » (notation scientifique et 10⁻ⁿ incluses). En 5ème (programme 2026) : carré et cube seulement — garder telles quelles les sections carrés/cubes et priorités. |
| Calcul littéral | 2 | 🟡 | Cas 1, `VU EN 4e` sur la section « Factoriser ». Le reste (distributivité simple, réduction, substitution) est conforme. |
| Équations | 2 | 🟡 | Cas 1, `VU EN 4e` sur la section « Équation à deux opérations » (2x+3=11). Les sections x+b=c et ax=c sont le cœur du programme 5ème 2026 — ne pas y toucher. |
| Proportionnalité | 2 | ✅ | Rien à marquer (« ×(1+p/100) » en légère avance : tolérable ; notation 0,0p déjà corrigée en session 0). |
| Fonctions | 2 | 🔴 | **Cas 3 — NE PAS TOUCHER** (notation f(x) = 3ème ; décision utilisateur en attente). Valider l'exactitude seulement. |
| Repérage | 3 | ✅ | Rien à marquer (formule du milieu en légère avance : tolérable). |
| Géométrie | 3 | 🟡 | Rien à marquer (Pythagore est déjà en bonus). Consigner dans « Manques » du suivi : inégalité triangulaire + construction de triangles (attendus 5ème absents). |
| Symétrie centrale | 3 | ✅ | Rien à marquer. |
| Symétrie axiale | 3 | ✅ | Rien à marquer (rappel 6ème, pertinent en révision). |
| Parallélogrammes | 3 | ✅ | Rien à marquer. |
| Solides et volumes | 4 | 🟡 | Rien à marquer (pavé/cube = rappel cycle 3, cylindre = 5ème). Consigner dans « Manques » : le prisme droit (représentation + volume, attendu 5ème). |
| Statistiques | 4 | 🟡 | Cas 1, `VU EN 4e` sur la section « Médiane ». Dans la section « Moyenne et étendue », marquer seulement la moyenne pondérée d'une parenthèse `(moyenne pondérée : vue en 4e)` — la moyenne simple et l'étendue restent 5ème. |
| Probabilités | 4 | ✅ | Rien à marquer (P(A ou B) incompatibles en légère avance : tolérable). |
| Durées | 4 | ✅ | Rien à marquer (erreur 14h25+1h47 déjà corrigée en session 0). |
| La lumière | 5 | 🟡 | Cas 1, `VU EN 4e` sur les sections « Réflexion » et « Réfraction ». Propagation, sources, ombres, éclipses = 5ème, ne pas toucher. |
| États de la matière | 5 | ✅ | Rien à marquer. |
| Mélanges et solutions | 5 | 🟡 | Rien à marquer (concentration c=m/V en légère avance : tolérable). Consigner dans « Manques » : solubilité/saturation (attendu 5ème absent). |
| Masse et volume | 5 | ✅ | Rien à marquer (ρ=m/V formalisée plutôt en fin de cycle : tolérable en révision). |
| Acidité et pH | 5 | 🔴 | **Cas 3 — NE PAS TOUCHER** (pH = 3ème ; décision utilisateur en attente). Valider l'exactitude seulement. |
| Composition de l'air | 5 | 🔴 | **Cas 2** : bandeau `VU EN 4e` en tête de l'`intro`, sections inchangées. |
| Le son | 6 | 🟡 | Cas 1, `VU EN 4e` sur les sections « Hauteur et fréquence » et « Intensité sonore ». Garder « Nature et propagation » telle quelle (sensibilisation 5ème). |
| Électricité | 6 | 🟡 | Cas particulier (voir mode d'emploi) : ajouter la parenthèse « lois formalisées en 4e » à la fin des sections « Circuit en série » et « Circuit en dérivation ». Ne PAS les passer en bonus. Loi d'Ohm déjà en bonus. |
| Mouvement et vitesse | 6 | ✅ | Rien à marquer. Consigner dans « Manques » : les interactions (actions de contact / à distance, thème 5ème « mouvement et interactions »). |
| L'énergie | 6 | ✅ | Rien à marquer. |
| Le système solaire | 6 | ✅ | Rien à marquer (rappel cycle 3 réinvesti en 5ème, thème Univers). |

> Les manques cités dans ce tableau sont **déjà consignés** dans `REVUE_CONTENU_SUIVI.md` (session 0) — ne pas les dupliquer ; ajouter seulement les manques NOUVEAUX découverts pendant la relecture.

### Manques par rapport au programme de 5ème (à lister, ne rien créer)

- **Maths** : fiche « Triangles » (inégalité triangulaire, constructions) ; volume du **prisme droit** ; fiche dédiée « Priorités opératoires / automatismes » (axe fort du programme 2026, aujourd'hui dispersé dans Puissances et Calcul littéral) ; notation **ratio** (a:b) ; algorithmique/Scratch (hors périmètre de l'appli — à acter).
- **Physique** : **interactions** (actions de contact et à distance) ; **solubilité/saturation** dans Mélanges et solutions.

## Déroulé d'une session

1. `git checkout fix/revue-contenu` ; lire ce fichier puis `REVUE_CONTENU_SUIVI.md` ; prendre la première session ⬜ (ou reprendre une session 🔶).
2. Valider le lot thème par thème (fiche puis exercices) selon la méthode ci-dessus, **et appliquer la colonne « Action » du tableau « Verdict par module » pour chaque module du lot** (bandeaux selon le mode d'emploi — sauf les modules « Cas 3 — NE PAS TOUCHER »).
3. Mettre à jour le suivi : statut ✅ (ou 🔶), journal des corrections, manques, à arbitrer.
4. Vérifications :
   - Parse : `node --input-type=module -e "const {EXERCISES}=await import('./src/data/exercises.js');const {CARDS}=await import('./src/data/cards.js');console.log(Object.keys(CARDS).length+' matieres CARDS OK, '+Object.values(EXERCISES).reduce((n,s)=>n+Object.values(s).flat().length,0)+' exercices')"` → attendu : 2 matières CARDS, 463 exercices (sauf réécritures signalées).
   - `npm run lint` et `npm test` (17/17 attendus — le contenu ne touche pas l'auth).
5. Commit sur `fix/revue-contenu` : `fix(contenu): revue session N — <lot>`.

## Fin du chantier (après session 8)

1. Toutes les sessions ✅ ; journal complet des corrections dans le suivi.
2. Lancer l'appli (`vercel dev` ou preview) : ouvrir 2–3 fiches corrigées et quelques exercices pour vérifier le rendu (symboles Unicode, figures).
3. PR `fix/revue-contenu` → `master` avec le bilan en description.
