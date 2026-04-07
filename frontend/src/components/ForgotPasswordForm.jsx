import React, { useState } from 'react';
import authService from '../services/authService';
import Button from './ui/Button';
import InputText from './ui/InputText';
import InputPassword from './ui/InputPassword';

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

function ForgotPasswordForm({ onBackToLogin }) {
  // step: 'email' | 'code' | 'done'
  const [step, setStep]             = useState('email');
  const [correo, setCorreo]         = useState('');
  const [token, setToken]           = useState('');
  const [devToken, setDevToken]     = useState('');  // código visible en dev/mock
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading]       = useState(false);

  /* ── Paso 1: solicitar código ─────────────────────────────── */
  const handleSendCode = async (e) => {
    e.preventDefault();
    setFieldErrors({});

    if (!correo.trim()) {
      setFieldErrors({ correo: 'El correo es requerido.' });
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo.trim())) {
      setFieldErrors({ correo: 'Ingresa un correo válido.' });
      return;
    }

    setLoading(true);
    try {
      const res = await authService.forgotPassword(correo.trim());
      if (res.resetToken) setDevToken(res.resetToken); // solo visible en dev
      setStep('code');
    } catch {
      setFieldErrors({ correo: 'Error de conexión. Intenta de nuevo.' });
    } finally {
      setLoading(false);
    }
  };

  /* ── Paso 2: validar código y cambiar contraseña ────────────── */
  const handleResetPassword = async (e) => {
    e.preventDefault();
    const errors = {};
    if (!token.trim())        errors.token = 'Ingresa el código recibido.';
    if (!newPassword)         errors.newPassword = 'La contraseña es requerida.';
    else if (newPassword.length < 8) errors.newPassword = 'Mínimo 8 caracteres.';
    if (newPassword !== confirmPassword) errors.confirmPassword = 'Las contraseñas no coinciden.';
    if (Object.keys(errors).length) { setFieldErrors(errors); return; }

    setLoading(true);
    try {
      await authService.resetPassword(token.trim().toUpperCase(), newPassword);
      setStep('done');
    } catch (err) {
      const msg = err.response?.data?.message ?? 'Código inválido o expirado.';
      setFieldErrors({ token: msg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-page">
      <div className="forgot-logo">
        <span className="forgot-logo-text">Sistema<br/>Integral</span>
      </div>

      <div className="forgot-card">

          {step === 'done' && (
          <div className="forgot-success">
            <div className="forgot-success-icon" aria-hidden="true">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#2A9D6F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            </div>
            <h2 className="forgot-title">¡Contraseña actualizada!</h2>
            <p className="forgot-subtitle">Ya puedes iniciar sesión con tu nueva contraseña.</p>
            <Button type="button" variant="primary" fullWidth onClick={onBackToLogin}>
              Ir al inicio de sesión
            </Button>
          </div>
        )}

        {/* ── Paso 1: ingresar correo ────────────────────────── */}
        {step === 'email' && (
          <>
            <h2 className="forgot-title">¿Olvidaste tu contraseña?</h2>
            <p className="forgot-subtitle">Ingresa tu correo y te enviaremos un código de recuperación.</p>

            <form onSubmit={handleSendCode} noValidate>
              <InputText
                id="forgot-correo"
                label="Correo Electrónico"
                type="email"
                placeholder="usuario@escuela.edu"
                value={correo}
                onChange={(e) => { setCorreo(e.target.value); setFieldErrors({}); }}
                autoComplete="email"
                autoFocus
                error={fieldErrors.correo}
                leftIcon={
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                    <polyline points="22,6 12,13 2,6"/>
                  </svg>
                }
              />

              <Button type="submit" variant="primary" fullWidth loading={loading}>
                {loading ? 'Enviando...' : 'Enviar código de recuperación'}
              </Button>
            </form>

            <button type="button" className="forgot-back-link" onClick={onBackToLogin}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="15 18 9 12 15 6"/></svg>
              Regresar al inicio de sesión
            </button>
          </>
        )}

        {/* ── Paso 2: ingresar código + nueva contraseña ───────── */}
        {step === 'code' && (
          <>
            <h2 className="forgot-title">Ingresa el código</h2>
            <p className="forgot-subtitle">
              Si <strong>{correo}</strong> está registrado, habrás recibido un código de 6 caracteres.
            </p>

            {/* Aviso dev/mock: muestra el token en pantalla */}
            {devToken && (
              <div className="forgot-dev-hint" role="status">
                <span className="forgot-dev-hint-label">{USE_MOCK ? 'Modo mock' : 'Dev'} — código:</span>
                <strong className="forgot-dev-hint-token">{devToken}</strong>
              </div>
            )}

            <form onSubmit={handleResetPassword} noValidate>
              {/* Código */}
              <InputText
                id="forgot-token"
                label="Código de recuperación"
                type="text"
                placeholder="A1B2C3"
                value={token}
                onChange={(e) => { setToken(e.target.value.toUpperCase()); setFieldErrors((p) => ({ ...p, token: '' })); }}
                maxLength={16}
                autoFocus
                autoComplete="one-time-code"
                error={fieldErrors.token}
                leftIcon={
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                }
              />

              {/* Nueva contraseña */}
              <InputPassword
                id="forgot-password"
                label="Nueva contraseña"
                placeholder="Mínimo 8 caracteres"
                value={newPassword}
                onChange={(e) => { setNewPassword(e.target.value); setFieldErrors((p) => ({ ...p, newPassword: '' })); }}
                autoComplete="new-password"
                error={fieldErrors.newPassword}
              />

              {/* Confirmar contraseña */}
              <InputPassword
                id="forgot-confirm"
                label="Confirmar contraseña"
                placeholder="Repite la contraseña"
                value={confirmPassword}
                onChange={(e) => { setConfirmPassword(e.target.value); setFieldErrors((p) => ({ ...p, confirmPassword: '' })); }}
                autoComplete="new-password"
                error={fieldErrors.confirmPassword}
              />

              <Button type="submit" variant="primary" fullWidth loading={loading}>
                {loading ? 'Actualizando...' : 'Restablecer contraseña'}
              </Button>
            </form>

            <button type="button" className="forgot-back-link" onClick={() => { setStep('email'); setFieldErrors({}); }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="15 18 9 12 15 6"/></svg>
              Cambiar correo
            </button>
          </>
        )}

      </div>
    </div>
  );
}

export default ForgotPasswordForm;
