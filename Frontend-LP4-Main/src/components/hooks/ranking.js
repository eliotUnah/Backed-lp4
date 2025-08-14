import { useEffect, useState } from "react";
import api from "../../utils/axiosConfig"; // 👈 Usamos api personalizado

const useGlobalRanking = () => {
  const [ranking, setRanking] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRanking = async () => {
      try {
        const response = await api.get("/global"); // 👈 Usa baseURL del api
        setRanking(response.data.data);
      } catch (err) {
        console.error("Error al obtener el ranking global:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRanking();
  }, []);

  return { ranking, loading, error };
};

export default useGlobalRanking;
