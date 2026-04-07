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
import Button from '../components/ui/Button';
import {
  IconEdit, IconTrash, IconPlus, IconSearch, IconClose,
  IconAlertTriangle as IconWarn, IconCheck,
  IconBarChart, IconCalendar,
} from '../components/Icons';

const MATERIAS = MATERIAS_LIST_RAW.map((m) => m.nombre);
const DOCENTES = DOCENTES_LIST_RAW.map((d) => d.nombre);

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
    activo:     item ? item.estado !== 'Inactivo' : true,
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
            {isEdit && (
              <div className="modal-field modal-field--full">
                <label className="modal-label">Estado del horario</label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={form.activo}
                    onChange={(e) => set('activo', e.target.checked)}
                    style={{ width: 16, height: 16, accentColor: 'var(--color-primary, #4f46e5)', cursor: 'pointer' }}
                  />
                  <span style={{ fontSize: '0.875rem' }}>{form.activo ? 'Activo' : 'Inactivo'}</span>
                </label>
              </div>
            )}
          </div>
        </div>
        <div className="modal-form-footer">
          <Button variant="secondary" onClick={onCancel}>Cancelar</Button>
          <Button variant="primary" onClick={() => onSave(form)}>
            {isEdit ? 'Actualizar' : 'Registrar'}
          </Button>
        </div>
      </div>
    </div>
  );
}

/* ─── Detección de conflictos ── */
function overlapsTime(s1, e1, s2, e2) { return s1 < e2 && s2 < e1; }

function detectarConflictos(lista) {
  const activos = lista.filter((h) => h.estado !== 'Inactivo');
  const motivosMap = new Map();

  for (let i = 0; i < activos.length; i++) {
    for (let j = i + 1; j < activos.length; j++) {
      const a = activos[i];
      const b = activos[j];
      if (a.dia !== b.dia) continue;
      if (!overlapsTime(a.horaInicio, a.horaFin, b.horaInicio, b.horaFin)) continue;
      if (a.aula && a.aula === b.aula) {
        const msg = `${a.aula} ya ocupada (${a.dia} ${a.horaInicio}–${a.horaFin})`;
        if (!motivosMap.has(a.id)) motivosMap.set(a.id, msg);
        if (!motivosMap.has(b.id)) motivosMap.set(b.id, msg);
      }
      if (a.docente && a.docente === b.docente) {
        const msg = `${a.docente} ya tiene clase (${a.dia} ${a.horaInicio}–${a.horaFin})`;
        if (!motivosMap.has(a.id)) motivosMap.set(a.id, msg);
        if (!motivosMap.has(b.id)) motivosMap.set(b.id, msg);
      }
    }
  }

  return lista.map((h) => {
    if (h.estado === 'Inactivo') return h;
    const motivo = motivosMap.get(h.id) ?? null;
    return { ...h, estado: motivo ? 'Conflicto' : 'Activo', motivoConflicto: motivo };
  });
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
      .then((data) => { setLista(detectarConflictos(data)); nextId = data.length + 100; })
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
    const { activo, ...rest } = form;
    const estadoManual = activo === false ? 'Inactivo' : 'Activo';
    let newLista;
    if (modalForm?.isCreate) {
      newLista = [...lista, { ...rest, id: nextId++, estado: estadoManual }];
    } else {
      newLista = lista.map((h) => h.id === modalForm.item.id ? { ...h, ...rest, estado: estadoManual } : h);
    }
    setLista(detectarConflictos(newLista));
    setModalForm(null);
  };

  const handleDelete = (id) => setLista(detectarConflictos(lista.filter((h) => h.id !== id)));

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
            <Button variant="primary" onClick={handleBuscar} leftIcon={<IconSearch />}>Buscar</Button>
            <Button variant="secondary" onClick={handleLimpiar}>Limpiar</Button>
          </div>
        </div>
      </div>

      {/* Tabla */}
      <div className="table-card">
        <div className="table-header">
          <h3 className="table-title">Horarios Registrados</h3>
          <div className="table-header-actions">
            <Button variant="primary" onClick={() => setModalForm({ isCreate: true })} leftIcon={<IconPlus />}>
              Registrar Horario
            </Button>
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
                      ? <span className="badge badge--suspended" title={h.motivoConflicto || 'Conflicto de horario'}><IconWarn /> Conflicto</span>
                      : h.estado === 'Inactivo'
                      ? <span className="badge" style={{ background: '#f1f5f9', color: '#64748b' }}>Inactivo</span>
                      : <span className="badge badge--active"><IconCheck /> Activo</span>}
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
          <h3 className="widget-title"><IconBarChart /> Resumen del Sistema</h3>
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
          <h3 className="widget-title"><IconCalendar /> Horarios por Día</h3>
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
