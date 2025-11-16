export function evaluateResponses(questions, responses) {
  return questions.map((question, index) => {
    const selected = responses[index];
    const isAnswered = typeof selected === 'number';
    const isCorrect = isAnswered && selected === question.correctIndex;
    return {
      isAnswered,
      isCorrect,
      selected,
      correctAnswer: question.choices[question.correctIndex],
      explanation: question.explanation,
    };
  });
}

export function applyCorrections(view, questions, evaluation) {
  let firstUnanswered = null;
  evaluation.forEach((detail, index) => {
    if (!detail.isAnswered) {
      view.markQuestion(index, 'info', 'Choisis une réponse.');
      if (firstUnanswered === null) {
        firstUnanswered = index;
      }
      return;
    }
    if (detail.isCorrect) {
      view.markQuestion(index, 'correct', `Bonne réponse ! ${detail.explanation}`);
    } else {
      view.markQuestion(
        index,
        'incorrect',
        `Réponse attendue : <span class="answer-text">${detail.correctAnswer}</span>. ${detail.explanation}`,
      );
    }
  });
  if (firstUnanswered !== null && typeof view.scrollToQuestion === 'function') {
    view.scrollToQuestion(firstUnanswered);
  }
}

export function revealAllAnswers(view, questions) {
  questions.forEach((question, index) => view.revealAnswer(index, question));
}
