import React, { useState, useEffect } from 'react';
import * as reportesService from '../../services/reportesService';
import { IconDownload, IconFile } from '../../components/Icons';
import Shimmer from '../../components/Shimmer';

const ICON_MAP = { file: '📄', check: '✅', users: '👥', chart: '📊', calendar: '📅', grid: '🗂️' };

function ReportesMobile() {
  const [tipos,    setTipos]    = useState([]);
  const [recientes, setRecientes] = useState([]);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    Promise.all([
      reportesService.getTiposReporte(),
      reportesService.getReportesRecientes(),
    ]).then(([t, r]) => {
      setTipos(t);
      setRecientes(r);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return <Shimmer variant="mobile-list" rows={4} />;

  return (
    <div className="m-page">

      <h3 className="m-section-title">Generar Reporte</h3>
      <div className="m-card-list">
        {tipos.map((t) => (
          <MobileReporteCard key={t.id} tipo={t} />
        ))}
      </div>

      {recientes.length > 0 && (
        <>
          <h3 className="m-section-title" style={{ marginTop: '1.5rem' }}>Recientes</h3>
          <div className="m-card-list">
            {recientes.map((r) => (
              <div key={r.id} className="m-entity-card">
                <div className="m-entity-card-header">
                  <div>
                    <p className="m-entity-card-name">{r.tipo}</p>
                    <p className="m-entity-card-sub">{r.descripcion}</p>
                  </div>
                  <span className={`badge ${r.formato === 'PDF' ? 'badge--pdf' : 'badge--excel'}`}>
                    {r.formato}
                  </span>
                </div>
                <div className="m-entity-card-actions">
                  <button
                    className="btn btn--outline btn--sm"
                    onClick={() => reportesService.descargarReporte(r)}
                  >
                    <IconDownload /> Descargar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function MobileReporteCard({ tipo }) {
  const [loading, setLoading] = useState(null);

  const handleGenerar = async (fmt) => {
    setLoading(fmt);
    try {
      await reportesService.generarReporte(tipo.id, fmt);
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="m-entity-card">
      <div className="m-entity-card-header">
        <div>
          <p className="m-entity-card-name">{tipo.titulo}</p>
          <p className="m-entity-card-sub">{tipo.descripcion}</p>
        </div>
        <span style={{ fontSize: '1.5rem' }}>{ICON_MAP[tipo.icono] ?? '📄'}</span>
      </div>
      <div className="m-entity-card-actions">
        <button
          className="btn btn--pdf btn--sm"
          onClick={() => handleGenerar('pdf')}
          disabled={loading === 'pdf'}
        >
          <IconDownload /> {loading === 'pdf' ? '…' : 'PDF'}
        </button>
        <button
          className="btn btn--excel btn--sm"
          onClick={() => handleGenerar('excel')}
          disabled={loading === 'excel'}
        >
          <IconDownload /> {loading === 'excel' ? '…' : 'Excel'}
        </button>
      </div>
    </div>
  );
}

export default ReportesMobile;
