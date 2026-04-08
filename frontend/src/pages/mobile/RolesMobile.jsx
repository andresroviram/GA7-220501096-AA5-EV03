import React, { useEffect, useState } from 'react';
import Shimmer from '../../components/Shimmer';
import { getRoles } from '../../services/rolesService';
import { mockUsuariosPendientes } from '../../data/mockUsuariosPendientes';
import api from '../../services/api';
import { IconShield, IconUsers, IconEdit, IconCheckCircle } from '../../components/Icons';

const ROL_OPTIONS = ['administrativo', 'docente', 'padre'];
const ROL_LABELS  = { administrativo: 'Administrador', docente: 'Docente', padre: 'Padre/Acudiente' };
const USE_MOCK    = import.meta.env.VITE_USE_MOCK === 'true';

export default function RolesMobile() {
  const [tab, setTab]               = useState('roles');
  const [roles, setRoles]           = useState([]);
  const [pendientes, setPendientes] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [asignando, setAsignando]   = useState(null);
  const [rolSel, setRolSel]         = useState('');
  const [toast, setToast]           = useState(null);

  useEffect(() => {
    Promise.all([
      getRoles(),
      USE_MOCK
        ? Promise.resolve(mockUsuariosPendientes)
        : api.get('/usuarios?tipo=pendiente').then((r) => r.data),
    ]).then(([r, p]) => { setRoles(r); setPendientes(p); }).finally(() => setLoading(false));
  }, []);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  const handleAsignar = async () => {
    if (!rolSel || !asignando) return;
    try {
      if (!USE_MOCK) await api.patch(`/usuarios/${asignando.id}`, { tipo_usuario: rolSel });
      setPendientes((p) => p.filter((u) => u.id !== asignando.id));
      showToast(`Rol asignado a ${asignando.nombre}`);
    } catch { showToast('Error al asignar el rol'); }
    setAsignando(null);
    setRolSel('');
  };

  if (loading) return <Shimmer variant="cards" count={3} />;

  return (
    <div className="m-page">

      {toast && <div className="roles-toast roles-toast--success">{toast}</div>}

      {/* Tab switcher */}
      <div className="roles-m-tabs">
        <button className={'roles-m-tab' + (tab === 'roles' ? ' roles-m-tab--active' : '')} onClick={() => setTab('roles')}>
          <IconShield /> Roles
        </button>
        <button className={'roles-m-tab' + (tab === 'pendientes' ? ' roles-m-tab--active' : '')} onClick={() => setTab('pendientes')}>
          <IconUsers /> Sin rol {pendientes.length > 0 && <span className="roles-badge">{pendientes.length}</span>}
        </button>
      </div>

      {/* ── Roles ── */}
      {tab === 'roles' && roles.map((rol) => (
        <div key={rol.id} className="m-entity-card">
          <div className="m-entity-card-header">
            <div>
              <p className="m-entity-card-name">{rol.nombre}</p>
              <p className="m-entity-card-sub">{rol.descripcion}</p>
            </div>
          </div>
          <div className="rol-card-permisos" style={{ marginTop: '0.5rem' }}>
            {rol.permisos.filter((p) => p.acceso).map((p) => (
              <span key={p.modulo} className="rol-permiso-chip rol-permiso-chip--on">{p.modulo}</span>
            ))}
          </div>
        </div>
      ))}

      {/* ── Pendientes ── */}
      {tab === 'pendientes' && (
        pendientes.length === 0
          ? (
            <div className="roles-empty">
              <IconCheckCircle />
              <p>No hay usuarios pendientes.</p>
            </div>
          )
          : pendientes.map((u) => (
            <div key={u.id} className="m-entity-card">
              <div className="m-entity-card-header">
                <div>
                  <p className="m-entity-card-name">{u.nombre}</p>
                  <p className="m-entity-card-sub">{u.correo}</p>
                </div>
                <span className="status-badge status-badge--warning">Sin rol</span>
              </div>
              <div className="m-entity-card-row" style={{ fontSize: '0.8rem' }}>
                Registrado: {u.fechaRegistro}
              </div>
              <div className="m-entity-card-actions">
                <button className="btn btn--primary btn--sm" onClick={() => { setAsignando(u); setRolSel(''); }}>
                  <IconEdit /> Asignar rol
                </button>
              </div>
            </div>
          ))
      )}

      {/* Bottom sheet: asignar rol */}
      {asignando && (
        <div className="mobile-drawer-overlay" onClick={() => setAsignando(null)}>
          <div className="roles-bottom-sheet" onClick={(e) => e.stopPropagation()}>
            <p className="roles-bs-title">Asignar rol a <strong>{asignando.nombre}</strong></p>
            <div className="roles-rol-select-group">
              {ROL_OPTIONS.map((r) => (
                <label key={r} className={'roles-rol-option' + (rolSel === r ? ' roles-rol-option--active' : '')}>
                  <input type="radio" name="rolmobile" value={r} checked={rolSel === r} onChange={() => setRolSel(r)} />
                  {ROL_LABELS[r]}
                </label>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
              <button className="btn btn--secondary" style={{ flex: 1 }} onClick={() => setAsignando(null)}>Cancelar</button>
              <button className="btn btn--primary" style={{ flex: 1 }} onClick={handleAsignar} disabled={!rolSel}>Confirmar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
