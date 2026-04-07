import { useState, useEffect } from 'react';

/**
 * Gestiona el tema claro/oscuro de la aplicación.
 * Persiste la preferencia en localStorage y la aplica como
 * data-theme en el elemento <html> para que los selectores CSS
 * [data-theme="dark"] funcionen globalmente.
 */
export function useTheme() {
  const [dark, setDark] = useState(() => localStorage.getItem('theme') === 'dark');

  useEffect(() => {
    document.documentElement.dataset.theme = dark ? 'dark' : 'light';
    localStorage.setItem('theme', dark ? 'dark' : 'light');
  }, [dark]);

  return { dark, toggle: () => setDark((d) => !d) };
}
