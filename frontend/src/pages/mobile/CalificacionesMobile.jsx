import React, { useState, useEffect, useMemo } from 'react';
import * as calificacionesService from '../../services/calificacionesService';
import { downloadCSV } from '../../utils/exportUtils';
import { IconSearch, IconDownload } from '../../components/Icons';

function CalificacionesMobile() {
  const [lista,   setLista]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [q,       setQ]       = useState('');

  useEffect(() => {
    calificacionesService.getCalificaciones().then(setLista).finally(() => setLoading(false));
  }, []);

  const filtrados = useMemo(() => {
    const lower = q.toLowerCase();
    return lista.filter((c) =>
      c.estudiante.toLowerCase().includes(lower) ||
      c.materia.toLowerCase().includes(lower)    ||
      c.grupo.toLowerCase().includes(lower)
    );
  }, [lista, q]);

  const gradeBadge = (cal) => {
    if (cal >= 9)  return 'badge badge--active';
    if (cal >= 6)  return 'badge badge--neutral';
    return 'badge badge--suspended';
  };

  const handleExport = () => {
    downloadCSV(
      filtrados,
      [
        { key: 'id',           label: 'ID'           },
        { key: 'estudiante',   label: 'Estudiante'   },
        { key: 'materia',      label: 'Materia'      },
        { key: 'grupo',        label: 'Grupo'        },
        { key: 'calificacion', label: 'Calificación' },
        { key: 'fecha',        label: 'Fecha'        },
      ],
      `calificaciones-${new Date().toISOString().slice(0, 10)}.csv`
    );
  };

  return (
    <div className="m-page">
      <div className="m-searchbar">
        <IconSearch />
        <input
          className="m-searchbar-input"
          placeholder="Buscar por estudiante, materia o grupo…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>

      <div className="m-list-header">
        <span className="m-list-count">{filtrados.length} registros</span>
        <button className="btn btn--outline btn--sm" onClick={handleExport}>
          <IconDownload /> Exportar
        </button>
      </div>

      {loading ? (
        <p className="m-loading">Cargando…</p>
      ) : (
        <div className="m-card-list">
          {filtrados.map((c) => (
            <div key={c.id} className="m-entity-card">
              <div className="m-entity-card-header">
                <div>
                  <p className="m-entity-card-name">{c.estudiante}</p>
                  <p className="m-entity-card-sub">{c.materia} · Grupo {c.grupo}</p>
                </div>
                <span className={gradeBadge(c.calificacion)}>{c.calificacion}</span>
              </div>
              <div className="m-entity-card-row" style={{ fontSize: '0.8rem', color: '#6B7C74' }}>
                Fecha: {c.fecha}
              </div>
            </div>
          ))}
          {filtrados.length === 0 && <p className="m-empty">Sin resultados para "{q}"</p>}
        </div>
      )}
    </div>
  );
}

export default CalificacionesMobile;
