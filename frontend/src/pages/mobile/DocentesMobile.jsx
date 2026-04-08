import React, { useState, useEffect, useMemo } from 'react';
import Shimmer from '../../components/Shimmer';
import * as docentesService from '../../services/docentesService';
import { downloadCSV } from '../../utils/exportUtils';
import { IconSearch, IconDownload } from '../../components/Icons';

function DocentesMobile() {
  const [lista,   setLista]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [q,       setQ]       = useState('');

  useEffect(() => {
    docentesService.getDocentes().then(setLista).finally(() => setLoading(false));
  }, []);

  const filtrados = useMemo(() => {
    const lower = q.toLowerCase();
    return lista.filter((d) =>
      d.nombre.toLowerCase().includes(lower) ||
      d.departamento.toLowerCase().includes(lower)
    );
  }, [lista, q]);

  const handleExport = () => {
    downloadCSV(
      filtrados,
      [
        { key: 'id',           label: 'ID'           },
        { key: 'nombre',       label: 'Nombre'       },
        { key: 'departamento', label: 'Departamento' },
        { key: 'estado',       label: 'Estado'       },
        { key: 'fechaIngreso', label: 'Ingreso'      },
      ],
      `docentes-${new Date().toISOString().slice(0, 10)}.csv`
    );
  };

  return (
    <div className="m-page">
      <div className="m-searchbar">
        <IconSearch />
        <input
          className="m-searchbar-input"
          placeholder="Buscar docente o departamento…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>

      <div className="m-list-header">
        <span className="m-list-count">{filtrados.length} docentes</span>
        <button className="btn btn--outline btn--sm" onClick={handleExport}>
          <IconDownload /> Exportar
        </button>
      </div>

      {loading ? (
        <Shimmer variant="mobile-list" rows={6} />
      ) : (
        <div className="m-card-list">
          {filtrados.map((d) => (
            <div key={d.id} className="m-entity-card">
              <div className="m-entity-card-header">
                <div>
                  <p className="m-entity-card-name">{d.nombre}</p>
                  <p className="m-entity-card-sub">{d.departamento} · {d.email}</p>
                </div>
                <span className={`badge ${d.estado === 'Activo' ? 'badge--active' : 'badge--inactive'}`}>
                  {d.estado}
                </span>
              </div>
              <div className="m-entity-card-row" style={{ fontSize: '0.8rem', color: '#6B7C74' }}>
                Ingreso: {d.fechaIngreso} · Tel: {d.telefono}
              </div>
              <div className="m-entity-card-row" style={{ fontSize: '0.8rem' }}>
                Materias: {(d.materias ?? []).join(', ')}
              </div>
            </div>
          ))}
          {filtrados.length === 0 && <p className="m-empty">Sin resultados para "{q}"</p>}
        </div>
      )}
    </div>
  );
}

export default DocentesMobile;
