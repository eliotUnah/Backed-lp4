import { useState } from 'react';
import axios from 'axios';
import api from '../../utils/axiosConfig';

/**
 * 🧠 Hook para buscar hábitos filtrados por texto, frecuencia y categoría
 * Conecta al endpoint GET /filtrar-habitos usando query parameters
 */
const useSearchHabits = () => {
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  /**
   * 🔍 Realiza la búsqueda de hábitos según filtros enviados
   * @param {Object} filters - Puede incluir search, frequency, category
   */
  const searchHabits = async (filters = {}) => {
    setLoading(true);
    setError('');

    try {

      // 🔄 Limpieza básica de los parámetros (evita + y espacios innecesarios)
      const cleanFilters = {
        search: filters.search?.replace(/\+/g, ' ').trim() || '',
        category: filters.category?.trim() || '',
        frequency: filters.frequency?.trim() || ''
      };

        const response = await api.get('/filtrar-habitos', {
        params: cleanFilters,
      });

      setHabits(Array.isArray(response.data.habits) ? response.data.habits : []);
    } catch (err) {
      console.error('❌ Error al buscar hábitos:', err);
      setError('Ocurrió un error al buscar hábitos.');
      setHabits([]);
    } finally {
      setLoading(false);
    }
  };

  return { habits, loading, error, searchHabits };
};

export default useSearchHabits;