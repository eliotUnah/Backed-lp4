import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../utils/axiosConfig';

const useAchievements = () => {
  const { currentUser } = useAuth();
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!currentUser) {
      setAchievements([]);
      setLoading(false);
      return;
    }

    const fetchAchievements = async () => {
      try {
        // Aquí ya no hace falta obtener el token
       const res = await api.get('/api/achievements'); 
        setAchievements(res.data);
      } catch (err) {
        console.error("❌ Error al obtener logros:", err);
        setError(err.response?.data?.message || "No se pudieron cargar los logros");
      } finally {
        setLoading(false);
      }
    };

    fetchAchievements();
  }, [currentUser]);

  return { achievements, loading, error };
};

export default useAchievements;