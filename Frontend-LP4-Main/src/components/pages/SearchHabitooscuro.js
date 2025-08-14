import React, { useState } from 'react';
import useSearchHabits from '../hooks/searchHabits.js';
import { useNavigate } from 'react-router-dom';
import '../styles/SearchHabito.css';

const SearchHabitsPageoscuro = () => {
  const navigate = useNavigate(); // Hook para navegar
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [frequency, setFrequency] = useState('');

  const { habits, loading, error, searchHabits } = useSearchHabits();

  const handleSubmit = (e) => {
    e.preventDefault();
    searchHabits({ search, category, frequency });
  };

  const resetForm = () => {
    setSearch('');
    setCategory('');
    setFrequency('');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-800 to-gray-900 p-6">
      <div className="bg-gray-900 rounded-lg shadow-lg p-8 w-full max-w-md transition-transform transform hover:scale-105">
        <button
          onClick={() => navigate(-1)} // Regresar a la página anterior
          className="mb-4 text-purple-400 hover:underline"
        >
          <i className="bi bi-arrow-left-circle-fill"></i> Regresar
        </button>
        <h1 className="text-2xl font-bold text-center text-purple-300 mb-4">
          <i className="bi bi-search"></i> Buscar tus Hábitos
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col space-y-2">
            <div className="relative">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="block w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-200"
              />
              <i className="bi bi-search absolute left-3 top-2 text-gray-400"></i>
            </div>

            <select
              value={frequency}
              onChange={(e) => setFrequency(e.target.value)}
              className="block w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-200"
            >
              <option value="">Todas las frecuencias</option>
              <option value="Diario">Diario</option>
              <option value="Semanal">Semanal</option>
              <option value="Mensual">Mensual</option>
            </select>

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="block w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-200"
            >
              <option value="">Todas las categorías</option>
              <option value="Salud">Salud</option>
              <option value="Productividad">Productividad</option>
              <option value="Bienestar">Bienestar</option>
              <option value="Otros">Otros</option>
            </select>
          </div>

          <div className="flex justify-between mt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 px-4 bg-purple-600 text-white font-semibold rounded-md hover:bg-purple-700 transition duration-200"
            >
              {loading ? 'Buscando...' : 'Buscar'}
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="ml-2 w-full py-2 px-4 bg-gray-700 text-gray-300 font-semibold rounded-md hover:bg-gray-600 transition duration-200"
            >
              Limpiar
            </button>
          </div>
        </form>

        {error && <p className="mt-4 text-red-500">{error}</p>}

        {loading && <p className="mt-4 text-gray-400">Cargando resultados...</p>}

        {habits.length > 0 && (
          <ul className="mt-6 space-y-2">
            {habits.map((habit) => (
              <li key={habit._id} className="p-4 bg-gray-800 rounded-md">
                <strong className="text-purple-300">
                  {typeof habit.title === 'object' ? habit.title.name : habit.title}
                </strong>
                <span className="block text-gray-400">
                  {typeof habit.category === 'object' ? habit.category.name : habit.category} (
                  {typeof habit.frequency === 'object' ? habit.frequency.name : habit.frequency})
                </span>
              </li>
            ))}
          </ul>
        )}
        {!loading && habits.length === 0 && !error && (
          <p className="mt-4 text-gray-400">No se encontraron hábitos. Prueba otros filtros 🧪</p>
        )}
      </div>
    </div>
  );
};

export default SearchHabitsPageoscuro;
