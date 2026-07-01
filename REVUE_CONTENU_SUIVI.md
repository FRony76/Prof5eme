# Revue du contenu — suivi

Instructions : voir `PLAN_REVUE_CONTENU.md`. Statuts : ⬜ à faire · 🔶 en cours (préciser les thèmes faits) · ✅ terminé.

## État des sessions

| # | Lot | Statut | Date | Erreurs corrigées | Commit |
|---|-----|--------|------|-------------------|--------|
| 0 | Validation des fiches vs programme officiel (28 fiches relues + verdicts dans le plan) | ✅ | 01/07/2026 | 2 | (voir git log) |
| 1 | Maths A — nombres (Fractions, Nombres relatifs, Divisibilité, Puissances) | ⬜ | | | |
| 2 | Maths B — algèbre (Calcul littéral, Équations, Proportionnalité, Fonctions) | ⬜ | | | |
| 3 | Maths C — géométrie (Repérage, Géométrie, Symétrie centrale, Symétrie axiale, Parallélogrammes) | ⬜ | | | |
| 4 | Maths D — mesures & données (Solides et volumes, Statistiques, Probabilités, Durées) | ⬜ | | | |
| 5 | Physique A — matière & lumière (Lumière, États de la matière, Mélanges, Masse et volume, Acidité et pH, Composition de l'air) | ⬜ | | | |
| 6 | Physique B — énergie & signaux (Son, Électricité, Mouvement et vitesse, Énergie, Système solaire) | ⬜ | | | |
| 7 | Mixte (6 thèmes, exercices uniquement) | ⬜ | | | |
| 8 | Transversal & bilan | ⬜ | | | |

## Journal des corrections

Format : `- [<fichier> · <thème> · <repère>] erreur : … → correction : …`
(repère = `lvl` + début de `q` pour un exercice, ou `section "h"` pour une fiche)

- [cards.js · Durées · section "Calculs d'horaires"] erreur : « 14h25 + 1h47 = 14h72 = 15h12 » → correction : « = 15h72 = 16h12 » (session 0).
- [cards.js · Proportionnalité · section "Pourcentages" + keypoints] erreur : notation « p% = ×0,0p » fausse pour p ≥ 10 → correction : « p% de A = (p÷100)×A » (session 0).

## Manques (à traiter dans un chantier séparé — ne rien créer)

Analyse programme faite en session 0 (référence : programme maths 2026 + repères physique-chimie ; détail dans `PLAN_REVUE_CONTENU.md`) :
- **Maths** : fiche « Triangles » (inégalité triangulaire, constructions — la fiche Géométrie ne couvre que angles et droites remarquables) ; volume du **prisme droit** (fiche Solides) ; fiche « Priorités opératoires / automatismes » ; notation **ratio** (a:b) ; algorithmique/Scratch (hors périmètre appli — à acter).
- **Physique** : **interactions** (actions de contact et à distance, thème « mouvement et interactions ») ; **solubilité/saturation** (fiche Mélanges et solutions).
- Thèmes avec moins de 15 exercices : Divisibilité (9), Symétrie axiale (8), Durées (8), Masse et volume (8), Acidité et pH (8), Composition de l'air (8), Système solaire (9).
- Les 6 thèmes mixtes n'ont pas de fiche de cours (comportement attendu, à confirmer côté UI en session 8).

## À arbitrer (doutes pédagogiques — ne pas modifier sans décision)

- **Fiche « Fonctions » (maths)** : la notation f(x) et la lecture graphique relèvent de la 3ème. Options : (a) bandeau « APPROFONDISSEMENT » global, (b) recentrer la fiche sur « graphiques et proportionnalité » (niveau 5ème), (c) garder telle quelle en anticipation assumée. Les 15 exercices du thème sont aussi concernés.
- **Fiche « Acidité et pH » (physique)** : le pH relève de la 3ème. Mêmes options (bandeau global / garder en anticipation assumée). Les 8 exercices du thème sont aussi concernés.
- **Fiche « Composition de l'air » (physique)** : relève de la 4ème — bandeau « VU EN 4e » prévu en session 5, sauf avis contraire.

## Bilan final (session 8)

_(à rédiger)_
