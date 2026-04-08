import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import { IconAlertTriangle } from './Icons';
import Button from './ui/Button';
import InputText from './ui/InputText';
import InputPassword from './ui/InputPassword';
import Checkbox from './ui/Checkbox';

const DEMO_USERS = [
  { label: 'Administrador',     correo: 'admin@escuela.edu',          password: 'Admin123!',   color: '#2A9D6F' },
  { label: 'Docente',           correo: 'maria.garcia@escuela.edu',   password: 'Docente123!', color: '#1976D2' },
  { label: 'Padre / Acudiente', correo: 'juan.rodriguez@escuela.edu', password: 'Padre123!',   color: '#7B1FA2' },
];

function LoginForm({ onLoginSuccess, onShowRegister, onShowForgot }) {
  const navigate                        = useNavigate();
  const [correo, setCorreo]             = useState('');
  const [password, setPassword]         = useState('');
  const [remember, setRemember]         = useState(false);
  const [fieldErrors, setFieldErrors]   = useState({});
  const [generalError, setGeneralError] = useState('');
  const [loading, setLoading]           = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFieldErrors({});
    setGeneralError('');

    const errors = {};
    if (!correo.trim())   errors.correo   = 'El correo es requerido.';
    if (!password.trim()) errors.password = 'La contraseña es requerida.';
    if (Object.keys(errors).length > 0) { setFieldErrors(errors); return; }

    setLoading(true);
    try {
      await authService.login(correo, password, remember);
      onLoginSuccess();
    } catch (err) {
      if (err.code === 'USER_PENDING') {
        navigate('/pendiente', { replace: true });
        return;
      }
      if (err.response?.status === 401) {
        setFieldErrors({ password: 'Contraseña incorrecta' });
      } else if (err.response?.status === 400) {
        setGeneralError('Datos inválidos. Revisa los campos.');
      } else {
        setGeneralError('Error de conexión. Verifica que el servidor esté activo.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">

      {/* ── Panel izquierdo: marca ─────────────────────────── */}
      <div className="login-left" aria-hidden="true">
        <div className="login-brand-circle">
          <span className="login-brand-text">Sistema<br/>Integral</span>
        </div>
      </div>

      {/* ── Panel derecho: formulario ──────────────────────── */}
      <div className="login-right">
        {/* Círculo decorativo superior derecho */}
        <div className="login-deco login-deco--top" aria-hidden="true" />
        {/* Círculo decorativo inferior derecho */}
        <div className="login-deco login-deco--bottom" aria-hidden="true" />

        <div className="login-form-container">
          <h1 className="login-title">Accede a tu cuenta</h1>
          <p className="login-subtitle">¡Bienvenido! Por favor, ingresa tus datos.</p>

          <form onSubmit={handleSubmit} noValidate>

            {/* Correo */}
            <InputText
              label="Correo Electrónico"
              id="correo"
              type="email"
              value={correo}
              onChange={(e) => { setCorreo(e.target.value); setFieldErrors((p) => ({ ...p, correo: '' })); }}
              placeholder="johndoe@gmail.com"
              disabled={loading}
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

            {/* Contraseña */}
            <InputPassword
              label="Contraseña"
              id="password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setFieldErrors((p) => ({ ...p, password: '' })); }}
              placeholder="ingresar contraseña"
              disabled={loading}
              autoComplete="current-password"
              error={fieldErrors.password}
            />

            {/* Opciones extra */}
            <div className="login-options">
              <Checkbox
                id="remember"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                disabled={loading}
                label="Recordar por 30 días"
              />
              <button type="button" className="login-forgot" onClick={onShowForgot}>Olvidé mi contraseña</button>
            </div>

            {/* Error general (conexión / 400) */}
            {generalError && (
              <div className="error-alert" role="alert">
                <IconAlertTriangle /> {generalError}
              </div>
            )}

            {/* Botón principal — Iniciar sesión */}
            <Button type="submit" variant="primary" fullWidth loading={loading}>
              {loading ? 'Verificando...' : 'Iniciar Sesión'}
            </Button>

            {/* Botón secundario — Registrarse */}
            <Button type="button" variant="secondary" fullWidth disabled={loading} onClick={onShowRegister}>
              Registrarme
            </Button>

          </form>

          {/* ── Tarjeta de usuarios demo (solo en desarrollo) ─── */}
          {DEMO_USERS.length > 0 && (
            <div className="demo-card">
              <p className="demo-card__title">Cuentas de prueba</p>
              <div className="demo-card__list">
                {DEMO_USERS.map((u) => (
                  <div key={u.correo} className="demo-card__item">
                    <div>
                      <span className="demo-card__badge" style={{ backgroundColor: u.color }}>
                        {u.label}
                      </span>
                      <span className="demo-card__email">{u.correo}</span>
                    </div>
                    <button
                      type="button"
                      className="demo-card__btn"
                      onClick={() => { setCorreo(u.correo); setPassword(u.password); }}
                    >
                      Usar
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Punto decorativo */}
          <div className="login-dot" aria-hidden="true" />

          {/* Versión */}
          <p className="login-version">v {__APP_VERSION__}</p>
        </div>
      </div>
    </div>
  );
}

export default LoginForm;
