import React from 'react';
import authService from '../services/authService';

/**
 * Dashboard — página que se muestra tras un inicio de sesión exitoso.
 *
 * Confirma visualmente que la autenticación fue correcta y
 * ofrece la opción de cerrar sesión, que limpia el token del localStorage
 * y devuelve al usuario al formulario de login.
 *
 * @param {Function} onLogout - Callback invocado cuando el usuario cierra sesión
 */
function Dashboard({ onLogout }) {
  // Obtener el nombre del usuario desde localStorage
  const username = authService.getCurrentUser();

  /**
   * Cierra la sesión: elimina el token y notifica a App.jsx
   * para que vuelva a renderizar el formulario de login.
   */
  const handleLogout = () => {
    authService.logout();
    onLogout();
  };

  return (
    <div className="dashboard-wrapper">
      <div className="dashboard-card">

        {/* Ícono de bienvenida */}
        <div className="dashboard-icon" aria-hidden="true">✅</div>

        {/* Mensaje de bienvenida personalizado */}
        <h1 className="dashboard-title">
          ¡Bienvenido, <span className="username-highlight">{username}</span>!
        </h1>

        <p className="dashboard-message">
          Has iniciado sesión correctamente en el sistema.
        </p>

        {/* Información de la evidencia */}
        <div className="dashboard-info-box">
          <p className="dashboard-info-label">Módulo activo</p>
          <p className="dashboard-info-value">Inicio de Sesión — GA7-220501096-AA5-EV01</p>
        </div>

        {/* Botón de cierre de sesión */}
        <button
          onClick={handleLogout}
          className="logout-button"
        >
          Cerrar Sesión
        </button>

      </div>
    </div>
  );
}

export default Dashboard;
