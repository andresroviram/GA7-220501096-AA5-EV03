import React from 'react';
import StatCard from '../../components/StatCard';
import { stats } from '../../data/mockDashboard';
import { IconGradCap, IconUsers, IconBook, IconCalendar, IconCheckSquare, IconBarChart } from '../../components/Icons';
import authService from '../../services/authService';

const STAT_ICONS = [<IconGradCap />, <IconUsers />, <IconBook />, <IconCalendar />];

function QuickStat({ label, value, icon, color = '#2A9D6F' }) {
  return (
    <div className="m-stat-card">
      <div className="m-stat-card-icon" style={{ background: `${color}18`, color }}>
        {icon}
      </div>
      <div>
        <p className="m-stat-card-value">{value}</p>
        <p className="m-stat-card-label">{label}</p>
      </div>
    </div>
  );
}

function DashboardMobile() {
  const user = authService.getCurrentUser();
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? 'Buenos días' :
    hour < 19 ? 'Buenas tardes' : 'Buenas noches';

  return (
    <div className="m-page">

      {/* Saludo */}
      <div className="m-hero">
        <p className="m-hero-greeting">{greeting},</p>
        <p className="m-hero-name">{user?.nombre ?? 'Usuario'}</p>
      </div>

      {/* Stats grid 2×2 */}
      <div className="m-stats-grid">
        {stats.map((s, i) => (
          <QuickStat
            key={s.id}
            label={s.label}
            value={s.value}
            icon={STAT_ICONS[i]}
          />
        ))}
      </div>

      {/* Accesos rápidos */}
      <h3 className="m-section-title">Accesos Rápidos</h3>
      <div className="m-quick-links">
        {[
          { label: 'Calificaciones', icon: <IconCheckSquare />, to: '/calificaciones', color: '#2A9D6F' },
          { label: 'Reportes',       icon: <IconBarChart />,    to: '/reportes',       color: '#3D7BBF' },
          { label: 'Estudiantes',    icon: <IconGradCap />,     to: '/estudiantes',    color: '#BF6B3D' },
          { label: 'Docentes',       icon: <IconUsers />,       to: '/docentes',       color: '#7B3DBF' },
        ].map((link) => (
          <a key={link.to} href={link.to} className="m-quick-link" style={{ color: link.color }}>
            <span className="m-quick-link-icon" style={{ background: `${link.color}18` }}>
              {link.icon}
            </span>
            <span className="m-quick-link-label">{link.label}</span>
          </a>
        ))}
      </div>
    </div>
  );
}

export default DashboardMobile;
