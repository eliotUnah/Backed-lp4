import api from '../../utils/axiosConfig';

const useUpdateLanding = () => {
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState('');

  const updateLanding = async (landingData) => {
    setLoading(true);
    setResponse(null);
    setError('');

    try {
      const res = await api.put('/api/landing', landingData);
      setResponse(res.data);
      return res.data;
    } catch (err) {
      console.error('❌ Error actualizando landing:', err);
      setError(err.response?.data?.message || 'Error desconocido al actualizar');
    } finally {
      setLoading(false);
    }
  };

  return { updateLanding, loading, response, error };
};

export default useUpdateLanding; 