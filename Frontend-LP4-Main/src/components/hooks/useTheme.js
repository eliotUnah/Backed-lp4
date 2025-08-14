import { useEffect, useState } from 'react';
import api from '../../utils/axiosConfig';
import { useAuth } from '../../contexts/AuthContext';

export const useTheme = () => {
  const [theme, setTheme] = useState(null); // null evita aplicar tema antes de cargar
  const { currentUser } = useAuth();

  useEffect(() => {
    const applyTheme = (newTheme) => {
      setTheme(newTheme);
      document.documentElement.classList.toggle('dark', newTheme === 'dark');
      localStorage.setItem('theme', newTheme);
    };

    const initTheme = async () => {
      if (currentUser) {
        try {
          const res = await api.get('/api/users/preferences');
          applyTheme(res.data.theme);
        } catch {
          // Fallback al sistema o localStorage
          const localTheme = localStorage.getItem('theme');
          const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
          applyTheme(localTheme || (prefersDark ? 'dark' : 'light'));
        }
      } else {
        const localTheme = localStorage.getItem('theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        applyTheme(localTheme || (prefersDark ? 'dark' : 'light'));
      }
    };

    initTheme();
  }, [currentUser]);

  const toggleTheme = async () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
    localStorage.setItem('theme', newTheme);

    if (currentUser) {
      try {
        await api.put('/api/users/preferences', { theme: newTheme });
      } catch (err) {
        console.error("❌ Error al actualizar tema:", err);
      }
    }
  };

  return { theme, toggleTheme };
};