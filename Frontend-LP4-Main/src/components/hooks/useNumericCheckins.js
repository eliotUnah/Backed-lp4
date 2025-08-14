import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../utils/axiosConfig';

const useNumericCheckins = (habitId) => {
  const { currentUser } = useAuth();
  const [checkins, setCheckins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [adding, setAdding] = useState(false); // Para estado de POST

  // Función para obtener check-ins
  const fetchCheckins = useCallback(async () => {
    if (!currentUser || !habitId) {
      setCheckins([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await api.get(`/api/numeric-checkins/${habitId}/checkins/number`);
      setCheckins(res.data);
    } catch (err) {
      console.error("❌ Error al obtener check-ins numéricos:", err);
      setError(err.response?.data?.message || "No se pudieron cargar los check-ins");
    } finally {
      setLoading(false);
    }
  }, [currentUser, habitId]);

  useEffect(() => {
    fetchCheckins();
  }, [fetchCheckins]);

  // Función para agregar un check-in numérico
  const addCheckin = async (value) => {
    if (!currentUser || !habitId) return;

    setAdding(true);
    setError(null);

    try {
      const res = await api.post(`/api/numeric-checkins/${habitId}/checkins/number`, { value });
      // Agregar el nuevo check-in al estado local
      setCheckins(prev => [res.data.checkin, ...prev]);
      return res.data.checkin;
    } catch (err) {
      console.error("❌ Error al agregar check-in numérico:", err);
      setError(err.response?.data?.message || "No se pudo agregar el check-in");
      throw err;
    } finally {
      setAdding(false);
    }
  };

  return { checkins, loading, error, adding, fetchCheckins, addCheckin };
};

export default useNumericCheckins;

