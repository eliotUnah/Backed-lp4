// src/api/habits.js

export async function createCheckin(habitId, value = 1) {
  const res = await fetch(`/api/habits/${habitId}/checkins`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ value })
  });
  if (!res.ok) {
    const message = await res.text();
    throw new Error(message || 'Error al registrar check-in');
  }
  return res.json(); // { sum, goal, streakCurrent, streakBest, … }
}