import React, { useState, useEffect } from 'react';
import StatCard from '../../components/StatCard';
import AcademicPerformanceChart from '../../components/AcademicPerformanceChart';
import GradeDistributionChart from '../../components/GradeDistributionChart';
import { stats } from '../../data/mockDashboard';
import { IconGradCap, IconUsers, IconBook, IconCalendar, IconBarChart } from '../../components/Icons';
import authService from '../../services/authService';
import * as estudiantesService from '../../services/estudiantesService';
import { getMisHijos } from '../../services/estudiantesService';
import * as calificacionesService from '../../services/calificacionesService';

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

/* ─── Vista mobile para padre/acudiente ────────────────────────────── */
function DashboardPadreMobile({ user }) {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Buenos días' : hour < 19 ? 'Buenas tardes' : 'Buenas noches';

  const [hijos,  setHijos]  = useState([]);
  const [califs, setCalifs] = useState([]);

  useEffect(() => {
    getMisHijos()
      .then(async (h) => {
        setHijos(h);
        const allCalifs = await calificacionesService.getCalificaciones();
        const nombres = new Set(h.map((e) => e.nombre));
        setCalifs(allCalifs.filter((c) => nombres.has(c.estudiante)));
      })
      .catch(() => {});
  }, []);

  const promedio = hijos.length
    ? (hijos.reduce((s, e) => s + e.promedio, 0) / hijos.length).toFixed(1)
    : '—';

  return (
    <div className="m-page">
      <div className="m-hero">
        <p className="m-hero-greeting">{greeting},</p>
        <p className="m-hero-name">{user.nombre}</p>
      </div>

      <div className="m-stats-grid">
        <QuickStat label="A mi cargo"        value={hijos.length}   icon={<IconGradCap />} />
        <QuickStat label="Promedio general"  value={promedio}       icon={<IconBarChart />} color="#1E6CB3" />
        <QuickStat label="Calificaciones"    value={califs.length}  icon={<IconBook />}    color="#7B2D8B" />
        <QuickStat label="Aprobadas"         value={califs.filter((c) => c.calificacion >= 6).length} icon={<IconCalendar />} color="#D97706" />
      </div>

      {/* Tarjetas de hijos */}
      <h3 className="m-section-title">Mis Estudiantes</h3>
      <div className="m-card-list">
        {hijos.map((e) => (
          <div key={e.id} className="m-entity-card">
            <div className="m-entity-card-header">
              <div>
                <p className="m-entity-card-name">{e.nombre}</p>
                <p className="m-entity-card-sub">{e.id} · Grupo {e.grupo}</p>
              </div>
              <span className={`badge ${e.estado === 'Activo' ? 'badge--active' : 'badge--suspended'}`}>
                {e.estado}
              </span>
            </div>
            <div className="m-entity-card-row">
              <span>Promedio: <strong>{e.promedio}</strong></span>
              <span>Edad: {e.edad} años</span>
            </div>
          </div>
        ))}
      </div>

      {/* Calificaciones recientes */}
      <h3 className="m-section-title" style={{ marginTop: '1.5rem' }}>Calificaciones Recientes</h3>
      <div className="m-card-list">
        {califs.map((c) => (
          <div key={c.id} className="m-entity-card">
            <div className="m-entity-card-header">
              <div>
                <p className="m-entity-card-name">{c.materia}</p>
                <p className="m-entity-card-sub">{c.estudiante} · {c.fecha}</p>
              </div>
              <span className={`cal-score${c.calificacion >= 9 ? ' cal-score--high' : c.calificacion < 6 ? ' cal-score--low' : ''}`}>
                {c.calificacion}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function DashboardMobile() {
  const user = authService.getCurrentUser();

  if (user?.tipo_usuario === 'padre') {
    return <DashboardPadreMobile user={user} />;
  }

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
