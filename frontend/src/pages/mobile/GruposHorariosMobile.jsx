import React, { useState, useEffect, useMemo } from 'react';
import * as gruposService from '../../services/gruposService';
import { IconSearch, IconCalendar } from '../../components/Icons';

function GruposHorariosMobile() {
  const [lista,   setLista]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [q,       setQ]       = useState('');

  useEffect(() => {
    gruposService.getHorarios().then(setLista).finally(() => setLoading(false));
  }, []);

  const filtrados = useMemo(() => {
    const lower = q.toLowerCase();
    return lista.filter((h) =>
      h.grupo.toLowerCase().includes(lower)    ||
      h.materia.toLowerCase().includes(lower)  ||
      h.docente.toLowerCase().includes(lower)
    );
  }, [lista, q]);

  return (
    <div className="m-page">
      <div className="m-searchbar">
        <IconSearch />
        <input
          className="m-searchbar-input"
          placeholder="Buscar grupo, materia o docente…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>

      <div className="m-list-header">
        <span className="m-list-count">{filtrados.length} horarios</span>
      </div>

      {loading ? (
        <p className="m-loading">Cargando…</p>
      ) : (
        <div className="m-card-list">
          {filtrados.map((h) => (
            <div key={h.id} className="m-entity-card">
              <div className="m-entity-card-header">
                <div>
                  <p className="m-entity-card-name">Grupo {h.grupo} — {h.materia}</p>
                  <p className="m-entity-card-sub">{h.docente}</p>
                </div>
                <span className={`badge ${h.estado === 'Activo' ? 'badge--active' : 'badge--inactive'}`}>
                  {h.estado}
                </span>
              </div>
              <div className="m-entity-card-row">
                <IconCalendar style={{ width: '1em', height: '1em', marginRight: '4px' }} />
                <span>{h.dia} · {h.horaInicio} – {h.horaFin} · Aula {h.aula}</span>
              </div>
            </div>
          ))}
          {filtrados.length === 0 && <p className="m-empty">Sin resultados para "{q}"</p>}
        </div>
      )}
    </div>
  );
}

export default GruposHorariosMobile;
