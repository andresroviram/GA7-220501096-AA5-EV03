import React from 'react';

/**
 * DatePicker — selector de fecha accesible basado en <input type="date">.
 *
 * Props:
 *   label   string
 *   error   string
 *   hint    string
 *   min     string  'YYYY-MM-DD'
 *   max     string  'YYYY-MM-DD'
 *   ...rest props nativas de <input type="date">
 */
function DatePicker({ label, error, hint, id, className = '', ...rest }) {
  const inputId = id || `dp-${Math.random().toString(36).slice(2, 7)}`;

  const CalIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
      <line x1="16" y1="2" x2="16" y2="6"/>
      <line x1="8" y1="2" x2="8" y2="6"/>
      <line x1="3" y1="10" x2="21" y2="10"/>
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
          <CalIcon />
        </span>
        <input
          id={inputId}
          type="date"
          className="ui-field__input ui-field__input--pl"
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
          {...rest}
        />
      </div>
      {error && <p id={`${inputId}-error`} className="ui-field__error" role="alert">{error}</p>}
      {!error && hint && <p id={`${inputId}-hint`} className="ui-field__hint">{hint}</p>}
    </div>
  );
}

export default DatePicker;
