import React, { useState } from 'react';
import LoginForm from './components/LoginForm';
import Dashboard from './pages/Dashboard';
import authService from './services/authService';

/**
 * App — componente raíz de la aplicación.
 *
 * Gestiona el estado global de autenticación:
 *  - Si el usuario está autenticado (hay token en localStorage) → muestra el Dashboard.
 *  - Si no → muestra el formulario de login.
 *
 * No usa react-router-dom intencionalmente: el módulo solicitado es solo login,
 * por lo que el enrutamiento basado en estado es suficiente y más simple.
 */
function App() {
  /**
   * Estado de autenticación inicializado desde localStorage.
   * Esto permite que, al recargar la página, el usuario siga "logueado"
   * si su token aún está guardado.
   */
  const [isAuthenticated, setIsAuthenticated] = useState(
    authService.isAuthenticated(),
  );

  /** Callback pasado a LoginForm: se activa cuando el login es exitoso */
  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  /** Callback pasado a Dashboard: se activa cuando el usuario cierra sesión */
  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  // Renderizado condicional basado en el estado de autenticación
  return isAuthenticated ? (
    <Dashboard onLogout={handleLogout} />
  ) : (
    <LoginForm onLoginSuccess={handleLoginSuccess} />
  );
}

export default App;
