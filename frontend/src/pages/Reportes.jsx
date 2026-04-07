import React, { useState, useEffect } from 'react';
import * as reportesService from '../services/reportesService';

/* ─── Íconos ── */
const IconDownload = () => (<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>);
const IconFile     = () => (<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>);
const IconCheck    = () => (<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>);
const IconUsers    = () => (<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>);
const IconChart    = () => (<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6"  y1="20" x2="6"  y2="14"/></svg>);
const IconCalendar = () => (<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8"  y1="2" x2="8"  y2="6"/><line x1="3"  y1="10" x2="21" y2="10"/></svg>);
const IconGrid     = () => (<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>);

const ICON_MAP = { file: <IconFile />, check: <IconCheck />, users: <IconUsers />, chart: <IconChart />, calendar: <IconCalendar />, grid: <IconGrid /> };

const GRUPOS  = ['', '1A', '1B', '1C', '2A', '2B', '2C', '3A', '3B'];
const PERIODO = ['', '2024-I', '2024-II', '2025-I'];

/* ─── Tarjeta de tipo de reporte ── */
function ReporteCard({ tipo }) {
  const [grupo,   setGrupo]   = useState('');
  const [periodo, setPeriodo] = useState('');
  const [loading, setLoading] = useState(null);

  const handleGenerar = (fmt) => {
    setLoading(fmt);
    setTimeout(() => {
      setLoading(null);
      alert(`Reporte "${tipo.titulo}" en formato ${fmt.toUpperCase()} generado.\n(Integración backend pendiente)`);
    }, 800);
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
              {GRUPOS.filter(Boolean).map((g) => <option key={g} value={g}>{g}</option>)}
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
  const [tipos,    setTipos]    = useState([]);
  const [recientes, setRecientes] = useState([]);

  useEffect(() => {
    reportesService.getTiposReporte().then(setTipos);
    reportesService.getReportesRecientes().then(setRecientes);
  }, []);

  return (
    <div className="module-page">
      <div className="reporte-section">
        <h3 className="section-heading">Generar Reportes</h3>
        <p className="section-sub">Selecciona el tipo de reporte, aplica los filtros y descarga en el formato requerido.</p>
        <div className="reporte-grid">
          {tipos.map((t) => <ReporteCard key={t.id} tipo={t} />)}
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
                    <button className="btn btn--outline btn--sm" onClick={() => alert('Descarga simulada (backend pendiente)')}>
                      <IconDownload /> Descargar
                    </button>
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
