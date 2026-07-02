# Revue du contenu — suivi

Instructions : voir `PLAN_REVUE_CONTENU.md`. Statuts : ⬜ à faire · 🔶 en cours (préciser les thèmes faits) · ✅ terminé.

## État des sessions

| # | Lot | Statut | Date | Erreurs corrigées | Commit |
|---|-----|--------|------|-------------------|--------|
| 0 | Validation des fiches vs programme officiel (28 fiches relues + verdicts dans le plan) | ✅ | 01/07/2026 | 2 | (voir git log) |
| 1 | Maths A — nombres (Fractions, Nombres relatifs, Divisibilité, Puissances) | ✅ | 01/07/2026 | 0 (44 exercices + 4 fiches conformes) | (voir git log) |
| 2 | Maths B — algèbre (Calcul littéral, Équations, Proportionnalité, Fonctions) | ✅ | 01/07/2026 | 0 (60 exercices + 4 fiches conformes) | (voir git log) |
| 3 | Maths C — géométrie (Repérage, Géométrie, Symétrie centrale, Symétrie axiale, Parallélogrammes) | ✅ | 01/07/2026 | 1 (énoncé ambigu réécrit) | (voir git log) |
| 4 | Maths D — mesures & données (Solides et volumes, Statistiques, Probabilités, Durées) | ✅ | 01/07/2026 | 1 (doublon de l'erreur Durées trouvé dans les exercices) | (voir git log) |
| 5 | Physique A — matière & lumière (Lumière, États de la matière, Mélanges, Masse et volume, Acidité et pH, Composition de l'air) | ✅ | 01/07/2026 | 0 (69 exercices + 6 fiches conformes) | (voir git log) |
| 6 | Physique B — énergie & signaux (Son, Électricité, Mouvement et vitesse, Énergie, Système solaire) | ✅ | 01/07/2026 | 1 (typo « merculienne » + phrase confuse) | (voir git log) |
| 7 | Mixte (6 thèmes, exercices uniquement) | ✅ | 01/07/2026 | 0 (90 exercices conformes) | (voir git log) |
| 8 | Transversal & bilan | ✅ | 01/07/2026 | 0 (vérifications transversales, aucune anomalie) | (voir git log) |
| 9 | Génération des manques (3 fiches, 3 sections, 92 exercices) | ✅ | 01/07/2026 | — | (voir git log) |
| Q1-Q3 | Amélioration qualité des fiches (`PLAN_AMELIORATION_FICHES.md`) : 19 fiches enrichies (9 B + 10 C), 12 fiches A inchangées, `APP_VERSION` → 2.3 | ✅ | 01/07/2026 | — | (voir git log) |

## Journal des corrections

Format : `- [<fichier> · <thème> · <repère>] erreur : … → correction : …`
(repère = `lvl` + début de `q` pour un exercice, ou `section "h"` pour une fiche)

- [cards.js · Durées · section "Calculs d'horaires"] erreur : « 14h25 + 1h47 = 14h72 = 15h12 » → correction : « = 15h72 = 16h12 » (session 0).
- [cards.js · Proportionnalité · section "Pourcentages" + keypoints] erreur : notation « p% = ×0,0p » fausse pour p ≥ 10 → correction : « p% de A = (p÷100)×A » (session 0).
- [cards.js · Fractions · section "Multiplication"] marquage programme : passage en `kind:"bonus"` + bandeau « VU EN 4e » (session 1).
- [cards.js · Fractions · section "Exemple" (recette, division par une fraction)] marquage programme : passage en `kind:"bonus"` + bandeau « VU EN 4e » (session 1).
- [cards.js · Nombres relatifs · section "Multiplication et division"] marquage programme : passage en `kind:"bonus"` + bandeau « VU EN 4e » (session 1).
- [cards.js · Puissances · section "Puissances de 10"] marquage programme : ajout `kind:"bonus"` + bandeau « VU EN 4e » (session 1).
- [cards.js · Calcul littéral · section "Factoriser"] marquage programme : passage en `kind:"bonus"` + bandeau « VU EN 4e » (session 2).
- [cards.js · Équations · section "Équation à deux opérations"] marquage programme : passage en `kind:"bonus"` + bandeau « VU EN 4e » (session 2).
- [exercises.js · Symétrie centrale · lvl2 "Un angle AOB mesure 70°..."] erreur : énoncé ambigu (mélange incohérent des noms de sommets « A'PB' » / « A'OB' », centre P non réutilisé correctement) → correction : réécriture avec un point O' (symétrique de O par P) et un angle A'O'B' cohérent (session 3).
- [exercises.js · Durées · lvl2 "Un bus part à 14h25..."] erreur : même bug que la fiche Durées (« 14h25+1h47=14h72=15h12 ») → correction : « 15h72=16h12 » (session 4).
- [cards.js · Statistiques · section "Médiane"] marquage programme : passage en `kind:"bonus"` + bandeau « VU EN 4e » (session 4).
- [cards.js · Statistiques · section "Moyenne et étendue"] marquage programme : ajout de la parenthèse « (moyenne pondérée : vue en 4e) » sur la ligne moyenne pondérée uniquement (session 4).
- [cards.js · La lumière · sections "Réflexion" et "Réfraction"] marquage programme : passage en `kind:"bonus"` + bandeau « VU EN 4e » (session 5).
- [cards.js · Composition de l'air · intro] marquage programme (Cas 2, module entier) : bandeau « VU EN 4e » ajouté en tête de l'intro (session 5).
- [exercises.js · Le système solaire · lvl3 "Mercure tourne autour du Soleil..."] erreur : coquille « merculienne » (×3, mot inexistant) au lieu de « mercurienne », et conclusion confuse « 4 années et 2 semaines merculiennes » → correction : orthographe uniformisée + phrase reformulée (« 4 années mercuriennes complètes, plus 13 jours terrestres ») (session 6).
- [cards.js · Le son · sections "Hauteur et fréquence" et "Intensité sonore"] marquage programme : passage en `kind:"bonus"` + bandeau « VU EN 4e » (session 6).
- [cards.js · Électricité · sections "Circuit en série" et "Circuit en dérivation"] marquage programme (cas particulier) : ajout de la parenthèse « lois formalisées en 4e » en fin de section, sans passage en bonus (session 6).

## Manques — ✅ TOUS GÉNÉRÉS (session 9, 01/07/2026)

Analyse programme faite en session 0, contenu créé en session 9 :
- **Maths** : ✅ fiche « Triangles » + 15 exercices ; ✅ fiche « Priorités opératoires » + 15 exercices ; ✅ section « Prisme droit » (fiche Solides et volumes) ; ✅ section « Notation ratio » (fiche Proportionnalité). Algorithmique/Scratch : acté hors périmètre de l'appli (définitivement).
- **Physique** : ✅ fiche « Interactions » + 15 exercices ; ✅ section « Solubilité et saturation » (fiche Mélanges et solutions).
- ✅ Thèmes complétés à 15 exercices : Divisibilité (+6), Symétrie axiale (+7), Durées (+7), Masse et volume (+7), Acidité et pH (+7), Composition de l'air (+7), Système solaire (+6).
- Nouveaux totaux : **31 fiches** (19 maths + 12 physique), **555 exercices** (37 thèmes × 15). `SUBS` (constants.js) mis à jour avec les 3 nouveaux thèmes — cohérence SUBS↔CARDS↔EXERCISES vérifiée par script.
- Les 6 thèmes mixtes n'ont pas de fiche de cours (comportement attendu, confirmé côté UI en session 8).

## Arbitrages (tranchés par l'utilisateur le 01/07/2026)

- **Fiche « Fonctions » (maths)** : gardée telle quelle (anticipation assumée sur la 3ème, aucune modification).
- **Fiche « Acidité et pH » (physique)** : bandeau « ▶ APPROFONDISSEMENT — VU EN 3e ◀ » ajouté en tête de l'intro (Cas 2, module entier — même traitement que Composition de l'air).
- **Fiche « Composition de l'air » (physique)** : bandeau « VU EN 4e » appliqué en session 5.

## Bilan final (session 8)

### Résumé du chantier

8 sessions exécutées sur `fix/revue-contenu` (branche partie de `master`). **463 exercices** et **28 fiches de cours** relus intégralement, chaque calcul recalculé de façon indépendante avant comparaison à la réponse fournie.

### Corrections effectuées (5 erreurs réelles trouvées et corrigées)

1. Fiche Durées : erreur de calcul horaire (14h25+1h47).
2. Fiche Proportionnalité : notation de pourcentage fausse pour p≥10.
3. Exercice Symétrie centrale (lvl2) : énoncé ambigu, réécrit.
4. Exercice Durées (lvl2, bus) : même bug horaire que la fiche, dupliqué dans les exercices — corrigé.
5. Exercice Le système solaire (lvl3) : coquille « merculienne »/« mercurienne » + phrase de conclusion confuse — corrigée.

Taux d'erreur constaté : 5 sur ~600 items (fiches + exercices), très majoritairement des exercices et fiches déjà exacts. Le contenu généré était globalement fiable.

### Marquages programme appliqués (13 sections + 1 module)

Conformément au tableau « Verdict par module » : Fractions (2 sections), Nombres relatifs (1), Puissances (1), Calcul littéral (1), Équations (1), Statistiques (1 section + 1 parenthèse), La lumière (2), Le son (2), Électricité (2 parenthèses, sans bonus) + Composition de l'air (bandeau module entier). Tous vérifiés présents dans `cards.js` en fin de chantier.

### Décisions en attente (non traitées, nécessitent ton arbitrage)

- **Fiche « Fonctions »** (maths) : notation f(x)/lecture graphique = programme de 3ème. Non touchée.
- **Fiche « Acidité et pH »** (physique) : le pH relève du programme de 3ème. Non touchée.
- Voir les options détaillées dans la section « À arbitrer » ci-dessus.

### Manques vs programme officiel (listés, rien créé — chantier séparé)

Maths : fiche Triangles (inégalité triangulaire, constructions), volume du prisme droit, fiche Priorités opératoires/automatismes, notation ratio, Scratch (hors périmètre appli).
Physique : interactions (contact/distance), solubilité/saturation.
Thèmes sous les 15 exercices standard : Divisibilité (9), Symétrie axiale (8), Durées (8), Masse et volume (8), Acidité et pH (8), Composition de l'air (8), Système solaire (9).

### Cohérence CARDS ↔ EXERCISES (vérifiée en session 8)

`CARDS` ne contient que `maths` et `physique` (pas de fiches pour les 6 thèmes `mixte`). Vérification du code : [CardsScreen.jsx](src/screens/CardsScreen.jsx) n'expose que les onglets `["maths", "physique"]` — le thème `mixte` n'est jamais utilisé pour indexer `CARDS`, aucun risque de crash. [BankScreen.jsx](src/screens/BankScreen.jsx) propose bien `["maths", "physique", "mixte"]` pour les exercices (`EXERCISES` a une clé `mixte`). Comportement du code cohérent, aucun correctif nécessaire.

### Vérifications finales

- Parse OK : 2 matières dans `CARDS`, 463 exercices dans `EXERCISES` (inchangé — aucune suppression/ajout, seulement 2 réécritures d'énoncés).
- `npm run lint` : 0 erreur (2 warnings préexistants, sans rapport avec le contenu).
- `npm test` : 17/17 verts à chaque session.
- `APP_VERSION` bumpée de "2.0" à "2.1" dans `src/constants.js`.
