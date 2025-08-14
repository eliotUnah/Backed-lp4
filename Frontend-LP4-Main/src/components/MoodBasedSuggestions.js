import React, { useState, useEffect } from 'react';
import '../styles/MoodBasedSuggestions.css';

const MoodBasedSuggestions = () => {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSuggestions();
  }, []);

  const fetchSuggestions = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/mood/suggestions', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setSuggestions(data);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="mood-suggestions__loading">Cargando sugerencias...</div>;
  }

  return (
    <div className="mood-suggestions">
      <div className="mood-suggestions__container">
        <h2 className="mood-suggestions__title">Sugerencias Personalizadas</h2>
        <p className="mood-suggestions__subtitle">
          Basadas en tu estado de ánimo reciente
        </p>
        
        {suggestions.length === 0 ? (
          <div className="mood-suggestions__empty">
            <p>Registra tu estado de ánimo para recibir sugerencias personalizadas.</p>
          </div>
        ) : (
          <div className="mood-suggestions__list">
            {suggestions.map((suggestion, index) => (
              <div key={index} className="mood-suggestions__card">
                <div className="mood-suggestions__icon">
                  {suggestion.icon}
                </div>
                <div className="mood-suggestions__content">
                  <h3 className="mood-suggestions__card-title">
                    {suggestion.title}
                  </h3>
                  <p className="mood-suggestions__description">
                    {suggestion.description}
                  </p>
                  <div className="mood-suggestions__category">
                    {suggestion.category}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MoodBasedSuggestions; 