import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/CrearHabito.css';
import Swal from 'sweetalert2';
import { motion } from "framer-motion"
import useHabits from '../hooks/getHabits.js';
import useUpdateHabit from '../hooks/editHabits.js';


const EditHabitos = () => {
  const { habitId } = useParams();
  const navigate = useNavigate();

  const { habits, loading: habitsLoading, error: habitsError } = useHabits();
  const { updateHabit, loading, response, error } = useUpdateHabit();

  const [habitData, setHabitData] = useState({
    title: '',
    frequency: '',
    category: '',
    startTime: '',
    durationMinutes: '',
    daysOfWeek: [],
    goal: ''
  });

  const [charCount, setCharCount] = useState(0);

  useEffect(() => {
    const habit = habits.find(h => h._id === habitId);
    if (habit) {
      setHabitData({
        title: habit.title,
        frequency: habit.frequency,
        category: habit.category,
        startTime: habit.startTime ? habit.startTime.slice(0, 16) : '',
        durationMinutes: habit.durationMinutes || '',
        daysOfWeek: habit.daysOfWeek || [],
        goal: habit.goal || ''
      });
      setCharCount(habit.title.length);
    }
  }, [habits, habitId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setHabitData(prev => ({
      ...prev,
      [name]: name === "durationMinutes" ? parseInt(value) : value
    }));
    if (name === 'title') setCharCount(value.length);
  };

  const handleDayToggle = (day) => {
    setHabitData(prev => {
      const updatedDays = prev.daysOfWeek.includes(day)
        ? prev.daysOfWeek.filter(d => d !== day)
        : [...prev.daysOfWeek, day];
      return { ...prev, daysOfWeek: updatedDays };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await updateHabit({ habitId, ...habitData });

    if (res?.message) {
      Swal.fire({
        title: '✅ ¡Hábito actualizado!',
        text: res.message,
        icon: 'success',
        confirmButtonColor: '#00b894'
      }).then(() => {
        navigate('/dasboard');  
      });
    }

    if (error) {
      Swal.fire({
        title: '❌ Error al actualizar',
        text: error,
        icon: 'error',
        confirmButtonColor: '#d63031'
      });
    }
  };
  
  return (
  <div className="editar-habito-fondo">
    <div className="crear-habito centrado-flex bg-gradient-to-br from-purple-50 via-violet-50 to-fuchsia-50 font-sans">
      <div className="w-full max-w-xl">
        <motion.div 
          className="bg-white rounded-xl shadow-lg overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div 
            className="bg-gradient-to-r from-purple-600 via-violet-500 to-fuchsia-500 p-6 relative overflow-hidden"
            animate={{ 
              background: [
                'linear-gradient(to right, #9333ea, #8b5cf6, #ec4899)',
                'linear-gradient(to right, #8b5cf6, #ec4899, #9333ea)',
                'linear-gradient(to right, #ec4899, #9333ea, #8b5cf6)',
                'linear-gradient(to right, #9333ea, #8b5cf6, #ec4899)'
              ]
            }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            <motion.h1 
              className="text-3xl font-display font-bold text-white"
              animate={{ scale: [1, 1.02, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              Editar tu hábito
            </motion.h1>
            <motion.p 
              className="text-purple-100 mt-1"
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              Mejorar es parte del proceso
            </motion.p>
          </motion.div>

          <form onSubmit={handleSubmit} className="p-6 space-y-8">
            {/* Título */}
            <motion.div 
              className="space-y-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <label htmlFor="title" className="text-sm font-medium text-gray-700">
                ¿Qué hábito quieres mejorar?*
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="title"
                  id="title"
                  value={habitData.title}
                  onChange={handleChange}
                  maxLength={50}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-purple-500"
                  placeholder="Ej: Caminar 20 minutos"
                />
                <motion.div 
                  className="absolute right-3 top-3 text-xs text-purple-400 bg-white px-1"
                  animate={{ scale: charCount > 45 ? [1, 1.2, 1] : 1 }}
                  transition={{ duration: 0.3 }}
                >
                  {charCount}/50
                </motion.div>
              </div>
            </motion.div>

            {/* Categoría */}
            <motion.div 
              className="space-y-4"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h3 className="text-sm font-medium text-gray-700">Categoría</h3>
              <select
                name="category"
                value={habitData.category}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-purple-500"
              >
                <option value="">Selecciona una categoría</option>
                <option value="Salud">Salud</option>
                <option value="Productividad">Productividad</option>
                <option value="Bienestar">Bienestar</option>
                <option value="Otros">Otros</option>
              </select>
            </motion.div>

            {/* Frecuencia */}
            <motion.div 
              className="space-y-4"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h3 className="text-sm font-medium text-gray-700">Frecuencia</h3>
              <select
                name="frequency"
                value={habitData.frequency}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-purple-500"
              >
                <option value="">Selecciona una frecuencia</option>
                <option value="Diario">Diario</option>
                <option value="Semanal">Semanal</option>
                <option value="Mensual">Mensual</option>
              </select>
            </motion.div>

            {/* Días de la semana */}
            {habitData.frequency === "Semanal" && (
              <motion.div 
                className="space-y-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <h3 className="text-sm font-medium text-gray-700">¿Qué días lo harás?</h3>
                <div className="grid grid-cols-4 gap-2 sm:grid-cols-7">
                  {["MO", "TU", "WE", "TH", "FR", "SA", "SU"].map((day, index) => (
                    <motion.label 
                      key={day} 
                      className="flex items-center space-x-2 text-gray-700"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.05 * index }}
                    >
                      <input
                        type="checkbox"
                        value={day}
                        checked={habitData.daysOfWeek.includes(day)}
                        onChange={() => handleDayToggle(day)}
                        className="accent-purple-500"
                      />
                      <motion.span
                        animate={{ scale: habitData.daysOfWeek.includes(day) ? [1, 1.1, 1] : 1 }}
                        transition={{ duration: 0.2 }}
                      >
                        {{
                          MO: "Lunes", TU: "Martes", WE: "Miércoles",
                          TH: "Jueves", FR: "Viernes", SA: "Sábado", SU: "Domingo"
                        }[day]}
                      </motion.span>
                    </motion.label>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Hora de inicio */}
            <motion.div 
              className="space-y-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <label htmlFor="startTime" className="block text-sm font-medium text-gray-700">Hora de inicio*</label>
              <div className="relative">
                <input
                  type="datetime-local"
                  name="startTime"
                  id="startTime"
                  value={habitData.startTime}
                  onChange={handleChange}
                  className="w-full px-4 py-3 pl-11 border border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-purple-500"
                />
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-500">
                  🕒
                </div>
              </div>
            </motion.div>

            {/* Duración */}
            <motion.div 
              className="space-y-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              <label htmlFor="durationMinutes" className="block text-sm font-medium text-gray-700">Duración estimada (minutos)*</label>
              <div className="relative">
                <input
                  type="number"
                  name="durationMinutes"
                  id="durationMinutes"
                  value={habitData.durationMinutes}
                  onChange={handleChange}
                  placeholder="Ej: 30"
                  className="w-full px-4 py-3 pl-11 border border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-purple-500"
                />
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-500">
                  ⏱️
                </div>
              </div>
            </motion.div>
<motion.div
  className="space-y-2"
  initial={{ opacity: 0, x: -20 }}
  animate={{ opacity: 1, x: 0 }}
  transition={{ delay: 0.65 }}
>
  <label htmlFor="goal" className="block text-sm font-medium text-gray-700">
    Meta numérica*
  </label>
  <input
    type="number"
    name="goal"
    id="goal"
    value={habitData.goal || ''}
    onChange={handleChange}
    placeholder="Ej: 100"
    className="w-full px-4 py-3 border border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-purple-500"
  />
</motion.div>
            {/* Botones */}
            <motion.div 
              className="flex justify-end space-x-4 pt-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <motion.button
                type="submit"
                disabled={loading}
                className="px-6 py-2.5 rounded-lg shadow-md text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-purple-400 hover:from-purple-700 hover:to-purple-600 focus:outline-none transition"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                animate={loading ? { scale: [1, 1.02, 1] } : {}}
                transition={{ duration: 1, repeat: loading ? Infinity : 0 }}
              >
                {loading ? 'Actualizando...' : 'Actualizar hábito'}
              </motion.button>
            </motion.div>
          </form>
        </motion.div>
      </div>
    </div>
    </div> 
  )
};
export default EditHabitos;
