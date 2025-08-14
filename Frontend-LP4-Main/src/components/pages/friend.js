import React, { useState, useEffect } from 'react';
import useFriendship from '../hooks/friend.js';
import '../styles/firends.css'; 
import { useNavigate } from 'react-router-dom'; 
import miFoto from '../../assets/cat.jpg';

const FriendshipPage = () => {
const navigate = useNavigate(); 
const [searchResult, setSearchResult] = useState(null);
const [requests, setRequests] = useState([]);
const [activeTab, setActiveTab] = useState('Amigos');

  // Hooks para manejar la lógica de amistad
  const {
    invite,
    searchUserByEmail,
    getPendingRequests,
    accept,
    reject,
    getFriends,
    loading,
    error
  } = useFriendship();

  const [email, setEmail] = useState('');
  const [friends, setFriends] = useState([]);
  const [pending, setPending] = useState([]);

  // Cargar amigos y solicitudes pendientes
 useEffect(() => {
  const fetchData = async () => {
    const all = await getFriends();
      console.log("Respuesta del backend:", all); 
    setFriends(all); // ya son todos aceptados
  };
  fetchData();
}, []);

useEffect(() => {
  const fetchRequests = async () => {
    const data = await getPendingRequests();
    console.log("Solicitudes recibidas:", data);
    setRequests(data); // 👈 aquí actualizas el estado
  };
  fetchRequests();
}, []);

 const totalCards = 5;
const visibleRequests = requests.slice(0, totalCards);

const paddedRequests = [
  ...visibleRequests,
  ...Array.from({ length: Math.max(0, totalCards - visibleRequests.length) }).map((_, i) => ({
    id: `empty-${i}`,
    empty: true,
  })),
];
// mandar solicitud
  const handleInvite = async () => {
    if (!email) return;
    const result = await invite(email);
    if (result) {
      alert('Solicitud enviada');
      setEmail('');
    }
  };

  const handleAccept = async (id) => {
    const result = await accept(id);
    if (result) {
      alert('Solicitud aceptada');
      setPending(pending.filter(p => p._id !== id));
      setFriends([...friends, result.friendship.recipient]);
    }
  };
  
//buscar por correo
  const handleSearch = async () => {
  if (!email) return;
  const result = await searchUserByEmail(email);
  if (result) {
    setSearchResult(result);
  } else {
    alert('Usuario no encontrado');
    setSearchResult(null);
  }
};


  return (
    <div className="text-gray-800">
    {/* Barra de navegación */}
    <nav className="header-gradient text-white px-6 py-4">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">Amigos</h1>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <img
                src= {miFoto}// reemplaza esto con la ruta real de tu imagen
                 alt="Foto de perfil del usuario"
                className="w-10 h-10 rounded-full border-2 border-white"
            />
            <span className="online-dot"></span>
          </div>
          <span className="font-medium">Hola,Usuario</span>
        </div>
      </div>
    </nav>
     {/* Botón de Regreso */}
      <button
        onClick={() => navigate(-1)} // Regresar a la página anterior
        className="mb-4 text-purple-600 hover:underline"
      >
        <i className="bi bi-arrow-left-circle-fill mr-2"></i> Regresar
      </button> 

    {/* Contenido principal */}
    <main className="max-w-6xl mx-auto py-8 px-4">
      {/* Tabs */}
      <div className="flex space-x-8 border-b border-gray-200 mb-8">
         <button
            className={`font-medium pb-4 px-1 ${activeTab === 'Amigos' ? 'tab-active text-purple-800' : 'text-gray-500'}`}
            onClick={() => setActiveTab('Amigos')}
          >
            Amigos
          </button>
          <button
            className={`font-medium pb-4 px-1 ${activeTab === 'Solicitudes' ? 'tab-active text-purple-800' : 'text-gray-500'}`}
            onClick={() => setActiveTab('Solicitudes')}
          >
            Solicitudes
          </button>
          <button
            className={`font-medium pb-4 px-1 ${activeTab === 'Buscar' ? 'tab-active text-purple-800' : 'text-gray-500'}`}
            onClick={() => setActiveTab('Buscar')}
          >
            Buscar
          </button>
        </div>
     {/* Contenedor de amigos */}
{/* Contenido dinámico */}
{activeTab === 'Amigos' && (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
    {friends.length === 0 ? (
      <div className="friend-card rounded-xl p-4 animate-in text-center col-span-full">
        {/* Tarjeta cuando no hay amigos */}
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center mb-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
          <h3 className="font-semibold text-gray-500">Sin amigos</h3>
          <p className="text-sm text-gray-400 mb-4">No tienes amigos aún</p>
          <button
            onClick={() => setActiveTab('Buscar')}
            className="btn-primary text-white px-4 py-2 rounded-lg text-sm"
          >
            Buscar amigos
          </button>
        </div>
      </div>
    ) : (
      friends.map(friend => (
        <div key={friend.uid || friend.id} className="friend-card rounded-xl p-4 animate-in" style={{ animationDelay: '0.1s' }}>
          {/* Tarjeta de amigo real */}
          <div className="flex items-center mb-3">
            <div className="relative mr-3">
              <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold text-lg uppercase">
                {friend?.email?.charAt(0) || "?"}
              </div>
              <span className="online-dot"></span>
            </div>
            <div>
              <h3 className="font-semibold">{friend.name || friend.email}</h3>
              <p className="text-sm text-gray-500">En línea</p>
            </div>
          </div>
          <div className="flex space-x-2">
            <button className="ripple btn-primary text-white px-3 py-1 rounded-lg text-sm w-full">
              Mensaje
            </button>
            <button className="ripple btn-danger text-white px-3 py-1 rounded-lg text-sm w-full">
              Eliminar
            </button>
          </div>
        </div>
      ))
    )}
  </div>
)} 

{activeTab === 'Solicitudes' && (
  <div className="solicitudes-container">
    <h2 className="text-xl font-bold mb-6">Solicitudes de amistad</h2>
    <div className="space-y-4">
      {paddedRequests.map(request =>
        request.empty ? (
          <div key={request._id || request.id} className="friend-card rounded-xl p-4 animate-in bg-white shadow-sm">
            <div className="flex items-center mb-3">
              <div className="relative mr-3">
                <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold text-lg uppercase">
                 {request?.requester?.email?.charAt(0) || "?"}
               </div>
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-500">Sin solicitudes</h3>
                <p className="text-sm text-gray-400">No tienes solicitudes pendientes</p>
              </div>
            </div>
          </div>
        ) : (
          <div key={request._id || request.id} className="friend-card rounded-xl p-4 animate-in bg-white shadow-sm">
            <div className="flex items-center mb-3">
              <div className="relative mr-3">
                <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-purple-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
              </div>
              <div>
               <h3 className="font-semibold">{request.requester.name || request.requester.email}</h3>
                <p className="text-sm text-gray-500">{request.requester.email}</p>
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={async () => {
                  await accept(request._id);
                  const updated = await getPendingRequests();
                  setRequests(updated);
                }}
                className="ripple btn-primary text-white px-3 py-1 rounded-lg text-sm w-full"
              >
                Aceptar
              </button>
              <button
                onClick={async () => {
                  await reject(request._id);
                  const updated = await getPendingRequests();
                  setRequests(updated);
                }}
                className="ripple btn-danger text-white px-3 py-1 rounded-lg text-sm w-full"
              >
                Rechazar
              </button>
            </div>
          </div>
        )
      )}
    </div>
  </div>
)} 
{activeTab === 'Buscar' && (
  <div className="buscar-container">
    <div className="relative mb-8">
      <input
        type="text"
        placeholder="Buscar amigos..."
        className="search-input w-full p-4 rounded-xl border border-gray-300 focus:outline-none pl-12"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fillRule="evenodd"
          d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
          clipRule="evenodd"
        />
      </svg>
    </div>

    <div className="flex justify-end mb-4">
      <button
        onClick={handleSearch}
        className="bg-blue-500 text-white px-4 py-2 rounded-xl hover:bg-blue-600 transition"
      >
        Buscar
      </button>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {searchResult ? (
  <div className="bg-white p-4 rounded-xl shadow-md flex flex-col items-center text-center">
    <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold text-lg uppercase mb-3">
      {searchResult.email?.charAt(0) || "?"}
    </div>
    <p className="text-lg font-semibold">{searchResult.name || searchResult.email}</p>
    <p className="text-sm text-gray-500">{searchResult.email}</p>
    <button
      onClick={handleInvite}
      className="mt-4 bg-green-500 text-white px-4 py-2 rounded-xl hover:bg-green-600 transition"
    >
      Enviar solicitud
    </button>
  </div>
) : (
  email.trim() && (
    <p className="text-gray-500 col-span-full">No se encontró ningún usuario con ese correo.</p>
  )
)}

    </div>
  </div>
)}

    </main>
  </div>
);
};
export default FriendshipPage; 