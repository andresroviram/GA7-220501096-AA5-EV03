import React, { useState } from 'react';
import authService from '../services/authService';

/**
 * LoginForm — componente de formulario de inicio de sesión.
 *
 * Responsabilidades:
 *  - Renderizar los campos de usuario y contraseña.
 *  - Validar que los campos no estén vacíos antes de enviar.
 *  - Llamar a authService.login() y manejar el resultado.
 *  - Mostrar mensajes de error claros al usuario.
 *  - Notificar al componente padre cuando el login es exitoso.
 *
 * @param {Function} onLoginSuccess - Callback invocado tras un login exitoso
 */
function LoginForm({ onLoginSuccess }) {
  // Estado del formulario
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);

  /**
   * Maneja el envío del formulario.
   * Previene el comportamiento nativo del navegador, valida los campos
   * y delega la autenticación al servicio.
   *
   * @param {React.FormEvent} e - Evento submit del formulario
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validación en el cliente: evita peticiones innecesarias al servidor
    if (!username.trim() || !password.trim()) {
      setError('Por favor, complete todos los campos.');
      return;
    }

    setLoading(true);

    try {
      // Llamar al servicio de autenticación
      await authService.login(username, password);

      // Notificar éxito al componente padre (App.jsx)
      onLoginSuccess();
    } catch (err) {
      // Interpretar el código HTTP del error para mostrar un mensaje adecuado
      if (err.response?.status === 401) {
        setError('Usuario o contraseña incorrectos.');
      } else if (err.response?.status === 400) {
        setError('Datos de entrada inválidos. Revisa los campos.');
      } else {
        setError('Error de conexión. Verifica que el servidor esté activo.');
      }
    } finally {
      // Siempre restaurar el estado de carga, haya o no error
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">

        {/* Encabezado */}
        <div className="login-header">
          <div className="login-icon" aria-hidden="true">🔐</div>
          <h1 className="login-title">Iniciar Sesión</h1>
          <p className="login-subtitle">GA7-220501096-AA5-EV01</p>
        </div>

        {/* Formulario principal */}
        <form onSubmit={handleSubmit} noValidate>

          {/* Campo: nombre de usuario */}
          <div className="form-group">
            <label htmlFor="username" className="form-label">
              Usuario
            </label>
            <input
              type="text"
              id="username"
              className="form-input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Ingresa tu usuario"
              disabled={loading}
              autoComplete="username"
              autoFocus
            />
          </div>

          {/* Campo: contraseña */}
          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Ingresa tu contraseña"
              disabled={loading}
              autoComplete="current-password"
            />
          </div>

          {/* Mensaje de error — visible solo cuando hay un error */}
          {error && (
            <div className="error-alert" role="alert">
              <span className="error-icon" aria-hidden="true">⚠️</span>
              {error}
            </div>
          )}

          {/* Botón de envío */}
          <button
            type="submit"
            className="login-button"
            disabled={loading}
          >
            {loading ? (
              <span className="loading-text">
                <span className="spinner" aria-hidden="true" />
                Verificando...
              </span>
            ) : (
              'Ingresar'
            )}
          </button>
        </form>

      </div>
    </div>
  );
}

export default LoginForm;
