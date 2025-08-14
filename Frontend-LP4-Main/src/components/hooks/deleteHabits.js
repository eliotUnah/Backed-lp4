import { useState } from 'react';
import axios from 'axios';
import api from '../../utils/axiosConfig';

export const useDeleteHabit = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);
  const [success, setSuccess] = useState(false);

  const deleteHabit = async (habitId) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await api.delete('/eliminar-habito', {
        data: { habitId } // ✅ Así se manda el body con DELETE
      });

      setSuccess(true);
      return response.data;
    } catch (err) {
      setError(
        err.response?.data?.message || 'No se pudo eliminar el hábito'
      );
    } finally {
      setLoading(false);
    }
  };

  return { deleteHabit, loading, error, success };
};

export default useDeleteHabit;