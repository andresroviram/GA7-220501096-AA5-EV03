import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  docentesPorDepartamento,
  estadisticasDocentes,
  departamentos,
  estados,
  materias as MATERIAS_LIST,
} from '../../data/mockDocentes';
import * as docentesService from '../../services/docentesService';
import { downloadCSV } from '../../utils/exportUtils';
import Button from '../../components/ui/Button';
import InputText from '../../components/ui/InputText';
import DatePicker from '../../components/ui/DatePicker';

import {
  IconEdit, IconUserMinus as IconRemove, IconSearch, IconDownload as IconExport,
  IconPlus, IconChevronDown as IconChevron, IconClose,
  IconMail, IconPhone, IconCheck, IconXMark, IconUsers, IconBarChart,
} from '../../components/Icons';

/* ─── MultiSelect ────────────────────────────────────────────────────────────── */
function MultiSelect({ options, selected, onChange, placeholder }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const toggle = (item) => {
    if (selected.includes(item)) onChange(selected.filter((s) => s !== item));
    else onChange([...selected, item]);
  };

  return (
    <div className="multiselect" ref={ref}>
      <button
        type="button"
        className={`multiselect-trigger${open ? ' multiselect-trigger--open' : ''}`}
        onClick={() => setOpen((o) => !o)}
      >
        <span className="multiselect-placeholder">{placeholder}</span>
        <IconChevron open={open} />
      </button>
      {open && (
        <div className="multiselect-dropdown">
          {options.map((opt) => (
            <div
              key={opt}
              className={`multiselect-option${selected.includes(opt) ? ' multiselect-option--selected' : ''}`}
              onClick={() => toggle(opt)}
            >
              {opt}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── ModalConfirm ───────────────────────────────────────────────────────────── */
function ModalConfirm({ docente, onConfirm, onCancel }) {
  const esActivo = docente.estado === 'Activo';
  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-confirm" onClick={(e) => e.stopPropagation()}>
        <h3 className="modal-confirm-title">Confirmar Cambio de Estado</h3>
        <p className="modal-confirm-msg">
          {esActivo ? (
            <>
              ¿Está seguro que desea dar de baja al docente{' '}
              <strong>{docente.nombre}</strong>? Esta acción marcará al docente como inactivo en el sistema.
            </>
          ) : (
            <>
              ¿Está seguro que desea reactivar al docente{' '}
              <strong>{docente.nombre}</strong>?
            </>
          )}
        </p>
        <div className="modal-confirm-actions">
          <Button variant="secondary" onClick={onCancel}>Cancelar</Button>
          <Button
            variant={esActivo ? 'danger' : 'primary'}
            onClick={() => onConfirm(docente)}
          >
            {esActivo ? 'Dar de Baja' : 'Reactivar'}
          </Button>
        </div>
      </div>
    </div>
  );
}

/* ─── ModalDocente ───────────────────────────────────────────────────────────── */
function ModalDocente({ docente, onSave, onCancel }) {
  const isEdit = !!docente;
  const [form, setForm] = useState({
    nombre:       docente?.nombre       || '',
    cedula:       docente?.cedula       || '',
    email:        docente?.email        || '',
    telefono:     docente?.telefono     || '',
    departamento: docente?.departamento || '',
    fechaIngreso: docente?.fechaIngreso || '',
    materias:     docente?.materias     || [],
  });

  const set = (field, value) => setForm((f) => ({ ...f, [field]: value }));

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-form" onClick={(e) => e.stopPropagation()}>

        {/* Cabecera */}
        <div className="modal-form-header">
          <h2 className="modal-form-title">
            {isEdit ? 'Editar información del Docente' : 'Registrar Nuevo Docente'}
          </h2>
          <button type="button" className="modal-close" onClick={onCancel}>
            <IconClose />
          </button>
        </div>

        {/* Campos */}
        <div className="modal-form-body">
          <div className="modal-grid">

            <InputText
              className="modal-field"
              label="Nombre Completo"
              value={form.nombre}
              onChange={(e) => set('nombre', e.target.value)}
              placeholder="Dr. Juan Pérez"
            />

            <InputText
              className="modal-field"
              label="Cédula Profesional"
              value={form.cedula}
              onChange={(e) => set('cedula', e.target.value)}
              placeholder="123456789"
            />

            <InputText
              className="modal-field"
              label="Email"
              type="email"
              value={form.email}
              onChange={(e) => set('email', e.target.value)}
              placeholder="juan.perez@escuela.edu"
            />

            <InputText
              className="modal-field"
              label="Teléfono"
              value={form.telefono}
              onChange={(e) => set('telefono', e.target.value)}
              placeholder="+52 555-0101"
            />

            <div className="modal-field">
              <label className="modal-label">Departamento</label>
              <select
                className="modal-select"
                value={form.departamento}
                onChange={(e) => set('departamento', e.target.value)}
              >
                <option value="">Seleccionar departamento</option>
                {departamentos.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            <DatePicker
              className="modal-field"
              label="Fecha de ingreso"
              value={form.fechaIngreso}
              onChange={(e) => set('fechaIngreso', e.target.value)}
            />

          </div>

          {/* Materias — ancho completo */}
          <div className="modal-field modal-field--full" style={{ marginTop: '1rem' }}>
            <label className="modal-label">Materias que imparte</label>
            <MultiSelect
              options={MATERIAS_LIST}
              selected={form.materias}
              onChange={(v) => set('materias', v)}
              placeholder="Seleccionar materias..."
            />
            <div className="materia-tags">
              {form.materias.length === 0 ? (
                <span className="no-materias">No hay materias seleccionadas</span>
              ) : (
                form.materias.map((m) => (
                  <span key={m} className="materia-tag">
                    {m}
                    <button
                      type="button"
                      className="materia-tag-remove"
                      onClick={() => set('materias', form.materias.filter((x) => x !== m))}
                    >×</button>
                  </span>
                ))
              )}
            </div>
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

function Docentes() {
  const [lista,        setLista]        = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [filtroDept,   setFiltroDept]   = useState('');
  const [filtroEstado, setFiltroEstado] = useState('');
  const [busqueda,     setBusqueda]     = useState({ dept: '', estado: '' });
  const [modalConfirm, setModalConfirm] = useState(null); // docente a confirmar
  const [modalForm,    setModalForm]    = useState(null); // null | { docente } para editar, o {} para crear

  useEffect(() => {
    docentesService.getDocentes()
      .then((data) => { setLista(data); nextId = data.length + 1; })
      .finally(() => setLoading(false));
  }, []);

  /* Aplicar filtros solo al hacer clic en Buscar */
  const docentesFiltrados = useMemo(() => {
    return lista.filter((d) => {
      const matchDept   = !busqueda.dept   || d.departamento === busqueda.dept;
      const matchEstado = !busqueda.estado || d.estado       === busqueda.estado;
      return matchDept && matchEstado;
    });
  }, [lista, busqueda]);

  const handleBuscar = () => setBusqueda({ dept: filtroDept, estado: filtroEstado });

  const handleExport = () => {
    downloadCSV(
      docentesFiltrados,
      [
        { key: 'id',           label: 'ID'           },
        { key: 'nombre',       label: 'Nombre'       },
        { key: 'departamento', label: 'Departamento' },
        { key: 'email',        label: 'Email'        },
        { key: 'estado',       label: 'Estado'       },
        { key: 'fechaIngreso', label: 'Fecha Ingreso'},
      ],
      `docentes-${new Date().toISOString().slice(0, 10)}.csv`
    );
  };

  const handleLimpiar = () => {
    setFiltroDept('');
    setFiltroEstado('');
    setBusqueda({ dept: '', estado: '' });
  };

  /* Cambio de estado (confirmado) */
  const handleConfirmStatus = (docente) => {
    setLista((prev) =>
      prev.map((d) =>
        d.id === docente.id
          ? { ...d, estado: d.estado === 'Activo' ? 'Inactivo' : 'Activo' }
          : d
      )
    );
    setModalConfirm(null);
  };

  /* Guardar docente (crear o editar) */
  const handleSave = (form) => {
    if (modalForm?.isCreate) {
      setLista((prev) => [
        ...prev,
        { ...form, id: nextId++, estado: 'Activo' },
      ]);
    } else {
      setLista((prev) =>
        prev.map((d) =>
          d.id === modalForm.docente.id ? { ...d, ...form } : d
        )
      );
    }
    setModalForm(null);
  };

  /* Máximo de docentes por dept para calcular el ancho de barra */
  const maxDept = Math.max(...docentesPorDepartamento.map((d) => d.total));

  return (
    <div className="module-page">

      {/* ── Modal confirmar cambio de estado ─────────────────────── */}
      {modalConfirm && (
        <ModalConfirm
          docente={modalConfirm}
          onConfirm={handleConfirmStatus}
          onCancel={() => setModalConfirm(null)}
        />
      )}

      {/* ── Modal registrar / editar docente ─────────────────────── */}
      {modalForm && (
        <ModalDocente
          docente={modalForm.isCreate ? null : modalForm.docente}
          onSave={handleSave}
          onCancel={() => setModalForm(null)}
        />
      )}

      {/* ── Filtros ──────────────────────────────────────────────── */}
      <div className="filter-card">
        <h3 className="filter-title">Filtros de Búsqueda</h3>
        <div className="filter-row">

          <div className="filter-field">
            <label className="filter-label">Departamento</label>
            <select
              className="filter-select"
              value={filtroDept}
              onChange={(e) => setFiltroDept(e.target.value)}
            >
              <option value="">Seleccionar departamento</option>
              {departamentos.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          <div className="filter-field">
            <label className="filter-label">Estado</label>
            <select
              className="filter-select"
              value={filtroEstado}
              onChange={(e) => setFiltroEstado(e.target.value)}
            >
              <option value="">Seleccionar estado</option>
              {estados.map((e) => (
                <option key={e} value={e}>{e}</option>
              ))}
            </select>
          </div>

          <div className="filter-actions">
            <Button variant="primary" onClick={handleBuscar} leftIcon={<IconSearch />}>
              Buscar
            </Button>
            <Button variant="secondary" onClick={handleLimpiar}>
              Limpiar
            </Button>
          </div>

        </div>
      </div>

      {/* ── Tabla de docentes ──────────────────────────────────── */}
      <div className="table-card">
        <div className="table-header">
          <h3 className="table-title">Personal Docente</h3>
          <div className="table-header-actions">
            <Button variant="primary" onClick={() => setModalForm({ isCreate: true })} leftIcon={<IconPlus />}>
              Registrar
            </Button>
            <Button variant="secondary" onClick={handleExport} leftIcon={<IconExport />}>
              Exportar
            </Button>
          </div>
        </div>

        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Departamento</th>
                <th>Contacto</th>
                <th>Estado</th>
                <th>Fecha ingreso</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {docentesFiltrados.map((d) => (
                <tr key={d.id}>
                  <td className="td-id">{d.id}</td>
                  <td className="td-name">{d.nombre}</td>
                  <td>{d.departamento}</td>
                  <td className="td-contact">
                    <span className="contact-email"><IconMail /> {d.email}</span>
                    <span className="contact-phone"><IconPhone /> {d.telefono}</span>
                  </td>
                  <td>
                    <span className={`badge ${d.estado === 'Activo' ? 'badge--active' : 'badge--inactive'}`}>
                      {d.estado === 'Activo' ? <IconCheck /> : <IconXMark />} {d.estado}
                    </span>
                  </td>
                  <td>{d.fechaIngreso}</td>
                  <td className="td-actions">
                    <button
                      className="action-btn action-btn--edit"
                      title="Editar"
                      onClick={() => setModalForm({ docente: d })}
                    >
                      <IconEdit />
                    </button>
                    <button
                      className="action-btn action-btn--remove"
                      title={d.estado === 'Activo' ? 'Dar de baja' : 'Reactivar'}
                      onClick={() => setModalConfirm(d)}
                    >
                      <IconRemove />
                    </button>
                  </td>
                </tr>
              ))}
              {docentesFiltrados.length === 0 && (
                <tr>
                  <td colSpan={7} className="table-empty">No se encontraron docentes con los filtros seleccionados.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Widgets inferiores ─────────────────────────────────── */}
      <div className="widgets-row">

        {/* Docentes Activos por Departamento */}
        <div className="widget-card">
          <h3 className="widget-title">
            <IconUsers /> Docentes Activos por Departamento
          </h3>
          <div className="dept-bar-list">
            {docentesPorDepartamento.map((item) => (
              <div key={item.departamento} className="dept-bar-row">
                <span className="dept-bar-label">{item.departamento}</span>
                <div className="dept-bar-track">
                  <div
                    className="dept-bar-fill"
                    style={{ width: `${(item.total / maxDept) * 100}%` }}
                  />
                </div>
                <span className="dept-bar-value">{item.total}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Estadísticas generales */}
        <div className="widget-card">
          <h3 className="widget-title">
            <IconBarChart /> Estadísticas generales
          </h3>
          <div className="stats-list">
            <div className="stats-list-row">
              <span className="stats-list-label">Total de Docentes</span>
              <span className="stats-list-value stats-list-value--neutral">{estadisticasDocentes.total}</span>
            </div>
            <div className="stats-list-row">
              <span className="stats-list-label">Docentes Activos</span>
              <span className="stats-list-value stats-list-value--active">{estadisticasDocentes.activos}</span>
            </div>
            <div className="stats-list-row">
              <span className="stats-list-label">Docentes Inactivos</span>
              <span className="stats-list-value stats-list-value--inactive">{estadisticasDocentes.inactivos}</span>
            </div>
            <div className="stats-list-row">
              <span className="stats-list-label">Promedio Materias/Docentes</span>
              <span className="stats-list-value stats-list-value--neutral">{estadisticasDocentes.promedioMaterias.toFixed(1)}</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Docentes;
