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
1. Recalculer **tous les exemples numériques** de `intro`, `sections[].b` et `keypoints`.
2. Définitions et formules exactes et conformes au niveau 5ème (pas de simplification fausse).
3. `fig:` référencé existe dans `src/figures/index.jsx` (les 19 références actuelles sont valides — revérifier seulement si on modifie une référence).
4. `keypoints` cohérents avec le contenu des sections.
5. Cohérence fiche ↔ exercices du même thème (mêmes méthodes, mêmes notations).

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

**Convention de marquage** : pour les contenus au-delà de la 5ème, ne PAS supprimer — ajouter en tête du `b` de la section le bandeau `▶ APPROFONDISSEMENT — VU EN 4e ◀` (ou 3e) avec `kind:"bonus"`, comme le font déjà les sections « Pythagore » (Géométrie) et « Loi d'Ohm » (Électricité).

### Verdict par module (fiches `cards.js`)

Légende : ✅ conforme 5ème (RAS) · 🟡 sections à marquer/compléter (voir « À revoir ») · 🔴 module entier en anticipation.

| Module | Verdict | À revoir (à faire dans la session du lot) |
|---|---|---|
| Fractions | 🟡 | Section « Multiplication » + exemple « Recette » (division par une fraction) = 4ème → bandeau approfondissement. |
| Nombres relatifs | 🟡 | Section « Multiplication et division » = 4ème → bandeau (y compris la remarque (−3)² dans « Exemple »). |
| Divisibilité | ✅ | RAS. |
| Puissances | 🟡 | En 5ème (2026) : carré et cube seulement. Sections « Puissances de 10 » (dont notation scientifique et 10⁻ⁿ) = 4ème → bandeau. Garder carrés/cubes et priorités. |
| Calcul littéral | 🟡 | Section « Factoriser » (surtout 4x²+8x=4x(x+2)) = 4ème → bandeau. Distributivité simple, réduction, substitution : ✅. |
| Équations | 🟡 | `x+b=c` et `ax=c` = cœur 5ème 2026 ✅. Section « Équation à deux opérations » (2x+3=11) = 4ème → bandeau. |
| Proportionnalité | ✅ | RAS (« augmenter de p% → ×(1+p/100) » est en légère avance, tolérable ; notation `0,0p` corrigée en session 0). |
| Fonctions | 🔴 | Notation f(x) et lecture graphique = 3ème. → À arbitrer (voir suivi) : bandeau global ou recentrage sur « graphiques et proportionnalité » (5ème). Ne rien changer sans décision. |
| Repérage | ✅ | RAS (formule du milieu en légère avance, tolérable). |
| Géométrie | 🟡 | Contenu conforme, Pythagore déjà en bonus ✅. **Manque 5ème : inégalité triangulaire + construction de triangles** → consigner dans « Manques » (ne rien créer). |
| Symétrie centrale | ✅ | RAS. |
| Symétrie axiale | ✅ | Rappel 6ème, pertinent en révision. RAS. |
| Parallélogrammes | ✅ | RAS. |
| Solides et volumes | 🟡 | **Manque 5ème : le prisme droit** (représentation + volume) → « Manques ». Pavé/cube (rappel cycle 3) et cylindre ✅. |
| Statistiques | 🟡 | Sections « Médiane » et « moyenne pondérée » = 4ème → bandeau. Moyenne, fréquences, diagrammes ✅. |
| Probabilités | ✅ | RAS (P(A ou B) pour incompatibles en légère avance, tolérable). |
| Durées | ✅ | RAS (erreur 14h25+1h47 corrigée en session 0). |
| La lumière | 🟡 | Propagation, sources, ombres, éclipses ✅ 5ème. Sections « Réflexion » (loi i=r) et « Réfraction » = au-delà du collège courant → bandeau approfondissement. |
| États de la matière | ✅ | RAS. |
| Mélanges et solutions | 🟡 | ✅ 5ème dans l'ensemble. **Manque 5ème : solubilité/saturation** → « Manques ». (Concentration c=m/V en légère avance, tolérable.) |
| Masse et volume | ✅ | RAS (ρ=m/V formalisée plutôt en fin de cycle, tolérable en révision). |
| Acidité et pH | 🔴 | pH = 3ème (repères). → Bandeau global « APPROFONDISSEMENT — VU EN 3e » sur les sections, ou décision utilisateur (voir « À arbitrer »). |
| Composition de l'air | 🔴 | Composition de l'air = 4ème (repères). → Bandeau global « VU EN 4e ». |
| Le son | 🟡 | Signaux sonores détaillés (fréquence, vitesse, dB) = 4ème → bandeau sur « Hauteur et fréquence » et « Intensité sonore » ; garder « Nature et propagation » comme sensibilisation. |
| Électricité | 🟡 | Circuits série/dérivation qualitatifs ✅ 5ème. Lois formalisées I/U (I₁=I₂, U=U₁+U₂) = 4ème → mention dans les sections concernées ; loi d'Ohm déjà en bonus ✅. |
| Mouvement et vitesse | ✅ | RAS. **Manque 5ème (thème « mouvement ET interactions ») : actions de contact / à distance** → « Manques ». |
| L'énergie | ✅ | RAS. |
| Le système solaire | ✅ | Rappel cycle 3 réinvesti en 5ème (thème Univers) : pertinent. RAS. |

### Manques par rapport au programme de 5ème (à lister, ne rien créer)

- **Maths** : fiche « Triangles » (inégalité triangulaire, constructions) ; volume du **prisme droit** ; fiche dédiée « Priorités opératoires / automatismes » (axe fort du programme 2026, aujourd'hui dispersé dans Puissances et Calcul littéral) ; notation **ratio** (a:b) ; algorithmique/Scratch (hors périmètre de l'appli — à acter).
- **Physique** : **interactions** (actions de contact et à distance) ; **solubilité/saturation** dans Mélanges et solutions.

## Déroulé d'une session

1. `git checkout fix/revue-contenu` ; lire ce fichier puis `REVUE_CONTENU_SUIVI.md` ; prendre la première session ⬜ (ou reprendre une session 🔶).
2. Valider le lot thème par thème (fiche puis exercices) selon la méthode ci-dessus, **et appliquer les actions « À revoir » du tableau « Verdict par module » pour les modules du lot** (bandeaux approfondissement — sauf les cas « À arbitrer », à ne pas toucher).
3. Mettre à jour le suivi : statut ✅ (ou 🔶), journal des corrections, manques, à arbitrer.
4. Vérifications :
   - Parse : `node --input-type=module -e "const {EXERCISES}=await import('./src/data/exercises.js');const {CARDS}=await import('./src/data/cards.js');console.log(Object.keys(CARDS).length+' matieres CARDS OK, '+Object.values(EXERCISES).reduce((n,s)=>n+Object.values(s).flat().length,0)+' exercices')"` → attendu : 2 matières CARDS, 463 exercices (sauf réécritures signalées).
   - `npm run lint` et `npm test` (17/17 attendus — le contenu ne touche pas l'auth).
5. Commit sur `fix/revue-contenu` : `fix(contenu): revue session N — <lot>`.

## Fin du chantier (après session 8)

1. Toutes les sessions ✅ ; journal complet des corrections dans le suivi.
2. Lancer l'appli (`vercel dev` ou preview) : ouvrir 2–3 fiches corrigées et quelques exercices pour vérifier le rendu (symboles Unicode, figures).
3. PR `fix/revue-contenu` → `master` avec le bilan en description.
