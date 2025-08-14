import { useParams, useNavigate } from 'react-router-dom';
import { useReminders } from '../hooks/reminderhabits';
import { useState } from 'react';

const ReminderPageoscuro = () => {
  const { habitId } = useParams(); // 🆔 viene desde la URL
  const navigate = useNavigate(); // Hook para navegar
  const { createReminder, toggleReminderState, createdReminder, loading, error } = useReminders();

  const [time, setTime] = useState('');
  const [timezone, setTimezone] = useState(Intl.DateTimeFormat().resolvedOptions().timeZone);

  const handleCreate = async (e) => {
    e.preventDefault();
    await createReminder(habitId, { time, timezone });
  };

  const handleToggle = async (active) => {
    if (createdReminder?._id) {
      await toggleReminderState(createdReminder._id, active);
    }
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
        <h2 className="text-2xl font-bold text-center text-purple-300 mb-4">Crear Recordatorio para Hábito</h2>
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Hora:</label>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              required
              className="mt-1 block w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-200"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Zona Horaria:</label>
            <input
              type="text"
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
              required
              className="mt-1 block w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-200"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 bg-purple-600 text-white font-semibold rounded-md hover:bg-purple-700 transition duration-200"
          >
            {loading ? 'Creando...' : 'Crear Recordatorio'}
          </button>
        </form>

        {createdReminder && (
          <div className="mt-6 p-4 bg-purple-800 rounded-md">
            <h3 className="text-lg font-semibold text-purple-300">
              <i className="bi bi-check-circle-fill"></i> Recordatorio creado
            </h3>
            <p className="text-sm text-gray-400">El recordatorio ha sido creado exitosamente.</p>
            <div className="flex justify-between mt-4">
              <button
                onClick={() => handleToggle(true)}
                disabled={loading}
                className="py-2 px-4 bg-green-500 text-white font-semibold rounded-md hover:bg-green-600 transition duration-200"
              >
                <i className="bi bi-bell-fill"></i> Activar
              </button>
              <button
                onClick={() => handleToggle(false)}
                disabled={loading}
                className="py-2 px-4 bg-red-500 text-white font-semibold rounded-md hover:bg-red-600 transition duration-200"
              >
                <i className="bi bi-bell-slash-fill"></i> Desactivar
              </button>
            </div>
          </div>
        )}

        {error && <p className="mt-4 text-red-500">{error}</p>}
      </div>
    </div>
  );
};

export default ReminderPageoscuro;
