import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import './App.css';
import CrearHabito from './components/pages/CrearHabito';
import MoodPage from './components/pages/MoodPage'; 
import EditHabitos from './components/pages/EditHabitos';
import Login from './components/pages/Login';
import Register from './components/pages/Register';
import LandingPage from './components/pages/LandingPage';
import ResetPassword from './components/pages/actualizarContra';
import { AuthProvider } from './contexts/AuthContext'; 
import PrivateRoute from './PrivateRoute';
import SearchHabitsPage from './components/pages/SearchHabito';
import SearchHabitsPageoscuro from './components/pages/SearchHabitooscuro';
import  ReminderPage  from './components/pages/ReminderPage'; 
import  ReminderPageoscuro  from './components/pages/ReminderPageoscuro'; 
import DashboardOverview from './components/pages/DashboardOverview';
import Medallas from './components/pages/Medallas';
import SuggestionsHistory from "./components/pages/SuggestionsHistory";
import  GoogleLinkPage from './components/pages/CalendarioHabitos';
import  GoogleLinkPageoscuro from './components/pages/CalendarioHabitoos';
import GlobalRankingPage from './components/pages/ranking'; // Importa la página de ranking global
import FriendshipPage  from './components/pages/friend'; // Importa la página de amistad
import HabitsPage2 from './components/pages/Dasbhoard2'; // Importa el nuevo componente de dashboard
import CategoriasPage from './components/pages/CategoriasPage';
import ObjectivesPage from "./components/pages/ObjectivesPage";
// Componente principal de la aplicación
function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Rutas públicas */}
          <Route path="/" element={<Navigate to="/landing" />} />
          <Route path="/landing" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/updateContra" element={<ResetPassword />} />

          {/* Rutas protegidas dentro del wrapper PrivateRoute */}
          <Route element={<PrivateRoute />}>
            <Route path="/crear-habito" element={<CrearHabito />} />
            <Route path="/mood-page" element={<MoodPage />} />
            <Route path="/editar-habito/:habitId" element={<EditHabitos />} />
            <Route path="/buscar-habito" element={<SearchHabitsPage />} />
             <Route path="/buscar-habito2" element={<SearchHabitsPageoscuro  />} />
            <Route path="/recordatorios/:habitId" element={<ReminderPage  />} />
            <Route path="/recordatorios2/:habitId" element={<ReminderPageoscuro   />} />
            <Route path="/progreso" element={<DashboardOverview />} />
            <Route path="/Medallas" element={<Medallas />} />     
            <Route path="/historial-sugerencias" element={<SuggestionsHistory />} />
            <Route path="/calendario" element={<GoogleLinkPage/>} />
            <Route path="/calendario2" element={<GoogleLinkPageoscuro/>} />
            <Route path="/ranking" element={<GlobalRankingPage />} />
            <Route path="/friendship" element={<FriendshipPage  />} />
             <Route path="/dasboard" element={< HabitsPage2  />} />
            <Route path="/categorias" element={<CategoriasPage />} />
            <Route path="/objectives" element={<ObjectivesPage />} />
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
