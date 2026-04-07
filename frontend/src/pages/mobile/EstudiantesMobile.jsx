import React, { useState, useEffect, useMemo } from 'react';
import * as estudiantesService from '../../services/estudiantesService';
import { downloadCSV } from '../../utils/exportUtils';
import { IconSearch, IconDownload, IconUserMinus, IconUserPlus } from '../../components/Icons';

function EstadoBadge({ estado }) {
  const cls =
    estado === 'Activo'     ? 'badge badge--active'    :
    estado === 'Suspendido' ? 'badge badge--suspended' :
                              'badge badge--inactive';
  return <span className={cls}>{estado}</span>;
}

function EstudiantesMobile() {
  const [lista,    setLista]    = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [q,        setQ]        = useState('');

  useEffect(() => {
    estudiantesService.getEstudiantes()
      .then(setLista)
      .finally(() => setLoading(false));
  }, []);

  const filtrados = useMemo(() => {
    const lower = q.toLowerCase();
    return lista.filter((e) =>
      e.nombre.toLowerCase().includes(lower) ||
      e.grupo.toLowerCase().includes(lower)  ||
      e.id.toLowerCase().includes(lower)
    );
  }, [lista, q]);

  const handleToggleEstado = (est) => {
    setLista((prev) =>
      prev.map((e) =>
        e.id === est.id
          ? { ...e, estado: e.estado === 'Suspendido' ? 'Activo' : 'Suspendido' }
          : e
      )
    );
  };

  const handleExport = () => {
    downloadCSV(
      filtrados,
      [
        { key: 'id',       label: 'Matrícula' },
        { key: 'nombre',   label: 'Nombre'    },
        { key: 'grupo',    label: 'Grupo'     },
        { key: 'promedio', label: 'Promedio'  },
        { key: 'estado',   label: 'Estado'    },
      ],
      `estudiantes-${new Date().toISOString().slice(0, 10)}.csv`
    );
  };

  return (
    <div className="m-page">

      {/* Barra de búsqueda */}
      <div className="m-searchbar">
        <IconSearch />
        <input
          className="m-searchbar-input"
          placeholder="Buscar por nombre, grupo o matrícula…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>

      {/* Cabecera con conteo + exportar */}
      <div className="m-list-header">
        <span className="m-list-count">{filtrados.length} estudiantes</span>
        <button className="btn btn--outline btn--sm" onClick={handleExport}>
          <IconDownload /> Exportar
        </button>
      </div>

      {/* Lista de tarjetas */}
      {loading ? (
        <p className="m-loading">Cargando…</p>
      ) : (
        <div className="m-card-list">
          {filtrados.map((est) => (
            <div key={est.id} className="m-entity-card">
              <div className="m-entity-card-header">
                <div>
                  <p className="m-entity-card-name">{est.nombre}</p>
                  <p className="m-entity-card-sub">{est.id} · Grupo {est.grupo}</p>
                </div>
                <EstadoBadge estado={est.estado} />
              </div>
              <div className="m-entity-card-row">
                <span>Promedio: <strong>{est.promedio}</strong></span>
                <span>Edad: {est.edad} años</span>
              </div>
              <div className="m-entity-card-row" style={{ fontSize: '0.8rem', color: '#6B7C74' }}>
                Tutor: {est.tutor}
              </div>
              <div className="m-entity-card-actions">
                <button
                  className={`btn btn--sm ${est.estado === 'Suspendido' ? 'btn--primary' : 'btn--danger'}`}
                  onClick={() => handleToggleEstado(est)}
                >
                  {est.estado === 'Suspendido' ? <><IconUserPlus /> Reactivar</> : <><IconUserMinus /> Suspender</>}
                </button>
              </div>
            </div>
          ))}
          {filtrados.length === 0 && <p className="m-empty">Sin resultados para "{q}"</p>}
        </div>
      )}
    </div>
  );
}

export default EstudiantesMobile;
