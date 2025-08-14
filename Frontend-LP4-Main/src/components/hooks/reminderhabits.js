import { useState } from 'react';
import api from "../../utils/axiosConfig";

export const useReminders = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [createdReminder, setCreatedReminder] = useState(null);

  // 📥 Crear recordatorio usando habitId desde la URL
  const createReminder = async (habitId, { time, timezone }) => {
    setLoading(true);
    try {
      const res = await api.post(`/reminders/${habitId}`, { time, timezone });
      setCreatedReminder(res.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Error al crear recordatorio');
    } finally {
      setLoading(false);
    }
  };

  // 🔁 Activar/desactivar recordatorio
  const toggleReminderState = async (id, active) => {
    setLoading(true);
    try {
      const res = await api.patch(`/reminders/${id}/deactivate`, { active });
      setCreatedReminder(res.data.reminder); // actualiza el estado
    } catch (err) {
      setError(err.response?.data?.error || 'Error al cambiar estado');
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    createdReminder,
    createReminder,
    toggleReminderState,
  };
};
