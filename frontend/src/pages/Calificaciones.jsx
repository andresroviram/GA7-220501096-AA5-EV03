import React, { useState, useMemo, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import {
  promediosPorGrupo,
  materias as MATERIAS_LIST,
  gruposSelect as GRUPOS_FILTER,
} from '../data/mockCalificaciones';
import * as calificacionesService from '../services/calificacionesService';

/* ─── Ícono editar ──────────────────────────────────────────────────────────── */
const IconEdit = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
);

const IconSearch = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);

const IconExport = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
    <polyline points="7 10 12 15 17 10"/>
    <line x1="12" y1="15" x2="12" y2="3"/>
  </svg>
);

const IconPlus = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
);

const IconClose = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

const IconCalendar = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
    <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/>
    <line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
);

/* ─── Grupos de la tabla ────────────────────────────────────────────────────── */
const GRUPOS_TABLA = ['1A','1B','1C','2A','2B','3A','3B','4A','4B','4C','5A','5B','6A'];

/* ─── Tooltip personalizado del chart ──────────────────────────────────────── */
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="chart-tooltip">
        <p className="chart-tooltip-label">{label}</p>
        <p className="chart-tooltip-value">Promedio: <strong>{payload[0].value}</strong></p>
      </div>
    );
  }
  return null;
};

/* ─── Modal de calificación (crear / editar) ────────────────────────────────── */
function ModalCalificacion({ item, onSave, onCancel }) {
  const isEdit = !!item;
  const [form, setForm] = useState({
    estudiante:  item?.estudiante  || '',
    materia:     item?.materia     || '',
    grupo:       item?.grupo       || '',
    calificacion: item?.calificacion ?? '',
    fecha:       item?.fecha       || '',
  });

  const set = (field, val) => setForm((f) => ({ ...f, [field]: val }));

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-form modal-form--narrow" onClick={(e) => e.stopPropagation()}>

        {/* Cabecera */}
        <div className="modal-form-header">
          <h2 className="modal-form-title">
            {isEdit ? 'Editar Calificación' : 'Registrar nueva calificación'}
          </h2>
          <button type="button" className="modal-close" onClick={onCancel}><IconClose /></button>
        </div>

        {/* Campos — columna única */}
        <div className="modal-form-body">
          <div className="modal-stack">

            <div className="modal-field">
              <label className="modal-label">Estudiante</label>
              <input
                className="modal-input"
                value={form.estudiante}
                onChange={(e) => set('estudiante', e.target.value)}
                placeholder="Nombre del estudiante"
              />
            </div>

            <div className="modal-field">
              <label className="modal-label">Materia</label>
              <select className="modal-select" value={form.materia} onChange={(e) => set('materia', e.target.value)}>
                <option value="">Seleccionar materia</option>
                {MATERIAS_LIST.map((m) => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>

            <div className="modal-field">
              <label className="modal-label">Grupo</label>
              <select className="modal-select" value={form.grupo} onChange={(e) => set('grupo', e.target.value)}>
                <option value="">Seleccionar grupo</option>
                {GRUPOS_TABLA.map((g) => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>

            <div className="modal-field">
              <label className="modal-label">Calificación</label>
              <input
                className="modal-input"
                type="number"
                step="0.1"
                min="0"
                max="10"
                value={form.calificacion}
                onChange={(e) => set('calificacion', e.target.value)}
                placeholder="0.0"
              />
            </div>

            <div className="modal-field">
              <label className="modal-label">Fecha de evaluación</label>
              <div className="input-date-wrapper">
                <input
                  className="modal-input modal-input--date"
                  type="date"
                  value={form.fecha}
                  onChange={(e) => set('fecha', e.target.value)}
                />
                <span className="input-date-icon"><IconCalendar /></span>
              </div>
            </div>

          </div>
        </div>

        {/* Pie */}
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

/* ─── Componente principal ──────────────────────────────────────────────────── */
let nextId = 1;

function Calificaciones() {
  const [lista,         setLista]         = useState([]);
  const [loading,       setLoading]       = useState(true);
  const [filtroMateria, setFiltroMateria] = useState('');
  const [filtroGrupo,   setFiltroGrupo]   = useState('');
  const [filtroFecha,   setFiltroFecha]   = useState('');
  const [busqueda,      setBusqueda]      = useState({ materia: '', grupo: '', fecha: '' });
  const [modalForm,     setModalForm]     = useState(null);

  useEffect(() => {
    calificacionesService.getCalificaciones()
      .then((data) => { setLista(data); nextId = data.length + 1; })
      .finally(() => setLoading(false));
  }, []);

  const listaFiltrada = useMemo(() => {
    return lista.filter((c) => {
      const matchM = !busqueda.materia || c.materia === busqueda.materia;
      const matchG = !busqueda.grupo  || c.grupo    === busqueda.grupo;
      const matchF = !busqueda.fecha  || c.fecha    === busqueda.fecha;
      return matchM && matchG && matchF;
    });
  }, [lista, busqueda]);

  const handleBuscar = () =>
    setBusqueda({ materia: filtroMateria, grupo: filtroGrupo, fecha: filtroFecha });

  const handleLimpiar = () => {
    setFiltroMateria(''); setFiltroGrupo(''); setFiltroFecha('');
    setBusqueda({ materia: '', grupo: '', fecha: '' });
  };

  const handleSave = (form) => {
    const cal = parseFloat(form.calificacion) || 0;
    if (modalForm?.isCreate) {
      setLista((prev) => [...prev, { ...form, calificacion: cal, id: nextId++ }]);
    } else {
      setLista((prev) =>
        prev.map((c) => c.id === modalForm.item.id ? { ...c, ...form, calificacion: cal } : c)
      );
    }
    setModalForm(null);
  };

  return (
    <div className="module-page">

      {/* ── Modal ─────────────────────────────────────────────── */}
      {modalForm && (
        <ModalCalificacion
          item={modalForm.isCreate ? null : modalForm.item}
          onSave={handleSave}
          onCancel={() => setModalForm(null)}
        />
      )}

      {/* ── Filtros ──────────────────────────────────────────── */}
      <div className="filter-card">
        <h3 className="filter-title">Filtros de Búsqueda</h3>
        <div className="filter-row">

          <div className="filter-field">
            <label className="filter-label">Materia:</label>
            <select className="filter-select" value={filtroMateria} onChange={(e) => setFiltroMateria(e.target.value)}>
              <option value="">Seleccionar materia</option>
              {MATERIAS_LIST.map((m) => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>

          <div className="filter-field">
            <label className="filter-label">Grupo:</label>
            <select className="filter-select" value={filtroGrupo} onChange={(e) => setFiltroGrupo(e.target.value)}>
              <option value="">Seleccionar grupo</option>
              {GRUPOS_FILTER.map((g) => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>

          <div className="filter-field">
            <label className="filter-label">Fecha de evaluación</label>
            <div className="filter-date-wrapper">
              <input
                className="filter-select filter-select--date"
                type="date"
                value={filtroFecha}
                onChange={(e) => setFiltroFecha(e.target.value)}
              />
              <span className="filter-date-icon"><IconCalendar /></span>
            </div>
          </div>

          <div className="filter-actions">
            <button className="btn btn--primary" onClick={handleBuscar}><IconSearch /> Buscar</button>
            <button className="btn btn--outline" onClick={handleLimpiar}>Limpiar</button>
          </div>

        </div>
      </div>

      {/* ── Tabla ────────────────────────────────────────────── */}
      <div className="table-card">
        <div className="table-header">
          <h3 className="table-title">Calificaciones Registradas</h3>
          <div className="table-header-actions">
            <button className="btn btn--primary" onClick={() => setModalForm({ isCreate: true })}>
              <IconPlus /> Registrar
            </button>
            <button className="btn btn--outline"><IconExport /> Exportar</button>
          </div>
        </div>

        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Estudiante</th>
                <th>Materia</th>
                <th>Grupo</th>
                <th>Calificación</th>
                <th>Fecha</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {listaFiltrada.map((c) => (
                <tr key={c.id}>
                  <td className="td-id">{c.id}</td>
                  <td className="td-name">{c.estudiante}</td>
                  <td>{c.materia}</td>
                  <td><span className="badge badge--grupo">{c.grupo}</span></td>
                  <td><span className={`cal-score${c.calificacion >= 9 ? ' cal-score--high' : c.calificacion < 7 ? ' cal-score--low' : ''}`}>{c.calificacion}</span></td>
                  <td>{c.fecha}</td>
                  <td className="td-actions">
                    <button
                      className="action-btn action-btn--edit"
                      title="Editar"
                      onClick={() => setModalForm({ item: c })}
                    >
                      <IconEdit />
                    </button>
                  </td>
                </tr>
              ))}
              {listaFiltrada.length === 0 && (
                <tr>
                  <td colSpan={7} className="table-empty">No hay calificaciones con los filtros seleccionados.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Gráfica promedio por grupo ────────────────────────── */}
      <div className="widget-card">
        <h3 className="widget-title">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ verticalAlign: 'middle', marginRight: 6 }}>
            <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/>
            <line x1="6" y1="20" x2="6" y2="14"/><line x1="2" y1="20" x2="22" y2="20"/>
          </svg>
          Promedio por Grupo - Calificaciones Actuales
        </h3>
        <div style={{ height: 260, marginTop: '0.75rem' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={promediosPorGrupo} barSize={30} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F0F7F4" vertical={false} />
              <XAxis dataKey="grupo" tick={{ fontSize: 12, fill: '#6B7C74' }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 10]} tick={{ fontSize: 12, fill: '#6B7C74' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: '#F0F7F4' }} />
              <Bar dataKey="promedio" radius={[6, 6, 0, 0]}>
                {promediosPorGrupo.map((entry, index) => (
                  <Cell key={index} fill="#2A9D6F" />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
}

export default Calificaciones;
