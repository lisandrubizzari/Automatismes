import { randInt, shuffle, buildChoiceSet } from './utils.js';

const DECIMALS = { minimumFractionDigits: 0, maximumFractionDigits: 2 };

const formatNumber = (value, options = DECIMALS) => value.toLocaleString('fr-FR', options);

function simplifyFraction(num, den) {
  const gcd = (a, b) => (b === 0 ? Math.abs(a) : gcd(b, a % b));
  const divisor = gcd(num, den);
  return { numerator: num / divisor, denominator: den / divisor };
}

function randomItem(list) {
  return list[randInt(0, list.length - 1)];
}

function createLineGraph(a, b) {
  const width = 180;
  const height = 110;
  const xMin = -4;
  const xMax = 4;
  const yMin = -8;
  const yMax = 8;
  const mapX = (x) => ((x - xMin) / (xMax - xMin)) * width;
  const mapY = (y) => height - ((y - yMin) / (yMax - yMin)) * height;
  const axisY = Math.min(Math.max(mapX(0), 0), width);
  const axisX = Math.min(Math.max(mapY(0), 0), height);
  const path = `M ${mapX(xMin).toFixed(2)} ${mapY(a * xMin + b).toFixed(2)} L ${mapX(xMax).toFixed(2)} ${mapY(
    a * xMax + b,
  ).toFixed(2)}`;
  return `
    <svg class="mini-graph" viewBox="0 0 ${width} ${height}" role="img" aria-label="Mini graphique de la droite y = ${a}x ${
      b >= 0 ? '+ ' : '- '
    }${Math.abs(b)}">
      <line x1="0" y1="${axisX}" x2="${width}" y2="${axisX}" stroke="#94a3b8" stroke-width="0.8" />
      <line x1="${axisY}" y1="0" x2="${axisY}" y2="${height}" stroke="#94a3b8" stroke-width="0.8" />
      <path d="${path}" stroke="#6366f1" stroke-width="2" fill="none" />
    </svg>
  `;
}

function genLinearEquation() {
  const a = randInt(2, 9);
  const x = randInt(-5, 5);
  const b = randInt(-10, 10);
  const c = a * x + b;
  const statement = `Résoudre ${a}x ${b >= 0 ? '+ ' : '- '}${Math.abs(b)} = ${c}.`;
  const correct = `${x}`;
  const wrongs = [formatNumber(c / a), `${-x}`, `${c - b}`];
  return {
    statement,
    ...buildChoiceSet(correct, wrongs),
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
  return {
    statement: `Calculer ${n1}/${q1} + ${n2}/${q2}.`,
    ...buildChoiceSet(correct, wrongs),
    explanation: `On se place au dénominateur ${denominator} puis on simplifie pour obtenir ${correct}.`,
  };
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

function genCompareNumbers() {
  const a = randInt(-20, 40) / 2;
  const b = randInt(-20, 40) / 2;
  const comparisons = [`${a} > ${b}`, `${a} < ${b}`, `${a} = ${b}`];
  let correct = `${a} = ${b}`;
  if (a > b) {
    correct = `${a} > ${b}`;
  } else if (a < b) {
    correct = `${a} < ${b}`;
  }
  const wrongs = comparisons.filter((item) => item !== correct);
  return {
    statement: 'Quelle comparaison est exacte ?',
    ...buildChoiceSet(correct, wrongs),
    explanation: `On compare les décimaux : ${formatNumber(a)} ${a > b ? '>' : a < b ? '<' : '='} ${formatNumber(b)}.`,
  };
}

function genDecimalFractionConversion() {
  const denominator = randomItem([4, 5, 8, 10, 20, 25]);
  const numerator = randInt(1, denominator - 1);
  const value = numerator / denominator;
  const simplified = simplifyFraction(numerator, denominator);
  const percent = (value * 100).toFixed(1).replace('.', ',');
  const correct = `${simplified.numerator}/${simplified.denominator}`;
  const wrongs = [`${numerator}/${denominator}`, `${percent}%`, `${value}`];
  return {
    statement: `Écrire ${value.toString().replace('.', ',')} sous forme de fraction simplifiée :`,
    ...buildChoiceSet(correct, wrongs),
    explanation: `On simplifie ${numerator}/${denominator} pour obtenir ${correct}.`,
  };
}

function genPercentToDecimal() {
  const percent = randInt(5, 95);
  const value = percent / 100;
  const fraction = simplifyFraction(percent, 100);
  const correct = `${value.toString().replace('.', ',')}`;
  const wrongs = [`${fraction.numerator}/${fraction.denominator}`, `${percent}`, `${value * 10}`];
  return {
    statement: `Quelle écriture décimale correspond à ${percent}% ?`,
    ...buildChoiceSet(correct, wrongs),
    explanation: `${percent}% = ${percent}/100 = ${fraction.numerator}/${fraction.denominator} = ${correct}.`,
  };
}

function genOrderOfMagnitude() {
  const a = randInt(12, 98);
  const b = randInt(12, 98);
  const product = a * b;
  const power = Math.pow(10, Math.floor(Math.log10(product)));
  const approx = Math.round(product / power) * power;
  const wrongs = [power, approx + power, product];
  return {
    statement: `Donner un ordre de grandeur pour ${a} × ${b}.`,
    ...buildChoiceSet(`${approx}`, wrongs.map((v) => `${v}`)),
    explanation: `${a} ≈ ${Math.round(a / 10) * 10}, ${b} ≈ ${Math.round(b / 10) * 10} ⇒ produit ≈ ${approx}.`,
  };
}

function genUnitConversionLength() {
  const units = [
    { unit: 'km', factor: 1000 },
    { unit: 'm', factor: 1 },
    { unit: 'cm', factor: 0.01 },
    { unit: 'mm', factor: 0.001 },
  ];
  const from = randomItem(units);
  let to = randomItem(units);
  while (to.unit === from.unit) {
    to = randomItem(units);
  }
  const value = randInt(2, 200);
  const meters = value * from.factor;
  const converted = meters / to.factor;
  const wrongs = [converted * 10, converted / 10, meters];
  return {
    statement: `Convertir ${value} ${from.unit} en ${to.unit}.`,
    ...buildChoiceSet(`${formatNumber(converted)} ${to.unit}`, wrongs.map((v) => `${formatNumber(v)} ${to.unit}`)),
    explanation: `On passe par les mètres puis on convertit : ${value} ${from.unit} = ${formatNumber(meters)} m = ${formatNumber(
      converted,
    )} ${to.unit}.`,
  };
}

function genUnitConversionArea() {
  const units = [
    { unit: 'm²', factor: 1 },
    { unit: 'dm²', factor: 0.01 },
    { unit: 'cm²', factor: 0.0001 },
  ];
  const from = randomItem(units);
  let to = randomItem(units);
  while (to.unit === from.unit) {
    to = randomItem(units);
  }
  const value = randInt(1, 25);
  const base = value * from.factor;
  const converted = base / to.factor;
  const wrongs = [converted * 100, converted / 100, base];
  return {
    statement: `Convertir ${value} ${from.unit} en ${to.unit}.`,
    ...buildChoiceSet(`${formatNumber(converted)} ${to.unit}`, wrongs.map((v) => `${formatNumber(v)} ${to.unit}`)),
    explanation: `Surface : on élève le facteur linéaire au carré avant de convertir, d'où ${formatNumber(converted)} ${to.unit}.`,
  };
}

function genUnitConversionSpeed() {
  const speed = randInt(30, 120);
  const converted = (speed * 1000) / 3600;
  const wrongs = [speed / 3.6, converted * 10, converted / 10];
  return {
    statement: `Convertir ${speed} km/h en m/s.`,
    ...buildChoiceSet(`${formatNumber(converted)} m/s`, wrongs.map((v) => `${formatNumber(v)} m/s`)),
    explanation: `1 km/h = 1000/3600 m/s ⇒ ${speed} km/h = ${formatNumber(converted)} m/s.`,
  };
}

function genZeroProductEquation() {
  const a = randInt(-6, 6) || 2;
  const b = randInt(-6, 6) || -3;
  const statement = `Résoudre (${a >= 0 ? 'x - ' + a : 'x + ' + Math.abs(a)})(${b >= 0 ? 'x - ' + b : 'x + ' + Math.abs(b)}) = 0.`;
  const roots = [`x = ${a}`, `x = ${b}`];
  const correct = roots.join(' ou ');
  const wrongs = [`x = ${-a}`, `x = ${a + b}`, `x = 0`];
  return {
    statement,
    ...buildChoiceSet(correct, wrongs),
    explanation: `Produit nul ⇒ x = ${a} ou x = ${b}.`,
  };
}

function genIsolateVariable() {
  const scenarios = [
    {
      statement: 'Dans la formule d = v × t, isoler v.',
      correct: 'v = d / t',
      wrongs: ['v = d × t', 'v = t / d', 'v = d - t'],
    },
    {
      statement: 'Dans la formule P = 2(L + l), exprimer L en fonction de P et l.',
      correct: 'L = P/2 - l',
      wrongs: ['L = P - l', 'L = 2P - l', 'L = P/(2l)'],
    },
    {
      statement: 'Dans U = R × I, isoler R.',
      correct: 'R = U / I',
      wrongs: ['R = U × I', 'R = I / U', 'R = U - I'],
    },
  ];
  const selected = randomItem(scenarios);
  return {
    statement: selected.statement,
    ...buildChoiceSet(selected.correct, selected.wrongs),
    explanation: `On transforme l'égalité pour isoler la variable : ${selected.correct}.`,
  };
}

function genFormulaApplication() {
  const base = randInt(6, 20);
  const height = randInt(4, 12);
  const area = (base * height) / 2;
  const wrongs = [base * height, (base + height) / 2, base + height];
  return {
    statement: `Calculer l'aire d'un triangle de base ${base} cm et de hauteur ${height} cm.`,
    ...buildChoiceSet(`${area} cm²`, wrongs.map((v) => `${v} cm²`)),
    explanation: `A = (b × h)/2 = (${base} × ${height})/2 = ${area} cm².`,
  };
}

function genSquareEquation() {
  const value = randInt(2, 8);
  const square = value * value;
  return {
    statement: `Résoudre x² = ${square}.`,
    ...buildChoiceSet(`x = ±${value}`, [`x = ${value}`, `x = ${square}`, `x = ±${square}`]),
    explanation: `x² = ${square} ⇒ x = ${value} ou x = -${value}.`,
  };
}

function genRationalEquation() {
  const a = randInt(6, 30);
  const b = randInt(2, 6);
  return {
    statement: `Résoudre ${a}/x = ${b}.`,
    ...buildChoiceSet(`x = ${a / b}`, [`x = ${a * b}`, `x = ${b / a}`, `x = ${a - b}`]),
    explanation: `${a}/x = ${b} ⇒ x = ${a}/${b} = ${a / b}.`,
  };
}

const calculQuestions = [
  genLinearEquation,
  genFractionSum,
  genPowerRule,
  genMentalMath,
  genCompareNumbers,
  genDecimalFractionConversion,
  genPercentToDecimal,
  genOrderOfMagnitude,
  genUnitConversionLength,
  genUnitConversionArea,
  genUnitConversionSpeed,
  genZeroProductEquation,
  genIsolateVariable,
  genFormulaApplication,
  genSquareEquation,
  genRationalEquation,
];

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
    ...buildChoiceSet(coeff.toFixed(2), wrongs.map((v) => (typeof v === 'number' && v.toFixed ? v.toFixed(2) : `${v}`))),
    explanation: `Hausse de ${rate}% ⇒ coefficient = 1 + ${rate}/100 = ${coeff.toFixed(2)}.`,
  };
}

function genExpressProportion() {
  const total = randInt(40, 90);
  const part = randInt(5, total - 5);
  const fraction = simplifyFraction(part, total);
  const percent = ((part / total) * 100).toFixed(1);
  const correct = `${percent}%`;
  const wrongs = [`${fraction.numerator}/${fraction.denominator}`, `${part}:${total}`, `${part}`];
  return {
    statement: `${part} élèves sur ${total} choisissent l'option maths. Exprimer cette proportion en pourcentage.`,
    ...buildChoiceSet(correct, wrongs),
    explanation: `Fréquence = ${part}/${total} = ${fraction.numerator}/${fraction.denominator} ≈ ${percent}%.`,
  };
}

function genFindWholeFromPart() {
  const rate = randInt(10, 60);
  const part = randInt(20, 150);
  const total = Math.round((part * 100) / rate);
  const wrongs = [part + rate, part * rate, Math.round(part / (rate / 100 + 1))];
  return {
    statement: `${part} représente ${rate}% d'un montant. Quel est le total ?`,
    ...buildChoiceSet(`${total}`, wrongs.map((v) => `${v}`)),
    explanation: `Total = ${part} / (${rate}/100) = ${total}.`,
  };
}

function genTableProportion() {
  const x1 = randInt(2, 8);
  const y1 = randInt(10, 40);
  const ratio = y1 / x1;
  const x2 = randInt(5, 12);
  const y2 = Math.round(x2 * ratio);
  const wrongs = [x2 + y1, y1, Math.round(y2 / 2)];
  return {
    statement: `Dans un tableau de proportionnalité, ${x1} correspond à ${y1}. Quelle valeur correspond à ${x2} ?`,
    ...buildChoiceSet(`${y2}`, wrongs.map((v) => `${v}`)),
    explanation: `Coefficient = ${ratio.toFixed(2)} ⇒ ${y2} = ${x2} × ${ratio.toFixed(2)}.`,
  };
}

function genRatioComparison() {
  const juice = randInt(1, 4);
  const water = randInt(2, 6);
  const mixA = juice / water;
  const juiceB = juice + randInt(1, 3);
  const waterB = water + randInt(1, 3);
  const mixB = juiceB / waterB;
  const correct = mixA > mixB ? 'Mélange A' : 'Mélange B';
  const wrongs = ['Mélange C (impossible)', 'Les deux identiques', mixA > mixB ? 'Mélange B' : 'Mélange A'];
  return {
    statement: `Le mélange A contient ${juice} volumes de sirop pour ${water} d'eau. Le mélange B contient ${juiceB} volumes de sirop pour ${waterB} d'eau. Lequel est le plus sucré ?`,
    ...buildChoiceSet(correct, wrongs),
    explanation: `Taux A = ${mixA.toFixed(2)}, taux B = ${mixB.toFixed(2)} ⇒ ${correct}.`,
  };
}

const proportionQuestions = [
  genPercentOfValue,
  genUnitRate,
  genScaleRecipe,
  genCoefficientMultiplicateur,
  genExpressProportion,
  genFindWholeFromPart,
  genTableProportion,
  genRatioComparison,
];

function genAdditiveToMultiplicative() {
  const rate = randInt(2, 30);
  const increase = Math.random() < 0.5;
  const coeff = increase ? 1 + rate / 100 : 1 - rate / 100;
  const correct = `Multiplier par ${coeff.toFixed(2)}`;
  const wrongs = [
    `Ajouter ${rate}`,
    `Multiplier par ${(rate / 100).toFixed(2)}`,
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

function genRateFromValues() {
  const initial = randInt(80, 220);
  const final = randInt(80, 220);
  const rate = ((final - initial) / initial) * 100;
  const wrongs = [`${final - initial}`, `${initial / final} %`, `${Math.abs(initial - final)} %`];
  return {
    statement: `La grandeur passe de ${initial} à ${final}. Quel est le taux d'évolution ?`,
    ...buildChoiceSet(`${Math.round(rate)} %`, wrongs),
    explanation: `t = (VF - VI)/VI = (${final} - ${initial})/${initial} = ${Math.round(rate)}%.`,
  };
}

function genMultipleVariations() {
  const rates = [randInt(-15, 20), randInt(-15, 20), randInt(-15, 20)];
  const coeff = rates.reduce((acc, r) => acc * (1 + r / 100), 1);
  const rate = Math.round((coeff - 1) * 100);
  const wrongs = [`${rates.reduce((a, b) => a + b, 0)} %`, `${Math.max(...rates)} %`, `${rate + randInt(-5, 5)} %`];
  return {
    statement: `On applique successivement ${rates.map((r) => `${r}%`).join(', ')}. Quel est le taux global ?`,
    ...buildChoiceSet(`${rate} %`, wrongs),
    explanation: `Coeff global = Π(1 + tᵢ) = ${coeff.toFixed(3)} ⇒ ${rate}%.`,
  };
}

function genValueAfterMixedVariations() {
  const initial = randInt(200, 600);
  const rateA = randInt(-20, 20);
  const rateB = randInt(-20, 20);
  const final = Math.round(initial * (1 + rateA / 100) * (1 + rateB / 100));
  const wrongs = [`${initial + rateA + rateB}`, `${Math.round(initial * (1 + (rateA + rateB) / 100))}`, `${initial}`];
  return {
    statement: `Une valeur ${rateA > 0 ? 'augmente' : 'diminue'} de ${Math.abs(rateA)}% puis ${rateB > 0 ? 'augmente' : 'diminue'} de ${Math.abs(rateB)}%. Quelle valeur finale pour ${initial} ?`,
    ...buildChoiceSet(`${final}`, wrongs),
    explanation: `VF = ${initial} × (1 + ${rateA}/100)(1 + ${rateB}/100) = ${final}.`,
  };
}

function genInitialAfterDecrease() {
  const rate = randInt(5, 30);
  const coeff = 1 - rate / 100;
  const initial = randInt(200, 800);
  const final = Math.round(initial * coeff);
  const wrongs = [`${final}`, `${final + rate}`, `${Math.round(initial * (1 + rate / 100))}`];
  return {
    statement: `Après une baisse de ${rate}%, la valeur finale est ${final}. Quelle valeur initiale ?`,
    ...buildChoiceSet(`${initial}`, wrongs),
    explanation: `VI = ${final} / (1 - ${rate}/100) = ${initial}.`,
  };
}

const evolutionQuestions = [
  genAdditiveToMultiplicative,
  genFinalValue,
  genInitialValue,
  genSuccessiveRates,
  genReciprocal,
  genRateFromValues,
  genMultipleVariations,
  genValueAfterMixedVariations,
  genInitialAfterDecrease,
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
    explanation: `Un coefficient directeur ${slope > 0 ? 'positif' : 'négatif'} impose une fonction ${
      slope > 0 ? 'croissante' : 'décroissante'
    }.`,
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
    explanation: `On résout ${image} = ${a}x ${b >= 0 ? '+ ' : '- '}${Math.abs(b)} ⇒ x = (${image} ${b >= 0 ? '- ' : '+ '}${Math.abs(
      b,
    )})/${a} = ${x}.`,
  };
}

function genRecognizeFunction() {
  const options = [
    { expr: 'f(x) = 3x - 2', correct: 'Fonction affine' },
    { expr: 'g(x) = 4x', correct: 'Fonction linéaire' },
    { expr: 'h(x) = 2x² + 1', correct: 'Fonction polynomiale du 2ᵉ degré' },
  ];
  const chosen = randomItem(options);
  const wrongs = options.filter((opt) => opt !== chosen).map((opt) => opt.correct);
  wrongs.push('Fonction constante');
  return {
    statement: `Quelle est la nature de ${chosen.expr} ?`,
    ...buildChoiceSet(chosen.correct, wrongs),
    explanation: `${chosen.expr} s'écrit ${chosen.correct === 'Fonction linéaire' ? 'ax' : 'ax + b'}, d'où ${chosen.correct}.`,
  };
}

function genSignFromFactorized() {
  const a = randInt(-4, 4) || -2;
  const b = randInt(1, 6);
  const c = randInt(-6, -1);
  const statement = `Déterminer le signe de f(x) = ${a}(x - ${b})(x - ${c}).`;
  const correct = `Signe de ${a > 0 ? 'l'intérieur' : 'l'extérieur'} de [${Math.min(b, c)} ; ${Math.max(b, c)}]`;
  const wrongs = ['Toujours positif', 'Toujours négatif', 'Change uniquement en x = 0'];
  return {
    statement,
    ...buildChoiceSet(correct, wrongs),
    explanation: `Les racines sont ${b} et ${c}. Avec le facteur ${a}, on détermine le signe selon les intervalles.`,
  };
}

function genGraphReadValue() {
  const slope = randInt(-3, 3) || 2;
  const intercept = randInt(-4, 4);
  const xQuery = randInt(-3, 3);
  const value = slope * xQuery + intercept;
  const description = `Selon le mini-graphe ci-dessous, quelle est l'image de x = ${xQuery} ?`;
  return {
    statement: description,
    statementHTML: `${description}<br/>${createLineGraph(slope, intercept)}`,
    ...buildChoiceSet(`${value}`, [`${value + randInt(1, 3)}`, `${value - randInt(1, 3)}`, `${value + slope}`]),
    explanation: `Sur la droite y = ${slope}x ${intercept >= 0 ? '+ ' : '- '}${Math.abs(intercept)}, f(${xQuery}) = ${value}.`,
  };
}

function genGraphSolveZero() {
  const slope = randInt(1, 4);
  const intercept = randInt(-5, -1);
  const root = -intercept / slope;
  const description = 'D'après le graphique, pour quelle valeur de x a-t-on f(x) = 0 ?';
  return {
    statement: description,
    statementHTML: `${description}<br/>${createLineGraph(slope, intercept)}`,
    ...buildChoiceSet(`${root.toFixed(1)}`, [`${(root + 1).toFixed(1)}`, `${(root - 1).toFixed(1)}`, `${intercept}`]),
    explanation: `L'intersection avec l'axe des abscisses se fait en x = -b/a = ${root.toFixed(1)}.`,
  };
}

function genPointSlopeEquation() {
  const slope = randInt(-4, 4) || 1;
  const x0 = randInt(-3, 3);
  const y0 = randInt(-5, 5);
  const b = y0 - slope * x0;
  const correct = `y = ${slope}x ${b >= 0 ? '+ ' : '- '}${Math.abs(b)}`;
  const wrongs = [`y = ${b}x ${slope >= 0 ? '+ ' : '- '}${Math.abs(slope)}`, `y = ${slope}(x + ${x0})`, `y = ${slope}x`];
  return {
    statement: `Déterminer l'équation réduite de la droite de coefficient directeur ${slope} passant par (${x0}; ${y0}).`,
    ...buildChoiceSet(correct, wrongs),
    explanation: `On calcule b = y₀ - ax₀ = ${y0} - ${slope}×${x0} = ${b}.`,
  };
}

const functionQuestions = [
  genEvaluateLinearFunction,
  genSlopeFromTable,
  genFunctionVariation,
  genImagePreimage,
  genRecognizeFunction,
  genSignFromFactorized,
  genGraphReadValue,
  genGraphSolveZero,
  genPointSlopeEquation,
];

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
    ...buildChoiceSet(mean.toFixed(1), wrongs.map((value) => (value.toFixed ? value.toFixed(1) : `${value}`))),
    explanation: `Moyenne pondérée = (${n1}×${v1} + ${n2}×${v2})/${n1 + n2} = ${mean.toFixed(1)}.`,
  };
}

function genMedian() {
  const data = shuffle([randInt(10, 18), randInt(12, 20), randInt(14, 22), randInt(16, 24), randInt(18, 26)]).sort(
    (a, b) => a - b,
  );
  const median = data[2];
  const wrongs = [data[1], data[3], Math.round((data[0] + data[4]) / 2)];
  return {
    statement: `Considère la série triée ${data.join(', ')}. Quelle est la médiane ?`,
    ...buildChoiceSet(`${median}`, wrongs.map((value) => `${value}`)),
    explanation: `Pour 5 valeurs, la médiane est la 3ᵉ, soit ${median}.`,
  };
}

function genQuartile() {
  const data = Array.from({ length: 8 }, () => randInt(5, 25)).sort((a, b) => a - b);
  const q1 = data[2];
  const q3 = data[5];
  const askQ1 = Math.random() < 0.5;
  const correct = askQ1 ? `${q1}` : `${q3}`;
  const wrongs = [askQ1 ? `${q3}` : `${q1}`, `${data[0]}`, `${data[data.length - 1]}`];
  return {
    statement: `Pour la série triée ${data.join(', ')}, quel est ${askQ1 ? 'Q₁' : 'Q₃'} ?`,
    ...buildChoiceSet(correct, wrongs),
    explanation: `Avec 8 valeurs, Q₁ est la 3ᵉ valeur, Q₃ la 6ᵉ : ${askQ1 ? q1 : q3}.`,
  };
}

function genBoxPlotComparison() {
  const medA = randInt(10, 15);
  const medB = medA + randInt(-2, 3);
  const spreadA = randInt(6, 12);
  const spreadB = spreadA + randInt(-3, 5);
  const correct = medA > medB ? 'La boîte A a une médiane plus grande.' : 'La boîte B a une médiane plus grande.';
  const wrongs = ['Les deux médianes sont identiques.', 'On ne peut rien conclure.', 'La médiane la plus faible correspond à la plus grande dispersion.'];
  return {
    statement: `Deux boîtes à moustaches montrent les médianes ${medA} et ${medB} et les amplitudes interquartiles ${spreadA} et ${spreadB}. Que peut-on affirmer ?`,
    ...buildChoiceSet(correct, wrongs),
    explanation: `On lit les médianes (trait central) et les largeurs des boîtes pour comparer position et dispersion.`,
  };
}

function genDiagramReading() {
  const cats = ['A', 'B', 'C'];
  const values = cats.map(() => randInt(10, 30));
  const maxIndex = values.indexOf(Math.max(...values));
  const statement = `Dans un diagramme en bâtons (valeurs : A=${values[0]}, B=${values[1]}, C=${values[2]}), quelle catégorie domine ?`;
  const wrongs = cats.filter((_, index) => index !== maxIndex).map((label) => `Catégorie ${label}`);
  return {
    statement,
    ...buildChoiceSet(`Catégorie ${cats[maxIndex]}`, wrongs),
    explanation: `On repère la barre la plus haute : catégorie ${cats[maxIndex]} avec ${values[maxIndex]} unités.`,
  };
}

function genGraphToData() {
  const total = randInt(40, 80);
  const portion = randInt(5, 20);
  const frequency = portion / total;
  const wrongs = [`${portion}`, `${total - portion}`, `${(frequency * 50).toFixed(1)}%`];
  return {
    statement: `Dans un histogramme représentant ${total} élèves, la classe 10-20 compte ${portion} élèves. Quelle fréquence associer à cette classe ?`,
    ...buildChoiceSet(frequency.toFixed(2), wrongs.map((v) => (typeof v === 'string' ? v : `${v}`))),
    explanation: `Fréquence = effectif/total = ${portion}/${total} = ${frequency.toFixed(2)}.`,
  };
}

function genScatterTrend() {
  const trend = randomItem(['positive', 'négative']);
  const statement = `Un nuage de points montre une tendance ${trend}. Que peut-on dire ?`;
  const correct = trend === 'positive' ? 'Lorsque x augmente, y augmente.' : 'Lorsque x augmente, y diminue.';
  const wrongs = ['Les points sont parfaitement alignés.', 'Il n’y a aucune corrélation.', 'Les valeurs de y sont constantes.'];
  return {
    statement,
    ...buildChoiceSet(correct, wrongs),
    explanation: `Tendance ${trend} ⇒ corrélation ${trend === 'positive' ? 'positive' : 'négative'}.`,
  };
}

const statisticsQuestions = [
  genMeanValue,
  genMedian,
  genQuartile,
  genBoxPlotComparison,
  genDiagramReading,
  genGraphToData,
  genScatterTrend,
];

function genBagProbability() {
  const red = randInt(2, 6);
  const blue = randInt(2, 6);
  const total = red + blue;
  const wrongs = [`${blue}/${total}`, `${red}/${blue}`, `${red + blue}`];
  return {
    statement: `Un sac contient ${red} boules rouges et ${blue} bleues. Probabilité de tirer une rouge ?`,
    ...buildChoiceSet(`${red}/${total}`, wrongs),
    explanation: `p(rouge) = effectif favorable / total = ${red}/${total}.`,
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

function genTreeProbability() {
  const pA = randInt(2, 8) / 10;
  const pBgivenA = randInt(3, 8) / 10;
  const pBgivenNotA = randInt(1, 6) / 10;
  const prob = (pA * pBgivenA + (1 - pA) * pBgivenNotA).toFixed(2);
  const wrongs = [pBgivenA.toFixed(2), pA.toFixed(2), pBgivenNotA.toFixed(2)];
  return {
    statement: `Dans un arbre pondéré, P(A) = ${pA.toFixed(2)}, P(B|A) = ${pBgivenA.toFixed(2)} et P(B|Ā) = ${pBgivenNotA.toFixed(
      2,
    )}. Quelle est P(B) ?`,
    ...buildChoiceSet(prob, wrongs),
    explanation: `P(B) = P(A)P(B|A) + P(Ā)P(B|Ā) = ${prob}.`,
  };
}

function genConditionalFromTable() {
  const total = randInt(80, 120);
  const row = randInt(30, 60);
  const success = randInt(10, row - 5);
  const prob = (success / row).toFixed(2);
  const wrongs = [(success / total).toFixed(2), (row / total).toFixed(2), (1 - success / row).toFixed(2)];
  return {
    statement: `Dans un tableau croisé, ${row} élèves suivent l'option A dont ${success} réussissent. Quelle est P(Réussite | A) ?`,
    ...buildChoiceSet(prob, wrongs),
    explanation: `P(R|A) = effectif (R ∩ A) / effectif(A) = ${success}/${row} = ${prob}.`,
  };
}

function genSumEvent() {
  const die = randInt(4, 6);
  const sought = randInt(2, die);
  const prob = (1 / die).toFixed(2);
  const wrongs = [(1 / (die - 1)).toFixed(2), `${sought}/${die}`, `${die}/${sought}`];
  return {
    statement: `On lance un dé ${die}-faces équilibré. Probabilité d'obtenir ${sought} ?`,
    ...buildChoiceSet(prob, wrongs),
    explanation: `Cas équiprobables ⇒ P = 1/${die} = ${prob}.`,
  };
}

function genConditionalFromTree() {
  const pA = randInt(2, 9) / 10;
  const pBgivenA = randInt(2, 9) / 10;
  const pBgivenNotA = randInt(2, 9) / 10;
  const numerator = pA * pBgivenA;
  const denominator = numerator + (1 - pA) * pBgivenNotA;
  const prob = (numerator / denominator).toFixed(2);
  const wrongs = [pBgivenA.toFixed(2), pA.toFixed(2), (1 - prob).toFixed(2)];
  return {
    statement: `On sait que P(A) = ${pA.toFixed(2)}, P(B|A) = ${pBgivenA.toFixed(2)} et P(B|Ā) = ${pBgivenNotA.toFixed(2)}. Quelle est P(A|B) ?`,
    ...buildChoiceSet(prob, wrongs),
    explanation: `Bayes : P(A|B) = P(A∩B)/P(B) = ${prob}.`,
  };
}

function genNotationQuestion() {
  const correct = 'P(A ∩ B) = P(A) × P(B|A)';
  const wrongs = ['P(B|A) = P(A)/P(B)', 'P(A) = P(A ∩ B) + P(B)', 'P(A ∪ B) = P(A)P(B)'];
  return {
    statement: 'Quelle relation relie correctement P(A), P(B|A) et P(A ∩ B) ?',
    ...buildChoiceSet(correct, wrongs),
    explanation: `Par définition, P(A ∩ B) = P(A) × P(B|A).`,
  };
}

const probabilityQuestions = [
  genBagProbability,
  genComplementaryEvent,
  genIndependentEvents,
  genTreeProbability,
  genConditionalFromTable,
  genSumEvent,
  genConditionalFromTree,
  genNotationQuestion,
];

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
  const pool = [];
  let lastGenerator = null;
  for (let i = 0; i < count; i += 1) {
    if (pool.length === 0) {
      pool.push(...shuffle(bank));
    }
    let generator = pool.shift();
    if (generator === lastGenerator && bank.length > 1) {
      pool.push(generator);
      generator = pool.shift();
    }
    questions.push(generator());
    lastGenerator = generator;
  }
  return questions;
}
