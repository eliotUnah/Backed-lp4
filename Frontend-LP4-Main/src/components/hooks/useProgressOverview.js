import { useEffect, useState } from 'react';
import api from '../../utils/axiosConfig';

export function useProgressOverview() {
  const [data, setData] = useState({
    last30Days: [],
    percentage: 0,
    maxStreak: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOverview = async () => {
    try {
      const response = await api.get('/stats/overview', { withCredentials: true });

      const overview = response.data;

      setData({
        last30Days: overview.last30Days || [],
        percentage: overview.percentage || 0,
        maxStreak: overview.maxStreak || 0,
      });
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Error al obtener progreso');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOverview();
  }, []);

  return {
    ...data,
    loading,
    error,
    refetch: fetchOverview,
  };
}
