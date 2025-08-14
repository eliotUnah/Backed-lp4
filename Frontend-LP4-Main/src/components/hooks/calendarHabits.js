import { useState, useEffect } from 'react';
import axios from 'axios';

// 🔗 Hook para iniciar la vinculación usando window.location.href
export const useGoogleAuth = () => {
  const startAuth = () => {
    window.location.href = 'http://localhost:5000/integrations/google/auth';
  };

  return { startAuth };
};

// 🔁 Hook para manejar el retorno desde Google OAuth y guardar el flag
export const useGoogleCallback = () => {
  const [status, setStatus] = useState('pending');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const state = urlParams.get('state');

    if (code && state) {
      axios.get('http://localhost:5000/integrations/google/callback', {
        params: { code, state },
        withCredentials: true,
      })
        .then(() => {
          setStatus('success');
          setMessage('✅ Vinculación exitosa con Google Calendar');
          localStorage.setItem('googleCalendarLinked', 'true');
        })
        .catch((err) => {
          setStatus('error');
          setMessage(
            '❌ Error en el callback: ' +
              (err.response?.data?.message || err.message)
          );
          localStorage.removeItem('googleCalendarLinked');
        });
    } else {
      setStatus('error');
      setMessage('🚨 No se encontraron parámetros en la URL');
    }
  }, []);

  return { status, message };
};

// 🕵️‍♂️ Hook para verificar si el usuario ya está vinculado (usando el backend)
export const useGoogleStatus = () => {
  const [isLinked, setIsLinked] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get('http://localhost:5000/integrations/google/status', {
        withCredentials: true,
      })
      .then((res) => {
        const linked = res.data.linked === true;
        setIsLinked(linked);
        if (linked) {
          localStorage.setItem('googleCalendarLinked', 'true');
        } else {
          localStorage.removeItem('googleCalendarLinked');
        }
      })
      .catch((err) => {
        console.error('❌ Error al verificar vinculación:', err.message || err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return { isLinked, loading };
};

export default {
  useGoogleAuth,
  useGoogleCallback,
  useGoogleStatus,
};

