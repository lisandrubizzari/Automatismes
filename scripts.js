const yearSpan = document.getElementById("year");
if (yearSpan) {
  yearSpan.textContent = new Date().getFullYear();
}

const questionBank = {
  calcul: [
    {
      question: "Calcule 3(2 - 5)^2.",
      options: ["27", "-27", "9"],
      answer: 0,
      explanation: "2 - 5 = -3, son carré vaut 9 puis 3 × 9 = 27.",
    },
    {
      question: "Factorise x^2 - 9.",
      options: ["(x - 3)(x + 3)", "(x - 9)^2", "(x + 9)(x - 1)"],
      answer: 0,
      explanation: "On reconnaît une différence de carrés : a^2 - b^2 = (a - b)(a + b).",
    },
    {
      question: "Développe (2x - 1)^2.",
      options: ["4x^2 - 4x + 1", "4x^2 - 2x + 1", "2x^2 - 1"],
      answer: 0,
      explanation: "(a - b)^2 = a^2 - 2ab + b^2 avec a = 2x et b = 1.",
    },
    {
      question: "Simplifie (5a^3 b) / (10ab^2).",
      options: ["a^2 / (2b)", "(a^2 b) / 10", "(5a^2) / b"],
      answer: 0,
      explanation:
        "On simplifie par 5ab : il reste a^2 au numérateur et 2b au dénominateur.",
    },
  ],
  proportions: [
    {
      question: "Un prix augmente de 12 %. Quel est le coefficient multiplicateur ?",
      options: ["1,12", "0,88", "1,2"],
      answer: 0,
      explanation: "Une hausse de 12 % correspond à 1 + 12/100 = 1,12.",
    },
    {
      question: "Une bouteille de 750 mL représente quel pourcentage d'un litre ?",
      options: ["75 %", "7,5 %", "125 %"],
      answer: 0,
      explanation: "750 mL / 1000 mL = 0,75 soit 75 %.",
    },
    {
      question: "Dans un lycée de 540 élèves, 30 % sont des filles. Combien y en a-t-il ?",
      options: ["162", "180", "324"],
      answer: 0,
      explanation: "0,30 × 540 = 162 élèves.",
    },
    {
      question:
        "Un produit subit -10 % puis encore -5 %. Quelle baisse globale arrondie au dixième de % ?",
      options: ["-14,5 %", "-15 %", "-10,5 %"],
      answer: 0,
      explanation:
        "Coefficient global : 0,9 × 0,95 = 0,855 donc baisse de 1 - 0,855 = 14,5 %.",
    },
  ],
  evolutions: [
    {
      question: "Une quantité augmente de 8 % puis diminue de 8 %. Variation totale ?",
      options: ["-0,64 %", "0 %", "+0,64 %"],
      answer: 0,
      explanation:
        "0,08 puis -0,08 donnent un coefficient 1,08 × 0,92 = 0,9936 soit -0,64 %.",
    },
    {
      question: "Quel est le taux d'évolution de 120 à 150 ?",
      options: ["+25 %", "+20 %", "+30 %"],
      answer: 0,
      explanation: "(150 - 120) / 120 = 30 / 120 = 0,25 donc +25 %.",
    },
    {
      question:
        "Une suite est définie par u_{n+1} = 1,05 u_n. Quelle est l'évolution d'un terme au suivant ?",
      options: ["+5 %", "+1,5 %", "+50 %"],
      answer: 0,
      explanation: "On multiplie par 1,05, soit une hausse de 5 %.",
    },
    {
      question: "Un indice base 100 vaut 100 en 2019 et 111 en 2021. Quelle variation cumulée ?",
      options: ["+11 %", "+9 %", "+21 %"],
      answer: 0,
      explanation: "L'indice est 111 donc 11 % d'augmentation depuis la base 100.",
    },
  ],
  fonctions: [
    {
      question: "Si f(x) = x^2 - 4x + 1, quelle est f'(x) ?",
      options: ["2x - 4", "x - 4", "2x + 1"],
      answer: 0,
      explanation: "La dérivée de x^2 est 2x et celle de -4x vaut -4.",
    },
    {
      question: "La droite d'équation y = 2x + 3 coupe l'axe des ordonnées en ?",
      options: ["3", "2", "-3"],
      answer: 0,
      explanation: "L'ordonnée à l'origine est le terme constant : 3.",
    },
    {
      question: "Résoudre x^2 - 5x + 6 = 0.",
      options: ["x = 2 ou x = 3", "x = -2", "x = 6"],
      answer: 0,
      explanation: "On factorise (x - 2)(x - 3) = 0 donc x = 2 ou x = 3.",
    },
    {
      question: "Quel est le domaine de g(x) = \u221a(x - 1) ?",
      options: ["x ≥ 1", "x > -1", "Tous les réels"],
      answer: 0,
      explanation: "Pour une racine carrée, l'intérieur doit être ≥ 0 donc x - 1 ≥ 0.",
    },
  ],
  statistiques: [
    {
      question: "Pour la série (8 ; 9 ; 9 ; 10 ; 11), quelle est la médiane ?",
      options: ["9", "9,5", "10"],
      answer: 0,
      explanation: "Il y a 5 valeurs triées : la 3e est 9.",
    },
    {
      question:
        "Notes 12, 14, 10 affectées des coefficients 3, 2, 1. Quelle moyenne pondérée ?",
      options: ["12,3", "12,7", "11,5"],
      answer: 0,
      explanation: "(12×3 + 14×2 + 10×1) / 6 = 74/6 ≈ 12,3.",
    },
    {
      question: "Dans un échantillon de 25 élèves, 7 choisissent l'option A. Quelle fréquence ?",
      options: ["28 %", "32 %", "25 %"],
      answer: 0,
      explanation: "7 / 25 = 0,28 soit 28 %.",
    },
    {
      question: "Pour la série (2 ; 2 ; 2 ; 2), quel est l'écart-type ?",
      options: ["0", "2", "4"],
      answer: 0,
      explanation: "Toutes les valeurs sont confondues, la dispersion est nulle.",
    },
  ],
  probabilites: [
    {
      question: "On lance une pièce équilibrée deux fois. P(obtenir pile puis face) ?",
      options: ["1/4", "1/2", "1/8"],
      answer: 0,
      explanation: "Deux événements indépendants : 1/2 × 1/2 = 1/4.",
    },
    {
      question: "Dans une urne avec 3 boules rouges et 2 bleues, P(tirer rouge) ?",
      options: ["3/5", "2/5", "1/3"],
      answer: 0,
      explanation: "3 issues favorables sur 5 possibles.",
    },
    {
      question: "Loi binomiale B(n = 5, p = 0,2). P(X = 0) ≈ ?",
      options: ["0,33", "0,20", "0,67"],
      answer: 0,
      explanation: "P(0) = (0,8)^5 ≈ 0,32768 soit ≈ 0,33.",
    },
    {
      question: "Deux événements indépendants P(A)=0,6 et P(B)=0,5. P(A ∩ B) ?",
      options: ["0,30", "0,55", "0,11"],
      answer: 0,
      explanation: "Pour des événements indépendants : P(A)×P(B) = 0,6 × 0,5 = 0,30.",
    },
  ],
};

const qcmBlocks = document.querySelectorAll(".qcm");

qcmBlocks.forEach((qcm, index) => {
  const category = qcm.dataset.category;
  const bank = questionBank[category];
  if (!bank) return;

  const questionEl = qcm.querySelector(".qcm__question");
  const optionsEl = qcm.querySelector(".qcm__options");
  const feedbackEl = qcm.querySelector(".qcm__feedback");
  const validateBtn = qcm.querySelector(".qcm__validate");
  const nextBtn = qcm.querySelector(".qcm__next");
  const radioName = `option-${category}-${index}`;
  let currentQuestion = null;

  const renderQuestion = () => {
    currentQuestion = bank[Math.floor(Math.random() * bank.length)];
    questionEl.textContent = currentQuestion.question;
    optionsEl.innerHTML = "";
    feedbackEl.textContent = "";
    feedbackEl.classList.remove("is-correct", "is-wrong");

    currentQuestion.options.forEach((text, optionIndex) => {
      const label = document.createElement("label");
      label.className = "option";
      const input = document.createElement("input");
      input.type = "radio";
      input.name = radioName;
      input.value = optionIndex;
      input.required = true;
      const span = document.createElement("span");
      span.textContent = text;
      label.append(input, span);
      optionsEl.append(label);
    });
  };

  validateBtn?.addEventListener("click", () => {
    const selected = qcm.querySelector(`input[name="${radioName}"]:checked`);
    if (!selected) {
      feedbackEl.textContent = "Sélectionne une réponse avant de valider.";
      feedbackEl.classList.remove("is-correct", "is-wrong");
      return;
    }

    const chosenIndex = Number(selected.value);
    const isCorrect = chosenIndex === currentQuestion.answer;
    feedbackEl.textContent = isCorrect
      ? `✅ Bonne réponse ! ${currentQuestion.explanation}`
      : `❌ Mauvaise réponse. ${currentQuestion.explanation}`;
    feedbackEl.classList.toggle("is-correct", isCorrect);
    feedbackEl.classList.toggle("is-wrong", !isCorrect);
  });

  nextBtn?.addEventListener("click", renderQuestion);

  renderQuestion();
});
