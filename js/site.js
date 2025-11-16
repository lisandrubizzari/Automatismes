import { initThemeToggle, setCurrentYear } from './utils.js';

document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle(document.getElementById('themeToggle'));
  setCurrentYear(document.getElementById('year'));
});
