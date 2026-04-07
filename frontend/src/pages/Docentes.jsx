import { lazy, Suspense } from 'react';
import { useIsMobile } from '../hooks/useIsMobile';

const Desktop = lazy(() => import('./desktop/DocentesDesktop'));
const Mobile  = lazy(() => import('./mobile/DocentesMobile'));

function PageLoading() {
  return <div className="page-loading" />;
}

export default function Docentes() {
  const isMobile = useIsMobile();
  return (
    <Suspense fallback={<PageLoading />}>
      {isMobile ? <Mobile /> : <Desktop />}
    </Suspense>
  );
}
