import { lazy, Suspense } from 'react';
import { useIsMobile } from '../hooks/useIsMobile';

const Desktop = lazy(() => import('./desktop/CalificacionesDesktop'));
const Mobile  = lazy(() => import('./mobile/CalificacionesMobile'));

function PageLoading() {
  return <div className="page-loading" />;
}

export default function Calificaciones() {
  const isMobile = useIsMobile();
  return (
    <Suspense fallback={<PageLoading />}>
      {isMobile ? <Mobile /> : <Desktop />}
    </Suspense>
  );
}
