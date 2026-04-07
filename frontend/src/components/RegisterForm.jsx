import React, { useState } from 'react';
import authService from '../services/authService';
import { IconCheckCircle, IconAlertTriangle } from './Icons';
import Button from './ui/Button';
import InputText from './ui/InputText';
import InputPassword from './ui/InputPassword';
import DatePicker from './ui/DatePicker';

function RegisterForm({ onBackToLogin, onRegisterSuccess }) {
  const [form, setForm] = useState({
    fullName:       '',
    username:       '',
    identification: '',
    birthDate:      '',
    password:       '',
    confirmPassword:'',
  });
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const { fullName, username, identification, birthDate, password, confirmPassword } = form;

    if (!fullName || !username || !identification || !birthDate || !password || !confirmPassword) {
      setError('Por favor, completa todos los campos.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    setLoading(true);
    try {
      await authService.register({ fullName, username, identification, birthDate, password });
      setSuccess(true);
      // Redirigir al login tras 1.5 s
      setTimeout(() => onRegisterSuccess(), 1500);
    } catch (err) {
      if (err.response?.status === 409) {
        setError('El correo ya está registrado. Intenta iniciar sesión.');
      } else if (err.response?.status === 400) {
        setError('Datos inválidos. Revisa los campos.');
      } else {
        setError('Error de conexión. Verifica que el servidor esté activo.');
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
        <div className="login-deco login-deco--top" aria-hidden="true" />
        <div className="login-deco login-deco--bottom" aria-hidden="true" />

        <div className="login-form-container register-form-container">
          <h1 className="login-title">Registrar cuenta</h1>
          <p className="login-subtitle">¡Bienvenido! Por favor, ingresa tus datos.</p>

          {success ? (
            <div className="register-success" role="status">
              <IconCheckCircle /> ¡Cuenta creada exitosamente! Redirigiendo al login…
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate>

              {/* Nombre y apellido */}
              <InputText
                label="Nombre y apellido"
                id="fullName"
                name="fullName"
                type="text"
                value={form.fullName}
                onChange={handleChange}
                placeholder="John Doe"
                disabled={loading}
                autoComplete="name"
                autoFocus
                leftIcon={
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                }
              />

              {/* Correo */}
              <InputText
                label="Correo Electrónico"
                id="reg-username"
                name="username"
                type="email"
                value={form.username}
                onChange={handleChange}
                placeholder="johndoe@gmail.com"
                disabled={loading}
                autoComplete="email"
                leftIcon={
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                    <polyline points="22,6 12,13 2,6"/>
                  </svg>
                }
              />

              {/* Número de identificación */}
              <InputText
                label="Numero de identificación"
                id="identification"
                name="identification"
                type="text"
                value={form.identification}
                onChange={handleChange}
                placeholder="Ingresar identificación"
                disabled={loading}
                leftIcon={
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="2" y="5" width="20" height="14" rx="2"/>
                    <line x1="2" y1="10" x2="22" y2="10"/>
                  </svg>
                }
              />

              {/* Fecha de nacimiento */}
              <DatePicker
                label="Fecha de nacimiento"
                id="birthDate"
                name="birthDate"
                value={form.birthDate}
                onChange={handleChange}
                disabled={loading}
              />

              {/* Contraseña */}
              <InputPassword
                label="Contraseña"
                id="reg-password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Ingresar contraseña"
                disabled={loading}
                autoComplete="new-password"
              />

              {/* Confirmar contraseña */}
              <InputPassword
                label="Confirmar contraseña"
                id="confirmPassword"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder="Confirmar la contraseña"
                disabled={loading}
                autoComplete="new-password"
              />

              {/* Error */}
              {error && (
                <div className="error-alert" role="alert">
                  <IconAlertTriangle /> {error}
                </div>
              )}

              {/* Botón principal */}
              <Button type="submit" variant="primary" fullWidth loading={loading}>
                {loading ? 'Creando cuenta...' : 'Crear mi cuenta'}
              </Button>

              {/* Volver al login */}
              <Button
                type="button"
                variant="secondary"
                fullWidth
                disabled={loading}
                onClick={onBackToLogin}
              >
                Ya tengo cuenta — Iniciar Sesión
              </Button>

            </form>
          )}

          <div className="login-dot" aria-hidden="true" />
          <p className="login-version">v 1.0.0</p>
        </div>
      </div>
    </div>
  );
}

export default RegisterForm;
