import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

/**
 * Punto de entrada principal de la aplicación React.
 * Monta el componente raíz <App /> en el div#root del index.html.
 * StrictMode activa advertencias adicionales en desarrollo.
 */
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
