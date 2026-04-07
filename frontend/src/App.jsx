import React, { useState } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import MainLayout from './layouts/MainLayout';
import { useTheme } from './hooks/useTheme';
import Dashboard from './pages/Dashboard';
import Docentes from './pages/Docentes';
import Calificaciones from './pages/Calificaciones';
import Estudiantes from './pages/Estudiantes';
import GruposHorarios from './pages/GruposHorarios';
import Materias from './pages/Materias';
import Reportes from './pages/Reportes';
import Configuraciones from './pages/Configuraciones';
import authService from './services/authService';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    authService.isAuthenticated(),
  );
  const [view, setView] = useState('login'); // 'login' | 'register'
  const { dark, toggle } = useTheme();

  const handleLoginSuccess = () => setIsAuthenticated(true);
  const handleLogout       = () => setIsAuthenticated(false);

  if (!isAuthenticated) {
    if (view === 'register') {
      return (
        <RegisterForm
          onBackToLogin={() => setView('login')}
          onRegisterSuccess={() => setView('login')}
        />
      );
    }
    return (
      <LoginForm
        onLoginSuccess={handleLoginSuccess}
        onShowRegister={() => setView('register')}
      />
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Layout principal con sidebar y topbar */}
        <Route element={<MainLayout onLogout={handleLogout} darkMode={dark} onToggleTheme={toggle} />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard"       element={<Dashboard />} />
          <Route path="/estudiantes"     element={<Estudiantes />} />
          <Route path="/docentes"        element={<Docentes />} />
          <Route path="/grupos"          element={<GruposHorarios />} />
          <Route path="/materias"        element={<Materias />} />
          <Route path="/calificaciones"  element={<Calificaciones />} />
          <Route path="/reportes"        element={<Reportes />} />
          <Route path="/configuraciones" element={<Configuraciones />} />
          {/* Cualquier ruta desconocida redirige al dashboard */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
