// src/components/hooks/createCheckin.js
import { useState } from 'react';
import axios from 'axios';
import api from '../../utils/axiosConfig';

const useCreateCheckin = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [streak, setStreak] = useState({ current: 0, best: 0 });

  const createCheckin = async (habitId) => {
    setLoading(true);
    setSuccess(false);
    setError('');

    try {
      const response = await api.post(`/habits/${habitId}/checkins`);

      setSuccess(true);
      setStreak({
        current: response.data.streakCurrent,
        best: response.data.streakBest,
      });
        return response.data;
    } catch (err) {
      if (err.response?.status === 409) {
        setError('Ya hiciste check-in hoy.');
      } else {
        setError('Error al registrar el check-in.');
      }
    } finally {
      setLoading(false);
    }
  };

  return { createCheckin, loading, success, error, streak };
};

export default useCreateCheckin;
