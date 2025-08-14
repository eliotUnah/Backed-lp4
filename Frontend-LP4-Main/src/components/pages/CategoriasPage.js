import React, { useEffect, useState } from 'react';
import api from '../../utils/axiosConfig';
import { useNavigate } from 'react-router-dom';
import '../styles/CategoriasPage.css';


function CategoriasPage() {
  const [categorias, setCategorias] = useState([]);
  const [nombre, setNombre] = useState('');
  const [habitosPorCategoria, setHabitosPorCategoria] = useState({});
  const [modoEdicion, setModoEdicion] = useState(null); // ID de categoría en edición
  const [nuevoNombre, setNuevoNombre] = useState('');   // Nuevo nombre temporal
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategorias();
  }, []);

  const fetchCategorias = async () => {
    try {
      const res = await api.get('/categories');
      setCategorias(res.data);
    } catch (error) {
      console.error('Error al obtener categorías', error);
    }
  };

  const crearCategoria = async () => {
    if (!nombre.trim()) return;
    try {
      await api.post('/categories', { name: nombre });
      setNombre('');
      fetchCategorias();
    } catch (error) {
      console.error('Error al crear categoría', error);
    }
  };

  const eliminarCategoria = async (id) => {
    try {
      await api.delete(`/categories/${id}`);
      fetchCategorias();
    } catch (error) {
      console.error('Error al eliminar categoría', error);
    }
  };

  const verHabitos = async (id) => {
    try {
      const res = await api.get(`/habits?categoryId=${id}`);
      setHabitosPorCategoria((prev) => ({ ...prev, [id]: res.data }));
    } catch (error) {
      console.error('Error al obtener hábitos', error);
    }
  };

  const actualizarCategoria = async (id) => {
  if (!nuevoNombre.trim()) return;
  try {
    await api.put(`/categories/${id}`, { name: nuevoNombre });
    setModoEdicion(null);
    setNuevoNombre('');
    fetchCategorias(); // refrescar lista
  } catch (error) {
    console.error('Error al actualizar categoría', error);
  }
};


return (
  <div className="categorias-container">
    <button onClick={() => navigate(-1)} className="volver-btn">← Volver</button>

    <h2 className="titulo-principal">Gestionar Categorías</h2>

    {/* Formulario de creación */}
    <div className="crear-form">
      <input
        type="text"
        placeholder="Nombre de la nueva categoría"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
      />
      <button onClick={crearCategoria}>Crear</button>
    </div>

    {/* Lista de categorías */}
    {categorias.length === 0 ? (
      <p className="text-gray-500">No hay categorías creadas.</p>
    ) : (
      <div className="lista-categorias">
        {categorias.map((cat) => (
          <div key={cat._id} className="categoria-card">
            <div className="categoria-header">
              {modoEdicion === cat._id ? (
                <>
                  <input
                    type="text"
                    value={nuevoNombre}
                    onChange={(e) => setNuevoNombre(e.target.value)}
                    className="input-edicion"
                  />
                  <button
                    onClick={() => actualizarCategoria(cat._id)}
                    className="guardar"
                  >
                    Guardar
                  </button>
                  <button
                    onClick={() => setModoEdicion(null)}
                    className="cancelar"
                  >
                    Cancelar
                  </button>
                </>
              ) : (
                <>
                  <h3>{cat.name}</h3>
                  <div className="categoria-acciones">
                    <button onClick={() => verHabitos(cat._id)} className="ver">
                      Ver hábitos
                    </button>
                    <button
                      onClick={() => eliminarCategoria(cat._id)}
                      className="eliminar"
                    >
                      Eliminar
                    </button>
                    <button
                      onClick={() => {
                        setModoEdicion(cat._id);
                        setNuevoNombre(cat.name);
                      }}
                      className="editar"
                    >
                      Editar
                    </button>
                  </div>
                </>
              )}
            </div>

            {habitosPorCategoria[cat._id] && (
              <ul className="lista-habitos">
                {habitosPorCategoria[cat._id].length === 0 ? (
                  <li>No hay hábitos en esta categoría.</li>
                ) : (
                  habitosPorCategoria[cat._id].map((h) => (
                    <li key={h._id}>{h.title}</li>
                  ))
                )}
              </ul>
            )}
          </div>
        ))}
      </div>
    )}
  </div>
);
}
export default CategoriasPage;
