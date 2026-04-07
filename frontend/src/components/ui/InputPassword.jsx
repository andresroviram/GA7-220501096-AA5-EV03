import React, { useState } from 'react';

/**
 * InputPassword — campo de contraseña con toggle mostrar/ocultar.
 *
 * Props: mismas que InputText (label, error, hint, id, ...rest)
 */
function InputPassword({ label, error, hint, id, className = '', ...rest }) {
  const [visible, setVisible] = useState(false);
  const inputId = id || `input-pwd-${Math.random().toString(36).slice(2, 7)}`;

  const LockIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
    </svg>
  );

  const EyeIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {visible ? (
        <>
          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
          <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
          <line x1="1" y1="1" x2="23" y2="23"/>
        </>
      ) : (
        <>
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
          <circle cx="12" cy="12" r="3"/>
        </>
      )}
    </svg>
  );

  return (
    <div className={`ui-field ${className}`}>
      {label && (
        <label htmlFor={inputId} className="ui-field__label">
          {label}
        </label>
      )}
      <div className={`ui-field__wrapper${error ? ' ui-field__wrapper--error' : ''}`}>
        <span className="ui-field__icon ui-field__icon--left" aria-hidden="true">
          <LockIcon />
        </span>
        <input
          id={inputId}
          type={visible ? 'text' : 'password'}
          className="ui-field__input ui-field__input--pl ui-field__input--pr"
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
          {...rest}
        />
        <button
          type="button"
          className="ui-field__toggle"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? 'Ocultar contraseña' : 'Mostrar contraseña'}
          tabIndex={-1}
        >
          <EyeIcon />
        </button>
      </div>
      {error && <p id={`${inputId}-error`} className="ui-field__error" role="alert">{error}</p>}
      {!error && hint && <p id={`${inputId}-hint`} className="ui-field__hint">{hint}</p>}
    </div>
  );
}

export default InputPassword;
