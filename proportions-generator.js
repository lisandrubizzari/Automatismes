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

function typesetMath(...elements) {
  const nodes = elements.filter(Boolean);
  if (!window.MathJax || !MathJax.typesetPromise || nodes.length === 0) {
    return;
  }
  MathJax.typesetPromise(nodes).catch(() => {});
}

function formatPercent(value, options = {}) {
  const formatted = value.toFixed(1).replace(".", ",");
  if (options.latex) {
    return `${formatted}\\%`;
  }
  return `${formatted} %`;
}

function genConvertProportion() {
  const a = randInt(1, 9);
  const b = randInt(a + 1, 12);
  const fractionDisplay = inlineLatex(latexFraction(a, b, true));
  const decimalDisplay = (a / b).toFixed(2).replace(".", ",");
  const percentDisplay = `${Math.round((a / b) * 100)} %`;
  const formats = [fractionDisplay, decimalDisplay, percentDisplay];
  const correct = formats[randInt(0, formats.length - 1)];

  const wrongCandidates = [
    inlineLatex(latexFraction(a * 2, b * 2, true)),
    (a / b).toFixed(3).replace(".", ","),
    `${(Math.round((a / b) * 1000) / 10).toString().replace(".", ",")} %`,
  ];

  let choices = [correct, ...wrongCandidates];
  choices = [...new Set(choices)];
  while (choices.length < 4) {
    choices.push(inlineLatex(latexFraction(a + randInt(1, 3), b + randInt(1, 3), true)));
    choices = [...new Set(choices)];
  }
  shuffle(choices);
  const correctIndex = choices.indexOf(correct);

  return {
    statement: `Quelle est une écriture correcte de la proportion correspondant à ${inlineLatex(
      latexFraction(a, b, false)
    )} ?`,
    choices,
    correctIndex,
    explanation: `Les écritures correctes sont ${fractionDisplay}, ${decimalDisplay} et ${percentDisplay}.`,
  };
}

function genPartOfTotal() {
  const total = randInt(100, 800);
  const p = randInt(5, 40);
  const part = Math.round((total * p) / 100);

  const correct = `${part}`;
  const wrong1 = `${Math.round(total / p)}`;
  const wrong2 = `${Math.round((total * (p + 10)) / 100)}`;
  const wrong3 = `${Math.round((total * (p / 2)) / 100)}`;

  let choices = [correct, wrong1, wrong2, wrong3];
  choices = [...new Set(choices)];
  shuffle(choices);
  const correctIndex = choices.indexOf(correct);

  return {
    statement: `Calculer ${inlineLatex(`${p}\\%`)} de ${inlineLatex(`${total}`)}.`,
    choices,
    correctIndex,
    explanation: `${inlineLatex(
      `${p}\\% \times ${total} = ${total} \times \\dfrac{${p}}{100} = ${part}`
    )}.`,
  };
}

function genTotalFromPart() {
  const p = randInt(15, 60);
  const total = randInt(200, 800);
  const part = Math.round((total * p) / 100);
  const correct = `${total}`;
  const wrong1 = `${part * 2}`;
  const wrong2 = `${Math.round(part * (100 / (p + 10)))}`;
  const wrong3 = `${Math.round(part * (100 / Math.max(5, p - 10)))}`;

  let choices = [correct, wrong1, wrong2, wrong3];
  choices = [...new Set(choices)];
  shuffle(choices);
  const correctIndex = choices.indexOf(correct);

  return {
    statement: `${inlineLatex(`${part}`)} représente ${inlineLatex(`${p}\\%`)}. Quel est le total ?`,
    choices,
    correctIndex,
    explanation: `${inlineLatex(`total = ${part} \times \\dfrac{100}{${p}} = ${total}`)}.`,
  };
}

function genIncrease() {
  const x = randInt(100, 300);
  const t = randInt(5, 30);
  const finalValue = Math.round(x * (1 + t / 100));
  const correct = `${finalValue}`;
  const wrong1 = `${Math.round(x * (1 + (t + 5) / 100))}`;
  const wrong2 = `${Math.round(x * (1 - t / 100))}`;
  const wrong3 = `${x + t}`;

  let choices = [correct, wrong1, wrong2, wrong3];
  choices = [...new Set(choices)];
  shuffle(choices);
  const correctIndex = choices.indexOf(correct);

  return {
    statement: `${inlineLatex(`${x}`)} augmente de ${inlineLatex(`${t}\\%`)}. Quelle est la valeur finale ?`,
    choices,
    correctIndex,
    explanation: `${inlineLatex(
      `${x} \times (1 + \\dfrac{${t}}{100}) = ${finalValue}`
    )}.`,
  };
}

function genDecrease() {
  const x = randInt(100, 300);
  const t = randInt(5, 30);
  const finalValue = Math.round(x * (1 - t / 100));
  const correct = `${finalValue}`;
  const wrong1 = `${Math.round(x * (1 + t / 100))}`;
  const wrong2 = `${Math.round(x - t)}`;
  const wrong3 = `${Math.round(x * (1 - (t + 10) / 100))}`;

  let choices = [correct, wrong1, wrong2, wrong3];
  choices = [...new Set(choices)];
  shuffle(choices);
  const correctIndex = choices.indexOf(correct);

  return {
    statement: `${inlineLatex(`${x}`)} diminue de ${inlineLatex(`${t}\\%`)}. Quelle est la valeur finale ?`,
    choices,
    correctIndex,
    explanation: `${inlineLatex(
      `${x} \times (1 - \\dfrac{${t}}{100}) = ${finalValue}`
    )}.`,
  };
}

function genRate() {
  const oldVal = randInt(50, 200);
  const newVal = randInt(80, 300);
  const rate = ((newVal - oldVal) / oldVal) * 100;
  const correct = formatPercent(rate);
  const wrong1 = formatPercent(((oldVal - newVal) / oldVal) * 100);
  const wrong2 = formatPercent(((newVal - oldVal) / newVal) * 100);
  const wrong3 = formatPercent(rate + 10);

  let choices = [correct, wrong1, wrong2, wrong3];
  choices = [...new Set(choices)];
  shuffle(choices);
  const correctIndex = choices.indexOf(correct);

  return {
    statement: `Un indicateur passe de ${inlineLatex(`${oldVal}`)} à ${inlineLatex(`${newVal}`)}. Quel est le taux d’évolution ?`,
    choices,
    correctIndex,
    explanation: `${inlineLatex(
      `\\dfrac{${newVal} - ${oldVal}}{${oldVal}} \times 100 = ${formatPercent(rate, { latex: true })}`
    )}.`,
  };
}

function genDoubleEvolution() {
  const t1 = randInt(5, 30);
  const t2 = randInt(5, 30);
  const k = (1 + t1 / 100) * (1 + t2 / 100);
  const totalRate = (k - 1) * 100;
  const correct = formatPercent(totalRate);
  const wrong1 = `${t1 + t2} %`;
  const wrong2 = `${t1 + t2 + 5} %`;
  const wrong3 = formatPercent(100 * (t1 / 100 + t2 / 100 - (t1 * t2) / 10000));

  let choices = [correct, wrong1, wrong2, wrong3];
  choices = [...new Set(choices)];
  shuffle(choices);
  const correctIndex = choices.indexOf(correct);

  return {
    statement: `On applique successivement +${inlineLatex(`${t1}\\%`)} puis +${inlineLatex(`${t2}\\%`)}. Quel est le taux global ?`,
    choices,
    correctIndex,
    explanation: `${inlineLatex(
      `(1 + \\dfrac{${t1}}{100})(1 + \\dfrac{${t2}}{100}) - 1 = ${formatPercent(totalRate, { latex: true })}`
    )}.`,
  };
}

function genReciprocalRate() {
  const t = randInt(10, 40);
  const factor = 1 + t / 100;
  const rec = (1 / factor - 1) * 100;
  const correct = formatPercent(rec);
  const wrong1 = `-${t} %`;
  const wrong2 = formatPercent(t / (1 + t / 100));
  const wrong3 = formatPercent(rec + 5);

  let choices = [correct, wrong1, wrong2, wrong3];
  choices = [...new Set(choices)];
  shuffle(choices);
  const correctIndex = choices.indexOf(correct);

  return {
    statement: `Après une hausse de ${inlineLatex(`${t}\\%`)}, de combien faut-il diminuer pour revenir à la valeur initiale ?`,
    choices,
    correctIndex,
    explanation: `${inlineLatex(
      `(1 + \\dfrac{${t}}{100}) \times (1 + \\dfrac{x}{100}) = 1 \Rightarrow x = ${formatPercent(rec, { latex: true })}`
    )}.`,
  };
}

const generators = [
  genConvertProportion,
  genPartOfTotal,
  genTotalFromPart,
  genIncrease,
  genDecrease,
  genRate,
  genDoubleEvolution,
  genReciprocalRate,
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
