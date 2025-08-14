import { useEffect, useState } from 'react';
import axios from 'axios';
import api from '../../utils/axiosConfig';

const useHabits = () => {
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchHabits = async () => {
    setLoading(true);
    try {
      const response = await api.get('/buscar-habito');
      console.log('Hábitos recibidos:', response.data);
      setHabits(response.data);
      setError('');
    } catch (err) {
      if (err.response?.status === 404) {
        setError('No se encontraron hábitos.');
      } else {
        setError('Error al cargar los hábitos.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHabits();
  }, []);

  return { habits, loading, error, refetch: fetchHabits };
};
export default useHabits; 