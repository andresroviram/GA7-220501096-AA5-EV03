import React, { useState } from 'react';

/* ─── Datos de configuración ── */
const ROLES_INIT = [
  { id: 1, rol: 'Administrador', descripcion: 'Acceso completo al sistema' },
  { id: 2, rol: 'Profesor',      descripcion: 'Gestión de calificaciones y grupos' },
  { id: 3, rol: 'Estudiante',    descripcion: 'Consulta de notas y horarios' },
  { id: 4, rol: 'Padre/Tutor',   descripcion: 'Seguimiento de acudidos' },
];

const MODULOS = ['Dashboard', 'Docentes', 'Estudiantes', 'Calificaciones', 'Grupos/Horarios', 'Materias', 'Reportes', 'Configuraciones'];

const PERMISOS_INIT = {
  1: MODULOS.reduce((a, m) => ({ ...a, [m]: true }), {}),
  2: { Dashboard: true, Docentes: false, Estudiantes: true, Calificaciones: true, 'Grupos/Horarios': true, Materias: true, Reportes: true, Configuraciones: false },
  3: { Dashboard: true, Docentes: false, Estudiantes: false, Calificaciones: true, 'Grupos/Horarios': true, Materias: false, Reportes: false, Configuraciones: false },
  4: { Dashboard: true, Docentes: false, Estudiantes: true, Calificaciones: true, 'Grupos/Horarios': true, Materias: false, Reportes: true, Configuraciones: false },
};

const PARAMS_INIT = {
  institucion: 'Institución Educativa Demo',
  cicloActual: '2025-I',
  maxEstPorGrupo: '35',
  correoContacto: 'admin@institucion.edu',
  escalaMin: '0',
  escalaMax: '10',
  notaAprobatoria: '6',
};

import { IconSave, IconShield, IconSettings } from '../components/Icons';

/* ─── Sección de permisos ── */
function RolesPermisos() {
  const [permisos, setPermisos] = useState(PERMISOS_INIT);
  const [saved, setSaved] = useState(false);

  const toggle = (rolId, modulo) =>
    setPermisos((p) => ({ ...p, [rolId]: { ...p[rolId], [modulo]: !p[rolId][modulo] } }));

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="config-section">
      <div className="config-section-header">
        <div className="config-section-icon"><IconShield /></div>
        <div>
          <h3 className="config-section-title">Roles y Permisos</h3>
          <p className="config-section-sub">Controla el acceso a cada módulo por rol de usuario.</p>
        </div>
      </div>
      <div className="permisos-table-wrapper">
        <table className="permisos-table">
          <thead>
            <tr>
              <th className="permisos-th permisos-th--rol">Módulo</th>
              {ROLES_INIT.map((r) => (
                <th key={r.id} className="permisos-th permisos-th--check">
                  <div className="permisos-rol-name">{r.rol}</div>
                  <div className="permisos-rol-desc">{r.descripcion}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {MODULOS.map((m) => (
              <tr key={m} className="permisos-row">
                <td className="permisos-td permisos-td--modulo">{m}</td>
                {ROLES_INIT.map((r) => (
                  <td key={r.id} className="permisos-td permisos-td--check">
                    <label className="permiso-toggle">
                      <input
                        type="checkbox"
                        checked={!!permisos[r.id]?.[m]}
                        onChange={() => toggle(r.id, m)}
                        disabled={r.id === 1}
                      />
                      <span className="permiso-toggle-slider" />
                    </label>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'flex-end' }}>
        <button className="btn btn--primary" onClick={handleSave}>
          <IconSave /> {saved ? '¡Guardado!' : 'Guardar Permisos'}
        </button>
      </div>
    </div>
  );
}

/* ─── Sección de parámetros del sistema ── */
function Parametros() {
  const [form, setForm] = useState(PARAMS_INIT);
  const [saved, setSaved] = useState(false);

  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));
  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };

  const fields = [
    { key: 'institucion',      label: 'Nombre de la Institución',    type: 'text',   col: 2 },
    { key: 'cicloActual',      label: 'Ciclo Académico Actual',       type: 'text',   col: 1 },
    { key: 'maxEstPorGrupo',   label: 'Máx. Estudiantes por Grupo',   type: 'number', col: 1 },
    { key: 'correoContacto',   label: 'Correo de Contacto',           type: 'email',  col: 2 },
    { key: 'escalaMin',        label: 'Nota Mínima',                  type: 'number', col: 1 },
    { key: 'escalaMax',        label: 'Nota Máxima',                  type: 'number', col: 1 },
    { key: 'notaAprobatoria',  label: 'Nota Aprobatoria',             type: 'number', col: 1 },
  ];

  return (
    <div className="config-section">
      <div className="config-section-header">
        <div className="config-section-icon"><IconSettings /></div>
        <div>
          <h3 className="config-section-title">Parámetros del Sistema</h3>
          <p className="config-section-sub">Configuración general de la institución y reglas académicas.</p>
        </div>
      </div>
      <div className="params-grid">
        {fields.map((f) => (
          <div key={f.key} className={`modal-field${f.col === 2 ? ' modal-field--full' : ''}`}>
            <label className="modal-label">{f.label}</label>
            <input
              className="modal-input"
              type={f.type}
              value={form[f.key]}
              onChange={(e) => set(f.key, e.target.value)}
            />
          </div>
        ))}
      </div>
      <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'flex-end' }}>
        <button className="btn btn--primary" onClick={handleSave}>
          <IconSave /> {saved ? '¡Guardado!' : 'Guardar Parámetros'}
        </button>
      </div>
    </div>
  );
}

/* ─── Componente principal ── */
function Configuraciones() {
  return (
    <div className="module-page">
      <RolesPermisos />
      <Parametros />
    </div>
  );
}

export default Configuraciones;
