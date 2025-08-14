// src/components/SuggestionsHistory.jsx
import { useSuggestionsHistory } from "../hooks/useSuggestionsHistory";
import { useState } from "react";
import api from "../../utils/axiosConfig";
import { Star, StarOff } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { format } from "date-fns";
import { es } from "date-fns/locale";

export default function SuggestionsHistory() {
  const { suggestions, loading, error, refresh } = useSuggestionsHistory();
  const [filter, setFilter] = useState("all");
  const navigate = useNavigate();

  const toggleFavorite = async (id) => {
    await api.patch(`/ai/favorite/${id}`);
    refresh();
  };

  const convertToHabit = (sug) => {
    navigate("/crear-habito", {
      state: {
        suggestion: {
          title: sug.suggestion,
          category: sug.category,
          frequency: sug.frequency,
        },
      },
    });
  };

  const filtered = suggestions.filter((s) =>
    filter === "all"
      ? true
      : filter === "favorites"
      ? s.isFavorite
      : false
  );

  const getStat = (type) => {
    if (type === "favorites") return suggestions.filter((s) => s.isFavorite).length;
    if (type === "week") {
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      return suggestions.filter((s) => new Date(s.createdAt) >= weekAgo).length;
    }
    return suggestions.length;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 text-white py-10 px-4 relative overflow-x-hidden">
      <div className="max-w-6xl mx-auto z-10 relative">
        <h1 className="text-4xl font-extrabold text-center mb-4 bg-gradient-to-r from-white to-slate-100 text-transparent bg-clip-text">
          ✨ Historial de Sugerencias
        </h1>
        <p className="text-center text-slate-200 mb-8">
          Todas tus ideas diarias de IA, organizadas y listas para inspirarte
        </p>

        {/* Estadísticas */}
        <div className="grid grid-cols-2 md:grid-cols-2 gap-4 mb-8">
          <StatCard label="Total Sugerencias" value={getStat("total")} />
          <StatCard label="Favoritas" value={getStat("favorites")} />
        </div>

        {/* Filtros */}
        <div className="flex flex-wrap justify-center gap-2 mb-6">
          {["all", "favorites"].map((cat) => (
            <button
              key={cat}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition backdrop-blur-md border border-white/20 ${
                filter === cat
                  ? "bg-gradient-to-r from-orange-400 to-pink-500 text-white shadow-lg"
                  : "bg-white/10 text-white hover:bg-white/20"
              }`}
              onClick={() => setFilter(cat)}
            >
              {cat === "all" ? "Todas" : "⭐ Favoritas"}
            </button>
          ))}
        </div>

        {/* Contenido */}
        {loading && <p className="text-center text-white/80">Cargando...</p>}
        {error && <p className="text-center text-red-300">{error}</p>}
        {filtered.length === 0 && !loading && (
          <p className="text-center text-white/60 italic">Sin sugerencias registradas.</p>
        )}

        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((sug) => (
            <div
              key={sug._id}
              className="relative bg-white/10 border border-white/20 rounded-2xl p-6 backdrop-blur-md shadow-md hover:shadow-2xl transition group"
            >
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-bold uppercase px-3 py-1 rounded-full bg-gradient-to-r from-gray-400 to-gray-600 text-white">
                  {sug.category}
                </span>
                <span className="text-xs text-white/70">
                  {format(new Date(sug.createdAt), "d MMM yyyy", { locale: es })}
                </span>
              </div>

              <h3 className="text-base font-semibold text-white">{sug.suggestion}</h3>
              <p className="mt-2 text-sm text-white/80">{sug.reason}</p>

              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => toggleFavorite(sug._id)}
                  className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 transition ${
                    sug.isFavorite
                      ? "bg-gradient-to-r from-yellow-400 to-yellow-500 text-white"
                      : "bg-white/10 hover:bg-white/20 text-white"
                  }`}
                >
                  {sug.isFavorite ? <Star size={16} /> : <StarOff size={16} />}
                  Favorito
                </button>
                <button
                  onClick={() => convertToHabit(sug)}
                  className="px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-emerald-400 to-teal-500 text-white hover:opacity-90 transition"
                >
                  + Hábito
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl py-5 px-4 text-center shadow">
      <div className="text-2xl font-bold text-white">{value}</div>
      <div className="text-sm text-white/80">{label}</div>
    </div>
  );
}