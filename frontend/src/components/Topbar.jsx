import React from 'react';
import authService from '../services/authService';
import { IconMenu, IconSun, IconMoon, IconBell } from './Icons';

/**
 * Topbar — barra superior del layout principal.
 * Muestra el título de la página activa, controles de notificaciones,
 * modo oscuro (visual) y la info del usuario logueado.
 */
function Topbar({ title = 'Dashboard', onLogout, onToggleSidebar, darkMode = false, onToggleTheme }) {
  const user     = authService.getCurrentUser();
  const nombre   = user?.nombre   || 'Usuario';
  const rol      = user?.tipo_usuario || 'administrador';
  const rolLabel = { administrativo: 'Administrador', docente: 'Docente', padre: 'Padre / Tutor' }[rol] ?? 'Usuario';

  return (
    <header className="topbar">
      <div className="topbar-left">
        <button className="topbar-menu-btn" aria-label="Menú" onClick={onToggleSidebar}><IconMenu /></button>
        <h2 className="topbar-title">{title}</h2>
      </div>

      <div className="topbar-right">
        {/* Toggle modo claro / oscuro */}
        <button
          className="topbar-icon-btn"
          aria-label={darkMode ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
          onClick={onToggleTheme}
          title={darkMode ? 'Modo claro' : 'Modo oscuro'}
        >
          {darkMode ? <IconSun /> : <IconMoon />}
        </button>

        {/* Notificaciones */}
        <button className="topbar-icon-btn" aria-label="Notificaciones"><IconBell /></button>

        {/* Usuario */}
        <div className="topbar-user">
          <div className="topbar-user-info">
            <span className="topbar-user-name">{nombre}</span>
            <span className="topbar-user-role">{rolLabel}</span>
          </div>
          <button
            className="topbar-avatar"
            onClick={onLogout}
            title="Cerrar sesión"
            aria-label="Cerrar sesión"
          >
            {nombre.charAt(0).toUpperCase()}
          </button>
        </div>
      </div>
    </header>
  );
}

export default Topbar;
