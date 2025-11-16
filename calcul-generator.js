const quizElement = document.getElementById("quiz");
const resultElement = document.getElementById("result");
const newQuestionButton = document.getElementById("newQuestion");
const checkButton = document.getElementById("checkQuestion");
const solutionButton = document.getElementById("showSolution");

let currentQuestion = null;
let questionNumber = 0;

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = randInt(0, i);
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function gcd(a, b) {
  let x = Math.abs(a);
  let y = Math.abs(b);
  while (y !== 0) {
    const t = y;
    y = x % y;
    x = t;
  }
  return x || 1;
}

function simplifyFraction(num, den) {
  let numerator = num;
  let denominator = den;
  const divisor = gcd(numerator, denominator);
  numerator /= divisor;
  denominator /= divisor;
  if (denominator < 0) {
    denominator = -denominator;
    numerator = -numerator;
  }
  return { numerator, denominator };
}

function latexFraction(num, den, simplify = true) {
  if (den === 0) {
    return "0";
  }
  let numerator = num;
  let denominator = den;
  if (simplify) {
    const reduced = simplifyFraction(num, den);
    numerator = reduced.numerator;
    denominator = reduced.denominator;
  } else if (denominator < 0) {
    numerator = -numerator;
    denominator = -denominator;
  }
  if (denominator === 1) {
    return `${numerator}`;
  }
  return `\\dfrac{${numerator}}{${denominator}}`;
}

function inlineLatex(content) {
  return `\\(${content}\\)`;
}

function powLatex(base, exp) {
  if (exp === 1) {
    return `${base}`;
  }
  return `${base}^{${exp}}`;
}

function formatLinear(coef, constant) {
  let partX = "";
  if (coef === 0) {
    partX = "";
  } else if (coef === 1) {
    partX = "x";
  } else if (coef === -1) {
    partX = "-x";
  } else {
    partX = `${coef}x`;
  }

  if (constant === 0) {
    return partX || "0";
  }
  if (!partX) {
    return `${constant}`;
  }
  const sign = constant > 0 ? " + " : " - ";
  const absConst = Math.abs(constant);
  return `${partX}${sign}${absConst}`;
}

function formatSigned(value) {
  return value >= 0 ? `+ ${value}` : `- ${Math.abs(value)}`;
}

function typesetMath(...elements) {
  const nodes = elements.filter(Boolean);
  if (!window.MathJax || !MathJax.typesetPromise || nodes.length === 0) {
    return;
  }
  MathJax.typesetPromise(nodes).catch(() => {});
}

function genCompareNumbers() {
  let a = randInt(-20, 20);
  let b;
  do {
    b = randInt(-20, 20);
  } while (b === a);

  const relation = a < b ? "<" : a > b ? ">" : "=";
  const choices = [
    inlineLatex("a < b"),
    inlineLatex("a > b"),
    inlineLatex("a = b"),
    "On ne peut pas savoir",
  ];
  const correctIndex = relation === "<" ? 0 : relation === ">" ? 1 : 2;

  return {
    statement: `On considère ${inlineLatex(`a = ${a}`)} et ${inlineLatex(
      `b = ${b}`
    )}. Comparer ${inlineLatex("a")} et ${inlineLatex("b")}.`,
    choices,
    correctIndex,
    explanation: `Comme ${inlineLatex(`a = ${a}`)} et ${inlineLatex(
      `b = ${b}`
    )}, on obtient ${inlineLatex(`${a} ${relation} ${b}`)}.`,
  };
}

function genFractions() {
  const q = randInt(2, 9);
  const s = randInt(2, 9);
  const p = randInt(1, q - 1);
  const r = randInt(1, s - 1);

  const num = p * s + r * q;
  const den = q * s;
  const correct = latexFraction(num, den, true);
  const wrong1 = latexFraction(p + r, q + s, true);
  const wrong2 = latexFraction(num, den, false);
  const wrong3 = latexFraction(num - q, den, true);

  let rawChoices = [correct, wrong1, wrong2, wrong3];
  rawChoices = [...new Set(rawChoices)];
  while (rawChoices.length < 4) {
    rawChoices.push(latexFraction(num + randInt(-3, 3), den, false));
    rawChoices = [...new Set(rawChoices)];
  }
  shuffle(rawChoices);
  const correctIndex = rawChoices.indexOf(correct);
  const choices = rawChoices.map((value) => inlineLatex(value));

  return {
    statement: `Calculer : ${inlineLatex(
      `${latexFraction(p, q, false)} + ${latexFraction(r, s, false)}`
    )}.`,
    choices,
    correctIndex,
    explanation: `On met au même dénominateur : ${inlineLatex(
      `${latexFraction(p, q, false)} + ${latexFraction(r, s, false)} = ${latexFraction(
        num,
        den,
        false
      )}`
    )} puis ${inlineLatex(latexFraction(num, den, true))}.`,
  };
}

function genPowers() {
  const base = randInt(2, 7);
  const m = randInt(-2, 3);
  const n = randInt(-2, 3);
  const exp = m + n;

  const correct = powLatex(base, exp);
  const wrong1 = powLatex(base, m * n);
  const wrong2 = powLatex(base, m - n);
  const wrong3 = powLatex(base, n - m);

  let rawChoices = [correct, wrong1, wrong2, wrong3];
  rawChoices = [...new Set(rawChoices)];
  while (rawChoices.length < 4) {
    rawChoices.push(powLatex(base, exp + randInt(-3, 3)));
    rawChoices = [...new Set(rawChoices)];
  }
  shuffle(rawChoices);
  const correctIndex = rawChoices.indexOf(correct);
  const choices = rawChoices.map((value) => inlineLatex(value));

  return {
    statement: `Simplifier : ${inlineLatex(
      `${powLatex(base, m)} \\times ${powLatex(base, n)}`
    )}.`,
    choices,
    correctIndex,
    explanation: `On utilise ${inlineLatex(
      "a^{m} \\times a^{n} = a^{m+n}"
    )}, d'où ${inlineLatex(
      `${powLatex(base, m)} \\times ${powLatex(base, n)} = ${powLatex(base, exp)}`
    )}.`,
  };
}

function genPercentConversion() {
  const percArr = [5, 10, 12, 20, 25, 30, 40, 50];
  const p = percArr[randInt(0, percArr.length - 1)];
  const correctDec = (p / 100).toString().replace(".", ",");
  const wrong1 = (p / 10).toString().replace(".", ",");
  const wrong2 = p.toString().replace(".", ",");
  const wrong3 = (p / 1000).toFixed(3).replace(".", ",");

  let choices = [correctDec, wrong1, wrong2, wrong3];
  choices = [...new Set(choices)];
  shuffle(choices);
  const correctIndex = choices.indexOf(correctDec);

  return {
    statement: `Écrire ${inlineLatex(`${p}\\%`)} sous forme décimale.`,
    choices,
    correctIndex,
    explanation: `${inlineLatex(
      `${p}\\% = \\dfrac{${p}}{100} = ${(p / 100).toString().replace(".", ",")}`
    )}.`,
  };
}

function genOrderMagnitude() {
  const a = randInt(30, 80);
  const b = randInt(2, 9);
  const exact = a * b;
  const approx1 = Math.round(exact / 10) * 10;
  const approx2 = Math.round(exact / 100) * 100;
  const approx3 = approx1 + 50;

  let choices = [`${exact}`, `${approx1}`, `${approx2}`, `${approx3}`];
  choices = [...new Set(choices)];
  shuffle(choices);
  const correctIndex = choices.indexOf(`${approx2}`);

  return {
    statement: `Donner un ordre de grandeur du produit ${inlineLatex(
      `${a} \\times ${b}`
    )}.`,
    choices,
    correctIndex,
    explanation: `Le produit exact vaut ${exact}. Arrondi à la centaine, on obtient ${approx2}.`,
  };
}

function genLiteral() {
  const a = randInt(1, 5);
  const b = randInt(1, 7);
  const c = randInt(1, 5);
  const d = randInt(1, 7);

  const coef = -a + c;
  const constant = -b + d;
  const correct = formatLinear(coef, constant);
  const wrong1 = formatLinear(-a - c, -b - d);
  const wrong2 = formatLinear(a + c, b + d);
  const wrong3 = formatLinear(coef, -constant);

  let rawChoices = [correct, wrong1, wrong2, wrong3];
  rawChoices = [...new Set(rawChoices)];
  while (rawChoices.length < 4) {
    rawChoices.push(formatLinear(coef + randInt(-2, 2), constant + randInt(-3, 3)));
    rawChoices = [...new Set(rawChoices)];
  }
  shuffle(rawChoices);
  const correctIndex = rawChoices.indexOf(correct);
  const choices = rawChoices.map((value) => inlineLatex(value));

  return {
    statement: `Développer et réduire : ${inlineLatex(`-(${a}x + ${b}) + (${c}x + ${d})`)}.`,
    choices,
    correctIndex,
    explanation: `${inlineLatex(`-(${a}x + ${b}) = -${a}x - ${b}`)} puis on ajoute ${inlineLatex(`${c}x + ${d}`)} pour obtenir ${inlineLatex(correct)}.`,
  };
}

function genDistributive() {
  const k = randInt(2, 9);
  const m = randInt(1, 6);
  const n = randInt(-6, 6);
  const correct = formatLinear(k * m, k * n);
  const wrong1 = formatLinear(m + n, k);
  const wrong2 = formatLinear(k * m, n);
  const wrong3 = formatLinear(m, k * n);

  let rawChoices = [correct, wrong1, wrong2, wrong3];
  rawChoices = [...new Set(rawChoices)];
  shuffle(rawChoices);
  const correctIndex = rawChoices.indexOf(correct);
  const choices = rawChoices.map((value) => inlineLatex(value));

  return {
    statement: `Développer : ${inlineLatex(`${k}\\left(${m}x ${formatSigned(n)}\\right)`)}.`,
    choices,
    correctIndex,
    explanation: `On distribue ${k} : ${inlineLatex(`${k}\\times ${m}x = ${k * m}x`)} et ${inlineLatex(`${k}\\times ${n} = ${k * n}`)} donc ${inlineLatex(correct)}.`,
  };
}

function genEquation() {
  const a = randInt(2, 7);
  const x = randInt(-5, 8);
  const b = randInt(-9, 9);
  const c = a * x + b;

  const correct = `${x}`;
  const wrong1 = `${x + randInt(-3, -1)}`;
  const wrong2 = `${x + randInt(1, 3)}`;
  const wrong3 = `${-x}`;

  let rawChoices = [correct, wrong1, wrong2, wrong3];
  rawChoices = [...new Set(rawChoices)];
  while (rawChoices.length < 4) {
    rawChoices.push(`${x + randInt(-5, 5)}`);
    rawChoices = [...new Set(rawChoices)];
  }
  shuffle(rawChoices);
  const correctIndex = rawChoices.indexOf(correct);
  const choices = rawChoices.map((value) => inlineLatex(value));

  return {
    statement: `Résoudre : ${inlineLatex(`${a}x ${formatSigned(b)} = ${c}`)}.`,
    choices,
    correctIndex,
    explanation: `On isole ${inlineLatex("x")}: ${inlineLatex(`${a}x = ${c - b}`)} donc ${inlineLatex(`x = \\dfrac{${c - b}}{${a}} = ${x}`)}.`,
  };
}

function genIdentity() {
  const a = randInt(1, 6);
  const b = randInt(1, 6);
  const ax2 = a * a;
  const middle = 2 * a * b;
  const last = b * b;

  const correct = `${ax2}x^{2} ${formatSigned(middle)}x + ${last}`;
  const wrong1 = `${ax2}x^{2} + ${last}`;
  const wrong2 = `${ax2}x^{2} ${formatSigned(middle)}x - ${last}`;
  const wrong3 = `${ax2}x^{2} ${formatSigned(middle)}x + ${2 * b}`;

  let rawChoices = [correct, wrong1, wrong2, wrong3];
  rawChoices = [...new Set(rawChoices)];
  shuffle(rawChoices);
  const correctIndex = rawChoices.indexOf(correct);
  const choices = rawChoices.map((value) => inlineLatex(value));

  return {
    statement: `Développer : ${inlineLatex(`(${a}x ${formatSigned(b)})^{2}`)}.`,
    choices,
    correctIndex,
    explanation: `On applique ${inlineLatex("(u+v)^{2} = u^{2} + 2uv + v^{2}")} avec ${inlineLatex(`u = ${a}x`)} et ${inlineLatex(`v = ${b}`)}.`,
  };
}

function genFactorisation() {
  const k = randInt(2, 9);
  const m = randInt(1, 7);
  const n = randInt(1, 7);

  const correct = `${k}\\left(${m}x ${formatSigned(n)}\\right)`;
  const wrong1 = `${k + m}x ${formatSigned(n)}`;
  const wrong2 = `${k}\\left(${m + n}x + ${n}\\right)`;
  const wrong3 = `${k}\\left(${m}x ${formatSigned(n * k)}\\right)`;

  let rawChoices = [correct, wrong1, wrong2, wrong3];
  rawChoices = [...new Set(rawChoices)];
  shuffle(rawChoices);
  const correctIndex = rawChoices.indexOf(correct);
  const choices = rawChoices.map((value) => inlineLatex(value));

  return {
    statement: `Factoriser : ${inlineLatex(`${k * m}x ${formatSigned(k * n)}`)}.`,
    choices,
    correctIndex,
    explanation: `On met ${inlineLatex(`${k}`)} en facteur commun : ${inlineLatex(`${k * m}x + ${k * n} = ${k}(${m}x + ${n})`)}.`,
  };
}

const generators = [
  genCompareNumbers,
  genFractions,
  genPowers,
  genPercentConversion,
  genOrderMagnitude,
  genLiteral,
  genDistributive,
  genEquation,
  genIdentity,
  genFactorisation,
];

function renderQuestion() {
  if (!currentQuestion) {
    quizElement.innerHTML = "";
    return;
  }
  quizElement.innerHTML = "";
  const wrapper = document.createElement("article");
  wrapper.className = "question";

  const statement = document.createElement("p");
  statement.className = "statement";
  statement.innerHTML = `Question ${questionNumber}. ${currentQuestion.statement}`;
  wrapper.appendChild(statement);

  const choicesContainer = document.createElement("div");
  choicesContainer.className = "choices";

  currentQuestion.choices.forEach((choice, index) => {
    const label = document.createElement("label");
    const input = document.createElement("input");
    input.type = "radio";
    input.name = "single-question";
    input.value = index;
    label.appendChild(input);
    const span = document.createElement("span");
    span.innerHTML = choice;
    label.appendChild(span);
    choicesContainer.appendChild(label);
  });

  wrapper.appendChild(choicesContainer);

  const feedback = document.createElement("div");
  feedback.className = "feedback";
  wrapper.appendChild(feedback);

  quizElement.appendChild(wrapper);
  typesetMath(wrapper);
}

function loadNewQuestion() {
  const generator = generators[randInt(0, generators.length - 1)];
  currentQuestion = generator();
  questionNumber += 1;
  renderQuestion();
  resultElement.textContent = "";
}

function checkAnswer() {
  if (!currentQuestion) return;
  const questionElement = quizElement.querySelector(".question");
  if (!questionElement) return;
  const selected = questionElement.querySelector('input[name="single-question"]:checked');
  const feedback = questionElement.querySelector(".feedback");
  questionElement.classList.remove("correct", "incorrect");

  if (!selected) {
    feedback.textContent = "Choisis une réponse avant de valider.";
    resultElement.textContent = "";
    return;
  }

  const answer = Number(selected.value);
  if (answer === currentQuestion.correctIndex) {
    questionElement.classList.add("correct");
    feedback.innerHTML = `✔ Bonne réponse. ${currentQuestion.explanation}`;
    resultElement.textContent = "Réponse validée.";
  } else {
    questionElement.classList.add("incorrect");
    feedback.innerHTML = `✘ Mauvaise réponse. <span class="answer-text">Réponse attendue : ${currentQuestion.choices[currentQuestion.correctIndex]}</span>. ${currentQuestion.explanation}`;
    resultElement.textContent = "Revois cette question ou affiche la solution.";
  }
  typesetMath(feedback);
}

function showSolution() {
  if (!currentQuestion) return;
  const questionElement = quizElement.querySelector(".question");
  if (!questionElement) return;
  const feedback = questionElement.querySelector(".feedback");
  questionElement.classList.remove("incorrect");
  questionElement.classList.add("correct");
  feedback.innerHTML = `<span class="answer-text">Réponse attendue : ${currentQuestion.choices[currentQuestion.correctIndex]}</span>. ${currentQuestion.explanation}`;
  resultElement.textContent = "Solution affichée.";
  typesetMath(feedback);
}

newQuestionButton.addEventListener("click", loadNewQuestion);
checkButton.addEventListener("click", checkAnswer);
solutionButton.addEventListener("click", showSolution);

loadNewQuestion();
