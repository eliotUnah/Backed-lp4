import React from 'react';
import { useState, useRef, useEffect } from 'react';
import useHabits from '../hooks/getHabits.js';
import useCreateCheckin from '../hooks/checkinHabits.js';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useAuth } from '../../contexts/AuthContext.js';
import '../styles/Dashboard.css';

// Componente MoodTracker completo y funcional
const MoodTracker = () => {
   const navigate = useNavigate(); 
  const [selectedMood, setSelectedMood] = useState(null);
  const [note, setNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const moods = [
    { id: 1, emoji: '😄', label: 'Muy Feliz', value: 5, color: '#00b894' },
    { id: 2, emoji: '😊', label: 'Feliz', value: 4, color: '#00cec9' },
    { id: 3, emoji: '😐', label: 'Neutral', value: 3, color: '#fdcb6e' },
    { id: 4, emoji: '😔', label: 'Triste', value: 2, color: '#e17055' },
    { id: 5, emoji: '😢', label: 'Muy Triste', value: 1, color: '#d63031' }
  ];

  const handleSubmit = async () => {
    if (!selectedMood) {
      Swal.fire({
        title: '⚠️ Selecciona un estado',
        text: 'Por favor selecciona cómo te sientes hoy',
        icon: 'warning',
        confirmButtonColor: '#6c5ce7',
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Simular guardado (aquí conectarías con tu backend)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Guardar en localStorage temporalmente
      const moodEntry = {
        id: Date.now(),
        mood: selectedMood,
        note: note,
        date: new Date().toISOString().split('T')[0],
        timestamp: new Date().toISOString()
      };
      
      const existingMoods = JSON.parse(localStorage.getItem('moodHistory') || '[]');
      existingMoods.unshift(moodEntry);
      localStorage.setItem('moodHistory', JSON.stringify(existingMoods.slice(0, 30))); // Mantener solo los últimos 30
      
      Swal.fire({
        title: '✅ ¡Estado registrado!',
        text: `Has registrado: ${selectedMood.label}`,
        icon: 'success',
        confirmButtonColor: '#00b894',
      });
      
      // Limpiar formulario
      setSelectedMood(null);
      setNote('');
      
    } catch (error) {
      Swal.fire({
        title: '❌ Error',
        text: 'Hubo un problema al guardar tu estado de ánimo',
        icon: 'error',
        confirmButtonColor: '#d63031',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ 
      background: 'rgba(139, 92, 246, 0.25)', 
      borderRadius: '15px', 
      padding: '30px', 
      textAlign: 'center',
      backdropFilter: 'blur(12px)',
      boxShadow: '0 8px 32px rgba(139, 92, 246, 0.2)',
      border: '2px solid transparent',
      maxWidth: '600px',
      margin: '0 auto'
    }}>
       {/* Botón de Regreso */}
     <button
          onClick={() => navigate(-1)} // Regresar a la página anterior
          className="mb-4 text-purple-600 hover:underline"
        >
          <i className="bi bi-arrow-left-circle-fill"></i> Regresar
        </button> 
      <h3 style={{ color: '#ffffff', marginBottom: '20px', fontSize: '1.5rem' }}>
        😊 Registrar Estado de Ánimo
      </h3>
      <p style={{ color: '#f8fafc', marginBottom: '30px' }}>
        Selecciona cómo te sientes hoy
      </p>
      
      {/* Emojis de estado de ánimo */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', flexWrap: 'wrap', marginBottom: '30px' }}>
        {moods.map((mood) => (
          <button
            key={mood.id}
            onClick={() => setSelectedMood(mood)}
            style={{
              background: selectedMood?.id === mood.id 
                ? `linear-gradient(135deg, ${mood.color}, ${mood.color}90)` 
                : 'rgba(139, 92, 246, 0.3)',
              border: selectedMood?.id === mood.id ? `2px solid ${mood.color}` : '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '15px',
              padding: '15px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              textAlign: 'center',
              minWidth: '80px',
              transform: selectedMood?.id === mood.id ? 'scale(1.1)' : 'scale(1)'
            }}
            onMouseEnter={(e) => {
              if (selectedMood?.id !== mood.id) {
                e.target.style.background = 'rgba(139, 92, 246, 0.5)';
                e.target.style.transform = 'scale(1.05)';
              }
            }}
            onMouseLeave={(e) => {
              if (selectedMood?.id !== mood.id) {
                e.target.style.background = 'rgba(139, 92, 246, 0.3)';
                e.target.style.transform = 'scale(1)';
              }
            }}
          >
            <div style={{ fontSize: '2rem', marginBottom: '5px' }}>{mood.emoji}</div>
            <div style={{ color: 'white', fontSize: '0.8rem', fontWeight: '600' }}>{mood.label}</div>
          </button>
        ))}
      </div>

      {/* Campo de notas */}
      <div style={{ marginBottom: '25px', textAlign: 'left' }}>
        <label style={{ color: 'white', display: 'block', marginBottom: '10px', fontWeight: '600' }}>
          Notas adicionales (opcional):
        </label>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="¿Qué ha influido en tu estado de ánimo hoy?"
          style={{
            width: '100%',
            padding: '15px',
            borderRadius: '10px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            background: 'rgba(255, 255, 255, 0.1)',
            color: 'white',
            resize: 'vertical',
            minHeight: '80px',
            fontSize: '1rem',
            fontFamily: 'inherit'
          }}
        />
      </div>

      {/* Botón de envío */}
      <button
        onClick={handleSubmit}
        disabled={isSubmitting}
        style={{
          background: isSubmitting 
            ? 'rgba(108, 92, 231, 0.5)' 
            : 'linear-gradient(135deg, #6c5ce7, #a29bfe)',
          color: 'white',
          border: 'none',
          padding: '15px 30px',
          borderRadius: '25px',
          fontWeight: '600',
          cursor: isSubmitting ? 'not-allowed' : 'pointer',
          width: '100%',
          fontSize: '1rem',
          transition: 'all 0.3s ease',
          opacity: isSubmitting ? 0.7 : 1
        }}
      >
        {isSubmitting ? '⏳ Guardando...' : '💾 Registrar Estado de Ánimo'}
      </button>

      {/* Mostrar estado seleccionado */}
      {selectedMood && (
        <div style={{ 
          marginTop: '20px', 
          padding: '15px', 
          background: 'rgba(255, 255, 255, 0.1)', 
          borderRadius: '10px',
          border: '1px solid rgba(255, 255, 255, 0.2)'
        }}>
          <p style={{ color: 'white', margin: 0, fontSize: '0.9rem' }}>
            <strong>Estado seleccionado:</strong> {selectedMood.emoji} {selectedMood.label}
          </p>
        </div>
      )}
    </div>
  );
};

const MoodHistory = () => {
  const [moodHistory, setMoodHistory] = useState([]);

  // Definición de moods (si no está ya en tu código)
  const moods = [
    { id: 1, emoji: '😄', label: 'Muy Feliz', value: 5, color: '#00b894' },
    { id: 2, emoji: '😊', label: 'Feliz', value: 4, color: '#00cec9' },
    { id: 3, emoji: '😐', label: 'Neutral', value: 3, color: '#fdcb6e' },
    { id: 4, emoji: '😔', label: 'Triste', value: 2, color: '#e17055' },
    { id: 5, emoji: '😢', label: 'Muy Triste', value: 1, color: '#d63031' }
  ];

  useEffect(() => {
    // Obtener el historial del localStorage
    const history = JSON.parse(localStorage.getItem('moodHistory') || '[]');
    setMoodHistory(history);
  }, []);

  return (
    <div style={{ 
      background: 'rgba(139, 92, 246, 0.25)', 
      borderRadius: '15px', 
      padding: '30px', 
      textAlign: 'center',
      backdropFilter: 'blur(12px)',
      boxShadow: '0 8px 32px rgba(139, 92, 246, 0.2)',
      border: '2px solid transparent'
    }}>
      <h3 style={{ color: '#ffffff', marginBottom: '20px', fontSize: '1.5rem' }}>
        📊 Historial de Estados de Ánimo
      </h3>
      
      {moodHistory.length === 0 ? (
        <p style={{ color: '#f8fafc' }}>
          Aquí verás tu progreso emocional a lo largo del tiempo
        </p>
      ) : (
        <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
          {moodHistory.map((entry) => {
            const mood = moods.find(m => m.value === entry.mood.value) || moods[2];
            return (
              <div 
                key={entry.id}
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '10px',
                  padding: '15px',
                  marginBottom: '15px',
                  borderLeft: `5px solid ${mood.color}`,
                  textAlign: 'left'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '1.5rem' }}>{mood.emoji}</span>
                    <span style={{ color: 'white', fontWeight: '600' }}>{mood.label}</span>
                  </div>
                  <span style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.8rem' }}>
                    {new Date(entry.timestamp).toLocaleDateString()}
                  </span>
                </div>
                {entry.note && (
                  <div style={{ 
                    color: 'rgba(255, 255, 255, 0.8)', 
                    fontStyle: 'italic',
                    padding: '8px',
                    background: 'rgba(0, 0, 0, 0.1)',
                    borderRadius: '5px'
                  }}>
                    "{entry.note}"
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

const MoodBasedSuggestions = () => (
  <div style={{ 
    background: 'rgba(139, 92, 246, 0.25)', 
    borderRadius: '15px', 
    padding: '30px', 
    textAlign: 'center',
    backdropFilter: 'blur(12px)',
    boxShadow: '0 8px 32px rgba(139, 92, 246, 0.2)',
    border: '2px solid transparent'
  }}>
    <h3 style={{ color: '#ffffff', marginBottom: '20px', fontSize: '1.5rem' }}>
      💡 Sugerencias Personalizadas
    </h3>
    <p style={{ color: '#f8fafc' }}>
      Recomendaciones basadas en tu estado de ánimo actual
    </p>
  </div>
);

const MoodPage = () => {
  const { habits, loading, error } = useHabits();
  const { logout } = useAuth();
  const { createCheckin, loading: checkinLoading, error: checkinError } = useCreateCheckin();
  
  // Estados para mood tracking
  const [showMoodSection, setShowMoodSection] = useState(false);
  const [activeMoodTab, setActiveMoodTab] = useState('tracker');


  return (
   <div className="dashboard">
    {/* Contenido principal solo para Estado de Ánimo */}
    <div className="dashboard__main-content">
      <div className="dashboard__header">
        <h1 className="dashboard__title">Estado de Ánimo</h1>
        <p className="dashboard__subtitle">
          Registra y analiza tu bienestar emocional
        </p>
      </div>

      {/* Tabs de mood */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '15px',
          marginBottom: '30px',
          flexWrap: 'wrap',
        }}
      >
        <button
          onClick={() => setActiveMoodTab('tracker')}
          style={{
            padding: '12px 24px',
            background:
              activeMoodTab === 'tracker'
                ? 'rgba(139, 92, 246, 0.5)'
                : 'rgba(139, 92, 246, 0.25)',
            color: '#ffffff',
            border: 'none',
            borderRadius: '25px',
            cursor: 'pointer',
            fontWeight: '600',
            transition: 'all 0.3s ease',
            backdropFilter: 'blur(10px)',
          }}
        >
          😊 Registrar Ánimo
        </button>
        <button
          onClick={() => setActiveMoodTab('history')}
          style={{
            padding: '12px 24px',
            background:
              activeMoodTab === 'history'
                ? 'rgba(139, 92, 246, 0.5)'
                : 'rgba(139, 92, 246, 0.25)',
            color: '#ffffff',
            border: 'none',
            borderRadius: '25px',
            cursor: 'pointer',
            fontWeight: '600',
            transition: 'all 0.3s ease',
            backdropFilter: 'blur(10px)',
          }}
        >
          📊 Mi Historial
        </button>
        <button
          onClick={() => setActiveMoodTab('suggestions')}
          style={{
            padding: '12px 24px',
            background:
              activeMoodTab === 'suggestions'
                ? 'rgba(139, 92, 246, 0.5)'
                : 'rgba(139, 92, 246, 0.25)',
            color: '#ffffff',
            border: 'none',
            borderRadius: '25px',
            cursor: 'pointer',
            fontWeight: '600',
            transition: 'all 0.3s ease',
            backdropFilter: 'blur(10px)',
          }}
        >
          💡 Sugerencias
        </button>
      </div>

      {/* Contenido del tab activo */}
      {activeMoodTab === 'tracker' && <MoodTracker />}
      {activeMoodTab === 'history' && <MoodHistory />}
      {activeMoodTab === 'suggestions' && <MoodBasedSuggestions />}
    </div>
  </div>
);
};

export default MoodPage;
