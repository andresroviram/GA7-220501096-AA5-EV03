import { lazy, Suspense } from 'react';
import { useIsMobile } from '../hooks/useIsMobile';

const Desktop = lazy(() => import('./desktop/ConfiguracionesDesktop'));
const Mobile  = lazy(() => import('./mobile/ConfiguracionesMobile'));

function PageLoading() {
  return <div className="page-loading" />;
}

export default function Configuraciones() {
  const isMobile = useIsMobile();
  return (
    <Suspense fallback={<PageLoading />}>
      {isMobile ? <Mobile /> : <Desktop />}
    </Suspense>
  );
}
