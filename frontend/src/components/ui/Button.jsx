import React from 'react';

/**
 * Button — botón reutilizable.
 *
 * Props:
 *   variant   'primary' | 'secondary' | 'ghost' | 'danger'   (default: 'primary')
 *   size      'sm' | 'md' | 'lg'                              (default: 'md')
 *   fullWidth boolean                                          (default: false)
 *   loading   boolean — muestra spinner y deshabilita
 *   leftIcon  ReactNode
 *   rightIcon ReactNode
 *   ...rest   cualquier prop nativa de <button>
 */
function Button({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  leftIcon,
  rightIcon,
  className = '',
  disabled,
  ...rest
}) {
  const classes = [
    'ui-btn',
    `ui-btn--${variant}`,
    `ui-btn--${size}`,
    fullWidth ? 'ui-btn--full' : '',
    loading   ? 'ui-btn--loading' : '',
    className,
  ].filter(Boolean).join(' ');

  return (
    <button className={classes} disabled={disabled || loading} {...rest}>
      {loading ? (
        <span className="ui-btn__content">
          <span className="ui-spinner" aria-hidden="true" />
          {children}
        </span>
      ) : (
        <span className="ui-btn__content">
          {leftIcon && <span className="ui-btn__icon ui-btn__icon--left" aria-hidden="true">{leftIcon}</span>}
          {children}
          {rightIcon && <span className="ui-btn__icon ui-btn__icon--right" aria-hidden="true">{rightIcon}</span>}
        </span>
      )}
    </button>
  );
}

export default Button;
