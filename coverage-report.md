# Vérification de la couverture des automatismes BO 2025-2026

La table suivante synthétise, pour chaque thème et compétence listés dans l'annexe du BO, l'existence d'un générateur de QCM correspondant. Les références pointent vers `js/generateQuestions.js`.

## Calcul numérique et algébrique
| Compétence BO | Générateur(s) | Couverture | Commentaires |
| --- | --- | --- | --- |
| Comparer deux nombres directement ou via différence/quotient | `genCompareNumbers`, `genCompareViaComputation` | ✅ Oui | Comparaisons directes, par différences et par quotients strictement positifs sont couvertes.【F:js/generateQuestions.js†L114-L188】 |
| Opérations/comparaisons sur des fractions simples | `genFractionSum`, `genFractionOperations` | ✅ Oui | Addition, soustraction, produit, quotient et comparaison sont disponibles.【F:js/generateQuestions.js†L67-L267】 |
| Opérations sur les puissances | `genPowerRule` | ✅ Oui | Produit de puissances de même base traité et expliqué.【F:js/generateQuestions.js†L88-L99】 |
| Passer d'une écriture (décimale, fractionnaire, pourcentage) à une autre | `genDecimalFractionConversion`, `genPercentToDecimal` | ✅ Oui | Conversion dans les deux sens disponible.【F:js/generateQuestions.js†L190-L215】 |
| Estimer un ordre de grandeur, vérifier la vraisemblance | `genOrderOfMagnitude`, `genPlausibilityCheck` | ✅ Oui | On estime un produit mentalement puis on valide la cohérence d’un résultat physique (vitesse).【F:js/generateQuestions.js†L278-L311】 |
| Conversions d’unités (longueurs, aires, volumes, contenances, durées, vitesses, masses) | `genUnitConversionLength`, `genUnitConversionArea`, `genUnitConversionSpeed`, `genUnitConversionVolume`, `genUnitConversionCapacity`, `genUnitConversionDuration`, `genUnitConversionMass` | ✅ Oui | Toutes les familles d’unités demandées (y compris volumes, capacités, durées, masses) disposent d’un générateur dédié.【F:js/generateQuestions.js†L313-L444】 |
| Calcul littéral élémentaire (signes, inverses, etc.) | `genDevelopIdentity`, `genLiteralSigns` | ✅ Oui | Les identités remarquables et les manipulations de signes/opposés/inverses sont travaillées.【F:js/generateQuestions.js†L534-L581】 |
| Développer, factoriser, réduire une expression simple | `genDevelopIdentity`, `genFactorizeCommonTerm`, `genFactorizeQuadratic` | ✅ Oui | Factorisations de $ax^2+bx$, $ax+bx$ et de trinômes factorisables complètent les identités classiques.【F:js/generateQuestions.js†L534-L621】 |
| Résoudre les équations types ($x^2=a$, $ax+b=cx+d$, $a/x=b$) | `genLinearEquation`, `genSquareEquation`, `genRationalEquation` | ✅ Oui | Les trois familles d'équations citées sont proposées, avec résolution détaillée.【F:js/generateQuestions.js†L52-L64】【F:js/generateQuestions.js†L514-L525】 |
| Résoudre une inéquation du premier degré | `genLinearInequality` | ✅ Oui | Résolution du type $ax+b<c$ avec rappel du changement de sens lorsque l’on divise par un nombre négatif.【F:js/generateQuestions.js†L623-L641】 |
| Isoler une variable dans une formule | `genIsolateVariable` | ✅ Oui | Plusieurs scénarios issus d'autres disciplines sont fournis.【F:js/generateQuestions.js†L476-L501】 |
| Application numérique d’une formule | `genFormulaApplication` | ✅ Oui | Calcul d’aire de triangle illustrant l’utilisation d’une formule.【F:js/generateQuestions.js†L502-L512】 |
| Équation produit nul | `genZeroProductEquation` | ✅ Oui | Résolution complète de $(x-a)(x-b)=0$.【F:js/generateQuestions.js†L462-L471】 |
| Déterminer le signe d’une expression du 1er ou d’une factorisée du 2nd degré | `genSignFirstDegree`, `genSignFromFactorized` | ✅ Oui | Lecture du signe d'une affine (racine simple) et d'une expression factorisée du second degré.【F:js/generateQuestions.js†L636-L718】【F:js/generateQuestions.js†L1068-L1087】 |

**Nouveaux générateurs ajoutés :** `genCompareViaComputation`, `genFractionOperations`, `genPlausibilityCheck`, les quatre conversions d’unités manquantes, `genLiteralSigns`, `genFactorizeCommonTerm`, `genFactorizeQuadratic`, `genLinearInequality` et `genSignFirstDegree` rendent la couverture complète sur ce thème.


## Proportions et pourcentages
| Compétence BO | Générateur(s) | Couverture | Commentaires |
| --- | --- | --- | --- |
| Calculer/appliquer/exprimer une proportion sous forme décimale, fractionnaire ou en pourcentage | `genExpressProportion`, `genPercentOfValue`, `genPercentToDecimal` | ✅ Oui | Les générateurs couvrent l'expression en % ainsi que le calcul d'une partie d'un tout.【F:js/generateQuestions.js†L343-L381】 |
| Utiliser une proportion pour déterminer une partie connaissant le tout ou inversement | `genPercentOfValue`, `genFindWholeFromPart`, `genTableProportion`, `genScaleRecipe`, `genUnitRate` | ✅ Oui | Cas « partie→tout » et « tout→partie » disponibles dans la banque proportionnelle.【F:js/generateQuestions.js†L343-L408】 |

## Évolutions et variations
| Compétence BO | Générateur(s) | Couverture | Commentaires |
| --- | --- | --- | --- |
| Passer d'une formulation additive à multiplicative | `genAdditiveToMultiplicative` | ✅ Oui | Traduction « ±x% » ↔ coefficient multiplicateur proposée.【F:js/generateQuestions.js†L412-L425】 |
| Appliquer un taux d'évolution pour trouver valeur finale ou initiale | `genFinalValue`, `genInitialValue`, `genInitialAfterDecrease`, `genValueAfterMixedVariations` | ✅ Oui | Calculs directs des valeurs initiales/finales avec hausse ou baisse successives.【F:js/generateQuestions.js†L427-L486】 |
| Calculer un taux d'évolution et l'exprimer en pourcentage | `genRateFromValues` | ✅ Oui | Conversion variation → taux incluse.【F:js/generateQuestions.js†L505-L514】 |
| Calculer le taux équivalent à plusieurs évolutions successives | `genSuccessiveRates`, `genMultipleVariations` | ✅ Oui | Combinaisons de coefficients multiplicateurs successifs traitées.【F:js/generateQuestions.js†L500-L534】 |
| Calculer un taux d'évolution réciproque | `genReciprocal` | ✅ Oui | Le générateur calcule la variation nécessaire pour revenir à l'état initial.【F:js/generateQuestions.js†L515-L524】 |

## Fonctions et représentations
| Compétence BO | Générateur(s) | Couverture | Commentaires |
| --- | --- | --- | --- |
| Déterminer graphiquement images et antécédents | `genGraphReadValue`, `genGraphSolveZero` | ✅ Oui | Lecture d'image et recherche de racine sur mini-graphes de droites affines.【F:js/generateQuestions.js†L1082-L1105】 |
| Exploiter une équation de courbe (appartenance d'un point, calcul de coordonnées) | `genPointOnCurve` | ✅ Oui | Vérifie l’appartenance (ou non) d’un point à une courbe $y=ax^2+bx+c$.【F:js/generateQuestions.js†L1155-L1171】 |
| Reconnaître les fonctions linéaires/affines | `genRecognizeFunction` | ✅ Oui | Classification des expressions $ax$ et $ax+b$.【F:js/generateQuestions.js†L1052-L1061】 |
| Résoudre graphiquement $f(x)=k$ ou $f(x)<k$ | `genGraphSolveZero`, `genGraphSolveK` | ✅ Oui | Lecture graphique d’images pour tout $k$ et résolution d’inéquations via le sens de variation de la droite.【F:js/generateQuestions.js†L1096-L1143】 |
| Déterminer graphiquement le signe ou son tableau de variations | `genGraphSign`, `genVariationTableReading`, `genDerivativeSignInterpretation` | ✅ Oui | Lecture sur graphique complétée par l’exploitation de tableaux de variations textuels.【F:js/generateQuestions.js†L1006-L1170】 |
| Tracer une droite connue (équation réduite, point + coefficient directeur) | `genDrawLine` | ✅ Oui | Les questions demandent explicitement quels points placer pour tracer la droite donnée.【F:js/generateQuestions.js†L1193-L1223】 |
| Lire graphiquement l'équation réduite d'une droite | `genEquationFromGraph` | ✅ Oui | On retrouve $y=ax+b$ à partir du mini-graphe fourni.【F:js/generateQuestions.js†L1227-L1244】 |
| Déterminer le coefficient directeur à partir de deux points | `genSlopeFromTable` | ✅ Oui | Calcul explicite du coefficient directeur à partir de deux coordonnées.【F:js/generateQuestions.js†L978-L990】 |

**Nouveaux générateurs ajoutés :** `genPointOnCurve`, `genGraphSolveK`, `genGraphSign`, `genDrawLine` et `genEquationFromGraph` assurent les volets graphiques manquants.

## Statistiques
| Compétence BO | Générateur(s) | Couverture | Commentaires |
| --- | --- | --- | --- |
| Lire et commenter graphiques usuels (barres, circulaires, courbes, nuages) | `genDiagramReading`, `genScatterTrend`, `genPieChartReading`, `genTimeSeriesCommentary` | ✅ Oui | Tous les graphiques cités (barres, circulaires, courbes chronologiques, nuages) sont lus/commentés.【F:js/generateQuestions.js†L1324-L1387】 |
| Calculer/interpréter moyenne, médiane, quartiles | `genMeanValue`, `genMedian`, `genQuartile` | ✅ Oui | Indicateurs classiques traités séparément.【F:js/generateQuestions.js†L784-L817】 |
| Comparer des distributions via boîtes à moustaches | `genBoxPlotComparison` | ✅ Oui | Lecture croisée de médiane et dispersion fournie.【F:js/generateQuestions.js†L820-L832】 |
| Lire un graphique/histogramme/diagramme en barres ou boîte | `genDiagramReading`, `genGraphToData`, `genPieChartReading`, `genBoxPlotReading` | ✅ Oui | Les lectures couvrent barres, histogrammes, boîtes et diagrammes circulaires.【F:js/generateQuestions.js†L1324-L1405】 |
| Passer du graphique aux données et inversement | `genGraphToData` | ✅ Oui | Traduction effectif ↔ fréquence d'un histogramme.【F:js/generateQuestions.js†L1337-L1346】 |
| Calculer/interpréter des indicateurs pour une série statistique | `genMeanValue`, `genMedian`, `genQuartile` | ✅ Oui | Identique à la ligne sur les indicateurs, répondant à la seconde occurrence du BO.【F:js/generateQuestions.js†L784-L817】 |

**Nouveaux générateurs ajoutés :** `genPieChartReading`, `genTimeSeriesCommentary` et `genBoxPlotReading` complètent le spectre des représentations.

## Probabilités
| Compétence BO | Générateur(s) | Couverture | Commentaires |
| --- | --- | --- | --- |
| Savoir qu’une probabilité est comprise entre 0 et 1 | `genProbabilityBounds` | ✅ Oui | Question dédiée aux valeurs admissibles d'une probabilité.【F:js/generateQuestions.js†L1565-L1572】 |
| Calculer la probabilité de l’événement contraire | `genComplementaryEvent` | ✅ Oui | Calcul direct de $1 - P(A)$.【F:js/generateQuestions.js†L1450-L1458】 |
| Calculer la probabilité d’un événement par somme des probabilités des issues | `genSumEvent`, `genEventBySum` | ✅ Oui | Cas équiprobables et issues pondérées explicitent l'addition des probabilités élémentaires.【F:js/generateQuestions.js†L1487-L1532】 |
| Utiliser $P(A)=\frac{\text{card}(A)}{\text{card}(\Omega)}$ en cas équiprobable | `genSumEvent`, `genBagProbability` | ✅ Oui | Énoncés sur dés équilibrés et tirages uniformes.【F:js/generateQuestions.js†L881-L954】 |
| Calculer des probabilités conditionnelles à partir d’un tableau ou d’un arbre | `genConditionalFromTable`, `genConditionalFromTree`, `genTreeProbability` | ✅ Oui | Les deux supports (tableaux croisés, arbres pondérés) sont représentés.【F:js/generateQuestions.js†L1406-L1494】 |
| Distinguer $P(A∩B)$, $P_A(B)$, $P_B(A)$ | `genNotationQuestion` | ✅ Oui | Question dédiée aux notations conditionnelles.【F:js/generateQuestions.js†L1507-L1515】 |
| Probabilités sur loi binomiale | `genBinomialProbability` | ✅ Oui | Calcul complet $C(n,k)p^k(1-p)^{n-k}$.【F:js/generateQuestions.js†L1517-L1535】 |

**Nouveaux générateurs ajoutés :** `genProbabilityBounds` et `genEventBySum` complètent les rappels fondamentaux et la somme d’issues pondérées.
