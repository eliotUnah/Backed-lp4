import { useState } from 'react';
import api from "../../utils/axiosConfig";
const useFriendship = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Enviar solicitud usando correo
  const invite = async (recipientEmail) => {
    try {
      setLoading(true);
      const { data } = await api.post('/friends/invite', { recipientEmail });
      return data;
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Aceptar solicitud usando ID
  const accept = async (friendshipId) => {
    try {
      setLoading(true);
      const { data } = await api.patch(`/friends/accept/${friendshipId}`);
      return data;
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Rechazar solicitud usando ID
  const reject = async (friendshipId) => {
    try {
      setLoading(true);
      const { data } = await api.patch(`/friends/reject/${friendshipId}`);
      return data;
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };


  // Obtener amigos aceptados del usuario autenticado
  const getFriends = async () => {
  try {
    setLoading(true);
    const { data } = await api.get('/friends/friends');
    console.log("Amigos recibidos:", data); // 👈 aquí
    return data;
  } catch (err) {
    setError(err.response?.data?.message || err.message);
    return [];
  } finally {
    setLoading(false);
  }
};

// ✅ Obtener solicitudes pendientes recibidas
  const getPendingRequests = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/friends/requests/pending');
      console.log("Solicitudes pendientes:", data);
      return data;
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      return [];
    } finally {
      setLoading(false);
    }
  };
  // Buscar usuario por correo
const searchUserByEmail = async (email) => {
  try {
    setLoading(true);
    const { data } = await api.get(`/friends/search?email=${email}`);
    return data; // Devuelve { email } si existe
  } catch (err) {
    setError(err.response?.data?.message || err.message);
    return null;
  } finally {
    setLoading(false);
  }
  };

  return {
    invite,
    searchUserByEmail,
    accept,
    reject,
    getFriends,
     getPendingRequests,
    loading,
    error
  };
};

export default useFriendship;
