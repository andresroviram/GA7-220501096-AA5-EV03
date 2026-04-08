import React from 'react';

function PendingScreen({ onBackToLogin }) {
  return (
    <div className="pending-page">
      <div className="pending-card">
        <div className="pending-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
        </div>
        <h1 className="pending-title">Cuenta pendiente de activación</h1>
        <p className="pending-body">
          Tu cuenta ha sido creada correctamente, pero aún no tienes un rol asignado.
          Comunícate con el administrador del sistema para que te habilite el acceso.
        </p>
        <div className="pending-contact">
          <span className="pending-contact-label">Contacto del administrador</span>
          <span className="pending-contact-value">admin@escuela.edu</span>
        </div>
        <button className="btn btn--primary pending-btn" onClick={onBackToLogin}>
          Volver al inicio de sesión
        </button>
      </div>
    </div>
  );
}

export default PendingScreen;
