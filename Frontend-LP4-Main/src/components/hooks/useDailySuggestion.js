import { useState, useEffect } from "react";
import api from '../../utils/axiosConfig';

export const useDailySuggestion = () => {
  const [suggestion, setSuggestion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSuggestion = async () => {
      try {
        const res = await api.get("/ai/suggest");
        if (res.status === 200 && res.data) {
          setSuggestion(res.data);
        } else {
          setError("No se encontró sugerencia en la respuesta.");
        }
      } catch (err) {
        setError("Error al obtener sugerencia.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSuggestion();
  }, []);

  return { suggestion, loading, error };
};