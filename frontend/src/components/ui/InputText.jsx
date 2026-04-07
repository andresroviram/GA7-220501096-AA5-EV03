import React from 'react';

/**
 * InputText — campo de texto reutilizable.
 *
 * Props:
 *   label       string
 *   error       string — mensaje de error (muestra borde rojo + mensaje)
 *   leftIcon    ReactNode
 *   rightIcon   ReactNode
 *   hint        string — texto de ayuda debajo del campo
 *   ...rest     props nativas de <input>
 */
function InputText({
  label,
  error,
  leftIcon,
  rightIcon,
  hint,
  id,
  className = '',
  ...rest
}) {
  const inputId = id || `input-${Math.random().toString(36).slice(2, 7)}`;

  return (
    <div className={`ui-field ${className}`}>
      {label && (
        <label htmlFor={inputId} className="ui-field__label">
          {label}
        </label>
      )}
      <div className={`ui-field__wrapper${error ? ' ui-field__wrapper--error' : ''}`}>
        {leftIcon && (
          <span className="ui-field__icon ui-field__icon--left" aria-hidden="true">
            {leftIcon}
          </span>
        )}
        <input
          id={inputId}
          className={`ui-field__input${leftIcon ? ' ui-field__input--pl' : ''}${rightIcon ? ' ui-field__input--pr' : ''}`}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
          {...rest}
        />
        {rightIcon && (
          <span className="ui-field__icon ui-field__icon--right" aria-hidden="true">
            {rightIcon}
          </span>
        )}
      </div>
      {error && <p id={`${inputId}-error`} className="ui-field__error" role="alert">{error}</p>}
      {!error && hint && <p id={`${inputId}-hint`} className="ui-field__hint">{hint}</p>}
    </div>
  );
}

export default InputText;
