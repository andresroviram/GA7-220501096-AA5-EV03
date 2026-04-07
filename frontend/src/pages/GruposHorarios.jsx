import React, { useState, useMemo, useEffect } from 'react';
import {
  estadisticasGrupos,
  GRUPOS_LIST,
  DIAS_LIST,
  AULAS_LIST,
  HORAS_LIST,
} from '../data/mockGrupos';
import { materias as MATERIAS_LIST_RAW } from '../data/mockMaterias';
import { docentes as DOCENTES_LIST_RAW } from '../data/mockDocentes';
import * as gruposService from '../services/gruposService';

const MATERIAS = MATERIAS_LIST_RAW.map((m) => m.nombre);
const DOCENTES = DOCENTES_LIST_RAW.map((d) => d.nombre);

/* ─── Íconos ── */
const IconEdit = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
);
const IconTrash = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/>
    <path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/>
  </svg>
);
const IconPlus = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
);
const IconSearch = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);
const IconClose = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);
const IconWarn = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
    <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
  </svg>
);

/* ─── Modal Horario ── */
function ModalHorario({ item, onSave, onCancel }) {
  const isEdit = !!item;
  const [form, setForm] = useState({
    grupo:      item?.grupo      || '',
    materia:    item?.materia    || '',
    docente:    item?.docente    || '',
    dia:        item?.dia        || '',
    horaInicio: item?.horaInicio || '',
    horaFin:    item?.horaFin    || '',
    aula:       item?.aula       || '',
  });
  const set = (f, v) => setForm((p) => ({ ...p, [f]: v }));

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-form" onClick={(e) => e.stopPropagation()}>
        <div className="modal-form-header">
          <h2 className="modal-form-title">{isEdit ? 'Editar Horario' : 'Registrar Horario'}</h2>
          <button className="modal-close" onClick={onCancel}><IconClose /></button>
        </div>
        <div className="modal-form-body">
          <div className="modal-grid">
            <div className="modal-field">
              <label className="modal-label">Grupo</label>
              <select className="modal-select" value={form.grupo} onChange={(e) => set('grupo', e.target.value)}>
                <option value="">Seleccionar grupo</option>
                {GRUPOS_LIST.map((g) => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
            <div className="modal-field">
              <label className="modal-label">Materia</label>
              <select className="modal-select" value={form.materia} onChange={(e) => set('materia', e.target.value)}>
                <option value="">Seleccionar materia</option>
                {MATERIAS.map((m) => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
            <div className="modal-field modal-field--full">
              <label className="modal-label">Docente</label>
              <select className="modal-select" value={form.docente} onChange={(e) => set('docente', e.target.value)}>
                <option value="">Seleccionar docente</option>
                {DOCENTES.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div className="modal-field">
              <label className="modal-label">Día</label>
              <select className="modal-select" value={form.dia} onChange={(e) => set('dia', e.target.value)}>
                <option value="">Seleccionar día</option>
                {DIAS_LIST.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div className="modal-field">
              <label className="modal-label">Aula</label>
              <select className="modal-select" value={form.aula} onChange={(e) => set('aula', e.target.value)}>
                <option value="">Seleccionar aula</option>
                {AULAS_LIST.map((a) => <option key={a} value={a}>{a}</option>)}
              </select>
            </div>
            <div className="modal-field">
              <label className="modal-label">Hora inicio</label>
              <select className="modal-select" value={form.horaInicio} onChange={(e) => set('horaInicio', e.target.value)}>
                <option value="">--:--</option>
                {HORAS_LIST.map((h) => <option key={h} value={h}>{h}</option>)}
              </select>
            </div>
            <div className="modal-field">
              <label className="modal-label">Hora fin</label>
              <select className="modal-select" value={form.horaFin} onChange={(e) => set('horaFin', e.target.value)}>
                <option value="">--:--</option>
                {HORAS_LIST.map((h) => <option key={h} value={h}>{h}</option>)}
              </select>
            </div>
          </div>
        </div>
        <div className="modal-form-footer">
          <button className="btn btn--outline" onClick={onCancel}>Cancelar</button>
          <button className="btn btn--primary" onClick={() => onSave(form)}>
            {isEdit ? 'Actualizar' : 'Registrar'}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Componente principal ── */
let nextId = 100;

function GruposHorarios() {
  const [lista,       setLista]       = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [filtroGrupo, setFiltroGrupo] = useState('');
  const [filtroDia,   setFiltroDia]   = useState('');
  const [busqueda,    setBusqueda]    = useState({ grupo: '', dia: '' });
  const [modalForm,   setModalForm]   = useState(null);

  useEffect(() => {
    gruposService.getHorarios()
      .then((data) => { setLista(data); nextId = data.length + 100; })
      .finally(() => setLoading(false));
  }, []);

  const listaFiltrada = useMemo(() =>
    lista.filter((h) => {
      const mg = !busqueda.grupo || h.grupo === busqueda.grupo;
      const md = !busqueda.dia   || h.dia   === busqueda.dia;
      return mg && md;
    }), [lista, busqueda]);

  const handleBuscar  = () => setBusqueda({ grupo: filtroGrupo, dia: filtroDia });
  const handleLimpiar = () => { setFiltroGrupo(''); setFiltroDia(''); setBusqueda({ grupo: '', dia: '' }); };

  const handleSave = (form) => {
    if (modalForm?.isCreate) {
      setLista((p) => [...p, { ...form, id: nextId++, estado: 'Activo' }]);
    } else {
      setLista((p) => p.map((h) => h.id === modalForm.item.id ? { ...h, ...form } : h));
    }
    setModalForm(null);
  };

  const handleDelete = (id) => setLista((p) => p.filter((h) => h.id !== id));

  const conflictos = lista.filter((h) => h.estado === 'Conflicto').length;

  /* Stats dinámicos */
  const grupos     = [...new Set(lista.map((h) => h.grupo))].length;
  const aulasEnUso = [...new Set(lista.map((h) => h.aula))].length;

  return (
    <div className="module-page">
      {modalForm && (
        <ModalHorario
          item={modalForm.isCreate ? null : modalForm.item}
          onSave={handleSave}
          onCancel={() => setModalForm(null)}
        />
      )}

      {/* Alerta de conflictos */}
      {conflictos > 0 && (
        <div className="alert-card alert-card--warn">
          <IconWarn />
          <span>Se detectaron <strong>{conflictos}</strong> conflicto{conflictos > 1 ? 's' : ''} de horario. Revisa los registros marcados.</span>
        </div>
      )}

      {/* Filtros */}
      <div className="filter-card">
        <h3 className="filter-title">Filtros de Búsqueda</h3>
        <div className="filter-row">
          <div className="filter-field">
            <label className="filter-label">Grupo</label>
            <select className="filter-select" value={filtroGrupo} onChange={(e) => setFiltroGrupo(e.target.value)}>
              <option value="">Todos los grupos</option>
              {GRUPOS_LIST.map((g) => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>
          <div className="filter-field">
            <label className="filter-label">Día</label>
            <select className="filter-select" value={filtroDia} onChange={(e) => setFiltroDia(e.target.value)}>
              <option value="">Todos los días</option>
              {DIAS_LIST.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          <div className="filter-actions">
            <button className="btn btn--primary" onClick={handleBuscar}><IconSearch /> Buscar</button>
            <button className="btn btn--outline" onClick={handleLimpiar}>Limpiar</button>
          </div>
        </div>
      </div>

      {/* Tabla */}
      <div className="table-card">
        <div className="table-header">
          <h3 className="table-title">Horarios Registrados</h3>
          <div className="table-header-actions">
            <button className="btn btn--primary" onClick={() => setModalForm({ isCreate: true })}>
              <IconPlus /> Registrar Horario
            </button>
          </div>
        </div>
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Grupo</th>
                <th>Materia</th>
                <th>Docente</th>
                <th>Día</th>
                <th>Horario</th>
                <th>Aula</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {listaFiltrada.map((h) => (
                <tr key={h.id}>
                  <td className="td-id">{h.id}</td>
                  <td><span className="badge badge--grupo">{h.grupo}</span></td>
                  <td className="td-name">{h.materia}</td>
                  <td style={{ fontSize: '0.84rem' }}>{h.docente}</td>
                  <td>{h.dia}</td>
                  <td style={{ whiteSpace: 'nowrap' }}>{h.horaInicio} – {h.horaFin}</td>
                  <td><span className="badge badge--aula">{h.aula}</span></td>
                  <td>
                    {h.estado === 'Conflicto'
                      ? <span className="badge badge--suspended"><IconWarn /> Conflicto</span>
                      : <span className="badge badge--active">✓ Activo</span>}
                  </td>
                  <td className="td-actions">
                    <button className="action-btn action-btn--edit" title="Editar" onClick={() => setModalForm({ item: h })}>
                      <IconEdit />
                    </button>
                    <button className="action-btn action-btn--remove" title="Eliminar" onClick={() => handleDelete(h.id)}>
                      <IconTrash />
                    </button>
                  </td>
                </tr>
              ))}
              {listaFiltrada.length === 0 && (
                <tr><td colSpan={9} className="table-empty">No se encontraron horarios con los filtros seleccionados.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Stats inferiores */}
      <div className="widgets-row">
        <div className="widget-card">
          <h3 className="widget-title">Resumen del Sistema</h3>
          <div className="stats-list">
            <div className="stats-list-row">
              <span className="stats-list-label">Total de Horarios</span>
              <span className="stats-list-value stats-list-value--neutral">{lista.length}</span>
            </div>
            <div className="stats-list-row">
              <span className="stats-list-label">Grupos con Horario</span>
              <span className="stats-list-value stats-list-value--active">{grupos}</span>
            </div>
            <div className="stats-list-row">
              <span className="stats-list-label">Aulas en Uso</span>
              <span className="stats-list-value stats-list-value--neutral">{aulasEnUso}</span>
            </div>
            <div className="stats-list-row">
              <span className="stats-list-label">Conflictos Detectados</span>
              <span className={`stats-list-value ${conflictos > 0 ? 'stats-list-value--inactive' : 'stats-list-value--neutral'}`}>{conflictos}</span>
            </div>
          </div>
        </div>

        <div className="widget-card">
          <h3 className="widget-title">Horarios por Día</h3>
          <div className="dept-bar-list">
            {DIAS_LIST.map((dia) => {
              const total = lista.filter((h) => h.dia === dia).length;
              const max   = Math.max(...DIAS_LIST.map((d) => lista.filter((h) => h.dia === d).length), 1);
              return (
                <div key={dia} className="dept-bar-row">
                  <span className="dept-bar-label">{dia}</span>
                  <div className="dept-bar-track">
                    <div className="dept-bar-fill" style={{ width: `${(total / max) * 100}%` }} />
                  </div>
                  <span className="dept-bar-value">{total}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default GruposHorarios;
