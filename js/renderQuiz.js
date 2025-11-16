export function createQuizRenderer({ container, progressFill, progressTrack, progressLabel }) {
  let questions = [];
  let responses = [];
  const nodes = [];

  function updateProgress() {
    const answered = responses.filter((value) => typeof value === 'number').length;
    const total = questions.length || 1;
    const ratio = answered / total;
    if (progressLabel) {
      const totalLabel = questions.length || 0;
      progressLabel.textContent = `Progression : ${answered}/${totalLabel}`;
    }
    if (progressTrack) {
      progressTrack.setAttribute('aria-valuenow', `${answered}`);
      progressTrack.setAttribute('aria-valuemax', `${questions.length || 0}`);
    }
    if (progressFill) {
      progressFill.style.width = `${ratio * 100}%`;
    }
  }

  function render(newQuestions) {
    questions = [...newQuestions];
    responses = Array(questions.length).fill(null);
    nodes.length = 0;

    if (!container) {
      return;
    }

    container.innerHTML = '';
    const fragment = document.createDocumentFragment();

    questions.forEach((question, index) => {
      const article = document.createElement('article');
      article.className = 'question-card';
      article.dataset.index = index.toString();

      const statement = document.createElement('p');
      statement.className = 'question-card__statement';
      statement.textContent = `Question ${index + 1}. ${question.statement}`;
      article.appendChild(statement);

      const choicesWrapper = document.createElement('div');
      choicesWrapper.className = 'question-card__choices';

      question.choices.forEach((choice, choiceIndex) => {
        const label = document.createElement('label');
        label.className = 'choice';

        const input = document.createElement('input');
        input.type = 'radio';
        input.name = `question-${index}`;
        input.value = choiceIndex;
        input.addEventListener('change', () => {
          responses[index] = Number(input.value);
          updateProgress();
        });

        const span = document.createElement('span');
        span.className = 'choice__label';
        span.textContent = choice;

        label.appendChild(input);
        label.appendChild(span);
        choicesWrapper.appendChild(label);
      });

      article.appendChild(choicesWrapper);

      const feedback = document.createElement('div');
      feedback.className = 'question-card__feedback';
      feedback.setAttribute('aria-live', 'polite');
      article.appendChild(feedback);

      fragment.appendChild(article);
      nodes[index] = article;
    });

    container.appendChild(fragment);
    updateProgress();
  }

  function getResponses() {
    return [...responses];
  }

  function markQuestion(index, status, message) {
    const node = nodes[index];
    if (!node) {
      return;
    }
    node.classList.remove('is-correct', 'is-incorrect');
    if (status === 'correct') {
      node.classList.add('is-correct');
    } else if (status === 'incorrect') {
      node.classList.add('is-incorrect');
    }
    const feedback = node.querySelector('.question-card__feedback');
    if (feedback) {
      feedback.innerHTML = message;
    }
  }

  function revealAnswer(index, question) {
    markQuestion(
      index,
      'correct',
      `Réponse : <span class="answer-text">${question.choices[question.correctIndex]}</span>. ${question.explanation}`,
    );
  }

  return {
    render,
    getResponses,
    markQuestion,
    revealAnswer,
    updateProgress,
    get questions() {
      return [...questions];
    },
  };
}
