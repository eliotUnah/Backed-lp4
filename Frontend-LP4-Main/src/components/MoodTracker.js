import React, { useState } from 'react';

const MoodTracker = () => {
  const [selectedMood, setSelectedMood] = useState(null);
  const [note, setNote] = useState('');

  const moods = [
    { id: 1, emoji: '😄', label: 'Muy Feliz', value: 5 },
    { id: 2, emoji: '😊', label: 'Feliz', value: 4 },
    { id: 3, emoji: '😐', label: 'Neutral', value: 3 },
    { id: 4, emoji: '😔', label: 'Triste', value: 2 },
    { id: 5, emoji: '😢', label: 'Muy Triste', value: 1 }
  ];

  const handleSubmit = () => {
    if (!selectedMood) {
      alert('Por favor selecciona un estado de ánimo');
      return;
    }
    
    // Aquí guardarías en tu backend
    console.log('Mood guardado:', { mood: selectedMood, note, date: new Date() });
    alert('¡Estado de ánimo registrado!');
    setSelectedMood(null);
    setNote('');
  };

  return (
    <div style={{ 
      background: 'rgba(255, 255, 255, 0.1)', 
      backdropFilter: 'blur(10px)', 
      borderRadius: '15px', 
      padding: '30px', 
      border: '1px solid rgba(255, 255, 255, 0.2)',
      maxWidth: '600px',
      margin: '0 auto'
    }}>
      <h3 style={{ color: 'white', textAlign: 'center', marginBottom: '30px', fontSize: '1.5rem' }}>
        ¿Cómo te sientes hoy?
      </h3>
      
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        gap: '20px', 
        marginBottom: '30px',
        flexWrap: 'wrap'
      }}>
        {moods.map(mood => (
          <button
            key={mood.id}
            onClick={() => setSelectedMood(mood)}
            style={{
              background: selectedMood?.id === mood.id ? 'rgba(255, 255, 255, 0.3)' : 'rgba(255, 255, 255, 0.1)',
              border: selectedMood?.id === mood.id ? '2px solid white' : '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '15px',
              padding: '15px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              textAlign: 'center',
              minWidth: '80px'
            }}
          >
            <div style={{ fontSize: '2rem', marginBottom: '5px' }}>{mood.emoji}</div>
            <div style={{ color: 'white', fontSize: '0.8rem' }}>{mood.label}</div>
          </button>
        ))}
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label style={{ color: 'white', display: 'block', marginBottom: '10px' }}>
          Notas adicionales (opcional):
        </label>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="¿Qué ha influido en tu estado de ánimo hoy?"
          style={{
            width: '100%',
            padding: '10px',
            borderRadius: '10px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            background: 'rgba(255, 255, 255, 0.1)',
            color: 'white',
            resize: 'vertical',
            minHeight: '80px'
          }}
        />
      </div>

      <button
        onClick={handleSubmit}
        style={{
          background: 'linear-gradient(135deg, #00b894, #00a085)',
          color: 'white',
          border: 'none',
          padding: '15px 30px',
          borderRadius: '25px',
          fontWeight: '600',
          cursor: 'pointer',
          width: '100%',
          fontSize: '1rem',
          transition: 'all 0.3s ease'
        }}
      >
        Registrar Estado de Ánimo
      </button>
    </div>
  );
};

export default MoodTracker;
