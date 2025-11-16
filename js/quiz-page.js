import { buildQuestionSet } from './generateQuestions.js';
import { createQuizRenderer } from './renderQuiz.js';
import { evaluateResponses, applyCorrections, revealAllAnswers } from './corrections.js';
import { FIVE_MINUTES, formatDuration } from './utils.js';

function initQuizPage() {
  if (!document.body) {
    console.error('[quiz-page] Le document ne contient pas encore de <body>. Abandon de l\'initialisation.');
    return;
  }

  const themeKey = document.body.dataset.themePage || 'calcul';
  console.log(`[quiz-page] Initialisation de la page QCM pour le thème « ${themeKey} ». `);

  const quizContainer = document.getElementById('quiz');
  if (!quizContainer) {
    console.error('[quiz-page] Impossible de trouver l\'élément #quiz. Les questions ne peuvent pas être rendues.');
    return;
  }

  const progressFill = document.getElementById('progressFill');
  const progressTrack = document.getElementById('progressTrack');
  const progressLabel = document.getElementById('progressLabel');
  const renderer = createQuizRenderer({ container: quizContainer, progressFill, progressTrack, progressLabel });
  const generatorRegion = document.querySelector('.generator');

  const newSetButton = document.getElementById('newSet');
  const correctButton = document.getElementById('correct');
  const showAnswersButton = document.getElementById('showAnswers');
  const timedModeToggle = document.getElementById('timedMode');

  const elapsedTimeDisplay = document.getElementById('elapsedTime');
  const countdownDisplay = document.getElementById('countdownDisplay');
  const scoreDisplay = document.getElementById('scoreDisplay');
  const modeBadge = document.getElementById('testModeBadge');
  const motivationalMessage = document.getElementById('motivationalMessage');

  let questions = [];
  let elapsedInterval = null;
  let countdownInterval = null;
  let sessionStart = null;
  let remainingSeconds = FIVE_MINUTES;
  let isTimedMode = false;
  let lastScore = null;

  function startElapsedTimer() {
    stopElapsedTimer();
    if (!sessionStart) {
      sessionStart = Date.now();
    }
    elapsedInterval = setInterval(() => {
      const seconds = Math.floor((Date.now() - sessionStart) / 1000);
      elapsedTimeDisplay.textContent = formatDuration(seconds);
    }, 1000);
  }

  function stopElapsedTimer() {
    if (elapsedInterval) {
      clearInterval(elapsedInterval);
      elapsedInterval = null;
    }
  }

  function resetSummary() {
    elapsedTimeDisplay.textContent = '00:00';
    scoreDisplay.textContent = '—';
    motivationalMessage.textContent =
      'Réponds aux questions puis lance la correction pour découvrir ton score !';
    lastScore = null;
  }

  function updateModeBadge() {
    modeBadge.textContent = isTimedMode ? 'Activé' : 'Inactif';
  }

  function updateCountdownDisplay() {
    countdownDisplay.textContent = isTimedMode ? formatDuration(remainingSeconds) : '—';
  }

  function stopCountdown() {
    if (countdownInterval) {
      clearInterval(countdownInterval);
      countdownInterval = null;
    }
  }

  function startCountdown() {
    stopCountdown();
    remainingSeconds = FIVE_MINUTES;
    updateCountdownDisplay();
    countdownInterval = setInterval(() => {
      remainingSeconds -= 1;
      updateCountdownDisplay();
      if (remainingSeconds <= 0) {
        stopCountdown();
        runCorrection();
      }
    }, 1000);
  }

  function motivationFromScore(score, total) {
    const ratio = score / total;
    if (ratio === 1) {
      return 'Impeccable, tu maîtrises tout !';
    }
    if (ratio >= 0.7) {
      return 'Très solide, peaufine les derniers détails.';
    }
    if (ratio >= 0.5) {
      return 'Pas mal ! Identifie les erreurs pour progresser.';
    }
    return 'On reprend calmement, relis les explications avant de retenter.';
  }

  function updateScoreDisplay(score, total) {
    scoreDisplay.textContent = `${score} / ${total}`;
    motivationalMessage.textContent = motivationFromScore(score, total);
    lastScore = score;
  }

  function startNewSet() {
    console.log("[quiz-page] Génération d'une nouvelle série de questions.", { themeKey, count: 10 });
    if (generatorRegion) {
      generatorRegion.classList.add('is-loading');
      setTimeout(() => generatorRegion.classList.remove('is-loading'), 450);
    }
    questions = buildQuestionSet(themeKey, 10);
    renderer.render(questions);
    sessionStart = Date.now();
    resetSummary();
    updateCountdownDisplay();
    stopElapsedTimer();
    startElapsedTimer();
    if (isTimedMode) {
      startCountdown();
    } else {
      stopCountdown();
    }
  }

  function runCorrection() {
    if (!questions.length) {
      console.warn('[quiz-page] Tentative de correction sans questions générées.');
      return;
    }
    stopElapsedTimer();
    stopCountdown();
    const responses = renderer.getResponses();
    console.log('[quiz-page] Lancement de la correction.', {
      answered: responses.filter((value) => value !== null).length,
    });
    const evaluation = evaluateResponses(questions, responses);
    applyCorrections(renderer, questions, evaluation);
    const score = evaluation.filter((detail) => detail.isCorrect).length;
    updateScoreDisplay(score, questions.length);
  }

  function showAll() {
    if (!questions.length) {
      console.warn('[quiz-page] Affichage des réponses impossible : aucune question chargée.');
      return;
    }
    console.log('[quiz-page] Affichage de toutes les réponses.');
    stopCountdown();
    stopElapsedTimer();
    revealAllAnswers(renderer, questions);
    if (lastScore === null) {
      scoreDisplay.textContent = 'Réponses affichées';
      motivationalMessage.textContent = 'Parcours les corrections avant de relancer une série.';
    }
  }

  if (newSetButton) {
    newSetButton.addEventListener('click', startNewSet);
  } else {
    console.warn("[quiz-page] Bouton #newSet introuvable, l'utilisateur ne pourra pas relancer de série.");
  }
  if (correctButton) {
    correctButton.addEventListener('click', runCorrection);
  } else {
    console.warn('[quiz-page] Bouton #correct introuvable.');
  }
  if (showAnswersButton) {
    showAnswersButton.addEventListener('click', showAll);
  } else {
    console.warn('[quiz-page] Bouton #showAnswers introuvable.');
  }

  if (timedModeToggle) {
    timedModeToggle.addEventListener('change', (event) => {
      isTimedMode = event.target.checked;
      updateModeBadge();
      if (isTimedMode) {
        if (questions.length === 0) {
          updateCountdownDisplay();
        } else {
          startCountdown();
        }
      } else {
        stopCountdown();
        updateCountdownDisplay();
      }
    });
  } else {
    console.warn('[quiz-page] Interrupteur #timedMode introuvable.');
  }

  updateModeBadge();
  updateCountdownDisplay();
  resetSummary();

  if (newSetButton) {
    console.log('[quiz-page] Lancement automatique de la première série.');
    startNewSet();
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initQuizPage, { once: true });
} else {
  initQuizPage();
}
