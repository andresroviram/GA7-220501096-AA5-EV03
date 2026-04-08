import React, { useEffect, useState } from 'react';
import StatCard from '../../components/StatCard';
import TopStudents from '../../components/TopStudents';
import GroupAverageChart from '../../components/GroupAverageChart';
import AcademicPerformanceChart from '../../components/AcademicPerformanceChart';
import GradeDistributionChart from '../../components/GradeDistributionChart';
import { stats } from '../../data/mockDashboard';
import { IconGradCap, IconUsers, IconBook, IconCalendar, IconBarChart } from '../../components/Icons';
import { getSessionUser } from '../../utils/sessionUser';
import * as estudiantesService from '../../services/estudiantesService';
import * as calificacionesService from '../../services/calificacionesService';

const STAT_ICONS = [<IconGradCap />, <IconUsers />, <IconBook />, <IconCalendar />];

/* ─── Vista específica para padre/acudiente ───────────────────────────── */
function DashboardPadre({ user }) {
  const [hijos,  setHijos]  = useState([]);
  const [califs, setCalifs] = useState([]);

  useEffect(() => {
    estudiantesService.getEstudiantes().then(setHijos).catch(() => {});
    calificacionesService.getCalificaciones().then(setCalifs).catch(() => {});
  }, []);

  const promedio = hijos.length
    ? (hijos.reduce((s, e) => s + e.promedio, 0) / hijos.length).toFixed(1)
    : '—';
  const aprobados = califs.filter((c) => c.calificacion >= 6).length;

  const padreStats = [
    { id: 1, label: 'Estudiantes a mi cargo',  value: hijos.length,   icon: <IconGradCap /> },
    { id: 2, label: 'Promedio general',        value: promedio,       icon: <IconBarChart /> },
    { id: 3, label: 'Calificaciones totales',  value: califs.length,  icon: <IconBook /> },
    { id: 4, label: 'Calificaciones aprobadas', value: aprobados,     icon: <IconCalendar /> },
  ];

  return (
    <div className="dashboard">

      {/* Saludo personalizado */}
      <div className="page-header" style={{ marginBottom: '1.5rem' }}>
        <div className="page-header-left">
          <h1 className="page-title">Bienvenido, {user.nombre}</h1>
          <p className="page-subtitle">
            Estás viendo los datos de tus {hijos.length} estudiante{hijos.length !== 1 ? 's' : ''} a cargo.
          </p>
        </div>
      </div>

      {/* Stats de los hijos */}
      <div className="stats-grid">
        {padreStats.map((s) => (
          <StatCard key={s.id} label={s.label} value={s.value} icon={s.icon} />
        ))}
      </div>

      {/* Tabla de hijos */}
      <div className="table-card">
        <div className="table-header">
          <h3 className="table-title">Mis Estudiantes</h3>
        </div>
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Matrícula</th>
                <th>Nombre</th>
                <th>Grupo</th>
                <th>Promedio</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {hijos.map((e) => (
                <tr key={e.id}>
                  <td className="td-id">{e.id}</td>
                  <td className="td-name">{e.nombre}</td>
                  <td><span className="badge badge--grupo">{e.grupo}</span></td>
                  <td><strong>{e.promedio}</strong></td>
                  <td>
                    <span className={`badge ${e.estado === 'Activo' ? 'badge--active' : 'badge--suspended'}`}>
                      {e.estado}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Calificaciones recientes */}
      <div className="table-card">
        <div className="table-header">
          <h3 className="table-title">Calificaciones Recientes</h3>
        </div>
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Estudiante</th>
                <th>Materia</th>
                <th>Grupo</th>
                <th>Calificación</th>
                <th>Fecha</th>
              </tr>
            </thead>
            <tbody>
              {califs.map((c) => (
                <tr key={c.id}>
                  <td>{c.estudiante}</td>
                  <td>{c.materia}</td>
                  <td><span className="badge badge--grupo">{c.grupo}</span></td>
                  <td>
                    <span className={`cal-score${c.calificacion >= 9 ? ' cal-score--high' : c.calificacion < 6 ? ' cal-score--low' : ''}`}>
                      {c.calificacion}
                    </span>
                  </td>
                  <td style={{ fontSize: '0.84rem' }}>{c.fecha}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Gráficas generales */}
      <div className="widgets-row">
        <AcademicPerformanceChart />
        <GradeDistributionChart />
      </div>
    </div>
  );
}

/* ─── Dashboard general (admin / docente) ──────────────────────────── */
function Dashboard() {
  const user = getSessionUser();

  if (user?.tipo_usuario === 'padre') {
    return <DashboardPadre user={user} />;
  }

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
