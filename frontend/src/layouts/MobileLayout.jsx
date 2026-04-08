import React, { useState } from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import authService from '../services/authService';
import { canAccess } from '../utils/permissions';
import { useTheme } from '../hooks/useTheme';
import {
  IconGrid, IconGradCap, IconUsers,
  IconCheckSquare, IconBarChart, IconSettings, IconCalendar,
  IconMenu, IconSun, IconMoon, IconBell, IconLogOut, IconUser,
} from '../components/Icons';

const pageTitles = {
  '/dashboard':       'Dashboard',
  '/estudiantes':     'Estudiantes',
  '/docentes':        'Docentes',
  '/grupos':          'Grupos y Horarios',
  '/materias':        'Materias',
  '/calificaciones':  'Calificaciones',
  '/reportes':        'Reportes',
  '/configuraciones': 'Configuraciones',
};

// Los primeros 5 aparecen en el bottom nav (prioridad: accesos rápidos del dashboard)
const allNavItems = [
  { to: '/dashboard',       route: 'dashboard',       label: 'Inicio',   icon: <IconGrid /> },
  { to: '/estudiantes',     route: 'estudiantes',     label: 'Alumnos',  icon: <IconGradCap /> },
  { to: '/docentes',        route: 'docentes',        label: 'Docentes', icon: <IconUsers /> },
  { to: '/calificaciones',  route: 'calificaciones',  label: 'Notas',    icon: <IconCheckSquare /> },
  { to: '/reportes',        route: 'reportes',        label: 'Reportes', icon: <IconBarChart /> },
  // Solo en drawer:
  { to: '/grupos',          route: 'grupos',          label: 'Grupos',   icon: <IconCalendar /> },
  { to: '/configuraciones', route: 'configuraciones', label: 'Config',   icon: <IconSettings /> },
];

/**
 * Layout para dispositivos móviles (≤ 767 px).
 * Topbar compacta en la parte superior + bottom navigation bar.
 */
function MobileLayout({ onLogout, darkMode, onToggleTheme }) {
  const location = useLocation();
  const title    = pageTitles[location.pathname] ?? 'Sistema Académico';

  const user     = authService.getCurrentUser();
  const role     = user?.tipo_usuario ?? '';
  const nombre   = user?.nombre ?? 'Usuario';
  const rolLabel = { administrativo: 'Administrador', docente: 'Docente', padre: 'Padre / Tutor' }[role] ?? 'Usuario';

  const visibleItems = allNavItems.filter((item) => canAccess(role, item.route));
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleLogout = () => {
    authService.logout();
    onLogout();
  };

  return (
    <div className="mobile-layout">

      {/* ── Topbar móvil ──────────────────────────────────── */}
      <header className="mobile-topbar">
        <div className="mobile-topbar-left">
          <button
            className="mobile-topbar-btn"
            aria-label="Menú"
            onClick={() => setDrawerOpen(true)}
          >
            <IconMenu />
          </button>
          <span className="mobile-topbar-title">{title}</span>
        </div>
        <div className="mobile-topbar-right">
          <button
            className="mobile-topbar-btn"
            aria-label={darkMode ? 'Modo claro' : 'Modo oscuro'}
            onClick={onToggleTheme}
          >
            {darkMode ? <IconSun /> : <IconMoon />}
          </button>
          <button className="mobile-topbar-btn" aria-label="Notificaciones">
            <IconBell />
          </button>
        </div>
      </header>

      {/* ── Contenido de la página ────────────────────────── */}
      <main className="mobile-layout-content">
        <Outlet />
      </main>

      {/* ── Bottom Navigation ────────────────────────────── */}
      <nav className="bottom-nav">
        {visibleItems.slice(0, 5).map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              'bottom-nav-item' + (isActive ? ' bottom-nav-item--active' : '')
            }
          >
            <span className="bottom-nav-icon">{item.icon}</span>
            <span className="bottom-nav-label">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* ── Drawer lateral (menú completo + perfil) ──────── */}
      {drawerOpen && (
        <div className="mobile-drawer-overlay" onClick={() => setDrawerOpen(false)}>
          <aside className="mobile-drawer" onClick={(e) => e.stopPropagation()}>

            <div className="mobile-drawer-profile">
              <div className="mobile-drawer-avatar">
                <IconUser />
              </div>
              <div>
                <p className="mobile-drawer-name">{nombre}</p>
                <p className="mobile-drawer-role">{rolLabel}</p>
              </div>
            </div>

            <nav className="mobile-drawer-nav">
              {visibleItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setDrawerOpen(false)}
                  className={({ isActive }) =>
                    'mobile-drawer-item' + (isActive ? ' mobile-drawer-item--active' : '')
                  }
                >
                  <span className="mobile-drawer-item-icon">{item.icon}</span>
                  <span>{item.label}</span>
                </NavLink>
              ))}
            </nav>

            <button className="mobile-drawer-logout" onClick={handleLogout}>
              <IconLogOut /> Cerrar sesión
            </button>
          </aside>
        </div>
      )}
    </div>
  );
}

export default MobileLayout;
