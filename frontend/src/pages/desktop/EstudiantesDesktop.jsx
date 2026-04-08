import React, { useState, useMemo, useEffect, useRef } from 'react';
import Shimmer from '../../components/Shimmer';
import {
  GRUPOS_LIST,
  ESTADOS_LIST,
  RANGOS_EDAD,
  GRUPOS_WIDGET,
} from '../../data/mockEstudiantes';
import * as estudiantesService from '../../services/estudiantesService';
import { getPadres } from '../../services/estudiantesService';
import { downloadCSV } from '../../utils/exportUtils';
import Button from '../../components/ui/Button';
import InputText from '../../components/ui/InputText';

import {
  IconEdit, IconUserMinus, IconUserPlus, IconSearch, IconDownload as IconExport,
  IconPlus, IconPhone, IconMapPin as IconPin, IconUser, IconClose,
} from '../../components/Icons';

/* ─── ModalConfirm ──────────────────────────────────────────────────────────── */
function ModalConfirm({ estudiante, onConfirm, onCancel }) {
  const esActivo = estudiante.estado !== 'Suspendido';
  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-confirm" onClick={(e) => e.stopPropagation()}>
        <h3 className="modal-confirm-title">Confirmar Cambio de Estado</h3>
        <p className="modal-confirm-msg">
          {esActivo ? (
            <>¿Está seguro que desea <strong>suspender</strong> al estudiante{' '}
              <strong>{estudiante.nombre}</strong>? Esta acción marcará al estudiante como suspendido en el sistema.</>
          ) : (
            <>¿Está seguro que desea <strong>reactivar</strong> al estudiante{' '}
              <strong>{estudiante.nombre}</strong>?</>
          )}
        </p>
        <div className="modal-confirm-actions">
          <Button variant="secondary" onClick={onCancel}>Cancelar</Button>
          <Button
            variant={esActivo ? 'danger' : 'primary'}
            onClick={() => onConfirm(estudiante)}
          >
            {esActivo ? 'Suspender' : 'Reactivar'}
          </Button>
        </div>
      </div>
    </div>
  );
}
/* ─── AcudienteCombobox ────────────────────────────────────────────────────────────────── */
// tutor       = texto actualmente en el input (nombre visible)
// tutorId     = id del padre vinculado (null si es texto libre)
// onChange(nombre, id) = callback cuando cambia la selección
function AcudienteCombobox({ padres, tutor, tutorId, onChange }) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target))
        setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const filtered = tutor
    ? padres.filter((p) =>
        p.nombre.toLowerCase().includes(tutor.toLowerCase()) ||
        (p.correo && p.correo.toLowerCase().includes(tutor.toLowerCase()))
      )
    : padres;

  const handleInputChange = (e) => {
    onChange(e.target.value, null, null); // escribir manualmente descarta el vínculo
    setOpen(true);
  };

  const handleSelect = (padre) => {
    onChange(padre.nombre, padre.id, padre.correo);
    setOpen(false);
  };

  const handleClear = (e) => {
    e.stopPropagation();
    onChange('', null, null);
    setOpen(false);
  };

  return (
    <div className="combobox-container modal-field" ref={containerRef}>
      <label className="modal-label">Nombre del Acudiente</label>
      <div className="combobox-input-wrap">
        <input
          type="text"
          className="modal-input combobox-input"
          placeholder="Buscar acudiente por nombre…"
          value={tutor}
          onChange={handleInputChange}
          onFocus={() => setOpen(true)}
          onKeyDown={(e) => e.key === 'Escape' && setOpen(false)}
          autoComplete="off"
        />
        {tutor && (
          <button type="button" className="combobox-clear" onMouseDown={handleClear} title="Limpiar">
            ×
          </button>
        )}
        {open && (
        <ul className="combobox-dropdown">
          {filtered.length === 0 ? (
            <li className="combobox-empty">Sin coincidencias</li>
          ) : (
            filtered.map((p) => (
              <li
                key={p.id}
                className={`combobox-option${tutorId === p.id ? ' combobox-option--selected' : ''}`}
                onMouseDown={() => handleSelect(p)}
              >
                <span className="combobox-option-name">{p.nombre}</span>
                {p.correo && <span className="combobox-option-sub">{p.correo}</span>}
              </li>
            ))
          )}
        </ul>
        )}
      </div>
    </div>
  );
}
/* ─── ModalEstudiante ───────────────────────────────────────────────────────── */
function ModalEstudiante({ estudiante, onSave, onCancel }) {
  const isEdit = !!estudiante;
  const [padres, setPadres] = useState([]);
  const [form, setForm] = useState({
    nombre:        estudiante?.nombre        || '',
    email:         estudiante?.email         || '',
    grupo:         estudiante?.grupo         || '',
    edad:          estudiante?.edad          || '',
    telefono:      estudiante?.telefono      || '',
    direccion:     estudiante?.direccion     || '',
    tutor:         estudiante?.tutor         || '',
    tutorId:       estudiante?.tutorId       || null,
    tutorCorreo:   estudiante?.correo_padre?.[0] ?? '',
    tutorTelefono: estudiante?.tutorTelefono || '',
    promedio:      estudiante?.promedio      ?? '',
  });

  const set = (f, v) => setForm((prev) => ({ ...prev, [f]: v }));

  useEffect(() => {
    getPadres().then(setPadres).catch(() => {});
  }, []);

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-form" onClick={(e) => e.stopPropagation()}>

        <div className="modal-form-header">
          <h2 className="modal-form-title">
            {isEdit ? 'Editar Estudiante' : 'Registrar Nuevo Estudiante'}
          </h2>
          <button type="button" className="modal-close" onClick={onCancel}><IconClose /></button>
        </div>

        <div className="modal-form-body">
          <div className="modal-grid">

            <InputText
              className="modal-field"
              label="Nombre Completo"
              value={form.nombre}
              onChange={(e) => set('nombre', e.target.value)}
              placeholder="Ana García Rodríguez"
            />

            <InputText
              className="modal-field"
              label="Email"
              type="email"
              value={form.email}
              onChange={(e) => set('email', e.target.value)}
              placeholder="ana.garcia@estudiante.edu"
            />

            <div className="modal-field">
              <label className="modal-label">Grupo</label>
              <select className="modal-select" value={form.grupo} onChange={(e) => set('grupo', e.target.value)}>
                <option value="">Seleccionar grupo</option>
                {GRUPOS_LIST.map((g) => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>

            <InputText
              className="modal-field"
              label="Edad"
              type="number"
              min="10"
              max="25"
              value={form.edad}
              onChange={(e) => set('edad', e.target.value)}
              placeholder="16"
            />

            <InputText
              className="modal-field"
              label="Teléfono"
              value={form.telefono}
              onChange={(e) => set('telefono', e.target.value)}
              placeholder="+52 555-1001"
            />

            <InputText
              className="modal-field"
              label="Promedio"
              type="number"
              step="0.1"
              min="0"
              max="10"
              value={form.promedio}
              onChange={(e) => set('promedio', e.target.value)}
              placeholder="9.0"
            />

            <InputText
              className="modal-field modal-field--full"
              label="Dirección"
              value={form.direccion}
              onChange={(e) => set('direccion', e.target.value)}
              placeholder="Calle Principal 123, Col. Centro"
            />

            <AcudienteCombobox
              padres={padres}
              tutor={form.tutor}
              tutorId={form.tutorId}
              onChange={(nombre, id, correo) => setForm((prev) => ({ ...prev, tutor: nombre, tutorId: id, tutorCorreo: correo ?? prev.tutorCorreo }))}
            />

            <InputText
              className="modal-field"
              label="Teléfono del Acudiente"
              value={form.tutorTelefono}
              onChange={(e) => set('tutorTelefono', e.target.value)}
              placeholder="+52 555-1002"
            />

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

/* ─── Helpers de filtro por rango de edad ───────────────────────────────────── */
function edadEnRango(edad, rango) {
  if (!rango) return true;
  if (rango === '13-14 años') return edad >= 13 && edad <= 14;
  if (rango === '15-16 años') return edad >= 15 && edad <= 16;
  if (rango === '17-18 años') return edad >= 17 && edad <= 18;
  return true;
}

/* ─── Badge de estado ───────────────────────────────────────────────────────── */
function EstadoBadge({ estado }) {
  const cls =
    estado === 'Activo'     ? 'badge badge--active'    :
    estado === 'Suspendido' ? 'badge badge--suspended' :
                              'badge badge--inactive';
  return <span className={cls}>{estado}</span>;
}

/* ─── Componente principal ──────────────────────────────────────────────────── */
let nextId = 9;

function Estudiantes() {
  const [lista,        setLista]        = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [filtroGrupo,  setFiltroGrupo]  = useState('');
  const [filtroEstado, setFiltroEstado] = useState('');
  const [filtroRango,  setFiltroRango]  = useState('');
  const [busqueda,     setBusqueda]     = useState({ grupo: '', estado: '', rango: '' });
  const [modalConfirm, setModalConfirm] = useState(null);
  const [modalForm,    setModalForm]    = useState(null);

  useEffect(() => {
    estudiantesService.getEstudiantes()
      .then((data) => { setLista(data); nextId = data.length + 1; })
      .finally(() => setLoading(false));
  }, []);

  const listaFiltrada = useMemo(() => {
    return lista.filter((e) => {
      const matchG = !busqueda.grupo  || e.grupo   === busqueda.grupo;
      const matchE = !busqueda.estado || e.estado  === busqueda.estado;
      const matchR = edadEnRango(e.edad, busqueda.rango);
      return matchG && matchE && matchR;
    });
  }, [lista, busqueda]);

  const handleBuscar  = () => setBusqueda({ grupo: filtroGrupo, estado: filtroEstado, rango: filtroRango });
  const handleLimpiar = () => {
    setFiltroGrupo(''); setFiltroEstado(''); setFiltroRango('');
    setBusqueda({ grupo: '', estado: '', rango: '' });
  };

  const handleExport = () => {
    downloadCSV(
      listaFiltrada,
      [
        { key: 'id',      label: 'Matrícula' },
        { key: 'nombre',  label: 'Nombre'    },
        { key: 'grupo',   label: 'Grupo'     },
        { key: 'edad',    label: 'Edad'      },
        { key: 'promedio',label: 'Promedio'  },
        { key: 'estado',  label: 'Estado'    },
      ],
      `estudiantes-${new Date().toISOString().slice(0, 10)}.csv`
    );
  };

  const handleConfirmStatus = (est) => {
    setLista((prev) =>
      prev.map((e) =>
        e.id === est.id
          ? { ...e, estado: e.estado === 'Suspendido' ? 'Activo' : 'Suspendido' }
          : e
      )
    );
    setModalConfirm(null);
  };

  const handleSave = (form) => {
    if (modalForm?.isCreate) {
      const idStr = `EST${String(nextId++).padStart(3, '0')}`;
      const correo_padre = form.tutorCorreo ? [form.tutorCorreo] : [];
      setLista((prev) => [...prev, { ...form, id: idStr, edad: Number(form.edad), promedio: parseFloat(form.promedio) || 0, estado: 'Activo', correo_padre }]);
    } else {
      setLista((prev) =>
        prev.map((e) =>
          e.id === modalForm.estudiante.id
            ? { ...e, ...form, edad: Number(form.edad), promedio: parseFloat(form.promedio) || e.promedio, correo_padre: form.tutorCorreo ? [form.tutorCorreo] : e.correo_padre }
            : e
        )
      );
    }
    setModalForm(null);
  };

  /* Calcular estudiantes por grupo para el widget */
  const estudiantesPorGrupo = useMemo(() =>
    GRUPOS_WIDGET.map((g) => ({
      label: g,
      total: lista.filter((e) => e.grupo === g.replace('Grupo ', '')).length,
    })),
  [lista]);

  const maxGrupo = Math.max(...estudiantesPorGrupo.map((g) => g.total), 1);

  /* Stats generales (dinámicas) */
  const stats = useMemo(() => ({
    total:       lista.length,
    activos:     lista.filter((e) => e.estado === 'Activo').length,
    inactivos:   lista.filter((e) => e.estado === 'Inactivo').length,
    suspendidos: lista.filter((e) => e.estado === 'Suspendido').length,
    promedio:    lista.length
      ? (lista.reduce((s, e) => s + e.promedio, 0) / lista.length).toFixed(1)
      : '—',
  }), [lista]);

  if (loading) return <Shimmer variant="table" rows={6} />;

  return (
    <div className="module-page">

      {/* ── Modales ──────────────────────────────────────────────── */}
      {modalConfirm && (
        <ModalConfirm
          estudiante={modalConfirm}
          onConfirm={handleConfirmStatus}
          onCancel={() => setModalConfirm(null)}
        />
      )}
      {modalForm && (
        <ModalEstudiante
          estudiante={modalForm.isCreate ? null : modalForm.estudiante}
          onSave={handleSave}
          onCancel={() => setModalForm(null)}
        />
      )}

      {/* ── Filtros ──────────────────────────────────────────────── */}
      <div className="filter-card">
        <h3 className="filter-title">Filtros de Búsqueda</h3>
        <div className="filter-row">

          <div className="filter-field">
            <label className="filter-label">Grupo</label>
            <select className="filter-select" value={filtroGrupo} onChange={(e) => setFiltroGrupo(e.target.value)}>
              <option value="">Seleccionar grupo</option>
              {GRUPOS_LIST.map((g) => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>

          <div className="filter-field">
            <label className="filter-label">Estado</label>
            <select className="filter-select" value={filtroEstado} onChange={(e) => setFiltroEstado(e.target.value)}>
              <option value="">Seleccionar estado</option>
              {ESTADOS_LIST.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div className="filter-field">
            <label className="filter-label">Rango de Edad</label>
            <select className="filter-select" value={filtroRango} onChange={(e) => setFiltroRango(e.target.value)}>
              <option value="">Seleccionar rango</option>
              {RANGOS_EDAD.map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>

          <div className="filter-actions">
            <Button variant="primary" onClick={handleBuscar} leftIcon={<IconSearch />}>Buscar</Button>
            <Button variant="secondary" onClick={handleLimpiar}>Limpiar</Button>
          </div>

        </div>
      </div>

      {/* ── Tabla ────────────────────────────────────────────────── */}
      <div className="table-card">
        <div className="table-header">
          <h3 className="table-title">Estudiantes Registrados</h3>
          <div className="table-header-actions">
            <Button variant="primary" onClick={() => setModalForm({ isCreate: true })} leftIcon={<IconPlus />}>
              Registrar Nuevo
            </Button>
            <Button variant="secondary" onClick={handleExport} leftIcon={<IconExport />}>Exportar Listado</Button>
          </div>
        </div>

        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Matrícula</th>
                <th>Nombre</th>
                <th>Grupo</th>
                <th>Edad</th>
                <th>Contacto</th>
                <th>Acudiente</th>
                <th>Promedio</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {listaFiltrada.map((e) => (
                <tr key={e.id}>
                  <td className="td-id">{e.id}</td>
                  <td className="td-name">
                    <span className="td-name-main">{e.nombre}</span>
                    <span className="td-name-sub">{e.email}</span>
                  </td>
                  <td><span className="badge badge--grupo">{e.grupo}</span></td>
                  <td><span className="td-edad">{e.edad} años</span></td>
                  <td>
                    <div className="td-contact">
                      <span className="contact-phone"><IconPhone /> {e.telefono}</span>
                      <span className="contact-email"><IconPin /> {e.direccion.length > 22 ? e.direccion.slice(0, 22) + '...' : e.direccion}</span>
                    </div>
                  </td>
                  <td>
                    <div className="td-contact">
                      <span className="contact-phone"><IconUser /> {e.tutor}</span>
                      <span className="contact-phone"><IconPhone /> {e.tutorTelefono}</span>
                    </div>
                  </td>
                  <td><span className="badge badge--promedio">{e.promedio}</span></td>
                  <td><EstadoBadge estado={e.estado} /></td>
                  <td className="td-actions">
                    <button className="action-btn action-btn--edit" title="Editar" onClick={() => setModalForm({ estudiante: e })}>
                      <IconEdit />
                    </button>
                    <button
                      className={`action-btn ${e.estado === 'Suspendido' ? 'action-btn--reactivate' : 'action-btn--remove'}`}
                      title={e.estado === 'Suspendido' ? 'Reactivar' : 'Suspender'}
                      onClick={() => setModalConfirm(e)}
                    >
                      {e.estado === 'Suspendido' ? <IconUserPlus /> : <IconUserMinus />}
                    </button>
                  </td>
                </tr>
              ))}
              {listaFiltrada.length === 0 && (
                <tr>
                  <td colSpan={9} className="table-empty">No se encontraron estudiantes con los filtros seleccionados.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Widgets inferiores ─────────────────────────────────────── */}
      <div className="widgets-row">

        {/* Estudiantes por Grupo */}
        <div className="widget-card">
          <h3 className="widget-title">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ verticalAlign: 'middle', marginRight: 6 }}>
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
            Estudiantes por Grupo
          </h3>
          <div className="dept-bar-list">
            {estudiantesPorGrupo.map((item) => (
              <div key={item.label} className="dept-bar-row">
                <span className="dept-bar-label">{item.label}</span>
                <div className="dept-bar-track">
                  <div
                    className="dept-bar-fill"
                    style={{ width: item.total > 0 ? `${(item.total / maxGrupo) * 100}%` : '0%' }}
                  />
                </div>
                <span className="dept-bar-value">{item.total}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Estadísticas Generales */}
        <div className="widget-card">
          <h3 className="widget-title">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ verticalAlign: 'middle', marginRight: 6 }}>
              <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/>
              <line x1="6" y1="20" x2="6" y2="14"/><line x1="2" y1="20" x2="22" y2="20"/>
            </svg>
            Estadísticas Generales
          </h3>
          <div className="stats-list">
            <div className="stats-list-row">
              <span className="stats-list-label">Total de Estudiantes</span>
              <span className="stats-list-value stats-list-value--neutral">{stats.total}</span>
            </div>
            <div className="stats-list-row">
              <span className="stats-list-label">Estudiantes Activos</span>
              <span className="stats-list-value stats-list-value--active">{stats.activos}</span>
            </div>
            <div className="stats-list-row">
              <span className="stats-list-label">Estudiantes Inactivos</span>
              <span className="stats-list-value stats-list-value--neutral">{stats.inactivos}</span>
            </div>
            <div className="stats-list-row">
              <span className="stats-list-label">Estudiantes Suspendidos</span>
              <span className="stats-list-value stats-list-value--inactive">{stats.suspendidos}</span>
            </div>
            <div className="stats-list-row">
              <span className="stats-list-label">Promedio General</span>
              <span className="stats-list-value stats-list-value--neutral">{stats.promedio}</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Estudiantes;
