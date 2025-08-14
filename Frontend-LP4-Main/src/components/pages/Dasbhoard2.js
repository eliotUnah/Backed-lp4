import React, { useState, useRef, useEffect } from 'react';
import useHabits from '../hooks/getHabits.js';
import { useDeleteHabit } from '../hooks/deleteHabits.js';
import useCreateCheckin from '../hooks/checkinHabits.js';
import { useNavigate, Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useAuth } from '../../contexts/AuthContext';
import DailySuggestionCard from '../pages/DailySuggestionCard.js';
import '../styles/Dashboard2.css';
import useNumericCheckins from '../hooks/useNumericCheckins';


const HabitsPage2 = () => {
  useEffect(() => {
    document.body.classList.add('body_dashboard');
    return () => {
      document.body.classList.remove('body_dashboard');
    };
  }, []);

  const { habits, loading, error, refetch } = useHabits();
  const { logout } = useAuth();
  const { createCheckin, loading: checkinLoading, error: checkinError, success: checkinSuccess } = useCreateCheckin();
  const { deleteHabit, loading: deleting, error: deleteError, success } = useDeleteHabit();
  const navigate = useNavigate();

  const habitsPerPage = 4;
  const totalSlides = 2;
  const slideWidth = 50;
  const sliderRef = useRef(null);
  const [currentIdx, setCurrentIdx] = useState(0);

  useEffect(() => {
    if (sliderRef.current) {
      sliderRef.current.style.transform = `translateX(-${currentIdx * slideWidth}%)`;
    }
  }, [currentIdx]);

  const handleCheckinHabit = async (habitId) => {
    const resultado = await createCheckin(habitId);

    if (resultado) {
      Swal.fire({
        title: '✅ Check-in hecho',
        text: `Racha actual: ${resultado.streakCurrent}, Mejor racha: ${resultado.streakBest}`,
        icon: 'success',
        confirmButtonColor: '#00b894',
      });
    } else if (checkinError) {
      Swal.fire({
        title: '❌',
        text: checkinError,
        icon: 'error',
        confirmButtonColor: '#d63031',
      });
    }
  };

  const handleDeleteHabit = async (habitId) => {
    const resultado = await Swal.fire({
      title: '¿Eliminar hábito?',
      text: '⚠️ Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d63031',
      cancelButtonColor: '#00b894',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    });

    if (!resultado.isConfirmed) return;

    try {
      await deleteHabit(habitId);
      await refetch();
      console.log('✅ Hábito eliminado');

      Swal.fire({
        title: '✅ Eliminado',
        text: 'El hábito ha sido eliminado correctamente.',
        icon: 'success',
        confirmButtonColor: '#00b894',
      });
    } catch (e) {
      console.error('❌ Error al eliminar:', e);

      Swal.fire({
        title: '❌ Error',
        text: 'Ocurrió un problema al intentar eliminar el hábito.',
        icon: 'error',
        confirmButtonColor: '#d63031',
      });
    }
  };

  const startIndex = currentIdx * habitsPerPage;
  const endIndex = startIndex + habitsPerPage;
  let visibleHabits = habits.slice(startIndex, endIndex);

  while (visibleHabits.length < habitsPerPage) {
    visibleHabits.push(null);
  }

  if (loading) return <p>Cargando hábitos...</p>;
  if (error) return <p>{error}</p>;


  return (
 <div className="dashboard-layout"> {/* FLEX CONTENEDOR */}

<div className="sidebar_dashboard">
    <div className="animated-bg"></div>
    <div className="floating-elements">
      <div className="floating-orb orb-1"></div>
      <div className="floating-orb orb-2"></div>
      <div className="floating-orb orb-3"></div>
    </div>

    <div className="sidebar-content_dashboard">
      <div className="profile-section">
        <div className="profile-avatar">
          <i
            className="bi bi-person-fill text-white"
            style={{ fontSize: '2rem' }}
          ></i>
        </div>
        <h2 className="profile-name">User</h2>
        <p className="profile-text">Usuario Premium</p>
      </div>

      <div className="menu-section">
        <div className="menu-section-title">Principal</div>
        <nav className="nav-menu">
          <a className="nav-item" onClick={() => navigate('/crear-habito')} style={{ cursor: 'pointer' }}>
            <i className="bi bi-plus-circle nav-icon"></i>
            <span className="nav-text">Crear nuevo hábito</span>
          </a>

          <a className="nav-item" onClick={() => navigate('/buscar-habito')} style={{ cursor: 'pointer' }}>
            <i className="bi bi-search nav-icon"></i>
            <span className="nav-text">Buscar hábito</span>
          </a>
        </nav>
      </div>

      <div className="menu-section">
        <div className="menu-section-title">Logros</div>
        <nav className="nav-menu">
          <a  className="nav-item" onClick={() => navigate('/Medallas')} style={{ cursor: 'pointer' }}>
            <i className="bi bi-star nav-icon"></i>
            <span className="nav-text">Ver medallas</span>
          </a>

          <a className="nav-item" onClick={() => navigate('/ranking')} style={{ cursor: 'pointer' }}>
            <i className="bi bi-trophy nav-icon"></i>
            <span className="nav-text">Ranking</span>
          </a>
        </nav>
      </div> 

      <div className="menu-section">
        <div className="menu-section-title">Herramientas</div>
        <nav className="nav-menu">
          <Link to="/calendario"className="nav-item">
            <i className="bi bi-calendar nav-icon"></i>
            <span className="nav-text">Calendario</span>
            </Link>

          <a className="nav-item" onClick={() => navigate('/progreso')} style={{ cursor: 'pointer' }}>
            <i className="bi bi-graph-up nav-icon"></i>
            <span className="nav-text">Mi progreso</span>
          </a>

          <a className="nav-item"onClick={() => navigate('/friendship')} style={{ cursor: 'pointer' }}>
             <i className="bi bi-people nav-icon"></i>
            <span className="nav-text">Amigos</span>
          </a>

            <a className="nav-item"onClick={() => navigate('/objectives')} style={{ cursor: 'pointer' }}>
             <i className="bi bi-bullseye nav-icon"></i>
            <span className="nav-text">Metas</span>
          </a>


          <a className="nav-item"onClick={() => navigate('/mood-page')} style={{ cursor: 'pointer' }}>
            <i className="bi bi-leaf nav-icon"></i>
            <span className="nav-text">Estado de Animo</span>
          </a>
        </nav>
      </div>

      

      <div className="menu-section">
        <div className="menu-section-title">Cuenta</div>
        <nav className="nav-menu"> 
          <a className="nav-item" style={{ cursor: 'pointer' }} onClick={async () => {
                    try {
                      await logout();
                      navigate('/login');
                    } catch (error) {
                      console.error('❌ Error al cerrar sesión:', error);
                      Swal.fire({
                        title: 'Error',
                        text: 'Hubo un problema al cerrar sesión.',
                        icon: 'error',
                        confirmButtonColor: '#d63031',
                      });
                    }
                  }}>
            <i className="bi bi-box-arrow-right nav-icon"></i>
            <span className="nav-text">Cerrar Sesión</span>
          </a>
        </nav>
      </div>

      <div className="footer-decoration">
        <p className="footer-text">✨ Habituate ✨</p>
        
      </div>
    </div>
  </div> 
   <DailySuggestionCard />
   {/* MAIN DASHBOARD CONTENT */}
      <main className="main-content-dashboard ">
  <h1 className="content-title">Hábitos que Impulsan tu Vida</h1>
  <p className="content-subtitle">El cambio empieza aquí, uno por uno</p>

  <h2 className="content-title">Tus Hábitos</h2>

  <div className="info-cards">
    {/* ✅ Tarjetas de Hábitos – versión nueva */}
    {visibleHabits.map((habit, index) =>
      habit ? (
        <div className="info-card" key={habit._id}>
          <h3>{habit.title}</h3>
          <div className="info-card-buttons" >
              <button className="checkin-button"  onClick={() => handleCheckinHabit(habit._id)}
           disabled={checkinLoading}>
            <svg className="checkin-svgIcon" viewBox="0 0 512 512">
              <path d="M504.5 75.5l-297 297c-8.5 8.5-22.4 8.5-30.9 0l-168-168c-8.5-8.5-8.5-22.4 0-30.9s22.4-8.5 30.9 0L192 320.6 473.6 39c8.5-8.5 22.4-8.5 30.9 0s8.5 22.4 0 30.9z" />
            </svg>
          </button>
          <button
            className="delete-button"
            onClick={() => handleDeleteHabit(habit._id)}
            disabled={deleting}
          >
            <svg className="delete-svgIcon" viewBox="0 0 448 512">
              <path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z" />
            </svg>
          </button> 
             <button
            className="edit-button"
            onClick={() => navigate(`/editar-habito/${habit._id}`)}
          >
            <svg className="edit-svgIcon" viewBox="0 0 512 512">
              <path d="M410.3 231l11.3-11.3-33.9-33.9-62.1-62.1L291.7 89.8l-11.3 11.3-22.6 22.6L58.6 322.9c-10.4 10.4-18 23.3-22.2 37.4L1 480.7c-2.5 8.4-.2 17.5 6.1 23.7s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L387.7 253.7 410.3 231zM160 399.4l-9.1 22.7c-4 3.1-8.5 5.4-13.3 6.9L59.4 452l23-78.1c1.4-4.9 3.8-9.4 6.9-13.3l22.7-9.1v32c0 8.8 7.2 16 16 16h32zM362.7 18.7L348.3 33.2 325.7 55.8 314.3 67.1l33.9 33.9 62.1 62.1 33.9 33.9 11.3-11.3 22.6-22.6 14.5-14.5c25-25 25-65.5 0-90.5L453.3 18.7c-25-25-65.5-25-90.5 0zm-47.4 168l-144 144c-6.2 6.2-16.4 6.2-22.6 0s-6.2-16.4 0-22.6l144-144c6.2-6.2 16.4-6.2 22.6 0s6.2 16.4 0 22.6z" />
            </svg>
          </button> 
          </div>
         <button
            className="reminder-button"
            onClick={() => navigate(`/recordatorios/${habit._id}`)}
          >
            <svg className="reminder-svgIcon" viewBox="0 0 512 512">
            <path d="M256 512c35.3 0 64-28.7 64-64H192c0 35.3 28.7 64 64 64zm215.4-149.1c-19.8-20.9-55.4-52.1-55.4-154.9 0-77.7-54.5-139.1-128-155.2V32c0-17.7-14.3-32-32-32s-32 14.3-32 32v20.8C150.5 69.9 96 131.3 96 209c0 102.8-35.6 134-55.4 154.9-6 6.3-8.6 14.2-8.6 22.1 0 17.7 14.3 32 32 32h384c17.7 0 32-14.3 32-32 0-7.9-2.6-15.8-8.6-22.1z"/>
            </svg>
          </button> 
          </div> 
      ) : (
        <div className="info-card info-card--placeholder" key={`empty-${index}`}>
          <h3>💡 Espacio disponible</h3>
        </div>
      )
    )}
  </div>
</main>

   </div>

 );
  };
  export default HabitsPage2; 
 
  