import React from 'react';
import useAchievements from '../hooks/useAchievements.js';

const Medallas = () => {
  const { achievements, loading, error } = useAchievements();

  if (loading) return <p className="text-purple-200 text-center animate-pulse">Cargando logros...</p>;
  if (error) return <p className="text-red-400 text-center">Error: {error}</p>;

  // Mostrar icono según tipo de logro con efectos wow
  const getMedalIcon = (type) => {
    if (type === 'PerfectWeek' || type === 'MonthlyConsistency') {
      return (
        <div className="relative">
          {/* Anillos de energía pulsante */}
          <div className="absolute inset-0 animate-ping">
            <i className="bi bi-trophy-fill text-yellow-300 text-4xl opacity-75"></i>
          </div>
          <div className="absolute inset-0 animate-pulse animation-delay-200">
            <i className="bi bi-trophy-fill text-yellow-200 text-4xl opacity-50"></i>
          </div>
          {/* Trofeo principal */}
          <i className="bi bi-trophy-fill text-yellow-400 text-4xl animate-bounce relative z-10 
                      drop-shadow-lg filter hover:animate-pulse"></i>
          {/* Sparkles flotantes */}
          <div className="absolute -top-2 -right-2 animate-bounce animation-delay-300">
            <i className="bi bi-stars text-yellow-300 text-lg"></i>
          </div>
          <div className="absolute -bottom-1 -left-2 animate-bounce animation-delay-500">
            <i className="bi bi-star-fill text-yellow-400 text-sm"></i>
          </div>
        </div>
      );
    }
    return (
      <div className="relative">
        {/* Efecto de rotación y brillo */}
        <div className="absolute inset-0 animate-spin animation-duration-3000">
          <i className="bi bi-circle text-purple-300 text-5xl opacity-30"></i>
        </div>
        {/* Medalla principal con efecto shimmer */}
        <i className="bi bi-medal-fill text-purple-400 text-4xl animate-pulse relative z-10
                    hover:animate-bounce transition-all duration-300 filter drop-shadow-lg
                    hover:text-purple-300 hover:scale-110"></i>
        {/* Partículas flotantes */}
        <div className="absolute -top-1 -right-1 animate-ping animation-delay-200">
          <i className="bi bi-gem text-purple-300 text-xs"></i>
        </div>
        <div className="absolute -bottom-1 -left-1 animate-ping animation-delay-400">
          <i className="bi bi-diamond text-purple-400 text-xs"></i>
        </div>
      </div>
    );
  };

  // Filtrar logros con hábitos válidos
  const validAchievements = achievements.filter(
    (a) => a.habitId && a.habitId.title
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 p-8">
      {/* Efectos de fondo animados */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-purple-600 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-indigo-600 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
        {/* Estrellas flotantes */}
        <div className="absolute top-10 left-10 animate-pulse animation-delay-1000">
          <i className="bi bi-star text-purple-300 opacity-30"></i>
        </div>
        <div className="absolute top-20 right-20 animate-pulse animation-delay-3000">
          <i className="bi bi-star-fill text-indigo-300 opacity-40"></i>
        </div>
        <div className="absolute bottom-20 left-20 animate-pulse animation-delay-5000">
          <i className="bi bi-gem text-purple-400 opacity-30"></i>
        </div>
        <div className="absolute bottom-32 right-32 animate-pulse animation-delay-2000">
          <i className="bi bi-diamond text-indigo-400 opacity-35"></i>
        </div>
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="bg-gradient-to-br from-purple-900/80 via-purple-700/80 to-purple-500/80 backdrop-blur-sm p-8 rounded-2xl shadow-2xl border border-purple-400/20">
          {/* Botón de Regresar */}
          <div className="mb-6">
            <button 
              onClick={() => window.history.back()}
              className="group flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-purple-700 
                       hover:from-purple-500 hover:to-purple-600 text-white px-6 py-3 rounded-full 
                       shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300
                       border border-purple-400/30 hover:border-purple-300/50 backdrop-blur-sm relative overflow-hidden"
            >
              <i className="bi bi-arrow-left text-lg group-hover:animate-pulse group-hover:-translate-x-1 
                          transition-all duration-300"></i>
              <span className="font-semibold">Regresar</span>
              {/* Efecto de brillo */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent 
                           opacity-0 group-hover:opacity-100 transform -skew-x-12 translate-x-[-100%] 
                           group-hover:translate-x-[200%] transition-all duration-700 rounded-full"></div>
            </button>
          </div>
      <div className="text-center mb-8">
        <h2 className="text-white text-3xl font-bold mb-2 animate-fade-in relative">
          <span className="relative inline-block">
            {/* Efectos de brillo en las estrellas */}
            <i className="bi bi-stars text-yellow-300 mr-3 animate-pulse hover:animate-spin 
                        transition-all duration-300 hover:text-yellow-200"></i>
            <span className="relative">
              Tus Logros
              {/* Efecto de subrayado animado */}
              <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-yellow-300 
                           group-hover:w-full transition-all duration-500"></div>
            </span>
            <i className="bi bi-stars text-yellow-300 ml-3 animate-pulse hover:animate-spin 
                        transition-all duration-300 hover:text-yellow-200 animation-delay-200"></i>
          </span>
          {/* Partículas flotantes alrededor del título */}
          <div className="absolute -top-2 left-1/4 animate-bounce animation-delay-300">
            <i className="bi bi-gem text-yellow-200 text-sm opacity-70"></i>
          </div>
          <div className="absolute -top-1 right-1/3 animate-bounce animation-delay-500">
            <i className="bi bi-diamond text-purple-300 text-xs opacity-60"></i>
          </div>
        </h2>
        <div className="w-24 h-1 bg-gradient-to-r from-yellow-400 to-purple-300 mx-auto rounded-full animate-pulse"></div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {validAchievements.map((achievement, index) => (
          <div 
            key={achievement.id} 
            className="bg-gradient-to-br from-white to-purple-50 p-6 rounded-xl shadow-lg 
                       transition-all duration-300 transform hover:scale-105 hover:shadow-2xl 
                       hover:-translate-y-2 animate-fade-in-up border border-purple-200"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="text-center mb-4">
              <div className="inline-block p-4 bg-gradient-to-r from-purple-100 via-white to-purple-100 
                           rounded-full mb-3 relative overflow-hidden shadow-lg hover:shadow-xl 
                           transition-all duration-300 hover:scale-105">
                {/* Efecto de ondas de energía */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-200 to-transparent
                             opacity-0 hover:opacity-50 animate-pulse"></div>
                {/* Contenedor del ícono */}
                <div className="relative z-10">
                  {getMedalIcon(achievement.type)}
                </div>
              </div>
              <h3 className="text-xl font-bold text-purple-800 mb-2 hover:text-purple-600 
                          transition-colors duration-300">
                {achievement.habitId.title}
              </h3>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-center">
                <i className="bi bi-award text-purple-600 mr-2"></i>
                <p className="text-purple-700 font-semibold">Logro: {achievement.type}</p>
              </div>
              
              <div className="flex items-center justify-center">
                <i className="bi bi-calendar-check text-purple-500 mr-2"></i>
                <p className="text-purple-600">
                  Ganado el: {new Date(achievement.earnedOn).toLocaleDateString()}
                </p>
              </div>
            </div>
            
            {/* Efecto de brillo en hover */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent 
                           opacity-0 hover:opacity-20 transform -skew-x-12 translate-x-full 
                           hover:translate-x-[-100%] transition-all duration-700 pointer-events-none rounded-xl">
            </div>
          </div>
        ))}
      </div>
      
      {validAchievements.length === 0 && (
        <div className="text-center py-12">
          <div className="relative inline-block mb-6">
            {/* Efectos de partículas flotantes */}
            <div className="absolute -top-4 -left-4 animate-bounce animation-delay-300">
              <i className="bi bi-star text-purple-300 text-2xl"></i>
            </div>
            <div className="absolute -top-2 -right-6 animate-bounce animation-delay-500">
              <i className="bi bi-heart text-purple-200 text-xl"></i>
            </div>
            <div className="absolute -bottom-3 -left-2 animate-bounce animation-delay-700">
              <i className="bi bi-gem text-purple-400 text-lg"></i>
            </div>
            <div className="absolute -bottom-1 -right-4 animate-bounce animation-delay-900">
              <i className="bi bi-lightning text-yellow-300 text-xl"></i>
            </div>
            {/* Emoji principal con efectos */}
            <div className="relative">
              <div className="absolute inset-0 animate-ping">
                <i className="bi bi-emoji-smile text-purple-200 text-6xl opacity-50"></i>
              </div>
              <i className="bi bi-emoji-smile text-purple-300 text-6xl animate-bounce relative z-10"></i>
            </div>
          </div>
          <p className="text-purple-200 text-xl animate-pulse mb-2">¡Aún no tienes logros!</p>
          <p className="text-purple-300">Sigue trabajando en tus hábitos para ganar medallas.</p>
        </div>
      )}
        </div>
      </div>
    </div>
  );
};

export default Medallas;