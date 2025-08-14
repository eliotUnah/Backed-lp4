import React from "react";
import { useObjectives } from "../hooks/useObjectives";
import { useSpring, animated } from '@react-spring/web';
import NumericCheckinCounter from '../pages/NumericCheckinCounter.js';

const ObjectiveCard = ({ obj, index,fetchObjectives }) => {
  const progress = obj.progress ?? 0;
  const barProps = useSpring({ width: `${progress}%` });

  return (
    <div 
      className="bg-gradient-to-br from-white to-purple-50 p-6 rounded-xl shadow-lg 
                 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl 
                 hover:-translate-y-2 animate-fade-in-up border border-purple-200 relative overflow-hidden"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      {/* Indicador de estado */}
      <div className="absolute top-0 right-0 w-16 h-16 overflow-hidden">
        <div className={`absolute top-2 right-2 w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold
                        ${progress >= 100 
                          ? 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-yellow-900 animate-bounce' 
                          : 'bg-gradient-to-r from-purple-400 to-purple-500 text-white animate-pulse'
                        }`}>
          {progress >= 100 ? (
            <i className="bi bi-trophy-fill text-lg"></i>
          ) : (
            <span>{Math.round(progress)}%</span>
          )}
        </div>
      </div>

      {/* Contenido principal */}
<div className="mb-4">
  <h3 className="text-xl font-bold text-purple-800 mb-3 pr-16 hover:text-purple-600 transition-colors duration-300">
    {obj.title}
  </h3>

  <div className="space-y-2 mb-4">
    <div className="flex items-center text-purple-700">
      <i className="bi bi-target text-purple-600 mr-2"></i>
      <span className="font-semibold">Meta: {obj.goal ?? "No definida"}</span>
    </div>

    <div className="flex items-center text-purple-600">
      <i className="bi bi-bar-chart-fill text-purple-500 mr-2"></i>
      <span>Total: {obj.total}</span>
    </div>
  </div> 
  <NumericCheckinCounter habitId={obj._id} onCheckinAdded={fetchObjectives} />
        {/* Barra de progreso épica */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-purple-700">Progreso</span>
            <span className="text-sm font-bold text-purple-800">{Math.round(progress)}%</span>
          </div>
          
          <div className="relative w-full h-6 bg-gradient-to-r from-purple-100 to-purple-200 rounded-full overflow-hidden shadow-inner">
            {/* Efecto de brillo de fondo */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent 
                           animate-pulse opacity-50"></div>
            
            {/* Barra de progreso animada */}
            <animated.div
              className="relative h-full rounded-full shadow-lg flex items-center justify-end pr-2"
              style={{
                ...barProps,
                background: progress >= 100 
                  ? 'linear-gradient(to right, #fbbf24, #f59e0b, #d97706)' 
                  : 'linear-gradient(to right, #8b5cf6, #7c3aed, #6d28d9)',
              }}
            >
              {/* Efectos de partículas en la barra */}
              {progress > 10 && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent 
                               animate-pulse opacity-60"></div>
              )}
              
              {/* Indicador de posición */}
              {progress > 0 && (
                <div className={`w-2 h-2 rounded-full ${progress >= 100 ? 'bg-yellow-200' : 'bg-purple-200'} 
                               animate-pulse`}></div>
              )}
            </animated.div>
            
            {/* Marcadores de progreso */}
            <div className="absolute inset-0 flex items-center">
              {[25, 50, 75].map((mark) => (
                <div
                  key={mark}
                  className="absolute w-px h-3 bg-purple-300/50"
                  style={{ left: `${mark}%` }}
                ></div>
              ))}
            </div>
          </div>
        </div>

        {/* Mensaje de éxito */}
        {progress >= 100 && (
          <div className="bg-gradient-to-r from-yellow-100 to-yellow-200 border border-yellow-300 
                         rounded-lg p-3 text-center animate-bounce">
            <div className="flex items-center justify-center space-x-2">
              <i className="bi bi-trophy-fill text-yellow-600 text-xl animate-pulse"></i>
              <span className="font-bold text-yellow-800">¡Objetivo completado!</span>
              <i className="bi bi-star-fill text-yellow-600 animate-spin"></i>
            </div>
          </div>
        )}
      </div>

      {/* Efecto de brillo en hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent 
                     opacity-0 hover:opacity-20 transform -skew-x-12 translate-x-full 
                     hover:translate-x-[-100%] transition-all duration-700 pointer-events-none rounded-xl">
      </div>
    </div>
  );
};

const ObjectivesPage = () => {
  const { objectives, loading, error } = useObjectives();

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 
                   flex items-center justify-center">
      <div className="text-center">
        <div className="relative inline-block">
          <i className="bi bi-arrow-clockwise text-purple-200 text-6xl animate-spin"></i>
          <div className="absolute inset-0 animate-ping">
            <i className="bi bi-circle text-purple-300 text-6xl opacity-50"></i>
          </div>
        </div>
        <p className="text-purple-200 text-xl mt-4 animate-pulse">Cargando objetivos...</p>
      </div>
    </div>
  );
  
  if (error) return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 
                   flex items-center justify-center">
      <div className="text-center">
        <i className="bi bi-exclamation-triangle text-red-400 text-6xl animate-bounce mb-4"></i>
        <p className="text-red-400 text-xl">{error}</p>
      </div>
    </div>
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
            <h1 className="text-white text-3xl font-bold mb-2 animate-fade-in relative">
              <span className="relative inline-block">
                <i className="bi bi-bullseye text-yellow-300 mr-3 animate-pulse hover:animate-spin 
                            transition-all duration-300 hover:text-yellow-200"></i>
                <span className="relative">
                  Objetivos Cuantitativos
                  <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-yellow-300 
                               group-hover:w-full transition-all duration-500"></div>
                </span>
                <i className="bi bi-graph-up text-yellow-300 ml-3 animate-pulse hover:animate-spin 
                            transition-all duration-300 hover:text-yellow-200 animation-delay-200"></i>
              </span>
              {/* Partículas flotantes alrededor del título */}
              <div className="absolute -top-2 left-1/4 animate-bounce animation-delay-300">
                <i className="bi bi-award text-yellow-200 text-sm opacity-70"></i>
              </div>
              <div className="absolute -top-1 right-1/3 animate-bounce animation-delay-500">
                <i className="bi bi-trophy text-purple-300 text-xs opacity-60"></i>
              </div>
            </h1>
            <div className="w-32 h-1 bg-gradient-to-r from-yellow-400 to-purple-300 mx-auto rounded-full animate-pulse"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {objectives.map((obj, index) => (
              <ObjectiveCard key={obj._id} obj={obj} index={index} />
            ))}
          </div>

          {objectives.length === 0 && (
            <div className="text-center py-12">
              <div className="relative inline-block mb-6">
                {/* Efectos de partículas flotantes */}
                <div className="absolute -top-4 -left-4 animate-bounce animation-delay-300">
                  <i className="bi bi-target text-purple-300 text-2xl"></i>
                </div>
                <div className="absolute -top-2 -right-6 animate-bounce animation-delay-500">
                  <i className="bi bi-bullseye text-purple-200 text-xl"></i>
                </div>
                <div className="absolute -bottom-3 -left-2 animate-bounce animation-delay-700">
                  <i className="bi bi-graph-up text-purple-400 text-lg"></i>
                </div>
                <div className="absolute -bottom-1 -right-4 animate-bounce animation-delay-900">
                  <i className="bi bi-award text-yellow-300 text-xl"></i>
                </div>
                {/* Icono principal */}
                <div className="relative">
                  <div className="absolute inset-0 animate-ping">
                    <i className="bi bi-clipboard-data text-purple-200 text-6xl opacity-50"></i>
                  </div>
                  <i className="bi bi-clipboard-data text-purple-300 text-6xl animate-bounce relative z-10"></i>
                </div>
              </div>
              <p className="text-purple-200 text-xl animate-pulse mb-2">¡Aún no tienes objetivos!</p>
              <p className="text-purple-300">Crea tus primeros objetivos cuantitativos para comenzar.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ObjectivesPage;