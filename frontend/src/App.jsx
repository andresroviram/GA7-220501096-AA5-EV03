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
import { canAccess } from './utils/permissions';

/** Redirige al dashboard si el rol no tiene acceso a la ruta. */
function PermissionRoute({ route, children }) {
  const role = authService.getCurrentUser()?.tipo_usuario ?? '';
  return canAccess(role, route) ? children : <Navigate to="/dashboard" replace />;
}

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
          <Route path="/estudiantes"     element={<PermissionRoute route="estudiantes"><Estudiantes /></PermissionRoute>} />
          <Route path="/docentes"        element={<PermissionRoute route="docentes"><Docentes /></PermissionRoute>} />
          <Route path="/grupos"          element={<PermissionRoute route="grupos"><GruposHorarios /></PermissionRoute>} />
          <Route path="/materias"        element={<PermissionRoute route="materias"><Materias /></PermissionRoute>} />
          <Route path="/calificaciones"  element={<PermissionRoute route="calificaciones"><Calificaciones /></PermissionRoute>} />
          <Route path="/reportes"        element={<PermissionRoute route="reportes"><Reportes /></PermissionRoute>} />
          <Route path="/configuraciones" element={<PermissionRoute route="configuraciones"><Configuraciones /></PermissionRoute>} />
          {/* Cualquier ruta desconocida redirige al dashboard */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
