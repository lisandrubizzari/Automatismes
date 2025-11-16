const ALLOWED_TAGS = new Set(['br', 'span', 'strong', 'em', 'svg', 'line', 'path', 'g', 'rect', 'circle', 'title']);
const ALLOWED_ATTRS = {
  span: ['class'],
  strong: ['class'],
  em: ['class'],
  svg: ['class', 'viewBox', 'role', 'aria-label'],
  line: ['x1', 'x2', 'y1', 'y2', 'stroke', 'stroke-width'],
  path: ['d', 'stroke', 'stroke-width', 'fill'],
  g: ['stroke', 'stroke-width', 'fill'],
  rect: ['x', 'y', 'width', 'height', 'stroke', 'stroke-width', 'fill'],
  circle: ['cx', 'cy', 'r', 'stroke', 'stroke-width', 'fill'],
  title: [],
};

function sanitizeNode(node) {
  if (node.nodeType === Node.TEXT_NODE) {
    return document.createTextNode(node.textContent || '');
  }
  if (node.nodeType === Node.ELEMENT_NODE) {
    const tagName = node.tagName.toLowerCase();
    const allowedAttrs = ALLOWED_ATTRS[tagName] || [];
    const safeElement = document.createElement(tagName);
    if (!ALLOWED_TAGS.has(tagName)) {
      const fragment = document.createDocumentFragment();
      node.childNodes.forEach((child) => fragment.appendChild(sanitizeNode(child)));
      return fragment;
    }
    [...node.attributes].forEach((attr) => {
      if (allowedAttrs.includes(attr.name)) {
        safeElement.setAttribute(attr.name, attr.value);
      }
    });
    node.childNodes.forEach((child) => safeElement.appendChild(sanitizeNode(child)));
    return safeElement;
  }
  return document.createDocumentFragment();
}

function createSafeFragment(html) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(`<body>${html}</body>`, 'text/html');
  const fragment = document.createDocumentFragment();
  doc.body.childNodes.forEach((child) => fragment.appendChild(sanitizeNode(child)));
  return fragment;
}

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
      statement.id = `question-${index}-statement`;
      const prefix = `Question ${index + 1}. `;
      if (question.statementHTML) {
        statement.textContent = prefix;
        statement.appendChild(createSafeFragment(question.statementHTML));
      } else {
        statement.textContent = `${prefix}${question.statement}`;
      }
      article.appendChild(statement);

      const choicesWrapper = document.createElement('div');
      choicesWrapper.className = 'question-card__choices';
      choicesWrapper.setAttribute('role', 'radiogroup');
      choicesWrapper.setAttribute('aria-labelledby', statement.id);

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
    node.classList.remove('is-correct', 'is-incorrect', 'is-info');
    if (status === 'correct') {
      node.classList.add('is-correct');
    } else if (status === 'incorrect') {
      node.classList.add('is-incorrect');
    } else if (status === 'info') {
      node.classList.add('is-info');
    }
    const feedback = node.querySelector('.question-card__feedback');
    if (feedback) {
      feedback.innerHTML = '';
      feedback.appendChild(createSafeFragment(message));
    }
  }

  function revealAnswer(index, question) {
    markQuestion(
      index,
      'correct',
      `Réponse : <span class="answer-text">${question.choices[question.correctIndex]}</span>. ${question.explanation}`,
    );
  }

  function scrollToQuestion(index) {
    const node = nodes[index];
    if (!node) {
      return;
    }
    node.scrollIntoView({ behavior: 'smooth', block: 'center' });
    node.classList.add('is-highlighted');
    setTimeout(() => node.classList.remove('is-highlighted'), 1200);
  }

  return {
    render,
    getResponses,
    markQuestion,
    revealAnswer,
    updateProgress,
    scrollToQuestion,
    get questions() {
      return [...questions];
    },
  };
}
