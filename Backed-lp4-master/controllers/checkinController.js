const Checkin = require('../models/checkinModel.js');
const Habit = require('../models/habits-model.js');
const { isSameDay, addDays, subDays } = require('date-fns');
const { checkAchievement } = require('../services/achievementService');
console.log('checkAchievement:', checkAchievement);


// --- FUNCIONES AUXILIARES ---

function normalizeDateToStartOfDay(date) {
    const d = new Date(date);
    d.setUTCHours(0, 0, 0, 0);
    return d;
}

async function calculateAndUpdateStreak(habitId) {
    const habit = await Habit.findById(habitId);
    if (!habit) throw new Error('Hábito no encontrado para calcular la racha');

    const checkins = await Checkin.find({ habitId }).sort({ date: 1 }).lean();

    let currentCalculatedStreak = 0;
    let bestCalculatedStreak = habit.streakBest;
    let tempStreak = 0;
    let lastProcessedDate = null;

    for (let i = 0; i < checkins.length; i++) {
        const currentCheckinDate = normalizeDateToStartOfDay(checkins[i].date);

        if (lastProcessedDate === null) {
            tempStreak = 1;
        } else {
            const dayAfterLastProcessed = addDays(lastProcessedDate, 1);

            if (isSameDay(currentCheckinDate, dayAfterLastProcessed)) {
                tempStreak++;
            } else if (!isSameDay(currentCheckinDate, lastProcessedDate)) {
                tempStreak = 1;
            }
        }

        lastProcessedDate = currentCheckinDate;
        if (tempStreak > bestCalculatedStreak) bestCalculatedStreak = tempStreak;
    }

    const lastCheckinDate = normalizeDateToStartOfDay(checkins[checkins.length - 1]?.date);
    const today = normalizeDateToStartOfDay(new Date());
    const yesterday = subDays(today, 1);

    currentCalculatedStreak =
        isSameDay(lastCheckinDate, today) || isSameDay(lastCheckinDate, yesterday) ? tempStreak : 0;

    habit.streakCurrent = currentCalculatedStreak;
    habit.streakBest = bestCalculatedStreak;
    await habit.save();

    return { habit, streakCurrent: habit.streakCurrent, streakBest: habit.streakBest };
}
// --- ENDPOINT: Crear un check-in ---

exports.createCheckin = async (req, res) => {
    const { id: habitId } = req.params;
    const uid = req.user.uid;
    const checkinDate = normalizeDateToStartOfDay(new Date());

    try {
        const habit = await Habit.findOne({ _id: habitId, userId: uid });
        if (!habit) {
            return res.status(404).json({ message: 'Hábito no encontrado o no pertenece al usuario.' });
        }

        const existingCheckin = await Checkin.findOne({ habitId, userId: uid, date: checkinDate });

        if (existingCheckin) {
            return res.status(409).json({ message: 'Ya existe un check-in para hoy.' });
        }

        let checkin = await Checkin.create({ habitId, userId: uid, date: checkinDate });

        checkin = await checkin.populate('habitId');

        const { habit: updatedHabit, streakCurrent, streakBest } = await calculateAndUpdateStreak(habitId);
const achievements = await checkAchievement(updatedHabit);




        res.status(201).json({
            message: 'Check-in registrado exitosamente',
            checkin,
            streakCurrent,
            streakBest,
            achievements
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({ message: 'Check-in duplicado (índice único).' });
        }
        console.error('Error al registrar check-in:', error);
        res.status(500).json({ message: 'Error interno del servidor.' });
    }
};

// --- ENDPOINT: Obtener check-ins por hábito ---

exports.getCheckins = async (req, res) => {
    const { id: habitId } = req.params;
    const { from, to } = req.query;
    const uid = req.user.uid;

    try {
        const habit = await Habit.findOne({ _id: habitId, userId: uid });
        if (!habit) {
            return res.status(404).json({ message: 'Hábito no encontrado o no pertenece al usuario.' });
        }

        let dateQuery = { habitId, userId: uid };

        if (from) {
            const startDate = normalizeDateToStartOfDay(new Date(from));
            dateQuery.date = { ...dateQuery.date, $gte: startDate };
        }
        if (to) {
            const endDate = normalizeDateToStartOfDay(addDays(new Date(to), 1));
            dateQuery.date = { ...dateQuery.date, $lt: endDate };
        }

        const checkins = await Checkin.find(dateQuery)
            .populate('habitId')
            .sort({ date: 1 });

        res.status(200).json(checkins);
    } catch (error) {
        console.error('Error al obtener check-ins:', error);
        res.status(500).json({ message: 'Error interno del servidor.' });
    }
};


async function calculateAndUpdateStreak(habitId) {
    const habit = await Habit.findById(habitId);
    if (!habit) throw new Error('Hábito no encontrado para calcular la racha');

    const checkins = await Checkin.find({ habitId }).sort({ date: 1 }).lean();

    let currentCalculatedStreak = 0;
    let bestCalculatedStreak = habit.streakBest;
    let tempStreak = 0;
    let lastProcessedDate = null;

    for (let i = 0; i < checkins.length; i++) {
        const currentCheckinDate = normalizeDateToStartOfDay(checkins[i].date);

        if (lastProcessedDate === null) {
            tempStreak = 1;
        } else {
            const dayAfterLastProcessed = addDays(lastProcessedDate, 1);

            if (isSameDay(currentCheckinDate, dayAfterLastProcessed)) {
                tempStreak++;
            } else if (!isSameDay(currentCheckinDate, lastProcessedDate)) {
                tempStreak = 1;
            }
        }

        lastProcessedDate = currentCheckinDate;
        if (tempStreak > bestCalculatedStreak) bestCalculatedStreak = tempStreak;
    }

    const lastCheckinDate = normalizeDateToStartOfDay(checkins[checkins.length - 1]?.date);
    const today = normalizeDateToStartOfDay(new Date());
    const yesterday = subDays(today, 1);

    currentCalculatedStreak =
        isSameDay(lastCheckinDate, today) || isSameDay(lastCheckinDate, yesterday) ? tempStreak : 0;

    habit.streakCurrent = currentCalculatedStreak;
    habit.streakBest = bestCalculatedStreak;
    await habit.save();

    return { habit, streakCurrent: habit.streakCurrent, streakBest: habit.streakBest };
}