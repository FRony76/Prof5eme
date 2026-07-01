# Amélioration des fiches de cours — rapport qualité + plan pour Sonnet

> **Prompt type à donner à Sonnet à chaque session :**
> Lis `PLAN_AMELIORATION_FICHES.md` à la racine. Exécute la prochaine session marquée ⬜ du tableau « Sessions », en suivant strictement le standard et les actions par fiche. Recalcule toi-même chaque exemple numérique que tu ajoutes. Termine par la mise à jour du tableau de suivi, les vérifications et le commit.

## Contexte

Le contenu des 31 fiches est **exact** (revue complète faite — voir `REVUE_CONTENU_SUIVI.md`) et conforme au programme. Ce chantier concerne uniquement la **qualité pédagogique et la présentation** : certaines fiches sont riches (méthodes, exemples concrets, mises en garde, figures), d'autres sont maigres (3 sections purement descriptives, sans exemple chiffré ni piège signalé). Objectif : amener toutes les fiches au niveau des meilleures.

## Le standard (issu du rapport qualité ci-dessous)

Une fiche au standard possède :
1. **4 à 5 sections** (ni plus ni moins — rester synthétique, chaque `b` ≤ ~12 lignes).
2. **≥ 1 section `kind:"example"`** : un exemple CONCRET et CHIFFRÉ de la vie courante, résolu pas à pas.
3. **≥ 1 mise en garde** : section `kind:"warning"` OU « erreur classique » explicite (montrer l'erreur ET la correction, comme « (−3)² = +9, pas −9 ! » dans Nombres relatifs).
4. **`fig:`** si une figure existante convient (voir liste ci-dessous — ne PAS créer de nouveau SVG, c'est un chantier séparé).
5. **`table:`** quand des données s'y prêtent (comparaisons, tableaux de valeurs) — voir Statistiques ou Proportionnalité.
6. **3 keypoints** exactement, actionnables (des règles à appliquer, pas des généralités).
7. Des **exemples numériques dans chaque section théorique** (pas de paragraphe purement descriptif).

**Fiches modèles à imiter** : `Fractions`, `Nombres relatifs` (maths) ; `Électricité` (physique) ; `Triangles`, `Priorités opératoires`, `Interactions` (créées au standard).

## Garde-fous (identiques à la revue de contenu)

- Ne modifier QUE `src/data/cards.js`. Ne PAS toucher `exercises.js` ni au `defis_apprentissage.jsx` racine (legacy).
- Ne pas changer le schéma `{intro, sections:[{h,b,kind?,fig?,table?}], keypoints}`. Texte brut + Unicode, pas de LaTeX.
- **Ne pas toucher aux bandeaux `▶ APPROFONDISSEMENT — VU EN 4e/3e ◀`** ni aux sections `kind:"bonus"` (les enrichir est interdit : elles sont hors programme). Ne pas dépasser le niveau 5ème dans les ajouts.
- Figures réutilisables UNIQUEMENT (existantes dans `src/figures/index.jsx`) : `fractionBar`, `droiteNombres`, `arbreFacteurs`, `repereXY`, `triangleAngles`, `anglesParalleles`, `symetrieCentrale`, `symetrieAxiale`, `parallelogramme`, `solidesPaveCube`, `cylindreFig`, `reflexion`, `etatsMatiereFig`, `masseVoluFig`, `echellePHFig`, `compositionAirFig`, `circuitSerieFig`, `circuitDerivFig`, `systemeSolaireFig`. Ne PAS créer de nouvelle figure.
- Chaque exemple numérique ajouté doit être **recalculé** avant écriture. Diffs minimaux : enrichir, pas réécrire ce qui est bon.

## Rapport qualité (évaluation du 01/07/2026, après revue complète)

Notes : **A** = au standard (ne pas toucher) · **B** = actions mineures · **C** = enrichissement nécessaire.

| Fiche | Note | Diagnostic et actions |
|---|---|---|
| Fractions | A | Modèle. RAS. |
| Nombres relatifs | A | Modèle (erreur classique exemplaire). RAS. |
| Divisibilité | A | RAS. |
| Puissances | A | RAS (warnings et exemples présents ; pas de figure adaptée existante). |
| Priorités opératoires | A | Créée au standard. RAS. |
| Calcul littéral | A | RAS. |
| Équations | A | RAS (vérification systématique = bon réflexe montré). |
| Proportionnalité | B | Manque une mise en garde. Ajouter une section `kind:"warning"` « Erreur classique » : deux réductions successives de 30% puis 20% ≠ 50% (reprendre l'exemple des soldes : ×0,7 puis ×0,8 = ×0,56, soit −44%). |
| Fonctions | C | 3 sections seulement, pas d'exemple dédié ni de piège. Ajouter : 1 section `kind:"example"` concrète (forfait téléphone ou location : calculer f(x) pour 2 valeurs), et 1 mise en garde « f(x) est une NOTATION, pas f×x ». ⚠ Ne pas dépasser le niveau actuel de la fiche (déjà en anticipation 3ème assumée). |
| Repérage | B | Pas de piège signalé. Ajouter une mise en garde « erreur classique » : (3;5) ≠ (5;3) — toujours abscisse d'abord (avec un exemple montrant les deux points placés différemment). |
| Géométrie | B | Dense mais sans exemple concret dédié. Ajouter une courte section `kind:"example"` (ex. : retrouver un angle avec somme = 180° et alternes-internes dans une figure de la vie courante, calcul chiffré). |
| Triangles | A | Créée au standard. RAS. |
| Symétrie centrale | B | Manque une mise en garde. Ajouter : erreur classique « ne pas confondre symétrie CENTRALE (demi-tour, figure retournée) et symétrie AXIALE (miroir) » avec un mini-exemple discriminant. |
| Symétrie axiale | A | RAS. |
| Parallélogrammes | B | Pas d'exemple concret. Ajouter une section `kind:"example"` chiffrée (ex. : périmètre + aire d'un parallélogramme donné, avec le piège de la hauteur ≠ côté oblique). |
| Solides et volumes | B | Pas d'exemple concret dédié. Ajouter une section `kind:"example"` (ex. : aquarium — volume, conversion en litres, hauteur d'eau). |
| Statistiques | B | Bon (table ✓). Ajouter un court exemple concret final (ex. : moyenne de la classe + angle d'un secteur, enchaînés sur les mêmes données). |
| Probabilités | A | RAS. |
| Durées | A | RAS (warnings + exemples présents). |
| La lumière | C | Cœur 5ème réduit à 2 sections (les 2 autres sont en bonus 4e). Ajouter : 1 section `kind:"example"` chiffrée (d = v×t : distance Terre-Lune ou orage éclair/tonnerre) et 1 mise en garde « lumière quasi instantanée vs son à 340 m/s ». Ne pas toucher aux sections bonus. |
| États de la matière | C | 3 sections descriptives. Ajouter : 1 `table` comparative (état / forme / volume / compressibilité), et 1 section `kind:"example"` (chauffage de 100 g de glace : paliers à 0°C et 100°C, masse conservée). |
| Mélanges et solutions | C | Pas d'exemple ni de piège. Ajouter : 1 section `kind:"example"` (calcul c = m/V complet) et 1 mise en garde « dissolution ≠ disparition : la masse se conserve (eau + sel : m_totale = m_eau + m_sel) ». |
| Masse et volume | B | Ajouter une section `kind:"example"` chiffrée (identifier un matériau par sa masse volumique : mesure éprouvette + calcul ρ + comparaison table). |
| Acidité et pH | C | 3 sections, pas de mise en garde sécurité. Ajouter : 1 section `kind:"warning"` sécurité (produits corrosifs pH proches de 0 ou 14 : gants, lunettes, jamais de mélange) et 1 exemple (dilution d'un acide → pH remonte vers 7). ⚠ Fiche en anticipation 3ème : garder le bandeau de l'intro, rester simple. |
| Composition de l'air | C | 3 sections, pas d'exemple chiffré. Ajouter 1 section `kind:"example"` (volumes d'O₂ et N₂ dans une pièce de 60 m³, calculs 21%/78%). ⚠ Garder le bandeau « VU EN 4e » de l'intro. |
| Le son | C | Cœur = 1 section (2 autres en bonus 4e). Ajouter : 1 section `kind:"example"` chiffrée avec d = v×t (écho ou orage : calcul complet) et 1 mise en garde « le son ne se propage PAS dans le vide, contrairement à la lumière ». Ne pas toucher aux sections bonus. |
| Électricité | A | Modèle physique (2 figs, warnings, bonus). RAS. |
| Mouvement et vitesse | C | 3 sections, pas de piège. Ajouter : 1 mise en garde « erreur classique » conversions (72 km/h = 20 m/s : ÷3,6, pas ÷60 !) et 1 section `kind:"example"` (problème complet : distance, temps, conversion). |
| Interactions | A | Créée au standard. RAS. |
| L'énergie | C | 3 sections sans exemple chiffré ni table. Ajouter : 1 `table` (forme d'énergie / exemple d'objet) OU une section exemple avec une chaîne énergétique complète chiffrée simple (ex. : vélo + dynamo + phare), et 1 mise en garde « l'énergie ne disparaît pas : les "pertes" sont de la chaleur ». |
| Le système solaire | B | Ajouter une courte mise en garde « erreur classique » : ne pas confondre étoile/planète/satellite, et rotation ≠ révolution (déjà en keypoint → l'illustrer d'une ligne dans une section existante suffit). |

**Synthèse** : 12 fiches A (rien à faire) · 9 fiches B (1 ajout ciblé chacune) · 10 fiches C (2 ajouts chacune, dont tables/examples).

## Sessions (à exécuter dans l'ordre — statuts : ⬜ à faire · 🔶 en cours · ✅ fait)

| # | Lot | Fiches | Statut | Date | Commit |
|---|-----|--------|--------|------|--------|
| Q1 | Physique C | États de la matière, Mélanges et solutions, Le son, Mouvement et vitesse, L'énergie, Acidité et pH, Composition de l'air | ✅ | 01/07/2026 | (voir git log) |
| Q2 | Maths C + B | Fonctions, La lumière*, Proportionnalité, Repérage, Géométrie, Symétrie centrale, Parallélogrammes | ✅ | 01/07/2026 | (voir git log) |
| Q3 | Finitions B + contrôle | Solides et volumes, Statistiques, Masse et volume, Le système solaire + relecture croisée de Q1/Q2 + bump `APP_VERSION` | ⬜ | | |

\* La lumière est classée avec Q2 pour équilibrer les lots (7 fiches chacun).

## Déroulé d'une session

1. `git checkout fix/revue-contenu` (ou la branche indiquée par l'utilisateur) ; lire ce fichier ; prendre la première session ⬜.
2. Pour chaque fiche du lot : appliquer EXACTEMENT les actions de la colonne « Diagnostic et actions » — rien de plus. Si une action semble inadaptée à la lecture de la fiche, la consigner dans « À arbitrer » de `REVUE_CONTENU_SUIVI.md` au lieu d'improviser.
3. Chaque exemple ajouté : concret, chiffré, recalculé, niveau 5ème.
4. Vérifications :
   - Parse : `node --input-type=module -e "const {CARDS}=await import('./src/data/cards.js');console.log(Object.keys(CARDS.maths).length+' fiches maths, '+Object.keys(CARDS.physique).length+' fiches physique')"` → attendu : 19 et 12.
   - `npm run lint` (0 erreur) et `npm test` (17/17).
5. Mettre à jour le tableau « Sessions » ci-dessus (statut, date, hash court du commit).
6. Commit : `feat(fiches): qualité session QN — <lot>`.

## Vérification finale (après Q3)

1. Toutes les fiches B/C ont leurs ajouts ; les fiches A et les sections bonus sont inchangées (vérifier au diff).
2. Chaque fiche a ≥1 exemple concret et ≥1 mise en garde ; aucune fiche ne dépasse 5 sections hors bonus.
3. Lancer l'appli (`vercel dev` ou preview) : ouvrir 3-4 fiches enrichies pour vérifier le rendu (tables, retours à la ligne, emojis).
4. Signaler la fin du chantier dans `REVUE_CONTENU_SUIVI.md` (bilan une ligne).
