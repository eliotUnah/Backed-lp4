import { useState } from 'react';
import axios from 'axios';

// 🔄 Hook para sincronizar hábitos como eventos en Google Calendar
export const useSyncHabits = () => {
  const [syncing, setSyncing] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const syncHabits = async () => {
    setSyncing(true);
    setError(null);

    try {
      const response = await axios.post(
        'http://localhost:5000/calendar/sync-habits',
        {},
        { withCredentials: true }
      );
      setResult(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al sincronizar hábitos');
    } finally {
      setSyncing(false);
    }
  };

  return { syncHabits, syncing, result, error };
};

// 🎯 Hook para crear evento de prueba en Google Calendar
export const useTestEvent = () => {
  const [creating, setCreating] = useState(false);
  const [event, setEvent] = useState(null);
  const [error, setError] = useState(null);

  const createTestEvent = async () => {
    setCreating(true);
    setError(null);

    try {
      const response = await axios.post(
        'http://localhost:5000/calendar/crear-evento-prueba',
        {},
        { withCredentials: true }
      );
      setEvent(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al crear evento');
    } finally {
      setCreating(false);
    }
  };

  return { createTestEvent, creating, event, error };
};
