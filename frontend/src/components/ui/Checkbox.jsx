import React from 'react';

/**
 * Checkbox — casilla de verificación accesible.
 *
 * Props:
 *   label     string | ReactNode — texto visible junto al checkbox
 *   checked   boolean
 *   onChange  (e) => void
 *   error     string
 *   hint      string
 *   ...rest   props nativas de <input type="checkbox">
 */
function Checkbox({ label, error, hint, id, className = '', ...rest }) {
  const inputId = id || `chk-${Math.random().toString(36).slice(2, 7)}`;

  return (
    <div className={`ui-checkbox ${className}`}>
      <label htmlFor={inputId} className="ui-checkbox__label">
        <input
          id={inputId}
          type="checkbox"
          className="ui-checkbox__input"
          aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
          {...rest}
        />
        <span className="ui-checkbox__box" aria-hidden="true">
          <svg className="ui-checkbox__check" width="10" height="10" viewBox="0 0 10 10" fill="none">
            <polyline points="1.5,5 4,7.5 8.5,2.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </span>
        {label && <span className="ui-checkbox__text">{label}</span>}
      </label>
      {error && <p id={`${inputId}-error`} className="ui-field__error" role="alert">{error}</p>}
      {!error && hint && <p id={`${inputId}-hint`} className="ui-field__hint">{hint}</p>}
    </div>
  );
}

export default Checkbox;
