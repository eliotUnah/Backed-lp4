const Reminder = require('../models/reminder');
const Habit = require('../models/habits-model');
// Crear un nuevo recordatorio
const createReminder = async (req, res) => {
  try {
    const userId = req.user.uid;
    const email = req.user.email;
    const { habitId, time, timezone } = req.body;

    // 🧪 Mostrar que email y userId están presentes
    console.log("📥 Datos del usuario:", { userId, email });
    console.log("📥 Datos del body:", { habitId, time, timezone });

    // Validar campos requeridos
    if (!habitId || !time || !timezone) {
      return res.status(400).json({ error: 'Faltan campos obligatorios.' });
    }

    // Verificar que el hábito exista y pertenezca al usuario
    const habit = await Habit.findOne({ _id: habitId, userId });
    if (!habit) {
      return res.status(404).json({ error: 'El hábito no existe o no te pertenece.' });
    }

    const reminder = await Reminder.create({ habitId, userId, email, time, timezone });
    res.status(201).json(reminder);
  } catch (error) {
    console.error('❌ Error al crear recordatorio:', error);
    res.status(500).json({ error: 'Error interno del servidor al crear el recordatorio.' });
  }
};
// Obtener todos los recordatorios del usuario
const getUserReminders = async (req, res) => {
  try {
    const userId = req.user.uid; // 🔐 del token verificado

    const reminders = await Reminder.find({ userId })
      .populate('habitId', 'title category') // opcional: incluir info del hábito
      .sort({ time: 1 }); // puedes ordenar por hora si lo deseas

    res.status(200).json(reminders);
  } catch (error) {
    console.error('❌ Error al obtener recordatorios:', error);
    res.status(500).json({ error: 'Error interno del servidor al obtener los recordatorios.' });
  }
};

// Actualizar un recordatorio
const updateReminder = async (req, res) => {
  try {
    const userId = req.user.uid;
    const { id } = req.params;
    const { time, timezone } = req.body;

    // Validar que al menos uno de los campos esté presente
    if (!time && !timezone) {
      return res.status(400).json({ error: 'Debe proporcionar time y/o timezone para actualizar.' });
    }

    // Buscar el recordatorio perteneciente al usuario
    const reminder = await Reminder.findOne({ _id: id, userId });
    if (!reminder) {
      return res.status(404).json({ error: 'Recordatorio no encontrado o no te pertenece.' });
    }

    // Validar y actualizar hora
    if (time) {
      const isValid = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(time);
      if (!isValid) {
        return res.status(400).json({ error: 'Formato de hora inválido. Usa HH:MM en formato 24 horas.' });
      }
      reminder.time = time;
    }

    if (timezone) {
      reminder.timezone = timezone;
    }

    await reminder.save();

    res.status(200).json({ message: '✅ Recordatorio actualizado con éxito', reminder });
  } catch (error) {
    console.error('❌ Error al actualizar recordatorio:', error);
    res.status(500).json({ error: 'Error interno del servidor al actualizar el recordatorio.' });
  }
};


// Eliminar un recordatorio
const deleteReminder = async (req, res) => {
  try {
    const userId = req.user.uid; // 🔐 Viene desde el token verificado
    const { id } = req.params;   // ID del recordatorio enviado en la URL

    // Buscar y eliminar el recordatorio solo si pertenece al usuario
    const reminder = await Reminder.findOneAndDelete({ _id: id, userId });

    if (!reminder) {
      return res.status(404).json({ error: '⚠️ Recordatorio no encontrado o no te pertenece' });
    }

    res.json({ message: '✅ Recordatorio eliminado correctamente', reminder });
  } catch (error) {
    console.error('❌ Error al eliminar recordatorio:', error);
    res.status(500).json({ error: 'Error interno del servidor al eliminar el recordatorio' });
  }
};

// Cambiar el estado de un recordatorio (activado/desactivado)
const toggleReminderState = async (req, res) => {
  try {
    const userId = req.user.uid;
    const { id } = req.params;
    const { active } = req.body;

    // Validar que se haya enviado el estado deseado
    if (typeof active !== 'boolean') {
      return res.status(400).json({ error: "Debes proporcionar el campo 'active' como true o false." });
    }

    // Verificar que el recordatorio le pertenezca al usuario
    const reminder = await Reminder.findOneAndUpdate(
      { _id: id, userId },
      { active },
      { new: true }
    );

    if (!reminder) {
      return res.status(404).json({ error: 'Recordatorio no encontrado o no te pertenece' });
    }

    const estado = active ? 'activado' : 'desactivado';
    res.status(200).json({ message: `✅ Recordatorio ${estado}`, reminder });
  } catch (error) {
    console.error('❌ Error al cambiar estado del recordatorio:', error);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
};


module.exports = {
  createReminder,
  getUserReminders,
  updateReminder,
  deleteReminder,
  toggleReminderState
};
