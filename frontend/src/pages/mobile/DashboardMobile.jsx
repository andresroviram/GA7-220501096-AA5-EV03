import React from 'react';
import StatCard from '../../components/StatCard';
import AcademicPerformanceChart from '../../components/AcademicPerformanceChart';
import GradeDistributionChart from '../../components/GradeDistributionChart';
import { stats } from '../../data/mockDashboard';
import { IconGradCap, IconUsers, IconBook, IconCalendar } from '../../components/Icons';
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

      {/* Gráficas */}
      <AcademicPerformanceChart />
      <GradeDistributionChart />
    </div>
  );
}

export default DashboardMobile;
