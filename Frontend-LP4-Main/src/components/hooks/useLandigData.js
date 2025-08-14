import { useEffect, useState } from 'react';
import api from '../../utils/axiosConfig';

const useLandingData = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/api/landing')
      .then(res => setData(res.data))
      .catch(err => setError(err.response?.data?.message || 'Error cargando datos'))
      .finally(() => setLoading(false));
  }, []);

  return { data, loading, error };
};

export default useLandingData;
