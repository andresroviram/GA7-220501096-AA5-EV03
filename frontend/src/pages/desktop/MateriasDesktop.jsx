import React, { useState, useMemo, useEffect } from 'react';
import Shimmer from '../../components/Shimmer';
import {
  DEPARTAMENTOS_LIST,
  ESTADOS_LIST,
} from '../../data/mockMaterias';
import { docentes as DOCENTES_LIST_RAW } from '../../data/mockDocentes';
import * as materiasService from '../../services/materiasService';
import { downloadCSV } from '../../utils/exportUtils';
import Button from '../../components/ui/Button';
import InputText from '../../components/ui/InputText';

const DOCENTES = ['', ...DOCENTES_LIST_RAW.map((d) => d.nombre)];
const GRUPOS   = ['1A', '1B', '1C', '2A', '2B', '2C', '3A', '3B'];

import {
  IconEdit, IconCoffee as IconToggle, IconPlus, IconSearch, IconClose,
  IconCheck, IconXMark, IconBook, IconBarChart, IconDownload,
} from '../../components/Icons';

/* ─── Modal Materia ── */
function ModalMateria({ item, onSave, onCancel }) {
  const isEdit = !!item;
  const [form, setForm] = useState({
    nombre:      item?.nombre        || '',
    departamento: item?.departamento || '',
    creditos:    item?.creditos      || '',
    docente:     item?.docente       || '',
    grupos:      item?.grupos        || [],
  });
  const set = (f, v) => setForm((p) => ({ ...p, [f]: v }));

  const toggleGrupo = (g) =>
    set('grupos', form.grupos.includes(g) ? form.grupos.filter((x) => x !== g) : [...form.grupos, g]);

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-form" onClick={(e) => e.stopPropagation()}>
        <div className="modal-form-header">
          <h2 className="modal-form-title">{isEdit ? 'Editar Materia' : 'Registrar Nueva Materia'}</h2>
          <button className="modal-close" onClick={onCancel}><IconClose /></button>
        </div>
        <div className="modal-form-body">
          <div className="modal-grid">
            <InputText
              className="modal-field"
              label="Nombre de la Materia"
              value={form.nombre}
              onChange={(e) => set('nombre', e.target.value)}
              placeholder="Matemáticas"
            />
            <div className="modal-field">
              <label className="modal-label">Departamento</label>
              <select className="modal-select" value={form.departamento} onChange={(e) => set('departamento', e.target.value)}>
                <option value="">Seleccionar departamento</option>
                {DEPARTAMENTOS_LIST.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <InputText
              className="modal-field"
              label="Créditos"
              type="number"
              min="1"
              max="10"
              value={form.creditos}
              onChange={(e) => set('creditos', e.target.value)}
              placeholder="5"
            />
            <div className="modal-field">
              <label className="modal-label">Docente asignado</label>
              <select className="modal-select" value={form.docente} onChange={(e) => set('docente', e.target.value)}>
                <option value="">Sin asignar</option>
                {DOCENTES.filter(Boolean).map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div className="modal-field modal-field--full">
              <label className="modal-label">Grupos asignados</label>
              <div className="grupo-checks">
                {GRUPOS.map((g) => (
                  <label key={g} className={`grupo-check-pill${form.grupos.includes(g) ? ' grupo-check-pill--active' : ''}`}>
                    <input type="checkbox" style={{ display: 'none' }} checked={form.grupos.includes(g)} onChange={() => toggleGrupo(g)} />
                    {g}
                  </label>
                ))}
              </div>
            </div>
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

/* ─── Componente principal ── */
let nextId = 100;

function Materias() {
  const [lista,        setLista]        = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [filtroDepto,  setFiltroDepto]  = useState('');
  const [filtroEstado, setFiltroEstado] = useState('');
  const [busqueda,     setBusqueda]     = useState({ depto: '', estado: '' });
  const [modalForm,    setModalForm]    = useState(null);

  useEffect(() => {
    materiasService.getMaterias()
      .then((data) => { setLista(data); nextId = data.length + 100; })
      .finally(() => setLoading(false));
  }, []);

  const listaFiltrada = useMemo(() =>
    lista.filter((m) => {
      const md = !busqueda.depto  || m.departamento === busqueda.depto;
      const me = !busqueda.estado || m.estado        === busqueda.estado;
      return md && me;
    }), [lista, busqueda]);

  const handleBuscar  = () => setBusqueda({ depto: filtroDepto, estado: filtroEstado });
  const handleLimpiar = () => { setFiltroDepto(''); setFiltroEstado(''); setBusqueda({ depto: '', estado: '' }); };

  const handleExport = () => {
    downloadCSV(
      listaFiltrada,
      [
        { key: 'id',           label: 'ID'           },
        { key: 'nombre',       label: 'Materia'      },
        { key: 'departamento', label: 'Departamento' },
        { key: 'creditos',     label: 'Créditos'     },
        { key: 'docente',      label: 'Docente'      },
        { key: 'grupos',       label: 'Grupos'       },
        { key: 'estado',       label: 'Estado'       },
      ],
      `materias-${new Date().toISOString().slice(0, 10)}.csv`
    );
  };

  const handleSave = (form) => {
    if (modalForm?.isCreate) {
      const id = `MAT${String(nextId++).padStart(3, '0')}`;
      setLista((p) => [...p, { ...form, id, creditos: Number(form.creditos) || 3, estado: 'Activo' }]);
    } else {
      setLista((p) => p.map((m) => m.id === modalForm.item.id ? { ...m, ...form, creditos: Number(form.creditos) || m.creditos } : m));
    }
    setModalForm(null);
  };

  const handleToggleEstado = (id) =>
    setLista((p) => p.map((m) => m.id === id ? { ...m, estado: m.estado === 'Activo' ? 'Inactivo' : 'Activo' } : m));

  /* Materias por departamento, calculado desde lista */
  const materiasPorDeptoCalc = useMemo(() => {
    const map = {};
    lista.forEach((m) => {
      map[m.departamento] = (map[m.departamento] || 0) + 1;
    });
    return Object.entries(map).map(([departamento, total]) => ({ departamento, total }));
  }, [lista]);

  const maxDepto = Math.max(...materiasPorDeptoCalc.map((d) => d.total), 1);

  /* Stats dinámicos */
  const activas    = lista.filter((m) => m.estado === 'Activo').length;
  const sinDocente = lista.filter((m) => !m.docente).length;

  if (loading) return <Shimmer variant="table" rows={6} />;

  return (
    <div className="module-page">
      {modalForm && (
        <ModalMateria
          item={modalForm.isCreate ? null : modalForm.item}
          onSave={handleSave}
          onCancel={() => setModalForm(null)}
        />
      )}

      {/* Filtros */}
      <div className="filter-card">
        <h3 className="filter-title">Filtros de Búsqueda</h3>
        <div className="filter-row">
          <div className="filter-field">
            <label className="filter-label">Departamento</label>
            <select className="filter-select" value={filtroDepto} onChange={(e) => setFiltroDepto(e.target.value)}>
              <option value="">Todos los departamentos</option>
              {DEPARTAMENTOS_LIST.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          <div className="filter-field">
            <label className="filter-label">Estado</label>
            <select className="filter-select" value={filtroEstado} onChange={(e) => setFiltroEstado(e.target.value)}>
              <option value="">Todos</option>
              {ESTADOS_LIST.map((s) => <option key={s} value={s}>{s}</option>)}
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
          <h3 className="table-title">Catálogo de Materias</h3>
          <div className="table-header-actions">
            <Button variant="primary" onClick={() => setModalForm({ isCreate: true })} leftIcon={<IconPlus />}>
              Nueva Materia
            </Button>
            <Button variant="secondary" onClick={handleExport} leftIcon={<IconDownload />}>
              Exportar
            </Button>
          </div>
        </div>
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Materia</th>
                <th>Departamento</th>
                <th>Créditos</th>
                <th>Docente</th>
                <th>Grupos</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {listaFiltrada.map((m) => (
                <tr key={m.id}>
                  <td className="td-id">{m.id}</td>
                  <td className="td-name">{m.nombre}</td>
                  <td style={{ fontSize: '0.84rem' }}>{m.departamento}</td>
                  <td style={{ textAlign: 'center' }}><span className="badge badge--grupo">{m.creditos}</span></td>
                  <td style={{ fontSize: '0.84rem' }}>{m.docente || <span style={{ color: '#6B7C74', fontStyle: 'italic' }}>Sin asignar</span>}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap' }}>
                      {m.grupos.length > 0
                        ? m.grupos.map((g) => <span key={g} className="badge badge--grupo" style={{ fontSize: '0.72rem', padding: '0.15rem 0.45rem' }}>{g}</span>)
                        : <span style={{ color: '#6B7C74', fontSize: '0.8rem', fontStyle: 'italic' }}>—</span>}
                    </div>
                  </td>
                  <td>
                    <span className={`badge ${m.estado === 'Activo' ? 'badge--active' : 'badge--inactive'}`}>
                      {m.estado === 'Activo' ? <IconCheck /> : <IconXMark />} {m.estado}
                    </span>
                  </td>
                  <td className="td-actions">
                    <button className="action-btn action-btn--edit" title="Editar" onClick={() => setModalForm({ item: m })}>
                      <IconEdit />
                    </button>
                    <button
                      className={`action-btn ${m.estado === 'Activo' ? 'action-btn--remove' : 'action-btn--reactivate'}`}
                      title={m.estado === 'Activo' ? 'Desactivar' : 'Activar'}
                      onClick={() => handleToggleEstado(m.id)}
                    >
                      <IconToggle />
                    </button>
                  </td>
                </tr>
              ))}
              {listaFiltrada.length === 0 && (
                <tr><td colSpan={8} className="table-empty">No se encontraron materias con los filtros seleccionados.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Widgets */}
      <div className="widgets-row">
        <div className="widget-card">
          <h3 className="widget-title"><IconBook /> Materias por Departamento</h3>
          <div className="dept-bar-list">
            {materiasPorDeptoCalc.map((item) => (
              <div key={item.departamento} className="dept-bar-row">
                <span className="dept-bar-label">{item.departamento}</span>
                <div className="dept-bar-track">
                  <div className="dept-bar-fill" style={{ width: `${(item.total / maxDepto) * 100}%` }} />
                </div>
                <span className="dept-bar-value">{item.total}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="widget-card">
          <h3 className="widget-title"><IconBarChart /> Estadísticas Generales</h3>
          <div className="stats-list">
            <div className="stats-list-row">
              <span className="stats-list-label">Total de Materias</span>
              <span className="stats-list-value stats-list-value--neutral">{lista.length}</span>
            </div>
            <div className="stats-list-row">
              <span className="stats-list-label">Materias Activas</span>
              <span className="stats-list-value stats-list-value--active">{activas}</span>
            </div>
            <div className="stats-list-row">
              <span className="stats-list-label">Sin Docente Asignado</span>
              <span className={`stats-list-value ${sinDocente > 0 ? 'stats-list-value--inactive' : 'stats-list-value--neutral'}`}>{sinDocente}</span>
            </div>
            <div className="stats-list-row">
              <span className="stats-list-label">Departamentos</span>
              <span className="stats-list-value stats-list-value--neutral">{DEPARTAMENTOS_LIST.length}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Materias;
