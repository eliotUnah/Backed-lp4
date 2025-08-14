// src/hooks/useSuggestionsHistory.js
import { useState, useEffect } from "react";
import api from "../../utils/axiosConfig";

export const useSuggestionsHistory = () => {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSuggestions = async () => {
    try {
      const res = await api.get("/ai/history");
      setSuggestions(res.data);
    } catch (err) {
      setError("Error al cargar sugerencias");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuggestions();
  }, []);

  return { suggestions, loading, error, refresh: fetchSuggestions };
};
