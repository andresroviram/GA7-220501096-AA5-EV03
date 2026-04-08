import React, { useState } from 'react';
import {
  HashRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
  useNavigate,
} from 'react-router-dom';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import ForgotPasswordForm from './components/ForgotPasswordForm';
import MainLayout from './layouts/MainLayout';
import MobileLayout from './layouts/MobileLayout';
import { useTheme } from './hooks/useTheme';
import { useIsMobile } from './hooks/useIsMobile';
import Dashboard from './pages/Dashboard';
import Docentes from './pages/Docentes';
import Calificaciones from './pages/Calificaciones';
import Estudiantes from './pages/Estudiantes';
import GruposHorarios from './pages/GruposHorarios';
import Materias from './pages/Materias';
import Reportes from './pages/Reportes';
import Configuraciones from './pages/Configuraciones';
import PendingScreen from './components/PendingScreen';
import Roles from './pages/Roles';
import authService from './services/authService';
import { canAccess } from './utils/permissions';
import { ToastProvider } from './components/ui/Toast';

/** Redirige a /login si el usuario no está autenticado. */
function PrivateRoute() {
  return authService.isAuthenticated() ? <Outlet /> : <Navigate to="/login" replace />;
}

/** Redirige al dashboard si el rol no tiene acceso a la ruta. */
function PermissionRoute({ route, children }) {
  const role = authService.getCurrentUser()?.tipo_usuario ?? '';
  return canAccess(role, route) ? children : <Navigate to="/dashboard" replace />;
}

/** Componente interno con acceso a useNavigate (debe estar dentro de BrowserRouter). */
function AppRoutes() {
  const navigate = useNavigate();
  const [, forceUpdate] = useState(0);
  const { dark, toggle } = useTheme();
  const isMobile = useIsMobile();
  const Layout = isMobile ? MobileLayout : MainLayout;

  const handleLoginSuccess = () => {
    forceUpdate((n) => n + 1);
    navigate('/dashboard', { replace: true });
  };

  const handleLogout = () => {
    authService.logout();
    forceUpdate((n) => n + 1);
    navigate('/login', { replace: true });
  };

  return (
    <Routes>
      {/* Raíz → redirige según sesión */}
      <Route
        path="/"
        element={<Navigate to={authService.isAuthenticated() ? '/dashboard' : '/login'} replace />}
      />

      {/* ── Rutas públicas ───────────────────────────────────────────────── */}
      <Route
        path="/login"
        element={
          authService.isAuthenticated()
            ? <Navigate to="/dashboard" replace />
            : (
              <LoginForm
                onLoginSuccess={handleLoginSuccess}
                onShowRegister={() => navigate('/register')}
                onShowForgot={() => navigate('/forgot-password')}
              />
            )
        }
      />
      <Route
        path="/register"
        element={
          authService.isAuthenticated()
            ? <Navigate to="/dashboard" replace />
            : (
              <RegisterForm
                onBackToLogin={() => navigate('/login')}
                onRegisterSuccess={() => navigate('/login')}
              />
            )
        }
      />
      <Route
        path="/forgot-password"
        element={
          authService.isAuthenticated()
            ? <Navigate to="/dashboard" replace />
            : <ForgotPasswordForm onBackToLogin={() => navigate('/login')} />
        }
      />
      <Route
        path="/pendiente"
        element={<PendingScreen onBackToLogin={() => navigate('/login')} />}
      />

      {/* ── Rutas protegidas (requieren sesión activa) ────────────────────── */}
      <Route element={<PrivateRoute />}>
        <Route element={<Layout onLogout={handleLogout} darkMode={dark} onToggleTheme={toggle} />}>
          <Route path="/dashboard"       element={<Dashboard />} />
          <Route path="/estudiantes"     element={<PermissionRoute route="estudiantes"><Estudiantes /></PermissionRoute>} />
          <Route path="/docentes"        element={<PermissionRoute route="docentes"><Docentes /></PermissionRoute>} />
          <Route path="/grupos"          element={<PermissionRoute route="grupos"><GruposHorarios /></PermissionRoute>} />
          <Route path="/materias"        element={<PermissionRoute route="materias"><Materias /></PermissionRoute>} />
          <Route path="/calificaciones"  element={<PermissionRoute route="calificaciones"><Calificaciones /></PermissionRoute>} />
          <Route path="/reportes"        element={<PermissionRoute route="reportes"><Reportes /></PermissionRoute>} />
          <Route path="/configuraciones" element={<PermissionRoute route="configuraciones"><Configuraciones /></PermissionRoute>} />
          <Route path="/roles"        element={<PermissionRoute route="roles"><Roles /></PermissionRoute>} />
          {/* Ruta desconocida dentro de la app → dashboard */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Route>
      </Route>
    </Routes>
  );
}

function App() {
  return (
    <ToastProvider>
      <HashRouter>
        <AppRoutes />
      </HashRouter>
    </ToastProvider>
  );
}

export default App;
