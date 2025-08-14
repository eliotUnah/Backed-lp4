import React, { useState, useEffect } from 'react';
import '../styles/MoodHistory.css';

const MoodHistory = () => {
  const [moodHistory, setMoodHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const moodEmojis = {
    1: '😢',
    2: '😔', 
    3: '😐',
    4: '😊',
    5: '😄'
  };

  const moodLabels = {
    1: 'Muy triste',
    2: 'Triste',
    3: 'Neutral', 
    4: 'Feliz',
    5: 'Muy feliz'
  };

  useEffect(() => {
    fetchMoodHistory();
  }, []);

  const fetchMoodHistory = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/mood/history', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setMoodHistory(data);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="mood-history__loading">Cargando historial...</div>;
  }

  return (
    <div className="mood-history">
      <div className="mood-history__container">
        <h2 className="mood-history__title">Mi Historial de Estados de Ánimo</h2>
        
        {moodHistory.length === 0 ? (
          <div className="mood-history__empty">
            <p>Aún no has registrado ningún estado de ánimo.</p>
            <p>¡Comienza registrando cómo te sientes hoy!</p>
          </div>
        ) : (
          <div className="mood-history__list">
            {moodHistory.map((entry) => (
              <div key={entry._id} className="mood-history__entry">
                <div className="mood-history__date">
                  {new Date(entry.date).toLocaleDateString('es-ES', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
                <div className="mood-history__mood">
                  <span className="mood-history__emoji">
                    {moodEmojis[entry.mood]}
                  </span>
                  <span className="mood-history__label">
                    {moodLabels[entry.mood]}
                  </span>
                </div>
                {entry.note && (
                  <div className="mood-history__note">
                    <strong>Nota:</strong> {entry.note}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MoodHistory; 