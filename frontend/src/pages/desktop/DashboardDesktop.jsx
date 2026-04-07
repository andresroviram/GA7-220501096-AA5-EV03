import React from 'react';
import StatCard from '../../components/StatCard';
import TopStudents from '../../components/TopStudents';
import GroupAverageChart from '../../components/GroupAverageChart';
import AcademicPerformanceChart from '../../components/AcademicPerformanceChart';
import GradeDistributionChart from '../../components/GradeDistributionChart';
import { stats } from '../../data/mockDashboard';
import { IconGradCap, IconUsers, IconBook, IconCalendar } from '../../components/Icons';

const STAT_ICONS = [<IconGradCap />, <IconUsers />, <IconBook />, <IconCalendar />];

function Dashboard() {
  return (
    <div className="dashboard">

      {/* ── Fila de Stats ─────────────────────────────────── */}
      <div className="stats-grid">
        {stats.map((s) => (
          <StatCard key={s.id} label={s.label} value={s.value} icon={STAT_ICONS[s.id - 1]} />
        ))}
      </div>

      {/* ── Fila central: Top Alumnos + Promedio por Grupo ── */}
      <div className="widgets-row">
        <TopStudents />
        <GroupAverageChart />
      </div>

      {/* ── Fila inferior: Rendimiento + Distribución ──────── */}
      <div className="widgets-row">
        <AcademicPerformanceChart />
        <GradeDistributionChart />
      </div>

    </div>
  );
}

export default Dashboard;
