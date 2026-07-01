export const CARDS = {
  maths:{
    "Fractions":{
      intro:"Une fraction représente une partie d'un tout ou le quotient de deux entiers. On l'écrit a/b avec b ≠ 0.",
      sections:[
        {h:"Vocabulaire",b:"• Numérateur (en HAUT) : nombre de parts prises\n• Dénominateur (en BAS) : nombre de parts au total\n\nFraction irréductible : simplifiée au maximum, PGCD(a,b) = 1\nEx : 6/8 = 3/4 (÷2)  ;  12/18 = 2/3 (÷6)",fig:"fractionBar"},
        {h:"Addition et soustraction",kind:"method",b:"► Même dénominateur → opérer les numérateurs :\n   2/7 + 3/7 = 5/7\n\n► Dénominateurs différents :\n   1. Trouver le PPCM   2. Convertir   3. Additionner\n\nEx : 1/3 + 1/4\n   PPCM(3,4) = 12\n   1/3 = 4/12  et  1/4 = 3/12  →  7/12"},
        {h:"Multiplication",kind:"bonus",b:"▶ APPROFONDISSEMENT — VU EN 4e ◀\n\nNumérateur × Numérateur\nDénominateur × Dénominateur\n\n   2/3 × 4/5 = 8/15\n\n💡 Simplifier AVANT de multiplier si possible :\n   3/8 × 4/9 : 3 et 9 (÷3), 4 et 8 (÷4)  → 1/2 × 1/3 = 1/6"},
        {h:"Comparer deux fractions",kind:"method",b:"Méthode 1 — même dénominateur :\n   3/4 et 2/3 → 9/12 et 8/12 → 3/4 > 2/3\n\nMéthode 2 — produits croisés :\n   a/b ? c/d  : comparer a×d et b×c\n   3×3=9  et  4×2=8  →  9>8  →  3/4 > 2/3"},
        {h:"Exemple",kind:"bonus",b:"▶ APPROFONDISSEMENT — VU EN 4e ◀\n\nRecette pour 6 pers. : 3/4 L de lait.\nPour 8 pers. : 3/4 ÷ 6 × 8 = 3/4 × 8/6 = 24/24 = 1 L"}
      ],
      keypoints:["Simplifier le résultat final (chercher le PGCD)","Pour + et − : mettre au même dénominateur (PPCM)","Pour × : num×num, dén×dén (simplifier avant)"]
    },
    "Nombres relatifs":{
      intro:"Un nombre relatif est un nombre précédé d'un signe + ou −, indiquant sa position par rapport à zéro sur une droite graduée.",
      sections:[
        {h:"Définition et droite graduée",b:"• Signe + → à droite de zéro\n• Signe − → à gauche de zéro\n\nValeur absolue = distance à 0 (toujours positive)\n|−7| = 7   |+4| = 4   |0| = 0\n\nOrdre : −5 < −2 < 0 < +3 < +7",fig:"droiteNombres"},
        {h:"Addition",kind:"method",b:"Même signe → garder le signe + additionner :\n   (+4)+(+3) = +7\n   (−5)+(−2) = −7\n\nSignes différents → signe du plus grand |  |, soustraire :\n   (+7)+(−3) = +4   (7−3, positif l'emporte)\n   (−8)+(+5) = −3   (8−5, négatif l'emporte)"},
        {h:"Soustraction",kind:"method",b:"Règle : a − b = a + (−b)\nSoustraire = ajouter l'opposé\n\n   (+5)−(−3) = (+5)+(+3) = +8\n   (−2)−(+4) = (−2)+(−4) = −6\n   (−6)−(−9) = (−6)+(+9) = +3"},
        {h:"Multiplication et division",kind:"bonus",b:"▶ APPROFONDISSEMENT — VU EN 4e ◀\n\nSignes identiques → résultat POSITIF :\n   (−3)×(−4) = +12\n   (+6)×(+2) = +12\n\nSignes différents → résultat NÉGATIF :\n   (−3)×(+4) = −12\n   (+6)×(−2) = −12"},
        {h:"Exemple",kind:"example",b:"Température : −4°C le matin, hausse de 9°C\n→ −4 + 9 = +5°C\n\nErreur classique : (−3)² = (−3)×(−3) = +9 (pas −9 !)"}
      ],
      keypoints:["Valeur absolue = distance à 0, toujours ≥ 0","Pour la soustraction : ajouter l'opposé","Signes identiques × ou ÷ → positif ; différents → négatif"]
    },
    "Divisibilité":{
      intro:"La divisibilité permet de savoir si un entier peut être divisé par un autre sans reste. C'est la base de la décomposition en facteurs premiers.",
      sections:[
        {h:"Critères de divisibilité",b:"Par 2 → dernier chiffre pair (0,2,4,6,8)\nPar 3 → somme des chiffres divisible par 3\nPar 4 → deux derniers chiffres divisibles par 4\nPar 5 → se termine par 0 ou 5\nPar 9 → somme des chiffres divisible par 9\nPar 10 → se termine par 0\n\nEx : 756  →  7+5+6=18 (÷9 et ÷3 ✓)  ;  dernier chiffre 6 (÷2 ✓)"},
        {h:"Multiples et diviseurs",b:"Diviseurs de n = entiers qui divisent n sans reste\nMultiples de n = n×1, n×2, n×3…\n\nDiviseurs de 12 : 1, 2, 3, 4, 6, 12\nPGCD(a,b) = Plus Grand Commun Diviseur\nPPCM(a,b) = Plus Petit Commun Multiple\n\nEx : PGCD(12,18) = 6  ;  PPCM(4,6) = 12"},
        {h:"Nombres premiers",b:"Nombre premier = entier ≥ 2 divisible uniquement par 1 et lui-même.\n\nPremiers : 2, 3, 5, 7, 11, 13, 17, 19, 23…\n⚠ 1 N'EST PAS un nombre premier.\n2 est le seul nombre premier pair.\n\nTest : diviser par tous les premiers jusqu'à √n"},
        {h:"Décomposition en facteurs premiers",kind:"method",b:"Diviser par le plus petit premier possible, répéter.\n\nEx : 60\n60 ÷ 2 = 30\n30 ÷ 2 = 15\n15 ÷ 3 = 5  (premier → stop)\n\n60 = 2² × 3 × 5",fig:"arbreFacteurs"},
        {h:"Application : simplifier une fraction",kind:"example",b:"Simplifier 36/48 :\n36 = 2² × 3²\n48 = 2⁴ × 3\nPGCD(36,48) = 2² × 3 = 12\n36/48 = (36÷12)/(48÷12) = 3/4"}
      ],
      keypoints:["Mémoriser les critères de divisibilité par 2,3,4,5,9,10","Décomposer = produit de nombres premiers","PGCD sert à simplifier les fractions (PPCM pour le dénominateur commun)"]
    },
    "Puissances":{
      intro:"Une puissance note une multiplication répétée d'un même nombre par lui-même. Elle se lit « a exposant n ».",
      sections:[
        {h:"Définition",b:"aⁿ = a × a × a × … × a  (n fois)\na = base  ;  n = exposant\n\na² = carré de a  ;  a³ = cube de a\n\nEx : 5² = 25  ;  4³ = 64  ;  10³ = 1 000\n⚠ a² ≠ a×2  !  (5² = 25, pas 10)"},
        {h:"Carrés et cubes à connaître",b:"0²=0  1²=1  2²=4  3²=9  4²=16\n5²=25  6²=36  7²=49  8²=64  9²=81\n10²=100  11²=121  12²=144\n\nCubes : 2³=8  3³=27  4³=64  5³=125  10³=1000"},
        {h:"Priorités opératoires",kind:"warning",b:"Les puissances se calculent AVANT × ÷, qui se calculent AVANT + −.\n\n3 + 2² = 3 + 4 = 7        [pas (3+2)²]\n(3+2)² = 5² = 25\n2 × 3² = 2 × 9 = 18       [pas (2×3)²]\n(2×3)² = 6² = 36"},
        {h:"Puissances de 10",kind:"bonus",b:"▶ APPROFONDISSEMENT — VU EN 4e ◀\n\n10¹=10  10²=100  10³=1 000  10⁶=1 000 000\n\nNotation scientifique : 3×10⁴ = 30 000\n\nPuissances négatives :\n10⁻¹ = 0,1 = 1/10  ;  10⁻² = 0,01"},
        {h:"Exemple",kind:"example",b:"Pour x=3, calculer 2x² + x − 1\n= 2×9 + 3 − 1 = 18 + 3 − 1 = 20\n⚠ 2x² = 2×(x²), PAS (2x)²"}
      ],
      keypoints:["aⁿ = a multiplié n fois par lui-même","Puissances avant × ÷ + − (priorités)","Connaître les carrés de 0² à 12² par cœur"]
    },
    "Calcul littéral":{
      intro:"Le calcul littéral utilise des lettres (variables) pour généraliser des calculs et exprimer des relations entre grandeurs.",
      sections:[
        {h:"Distributivité simple",b:"k(a + b) = ka + kb\nk(a − b) = ka − kb\n\n3(x + 4) = 3x + 12\n2(3x − 1) = 6x − 2\n−2(x + 3) = −2x − 6\n−(x − 5) = −x + 5"},
        {h:"Réduire une expression",kind:"method",b:"Regrouper les termes semblables (même variable, même exposant)\n\n3x + 5 + 2x − 1 = (3x+2x)+(5−1) = 5x + 4\n4a + 3b − a + 2b = 3a + 5b\n\n⚠ x et x² ne sont PAS des termes semblables !"},
        {h:"Substitution numérique",kind:"method",b:"Remplacer la lettre par sa valeur, respecter les priorités.\n\nPour x=4 :\n2x + 3 = 2×4 + 3 = 11\nx² − 2x = 16 − 8 = 8\n\nPour a=−3 :\na² + a = 9 + (−3) = 6"},
        {h:"Factoriser",kind:"bonus",b:"▶ APPROFONDISSEMENT — VU EN 4e ◀\n\nFactoriser = mettre le facteur commun devant une parenthèse\n(inverse du développement)\n\n6x + 9 = 3(2x + 3)   [PGCD=3]\n4x² + 8x = 4x(x + 2) [PGCD=4x]"},
        {h:"Exemple complet",kind:"example",b:"Simplifier 3(2x−1) − 2(x+4)\n= 6x − 3 − 2x − 8\n= 4x − 11"}
      ],
      keypoints:["Développer : distribuer le facteur à chaque terme de la parenthèse","Réduire : regrouper les termes ayant la même variable et le même exposant","Substitution : remplacer la lettre, respecter les priorités opératoires"]
    },
    "Équations":{
      intro:"Une équation est une égalité contenant une inconnue. Résoudre, c'est trouver la valeur qui rend l'égalité vraie.",
      sections:[
        {h:"Vocabulaire",b:"• Équation : égalité avec une inconnue (souvent x)\n• Solution : valeur de x qui vérifie l'égalité\n• Vérification : remplacer x et contrôler des deux côtés\n\nEx : x + 5 = 12  →  x = 7  (7+5=12 ✓)"},
        {h:"Résoudre x + b = c",kind:"method",b:"Utiliser l'opération inverse (+) → (−)\n\nx + 8 = 15  →  x = 15 − 8 = 7\nVérif : 7 + 8 = 15 ✓\n\nx − 3 = 11  →  x = 11 + 3 = 14\nVérif : 14 − 3 = 11 ✓"},
        {h:"Résoudre ax = c",kind:"method",b:"Utiliser l'opération inverse (×) → (÷)\n\n4x = 28  →  x = 28 ÷ 4 = 7\nVérif : 4×7 = 28 ✓\n\nx/5 = 6  →  x = 6 × 5 = 30"},
        {h:"Équation à deux opérations",kind:"bonus",b:"▶ APPROFONDISSEMENT — VU EN 4e ◀\n\nD'abord déplacer le terme constant, puis le coefficient.\n\n2x + 3 = 11\n2x = 11 − 3 = 8\nx = 8 ÷ 2 = 4\nVérif : 2×4+3 = 11 ✓\n\n3x − 5 = 10  →  3x = 15  →  x = 5"},
        {h:"Mise en équation",kind:"example",b:"La somme de deux nombres consécutifs est 27.\nSoient n et n+1 ces nombres.\nn + (n+1) = 27  →  2n+1=27  →  2n=26  →  n=13\nLes nombres sont 13 et 14. Vérif : 13+14=27 ✓"}
      ],
      keypoints:["Opération inverse : +↔− et ×↔÷","Effectuer la même opération des deux côtés","Toujours vérifier la solution en substituant"]
    },
    "Proportionnalité":{
      intro:"Deux grandeurs sont proportionnelles si leurs valeurs ont toujours le même rapport (coefficient de proportionnalité).",
      sections:[
        {h:"Tableau de proportionnalité",b:"Coefficient k = y÷x (constant pour chaque colonne)",table:[["x","2","5","8"],["y","6","15","24"]],},
        {h:"Vérification et règle de trois",kind:"method",b:"Vérification : produits en croix égaux\n2×15 = 5×6 = 30 ✓\n\nRègle de trois (valeur manquante ?) :\n3 correspond à 5 ; ? correspond à 20\n3×20 = 5×?  →  ? = 60÷5 = 12"},
        {h:"Pourcentages",kind:"method",b:"p% de A = (p÷100)×A\n20% de 150 = 0,20×150 = 30\n\nAugmenter de p% → multiplier par (1 + p/100)\n   +15% → ×1,15  ;  200×1,15 = 230\n\nDiminuer de p% → multiplier par (1 − p/100)\n   −20% → ×0,80  ;  200×0,80 = 160"},
        {h:"Échelle et vitesse moyenne",kind:"example",b:"Carte à l'échelle 1/50 000\nDistance carte = 3 cm  →  Réelle = 3×50 000 = 1,5 km\n\nVitesse moyenne : v = d÷t (proportionnelle si v const)\n150 km en 2h → v = 75 km/h"}
      ],
      keypoints:["Coefficient k = y÷x (même pour toutes les colonnes)","Produits en croix pour vérifier ou trouver une valeur","p% de A = (p÷100)×A ; augmenter de p% = ×(1+p/100)"]
    },
    "Fonctions":{
      intro:"Une fonction décrit comment une grandeur dépend d'une autre. Elle associe à chaque valeur x une valeur unique y.",
      sections:[
        {h:"Notion de fonction",b:"f(x) = expression ; on dit y=f(x) ou 'y en fonction de x'\n\nEx : Prix du pain à 1,50€/kg\n→ P(m) = 1,5×m\nP(2) = 3€  (pour 2 kg, on paye 3€)\n\nTableau de valeurs :",table:[["x (kg)","0","1","2","4"],["y = P(x)","0€","1,50€","3€","6€"]]},
        {h:"Représentation graphique",b:"Dans un repère orthogonal :\n→ abscisse (x) : axe horizontal\n↑ ordonnée (y) : axe vertical\n\nPoint A(3;2) → avancer de 3 sur x, monter de 2 sur y\n\nFonction proportionnelle → droite passant par l'ORIGINE O",fig:"repereXY"},
        {h:"Lecture graphique",kind:"method",b:"Lire f(a) : tracer x=a, lire y sur la courbe\nRésoudre f(x)=b : tracer y=b, lire x sur la courbe\n\nEx : f(3) = ? → point de la courbe à x=3, lire y\nEx : f(x) = 6 → chercher x tel que la courbe atteint y=6"}
      ],
      keypoints:["f(x) = valeur de y pour l'entrée x","Graphique : point (x ; f(x)) dans le repère","Droite passant par O → situation proportionnelle (k = pente)"]
    },
    "Repérage":{
      intro:"Le repérage permet de localiser des points sur une droite (1D) ou dans un plan (2D) grâce à des coordonnées.",
      sections:[
        {h:"Droite graduée",b:"Origine O (abscisse 0), une unité, sens positif →\nAbscisse d'un point = sa position sur la droite\n\nPoint A d'abscisse 3,5 → entre 3 et 4, à mi-chemin\nPoint B d'abscisse −2 → à gauche de 0\n\nMilieu de [AB] : x_M = (x_A + x_B) ÷ 2"},
        {h:"Repère orthogonal",b:"Deux axes ⊥ qui se croisent en l'origine O(0;0)\n→ axe des abscisses (x, horizontal)\n↑ axe des ordonnées (y, vertical)\n\nPoint M(4;2) :\n1. Avancer de 4 sur x (horizontalement)\n2. Monter de 2 sur y (verticalement)",fig:"repereXY"},
        {h:"Placer et lire",kind:"method",b:"Placer A(3;−2) :\n→ aller à x=3 ; descendre de 2 (y négatif)\n\nLire un point P :\n→ verticale → lire x sur l'axe horizontal\n→ horizontale → lire y sur l'axe vertical"},
        {h:"Milieu d'un segment",kind:"method",b:"Milieu M de [AB], avec A(x₁;y₁) et B(x₂;y₂) :\n\nx_M = (x_A + x_B) ÷ 2\ny_M = (y_A + y_B) ÷ 2\n\nEx : A(2;4) et B(6;2) → M(4;3)"}
      ],
      keypoints:["On note toujours (abscisse ; ordonnée) = (x ; y)","Milieu : moyenne des abscisses et des ordonnées","Axe horizontal = x (abscisses) ; axe vertical = y (ordonnées)"]
    },
    "Géométrie":{
      intro:"La géométrie de 5e couvre les angles, les triangles, les droites parallèles et les formules d'aires et périmètres.",
      sections:[
        {h:"Angles dans un triangle",b:"La somme des angles d'un triangle vaut toujours 180°.\n\nÉquilatéral → 3 angles de 60°\nIsocèle → 2 angles égaux à la base\nRectangle → un angle de 90° ; les deux autres sont complémentaires (somme=90°)",fig:"triangleAngles"},
        {h:"Droites parallèles et angles",b:"Deux droites parallèles coupées par une sécante :\n\n• Angles alternes-internes : égaux (forme en Z)\n• Angles correspondants : égaux (même position, même côté)\n\nRéciproque : angles alternes-internes égaux → droites parallèles",fig:"anglesParalleles"},
        {h:"Droites remarquables du triangle",b:"Médiatrice d'un côté : ⊥ passant par son milieu\n→ les 3 médiatrices se croisent au centre du cercle circonscrit\n\nHauteur : ⊥ à un côté, passant par le sommet opposé\nMédiane : sommet → milieu du côté opposé\nBissectrice : divise un angle en 2 angles égaux"},
        {h:"Pythagore",kind:"bonus",b:"▶ APPROFONDISSEMENT — VU EN 4e ◀\nTriangle rectangle en C :\nAB² = AC² + BC²  (AB = hypoténuse)\n\nEx : AC=3, BC=4 → AB²=9+16=25 → AB=5\nRéciproque : si AB²=AC²+BC² → angle droit en C"},
        {h:"Aires et périmètres",kind:"method",b:"Rectangle : P=2(L+l)  A=L×l\nTriangle : A=(base×hauteur)÷2\nDisque : P=2πr  A=πr²\nParallélogramme : A=base×hauteur\n\n💡 La hauteur est TOUJOURS ⊥ à la base !"}
      ],
      keypoints:["Somme des angles d'un triangle = 180°","Angles alternes-internes égaux ↔ droites parallèles","Hauteur ⊥ à la base (pour les aires)"]
    },
    "Symétrie centrale":{
      intro:"La symétrie centrale (demi-tour) transforme un point en son image par rotation de 180° autour d'un centre O.",
      sections:[
        {h:"Définition",b:"O est le centre de symétrie.\nA' est le symétrique de A par rapport à O si O est le milieu de [AA'].\n\nConstruction :\n1. Tracer la droite (AO)\n2. Mesurer OA\n3. Placer A' de l'autre côté de O, à la même distance OA",fig:"symetrieCentrale"},
        {h:"Propriétés conservées",b:"La symétrie centrale conserve :\n✓ les longueurs (A'B' = AB)\n✓ les angles\n✓ les aires\n✓ le parallélisme\n\nLe symétrique d'un segment est un segment de même longueur, parallèle à l'original."},
        {h:"Construire le symétrique d'une figure",kind:"method",b:"Pour ABCD symétrique par rapport à O :\n→ construire A', B', C', D' (chacun avec O = milieu)\n→ A'B'C'D' est la figure image\n\nUn point situé sur O est son propre symétrique."},
        {h:"Exemple dans un repère",kind:"example",b:"A(2;3) symétrique par rapport à O(0;0) :\nO milieu de [AA'] → x_A' = 2×0−2 = −2 ; y_A' = 2×0−3 = −3\nA'(−2;−3)\nVérif : milieu de A(2;3) et A'(−2;−3) = ((2−2)/2;(3−3)/2) = (0;0) = O ✓"}
      ],
      keypoints:["O = milieu de [AA'] (condition fondamentale)","Conserve longueurs, angles, aires","Demi-tour de 180° autour de O"]
    },
    "Symétrie axiale":{
      intro:"La symétrie axiale transforme une figure en son image réfléchie par rapport à un axe (comme un miroir).",
      sections:[
        {h:"Définition",b:"d est l'axe de symétrie.\nA' est le symétrique de A par rapport à d si :\n→ d est la MÉDIATRICE du segment [AA']\n(d ⊥ [AA'] ET d passe par le milieu de [AA'])",fig:"symetrieAxiale"},
        {h:"Construction",kind:"method",b:"Pour construire A' symétrique de A par rapport à d :\n1. Tracer une perpendiculaire à d passant par A\n2. Mesurer la distance de A à d (pied H de la perp.)\n3. Reporter cette distance de l'autre côté de d\n→ A' est à la même distance de d que A"},
        {h:"Propriétés conservées",b:"La symétrie axiale conserve :\n✓ les longueurs\n✓ les angles\n✓ les aires\n✓ le parallélisme\n\nElle change l'orientation (gauche ↔ droite)\n\nUn point sur l'axe est son propre symétrique."},
        {h:"Axes de symétrie des figures",b:"Carré : 4 axes\nRectangle : 2 axes\nCercle : infinité d'axes\nTriangle équilatéral : 3 axes\nTriangle isocèle : 1 axe\nTriangle scalène : 0 axe"},
        {h:"Exemple",kind:"example",b:"A(1;3) symétrique par rapport à l'axe x=2 (vertical) :\nDistance de A à l'axe : 2−1 = 1\nx_A' = 2+1 = 3  ;  y_A' = 3 (inchangé pour axe vertical)\n→ A'(3;3)"}
      ],
      keypoints:["d est la médiatrice de [AA'] (⊥ + passe par le milieu)","Conserve longueurs, angles, aires (change l'orientation)","Un point sur l'axe est son propre symétrique"]
    },
    "Parallélogrammes":{
      intro:"Un parallélogramme est un quadrilatère dont les côtés opposés sont parallèles deux à deux.",
      sections:[
        {h:"Définition et propriétés",b:"ABCD parallélogramme ⟺ (AB ∥ DC) et (AD ∥ BC)\n\nConséquences :\n• AB = DC et AD = BC (côtés opposés de même longueur)\n• Â = Ĉ et B̂ = D̂ (angles opposés égaux)\n• Diagonales [AC] et [BD] se coupent en leur milieu I",fig:"parallelogramme"},
        {h:"Parallélogrammes particuliers",b:"RECTANGLE = parallélogramme + angle droit\n→ 4 angles droits, diagonales de même longueur\n\nLOSANGE = parallélogramme + 4 côtés égaux\n→ diagonales perpendiculaires (se coupent à 90°)\n\nCARRÉ = rectangle ET losange\n→ 4 côtés égaux, 4 angles droits, diagonales = et ⊥"},
        {h:"Aire",kind:"method",b:"Aire = base × hauteur\n⚠ La hauteur est PERPENDICULAIRE à la base\n(pas un côté oblique !)\n\nEx : base=8 cm, hauteur=5 cm → A=40 cm²\n\nRectangle : A = L×l  ;  Carré : A = c²"},
        {h:"Construire un parallélogramme",kind:"method",b:"Méthode des diagonales (la plus simple) :\nSi I = milieu de [AC], construire D tel que I = milieu de [BD]\n→ ABCD est un parallélogramme car ses diagonales se coupent en leur milieu."}
      ],
      keypoints:["Diagonales se coupent en leur milieu (propriété caractéristique)","Carré = rectangle + losange","Aire = base × hauteur (hauteur toujours ⊥ à la base)"]
    },
    "Solides et volumes":{
      intro:"Les solides sont des objets à trois dimensions. Leurs grandeurs sont le volume et l'aire (surface).",
      sections:[
        {h:"Pavé droit et cube",b:"Pavé droit (boîte) :\n• 6 faces rectangulaires, 12 arêtes, 8 sommets\nVolume V = L × l × h\n\nCube (cas particulier) :\n• 6 faces carrées identiques\nVolume V = c³\n\nEx : cube c=4 cm → V = 4³ = 64 cm³",fig:"solidesPaveCube"},
        {h:"Cylindre",b:"Volume = aire de la base × hauteur\nV = π × r² × h\n\nEx : r=3 cm, h=10 cm\nV = π×9×10 = 90π ≈ 282,7 cm³\n\n💡 Laisser 90π cm³ (exact) ou calculer avec π≈3,14",fig:"cylindreFig"},
        {h:"Unités et conversions",b:"Longueurs : km, m, dm, cm, mm (÷10)\nAires : km², m², dm², cm², mm² (÷100)\nVolumes : m³, dm³, cm³ (÷1 000)\n\nCapacités :\n1 m³ = 1 000 L  ;  1 dm³ = 1 L  ;  1 cm³ = 1 mL\n\nConversion volumes : ×1000 ou ÷1000 entre unités voisines"},
        {h:"Représentation cavalière",b:"La perspective cavalière représente les solides en 3D :\n• Arêtes visibles : trait plein\n• Arêtes cachées : trait pointillé\n• Arêtes parallèles restent parallèles sur le dessin\n• Angles de la face frontale conservés"}
      ],
      keypoints:["Pavé : V=L×l×h  ;  Cube : V=c³  ;  Cylindre : V=πr²h","1 dm³ = 1 L  ;  1 cm³ = 1 mL","×1000 ou ÷1000 entre unités de volume voisines"]
    },
    "Statistiques":{
      intro:"La statistique étudie des séries de données pour les organiser, les représenter et les résumer par des indicateurs.",
      sections:[
        {h:"Vocabulaire",b:"Population : ensemble étudié\nIndividu : élément de la population\nCaractère : ce qu'on observe (note, taille…)\nEffectif : nombre d'individus pour une modalité\nEffectif total N : nombre total\nFréquence = effectif ÷ N  (entre 0 et 1 ; ×100 pour %)"},
        {h:"Tableau d'effectifs et fréquences",b:"Exemple : 20 élèves notés",table:[["Note","10","14","16","Total"],["Effectif","4","8","8","20"],["Fréquence","0,20","0,40","0,40","1"]]},
        {h:"Moyenne et étendue",kind:"method",b:"Moyenne = somme des valeurs ÷ effectif total\n\nNotes 12,15,11,14,13 : (12+15+11+14+13)÷5 = 65÷5 = 13\n\nMoyenne pondérée : Σ(valeur × effectif) ÷ N (moyenne pondérée : vue en 4e)\n\nÉtendue = valeur max − valeur min"},
        {h:"Médiane",kind:"bonus",b:"▶ APPROFONDISSEMENT — VU EN 4e ◀\n\nMédiane = valeur qui partage la série ordonnée en 2 moitiés\n⚠ Toujours ORDONNER d'abord !\n\nN impair (n=5) : 5,7,9,12,15 → médiane = 9 (3e)\nN pair (n=4) : 4,6,8,10 → médiane = (6+8)÷2 = 7"},
        {h:"Diagrammes",b:"Barres (bâtons) : effectifs ou fréquences\nCirculaire : secteur → angle = fréquence × 360°\n   20% → 0,20×360° = 72°\nLigne (courbe) : évolution dans le temps"}
      ],
      keypoints:["Moyenne = somme ÷ N","Médiane : ordonner puis trouver la valeur centrale","Somme des fréquences = 1 (100%)"]
    },
    "Probabilités":{
      intro:"La probabilité mesure la chance qu'a un événement de se produire lors d'une expérience aléatoire (dont on ne peut pas prédire le résultat).",
      sections:[
        {h:"Vocabulaire",b:"Expérience aléatoire : résultat imprévisible\nIssue : un résultat possible\nUnivers Ω : ensemble de toutes les issues\nÉvénement A : sous-ensemble de Ω\n\nProbabilité : nombre entre 0 et 1\n• P(impossible) = 0\n• P(certain) = 1"},
        {h:"Calcul en équiprobabilité",kind:"method",b:"Équiprobabilité : toutes les issues ont la MÊME probabilité.\n\nP(A) = nombre d'issues favorables ÷ nombre d'issues possibles\n\nEx : dé à 6 faces\n   P(4) = 1/6\n   P(pair) = P({2,4,6}) = 3/6 = 1/2"},
        {h:"Fréquence et probabilité",b:"Fréquence = nb de fois où A s'est réalisé ÷ N total\n\nQuand N → grand, la fréquence → P(A)\n(loi des grands nombres)\n\nEx : pile/face lancé 1000 fois : la fréquence de 'pile' tend vers 0,5"},
        {h:"Événement complémentaire",kind:"method",b:"Ā (complémentaire de A) = 'A ne se réalise pas'\nP(Ā) = 1 − P(A)\n\nEx : P(ne pas obtenir 6) = 1 − 1/6 = 5/6\n\nA et B incompatibles → P(A ou B) = P(A) + P(B)"},
        {h:"Exemple",kind:"example",b:"Sac : 3 rouges, 5 bleues, 2 vertes (10 au total)\nP(rouge) = 3/10  ;  P(non rouge) = 7/10\nP(rouge ou verte) = 3/10 + 2/10 = 5/10 = 1/2"}
      ],
      keypoints:["P(A) = issues favorables ÷ issues possibles (équiprobabilité)","0 ≤ P(A) ≤ 1","P(Ā) = 1 − P(A)"]
    },
    "Durées":{
      intro:"La gestion des durées et conversions d'unités de temps est une compétence clé — attention, le temps n'est pas en base 10 !",
      sections:[
        {h:"Unités de temps",kind:"warning",b:"1 heure (h) = 60 minutes (min)\n1 minute (min) = 60 secondes (s)\n1 journée = 24 h  ;  1 semaine = 7 jours\n\n⚠ On N'écrit PAS 1h30 = 1,30h !\nC'est 1,5h (car 30min = 0,5h)"},
        {h:"Conversions",kind:"method",b:"h → min : × 60\nmin → h : ÷ 60 (quotient = h, reste = min)\n\nEx : 2h45min en minutes :\n2×60 + 45 = 165 min\n\nEx : 195 min en heures :\n195 ÷ 60 = 3 (h) reste 15 (min)\n→ 3h15min"},
        {h:"Calculs d'horaires",kind:"method",b:"Pour additionner des durées :\nEx : Film démarre à 14h25, dure 1h47\nFin = 14h25 + 1h47 = 15h72 = 16h12\n(car 72min = 1h12min)\n\nEx : Durée entre 9h15 et 11h40\n11h40 − 9h15 = 2h25min"},
        {h:"Vitesse et durée",b:"v = d ÷ t  (distance ÷ temps)\nÀ vitesse constante, distance et durée sont proportionnelles.\n\nEx : 300 km à 120 km/h\nt = d÷v = 300÷120 = 2,5h = 2h30min\n\nConversion : 1 m/s = 3,6 km/h  ;  1 km/h ≈ 0,278 m/s"}
      ],
      keypoints:["1h = 60min, 1min = 60s (base 60, pas base 10)","h→min : ×60  ;  min→h : ÷60 et regarder le reste","2h30min = 2,5h (et non 2,30h)"]
    }
  },
  physique:{
    "La lumière":{
      intro:"La lumière est une onde électromagnétique qui se propage en ligne droite dans un milieu homogène, avec ou sans matière (contrairement au son).",
      sections:[
        {h:"Propagation",b:"• Se propage EN LIGNE DROITE dans un milieu homogène (rectilinéarité)\n• Vitesse dans le vide : c = 3×10⁸ m/s = 300 000 km/s\n\nSource primaire (lumineuse) : émet sa propre lumière\n→ Soleil, ampoule, bougie, écran\n\nObjet diffusant (éclairé) : renvoie la lumière reçue\n→ Lune, feuille, mur"},
        {h:"Ombres et éclipses",b:"Ombre propre : zone sombre de l'objet lui-même\nOmbre portée : zone sombre projetée derrière l'objet\nPénombre : zone partiellement éclairée (source étendue)\n\nÉclipse de Soleil : Lune entre Terre et Soleil\n→ La Lune projette son ombre sur la Terre\n\nÉclipse de Lune : Terre entre Soleil et Lune\n→ La Lune entre dans l'ombre de la Terre"},
        {h:"Réflexion",kind:"bonus",b:"▶ APPROFONDISSEMENT — VU EN 4e ◀\n\nLa lumière rebondit sur une surface.\n\nLoi de la réflexion :\nangle d'incidence (i) = angle réfléchi (r)\n(mesurés par rapport à la NORMALE à la surface)\n\nMiroir plan (surface polie) → réflexion spéculaire\nSurface rugueuse → réflexion diffuse",fig:"reflexion"},
        {h:"Réfraction",kind:"bonus",b:"▶ APPROFONDISSEMENT — VU EN 4e ◀\n\nChangement de direction au passage d'un milieu transparent à un autre (air→eau, verre…)\n\n→ Se rapproche de la normale en entrant dans un milieu plus dense\n→ S'en éloigne en passant vers un milieu moins dense\n\nApplications : lunettes, lentilles, fibre optique"}
      ],
      keypoints:["Propagation rectiligne dans un milieu homogène","Réflexion : angle incident = angle réfléchi (par rapport à la normale)","Réfraction : changement de direction au passage entre deux milieux"]
    },
    "États de la matière":{
      intro:"La matière peut exister sous trois états selon l'arrangement et l'agitation de ses molécules.",
      sections:[
        {h:"Les trois états",b:"SOLIDE : forme ET volume fixes\n→ Molécules ordonnées, très proches, vibrant sur place\n\nLIQUIDE : volume fixe, forme variable (prend la forme du récipient)\n→ Molécules proches, désordonnées, glissant\n\nGAZ : forme ET volume variables (occupe tout l'espace)\n→ Molécules très éloignées, en mouvement rapide",fig:"etatsMatiereFig"},
        {h:"Changements d'état de l'eau",kind:"warning",b:"Fusion (solide→liquide) : 0°C\nSolidification (liquide→solide) : 0°C\nVaporisation (liquide→gaz) : 100°C\nLiquéfaction (gaz→liquide) : 100°C\nSublimation (solide→gaz directement)\n\n⚠ Température CONSTANTE pendant tout le changement d'état (palier)"},
        {h:"Conservation de la masse",b:"Lors d'un changement d'état, la MASSE est CONSERVÉE.\n\n1 kg de glace → 1 kg d'eau liquide → 1 kg de vapeur\n\nSeuls l'arrangement et l'agitation des molécules changent.\n⚠ Le VOLUME, lui, peut changer (glace moins dense que l'eau)."}
      ],
      keypoints:["Solide : forme ET volume fixes","Température constante pendant les changements d'état (palier)","Masse conservée lors d'un changement d'état"]
    },
    "Mélanges et solutions":{
      intro:"Un mélange est l'association de plusieurs substances. Il peut être homogène (une seule phase visible) ou hétérogène.",
      sections:[
        {h:"Types de mélanges",b:"Mélange HOMOGÈNE : une seule phase visible à l'œil nu\n→ Eau salée, eau sucrée, air, alliages (bronze=cuivre+étain)\n\nMélange HÉTÉROGÈNE : plusieurs phases visibles\n→ Eau + huile, eau + sable, vinaigrette, granit"},
        {h:"Solutions",b:"Solution = mélange homogène liquide\n\n• Solvant : ce qui dissout (souvent l'eau)\n• Soluté : ce qui se dissout\n• On dit que le soluté est dissous dans le solvant\n\nConcentration en masse : c = m ÷ V\n   m en g, V en L → c en g/L\n\nEx : 20g de sel dans 0,5 L → c = 20÷0,5 = 40 g/L"},
        {h:"Techniques de séparation",kind:"method",b:"Filtration → solides NON dissous (sable dans l'eau)\n\nDécantation → laisser sédimenter (eau+huile : l'huile monte)\n\nÉvaporation → éliminer le solvant (eau salée → sel)\n\nDistillation → séparer deux liquides de températures d'ébullition différentes\n\nChromatographie → séparer les colorants (feutres sur papier)"}
      ],
      keypoints:["Homogène = 1 seule phase visible ; Hétérogène = plusieurs phases","Solution = solvant + soluté dissous","Concentration c = m÷V en g/L"]
    },
    "Masse et volume":{
      intro:"Masse et volume sont deux grandeurs fondamentales de la matière. Leur rapport définit la masse volumique, qui détermine si un objet flotte.",
      sections:[
        {h:"Mesurer la masse",kind:"warning",b:"La masse se mesure avec une balance (g, kg, t).\n1 kg = 1000 g  ;  1 t = 1000 kg\n\n⚠ Masse ≠ Poids !\n• La masse est identique partout (Terre, Lune, ISS)\n• Le poids est une force (dépend de la gravité) → en Newtons"},
        {h:"Mesurer le volume",b:"Volume d'un liquide : éprouvette graduée\n→ Lire au BAS du ménisque (courbure de la surface)\nUnités : L, mL, cm³  ;  1 L = 1000 mL = 1000 cm³\n\nVolume d'un solide irrégulier :\n1. Verser eau dans éprouvette : lire V₁\n2. Plonger le solide : lire V₂\n3. Volume = V₂ − V₁",fig:"masseVoluFig"},
        {h:"Masse volumique",kind:"method",b:"ρ = m ÷ V\nρ (rho) en g/cm³ ou g/mL ou kg/L\nm en g (ou kg)  ;  V en cm³ (ou mL ou L)\n\nEx : ρ(eau) = 1 g/cm³ (référence)\nEx : ρ(fer) ≈ 7,9 g/cm³\nEx : ρ(huile) ≈ 0,9 g/cm³"},
        {h:"Flottabilité",b:"Un objet flotte si sa masse volumique est INFÉRIEURE à celle du liquide.\n\nρ_objet < ρ_liquide → FLOTTE\nρ_objet > ρ_liquide → COULE\n\nEx : bois (0,6 g/cm³) flotte sur eau (1 g/cm³)\nEx : fer (7,9 g/cm³) coule dans l'eau"}
      ],
      keypoints:["ρ = m÷V en g/cm³ (masse volumique)","ρ(eau) = 1 g/cm³ (valeur de référence)","ρ_objet < ρ_liquide → flotte ; ρ_objet > ρ_liquide → coule"]
    },
    "Acidité et pH":{
      intro:"Le pH est une grandeur sans unité qui mesure l'acidité ou la basicité d'une solution aqueuse, sur une échelle de 0 à 14.",
      sections:[
        {h:"L'échelle de pH",b:"pH < 7 : solution ACIDE (plus c'est bas, plus c'est acide)\npH = 7 : solution NEUTRE (eau pure à 25°C)\npH > 7 : solution BASIQUE (alcaline)\n\n⚠ L'échelle est logarithmique : pH 5 est 10× plus acide que pH 6",fig:"echellePHFig"},
        {h:"Exemples courants",b:"pH ≈ 1-2 : acide chlorhydrique, suc gastrique\npH ≈ 3 : jus de citron, vinaigre\npH ≈ 5 : café, pluie acide normale\npH ≈ 7 : eau pure, eau du robinet\npH ≈ 9 : bicarbonate de soude\npH ≈ 11 : ammoniaque\npH ≈ 14 : soude concentrée (NaOH)"},
        {h:"Mesurer le pH",kind:"method",b:"Papier pH universel :\n→ Déposer une goutte de solution, comparer à la charte colorée\n→ Précision ≈ 1 unité de pH\n\npHmètre électronique :\n→ Bien plus précis (~0,01 unité)\n→ Nécessite étalonnage avec solutions tampons connues\n\nIndicateurs colorés (BBT, phénolphtaléine…) : virent à une couleur selon le pH"}
      ],
      keypoints:["pH < 7 = acide  ;  pH = 7 = neutre  ;  pH > 7 = basique","pH de l'eau pure = 7","Plus le pH est faible, plus la solution est acide"]
    },
    "Composition de l'air":{
      intro:"▶ APPROFONDISSEMENT — VU EN 4e ◀ L'air est un mélange gazeux homogène composé principalement de diazote (78%) et de dioxygène (21%).",
      sections:[
        {h:"Composition de l'air sec",b:"L'air est un MÉLANGE HOMOGÈNE de gaz.\n\nComposition approximative en volume :\n• Diazote N₂ : 78%\n• Dioxygène O₂ : 21%\n• Argon Ar et autres gaz rares : ~1%\n• Dioxyde de carbone CO₂ : ~0,04%\n\n⚠ L'air est un mélange, pas un corps pur",fig:"compositionAirFig"},
        {h:"Rôle des composants",b:"Dioxygène (O₂) :\n→ Indispensable à la respiration des êtres vivants\n→ Nécessaire à la combustion (feu)\n\nDiazote (N₂) :\n→ Gaz inerte (réagit peu), dilue le dioxygène\n→ Evite la combustion spontanée des matières\n\nDioxyde de carbone (CO₂) :\n→ Produit par respiration et combustions\n→ Utilisé par les plantes (photosynthèse)\n→ Gaz à effet de serre"},
        {h:"Propriétés physiques",b:"Transparent et incolore\nMasse volumique : ρ(air) ≈ 1,2 g/L à 20°C\n(bien moins dense que l'eau : 1 000 g/L)\n\nL'air se comprime facilement (état gazeux)\n\nAir humide : contient aussi de la vapeur d'eau H₂O\n(proportion variable = humidité relative)"}
      ],
      keypoints:["Air = 78% N₂ + 21% O₂ + ~1% autres gaz","O₂ : respiration + combustion","L'air est un mélange homogène, pas un corps pur"]
    },
    "Le son":{
      intro:"Le son est une vibration mécanique qui se propage dans la matière. Contrairement à la lumière, il ne se propage PAS dans le vide.",
      sections:[
        {h:"Nature et propagation",b:"Le son = vibration qui comprime/dilate le milieu alternativement\n\nVitesse de propagation (à 20°C) :\n→ Dans l'air : v ≈ 340 m/s\n→ Dans l'eau : v ≈ 1500 m/s (plus rapide)\n→ Dans les solides : encore plus rapide\n\n⚠ Dans le vide : v = 0 (ne se propage pas)\nFormule clé : d = v × t"},
        {h:"Hauteur et fréquence",b:"Fréquence f (en Hertz Hz) = nombre de vibrations par seconde\n\nSon GRAVE ↔ faible fréquence (f < ~300 Hz)\nSon AIGU ↔ haute fréquence (f > ~2000 Hz)\n\nDomaine audible humain : 20 Hz à 20 000 Hz\nInfrasons : f < 20 Hz (inaudibles)\nUltrasons : f > 20 000 Hz (inaudibles, médecine, sonar)"},
        {h:"Intensité sonore",kind:"warning",b:"Intensité mesurée en décibels (dB)\n\n0 dB → seuil d'audibilité\n30 dB → bibliothèque, chuchotement\n60 dB → conversation normale\n85 dB → seuil de risque (exposition longue → surdité)\n110 dB → concert, klaxon\n120 dB → seuil de douleur\n\n⚠ Porter des protections au-delà de 85 dB prolongé !"}
      ],
      keypoints:["Son = vibration mécanique (impossible dans le vide)","Fréquence en Hz : grave = faible f, aigu = haute f","d = v × t  ;  v ≈ 340 m/s dans l'air"]
    },
    "Électricité":{
      intro:"Un circuit électrique doit être FERMÉ pour que le courant circule. Les dipôles peuvent être en série ou en dérivation (parallèle).",
      sections:[
        {h:"Circuit en série",kind:"warning",b:"Tous les dipôles dans UNE seule boucle.\n\nLoi des intensités : I identique partout\n   I₁ = I₂ = I\n\nLoi des tensions : U se répartit\n   U = U₁ + U₂ + …\n\n⚠ Un dipôle défaillant → circuit ouvert → TOUT s'éteint !",fig:"circuitSerieFig"},
        {h:"Circuit en dérivation",b:"Des dipôles sur des branches PARALLÈLES.\n\nLoi des tensions : U identique dans chaque branche\n   U₁ = U₂ = U\n\nLoi des intensités : I se répartit\n   I = I₁ + I₂ + …\n\n✓ Un dipôle défaillant → les autres continuent !",fig:"circuitDerivFig"},
        {h:"Loi d'Ohm",kind:"bonus",b:"▶ APPROFONDISSEMENT — VU EN 4e ◀\n\nU = R × I\n\nU : tension en Volts (V)\nR : résistance en Ohms (Ω)\nI : intensité en Ampères (A)\n\nEx : R=100 Ω, I=0,06 A → U = 100×0,06 = 6 V"},
        {h:"Sécurité",kind:"warning",b:"Réseau domestique = 230 V → DANGEREUX\n\nProtections :\n• Fusible : fond si courant trop fort (à remplacer)\n• Disjoncteur : se déclenche (réarmable)\n• Prise de terre : évacue les fuites de courant\n\nNe JAMAIS toucher les fils sous tension !"}
      ],
      keypoints:["Série : I identique partout, tensions s'additionnent","Dérivation : U identique dans chaque branche, I s'additionne","Un dipôle défaillant en série coupe tout ; en dérivation, laisse le reste fonctionner"]
    },
    "Mouvement et vitesse":{
      intro:"Un mouvement se décrit par sa trajectoire et sa vitesse, par rapport à un observateur choisi (référentiel). Le mouvement est relatif.",
      sections:[
        {h:"Décrire un mouvement",b:"Trajectoire : chemin décrit dans l'espace\n→ Rectiligne (droite)  ;  Circulaire (cercle)  ;  Curviligne (courbe)\n\nLe mouvement est RELATIF au référentiel :\nEx : passager dans un train = immobile/train, en mouvement/sol"},
        {h:"Vitesse moyenne",kind:"method",b:"v = d ÷ t\n\nv : vitesse (m/s ou km/h)\nd : distance parcourue (m ou km)\nt : durée (s ou h)\n\nEx : 150 m en 10 s → v = 150÷10 = 15 m/s\nEx : 300 km en 2,5 h → v = 300÷2,5 = 120 km/h\n\nConversions :\n1 m/s = 3,6 km/h  ;  1 km/h ≈ 0,278 m/s"},
        {h:"Types de mouvement",b:"Mouvement UNIFORME : vitesse constante\n→ graphe d=f(t) = droite passant par l'origine\n→ proportionnalité entre d et t\n\nMouvement ACCÉLÉRÉ : vitesse qui augmente\nMouvement DÉCÉLÉRÉ : vitesse qui diminue"}
      ],
      keypoints:["v = d÷t (vitesse = distance ÷ temps)","1 m/s = 3,6 km/h","Mouvement uniforme → d proportionnel à t"]
    },
    "L'énergie":{
      intro:"L'énergie est ce qui permet de réaliser un travail ou de produire un effet. Elle se conserve, se convertit et se transfère sous différentes formes.",
      sections:[
        {h:"Formes d'énergie",b:"• Mécanique (cinétique = mouvement + potentielle = altitude)\n• Thermique (chaleur)\n• Lumineuse (rayonnement, photons)\n• Électrique (courant)\n• Chimique (liaisons moléculaires : aliments, piles, combustibles)\n• Nucléaire (noyaux atomiques)\n• Rayonnante (ondes électromagnétiques, solaire)"},
        {h:"Sources d'énergie",b:"RENOUVELABLES (se reconstituent naturellement) :\n→ Solaire, éolien, hydraulique, géothermique, biomasse\n\nNON RENOUVELABLES (s'épuisent) :\n→ Charbon, pétrole, gaz naturel (fossiles)\n→ Uranium (nucléaire)"},
        {h:"Chaîne énergétique",b:"SOURCE → CONVERTISSEUR → FORME UTILE\n\nEx : panneau solaire\n[Lumineuse] → [Cellule photovoltaïque] → [Électrique]\n\nEx : centrale thermique au gaz\n[Chimique] → [Combustion→Turbine] → [Électrique]\n\n💡 L'énergie TOTALE se conserve — mais une partie se dissipe en chaleur (pertes)"}
      ],
      keypoints:["L'énergie se conserve (ne se crée ni ne se détruit)","Renouvelables : solaire, éolien, hydraulique… / Non renouvelables : fossiles, uranium","Chaîne : source → convertisseur → forme utile (avec pertes thermiques)"]
    },
    "Le système solaire":{
      intro:"Le système solaire est composé du Soleil et de l'ensemble des objets qui gravitent autour de lui sous l'effet de la gravité.",
      sections:[
        {h:"Le Soleil et les planètes",b:"Le Soleil = ÉTOILE (source primaire de lumière) au centre.\n\nLes 8 planètes, en ordre de distance :\nMercure · Vénus · Terre · Mars (rocheuses, telluriques)\nJupiter · Saturne · Uranus · Neptune (gazeuses géantes)\n\nMoyen mnémotechnique :\nMon Vieux Tu M'as Joué Souvent Un Numéro",fig:"systemeSolaireFig"},
        {h:"Révolution et rotation",b:"RÉVOLUTION = déplacement autour du Soleil\n→ La Terre met ~365,25 jours (1 an)\n→ La Lune fait une révolution autour de la Terre en ~27 jours\n\nROTATION = rotation sur elle-même\n→ La Terre tourne en 24 h (jours et nuits)\n→ Axe incliné → saisons"},
        {h:"La Lune et les éclipses",b:"La Lune = satellite naturel de la Terre\n(ne produit pas sa propre lumière → objet diffusant)\n\nÉclipse de Soleil :\nLune entre Soleil et Terre → ombre de la Lune sur la Terre\n\nÉclipse de Lune :\nTerre entre Soleil et Lune → Lune dans l'ombre de la Terre"},
        {h:"Ordres de grandeur",b:"Distance Terre-Soleil : ~150 millions de km = 1 UA\nLumière Soleil→Terre : ~8 minutes\n\nAnalogue : si Soleil = ballon de 1 m\n→ Terre = bille de 9 mm à 107 m\n→ Neptune à 3,2 km du ballon !"}
      ],
      keypoints:["8 planètes : Mercure Vénus Terre Mars Jupiter Saturne Uranus Neptune","Révolution (tour du Soleil) ≠ Rotation (sur elle-même)","La Lune est un satellite de la Terre (lumière réfléchie, pas émise)"]
    }
  }
};

