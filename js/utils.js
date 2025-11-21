const STORAGE_KEYS = {
  theme: 'automatismes-theme',
};

const FIVE_MINUTES = 5 * 60;

export function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function gcd(a, b) {
  const absA = Math.abs(a);
  const absB = Math.abs(b);
  return absB === 0 ? absA : gcd(absB, absA % absB);
}

export function simplifyFraction(num, den) {
  const divisor = gcd(num, den);
  const normalizedDen = den / divisor;
  const normalizedNum = num / divisor;
  return { numerator: normalizedNum, denominator: normalizedDen };
}

export function simplifySqrt(n) {
  const safeN = Math.max(0, Math.trunc(n));
  let factor = 1;
  for (let i = 10; i >= 2; i -= 1) {
    const square = i * i;
    if (safeN % square === 0) {
      factor = i;
      break;
    }
  }
  const rest = safeN / (factor * factor);
  return { factor, rest };
}

export function formatExponent(base, exponent) {
  if (exponent === 2) {
    return `${base}²`;
  }
  if (exponent === 3) {
    return `${base}³`;
  }
  return `${base}<sup>${exponent}</sup>`;
}

const SIMPLE_INTEGERS = Array.from({ length: 41 }, (_, i) => i - 20);

export function pickSimpleInteger(min = -20, max = 20) {
  const allowed = SIMPLE_INTEGERS.filter((value) => value >= min && value <= max);
  if (allowed.length === 0) {
    if (min > 0) {
      const positive = SIMPLE_INTEGERS.filter((value) => value > 0);
      return positive[randInt(0, positive.length - 1)];
    }
    if (max < 0) {
      const negative = SIMPLE_INTEGERS.filter((value) => value < 0);
      return negative[randInt(0, negative.length - 1)];
    }
    return SIMPLE_INTEGERS[randInt(0, SIMPLE_INTEGERS.length - 1)];
  }
  return allowed[randInt(0, allowed.length - 1)];
}

export const ALLOWED_FRACTIONS = [
  { numerator: 1, denominator: 2 },
  { numerator: 1, denominator: 3 },
  { numerator: 1, denominator: 4 },
  { numerator: 2, denominator: 3 },
  { numerator: 3, denominator: 4 },
  { numerator: 3, denominator: 2 },
  { numerator: 5, denominator: 2 },
];

export function pickAllowedFraction() {
  return ALLOWED_FRACTIONS[randInt(0, ALLOWED_FRACTIONS.length - 1)];
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
