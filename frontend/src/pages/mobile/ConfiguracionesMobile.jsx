import React, { useState } from 'react';
import { IconShield, IconSettings, IconSave } from '../../components/Icons';

const PARAMS_INIT = {
  institucion:     'Institución Educativa Demo',
  cicloActual:     '2025-I',
  maxEstPorGrupo:  '35',
  correoContacto:  'admin@institucion.edu',
  notaAprobatoria: '6',
};

function ConfiguracionesMobile() {
  const [activeTab, setActiveTab] = useState('params');
  const [form,      setForm]      = useState(PARAMS_INIT);
  const [saved,     setSaved]     = useState(false);

  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="m-page">

      {/* Tabs */}
      <div className="config-submenu" style={{ width: '100%', boxSizing: 'border-box' }}>
        <button
          className={`config-submenu-item${activeTab === 'params' ? ' config-submenu-item--active' : ''}`}
          onClick={() => setActiveTab('params')}
          style={{ flex: 1, justifyContent: 'center' }}
        >
          <IconSettings /> Parámetros
        </button>
        <button
          className={`config-submenu-item${activeTab === 'roles' ? ' config-submenu-item--active' : ''}`}
          onClick={() => setActiveTab('roles')}
          style={{ flex: 1, justifyContent: 'center' }}
        >
          <IconShield /> Roles
        </button>
      </div>

      {activeTab === 'params' && (
        <div className="m-card-list">
          <div className="m-entity-card">
            <div className="modal-stack" style={{ gap: '1rem' }}>
              {[
                { key: 'institucion',     label: 'Nombre Institución',     type: 'text'   },
                { key: 'cicloActual',     label: 'Ciclo Académico',         type: 'text'   },
                { key: 'maxEstPorGrupo',  label: 'Máx. Alumnos por Grupo',  type: 'number' },
                { key: 'correoContacto',  label: 'Correo de Contacto',      type: 'email'  },
                { key: 'notaAprobatoria', label: 'Nota Aprobatoria',        type: 'number' },
              ].map((f) => (
                <div key={f.key} className="modal-field">
                  <label className="modal-label">{f.label}</label>
                  <input
                    className="modal-input"
                    type={f.type}
                    value={form[f.key]}
                    onChange={(e) => set(f.key, e.target.value)}
                  />
                </div>
              ))}
              <button className="btn btn--primary" style={{ width: '100%' }} onClick={handleSave}>
                <IconSave /> {saved ? '¡Guardado!' : 'Guardar Parámetros'}
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'roles' && (
        <div className="m-card-list">
          {[
            { rol: 'Administrador', desc: 'Acceso completo al sistema',              color: '#2A9D6F' },
            { rol: 'Profesor',      desc: 'Gestión de calificaciones y grupos',      color: '#3D7BBF' },
            { rol: 'Estudiante',    desc: 'Consulta de notas y horarios',            color: '#BF6B3D' },
            { rol: 'Padre/Tutor',   desc: 'Seguimiento de acudidos',                color: '#7B3DBF' },
          ].map((r) => (
            <div key={r.rol} className="m-entity-card">
              <div className="m-entity-card-header">
                <div>
                  <p className="m-entity-card-name">{r.rol}</p>
                  <p className="m-entity-card-sub">{r.desc}</p>
                </div>
                <span
                  style={{
                    width: 12, height: 12, borderRadius: '50%',
                    background: r.color, display: 'inline-block', flexShrink: 0,
                  }}
                />
              </div>
            </div>
          ))}
          <p className="m-empty" style={{ textAlign: 'center', fontSize: '0.82rem', color: '#6B7C74' }}>
            Gestión avanzada de permisos disponible en escritorio.
          </p>
        </div>
      )}
    </div>
  );
}

export default ConfiguracionesMobile;
