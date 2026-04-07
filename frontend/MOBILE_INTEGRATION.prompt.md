---
mode: agent
description: Sistema Integral Académico — Patrón de integración Mobile/Desktop
tools: ["read_file", "create_file", "replace_string_in_file", "run_in_terminal"]
---

# Prompt de integración Mobile/Desktop — Sistema Académico

## Objetivo

Este proyecto implementa un patrón **dual-view** donde cada módulo tiene una vista
para escritorio (tabla + sidebar) y una vista para móvil (cards + bottom nav).
El cambio de vista es automático en tiempo real al cruzar el breakpoint de **768 px**.

---

## Arquitectura implementada

```
frontend/src/
├── hooks/
│   └── useIsMobile.js          ← hook central, exporta useIsMobile()
├── layouts/
│   ├── MainLayout.jsx          ← layout escritorio (sidebar + topbar + outlet)
│   └── MobileLayout.jsx        ← layout móvil (topbar + outlet + bottom nav + drawer)
├── pages/
│   ├── Dashboard.jsx           ← ROUTER (thin, elige Desktop vs Mobile)
│   ├── Estudiantes.jsx         ← ROUTER
│   ├── [6 módulos más]         ← ROUTERS
│   ├── desktop/
│   │   ├── DashboardDesktop.jsx    ← vista completa escritorio
│   │   ├── EstudiantesDesktop.jsx
│   │   └── [6 más...]
│   └── mobile/
│       ├── DashboardMobile.jsx     ← vista card/simple para móvil
│       ├── EstudiantesMobile.jsx
│       └── [6 más...]
└── index.css                   ← clases `.m-*`, `.mobile-*`, `.bottom-nav-*`
```

---

## Hook — `useIsMobile.js`

```js
import { useState, useEffect } from 'react';

export const MOBILE_BREAKPOINT = 768;

export function useIsMobile() {
  const query = `(max-width: ${MOBILE_BREAKPOINT - 1}px)`;
  const [isMobile, setIsMobile] = useState(
    () => window.matchMedia(query).matches
  );
  useEffect(() => {
    const mq = window.matchMedia(query);
    const handler = (e) => setIsMobile(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);
  return isMobile;
}
```

---

## Patrón — ROUTER de página (18 líneas, idéntico para todo módulo)

```jsx
// pages/NombreModulo.jsx
import { lazy, Suspense } from 'react';
import { useIsMobile } from '../hooks/useIsMobile';

const Desktop = lazy(() => import('./desktop/NombreModuloDesktop'));
const Mobile  = lazy(() => import('./mobile/NombreModuloMobile'));

function PageLoading() {
  return <div className="page-loading" />;
}

export default function NombreModulo() {
  const isMobile = useIsMobile();
  return (
    <Suspense fallback={<PageLoading />}>
      {isMobile ? <Mobile /> : <Desktop />}
    </Suspense>
  );
}
```

---

## Patrón — Vista DESKTOP (`pages/desktop/`)

- Copia exacta del módulo original (tabla, filtros, modales, paginación).
- Rutas de importación ajustadas: `../` → `../../` (un nivel más profundo).
- Ejemplo de ajuste de paths:
  ```js
  // Antes (en pages/Estudiantes.jsx)
  import { getEstudiantes } from '../services/estudiantesService';
  // Después (en pages/desktop/EstudiantesDesktop.jsx)
  import { getEstudiantes } from '../../services/estudiantesService';
  ```

---

## Patrón — Vista MOBILE (`pages/mobile/`)

Cada vista mobile es independiente, diseñada para pantallas < 768 px.

### Estructura mínima

```jsx
import { useState, useEffect } from 'react';
import { IconSearch } from '../../components/Icons';
import { getItems } from '../../services/xService';

export default function XMobile() {
  const [items, setItems] = useState([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getItems().then(setItems).finally(() => setLoading(false));
  }, []);

  const filtered = items.filter(i =>
    i.nombre.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="m-page">
      {/* Barra de búsqueda */}
      <div className="m-searchbar">
        <IconSearch />
        <input
          className="m-searchbar-input"
          placeholder="Buscar..."
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
      </div>

      {/* Contador */}
      <div className="m-list-header">
        <span className="m-list-count">{filtered.length} resultado(s)</span>
      </div>

      {/* Listado de cards */}
      {loading ? (
        <p className="m-loading">Cargando…</p>
      ) : filtered.length === 0 ? (
        <p className="m-empty">Sin resultados</p>
      ) : (
        <div className="m-card-list">
          {filtered.map(item => (
            <div key={item.id} className="m-entity-card">
              <div className="m-entity-card-header">
                <div>
                  <p className="m-entity-card-name">{item.nombre}</p>
                  <p className="m-entity-card-sub">{item.subtitulo}</p>
                </div>
                <span className="badge badge--active">{item.estado}</span>
              </div>
              <div className="m-entity-card-row">
                <span>{item.dato1}</span>
                <span>·</span>
                <span>{item.dato2}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
```

---

## Cómo agregar un nuevo módulo con soporte mobile

### Paso 1 — Crear la vista Desktop
```bash
cp frontend/src/pages/NuevoModulo.jsx frontend/src/pages/desktop/NuevoModuloDesktop.jsx
sed -i '' "s|from '\.\./|from '../../|g" frontend/src/pages/desktop/NuevoModuloDesktop.jsx
```

### Paso 2 — Crear la vista Mobile
Crea `frontend/src/pages/mobile/NuevoModuloMobile.jsx` usando el patrón
de cards descrito arriba. Importa desde `'../../components/Icons'` y
`'../../services/nuevoModuloService'`.

### Paso 3 — Convertir el módulo a router
Reemplaza el contenido de `frontend/src/pages/NuevoModulo.jsx` con el
**patrón ROUTER** (18 líneas) que apunta a Desktop y Mobile.

### Paso 4 — Registrar en App.jsx
El módulo ya está registrado si hereda de la ruta protegida existente.
Si es nuevo, añade en `App.jsx`:
```jsx
<Route path="/nuevo-modulo" element={
  <PermissionRoute route="nuevo-modulo"><NuevoModulo /></PermissionRoute>
} />
```

### Paso 5 — Agregar al MobileLayout
Si quieres que aparezca en el bottom nav / drawer, agrega a `allNavItems`
en `frontend/src/layouts/MobileLayout.jsx`.

---

## Clases CSS disponibles (`index.css`)

### Layout mobile
| Clase | Uso |
|---|---|
| `.mobile-layout` | Contenedor raíz `flex-col height:100dvh` |
| `.mobile-topbar` | Barra superior 56 px |
| `.mobile-layout-content` | Área de scroll |
| `.bottom-nav` | Barra inferior fija |
| `.bottom-nav-item` | Cada ítem del bottom nav |
| `.bottom-nav-item--active` | Ítem activo |
| `.mobile-drawer-overlay` | Fondo oscuro del drawer |
| `.mobile-drawer` | Panel lateral 280 px |
| `.page-loading` | Placeholder para Suspense |

### Páginas mobile (prefijo `m-`)
| Clase | Uso |
|---|---|
| `.m-page` | Wrapper de página con `padding: 1rem` |
| `.m-hero` | Sección de saludo/título |
| `.m-hero-name` | Nombre del usuario en hero |
| `.m-stats-grid` | Grid 2×2 de estadísticas |
| `.m-stat-card` | Card individual de estadística |
| `.m-quick-links` | Grid 2×2 de accesos rápidos |
| `.m-searchbar` | Barra de búsqueda |
| `.m-searchbar-input` | Input dentro del searchbar |
| `.m-list-header` | Cabecera con contador |
| `.m-card-list` | Contenedor flex-col de cards |
| `.m-entity-card` | Card individual de entidad |
| `.m-entity-card-name` | Nombre en la card |
| `.m-entity-card-sub` | Subtítulo en la card |
| `.m-entity-card-row` | Fila de datos inline |
| `.m-entity-card-actions` | Fila de botones de acción |
| `.m-loading` | Estado de carga |
| `.m-empty` | Estado vacío |

Todas tienen variantes de **dark mode** vía `[data-theme="dark"]` en `index.css`.

---

## Componentes globales reutilizados

| Archivo | Exporta |
|---|---|
| `src/components/Icons.jsx` | `Icon*` (37+ íconos SVG stroke) |
| `src/components/ui/Toast.jsx` | `useToast()`, `ToastProvider` |
| `src/services/authService.js` | `getCurrentUser()`, `isAuthenticated()` |
| `src/utils/permissions.js` | `canAccess(role, route)` |
| `src/utils/exportUtils.js` | `downloadCSV()`, `downloadPDF()` |
| `src/hooks/useIsMobile.js` | `useIsMobile()` |
| `src/hooks/useTheme.js` | `useTheme()` → `{ dark, toggle }` |

---

## Cómo testear localmente

```bash
cd frontend
npm run dev      # Puerto 5173

# Para simular móvil:
# Chrome DevTools → Toggle Device Toolbar (Ctrl+Shift+M / Cmd+Shift+M)
# O simplemente estrecha la ventana a ≤ 767 px
```

El layout cambia **en tiempo real** al cruzar 768 px, sin recargar la página.

---

## Módulos implementados

| Módulo | Router | Desktop | Mobile |
|---|---|---|---|
| Dashboard | ✅ | ✅ | ✅ |
| Estudiantes | ✅ | ✅ | ✅ |
| Docentes | ✅ | ✅ | ✅ |
| Calificaciones | ✅ | ✅ | ✅ |
| Grupos y Horarios | ✅ | ✅ | ✅ |
| Materias | ✅ | ✅ | ✅ |
| Reportes | ✅ | ✅ | ✅ |
| Configuraciones | ✅ | ✅ | ✅ |

---

## Convenciones de naming

- Archivos Desktop: `pages/desktop/NombreModuloDesktop.jsx`
- Archivos Mobile:  `pages/mobile/NombreModuloMobile.jsx`
- Clases CSS mobile page: prefijo `m-` (ej. `m-stat-card`)
- Clases CSS layout:      prefijo `mobile-` (ej. `mobile-topbar`)
- Clases CSS bottom nav:  prefijo `bottom-nav-` (ej. `bottom-nav-item`)
