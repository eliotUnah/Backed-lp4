import { useState, useEffect, useCallback } from "react";
import api from "../../utils/axiosConfig";

export const useObjectives = () => {
  const [objectives, setObjectives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 🆕 Usamos useCallback para que la función no se recree innecesariamente
  const fetchObjectives = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await api.get("/api/objectives/goals");

      if (res.status === 200 && Array.isArray(res.data)) {
        const enriched = res.data.map((obj) => {
          const hasGoal = obj.goal != null && obj.goal > 0;
          const hasTotal = obj.total != null;

          const progress = hasGoal && hasTotal
            ? Math.min((obj.total / obj.goal) * 100, 100)
            : 0;

          const statusMessage = hasGoal
            ? null
            : "⚠️ Meta no definida. No se puede calcular el progreso.";

          return {
            ...obj,
            progress,
            statusMessage,
          };
        });

        setObjectives(enriched);
      } else {
        setError("No se encontraron objetivos en la respuesta.");
      }
    } catch (err) {
      setError("Error al obtener objetivos.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Ejecutar al montar el componente
  useEffect(() => {
    fetchObjectives();
  }, [fetchObjectives]);

  // 🧩 Ahora también devolvemos fetchObjectives
  return { objectives, loading, error, fetchObjectives };
}; 