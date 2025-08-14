import React, { useState } from 'react';
import '../styles/Dashboard.css'; // Puedes mantener tu propio estilo o usar Tailwind

const ExportDialog = () => {
  const [format, setFormat] = useState('json');
  const [loading, setLoading] = useState(false);

  const API_BASE_URL = 'http://localhost:5000/api';

  const handleDownload = async () => {
    try {
      setLoading(true);
// Ejemplo simple
const response = await fetch(`${API_BASE_URL}/export?format=${format}`, {
  method: 'GET',
  credentials: 'include',
});

      if (!response.ok) throw new Error('Error al descargar el historial');

      const blob = await response.blob();
      const contentDisposition = response.headers.get('Content-Disposition');
      const filename =
        contentDisposition?.match(/filename="?(.+)"?/)?.[1] || `historial.${format}`;


      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      alert('Hubo un error exportando el historial');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="text-right mt-4">
      <div className="inline-flex items-center gap-4">
        <label className="text-sm text-white">
          <input
            type="radio"
            value="json"
            checked={format === 'json'}
            onChange={() => setFormat('json')}
            className="mr-1"
          />
          JSON
        </label>
        <label className="text-sm text-white">
          <input
            type="radio"
            value="csv"
            checked={format === 'csv'}
            onChange={() => setFormat('csv')}
            className="mr-1"
          />
          CSV
        </label>
        <button
          onClick={handleDownload}
          disabled={loading}
          className="bg-purple-600 hover:bg-purple-700 text-white text-sm px-3 py-1 rounded transition"
        >
          {loading ? 'Descargando...' : 'Exportar Historial'}
        </button>
      </div>
    </div>
  );
};

export default ExportDialog; 