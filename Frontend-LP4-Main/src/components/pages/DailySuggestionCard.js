// src/components/DailySuggestionCard.jsx
import { useDailySuggestion } from "../hooks/useDailySuggestion";
import { useNavigate } from "react-router-dom"; 

const levelColors = {
  1: "bg-gradient-to-r from-yellow-400 to-yellow-200 text-white",
  2: "bg-gradient-to-r from-orange-400 to-yellow-300 text-white",
  3: "bg-gradient-to-r from-red-500 to-red-300 text-white",
};

export default function DailySuggestionCard() {
  const { suggestion, loading, error } = useDailySuggestion();
  const navigate = useNavigate(); 

  if (loading) return <p>Cargando sugerencia...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!suggestion) return <p>No hay sugerencia disponible.</p>;

  const level = suggestion.level ?? 1;
  const levelClass = levelColors[level] || levelColors[1];

  return (
    <div 
      className="absolute top-13 right-10 w-[300px] h-[260px] rounded-3xl p-6 bg-white border border-gray-200 shadow-xl overflow-hidden cursor-pointer"
      onClick={() => navigate("/historial-sugerencias")} // Navegar al hacer clic en la tarjeta
    >
      {/* Nivel */}
      <span
        className={`inline-flex items-center gap-2 text-xs uppercase font-semibold px-3 py-1.5 rounded-full shadow-inner backdrop-blur-sm border border-white/20 ${levelClass}`}
      >
        <span className="w-2.5 h-2.5 rounded-full bg-yellow-300 shadow-md" />
        Nivel {level}
      </span>

      {/* Título */}
      <h2 className="mt-4 text-2xl font-bold text-gray-800">
        {suggestion.title}
      </h2>

      {/* Descripción */}
      <p className="mt-3 text-gray-600 text-sm leading-snug">
        {suggestion.reason}
      </p>

      {/* Nota */}
      {suggestion.note && (
        <p className="mt-3 text-yellow-600 italic text-xs">
          ⚠️ {suggestion.note}
        </p>
      )}
    </div>
  );
}
