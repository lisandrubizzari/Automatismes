import {
  pickSimpleInteger as simpleInt,
  shuffle,
  buildChoiceSet,
  formatSigned,
  simplifyFraction,
  simplifySqrt,
  formatExponent,
  validateChoices,
  roundTo,
  formatProbability,
} from './utils.js';

const DECIMALS = { minimumFractionDigits: 0, maximumFractionDigits: 2 };

const formatNumber = (value, options = DECIMALS) => value.toLocaleString('fr-FR', options);

function binomialCoefficient(n, k) {
  let numerator = 1;
  let denominator = 1;
  for (let i = 1; i <= k; i += 1) {
    numerator *= n - (i - 1);
    denominator *= i;
  }
  return numerator / denominator;
}

function randomItem(list) {
  return list[simpleInt(0, list.length - 1)];
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
  const gridLinesX = Array.from({ length: xMax - xMin + 1 }, (_, i) => xMin + i).map((x) => {
    const pos = mapX(x).toFixed(2);
    const isAxis = Math.abs(x) < 1e-6;
    return `<line x1="${pos}" y1="0" x2="${pos}" y2="${height}" stroke="${isAxis ? '#94a3b8' : '#e2e8f0'}" stroke-width="${
      isAxis ? '0.8' : '0.6'
    }" />`;
  });
  const gridLinesY = Array.from({ length: yMax - yMin + 1 }, (_, i) => yMin + i).map((y) => {
    const pos = mapY(y).toFixed(2);
    const isAxis = Math.abs(y) < 1e-6;
    return `<line x1="0" y1="${pos}" x2="${width}" y2="${pos}" stroke="${isAxis ? '#94a3b8' : '#e2e8f0'}" stroke-width="${
      isAxis ? '0.8' : '0.6'
    }" />`;
  });
  const path = `M ${mapX(xMin).toFixed(2)} ${mapY(a * xMin + b).toFixed(2)} L ${mapX(xMax).toFixed(2)} ${mapY(
    a * xMax + b,
  ).toFixed(2)}`;
  return `
    <svg class="mini-graph" viewBox="0 0 ${width} ${height}" role="img" aria-label="Mini graphique de la droite y = ${a}x ${
      b >= 0 ? '+ ' : '- '
    }${Math.abs(b)}">
      ${gridLinesX.join('\n      ')}
      ${gridLinesY.join('\n      ')}
      <path d="${path}" stroke="#6366f1" stroke-width="2" fill="none" />
    </svg>
  `;
}

function genLinearEquation() {
  const a = simpleInt(2, 9);
  const x = simpleInt(-5, 5);
  const b = simpleInt(-10, 10);
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
  const q1 = simpleInt(2, 9);
  const q2 = simpleInt(2, 9);
  const n1 = simpleInt(1, q1 - 1);
  const n2 = simpleInt(1, q2 - 1);
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
  const allowedBases = [2, 3, 4, 5, 10];
  const base = randomItem(allowedBases);
  let m = simpleInt(1, 2);
  let n = simpleInt(1, 2);
  while (m + n > 3) {
    m = simpleInt(1, 2);
    n = simpleInt(1, 2);
  }
  const correctExponent = m + n;
  const correct = formatExponent(base, correctExponent);
  const wrongs = [
    formatExponent(base, m * n > 3 ? 3 : m * n),
    formatExponent(base, Math.max(1, Math.abs(m - n))),
    formatExponent(base + m > 10 ? base : base + m, n),
  ];
  return {
    statement: `Simplifier ${formatExponent(base, m)} × ${formatExponent(base, n)}.`,
    ...buildChoiceSet(correct, wrongs),
    explanation: `Même base ⇒ on additionne les exposants : ${m} + ${n} = ${correctExponent}.`,
  };
}

function genMentalMath() {
  const a = simpleInt(20, 80);
  const b = simpleInt(5, 30);
  const sign = Math.random() < 0.5 ? '+' : '-';
  const result = sign === '+' ? a + b : a - b;
  const wrongs = [result + simpleInt(-5, 5), result + simpleInt(6, 12), result - simpleInt(6, 12)];
  return {
    statement: `Calculer mentalement ${a} ${sign} ${b}.`,
    ...buildChoiceSet(`${result}`, wrongs.map((value) => `${value}`)),
    explanation: `On applique l'opération directe : ${a} ${sign} ${b} = ${result}.`,
  };
}

function genCompareNumbers() {
  const a = simpleInt(-20, 40) / 2;
  const b = simpleInt(-20, 40) / 2;
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

function genCompareViaComputation() {
  const useDifference = Math.random() < 0.5;
  if (useDifference) {
    const a1 = simpleInt(20, 90) / 2;
    const b1 = simpleInt(5, 40) / 2;
    const a2 = simpleInt(10, 80) / 2;
    const b2 = simpleInt(5, 35) / 2;
    const valueLeft = a1 - b1;
    const valueRight = a2 - b2;
    const leftExpr = `${formatNumber(a1)} - ${formatNumber(b1)}`;
    const rightExpr = `${formatNumber(a2)} - ${formatNumber(b2)}`;
    const correct =
      valueLeft > valueRight
        ? `${leftExpr} > ${rightExpr}`
        : valueLeft < valueRight
        ? `${leftExpr} < ${rightExpr}`
        : `${leftExpr} = ${rightExpr}`;
    const wrongs = [
      `${leftExpr} > ${rightExpr}`,
      `${leftExpr} < ${rightExpr}`,
      `${leftExpr} = ${rightExpr}`,
    ].filter((choice) => choice !== correct);
    return {
      statement: 'Comparer les deux différences suivantes :',
      ...buildChoiceSet(correct, wrongs),
      explanation: `${leftExpr} = ${formatNumber(valueLeft)} et ${rightExpr} = ${formatNumber(
        valueRight,
      )} ⇒ ${correct}.`,
    };
  }
  const numerator1 = simpleInt(8, 24);
  const denominator1 = simpleInt(2, 8);
  const numerator2 = simpleInt(8, 24);
  const denominator2 = simpleInt(2, 8);
  const valueLeft = numerator1 / denominator1;
  const valueRight = numerator2 / denominator2;
  const leftExpr = `${formatNumber(numerator1)} ÷ ${formatNumber(denominator1)}`;
  const rightExpr = `${formatNumber(numerator2)} ÷ ${formatNumber(denominator2)}`;
  const correct =
    valueLeft > valueRight
      ? `${leftExpr} > ${rightExpr}`
      : valueLeft < valueRight
      ? `${leftExpr} < ${rightExpr}`
      : `${leftExpr} = ${rightExpr}`;
  const wrongs = [
    `${leftExpr} > ${rightExpr}`,
    `${leftExpr} < ${rightExpr}`,
    `${leftExpr} = ${rightExpr}`,
  ].filter((choice) => choice !== correct);
  return {
    statement: 'Comparer les quotients (strictement positifs) ci-dessous :',
    ...buildChoiceSet(correct, wrongs),
    explanation: `${leftExpr} = ${formatNumber(valueLeft)} et ${rightExpr} = ${formatNumber(
      valueRight,
    )} ⇒ ${correct}.`,
  };
}

function genDecimalFractionConversion() {
  const denominator = randomItem([4, 5, 8, 10, 20, 25]);
  const numerator = simpleInt(1, denominator - 1);
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
  const percent = simpleInt(5, 95);
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

function genFractionOperations() {
  const denominator1 = simpleInt(2, 9);
  const denominator2 = simpleInt(2, 9);
  const numerator1 = simpleInt(1, denominator1 - 1);
  const numerator2 = simpleInt(1, denominator2 - 1);
  const op = randomItem(['sub', 'mul', 'div', 'compare']);
  if (op === 'compare') {
    const left = numerator1 / denominator1;
    const right = numerator2 / denominator2;
    const leftExpr = `${numerator1}/${denominator1}`;
    const rightExpr = `${numerator2}/${denominator2}`;
    const correct =
      left > right
        ? `${leftExpr} > ${rightExpr}`
        : left < right
        ? `${leftExpr} < ${rightExpr}`
        : `${leftExpr} = ${rightExpr}`;
    const wrongs = [
      `${leftExpr} > ${rightExpr}`,
      `${leftExpr} < ${rightExpr}`,
      `${leftExpr} = ${rightExpr}`,
    ].filter((choice) => choice !== correct);
    return {
      statement: `Comparer les fractions ${leftExpr} et ${rightExpr}.`,
      ...buildChoiceSet(correct, wrongs),
      explanation: `On compare en croisant : ${numerator1}×${denominator2} = ${numerator1 * denominator2} et ${numerator2}×${
        denominator1
      } = ${numerator2 * denominator1} ⇒ ${correct}.`,
    };
  }
  let numerator;
  let denominator;
  let statement;
  if (op === 'sub') {
    statement = `Calculer ${numerator1}/${denominator1} - ${numerator2}/${denominator2}.`;
    numerator = numerator1 * denominator2 - numerator2 * denominator1;
    denominator = denominator1 * denominator2;
  } else if (op === 'mul') {
    statement = `Calculer ${numerator1}/${denominator1} × ${numerator2}/${denominator2}.`;
    numerator = numerator1 * numerator2;
    denominator = denominator1 * denominator2;
  } else {
    statement = `Calculer ${numerator1}/${denominator1} ÷ ${numerator2}/${denominator2}.`;
    numerator = numerator1 * denominator2;
    denominator = denominator1 * numerator2;
  }
  const simplified = simplifyFraction(numerator, denominator);
  const correct = `${simplified.numerator}/${simplified.denominator}`;
  const wrongs = [
    `${numerator}/${denominator}`,
    `${simplified.denominator}/${simplified.numerator}`,
    `${numerator1 + numerator2}/${denominator1 + denominator2}`,
  ];
  return {
    statement,
    ...buildChoiceSet(correct, wrongs),
    explanation: `On effectue l'opération puis on simplifie : ${numerator}/${denominator} = ${correct}.`,
  };
}

function genOrderOfMagnitude() {
  const a = simpleInt(12, 98);
  const b = simpleInt(12, 98);
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

function genPlausibilityCheck() {
  const distance = simpleInt(60, 400);
  const duration = simpleInt(1, 5);
  const trueSpeed = distance / duration;
  const plausible = Math.random() < 0.5;
  const displayedSpeed = plausible ? trueSpeed : trueSpeed * randomItem([0.1, 10]);
  const correct = plausible ? 'Oui, le résultat est cohérent.' : 'Non, le résultat est invraisemblable.';
  const wrongs = plausible
    ? ['Non, le résultat est invraisemblable.', 'Impossible à vérifier.', 'Oui, car la vitesse dépasse 300 km/h.']
    : ['Oui, le résultat est cohérent.', 'Impossible à vérifier.', 'Non, car la distance est trop courte.'];
  return {
    statement: `Pour un trajet de ${distance} km parcouru en ${duration} h, un élève annonce une vitesse moyenne de ${formatNumber(
      displayedSpeed,
    )} km/h. Ce résultat est-il plausible ?`,
    ...buildChoiceSet(correct, wrongs),
    explanation: `La vitesse moyenne vaut distance ÷ durée = ${distance}/${duration} = ${formatNumber(
      trueSpeed,
    )} km/h ${plausible ? 'donc la valeur est cohérente.' : "et non ${formatNumber(displayedSpeed)} km/h"}.`,
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
  const value = simpleInt(2, 200);
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
  const value = simpleInt(1, 25);
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
  const speed = simpleInt(30, 120);
  const converted = (speed * 1000) / 3600;
  const wrongs = [speed / 3.6, converted * 10, converted / 10];
  return {
    statement: `Convertir ${speed} km/h en m/s.`,
    ...buildChoiceSet(`${formatNumber(converted)} m/s`, wrongs.map((v) => `${formatNumber(v)} m/s`)),
    explanation: `1 km/h = 1000/3600 m/s ⇒ ${speed} km/h = ${formatNumber(converted)} m/s.`,
  };
}

function genUnitConversionVolume() {
  const units = [
    { unit: 'm³', factor: 1 },
    { unit: 'dm³', factor: 0.001 },
    { unit: 'cm³', factor: 0.000001 },
  ];
  const from = randomItem(units);
  let to = randomItem(units);
  while (to.unit === from.unit) {
    to = randomItem(units);
  }
  const value = simpleInt(2, 40);
  const base = value * from.factor;
  const converted = base / to.factor;
  const wrongs = [converted * 1000, converted / 1000, base];
  return {
    statement: `Convertir ${value} ${from.unit} en ${to.unit}.`,
    ...buildChoiceSet(`${formatNumber(converted)} ${to.unit}`, wrongs.map((v) => `${formatNumber(v)} ${to.unit}`)),
    explanation: `Les volumes se convertissent avec un facteur 1000 entre unités successives : ${formatNumber(
      converted,
    )} ${to.unit}.`,
  };
}

function genUnitConversionCapacity() {
  const units = [
    { unit: 'L', factor: 1 },
    { unit: 'cL', factor: 0.01 },
    { unit: 'mL', factor: 0.001 },
  ];
  const from = randomItem(units);
  let to = randomItem(units);
  while (to.unit === from.unit) {
    to = randomItem(units);
  }
  const value = simpleInt(5, 150);
  const base = value * from.factor;
  const converted = base / to.factor;
  const wrongs = [converted * 10, converted / 10, base];
  return {
    statement: `Convertir ${value} ${from.unit} en ${to.unit}.`,
    ...buildChoiceSet(`${formatNumber(converted)} ${to.unit}`, wrongs.map((v) => `${formatNumber(v)} ${to.unit}`)),
    explanation: `On convertit en litres puis dans l'unité cible : ${formatNumber(converted)} ${to.unit}.`,
  };
}

function genUnitConversionDuration() {
  const units = [
    { unit: 'h', factor: 3600 },
    { unit: 'min', factor: 60 },
    { unit: 's', factor: 1 },
  ];
  const from = randomItem(units);
  let to = randomItem(units);
  while (to.unit === from.unit) {
    to = randomItem(units);
  }
  const value = simpleInt(1, 180);
  const seconds = value * from.factor;
  const converted = seconds / to.factor;
  const wrongs = [converted * 60, converted / 60, seconds];
  return {
    statement: `Convertir ${value} ${from.unit} en ${to.unit}.`,
    ...buildChoiceSet(`${formatNumber(converted)} ${to.unit}`, wrongs.map((v) => `${formatNumber(v)} ${to.unit}`)),
    explanation: `On passe par les secondes : ${value} ${from.unit} = ${seconds} s = ${formatNumber(converted)} ${to.unit}.`,
  };
}

function genUnitConversionMass() {
  const units = [
    { unit: 't', factor: 1000 },
    { unit: 'kg', factor: 1 },
    { unit: 'g', factor: 0.001 },
    { unit: 'mg', factor: 0.000001 },
  ];
  const from = randomItem(units);
  let to = randomItem(units);
  while (to.unit === from.unit) {
    to = randomItem(units);
  }
  const value = simpleInt(2, 500);
  const base = value * from.factor;
  const converted = base / to.factor;
  const wrongs = [converted * 1000, converted / 1000, base];
  return {
    statement: `Convertir ${value} ${from.unit} en ${to.unit}.`,
    ...buildChoiceSet(`${formatNumber(converted)} ${to.unit}`, wrongs.map((v) => `${formatNumber(v)} ${to.unit}`)),
    explanation: `On passe par le kilogramme comme unité pivot : ${formatNumber(converted)} ${to.unit}.`,
  };
}

function genZeroProductEquation() {
  const a = simpleInt(-6, 6) || 2;
  const b = simpleInt(-6, 6) || -3;
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
  const base = simpleInt(6, 20);
  const height = simpleInt(4, 12);
  const area = (base * height) / 2;
  const wrongs = [base * height, (base + height) / 2, base + height];
  return {
    statement: `Calculer l'aire d'un triangle de base ${base} cm et de hauteur ${height} cm.`,
    ...buildChoiceSet(`${area} cm²`, wrongs.map((v) => `${v} cm²`)),
    explanation: `A = (b × h)/2 = (${base} × ${height})/2 = ${area} cm².`,
  };
}

function genSquareEquation() {
  const value = simpleInt(2, 8);
  const square = value * value;
  return {
    statement: `Résoudre x² = ${square}.`,
    ...buildChoiceSet(`x = ±${value}`, [`x = ${value}`, `x = ${square}`, `x = ±${square}`]),
    explanation: `x² = ${square} ⇒ x = ${value} ou x = -${value}.`,
  };
}

function genRationalEquation() {
  const a = simpleInt(6, 30);
  const b = simpleInt(2, 6);
  return {
    statement: `Résoudre ${a}/x = ${b}.`,
    ...buildChoiceSet(`x = ${a / b}`, [`x = ${a * b}`, `x = ${b / a}`, `x = ${a - b}`]),
    explanation: `${a}/x = ${b} ⇒ x = ${a}/${b} = ${a / b}.`,
  };
}

function genDevelopIdentity() {
  const a = simpleInt(2, 6);
  const identity = randomItem([
    { expr: `(x + ${a})²`, expanded: `x² + ${2 * a}x + ${a * a}` },
    { expr: `(x - ${a})²`, expanded: `x² - ${2 * a}x + ${a * a}` },
    { expr: `(x + ${a})(x - ${a})`, expanded: `x² - ${a * a}` },
  ]);
  const wrongs = [
    `x² + ${a}x + ${a * a}`,
    `x² - ${a * a}`,
    `x² + ${2 * a}x - ${a * a}`,
  ].filter((value) => value !== identity.expanded);
  return {
    statement: `Développer ${identity.expr}.`,
    ...buildChoiceSet(identity.expanded, wrongs),
    explanation: `Identité remarquable appliquée : ${identity.expr} = ${identity.expanded}.`,
  };
}

function genFactorizeIdentityForms() {
  const a = simpleInt(2, 8);
  const b = simpleInt(1, 7);
  const scenarios = [
    {
      expr: `${a * a} - ${b * b}`,
      factorized: `(${a} - ${b})(${a} + ${b})`,
      wrongs: [`(${a} - ${b})²`, `(${a} + ${b})²`, `${a * a} + ${b * b}`],
      explanation: `a² - b² = (a - b)(a + b).`,
    },
    {
      expr: `${a * a} + ${2 * a * b}x + ${b * b}x²`,
      factorized: `(${a} + ${b}x)²`,
      wrongs: [`(${a} - ${b}x)²`, `${a * a} + ${b * b}x²`, `${a}x + ${b}`],
      explanation: `a² + 2ab + b² = (a + b)² appliqué à ${a} + ${b}x.`,
    },
    {
      expr: `${a * a} - ${2 * a * b}x + ${b * b}x²`,
      factorized: `(${a} - ${b}x)²`,
      wrongs: [`(${a} + ${b}x)²`, `${a * a} - ${b * b}x²`, `${a} - ${b}x`],
      explanation: `a² - 2ab + b² = (a - b)² appliqué à ${a} - ${b}x.`,
    },
  ];
  const scenario = randomItem(scenarios);
  return {
    statement: `Factoriser ${scenario.expr}.`,
    ...buildChoiceSet(scenario.factorized, scenario.wrongs),
    explanation: scenario.explanation,
  };
}

function genLiteralSigns() {
  const a = simpleInt(2, 9);
  const b = simpleInt(1, 8);
  const scenarios = [
    {
      statement: `Simplifier -(x + ${a}).`,
      correct: `-x - ${a}`,
      wrongs: [`x - ${a}`, `-x + ${a}`, `${a} - x`],
    },
    {
      statement: `Développer -(x - ${b}).`,
      correct: `${b} - x`,
      wrongs: [`-x - ${b}`, `x - ${b}`, `${b} + x`],
    },
    {
      statement: `Que vaut (-1) × (${a}x) ?`,
      correct: `-${a}x`,
      wrongs: [`${a}x`, `${a} - x`, `${a}`],
    },
    {
      statement: `Quel est l'inverse de ${a}?`,
      correct: `1/${a}`,
      wrongs: [`-1/${a}`, `${a}`, `${a}²`],
    },
  ];
  const chosen = randomItem(scenarios);
  return {
    statement: chosen.statement,
    ...buildChoiceSet(chosen.correct, chosen.wrongs),
    explanation: 'On applique les règles de signe et les inverses listés dans le BO.',
  };
}

function genFactorizeCommonTerm() {
  const a = simpleInt(2, 8);
  const b = simpleInt(2, 8);
  const useSquare = Math.random() < 0.5;
  const expression = useSquare
    ? `${a}x² + ${b}x`
    : `${a}x + ${b}x`;
  const factorized = useSquare ? `x(${a}x + ${b})` : `(${a + b})x`;
  const wrongs = useSquare
    ? [`(${a} + ${b})x`, `${a}x + ${b}`, `x(${a + b})`]
    : [`${a + b}x²`, `x(${a} + ${b})`, `${a}x + ${b}x`];
  return {
    statement: `Factoriser ${expression}.`,
    ...buildChoiceSet(factorized, wrongs),
    explanation: `On met ${useSquare ? 'x' : 'x'} en facteur commun et on obtient ${factorized}.`,
  };
}

function genFactorizeQuadratic() {
  const root1 = simpleInt(-5, 5) || 1;
  const root2 = simpleInt(-5, 5) || -2;
  const b = -(root1 + root2);
  const c = root1 * root2;
  const expression = `x² ${formatSigned(b)}x ${formatSigned(c)}`;
  const factorized = `(x ${formatSigned(-root1)})(x ${formatSigned(-root2)})`;
  const wrongs = [
    `(x ${formatSigned(root1)})(x ${formatSigned(root2)})`,
    `(x ${formatSigned(-root1)})(x ${formatSigned(root2)})`,
    `x(x ${formatSigned(b)}) + ${c}`,
  ];
  return {
    statement: `Factoriser ${expression}.`,
    ...buildChoiceSet(factorized, wrongs),
    explanation: `On cherche deux nombres dont la somme vaut ${-b} et le produit ${c} : ${root1} et ${root2}.`,
  };
}

function genLinearInequality() {
  const a = simpleInt(-6, 6) || -3;
  const b = simpleInt(-8, 8);
  const c = simpleInt(-6, 10);
  const inequality = randomItem(['<', '>']);
  const rhs = c - b;
  const rawSolution = rhs / a;
  const needsFlip = a < 0;
  const symbol = needsFlip ? (inequality === '<' ? '>' : '<') : inequality;
  const solution = `x ${symbol} ${rawSolution.toFixed(1)}`;
  const wrongs = [
    `x ${inequality} ${rawSolution.toFixed(1)}`,
    `x ${symbol} ${(-rawSolution).toFixed(1)}`,
    `x = ${rawSolution.toFixed(1)}`,
  ];
  const statement = `Résoudre ${a}x ${formatSigned(b)} ${inequality} ${c}.`;
  return {
    statement,
    ...buildChoiceSet(solution, wrongs),
    explanation: `On isole x : ${a}x ${inequality} ${rhs} ⇒ ${needsFlip ? 'division par un nombre négatif, on inverse le sens' : ''} ${
      solution
    }.`,
  };
}

function genSignFirstDegree() {
  const slope = simpleInt(-5, 5) || 2;
  const intercept = simpleInt(-6, 6);
  const root = -intercept / slope;
  const statement = `Donner le signe de f(x) = ${slope}x ${formatSigned(intercept)}.`;
  const correct =
    slope > 0
      ? `f(x) > 0 pour x > ${root.toFixed(1)} et f(x) < 0 pour x < ${root.toFixed(1)}.`
      : `f(x) > 0 pour x < ${root.toFixed(1)} et f(x) < 0 pour x > ${root.toFixed(1)}.`;
  const wrongs = [
    'f(x) garde toujours le même signe.',
    slope > 0
      ? `f(x) > 0 pour x < ${root.toFixed(1)}.`
      : `f(x) > 0 pour x > ${root.toFixed(1)}.`,
    `Le signe dépend uniquement du coefficient directeur.`,
  ];
  return {
    statement,
    ...buildChoiceSet(correct, wrongs),
    explanation: `La racine vaut -b/a = ${root.toFixed(1)} puis on étudie les intervalles selon le signe de ${slope}.`,
  };
}

const calculQuestions = [
  genLinearEquation,
  genFractionSum,
  genFractionOperations,
  genPowerRule,
  genMentalMath,
  genCompareNumbers,
  genCompareViaComputation,
  genDecimalFractionConversion,
  genPercentToDecimal,
  genOrderOfMagnitude,
  genPlausibilityCheck,
  genUnitConversionLength,
  genUnitConversionArea,
  genUnitConversionSpeed,
  genUnitConversionVolume,
  genUnitConversionCapacity,
  genUnitConversionDuration,
  genUnitConversionMass,
  genZeroProductEquation,
  genIsolateVariable,
  genFormulaApplication,
  genSquareEquation,
  genRationalEquation,
  genDevelopIdentity,
  genFactorizeIdentityForms,
  genLiteralSigns,
  genFactorizeCommonTerm,
  genFactorizeQuadratic,
  genLinearInequality,
  genSignFirstDegree,
];

function genPercentOfValue() {
  const base = simpleInt(80, 350);
  const rate = simpleInt(5, 40);
  const result = Math.round((rate / 100) * base);
  const wrongs = [result + simpleInt(5, 25), Math.round(base / rate), Math.round(base * (1 + rate / 100))];
  return {
    statement: `Combien vaut ${rate}% de ${base} ?`,
    ...buildChoiceSet(`${result}`, wrongs.map((v) => `${v}`)),
    explanation: `${rate}% de ${base} = ${base} × ${rate}/100 = ${result}.`,
  };
}

function genUnitRate() {
  const quantity = simpleInt(3, 8);
  const price = simpleInt(6, 20);
  const total = quantity * price;
  const wrongs = [`${price}`, `${total / (quantity + 1)}`, `${total}`];
  return {
    statement: `${quantity} articles coûtent ${total} €. Quel est le prix unitaire ?`,
    ...buildChoiceSet(`${price} €`, wrongs.map((value) => `${value} €`)),
    explanation: `Prix unitaire = ${total} / ${quantity} = ${price} €.`,
  };
}

function genScaleRecipe() {
  const persons = simpleInt(2, 6);
  const amount = simpleInt(200, 500);
  const target = persons + simpleInt(2, 4);
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
  const rate = simpleInt(3, 25);
  const coeff = (100 + rate) / 100;
  const wrongs = [rate / 100, 1 - rate / 100, rate];
  return {
    statement: `Quel est le coefficient multiplicateur correspondant à une hausse de ${rate}% ?`,
    ...buildChoiceSet(coeff.toFixed(2), wrongs.map((v) => (typeof v === 'number' && v.toFixed ? v.toFixed(2) : `${v}`))),
    explanation: `Hausse de ${rate}% ⇒ coefficient = 1 + ${rate}/100 = ${coeff.toFixed(2)}.`,
  };
}

function pickCoherentShare() {
  let total = 0;
  let part = 0;
  do {
    total = simpleInt(40, 90);
    part = simpleInt(5, total - 8);
  } while (part <= 0 || part >= total || (part / total) * 100 >= 95);
  return { part, total };
}

function genExpressProportion() {
  const { part, total } = pickCoherentShare();
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
  const rate = simpleInt(10, 60);
  const part = simpleInt(20, 150);
  const total = Math.round((part * 100) / rate);
  const wrongs = [part + rate, part * rate, Math.round(part / (rate / 100 + 1))];
  return {
    statement: `${part} représente ${rate}% d'un montant. Quel est le total ?`,
    ...buildChoiceSet(`${total}`, wrongs.map((v) => `${v}`)),
    explanation: `Total = ${part} / (${rate}/100) = ${total}.`,
  };
}

function genTableProportion() {
  const x1 = simpleInt(2, 8);
  const y1 = simpleInt(10, 40);
  const ratio = y1 / x1;
  const x2 = simpleInt(5, 12);
  const y2 = Math.round(x2 * ratio);
  const wrongs = [x2 + y1, y1, Math.round(y2 / 2)];
  return {
    statement: `Dans un tableau de proportionnalité, ${x1} correspond à ${y1}. Quelle valeur correspond à ${x2} ?`,
    ...buildChoiceSet(`${y2}`, wrongs.map((v) => `${v}`)),
    explanation: `Coefficient = ${ratio.toFixed(2)} ⇒ ${y2} = ${x2} × ${ratio.toFixed(2)}.`,
  };
}

function genRatioComparison() {
  const juice = simpleInt(1, 4);
  const water = simpleInt(2, 6);
  const mixA = juice / water;
  const juiceB = juice + simpleInt(1, 3);
  const waterB = water + simpleInt(1, 3);
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
  const rate = simpleInt(2, 30);
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
  const initial = simpleInt(120, 900);
  const rate = simpleInt(5, 35);
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
  const initial = simpleInt(150, 700);
  const rate = simpleInt(5, 30);
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
  const a = simpleInt(-20, 30);
  const b = simpleInt(-20, 30);
  const coeff = (1 + a / 100) * (1 + b / 100);
  const rate = Math.round((coeff - 1) * 100);
  const wrongs = [`${a + b} %`, `${a * b} %`, `${rate + simpleInt(-6, 6)} %`];
  return {
    statement: `On applique successivement ${a}% puis ${b}%. Quel est le taux global ?`,
    ...buildChoiceSet(`${rate} %`, wrongs),
    explanation: `Coeff global = (1 + ${a}/100)(1 + ${b}/100) = ${coeff.toFixed(3)} ⇒ taux ${rate}%.`,
  };
}

function genReciprocal() {
  const rate = simpleInt(5, 35);
  const coeff = 1 + rate / 100;
  const reciprocal = roundTo((1 / coeff - 1) * 100);
  const wrongs = [`-${rate} %`, `${rate} %`, `${roundTo(reciprocal / 2)} %`];
  return {
    statement: `Après une hausse de ${rate}%, de combien doit-on faire varier pour revenir à l'initial ? (arrondir à 0,1%)`,
    ...buildChoiceSet(`${reciprocal} %`, wrongs),
    explanation: `Coeff retour = 1/${coeff.toFixed(2)} ⇒ taux ${reciprocal}% (arrondi à 0,1%).`,
  };
}

function genRateFromValues() {
  const initial = simpleInt(80, 220);
  const final = simpleInt(80, 220);
  const rate = ((final - initial) / initial) * 100;
  const wrongs = [`${final - initial}`, `${initial / final} %`, `${Math.abs(initial - final)} %`];
  return {
    statement: `La grandeur passe de ${initial} à ${final}. Quel est le taux d'évolution ?`,
    ...buildChoiceSet(`${Math.round(rate)} %`, wrongs),
    explanation: `t = (VF - VI)/VI = (${final} - ${initial})/${initial} = ${Math.round(rate)}%.`,
  };
}

function genMultipleVariations() {
  const rates = [simpleInt(-15, 20), simpleInt(-15, 20), simpleInt(-15, 20)];
  const coeff = rates.reduce((acc, r) => acc * (1 + r / 100), 1);
  const rate = Math.round((coeff - 1) * 100);
  const wrongs = [`${rates.reduce((a, b) => a + b, 0)} %`, `${Math.max(...rates)} %`, `${rate + simpleInt(-5, 5)} %`];
  return {
    statement: `On applique successivement ${rates.map((r) => `${r}%`).join(', ')}. Quel est le taux global ?`,
    ...buildChoiceSet(`${rate} %`, wrongs),
    explanation: `Coeff global = Π(1 + tᵢ) = ${coeff.toFixed(3)} ⇒ ${rate}%.`,
  };
}

function genValueAfterMixedVariations() {
  const initial = simpleInt(200, 600);
  const rateA = simpleInt(-20, 20);
  const rateB = simpleInt(-20, 20);
  const final = Math.round(initial * (1 + rateA / 100) * (1 + rateB / 100));
  const wrongs = [`${initial + rateA + rateB}`, `${Math.round(initial * (1 + (rateA + rateB) / 100))}`, `${initial}`];
  return {
    statement: `Une valeur ${rateA > 0 ? 'augmente' : 'diminue'} de ${Math.abs(rateA)}% puis ${rateB > 0 ? 'augmente' : 'diminue'} de ${Math.abs(rateB)}%. Quelle valeur finale pour ${initial} ?`,
    ...buildChoiceSet(`${final}`, wrongs),
    explanation: `VF = ${initial} × (1 + ${rateA}/100)(1 + ${rateB}/100) = ${final}.`,
  };
}

function genInitialAfterDecrease() {
  const rate = simpleInt(5, 30);
  const coeff = 1 - rate / 100;
  const initial = simpleInt(200, 800);
  const final = Math.round(initial * coeff);
  const wrongs = [`${final}`, `${final + rate}`, `${Math.round(initial * (1 + rate / 100))}`];
  return {
    statement: `Après une baisse de ${rate}%, la valeur finale est ${final}. Quelle valeur initiale ?`,
    ...buildChoiceSet(`${initial}`, wrongs),
    explanation: `VI = ${final} / (1 - ${rate}/100) = ${initial}.`,
  };
}

function genIndiceBase() {
  const baseYear = simpleInt(2018, 2022);
  const baseValue = simpleInt(80, 140);
  const rate = simpleInt(-15, 30);
  const currentYear = baseYear + simpleInt(1, 3);
  const currentValue = Math.round(baseValue * (1 + rate / 100));
  const index = Math.round((currentValue / baseValue) * 100);
  const wrongs = [`${100 + rate}`, `${currentValue}`, `${Math.round((baseValue / currentValue) * 100)}`];
  return {
    statement: `En ${baseYear}, une production vaut ${baseValue}. En ${currentYear}, elle vaut ${currentValue}. Quel est l'indice base 100 en ${currentYear} (base ${baseYear}) ?`,
    ...buildChoiceSet(`${index}`, wrongs.map((value) => `${value}`)),
    explanation: `Indice = (valeur année / valeur base) × 100 = (${currentValue}/${baseValue}) × 100 = ${index}.`,
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
  genIndiceBase,
];

function genEvaluateLinearFunction() {
  const a = simpleInt(-5, 6);
  const b = simpleInt(-8, 8);
  const x = simpleInt(-4, 4);
  const result = a * x + b;
  const wrongs = [a + b + x, a * (x + 1) + b, a * x - b];
  return {
    statement: `Pour f(x) = ${a}x ${b >= 0 ? '+ ' : '- '}${Math.abs(b)}, calculer f(${x}).`,
    ...buildChoiceSet(`${result}`, wrongs.map((value) => `${value}`)),
    explanation: `On remplace x par ${x} : f(${x}) = ${a} × ${x} ${b >= 0 ? '+ ' : '- '}${Math.abs(b)} = ${result}.`,
  };
}

function genSlopeFromTable() {
  const x1 = simpleInt(0, 4);
  const x2 = x1 + simpleInt(1, 4);
  const slope = simpleInt(-3, 5) || 1;
  const y1 = simpleInt(-5, 5);
  const y2 = y1 + slope * (x2 - x1);
  const wrongs = [`${y2 - y1 + 1}`, `${(y2 + y1) / 2}`, `${y2 / (x2 + 1)}`];
  return {
    statement: `On sait que (${x1}; ${y1}) et (${x2}; ${y2}) appartiennent à la droite (d). Quel est son coefficient directeur ?`,
    ...buildChoiceSet(`${slope}`, wrongs.map((value) => `${Math.round(value)}`)),
    explanation: `m = (y₂ - y₁)/(x₂ - x₁) = (${y2} - ${y1})/(${x2} - ${x1}) = ${slope}.`,
  };
}

function genFunctionVariation() {
  const slope = simpleInt(-4, 4) || 2;
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

function genVariationTableReading() {
  const left = simpleInt(-4, -1);
  const pivot = simpleInt(0, 2);
  const right = pivot + simpleInt(2, 4);
  const statement = `Une fonction f est croissante sur [${left} ; ${pivot}] puis décroissante sur [${pivot} ; ${right}]. Que peut-on affirmer ?`;
  const correct = `f admet un maximum en x = ${pivot}.`;
  const wrongs = ['f est décroissante partout.', `f admet un minimum en x = ${pivot}.`, `f est croissante sur [${pivot} ; ${right}].`];
  return {
    statement,
    ...buildChoiceSet(correct, wrongs),
    explanation: `Croissante puis décroissante ⇒ ${pivot} est un point où f change de sens et atteint un maximum.`,
  };
}

function genDerivativeSignInterpretation() {
  const pivot = simpleInt(-1, 3);
  const intervalLength = simpleInt(2, 4);
  const leftBound = pivot - intervalLength;
  const rightBound = pivot + intervalLength;
  const statement = `On sait que f'(x) > 0 pour x ∈ (${leftBound} ; ${pivot}) et f'(x) < 0 pour x ∈ (${pivot} ; ${rightBound}). Quelle conclusion ?`;
  const correct = `f atteint un maximum en x = ${pivot}.`;
  const wrongs = ['f est minimale en x = ${pivot}.', 'f est croissante sur tout ℝ.', 'f est décroissante avant et après ${pivot}.'].map((text) =>
    text.replace('${pivot}', `${pivot}`),
  );
  return {
    statement,
    ...buildChoiceSet(correct, wrongs),
    explanation: `Signe de f' : positif puis négatif ⇒ f est croissante puis décroissante, donc maximum en ${pivot}.`,
  };
}

function genImagePreimage() {
  const a = simpleInt(1, 5);
  const b = simpleInt(-5, 5);
  const x = simpleInt(-4, 6);
  const image = a * x + b;
  const wrongs = [x + a, x - b, image - a];
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
  const a = simpleInt(-4, 4) || -2;
  const b = simpleInt(1, 6);
  const c = simpleInt(-6, -1);
  const statement = `Déterminer le signe de f(x) = ${a}(x ${formatSigned(-b)})(x ${formatSigned(-c)}).`;
  const correct = `Signe de ${a > 0 ? "l'intérieur" : "l'extérieur"} de [${Math.min(b, c)} ; ${Math.max(b, c)}]`;
  const wrongs = ['Toujours positif', 'Toujours négatif', 'Change uniquement en x = 0'];
  return {
    statement,
    ...buildChoiceSet(correct, wrongs),
    explanation: `Les racines sont ${b} et ${c}. Avec le facteur ${a}, on détermine le signe selon les intervalles.`,
  };
}

function genGraphReadValue() {
  const slope = simpleInt(-3, 3) || 2;
  const intercept = simpleInt(-4, 4);
  const xQuery = simpleInt(-3, 3);
  const value = slope * xQuery + intercept;
  const description = `Selon le mini-graphe ci-dessous, quelle est l'image de x = ${xQuery} ?`;
  return {
    statement: description,
    statementHTML: `${description}<br/>${createLineGraph(slope, intercept)}`,
    ...buildChoiceSet(`${value}`, [`${value + simpleInt(1, 3)}`, `${value - simpleInt(1, 3)}`, `${value + slope}`]),
    explanation: `Sur la droite y = ${slope}x ${intercept >= 0 ? '+ ' : '- '}${Math.abs(intercept)}, f(${xQuery}) = ${value}.`,
  };
}

function genGraphSolveZero() {
  const slope = simpleInt(1, 4);
  const intercept = simpleInt(-5, -1);
  const root = -intercept / slope;
  const description = "D'après le graphique, pour quelle valeur de x a-t-on f(x) = 0 ?";
  return {
    statement: description,
    statementHTML: `${description}<br/>${createLineGraph(slope, intercept)}`,
    ...buildChoiceSet(`${root.toFixed(1)}`, [`${(root + 1).toFixed(1)}`, `${(root - 1).toFixed(1)}`, `${intercept}`]),
    explanation: `L'intersection avec l'axe des abscisses se fait en x = -b/a = ${root.toFixed(1)}.`,
  };
}

function genGraphSolveK() {
  const slope = simpleInt(-3, 3) || 2;
  const intercept = simpleInt(-4, 4);
  const xTarget = simpleInt(-3, 3);
  const k = slope * xTarget + intercept;
  const compare = Math.random() < 0.5 ? '=' : '<';
  const description = `D'après le graphique, résoudre f(x) ${compare} ${k}.`;
  let correct;
  let wrongs;
  if (compare === '=') {
    correct = `${xTarget}`;
    wrongs = [`${xTarget + 1}`, `${xTarget - 1}`, `${-xTarget}`];
  } else {
    const inequalitySolution = slope > 0 ? `x < ${xTarget}` : `x > ${xTarget}`;
    correct = inequalitySolution;
    wrongs = [
      slope > 0 ? `x > ${xTarget}` : `x < ${xTarget}`,
      `x = ${xTarget}`,
      slope > 0 ? `x < ${xTarget + 1}` : `x > ${xTarget - 1}`,
    ];
  }
  return {
    statement: description,
    statementHTML: `${description}<br/>${createLineGraph(slope, intercept)}`,
    ...buildChoiceSet(correct, wrongs),
    explanation:
      compare === '='
        ? `On lit l'intersection avec la droite horizontale y = ${k}, obtenue pour x = ${xTarget}.`
        : `La droite est ${slope > 0 ? 'croissante' : 'décroissante'} : f(x) < ${k} ⇔ ${correct}.`,
  };
}

function genPointSlopeEquation() {
  const slope = simpleInt(-4, 4) || 1;
  const x0 = simpleInt(-3, 3);
  const y0 = simpleInt(-5, 5);
  const b = y0 - slope * x0;
  const correct = `y = ${slope}x ${b >= 0 ? '+ ' : '- '}${Math.abs(b)}`;
  const wrongs = [`y = ${b}x ${slope >= 0 ? '+ ' : '- '}${Math.abs(slope)}`, `y = ${slope}(x + ${x0})`, `y = ${slope}x`];
  return {
    statement: `Déterminer l'équation réduite de la droite de coefficient directeur ${slope} passant par (${x0}; ${y0}).`,
    ...buildChoiceSet(correct, wrongs),
    explanation: `On calcule b = y₀ - ax₀ = ${y0} - ${slope}×${x0} = ${b}.`,
  };
}

function genPointOnCurve() {
  const a = simpleInt(1, 4);
  const b = simpleInt(-4, 4);
  const c = simpleInt(-3, 5);
  const x0 = simpleInt(-3, 3);
  const belongs = Math.random() < 0.5;
  const yExact = a * x0 * x0 + b * x0 + c;
  const y0 = belongs ? yExact : yExact + simpleInt(1, 4);
  const statement = `Le point (${x0}; ${y0}) appartient-il à la courbe d'équation y = ${a}x² ${formatSigned(b)}x ${formatSigned(c)} ?`;
  const correct = belongs ? 'Oui' : 'Non';
  const wrongs = belongs ? ['Non', 'Impossible à dire', 'Oui, uniquement si x > 0'] : ['Oui', 'Impossible à dire', 'Toujours'];
  return {
    statement,
    ...buildChoiceSet(correct, wrongs),
    explanation: `On calcule f(${x0}) = ${a}×${x0}² ${formatSigned(b)}×${x0} ${formatSigned(c)} = ${yExact} ⇒ ${correct}.`,
  };
}

function genGraphSign() {
  const slope = simpleInt(-3, 3) || 2;
  const intercept = simpleInt(-4, 4);
  const root = -intercept / slope;
  const description = 'À partir du graphique, déterminer où f(x) est positive.';
  const positiveInterval = slope > 0 ? `x > ${root.toFixed(1)}` : `x < ${root.toFixed(1)}`;
  const correct = `f(x) > 0 pour ${positiveInterval}.`;
  const wrongs = [
    `f(x) > 0 pour ${slope > 0 ? 'x <' : 'x >'} ${root.toFixed(1)}.`,
    'f(x) est toujours positive.',
    'On ne peut pas conclure.',
  ];
  return {
    statement: description,
    statementHTML: `${description}<br/>${createLineGraph(slope, intercept)}`,
    ...buildChoiceSet(correct, wrongs),
    explanation: `Le signe change à la racine x = ${root.toFixed(1)} et dépend du signe de ${slope}.`,
  };
}

function genDrawLine() {
  const useEquation = Math.random() < 0.5;
  if (useEquation) {
    const slope = simpleInt(-3, 3) || 1;
    const intercept = simpleInt(-4, 4);
    const p1 = `(0 ; ${intercept})`;
    const p2 = `(1 ; ${slope + intercept})`;
    const correct = `Placer les points ${p1} et ${p2} puis tracer la droite.`;
    const wrongs = [
      `Placer (${slope}; 0) et (${intercept}; 1).`,
      `Tracer une droite horizontale passant par y = ${intercept}.`,
      `Placer (0 ; ${slope}) et (1 ; ${intercept}).`,
    ];
    const statement = `Comment tracer la droite d'équation y = ${slope}x ${formatSigned(intercept)} ?`;
    return {
      statement,
      ...buildChoiceSet(correct, wrongs),
      explanation: `On repère l'ordonnée à l'origine (${p1}) puis un second point obtenu avec le coefficient directeur : ${p2}.`,
    };
  }
  const slope = simpleInt(-3, 3) || 2;
  const x0 = simpleInt(-3, 3);
  const y0 = simpleInt(-4, 4);
  const p2 = `(${x0 + 1} ; ${y0 + slope})`;
  const statement = `Pour tracer la droite passant par (${x0} ; ${y0}) de coefficient directeur ${slope}, quel second point peut-on utiliser ?`;
  const correct = p2;
  const wrongs = [`(${x0 + 1} ; ${y0 - slope})`, `(${x0} ; ${y0 + slope})`, `(${x0 - 1} ; ${y0 + slope})`];
  return {
    statement,
    ...buildChoiceSet(correct, wrongs),
    explanation: `Une pente de ${slope} signifie qu'en augmentant x d'une unité, y varie de ${slope} ⇒ point ${p2}.`,
  };
}

function genEquationFromGraph() {
  const slope = simpleInt(-3, 3) || 2;
  const intercept = simpleInt(-3, 3);
  const description = 'Quelle est l’équation réduite de la droite représentée ?';
  const correct = `y = ${slope}x ${formatSigned(intercept)}`;
  const wrongs = [
    `y = ${slope}x ${formatSigned(-intercept)}`,
    `y = ${-slope}x ${formatSigned(intercept)}`,
    `y = ${slope}(x ${formatSigned(-intercept)})`,
  ];
  return {
    statement: description,
    statementHTML: `${description}<br/>${createLineGraph(slope, intercept)}`,
    ...buildChoiceSet(correct, wrongs),
    explanation: `On lit l'ordonnée à l'origine (${intercept}) et la pente ${slope} pour écrire y = ${slope}x ${formatSigned(
      intercept,
    )}.`,
  };
}

const functionQuestions = [
  genEvaluateLinearFunction,
  genSlopeFromTable,
  genFunctionVariation,
  genVariationTableReading,
  genDerivativeSignInterpretation,
  genImagePreimage,
  genRecognizeFunction,
  genSignFromFactorized,
  genSignFirstDegree,
  genPointOnCurve,
  genGraphReadValue,
  genGraphSolveK,
  genGraphSolveZero,
  genGraphSign,
  genDrawLine,
  genEquationFromGraph,
  genPointSlopeEquation,
];

function genMeanValue() {
  const n1 = simpleInt(2, 6);
  const n2 = simpleInt(2, 6);
  const v1 = simpleInt(5, 15);
  const v2 = simpleInt(10, 25);
  const values = Array(n1).fill(v1).concat(Array(n2).fill(v2));
  const sum = values.reduce((acc, value) => acc + value, 0);
  const mean = sum / values.length;
  const wrongs = [mean + simpleInt(1, 3), v1, v2];
  return {
    statement: `On relève ${n1} notes égales à ${v1} et ${n2} notes égales à ${v2}. Quelle est la moyenne ?`,
    ...buildChoiceSet(mean.toFixed(1), wrongs.map((value) => (value.toFixed ? value.toFixed(1) : `${value}`))),
    explanation: `Moyenne pondérée = (${n1}×${v1} + ${n2}×${v2})/${n1 + n2} = ${mean.toFixed(1)}.`,
  };
}

function genMedian() {
  const data = shuffle([simpleInt(10, 18), simpleInt(12, 20), simpleInt(14, 22), simpleInt(16, 24), simpleInt(18, 26)]).sort(
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
  const data = Array.from({ length: 8 }, () => simpleInt(5, 25)).sort((a, b) => a - b);
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
  const medA = simpleInt(10, 15);
  const medB = medA + simpleInt(-2, 3);
  const spreadA = simpleInt(6, 12);
  const spreadB = spreadA + simpleInt(-3, 5);
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
  const values = cats.map(() => simpleInt(10, 30));
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
  const total = simpleInt(40, 80);
  const portion = simpleInt(5, 20);
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

function genPieChartReading() {
  const angle = randomItem([60, 90, 120, 150, 180]);
  const percent = ((angle / 360) * 100).toFixed(1);
  const statement = `Dans un diagramme circulaire, le secteur A mesure ${angle}°. Quelle part du total représente-t-il ?`;
  const correct = `${percent}%`;
  const wrongs = [`${(angle / 180 * 100).toFixed(1)}%`, `${angle}%`, `${(360 - angle) / 360}`];
  return {
    statement,
    ...buildChoiceSet(correct, wrongs),
    explanation: `La part vaut angle/360 = ${angle}/360 = ${percent}%.`,
  };
}

function genTimeSeriesCommentary() {
  const startYear = 2020;
  const values = [simpleInt(40, 120)];
  values.push(values[0] + simpleInt(-15, 25));
  values.push(values[1] + simpleInt(-10, 30));
  const years = [startYear, startYear + 1, startYear + 2];
  const trend = values[2] > values[0] ? 'augmente globalement' : 'diminue globalement';
  const statement = `Une courbe chronologique passe par (${years[0]}, ${values[0]}), (${years[1]}, ${values[1]}) et (${years[2]}, ${
    values[2]
  }). Que peut-on dire de l'évolution ?`;
  const correct = values[2] > values[0] ? 'La grandeur augmente globalement.' : 'La grandeur diminue globalement.';
  const wrongs = [
    'Elle reste constante.',
    `Elle ${values[2] > values[0] ? 'diminue' : 'augmente'} sans aucune hausse/baisse intermédiaire.`,
    'Impossible sans calcul exact.',
  ];
  return {
    statement,
    ...buildChoiceSet(correct, wrongs),
    explanation: `On lit la tendance globale de la courbe : ${values[0]} → ${values[2]} ⇒ ${trend}.`,
  };
}

function genBoxPlotReading() {
  const q1 = simpleInt(20, 40);
  const median = q1 + simpleInt(2, 10);
  const q3 = median + simpleInt(2, 10);
  const statement = `Dans un diagramme en boîte avec Q₁ = ${q1}, médiane = ${median} et Q₃ = ${q3}, quel est l'écart interquartile ?`;
  const correct = `${q3 - q1}`;
  const wrongs = [`${median}`, `${q3 - median}`, `${median - q1}`];
  return {
    statement,
    ...buildChoiceSet(correct, wrongs),
    explanation: `Écart interquartile = Q₃ - Q₁ = ${q3} - ${q1} = ${q3 - q1}.`,
  };
}

const statisticsQuestions = [
  genMeanValue,
  genMedian,
  genQuartile,
  genBoxPlotComparison,
  genBoxPlotReading,
  genDiagramReading,
  genPieChartReading,
  genGraphToData,
  genTimeSeriesCommentary,
  genScatterTrend,
];

function genBagProbability() {
  let red = 0;
  let blue = 0;
  do {
    red = simpleInt(2, 6);
    blue = simpleInt(2, 6);
  } while (red === blue);
  const total = red + blue;
  const correct = formatProbability(red / total);
  const wrongs = [
    formatProbability(blue / total),
    formatProbability((red - 1) / (total - 1)),
    formatProbability((blue + 2) / (total + 2)),
  ];
  return {
    statement: `Un sac contient ${red} boules rouges et ${blue} bleues. Probabilité de tirer une rouge ?`,
    ...buildChoiceSet(correct, wrongs),
    explanation: `p(rouge) = effectif favorable / total = ${red}/${total} = ${correct}.`,
  };
}

function genComplementaryEvent() {
  const prob = simpleInt(10, 70) / 100;
  const complement = formatProbability(1 - prob);
  const wrongs = [formatProbability(prob), formatProbability(prob * prob), formatProbability(Math.max(0, Math.min(1, prob + 0.15)))];
  return {
    statement: `P(A) = ${prob.toFixed(2)}. Quelle est la probabilité de l'événement contraire ?`,
    ...buildChoiceSet(complement, wrongs),
    explanation: `P(Ā) = 1 - P(A) = 1 - ${prob.toFixed(2)} = ${complement}.`,
  };
}

function genIndependentEvents() {
  const a = simpleInt(2, 5) / 10;
  const b = simpleInt(2, 5) / 10;
  const product = formatProbability(a * b);
  const wrongs = [formatProbability(a), formatProbability(b), formatProbability(Math.min(1, a + b))];
  return {
    statement: `Deux événements indépendants vérifient P(A) = ${a.toFixed(2)} et P(B) = ${b.toFixed(2)}. Quelle est P(A ∩ B) ?`,
    ...buildChoiceSet(product, wrongs),
    explanation: `Indépendance ⇒ P(A ∩ B) = P(A) × P(B) = ${product}.`,
  };
}

function genTreeProbability() {
  const pA = simpleInt(2, 8) / 10;
  const pBgivenA = simpleInt(3, 8) / 10;
  const pBgivenNotA = simpleInt(1, 6) / 10;
  const prob = formatProbability(pA * pBgivenA + (1 - pA) * pBgivenNotA);
  const wrongs = [formatProbability(pBgivenA), formatProbability(pA), formatProbability(pBgivenNotA)];
  return {
    statement: `Dans un arbre pondéré, P(A) = ${pA.toFixed(2)}, P(B|A) = ${pBgivenA.toFixed(2)} et P(B|Ā) = ${pBgivenNotA.toFixed(
      2,
    )}. Quelle est P(B) ?`,
    ...buildChoiceSet(prob, wrongs),
    explanation: `P(B) = P(A)P(B|A) + P(Ā)P(B|Ā) = ${prob}.`,
  };
}

function genConditionalFromTable() {
  const total = simpleInt(80, 120);
  const row = simpleInt(30, Math.min(60, total - 10));
  const success = simpleInt(10, row - 5);
  const prob = formatProbability(success / row);
  const wrongs = [formatProbability(success / total), formatProbability(row / total), formatProbability(1 - success / row)];
  return {
    statement: `Dans un tableau croisé, ${row} élèves suivent l'option A dont ${success} réussissent. Quelle est P(Réussite | A) ?`,
    ...buildChoiceSet(prob, wrongs),
    explanation: `P(R|A) = effectif (R ∩ A) / effectif(A) = ${success}/${row} = ${prob}.`,
  };
}

function genSumEvent() {
  const die = simpleInt(4, 6);
  const sought = simpleInt(2, die);
  const prob = formatProbability(1 / die);
  const wrongs = [
    formatProbability(1 / (die - 1)),
    formatProbability((sought + 1) / (die + 1)),
    formatProbability(Math.max(0, Math.min(1, (die - sought + 1) / die))),
  ];
  return {
    statement: `On lance un dé ${die}-faces équilibré. Probabilité d'obtenir ${sought} ?`,
    ...buildChoiceSet(prob, wrongs),
    explanation: `Cas équiprobables ⇒ P = 1/${die} = ${prob}.`,
  };
}

function genEventBySum() {
  let probs = [];
  do {
    probs = [simpleInt(1, 3) / 10, simpleInt(1, 3) / 10, simpleInt(1, 3) / 10];
  } while (probs.reduce((acc, value) => acc + value, 0) >= 0.95);
  const totalAssigned = probs.reduce((acc, value) => acc + value, 0);
  const remaining = roundTo(1 - totalAssigned, 2);
  const options = ['A', 'B', 'C', 'D'];
  const listed = probs.map((prob, index) => `${options[index]} : ${prob.toFixed(2)}`);
  listed.push(`${options[3]} : ${remaining.toFixed(2)}`);
  const targetIndices = [0, 2];
  const statement = `On considère quatre issues avec probabilités ${listed.join(', ')}. Quelle est la probabilité de l'événement « ${
    options[targetIndices[0]]
  } ou ${options[targetIndices[1]]} » ?`;
  const prob = formatProbability(probs[targetIndices[0]] + probs[targetIndices[1]]);
  const wrongs = [
    formatProbability(probs[targetIndices[0]]),
    formatProbability(probs[targetIndices[1]]),
    formatProbability(Math.max(0, 1 - Number.parseFloat(prob))),
  ];
  return {
    statement,
    ...buildChoiceSet(prob, wrongs),
    explanation: `On additionne les probabilités des issues composant l'événement : ${prob}.`,
  };
}

function genConditionalFromTree() {
  let pA = simpleInt(2, 9) / 10;
  let pBgivenA = simpleInt(2, 9) / 10;
  let pBgivenNotA = simpleInt(2, 9) / 10;
  let denominator = 0;
  while (denominator === 0) {
    pA = simpleInt(2, 9) / 10;
    pBgivenA = simpleInt(2, 9) / 10;
    pBgivenNotA = simpleInt(2, 9) / 10;
    const numerator = pA * pBgivenA;
    denominator = numerator + (1 - pA) * pBgivenNotA;
  }
  const numerator = pA * pBgivenA;
  const prob = formatProbability(numerator / denominator);
  const wrongs = [formatProbability(pBgivenA), formatProbability(pA), formatProbability(Math.max(0, 1 - Number.parseFloat(prob)))];
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

function genBinomialProbability() {
  const n = simpleInt(3, 6);
  const k = simpleInt(1, n - 1);
  const p = simpleInt(2, 8) / 10;
  const probability = formatProbability(binomialCoefficient(n, k) * p ** k * (1 - p) ** (n - k), 3);
  const wrongs = [
    formatProbability(p, 3),
    formatProbability(p ** k, 3),
    formatProbability((1 - p) ** (n - k), 3),
  ];
  return {
    statement: `Soit X ~ B(${n} ; ${p.toFixed(1)}). Calculer P(X = ${k}).`,
    ...buildChoiceSet(probability, wrongs),
    explanation: `P(X = ${k}) = C(${n}, ${k}) × ${p.toFixed(1)}^${k} × (1 - ${p.toFixed(1)})^${n - k} = ${probability}.`,
  };
}

function genProbabilityBounds() {
  const valid = (simpleInt(1, 9) / 10).toFixed(2);
  const wrongs = ['-0.2', '1.5', `${simpleInt(2, 9)}`];
  const statement = 'Parmi les valeurs suivantes, laquelle peut représenter une probabilité ?';
  return {
    statement,
    ...buildChoiceSet(valid, wrongs),
    explanation: 'Une probabilité est comprise entre 0 et 1.',
  };
}

const probabilityQuestions = [
  genBagProbability,
  genProbabilityBounds,
  genComplementaryEvent,
  genIndependentEvents,
  genTreeProbability,
  genConditionalFromTable,
  genSumEvent,
  genEventBySum,
  genConditionalFromTree,
  genNotationQuestion,
  genBinomialProbability,
];

export const questionBanks = {
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
    let question = null;
    let attempts = 0;
    while (!question && attempts < 10) {
      const candidate = generator();
      try {
        validateChoices(candidate.choices[candidate.correctIndex], candidate.choices);
        question = candidate;
      } catch (error) {
        attempts += 1;
        // regenerate if invalid
      }
    }
    if (!question) {
      throw new Error('Impossible de générer une question cohérente après plusieurs tentatives');
    }
    questions.push(question);
    lastGenerator = generator;
  }
  return questions;
}
