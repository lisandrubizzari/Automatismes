const STORAGE_KEYS = {
  theme: 'automatismes-theme',
};

const FIVE_MINUTES = 5 * 60;

export function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function shuffle(array) {
  const clone = [...array];
  for (let i = clone.length - 1; i > 0; i -= 1) {
    const j = randInt(0, i);
    [clone[i], clone[j]] = [clone[j], clone[i]];
  }
  return clone;
}

export function formatSigned(value, { showPlus = true } = {}) {
  const sign = value >= 0 ? '+' : '-';
  const absoluteValue = Math.abs(value);
  if (!showPlus && value >= 0) {
    return `${absoluteValue}`;
  }
  return `${sign} ${absoluteValue}`;
}

export function formatDuration(totalSeconds) {
  const safeValue = Math.max(0, Number.isFinite(totalSeconds) ? totalSeconds : 0);
  const minutes = Math.floor(safeValue / 60)
    .toString()
    .padStart(2, '0');
  const seconds = Math.floor(safeValue % 60)
    .toString()
    .padStart(2, '0');
  return `${minutes}:${seconds}`;
}

export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

export function setCurrentYear(target) {
  if (target) {
    target.textContent = new Date().getFullYear();
  }
}

function getStoredTheme() {
  try {
    return localStorage.getItem(STORAGE_KEYS.theme);
  } catch (error) {
    return null;
  }
}

function storeTheme(theme) {
  try {
    localStorage.setItem(STORAGE_KEYS.theme, theme);
  } catch (error) {
    // ignore storage errors
  }
}

function systemPrefersDark() {
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
}

export function applyColorMode(mode) {
  const nextMode = mode || (systemPrefersDark() ? 'dark' : 'light');
  document.documentElement.dataset.colorMode = nextMode;
  return nextMode;
}

export function initThemeToggle(toggleButton) {
  if (!toggleButton) {
    return;
  }
  const stored = getStoredTheme();
  let currentMode = applyColorMode(stored);
  toggleButton.setAttribute('aria-pressed', currentMode === 'dark');
  toggleButton.textContent = currentMode === 'dark' ? 'Mode clair' : 'Mode sombre';

  toggleButton.addEventListener('click', () => {
    currentMode = currentMode === 'dark' ? 'light' : 'dark';
    applyColorMode(currentMode);
    storeTheme(currentMode);
    toggleButton.setAttribute('aria-pressed', currentMode === 'dark');
    toggleButton.textContent = currentMode === 'dark' ? 'Mode clair' : 'Mode sombre';
  });
}

export function safeRequestAnimationFrame(callback) {
  if ('requestAnimationFrame' in window) {
    return window.requestAnimationFrame(callback);
  }
  return setTimeout(callback, 16);
}

export function cancelSafeAnimationFrame(id) {
  if ('cancelAnimationFrame' in window) {
    window.cancelAnimationFrame(id);
  } else {
    clearTimeout(id);
  }
}

export function buildChoiceSet(correct, wrongChoices) {
  const filtered = wrongChoices.filter((choice) => choice !== correct);
  const choices = shuffle([correct, ...filtered]);
  return {
    choices,
    correctIndex: choices.indexOf(correct),
  };
}

export { FIVE_MINUTES };
