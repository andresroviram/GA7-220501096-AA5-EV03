import React, { useState } from 'react';

function ForgotPasswordForm({ onBackToLogin }) {
  const [correo, setCorreo]     = useState('');
  const [fieldError, setFieldError] = useState('');
  const [loading, setLoading]   = useState(false);
  const [sent, setSent]         = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFieldError('');

    if (!correo.trim()) {
      setFieldError('El correo es requerido.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo.trim())) {
      setFieldError('Ingresa un correo válido.');
      return;
    }

    setLoading(true);
    // Simula el envío — en producción se llamaría al endpoint de reset
    await new Promise((r) => setTimeout(r, 1000));
    setLoading(false);
    setSent(true);
  };

  return (
    <div className="forgot-page">
      {/* Logo / marca */}
      <div className="forgot-logo">
        <span className="forgot-logo-text">Sistema<br/>Integral</span>
      </div>

      <div className="forgot-card">
        {sent ? (
          /* ── Estado: correo enviado ── */
          <div className="forgot-success">
            <div className="forgot-success-icon" aria-hidden="true">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#2A9D6F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
            </div>
            <h2 className="forgot-title">Revisa tu correo</h2>
            <p className="forgot-subtitle">
              Si <strong>{correo}</strong> está registrado, recibirás un enlace para restablecer tu contraseña.
            </p>
            <button
              type="button"
              className="login-button login-button--primary"
              onClick={onBackToLogin}
            >
              Volver al inicio de sesión
            </button>
          </div>
        ) : (
          /* ── Formulario ── */
          <>
            <h2 className="forgot-title">¿Olvidaste tu contraseña?</h2>
            <p className="forgot-subtitle">No te preocupes, te ayudaremos a cambiarla.</p>

            <form onSubmit={handleSubmit} noValidate>
              <div className="form-group">
                <label htmlFor="forgot-correo" className="form-label">Correo Electrónico</label>
                <div className={`input-wrapper${fieldError ? ' input-wrapper--error' : ''}`}>
                  <span className="input-icon" aria-hidden="true">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                      <polyline points="22,6 12,13 2,6"/>
                    </svg>
                  </span>
                  <input
                    id="forgot-correo"
                    type="email"
                    className="form-input"
                    placeholder="johndoe@gmail.com"
                    value={correo}
                    onChange={(e) => { setCorreo(e.target.value); setFieldError(''); }}
                    autoComplete="email"
                    autoFocus
                  />
                </div>
                {fieldError && <p className="field-error">{fieldError}</p>}
              </div>

              <button
                type="submit"
                className="login-button login-button--primary"
                disabled={loading}
              >
                {loading ? (
                  <span className="loading-text">
                    <span className="spinner" aria-hidden="true" />
                    Enviando...
                  </span>
                ) : (
                  'Restablecer contraseña'
                )}
              </button>
            </form>

            <button
              type="button"
              className="forgot-back-link"
              onClick={onBackToLogin}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <polyline points="15 18 9 12 15 6"/>
              </svg>
              Regresar al inicio de sesión
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default ForgotPasswordForm;
