import React, { useState, useMemo, useEffect } from 'react';
import { getSessionUser } from '../../utils/sessionUser';
import Shimmer from '../../components/Shimmer';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import {
  materias as MATERIAS_LIST,
  gruposSelect as GRUPOS_FILTER,
} from '../../data/mockCalificaciones';
import * as calificacionesService from '../../services/calificacionesService';
import * as configService from '../../services/configService';
import { downloadCSV } from '../../utils/exportUtils';
import Button from '../../components/ui/Button';
import InputText from '../../components/ui/InputText';
import DatePicker from '../../components/ui/DatePicker';

import {
  IconEdit, IconSearch, IconDownload as IconExport, IconPlus, IconClose, IconCalendar,
} from '../../components/Icons';

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

            <InputText
              label="Estudiante"
              value={form.estudiante}
              onChange={(e) => set('estudiante', e.target.value)}
              placeholder="Nombre del estudiante"
            />

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

            <InputText
              label="Calificación"
              type="number"
              step="0.1"
              min="0"
              max="10"
              value={form.calificacion}
              onChange={(e) => set('calificacion', e.target.value)}
              placeholder="0.0"
            />

            <DatePicker
              label="Fecha de evaluación"
              value={form.fecha}
              onChange={(e) => set('fecha', e.target.value)}
            />

          </div>
        </div>

        {/* Pie */}
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

/* ─── Componente principal ──────────────────────────────────────────────────── */
let nextId = 1;

function Calificaciones() {
  const esPadre = getSessionUser()?.tipo_usuario === 'padre';
  const [lista,         setLista]         = useState([]);
  const [loading,       setLoading]       = useState(true);
  const [promediosPorGrupo, setPromediosPorGrupo] = useState([]);
  const [notaAprob,     setNotaAprob]     = useState(6);
  const [filtroMateria, setFiltroMateria] = useState('');
  const [filtroGrupo,   setFiltroGrupo]   = useState('');
  const [filtroFecha,   setFiltroFecha]   = useState('');
  const [busqueda,      setBusqueda]      = useState({ materia: '', grupo: '', fecha: '' });
  const [modalForm,     setModalForm]     = useState(null);

  useEffect(() => {
    calificacionesService.getCalificaciones()
      .then((data) => { setLista(data); nextId = data.length + 1; })
      .finally(() => setLoading(false));
    calificacionesService.getPromediosPorGrupo()
      .then(setPromediosPorGrupo)
      .catch(() => {});
    configService.getParams()
      .then((p) => setNotaAprob(Number(p.notaAprobatoria) || 6));
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

  const handleExport = () => {
    downloadCSV(
      listaFiltrada,
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

  if (loading) return <Shimmer variant="table" rows={6} />;

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
            <Button variant="primary" onClick={handleBuscar} leftIcon={<IconSearch />}>Buscar</Button>
            <Button variant="secondary" onClick={handleLimpiar}>Limpiar</Button>
          </div>

        </div>
      </div>

      {/* ── Tabla ────────────────────────────────────────────── */}
      <div className="table-card">
        <div className="table-header">
          <h3 className="table-title">Calificaciones Registradas</h3>
          <div className="table-header-actions">
            {!esPadre && (
              <Button variant="primary" onClick={() => setModalForm({ isCreate: true })} leftIcon={<IconPlus />}>
                Registrar
              </Button>
            )}
            <Button variant="secondary" onClick={handleExport} leftIcon={<IconExport />}>Exportar</Button>
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
                {!esPadre && <th>Acciones</th>}
              </tr>
            </thead>
            <tbody>
              {listaFiltrada.map((c) => (
                <tr key={c.id}>
                  <td className="td-id">{c.id}</td>
                  <td className="td-name">{c.estudiante}</td>
                  <td>{c.materia}</td>
                  <td><span className="badge badge--grupo">{c.grupo}</span></td>
                  <td><span className={`cal-score${c.calificacion >= 9 ? ' cal-score--high' : c.calificacion < notaAprob ? ' cal-score--low' : ''}`}>{c.calificacion}</span></td>
                  <td>{c.fecha}</td>
                  {!esPadre && (
                    <td className="td-actions">
                      <button
                        className="action-btn action-btn--edit"
                        title="Editar"
                        onClick={() => setModalForm({ item: c })}
                      >
                        <IconEdit />
                      </button>
                    </td>
                  )}
                </tr>
              ))}
              {listaFiltrada.length === 0 && (
                <tr>
                  <td colSpan={esPadre ? 6 : 7} className="table-empty">No hay calificaciones con los filtros seleccionados.</td>
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
