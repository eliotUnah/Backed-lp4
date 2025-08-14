import React from "react";
import { Trophy, Medal, Star, Crown, Award, TrendingUp, User } from "lucide-react";
import useGlobalRanking from "../hooks/ranking";
import '../styles/animation_ranking.css';
import { useNavigate } from 'react-router-dom';
const GlobalRankingPage = () => {
  const { ranking, loading, error } = useGlobalRanking();
  const navigate = useNavigate(); // Hook para navegar
  const getRankIcon = (index) => {
  switch(index) {
    case 0: return React.createElement(Crown, { style: { width: "1.25rem", height: "1.25rem", color: "#a855f7" } });
    case 1: return React.createElement(Trophy, { style: { width: "1.25rem", height: "1.25rem", color: "#7c3aed" } });
    case 2: return React.createElement(Star, { style: { width: "1.25rem", height: "1.25rem", color: "#6d28d9" } });
    default: return null;
  }
};

  const getInitials = (email) => {
    return email.charAt(0).toUpperCase();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Botón de Regreso */}
        <button
          onClick={() => navigate(-1)} // Regresar a la página anterior
          className="mb-4 text-purple-200 hover:underline flex items-center"
        >
          <i className="bi bi-arrow-left-circle-fill mr-2"></i> Regresar
        </button>
        {/* Header con efecto RGB */}
        <div className="text-center mb-8 animate-rgb-glow">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Trophy className="w-10 h-10 text-white rgb-icon" />
            <h1 className="text-4xl font-bold text-white animate-rgb-text">
              Ranking Global 
            </h1>
            <Trophy className="w-10 h-10 text-white rgb-icon" />
          </div>
          <p className="text-purple-200 text-lg animate-rgb-text">
            Los mejores usuarios de Habituate
          </p>
        </div>

        {/* Podio con efectos RGB */}
        {!loading && !error && ranking.length > 0 && (
          <div className="mb-8">
            <div className="flex items-end justify-center gap-4">
              
              {/* 2nd Place con RGB */}
              {ranking[1] && (
                <div className="text-center transform transition-transform hover:scale-105">
                  <div className="bg-gradient-to-r from-purple-400 to-pink-400 rounded-t-lg p-4 shadow-2xl animate-rgb-glow">
                    <Trophy className="w-12 h-12 text-white mx-auto mb-2 animate-rgb-text" />
                    <div className="text-2xl font-bold text-white animate-rgb-text">2</div>
                  </div>
                  <div className="bg-gray-900 p-4 rounded-b-lg shadow-2xl animate-rgb-border">
                    <p className="font-semibold text-white mb-1">{ranking[1].email}</p>
                    <p className="text-2xl font-bold text-white animate-rgb-text">
                      {ranking[1].score.toLocaleString()}
                    </p>
                  </div>
                </div>
              )}

              {/* 1st Place con RGB intenso */}
              {ranking[0] && (
                <div className="text-center transform transition-transform hover:scale-110 z-10">
                  <div className="rgb-card bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 rounded-t-xl p-6 shadow-2xl">
                    <Crown className="w-16 h-16 text-white mx-auto mb-2 animate-rgb-text" />
                    <div className="text-3xl font-bold text-white animate-rgb-text">1</div>
                  </div>
                  <div className="bg-gray-900 p-6 rounded-b-xl shadow-2xl animate-rgb-border">
                    <p className="font-bold text-white text-lg mb-1">{ranking[0].email}</p>
                    <p className="text-3xl font-bold text-white animate-rgb-text">
                      {ranking[0].score.toLocaleString()}
                    </p>
                  </div>
                </div>
              )}

              {/* 3rd Place con RGB */}
              {ranking[2] && (
                <div className="text-center transform transition-transform hover:scale-105">
                  <div className="bg-gradient-to-r from-blue-400 to-cyan-400 rounded-t-lg p-4 shadow-2xl animate-rgb-glow">
                    <Star className="w-12 h-12 text-white mx-auto mb-2 animate-rgb-text" />
                    <div className="text-2xl font-bold text-white animate-rgb-text">3</div>
                  </div>
                  <div className="bg-gray-900 p-4 rounded-b-lg shadow-2xl animate-rgb-border">
                    <p className="font-semibold text-white mb-1">{ranking[2].email}</p>
                    <p className="text-2xl font-bold text-white animate-rgb-text">
                      {ranking[2].score.toLocaleString()}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Loading State con RGB */}
        {loading && (
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-full animate-rgb-pulse mx-auto mb-4"></div>
            <p className="text-white text-lg animate-rgb-text">Cargando ranking...</p>
          </div>
        )}

        {/* Tabla con efectos RGB */}
        {!loading && !error && (
          <div className="animate-rgb-wave">
            <div className="bg-gray-900 rounded-xl shadow-2xl overflow-hidden rgb-card">
              <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 p-6 animate-rgb-wave">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Award className="w-6 h-6 animate-rgb-text" />
                  Tabla de Posiciones 
                </h2>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider animate-rgb-text">
                        Posición
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider animate-rgb-text">
                        Usuario
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider animate-rgb-text">
                        Puntaje
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider animate-rgb-text">
                        Estado
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {ranking.map((user, index) => (
                      <tr 
                        key={user.uid} 
                        className="border-b border-gray-800 hover:bg-gray-800 transition-colors"
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            {getRankIcon(index)}
                            <span className="text-lg font-bold text-white animate-rgb-text">
                              #{index + 1}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 via-pink-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold animate-rgb-pulse">
                              {getInitials(user.email)}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-white animate-rgb-text">
                                {user.email}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-lg font-bold text-white animate-rgb-text">
                            {user.score.toLocaleString()}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1">
                            <TrendingUp className="w-4 h-4 text-green-400 animate-rgb-text" />
                            <span className="text-sm text-green-400 animate-rgb-text">+5%</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GlobalRankingPage; 