import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  IconGrid, IconGradCap, IconUsers, IconCalendar,
  IconBook, IconCheckSquare, IconBarChart, IconSettings, IconSchool,
} from './Icons';


const navItems = [
  { to: '/dashboard',          label: 'Dashboard',         icon: <IconGrid /> },
  { to: '/estudiantes',        label: 'Estudiantes',       icon: <IconGradCap /> },
  { to: '/docentes',           label: 'Docentes',          icon: <IconUsers /> },
  { to: '/grupos',             label: 'Grupos y horarios', icon: <IconCalendar /> },
  { to: '/materias',           label: 'Materias',          icon: <IconBook /> },
  { to: '/calificaciones',     label: 'Calificaciones',    icon: <IconCheckSquare /> },
  { to: '/reportes',           label: 'Reportes',          icon: <IconBarChart /> },
  { to: '/configuraciones',    label: 'Configuraciones',   icon: <IconSettings /> },
];

function Sidebar({ collapsed = false }) {
  return (
    <aside className={`sidebar${collapsed ? ' sidebar--collapsed' : ''}`}>
      {/* Logo / Marca */}
      <div className="sidebar-brand">
        <div className="sidebar-brand-icon"><IconSchool /></div>
        {!collapsed && (
          <div>
            <p className="sidebar-brand-name">Sistema Integral</p>
            <p className="sidebar-brand-sub">Académico</p>
          </div>
        )}
      </div>

      {/* Navegación */}
      <nav className="sidebar-nav">
        {navItems.map((item) => (
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
    </aside>
  );
}

export default Sidebar;
