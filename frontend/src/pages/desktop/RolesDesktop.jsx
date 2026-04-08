import React, { useEffect, useState } from 'react';
import { getRoles, updateRolPermisos } from '../../services/rolesService';
import { mockUsuariosPendientes } from '../../data/mockUsuariosPendientes';
import api from '../../services/api';
import Shimmer from '../../components/Shimmer';
import {
  IconShield, IconUsers, IconEdit, IconCheckCircle, IconAlertTriangle, IconClose, IconPlus,
} from '../../components/Icons';

const MODULOS = ['Dashboard', 'Docentes', 'Estudiantes', 'Calificaciones', 'Grupos/Horarios', 'Materias', 'Reportes', 'Configuraciones'];
const ROL_OPTIONS = ['administrativo', 'docente', 'padre'];
const ROL_LABELS  = { administrativo: 'Administrador', docente: 'Docente', padre: 'Padre/Acudiente' };

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

export default function RolesDesktop() {
  const [tab, setTab]                       = useState('roles');  // 'roles' | 'pendientes'
  const [roles, setRoles]                   = useState([]);
  const [pendientes, setPendientes]         = useState([]);
  const [loading, setLoading]               = useState(true);
  const [editRol, setEditRol]               = useState(null);   // rol en edición
  const [savingPermisos, setSavingPermisos]  = useState(false);
  const [showNuevoRol, setShowNuevoRol]     = useState(false);
  const [nuevoRol, setNuevoRol]             = useState({ nombre: '', descripcion: '', permisos: MODULOS.reduce((a, m) => ({ ...a, [m]: false }), {}) });
  const [asignando, setAsignando]           = useState(null);    // { id, nombre, correo }
  const [rolSeleccionado, setRolSeleccionado] = useState('');
  const [toast, setToast]                   = useState(null);

  useEffect(() => {
    Promise.all([
      getRoles(),
      USE_MOCK
        ? Promise.resolve(mockUsuariosPendientes)
        : api.get('/usuarios?tipo=pendiente').then((r) => r.data),
    ]).then(([r, p]) => {
      setRoles(r);
      setPendientes(p);
    }).finally(() => setLoading(false));
  }, []);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  /* ── Editar permisos de un rol ── */
  const handleSaveEditRol = async () => {
    setSavingPermisos(true);
    try {
      const updated = await updateRolPermisos(editRol.id, editRol.permisos);
      setRoles((prev) => prev.map((r) => r.id === editRol.id ? (updated ?? editRol) : r));
      setEditRol(null);
      showToast('Permisos actualizados correctamente');
    } catch {
      showToast('Error al guardar los permisos', 'error');
    } finally {
      setSavingPermisos(false);
    }
  };

  /* ── Crear nuevo rol ── */
  const handleCrearRol = () => {
    if (!nuevoRol.nombre.trim()) return;
    const nuevo = {
      id: Date.now(),
      nombre: nuevoRol.nombre,
      descripcion: nuevoRol.descripcion,
      permisos: MODULOS.map((m) => ({ modulo: m, acceso: nuevoRol.permisos[m] })),
    };
    setRoles((prev) => [...prev, nuevo]);
    setShowNuevoRol(false);
    setNuevoRol({ nombre: '', descripcion: '', permisos: MODULOS.reduce((a, m) => ({ ...a, [m]: false }), {}) });
    showToast(`Rol "${nuevo.nombre}" creado`);
  };

  /* ── Asignar rol a usuario pendiente ── */
  const handleAsignarRol = async () => {
    if (!rolSeleccionado || !asignando) return;
    try {
      if (!USE_MOCK) {
        await api.patch(`/usuarios/${asignando.id}`, { tipo_usuario: rolSeleccionado });
      }
      setPendientes((prev) => prev.filter((u) => u.id !== asignando.id));
      showToast(`Rol asignado a ${asignando.nombre}`);
    } catch {
      showToast('Error al asignar el rol', 'error');
    }
    setAsignando(null);
    setRolSeleccionado('');
  };

  if (loading) return <Shimmer variant="cards" count={4} />;

  return (
    <div className="roles-page">

      {/* ── Toast ── */}
      {toast && (
        <div className={`roles-toast roles-toast--${toast.type}`}>
          {toast.type === 'success' ? <IconCheckCircle /> : <IconAlertTriangle />}
          {toast.msg}
        </div>
      )}

      {/* ── Header ── */}
      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-title">Roles y Acceso</h1>
          <p className="page-subtitle">Gestiona los roles del sistema y los usuarios pendientes de activación.</p>
        </div>
        {tab === 'roles' && (
          <button className="btn btn--primary" onClick={() => setShowNuevoRol(true)}>
            <IconPlus /> Nuevo rol
          </button>
        )}
      </div>

      {/* ── Tabs ── */}
      <div className="roles-tabs">
        <button
          className={'roles-tab' + (tab === 'roles' ? ' roles-tab--active' : '')}
          onClick={() => setTab('roles')}
        >
          <IconShield /> Roles del sistema
        </button>
        <button
          className={'roles-tab' + (tab === 'pendientes' ? ' roles-tab--active' : '')}
          onClick={() => setTab('pendientes')}
        >
          <IconUsers />
          Usuarios sin rol
          {pendientes.length > 0 && (
            <span className="roles-badge">{pendientes.length}</span>
          )}
        </button>
      </div>

      {/* ══════════ TAB: Roles ══════════ */}
      {tab === 'roles' && (
        <div className="roles-grid">
          {roles.map((rol) => (
            <div key={rol.id} className="rol-card">
              <div className="rol-card-header">
                <div className="rol-card-icon"><IconShield /></div>
                <div>
                  <p className="rol-card-name">{rol.nombre}</p>
                  <p className="rol-card-desc">{rol.descripcion}</p>
                </div>
                <button className="btn btn--ghost btn--sm rol-card-edit" onClick={() => setEditRol({ ...rol, permisos: rol.permisos.map((p) => ({ ...p })) })}>
                  <IconEdit />
                </button>
              </div>
              <div className="rol-card-permisos">
                {rol.permisos.map((p) => (
                  <span key={p.modulo} className={'rol-permiso-chip' + (p.acceso ? ' rol-permiso-chip--on' : '')}>
                    {p.modulo}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ══════════ TAB: Usuarios pendientes ══════════ */}
      {tab === 'pendientes' && (
        <div className="widget-card" style={{ padding: 0, overflow: 'hidden' }}>
          {pendientes.length === 0 ? (
            <div className="roles-empty">
              <IconCheckCircle />
              <p>No hay usuarios pendientes de asignación.</p>
            </div>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Correo</th>
                  <th>Fecha de registro</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {pendientes.map((u) => (
                  <tr key={u.id}>
                    <td className="td-bold">{u.nombre}</td>
                    <td>{u.correo}</td>
                    <td>{u.fechaRegistro}</td>
                    <td><span className="status-badge status-badge--warning">Sin rol</span></td>
                    <td>
                      <button
                        className="btn btn--primary btn--sm"
                        onClick={() => { setAsignando(u); setRolSeleccionado(''); }}
                      >
                        <IconEdit /> Asignar rol
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* ══════════ Modal: Editar permisos ══════════ */}
      {editRol && (
        <div className="modal-overlay" onClick={() => setEditRol(null)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Editar permisos — {editRol.nombre}</h2>
              <button className="modal-close" onClick={() => setEditRol(null)}><IconClose /></button>
            </div>
            <div className="modal-body">
              <div className="roles-permiso-grid">
                {editRol.permisos.map((p, i) => (
                  <label key={p.modulo} className={'roles-permiso-toggle' + (p.acceso ? ' roles-permiso-toggle--on' : '')}>
                    <input
                      type="checkbox"
                      checked={p.acceso}
                      onChange={() => {
                        const copia = editRol.permisos.map((x, idx) => idx === i ? { ...x, acceso: !x.acceso } : x);
                        setEditRol({ ...editRol, permisos: copia });
                      }}
                    />
                    <span>{p.modulo}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn--secondary" onClick={() => setEditRol(null)} disabled={savingPermisos}>Cancelar</button>
              <button className="btn btn--primary" onClick={handleSaveEditRol} disabled={savingPermisos}>{savingPermisos ? 'Guardando…' : 'Guardar cambios'}</button>
            </div>
          </div>
        </div>
      )}

      {/* ══════════ Modal: Nuevo rol ══════════ */}
      {showNuevoRol && (
        <div className="modal-overlay" onClick={() => setShowNuevoRol(false)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Nuevo rol</h2>
              <button className="modal-close" onClick={() => setShowNuevoRol(false)}><IconClose /></button>
            </div>
            <div className="modal-body">
              <div className="modal-form">
                <div className="modal-field modal-field--full">
                  <label className="field-label">Nombre del rol</label>
                  <input
                    className="field-input"
                    value={nuevoRol.nombre}
                    onChange={(e) => setNuevoRol((p) => ({ ...p, nombre: e.target.value }))}
                    placeholder="Ej. Coordinador"
                  />
                </div>
                <div className="modal-field modal-field--full">
                  <label className="field-label">Descripción</label>
                  <input
                    className="field-input"
                    value={nuevoRol.descripcion}
                    onChange={(e) => setNuevoRol((p) => ({ ...p, descripcion: e.target.value }))}
                    placeholder="Breve descripción del rol"
                  />
                </div>
                <div className="modal-field modal-field--full">
                  <label className="field-label">Permisos de módulos</label>
                  <div className="roles-permiso-grid">
                    {MODULOS.map((m) => (
                      <label key={m} className={'roles-permiso-toggle' + (nuevoRol.permisos[m] ? ' roles-permiso-toggle--on' : '')} onClick={() => setNuevoRol((p) => ({ ...p, permisos: { ...p.permisos, [m]: !p.permisos[m] } }))}>
                        <input type="checkbox" checked={nuevoRol.permisos[m]} onChange={() => {}} />
                        <span>{m}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn--secondary" onClick={() => setShowNuevoRol(false)}>Cancelar</button>
              <button className="btn btn--primary" onClick={handleCrearRol} disabled={!nuevoRol.nombre.trim()}>Crear rol</button>
            </div>
          </div>
        </div>
      )}

      {/* ══════════ Modal: Asignar rol ══════════ */}
      {asignando && (
        <div className="modal-overlay" onClick={() => setAsignando(null)}>
          <div className="modal-container modal-container--sm" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Asignar rol</h2>
              <button className="modal-close" onClick={() => setAsignando(null)}><IconClose /></button>
            </div>
            <div className="modal-body">
              <p style={{ marginBottom: '1rem', fontSize: '0.9rem' }}>
                Selecciona el rol para <strong>{asignando.nombre}</strong>
              </p>
              <div className="roles-rol-select-group">
                {ROL_OPTIONS.map((r) => (
                  <label key={r} className={'roles-rol-option' + (rolSeleccionado === r ? ' roles-rol-option--active' : '')}>
                    <input
                      type="radio"
                      name="rol"
                      value={r}
                      checked={rolSeleccionado === r}
                      onChange={() => setRolSeleccionado(r)}
                    />
                    {ROL_LABELS[r]}
                  </label>
                ))}
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn--secondary" onClick={() => setAsignando(null)}>Cancelar</button>
              <button className="btn btn--primary" onClick={handleAsignarRol} disabled={!rolSeleccionado}>Confirmar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
