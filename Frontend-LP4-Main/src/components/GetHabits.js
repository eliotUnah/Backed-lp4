import { useEffect, useState } from 'react';
import axios from 'axios';

const useHabits = () => {
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchHabits = async () => {
      try {
        const token = localStorage.getItem('jwt');
        const response = await axios.get('http://localhost:5000/buscar-habito', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setHabits(response.data);
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

    fetchHabits();
  }, []);

  return { habits, loading, error };
};

export default useHabits;
