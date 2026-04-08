import React, { useState, useEffect, useMemo } from 'react';
import Shimmer from '../../components/Shimmer';
import * as materiasService from '../../services/materiasService';
import { IconSearch, IconBook } from '../../components/Icons';

function MateriasMobile() {
  const [lista,   setLista]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [q,       setQ]       = useState('');

  useEffect(() => {
    materiasService.getMaterias().then(setLista).finally(() => setLoading(false));
  }, []);

  const filtrados = useMemo(() => {
    const lower = q.toLowerCase();
    return lista.filter((m) =>
      m.nombre.toLowerCase().includes(lower)       ||
      m.departamento.toLowerCase().includes(lower) ||
      (m.docente ?? '').toLowerCase().includes(lower)
    );
  }, [lista, q]);

  return (
    <div className="m-page">
      <div className="m-searchbar">
        <IconSearch />
        <input
          className="m-searchbar-input"
          placeholder="Buscar materia, departamento o docente…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>

      <div className="m-list-header">
        <span className="m-list-count">{filtrados.length} materias</span>
      </div>

      {loading ? (
        <Shimmer variant="mobile-list" rows={6} />
      ) : (
        <div className="m-card-list">
          {filtrados.map((m) => (
            <div key={m.id} className="m-entity-card">
              <div className="m-entity-card-header">
                <div>
                  <p className="m-entity-card-name">{m.nombre}</p>
                  <p className="m-entity-card-sub">{m.departamento}</p>
                </div>
                <span className={`badge ${m.estado === 'Activa' ? 'badge--active' : 'badge--inactive'}`}>
                  {m.estado}
                </span>
              </div>
              <div className="m-entity-card-row" style={{ fontSize: '0.8rem', color: '#6B7C74' }}>
                <IconBook style={{ width: '1em', height: '1em', marginRight: '4px' }} />
                Docente: {m.docente ?? '—'} · Créditos: {m.creditos ?? '—'}
              </div>
              {m.grupos?.length > 0 && (
                <div className="m-entity-card-row" style={{ flexWrap: 'wrap', gap: '4px' }}>
                  {m.grupos.map((g) => (
                    <span key={g} className="badge badge--neutral" style={{ fontSize: '0.72rem' }}>{g}</span>
                  ))}
                </div>
              )}
            </div>
          ))}
          {filtrados.length === 0 && <p className="m-empty">Sin resultados para "{q}"</p>}
        </div>
      )}
    </div>
  );
}

export default MateriasMobile;
