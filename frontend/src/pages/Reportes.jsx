import { lazy, Suspense } from 'react';
import { useIsMobile } from '../hooks/useIsMobile';

const Desktop = lazy(() => import('./desktop/ReportesDesktop'));
const Mobile  = lazy(() => import('./mobile/ReportesMobile'));

function PageLoading() {
  return <div className="page-loading" />;
}

export default function Reportes() {
  const isMobile = useIsMobile();
  return (
    <Suspense fallback={<PageLoading />}>
      {isMobile ? <Mobile /> : <Desktop />}
    </Suspense>
  );
}
