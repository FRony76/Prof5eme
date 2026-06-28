# Plan — Transformer les fiches en cours condensés illustrés (programme 5e complet)

## Objectif

Les fiches actuelles (`CARDS`, 3-4 micro-cartes `{f, b}` de texte brut par thème) sont jugées trop succinctes. On les transforme en **cours condensés illustrés** : une mini-leçon scrollable par thème, structurée en sections, avec des **illustrations SVG** (figures géométriques, circuits, optique, schémas), et une couverture **complète du programme officiel de 5e**.

### Décisions validées
1. **Structure** : un cours condensé **par thème** (remplace la navigation carte-par-carte au sein d'un thème).
2. **Couverture** : compléter **tout le programme 5e manquant sauf l'algorithmique/Scratch**.
3. **Hors-programme** : conserver Pythagore et loi d'Ohm mais **signalés « approfondissement (4e) »**.
4. **Illustrations** : **SVG inline**, thématisables (couleur de la matière), aucun asset externe ni réseau — cohérent avec « pas de bibliothèque, mono-fichier, styles inline ».

---

## 1. Analyse de couverture vs programme officiel

Référence : attendus de fin de 5e / programme cycle 4 (Éduscol). Voir Sources en fin de document.

### Mathématiques

| Domaine / notion | État actuel | Action |
|---|---|---|
| Fractions (vocab, +, ×, comparer) | ✅ présent | Enrichir + illustrer |
| Nombres relatifs (+, –, valeur absolue) | ✅ présent | Enrichir + droite graduée |
| **Divisibilité, multiples, nombres premiers** | ❌ **manquant** | **Nouveau thème** |
| Calcul littéral (distributivité, réduire, substitution) | ✅ présent | Enrichir |
| Puissances (carré, cube) | ✅ présent | Garder (enrichissement) |
| Équations (x+b=c, ax=c) | ✅ présent | Enrichir |
| Proportionnalité (tableau, règle de 3, %) | ✅ présent | Enrichir + schéma |
| Fonctions (« en fonction de », tableau) | ✅ présent | Enrichir |
| Statistiques (effectifs, fréquences, moyenne, médiane) | ✅ présent | + diagrammes SVG |
| Probabilités (équiprobabilité) | ✅ présent | Enrichir |
| Repérage (droite graduée, plan) | ✅ présent | + repère SVG |
| Symétrie centrale | ✅ présent | + figure SVG |
| **Symétrie axiale** | ❌ **manquant** (seule la centrale) | **Nouveau thème** |
| Parallélogrammes | ✅ présent | + figure SVG |
| Géométrie (angles, // , triangles, droites remarquables, aires) | ✅ présent | + figures SVG |
| **Théorème de Pythagore** | ⚠️ présent mais **4e** | Garder, **badge « 4e »** |
| Solides et volumes (pavé, cube, cylindre) | ✅ présent | + perspective cavalière SVG |
| **Durées (grandeurs : temps, conversions h/min/s)** | ❌ **manquant** | **Nouveau thème** |
| Algorithmique / programmation (Scratch) | ❌ manquant | **Exclu** (décision) |

### Physique-Chimie

| Thème / notion | État actuel | Action |
|---|---|---|
| États de la matière + changements d'état | ✅ présent | + schéma molécules/cycle |
| Conservation de la masse | ✅ présent | Enrichir |
| **Masse et volume / masse volumique** | ❌ **manquant** (juste concentration) | **Nouveau thème** |
| Mélanges et solutions (homogène/hétérogène, séparations) | ✅ présent | + schéma béchers |
| **Acidité / pH** | ❌ **manquant** | **Nouveau thème** (échelle pH) |
| **Composition de l'air / l'atmosphère** | ❌ **manquant** | **Nouveau thème** (camembert) |
| La lumière (propagation, ombres, réflexion/réfraction) | ✅ présent | + schémas optiques SVG |
| Le son (nature, fréquence, intensité) | ✅ présent | + schéma onde |
| Électricité (série, dérivation) | ✅ présent | + schémas de circuits SVG |
| **Loi d'Ohm (U=R×I)** | ⚠️ présent mais **4e** | Garder, **badge « 4e »** |
| Mouvement et vitesse (trajectoire, v=d/t) | ✅ présent | + schémas |
| **Système solaire / mouvements dans l'Univers** | ❌ **manquant** | **Nouveau thème** (orbites) |
| L'énergie (sources, formes, renouvelable, chaîne) | ✅ présent | + chaîne énergétique SVG |

> **Nouveaux thèmes à créer** : Maths → *Divisibilité et nombres premiers*, *Symétrie axiale*, *Durées*. Physique → *Masse et volume*, *Acidité et pH*, *Composition de l'air*, *Le système solaire*.

---

## 2. Nouveau modèle de données

Remplacer `CARDS[subj][topic]` (tableau de `{f, b}`) par un **objet cours structuré** :

```js
CARDS.maths["Fractions"] = {
  intro: "Une fraction représente une part d'un tout ou un quotient.",   // optionnel
  sections: [
    { h: "Vocabulaire", b: "• Numérateur : …\n• Dénominateur : …", fig: "fractionBar" },
    { h: "Additionner (dénominateurs différents)", b: "1. …\n2. …", kind: "method" },
    { h: "Exemple", b: "1/3 + 1/4 = 4/12 + 3/12 = 7/12", kind: "example" },
    // kind ∈ "def" (défaut) | "method" | "example" | "warning" | "bonus"
    // fig  : clé dans le registre FIGURES (illustration SVG), ou absent
    // table: [["x","2","5"],["y","6","15"]]  → rendu en vrai tableau HTML (optionnel)
  ],
  keypoints: ["Toujours simplifier le résultat", "Multiplier : haut×haut, bas×bas"],  // encadré « À retenir »
};
```

- `kind` pilote un liseré / pictogramme (méthode 🛠️, exemple 💡, attention ⚠️, **bonus = badge « Approfondissement · 4e »**).
- `fig` référence une illustration (section 3). `table` permet un tableau propre (remplace l'ASCII art).
- Le contenu `b` reste **texte brut** (`whiteSpace: pre-wrap`) — pas de Markdown/HTML dans les données ; seules les **figures** sont du code.

---

## 3. Registre d'illustrations SVG (`FIGURES`)

Ajouter près des composants un registre de fonctions renvoyant du SVG, **paramétré par la couleur de la matière** pour rester thématisable :

```js
const FIGURES = {
  fractionBar:      (c) => (<svg viewBox="0 0 200 40" …>…</svg>),
  droiteGraduee:    (c) => (…),   // nombres relatifs
  repere:           (c) => (…),   // repère + point A(2;5)
  triangleAngles:   (c) => (…),   // somme = 180°
  anglesParalleles: (c) => (…),   // alternes-internes « Z »
  pythagore:        (c) => (…),   // triangle rectangle (bonus)
  parallelogramme:  (c) => (…),   // + diagonales
  symetrieCentrale: (c) => (…),   // A, O, A'
  symetrieAxiale:   (c) => (…),   // axe + A, A'
  solides:          (c) => (…),   // pavé + cube (perspective cavalière)
  cylindre:         (c) => (…),   // r, h
  diagrammeCirc:    (c) => (…),   // camembert stats
  arbreFacteurs:    (c) => (…),   // décomposition en facteurs premiers
  // — Physique —
  etatsMatiere:     (c) => (…),   // arrangement molécules solide/liquide/gaz
  changementsEtat:  (c) => (…),   // cycle fusion/vaporisation…
  melanges:         (c) => (…),   // béchers homogène vs hétérogène
  propagationLum:   (c) => (…),   // source + rayons droits
  ombres:           (c) => (…),   // objet, ombre portée, écran
  reflexion:        (c) => (…),   // miroir, i = r
  refraction:       (c) => (…),   // dioptre, rayon dévié
  onde:             (c) => (…),   // grave vs aigu (fréquence)
  circuitSerie:     (c) => (…),   // pile + 2 lampes en série
  circuitDeriv:     (c) => (…),   // 2 branches
  vitesse:          (c) => (…),   // v = d / t
  chaineEnergie:    (c) => (…),   // source → conversion → forme
  systemeSolaire:   (c) => (…),   // orbites Soleil-Terre-Lune
  masseVolumique:   (c) => (…),   // éprouvette + balance
  echellePH:        (c) => (…),   // bandeau pH 0-14 coloré
  compositionAir:   (c) => (…),   // camembert 78% N₂ / 21% O₂
};
```

Conventions SVG : `viewBox` responsive, `width:100%` + `max-width` ~320px, traits via `c.pri`, remplissages légers via `c.lit`/`c.med`, libellés en `font-size:11`. Aucune dépendance, aucun `<img>`.

> Une figure n'est ajoutée **que là où elle clarifie** (géométrie, optique, circuits, schémas). Les thèmes purement calculatoires peuvent n'avoir aucune `fig`.

---

## 4. Rendu : remplacer `FlashCard` par `CourseView`

### 4.1 Composant (remplace `FlashCard`, l.788-809)

```jsx
function CourseView({ course, c }) {
  return (
    <div style={{ background:"white", border:"1.5px solid #E5E7EB", borderRadius:12, padding:"1.5rem", display:"flex", flexDirection:"column", gap:18 }}>
      {course.intro && <p style={{ fontSize:14, lineHeight:1.7, color:"#374151", margin:0 }}>{course.intro}</p>}
      {course.sections.map((s, i) => (
        <section key={i} style={{ /* liseré selon s.kind */ }}>
          {s.h && <h3 style={{ fontSize:13, fontWeight:700, color:c.txt, margin:"0 0 6px" }}>{labelKind(s.kind)} {s.h}</h3>}
          <p style={{ fontSize:13.5, lineHeight:1.8, color:"#374151", margin:0, whiteSpace:"pre-wrap" }}>{s.b}</p>
          {s.table && <Table rows={s.table} c={c} />}
          {s.fig && FIGURES[s.fig] && <div style={{ marginTop:10 }}>{FIGURES[s.fig](c)}</div>}
          {s.kind === "bonus" && <span style={{ /* badge */ }}>Approfondissement · vu en 4e</span>}
        </section>
      ))}
      {course.keypoints?.length > 0 && (
        <div style={{ background:c.lit, border:`1.5px solid ${c.med}`, borderRadius:8, padding:"12px 14px" }}>
          <div style={{ fontSize:10, fontWeight:700, textTransform:"uppercase", letterSpacing:".12em", color:c.txt, marginBottom:6 }}>★ À retenir</div>
          <ul style={{ margin:0, paddingLeft:18, fontSize:13, color:c.txt, lineHeight:1.7 }}>
            {course.keypoints.map((k,i) => <li key={i}>{k}</li>)}
          </ul>
        </div>
      )}
    </div>
  );
}
```

Helpers : `labelKind(kind)` → pictogramme (🛠️ méthode, 💡 exemple, ⚠️ attention) ; petit composant `Table` rendant `rows` en `<table>` stylé (remplace l'ASCII art).

### 4.2 Écran `cards-view` (l.1170-1201)

- La pagination « Fiche x/N » et les boutons Précédente/Suivante **ne naviguent plus entre cartes** mais **entre thèmes** du sujet (`CARDS[cardsSubj]`). Réutiliser `cardIdx` comme **index de thème** ou introduire `topicIdx`.
- Afficher `<CourseView course={CARDS[cardsSubj][topic]} c={cp} />` en scroll vertical complet.
- En-tête : nom du thème + « Cours » ; supprimer les pastilles « fiche par fiche ».

### 4.3 Écrans `cards` (sélection) et accueil

- l.1210 sous-titre : « Question et cours… » → « Cours condensés et illustrés, un par thème ».
- l.1228 : `{CARDS[cardsSubj][t].length} fiches` (≠ valide sur objet) → afficher le **nombre de sections** : `{CARDS[cardsSubj][t].sections.length} sections`.
- l.1285 accueil : `Object.values(CARDS).flatMap(...).flat().length` (≠ valide) → recompter en sections : `…flatMap(s => Object.values(s)).reduce((n,c)=>n+c.sections.length,0)` et libellé « notions ».

> ⚠️ Tout code qui suppose un **tableau** de cartes (`.length`, `.flat()`, `cs[cardIdx]`) doit être adapté au nouveau modèle objet. Faire un repérage `CARDS[` complet avant de coder.

---

## 5. Contenu à produire

### 5.1 Réécrire les thèmes existants en cours condensés
Pour chaque thème actuel : fusionner les 3-4 cartes en **un cours** (intro + 4-7 sections def/method/example/warning + `keypoints`), enrichir le contenu (le rendre vraiment « condensé mais complet »), et **rattacher les figures** SVG pertinentes (cf. mapping §3).

### 5.2 Nouveaux thèmes (programme manquant, hors algorithmique)
- **Maths** : *Divisibilité et nombres premiers* (critères de divisibilité par 2,3,4,5,9,10 ; multiples/diviseurs ; nombres premiers ; décomposition — fig `arbreFacteurs`) · *Symétrie axiale* (axe, construction, propriétés conservées — fig `symetrieAxiale`) · *Durées* (unités h/min/s, conversions, calculs d'horaires).
- **Physique** : *Masse et volume* (mesures, unités, masse volumique ρ=m/V — fig `masseVolumique`) · *Acidité et pH* (échelle 0-14, acide/neutre/basique, indicateurs — fig `echellePH`) · *Composition de l'air* (≈78% N₂, 21% O₂… — fig `compositionAir`) · *Le système solaire* (Soleil, planètes, Terre-Lune, mouvements — fig `systemeSolaire`).

### 5.3 Bonus signalé (4e)
Marquer en `kind:"bonus"` la section *Théorème de Pythagore* (dans Géométrie) et le thème/section *Loi d'Ohm* (dans Électricité) → badge « Approfondissement · vu en 4e ».

---

## 6. Phasage (livraison incrémentale par Sonnet)

1. **Socle technique** : modèle objet + `CourseView` + `Table` + registre `FIGURES` (avec 4-5 figures pilotes) + adaptation des écrans/compteurs. Migrer **1 thème maths + 1 thème physique** pour valider de bout en bout.
2. **Migration du reste des thèmes existants** en cours condensés + figures.
3. **Nouveaux thèmes** du §5.2.
4. **Bonus signalé** (§5.3).

> **Cohérence quiz/banque (optionnel, à confirmer)** : les nouveaux thèmes de fiches n'existent pas dans `SUBS.topics`/`EXERCISES`. Pour éviter qu'un thème soit révisable mais pas « défiable », prévoir (phase ultérieure) de les ajouter à `SUBS.topics` + quelques `EXERCISES`. Hors périmètre strict de la demande (qui porte sur les fiches) — à décider.

---

## 7. Fichiers touchés

| Fichier | Nature |
|---|---|
| `defis_apprentissage.jsx` | `CARDS` (réécriture complète), `FIGURES` (nouveau), `CourseView`/`Table` (remplacent `FlashCard`), écrans `cards`/`cards-view`/accueil |
| `CONTRIBUTING.md` | Documenter le nouveau modèle de cours, le registre `FIGURES`, comment ajouter une section/figure |

Aucune modification serverless ni des prompts IA. `npm test` (couche auth) non concerné → doit rester 17/17.

---

## 8. Vérification

1. `npm run build` réussit (pas d'erreur JSX/SVG).
2. `vercel dev` + preview : pour **chaque thème** de maths et physique, le cours s'affiche, les figures se rendent (bonnes couleurs par matière), pas d'erreur console (`preview_console_logs`).
3. Navigation thème→thème fonctionne ; compteurs « sections »/« notions » corrects (plus de `.length` sur objet).
4. Badges « Approfondissement · 4e » visibles sur Pythagore et loi d'Ohm.
5. **Checklist de couverture** : cocher que chaque ligne du §1 (présent/nouveau) a bien son cours.
6. Responsive : `preview_resize` mobile → figures et tableaux ne débordent pas.

---

## Sources (programme officiel)
- [Mathématiques cycle 4 — ressources Éduscol](https://eduscol.education.fr/280/mathematiques-cycle-4)
- [Attendus de fin de 5e (fiche collège) — Éduscol](https://eduscol.education.fr/sites/default/files/2020-10/fiche-college-5e-1280087-pdf-1650.pdf)
- [Physique-chimie cycle 4 — ressources Éduscol](https://eduscol.education.fr/296/physique-chimie-cycle-4)
- [Repères annuels de progression / attendus de fin d'année — Éduscol](https://eduscol.education.fr/137/reperes-annuels-de-progression-et-attendus-de-fin-d-annee-du-cp-la-3e)
- [Synthèse chapitres BO maths & physique-chimie 5e — Hadamard](https://www.hadamard.fr/actualites/programme-maths-physique-5eme-college)

> Avant implémentation finale du contenu, recouper chaque nouveau thème avec le PDF officiel « Attendus de fin de 5e » d'Éduscol (le contenu de ce plan s'appuie sur les attendus cycle 4 / 5e et des synthèses BO).
