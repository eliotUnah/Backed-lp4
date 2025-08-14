import React, { useState } from 'react';
import Swal from 'sweetalert2';
import useNumericCheckins from '../hooks/useNumericCheckins';

const NumericCheckinCounter = ({ habitId, onCheckinAdded }) => {
  const { checkins, adding, addCheckin } = useNumericCheckins(habitId);
  const [value, setValue] = useState(1);

  const handleIncrement = () => setValue(prev => prev + 1);
  const handleDecrement = () => setValue(prev => (prev > 1 ? prev - 1 : 1));

  const handleAdd = async () => {
    try {
      await addCheckin(value);
      setValue(1);

      // ✅ Recargar objetivos si se proporciona la función
      if (onCheckinAdded) {
        await onCheckinAdded();
      }

      Swal.fire({
        title: '✅ Check-in registrado',
        text: `Se registraron ${value} veces`,
        icon: 'success',
        confirmButtonColor: '#00b894',
      });
    } catch (err) {
      Swal.fire({
        title: '❌ Error',
        text: err.message || "No se pudo registrar el check-in",
        icon: 'error',
        confirmButtonColor: '#d63031',
      });
    }
  };

  return (
    <div className="numeric-counter bg-purple-50 p-4 rounded-lg shadow-md">
      <h4 className="text-lg font-semibold text-purple-700 mb-3">Registrar Check-in</h4>

      <div className="counter-controls flex items-center space-x-4 mb-4">
        <button
          onClick={handleDecrement}
          className="px-3 py-2 bg-purple-200 text-purple-800 rounded hover:bg-purple-300 transition"
        >
          −
        </button>

        <span className="text-xl font-bold text-purple-900">{value}</span>

        <button
          onClick={handleIncrement}
          className="px-3 py-2 bg-purple-200 text-purple-800 rounded hover:bg-purple-300 transition"
        >
          +
        </button>

        <button
          onClick={handleAdd}
          disabled={adding}
          className={`px-4 py-2 rounded font-semibold transition ${
            adding
              ? "bg-purple-300 text-purple-700 cursor-not-allowed"
              : "bg-purple-600 text-white hover:bg-purple-700"
          }`}
        >
          {adding ? "Agregando..." : "Registrar"}
        </button>
      </div>

      <div className="recent-checkins text-sm text-purple-700 space-y-1">
        <p className="font-medium mb-1">Últimos check-ins:</p>
        {checkins.slice(0, 3).map(c => (
          <div key={c._id} className="flex justify-between">
            <span>Valor: {c.value}</span>
            <span>{new Date(c.date).toLocaleDateString()}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NumericCheckinCounter;
