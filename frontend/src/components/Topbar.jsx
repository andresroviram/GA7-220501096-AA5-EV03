import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import { IconMenu, IconSun, IconMoon, IconBell, IconUser, IconLogOut } from './Icons';

/**
 * Topbar — barra superior del layout principal.
 */
function getCicloActual() {
  const now = new Date();
  const year = now.getFullYear();
  const semester = now.getMonth() < 6 ? 'I' : 'II';
  return `${year}-${semester}`;
}

function Topbar({ title = 'Dashboard', onLogout, onToggleSidebar, darkMode = false, onToggleTheme }) {
  const user     = authService.getCurrentUser();
  const nombre   = user?.nombre   || 'Usuario';
  const rol      = user?.tipo_usuario || 'administrador';
  const rolLabel = { administrativo: 'Administrador', docente: 'Docente', padre: 'Padre / Acudiente' }[rol] ?? 'Usuario';
  const ciclo    = getCicloActual();

  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef  = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    function handleClick(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <header className="topbar">
      <div className="topbar-left">
        <button className="topbar-menu-btn" aria-label="Menú" onClick={onToggleSidebar}><IconMenu /></button>
        <h2 className="topbar-title">{title}</h2>
      </div>

      <div className="topbar-right">
        {/* Ciclo académico actual */}
        <span className="topbar-ciclo" title="Ciclo académico actual">{ciclo}</span>

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

        {/* Usuario + dropdown */}
        <div className="topbar-user" ref={menuRef}>
          <div className="topbar-user-info">
            <span className="topbar-user-name">{nombre}</span>
            <span className="topbar-user-role">{rolLabel}</span>
          </div>
          <button
            className="topbar-avatar"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="Menú de usuario"
            aria-expanded={menuOpen}
          >
            {nombre.charAt(0).toUpperCase()}
          </button>

          {menuOpen && (
            <div className="topbar-user-dropdown" role="menu">
              <button className="topbar-dropdown-item" role="menuitem" onClick={() => { setMenuOpen(false); navigate('/configuraciones', { state: { tab: 'perfil' } }); }}>
                <IconUser />
                <span>Ver mi perfil</span>
              </button>
              <div className="topbar-dropdown-divider" />
              <button
                className="topbar-dropdown-item topbar-dropdown-item--danger"
                role="menuitem"
                onClick={() => { setMenuOpen(false); onLogout(); }}
              >
                <IconLogOut />
                <span>Cerrar sesión</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Topbar;
