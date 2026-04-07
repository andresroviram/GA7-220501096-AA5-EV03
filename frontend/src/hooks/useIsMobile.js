import { useState, useEffect } from 'react';

/** Breakpoint en px: ≤ 767 = móvil, ≥ 768 = escritorio */
export const MOBILE_BREAKPOINT = 768;

/**
 * Devuelve `true` cuando el viewport cae en breakpoint móvil.
 * Re-evalúa automáticamente al cambiar el tamaño de la ventana.
 */
export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== 'undefined' && window.innerWidth < MOBILE_BREAKPOINT,
  );

  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const handler = (e) => setIsMobile(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  return isMobile;
}
