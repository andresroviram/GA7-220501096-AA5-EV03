import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import {
  IconGrid, IconGradCap, IconUsers, IconCalendar,
  IconBook, IconCheckSquare, IconBarChart, IconSettings, IconSchool, IconShield,
} from './Icons';
import authService from '../services/authService';
import { canAccess } from '../utils/permissions';
import * as configService from '../services/configService';


const navItems = [
  { to: '/dashboard',       route: 'dashboard',       label: 'Dashboard',         icon: <IconGrid /> },
  { to: '/estudiantes',     route: 'estudiantes',     label: 'Estudiantes',       icon: <IconGradCap /> },
  { to: '/docentes',        route: 'docentes',        label: 'Docentes',          icon: <IconUsers /> },
  { to: '/grupos',          route: 'grupos',          label: 'Grupos y horarios', icon: <IconCalendar /> },
  { to: '/materias',        route: 'materias',        label: 'Materias',          icon: <IconBook /> },
  { to: '/calificaciones',  route: 'calificaciones',  label: 'Calificaciones',    icon: <IconCheckSquare /> },
  { to: '/reportes',        route: 'reportes',        label: 'Reportes',          icon: <IconBarChart /> },
  { to: '/configuraciones', route: 'configuraciones', label: 'Configuraciones',   icon: <IconSettings /> },
  { to: '/roles',           route: 'roles',           label: 'Roles',             icon: <IconShield /> },
];

function Sidebar({ collapsed = false }) {
  const user        = authService.getCurrentUser();
  const role        = user?.tipo_usuario ?? '';
  const visibleItems = navItems.filter((item) => canAccess(role, item.route));

  const [institucion, setInstitucion] = useState('Sistema Integral');
  useEffect(() => {
    configService.getParams()
      .then((p) => { if (p?.institucion) setInstitucion(p.institucion); })
      .catch(() => {});
  }, []);

  const lastLoginRaw = localStorage.getItem('lastLogin') ?? sessionStorage.getItem('lastLogin');
  const lastLoginLabel = lastLoginRaw
    ? new Intl.DateTimeFormat('es', {
        day: '2-digit', month: 'short', year: 'numeric',
        hour: '2-digit', minute: '2-digit',
      }).format(new Date(lastLoginRaw))
    : null;

  return (
    <aside className={`sidebar${collapsed ? ' sidebar--collapsed' : ''}`}>
      {/* Logo / Marca */}
      <div className="sidebar-brand">
        <div className="sidebar-brand-icon"><IconSchool /></div>
        {!collapsed && (
          <div>
            <p className="sidebar-brand-name">{institucion}</p>
            <p className="sidebar-brand-sub">Sistema Integral Académico</p>
          </div>
        )}
      </div>

      {/* Navegación */}
      <nav className="sidebar-nav">
        {visibleItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            title={collapsed ? item.label : undefined}
            className={({ isActive }) =>
              'sidebar-nav-item' + (isActive ? ' sidebar-nav-item--active' : '')
            }
          >
            <span className="sidebar-nav-icon" aria-hidden="true">{item.icon}</span>
            {!collapsed && <span>{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Versión (encima del divider) */}
      {!collapsed && (
        <div className="sidebar-version">v {__APP_VERSION__}</div>
      )}

      {/* Último acceso (con divider arriba) */}
      {!collapsed && lastLoginLabel && (
        <div className="sidebar-footer">
          <span className="sidebar-last-login-label">Último acceso</span>
          <span className="sidebar-last-login-value">{lastLoginLabel}</span>
        </div>
      )}
    </aside>
  );
}

export default Sidebar;
