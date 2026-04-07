import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import authService from '../services/authService';

/** Mapea cada ruta al título que muestra la Topbar */
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

function MainLayout({ onLogout, darkMode, onToggleTheme }) {
  const location  = useLocation();
  const title     = pageTitles[location.pathname] ?? 'Dashboard';
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => {
    authService.logout();
    onLogout();
  };

  return (
    <div className="app-layout">
      <Sidebar collapsed={collapsed} />
      <div className="app-main">
        <Topbar
          title={title}
          onLogout={handleLogout}
          onToggleSidebar={() => setCollapsed((c) => !c)}
          darkMode={darkMode}
          onToggleTheme={onToggleTheme}
        />
        <main className="app-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default MainLayout;
