import React, { useState, useEffect } from 'react';
import * as reportesService from '../../services/reportesService';
import * as estudiantesService from '../../services/estudiantesService';
import { getSessionUser, getPadreId } from '../../utils/sessionUser';
import Button from '../../components/ui/Button';
import Shimmer from '../../components/Shimmer';

import {
  IconDownload, IconFile, IconCheckCircle, IconUsers, IconBarChart, IconCalendar, IconGrid,
} from '../../components/Icons';

const ICON_MAP = {
  file: <IconFile />,
  check: <IconCheckCircle />,
  users: <IconUsers />,
  chart: <IconBarChart />,
  calendar: <IconCalendar />,
  grid: <IconGrid />,
};

const GRUPOS  = ['', '1A', '1B', '1C', '2A', '2B', '2C', '3A', '3B'];
const PERIODO = ['', '2024-I', '2024-II', '2025-I'];

/* ─── Tarjeta de tipo de reporte ── */
function ReporteCard({ tipo, gruposPadre }) {
  const [grupo,   setGrupo]   = useState('');
  const [periodo, setPeriodo] = useState('');
  const [loading, setLoading] = useState(null);

  // Si hay grupos restringidos (padre), reiniciar selección si el valor ya no aplica
  const gruposDisponibles = gruposPadre ?? GRUPOS;

  const handleGenerar = async (fmt) => {
    setLoading(fmt);
    try {
      await reportesService.generarReporte(tipo.id, fmt, { grupo, periodo });
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="reporte-card">
      <div className="reporte-card-icon">{ICON_MAP[tipo.icono] || <IconFile />}</div>
      <div className="reporte-card-body">
        <h3 className="reporte-card-title">{tipo.titulo}</h3>
        <p className="reporte-card-desc">{tipo.descripcion}</p>
        <div className="reporte-card-filters">
          {tipo.filtros.includes('grupo') && (
            <select className="filter-select" style={{ flex: 1, minWidth: '100px' }} value={grupo} onChange={(e) => setGrupo(e.target.value)}>
              <option value="">Todos los grupos</option>
              {gruposDisponibles.filter(Boolean).map((g) => <option key={g} value={g}>{g}</option>)}
            </select>
          )}
          {tipo.filtros.includes('periodo') && (
            <select className="filter-select" style={{ flex: 1, minWidth: '100px' }} value={periodo} onChange={(e) => setPeriodo(e.target.value)}>
              <option value="">Todos los periodos</option>
              {PERIODO.filter(Boolean).map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
          )}
        </div>
        <div className="reporte-card-btns">
          <button className="btn btn--pdf" onClick={() => handleGenerar('pdf')} disabled={loading === 'pdf'}>
            {loading === 'pdf' ? 'Generando…' : <><IconDownload /> PDF</>}
          </button>
          <button className="btn btn--excel" onClick={() => handleGenerar('excel')} disabled={loading === 'excel'}>
            {loading === 'excel' ? 'Generando…' : <><IconDownload /> Excel</>}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Componente principal ── */
function Reportes() {
  const esPadre = getSessionUser()?.tipo_usuario === 'padre';
  const [tipos,     setTipos]     = useState([]);
  const [recientes, setRecientes] = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [gruposPadre, setGruposPadre] = useState(null);

  useEffect(() => {
    const carga = [reportesService.getTiposReporte(), reportesService.getReportesRecientes()];
    if (esPadre) carga.push(estudiantesService.getEstudiantes());
    Promise.all(carga).then(([t, r, alumnos]) => {
      setTipos(t);
      setRecientes(r);
      if (esPadre && alumnos) {
        setGruposPadre([...new Set(alumnos.map((a) => a.grupo).filter(Boolean))]);
      }
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return <Shimmer variant="table" rows={4} />;

  return (
    <div className="module-page">
      <div className="reporte-section">
        <h3 className="section-heading">Generar Reportes</h3>
        <p className="section-sub">Selecciona el tipo de reporte, aplica los filtros y descarga en el formato requerido.</p>
        <div className="reporte-grid">
          {tipos.map((t) => <ReporteCard key={t.id} tipo={t} gruposPadre={gruposPadre} />)}
        </div>
      </div>

      <div className="table-card">
        <div className="table-header">
          <h3 className="table-title">Reportes Recientes</h3>
        </div>
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Tipo</th>
                <th>Descripción</th>
                <th>Fecha</th>
                <th>Generado por</th>
                <th>Formato</th>
                <th>Descargar</th>
              </tr>
            </thead>
            <tbody>
              {recientes.map((r) => (
                <tr key={r.id}>
                  <td><span className="badge badge--neutral">{r.tipo}</span></td>
                  <td style={{ fontSize: '0.84rem' }}>{r.descripcion}</td>
                  <td style={{ fontSize: '0.84rem', whiteSpace: 'nowrap' }}>{r.fecha}</td>
                  <td style={{ fontSize: '0.84rem' }}>{r.generadoPor}</td>
                  <td>
                    <span className={`badge ${r.formato === 'PDF' ? 'badge--pdf' : 'badge--excel'}`}>{r.formato}</span>
                  </td>
                  <td>
                    <Button variant="secondary" size="sm" onClick={() => reportesService.descargarReporte(r)} leftIcon={<IconDownload />}>
                      Descargar
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Reportes;
