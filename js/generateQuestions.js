import { randInt, shuffle, buildChoiceSet } from './utils.js';

const DECIMALS = { minimumFractionDigits: 0, maximumFractionDigits: 2 };

const formatNumber = (value) => value.toLocaleString('fr-FR', DECIMALS);

function genLinearEquation() {
  const a = randInt(2, 9);
  const x = randInt(-5, 5);
  const b = randInt(-10, 10);
  const c = a * x + b;
  const statement = `Résoudre ${a}x ${b >= 0 ? '+ ' : '- '}${Math.abs(b)} = ${c}.`;
  const correct = `${x}`;
  const wrongs = [formatNumber(c / a), `${-x}`, `${c - b}`];
  const choiceSet = buildChoiceSet(correct, wrongs);
  return {
    statement,
    ...choiceSet,
    explanation: `On isole x : ${a}x = ${c - b} puis x = ${(c - b) / a} = ${x}.`,
  };
}

function genFractionSum() {
  const q1 = randInt(2, 9);
  const q2 = randInt(2, 9);
  const n1 = randInt(1, q1 - 1);
  const n2 = randInt(1, q2 - 1);
  const numerator = n1 * q2 + n2 * q1;
  const denominator = q1 * q2;
  const simplified = simplifyFraction(numerator, denominator);
  const correct = `${simplified.numerator}/${simplified.denominator}`;
  const wrongs = [
    `${numerator}/${denominator}`,
    `${n1 + n2}/${q1 + q2}`,
    `${Math.abs(n1 - n2)}/${Math.abs(q1 - q2) || 1}`,
  ];
  const statement = `Calculer ${n1}/${q1} + ${n2}/${q2}.`;
  return {
    statement,
    ...buildChoiceSet(correct, wrongs),
    explanation: `On se place au dénominateur ${denominator} puis on simplifie pour obtenir ${correct}.`,
  };
}

function simplifyFraction(num, den) {
  const gcd = (a, b) => (b === 0 ? Math.abs(a) : gcd(b, a % b));
  const divisor = gcd(num, den);
  return { numerator: num / divisor, denominator: den / divisor };
}

function genPowerRule() {
  const base = randInt(2, 9);
  const m = randInt(1, 5);
  const n = randInt(1, 5);
  const correct = `${base}^${m + n}`;
  const wrongs = [`${base}^${m * n}`, `${base}^${Math.abs(m - n)}`, `${base + m}^${n}`];
  return {
    statement: `Simplifier ${base}^${m} × ${base}^${n}.`,
    ...buildChoiceSet(correct, wrongs),
    explanation: `Même base ⇒ on additionne les exposants : ${m} + ${n} = ${m + n}.`,
  };
}

function genMentalMath() {
  const a = randInt(20, 80);
  const b = randInt(5, 30);
  const sign = Math.random() < 0.5 ? '+' : '-';
  const result = sign === '+' ? a + b : a - b;
  const wrongs = [result + randInt(-5, 5), result + randInt(6, 12), result - randInt(6, 12)];
  return {
    statement: `Calculer mentalement ${a} ${sign} ${b}.`,
    ...buildChoiceSet(`${result}`, wrongs.map((value) => `${value}`)),
    explanation: `On applique l'opération directe : ${a} ${sign} ${b} = ${result}.`,
  };
}

const calculQuestions = [genLinearEquation, genFractionSum, genPowerRule, genMentalMath];

function genPercentOfValue() {
  const base = randInt(80, 350);
  const rate = randInt(5, 40);
  const result = Math.round((rate / 100) * base);
  const wrongs = [result + randInt(5, 25), Math.round(base / rate), Math.round(base * (1 + rate / 100))];
  return {
    statement: `Combien vaut ${rate}% de ${base} ?`,
    ...buildChoiceSet(`${result}`, wrongs.map((v) => `${v}`)),
    explanation: `${rate}% de ${base} = ${base} × ${rate}/100 = ${result}.`,
  };
}

function genUnitRate() {
  const quantity = randInt(3, 8);
  const price = randInt(6, 20);
  const total = quantity * price;
  const wrongs = [`${price}`, `${total / (quantity + 1)}`, `${total}`];
  return {
    statement: `${quantity} articles coûtent ${total} €. Quel est le prix unitaire ?`,
    ...buildChoiceSet(`${price} €`, wrongs.map((value) => `${value} €`)),
    explanation: `Prix unitaire = ${total} / ${quantity} = ${price} €.`,
  };
}

function genScaleRecipe() {
  const persons = randInt(2, 6);
  const amount = randInt(200, 500);
  const target = persons + randInt(2, 4);
  const perPerson = amount / persons;
  const correct = Math.round(perPerson * target);
  const wrongs = [amount + (target - persons) * 10, amount, amount * target];
  return {
    statement: `Une recette pour ${persons} personnes nécessite ${amount} g de farine. Combien pour ${target} personnes ?`,
    ...buildChoiceSet(`${correct} g`, wrongs.map((value) => `${value} g`)),
    explanation: `Quantité par personne = ${amount} / ${persons} = ${formatNumber(perPerson)} g puis × ${target}.`,
  };
}

function genCoefficientMultiplicateur() {
  const rate = randInt(3, 25);
  const coeff = (100 + rate) / 100;
  const wrongs = [rate / 100, 1 - rate / 100, rate];
  return {
    statement: `Quel est le coefficient multiplicateur correspondant à une hausse de ${rate}% ?`,
    ...buildChoiceSet(coeff.toFixed(2), wrongs.map((v) => v.toFixed ? v.toFixed(2) : `${v}`)),
    explanation: `Hausse de ${rate}% ⇒ coefficient = 1 + ${rate}/100 = ${coeff.toFixed(2)}.`,
  };
}

const proportionQuestions = [genPercentOfValue, genUnitRate, genScaleRecipe, genCoefficientMultiplicateur];

function genAdditiveToMultiplicative() {
  const rate = randInt(2, 30);
  const increase = Math.random() < 0.5;
  const coeff = increase ? 1 + rate / 100 : 1 - rate / 100;
  const correct = `Multiplier par ${coeff.toFixed(2)}`;
  const wrongs = [
    `Ajouter ${rate}`,
    `Multiplier par ${rate / 100}`,
    increase ? `Multiplier par ${(1 - rate / 100).toFixed(2)}` : `Multiplier par ${(1 + rate / 100).toFixed(2)}`,
  ];
  return {
    statement: `${increase ? 'Augmenter' : 'Diminuer'} de ${rate}% revient à :`,
    ...buildChoiceSet(correct, wrongs),
    explanation: `${increase ? 'Augmenter' : 'Diminuer'} de ${rate}% équivaut à multiplier par ${coeff.toFixed(2)}.`,
  };
}

function genFinalValue() {
  const initial = randInt(120, 900);
  const rate = randInt(5, 35);
  const coeff = 1 + rate / 100;
  const final = Math.round(initial * coeff);
  const wrongs = [`${initial}`, `${initial + rate}`, `${Math.round(initial * (1 - rate / 100))}`];
  return {
    statement: `Une quantité de ${initial} augmente de ${rate}%. Quelle valeur finale ?`,
    ...buildChoiceSet(`${final}`, wrongs),
    explanation: `VF = ${initial} × (1 + ${rate}/100) = ${final}.`,
  };
}

function genInitialValue() {
  const initial = randInt(150, 700);
  const rate = randInt(5, 30);
  const coeff = 1 + rate / 100;
  const final = Math.round(initial * coeff);
  const wrongs = [`${final}`, `${final - rate}`, `${Math.round(final / (1 - rate / 100))}`];
  return {
    statement: `Après une hausse de ${rate}%, la valeur finale est ${final}. Quelle était la valeur initiale ?`,
    ...buildChoiceSet(`${initial}`, wrongs),
    explanation: `VI = ${final} / (1 + ${rate}/100) = ${initial}.`,
  };
}

function genSuccessiveRates() {
  const a = randInt(-20, 30);
  const b = randInt(-20, 30);
  const coeff = (1 + a / 100) * (1 + b / 100);
  const rate = Math.round((coeff - 1) * 100);
  const wrongs = [`${a + b} %`, `${a * b} %`, `${rate + randInt(-6, 6)} %`];
  return {
    statement: `On applique successivement ${a}% puis ${b}%. Quel est le taux global ?`,
    ...buildChoiceSet(`${rate} %`, wrongs),
    explanation: `Coeff global = (1 + ${a}/100)(1 + ${b}/100) = ${coeff.toFixed(3)} ⇒ taux ${rate}%.`,
  };
}

function genReciprocal() {
  const rate = randInt(5, 35);
  const coeff = 1 + rate / 100;
  const reciprocal = (1 / coeff - 1) * 100;
  const wrongs = [`-${rate} %`, `${rate} %`, `${Math.round(reciprocal / 2)} %`];
  return {
    statement: `Après une hausse de ${rate}%, de combien doit-on faire varier pour revenir à l'initial ?`,
    ...buildChoiceSet(`${Math.round(reciprocal)} %`, wrongs),
    explanation: `Coeff retour = 1/${coeff.toFixed(2)} ⇒ taux ${Math.round(reciprocal)}%.`,
  };
}

function genEvolutionRateBetweenValues() {
  const initial = randInt(100, 700);
  const final = randInt(100, 900);
  const rate = Math.round(((final - initial) / initial) * 100);
  const wrongs = [`${final - initial} %`, `${(final / initial).toFixed(2)} %`, `${rate + randInt(-6, 6)} %`];
  return {
    statement: `Une valeur passe de ${initial} à ${final}. Quel est le taux d'évolution ?`,
    ...buildChoiceSet(`${rate} %`, wrongs),
    explanation: `Taux = (VF - VI)/VI × 100 = (${final} - ${initial})/${initial} × 100 = ${rate} %.`,
  };
}

const evolutionQuestions = [
  genAdditiveToMultiplicative,
  genFinalValue,
  genInitialValue,
  genSuccessiveRates,
  genReciprocal,
  genEvolutionRateBetweenValues,
];

function genEvaluateLinearFunction() {
  const a = randInt(-5, 6);
  const b = randInt(-8, 8);
  const x = randInt(-4, 4);
  const result = a * x + b;
  const wrongs = [a + b + x, a * (x + 1) + b, a * x - b];
  return {
    statement: `Pour f(x) = ${a}x ${b >= 0 ? '+ ' : '- '}${Math.abs(b)}, calculer f(${x}).`,
    ...buildChoiceSet(`${result}`, wrongs.map((value) => `${value}`)),
    explanation: `On remplace x par ${x} : f(${x}) = ${a} × ${x} ${b >= 0 ? '+ ' : '- '}${Math.abs(b)} = ${result}.`,
  };
}

function genSlopeFromTable() {
  const x1 = randInt(0, 4);
  const x2 = x1 + randInt(1, 4);
  const slope = randInt(-3, 5) || 1;
  const y1 = randInt(-5, 5);
  const y2 = y1 + slope * (x2 - x1);
  const wrongs = [`${y2 - y1 + 1}`, `${(y2 + y1) / 2}`, `${y2 / (x2 + 1)}`];
  return {
    statement: `On sait que (${x1}; ${y1}) et (${x2}; ${y2}) appartiennent à la droite (d). Quel est son coefficient directeur ?`,
    ...buildChoiceSet(`${slope}`, wrongs.map((value) => `${Math.round(value)}`)),
    explanation: `m = (y₂ - y₁)/(x₂ - x₁) = (${y2} - ${y1})/(${x2} - ${x1}) = ${slope}.`,
  };
}

function genFunctionVariation() {
  const slope = randInt(-4, 4) || 2;
  const statement = `La fonction affine g a pour coefficient directeur ${slope}. Comment varie-t-elle ?`;
  const correct = slope > 0 ? 'g est croissante sur ℝ.' : 'g est décroissante sur ℝ.';
  const wrongs = ['g est constante.', 'g alterne croissance et décroissance.', 'Impossible à déterminer.'];
  return {
    statement,
    ...buildChoiceSet(correct, wrongs),
    explanation: `Un coefficient directeur ${slope > 0 ? 'positif' : 'négatif'} impose une fonction ${slope > 0 ? 'croissante' : 'décroissante'}.`,
  };
}

function genImagePreimage() {
  const a = randInt(1, 5);
  const b = randInt(-5, 5);
  const image = randInt(-4, 6);
  const x = (image - b) / a;
  const wrongs = [image * a + b, image + b, image - b];
  return {
    statement: `Pour h(x) = ${a}x ${b >= 0 ? '+ ' : '- '}${Math.abs(b)}, quel antécédent a pour image ${image} ?`,
    ...buildChoiceSet(`${x}`, wrongs.map((value) => `${value}`)),
    explanation: `On résout ${image} = ${a}x ${b >= 0 ? '+ ' : '- '}${Math.abs(b)} ⇒ x = (${image} ${b >= 0 ? '- ' : '+ '}${Math.abs(b)})/${a} = ${x}.`,
  };
}

const functionQuestions = [genEvaluateLinearFunction, genSlopeFromTable, genFunctionVariation, genImagePreimage];

function genMeanValue() {
  const n1 = randInt(2, 6);
  const n2 = randInt(2, 6);
  const v1 = randInt(5, 15);
  const v2 = randInt(10, 25);
  const values = Array(n1).fill(v1).concat(Array(n2).fill(v2));
  const sum = values.reduce((acc, value) => acc + value, 0);
  const mean = sum / values.length;
  const wrongs = [mean + randInt(1, 3), v1, v2];
  return {
    statement: `On relève ${n1} notes égales à ${v1} et ${n2} notes égales à ${v2}. Quelle est la moyenne ?`,
    ...buildChoiceSet(mean.toFixed(1), wrongs.map((value) => value.toFixed ? value.toFixed(1) : `${value}`)),
    explanation: `Moyenne pondérée = (${n1}×${v1} + ${n2}×${v2})/${n1 + n2} = ${mean.toFixed(1)}.`,
  };
}

function genMedian() {
  const data = shuffle([randInt(10, 18), randInt(12, 20), randInt(14, 22), randInt(16, 24), randInt(18, 26)]).sort((a, b) => a - b);
  const median = data[2];
  const wrongs = [data[1], data[3], Math.round((data[0] + data[4]) / 2)];
  return {
    statement: `Considère la série triée ${data.join(', ')}. Quelle est la médiane ?`,
    ...buildChoiceSet(`${median}`, wrongs.map((value) => `${value}`)),
    explanation: `Pour 5 valeurs, la médiane est la 3ᵉ, soit ${median}.`,
  };
}

function genRange() {
  const min = randInt(5, 15);
  const max = min + randInt(10, 25);
  const wrongs = [max, min, Math.round((min + max) / 2)];
  return {
    statement: `Une série a pour minimum ${min} et maximum ${max}. Quelle est son étendue ?`,
    ...buildChoiceSet(`${max - min}`, wrongs.map((value) => `${value}`)),
    explanation: `Étendue = max - min = ${max} - ${min} = ${max - min}.`,
  };
}

function genFrequency() {
  const total = randInt(40, 80);
  const part = randInt(8, 20);
  const freq = part / total;
  const wrongs = [`${total / part}`, `${part}`, `${total - part}`];
  return {
    statement: `${part} élèves sur ${total} préfèrent les sciences. Quelle est la fréquence ?`,
    ...buildChoiceSet(freq.toFixed(2), wrongs.map((value) => (typeof value === 'number' ? value.toFixed(2) : value))),
    explanation: `Fréquence = ${part}/${total} = ${freq.toFixed(2)}.`,
  };
}

const statisticsQuestions = [genMeanValue, genMedian, genRange, genFrequency];

function genBagProbability() {
  const red = randInt(2, 6);
  const blue = randInt(2, 6);
  const total = red + blue;
  const prob = red / total;
  const wrongs = [`${blue}/${total}`, `${red}/${blue}`, `${red + blue}`];
  return {
    statement: `Un sac contient ${red} boules rouges et ${blue} bleues. Probabilité de tirer une rouge ?`,
    ...buildChoiceSet(`${red}/${total}`, wrongs),
    explanation: `p(rouge) = effectif favorable / total = ${red}/${total}.`,
  };
}

function genDoubleCoin() {
  const wrongs = ['1/3', '1/2', '3/4'];
  return {
    statement: `On lance deux pièces équilibrées. Probabilité d'obtenir deux faces ?`,
    ...buildChoiceSet('1/4', wrongs),
    explanation: `Il y a 4 issues équiprobables, une seule donne FF ⇒ 1/4.`,
  };
}

function genComplementaryEvent() {
  const prob = randInt(10, 70) / 100;
  const complement = (1 - prob).toFixed(2);
  const wrongs = [prob.toFixed(2), (prob * prob).toFixed(2), (prob + 0.2).toFixed(2)];
  return {
    statement: `P(A) = ${prob.toFixed(2)}. Quelle est la probabilité de l'événement contraire ?`,
    ...buildChoiceSet(complement, wrongs),
    explanation: `P(Ā) = 1 - P(A) = 1 - ${prob.toFixed(2)} = ${complement}.`,
  };
}

function genIndependentEvents() {
  const a = randInt(2, 5) / 10;
  const b = randInt(2, 5) / 10;
  const product = (a * b).toFixed(2);
  const wrongs = [a.toFixed(2), b.toFixed(2), (a + b).toFixed(2)];
  return {
    statement: `Deux événements indépendants vérifient P(A) = ${a.toFixed(2)} et P(B) = ${b.toFixed(2)}. Quelle est P(A ∩ B) ?`,
    ...buildChoiceSet(product, wrongs),
    explanation: `Indépendance ⇒ P(A ∩ B) = P(A) × P(B) = ${product}.`,
  };
}

const probabilityQuestions = [genBagProbability, genDoubleCoin, genComplementaryEvent, genIndependentEvents];

const questionBanks = {
  calcul: calculQuestions,
  proportions: proportionQuestions,
  evolutions: evolutionQuestions,
  fonctions: functionQuestions,
  statistiques: statisticsQuestions,
  probabilites: probabilityQuestions,
};

export function buildQuestionSet(theme, count = 10) {
  const key = theme && questionBanks[theme] ? theme : 'calcul';
  const bank = questionBanks[key];
  const questions = [];
  for (let i = 0; i < count; i += 1) {
    const generator = bank[randInt(0, bank.length - 1)];
    questions.push(generator());
  }
  return questions;
}
