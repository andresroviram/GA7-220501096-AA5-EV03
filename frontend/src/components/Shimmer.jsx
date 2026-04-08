import React from 'react';

/**
 * Shimmer — componente de skeleton loader reutilizable.
 *
 * Variantes:
 *  - 'table'        → filtro (2 campos) + tabla con N filas  (páginas desktop con tabla)
 *  - 'cards'        → grid de N tarjetas con permisos         (Roles)
 *  - 'stat-cards'   → 4 stat-cards + 2 widgets               (Dashboard)
 *  - 'mobile-list'  → N items de lista mobile
 *  - 'config-table' → tabla de permisos (Configuraciones)
 *  - 'bar'          → un bloque genérico de líneas
 */
function ShimmerBox({ className = '', style = {} }) {
  return <div className={`shimmer-box ${className}`} style={style} />;
}

export default function Shimmer({ variant = 'table', rows = 5, count = 4 }) {
  /* ── Tabla con filtros ─────────────────────────────────────── */
  if (variant === 'table') {
    return (
      <div className="shimmer-page">
        {/* filtro */}
        <div className="shimmer-filter-card">
          <ShimmerBox className="shimmer-filter-title" />
          <div className="shimmer-filter-fields">
            {[0, 1, 2].map((i) => (
              <div key={i} className="shimmer-filter-field">
                <ShimmerBox className="shimmer-label" />
                <ShimmerBox className="shimmer-input" />
              </div>
            ))}
          </div>
        </div>
        {/* tabla */}
        <div className="shimmer-table-card">
          <div className="shimmer-table-header">
            {[0, 1, 2, 3].map((i) => <ShimmerBox key={i} className="shimmer-th" />)}
          </div>
          {Array.from({ length: rows }).map((_, i) => (
            <div key={i} className="shimmer-row">
              <ShimmerBox className="shimmer-avatar" />
              <ShimmerBox className="shimmer-cell shimmer-cell--lg" />
              <ShimmerBox className="shimmer-cell shimmer-cell--md" />
              <ShimmerBox className="shimmer-cell shimmer-cell--sm" />
              <ShimmerBox className="shimmer-cell shimmer-cell--action" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  /* ── Cards (Roles) ─────────────────────────────────────────── */
  if (variant === 'cards') {
    return (
      <div className="shimmer-page">
        <div className="shimmer-page-header">
          <ShimmerBox className="shimmer-page-title" />
          <ShimmerBox className="shimmer-btn" />
        </div>
        {/* tabs */}
        <div className="shimmer-tabs">
          <ShimmerBox className="shimmer-tab" />
          <ShimmerBox className="shimmer-tab" />
        </div>
        <div className="shimmer-cards-grid">
          {Array.from({ length: count }).map((_, i) => (
            <div key={i} className="shimmer-card">
              <div className="shimmer-card-header">
                <ShimmerBox className="shimmer-card-icon" />
                <div className="shimmer-card-titles">
                  <ShimmerBox className="shimmer-card-name" />
                  <ShimmerBox className="shimmer-card-desc" />
                </div>
              </div>
              <div className="shimmer-chips">
                {[0, 1, 2, 3].map((j) => <ShimmerBox key={j} className="shimmer-chip" />)}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  /* ── Stat cards + widgets (Dashboard) ─────────────────────── */
  if (variant === 'stat-cards') {
    return (
      <div className="shimmer-page">
        <div className="shimmer-stats-grid">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="shimmer-stat-card">
              <ShimmerBox className="shimmer-stat-icon" />
              <div className="shimmer-stat-texts">
                <ShimmerBox className="shimmer-stat-value" />
                <ShimmerBox className="shimmer-stat-label" />
              </div>
            </div>
          ))}
        </div>
        <div className="shimmer-widgets-row">
          <ShimmerBox className="shimmer-widget" />
          <ShimmerBox className="shimmer-widget" />
        </div>
        <div className="shimmer-widgets-row">
          <ShimmerBox className="shimmer-widget shimmer-widget--tall" />
          <ShimmerBox className="shimmer-widget shimmer-widget--tall" />
        </div>
      </div>
    );
  }

  /* ── Mobile lista ──────────────────────────────────────────── */
  if (variant === 'mobile-list') {
    return (
      <div className="shimmer-mobile-list">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="shimmer-mobile-item">
            <ShimmerBox className="shimmer-mobile-avatar" />
            <div className="shimmer-mobile-texts">
              <ShimmerBox className="shimmer-mobile-name" />
              <ShimmerBox className="shimmer-mobile-sub" />
            </div>
            <ShimmerBox className="shimmer-mobile-badge" />
          </div>
        ))}
      </div>
    );
  }

  /* ── Config tabla de permisos ──────────────────────────────── */
  if (variant === 'config-table') {
    return (
      <div className="shimmer-config">
        <div className="shimmer-config-header">
          <ShimmerBox className="shimmer-config-icon" />
          <div>
            <ShimmerBox className="shimmer-config-title" />
            <ShimmerBox className="shimmer-config-sub" />
          </div>
        </div>
        <div className="shimmer-table-card shimmer-table-card--no-mt">
          <div className="shimmer-table-header">
            {[0, 1, 2, 3, 4].map((i) => <ShimmerBox key={i} className="shimmer-th" />)}
          </div>
          {Array.from({ length: rows }).map((_, i) => (
            <div key={i} className="shimmer-row shimmer-row--config">
              <ShimmerBox className="shimmer-cell shimmer-cell--md" />
              {[0, 1, 2, 3].map((j) => <ShimmerBox key={j} className="shimmer-cell shimmer-cell--check" />)}
            </div>
          ))}
        </div>
      </div>
    );
  }

  /* ── Genérico (barras) ─────────────────────────────────────── */
  return (
    <div className="shimmer-page">
      {Array.from({ length: rows }).map((_, i) => (
        <ShimmerBox key={i} className="shimmer-bar" style={{ width: `${70 + (i % 3) * 10}%` }} />
      ))}
    </div>
  );
}
