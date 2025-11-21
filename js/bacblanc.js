import { questionBanks } from './generateQuestions.js';
import { createQuizRenderer } from './renderQuiz.js';
import { evaluateResponses, applyCorrections, revealAllAnswers } from './corrections.js';
import { shuffle } from './utils.js';

function twoRandom(bank) {
  const pool = shuffle([...bank]);
  return pool.slice(0, 2).map((generator) => generator());
}

function buildFullQuiz() {
  const fullQuiz = [
    ...twoRandom(questionBanks.calcul),
    ...twoRandom(questionBanks.proportions),
    ...twoRandom(questionBanks.evolutions),
    ...twoRandom(questionBanks.fonctions),
    ...twoRandom(questionBanks.statistiques),
    ...twoRandom(questionBanks.probabilites),
  ];
  return shuffle(fullQuiz);
}

function initBacBlanc() {
  const quizContainer = document.getElementById('quiz');
  const progressFill = document.getElementById('progressFill');
  const progressTrack = document.getElementById('progressTrack');
  const progressLabel = document.getElementById('progressLabel');
  const renderer = createQuizRenderer({ container: quizContainer, progressFill, progressTrack, progressLabel });

  const newSetButton = document.getElementById('newSet');
  const correctButton = document.getElementById('correct');
  const showAnswersButton = document.getElementById('showAnswers');
  const resultContainer = document.getElementById('result');

  let questions = [];

  function resetResult(message = "Réponds aux questions puis clique sur 'Corriger' pour voir ton score.") {
    if (resultContainer) {
      resultContainer.innerHTML = `
        <div class="session-summary__item">
          <p>Résultats</p>
          <p class="session-summary__value">${message}</p>
        </div>
      `;
    }
  }

  function startNewSeries() {
    questions = buildFullQuiz();
    renderer.render(questions);
    resetResult("Série prête : 12 questions issues des 6 thèmes. Bonne chance !");
  }

  function runCorrection() {
    if (!questions.length) {
      resetResult('Génère d'abord une série pour lancer la correction.');
      return;
    }
    const responses = renderer.getResponses();
    const evaluation = evaluateResponses(questions, responses);
    applyCorrections(renderer, questions, evaluation);
    const score = evaluation.filter((detail) => detail.isCorrect).length;
    resetResult(`Score : ${score}/12. Analyse les explications avant de relancer.`);
  }

  function showAllAnswers() {
    if (!questions.length) {
      resetResult('Aucune question chargée : clique sur « Nouvelle série » pour commencer.');
      return;
    }
    revealAllAnswers(renderer, questions);
    resetResult('Toutes les réponses sont affichées. Parcours-les avant de recommencer.');
  }

  if (newSetButton) {
    newSetButton.addEventListener('click', startNewSeries);
  }
  if (correctButton) {
    correctButton.addEventListener('click', runCorrection);
  }
  if (showAnswersButton) {
    showAnswersButton.addEventListener('click', showAllAnswers);
  }
}

document.addEventListener('DOMContentLoaded', initBacBlanc);
