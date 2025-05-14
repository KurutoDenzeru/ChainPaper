import { ref, watch, onMounted } from 'vue';

export type Theme = 'light' | 'dark' | 'system';

const THEME_STORAGE_KEY = 'chainpaper-theme';

export function useTheme() {
  const currentTheme = ref<Theme>('system');

  const applyTheme = (theme: Theme) => {
    if (theme === 'system') {
      const systemPrefersDark = process.client ? window.matchMedia('(prefers-color-scheme: dark)').matches : false;
      document.documentElement.classList.toggle('dark', systemPrefersDark);
    } else {
      document.documentElement.classList.toggle('dark', theme === 'dark');
    }
    currentTheme.value = theme;
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  };

  const cycleTheme = () => {
    const themes: Theme[] = ['light', 'dark', 'system'];
    const currentIndex = themes.indexOf(currentTheme.value);
    const nextIndex = (currentIndex + 1) % themes.length;
    applyTheme(themes[nextIndex]);
  };

  onMounted(() => {
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY) as Theme | null;
    if (savedTheme) {
      applyTheme(savedTheme);
    } else {
      applyTheme('system'); // Default to system preference
    }

    // Listen for system theme changes
    const mediaQuery = process.client ? window.matchMedia('(prefers-color-scheme: dark)') : null;
    const handleSystemThemeChange = (e: MediaQueryListEvent) => {
      if (currentTheme.value === 'system') {
        document.documentElement.classList.toggle('dark', e.matches);
      }
    };

    mediaQuery.addEventListener('change', handleSystemThemeChange);

    // Initial check for system theme if 'system' is the current/saved theme
    if (currentTheme.value === 'system') {
        document.documentElement.classList.toggle('dark', mediaQuery.matches);
    }
  });

  watch(currentTheme, (newTheme) => {
    if (newTheme !== 'system') {
        applyTheme(newTheme); // re-apply to ensure class is correct if switching from system
    }
  });

  return {
    currentTheme,
    applyTheme,
    cycleTheme,
  };
}