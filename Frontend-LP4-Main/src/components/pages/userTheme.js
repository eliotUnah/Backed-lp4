// src/components/ThemeToggle.js
import { useTheme } from '../hooks/useTheme';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
     className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 px-4 py-2 rounded transition duration-300 
           bg-gray-200 dark:bg-gray-700 
           text-black dark:text-white hover:scale-105"
style={{ transform: 'translateX(-calc(50% + 20px))', cursor: 'pointer' }}

    >
      {theme === 'light' ? '🌞 Modo Claro' : '🌙 Modo Oscuro'}
    </button>
  );
};

export default ThemeToggle;
