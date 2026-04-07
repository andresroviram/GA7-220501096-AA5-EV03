import { lazy, Suspense } from 'react';
import { useIsMobile } from '../hooks/useIsMobile';

const Desktop = lazy(() => import('./desktop/MateriasDesktop'));
const Mobile  = lazy(() => import('./mobile/MateriasMobile'));

function PageLoading() {
  return <div className="page-loading" />;
}

export default function Materias() {
  const isMobile = useIsMobile();
  return (
    <Suspense fallback={<PageLoading />}>
      {isMobile ? <Mobile /> : <Desktop />}
    </Suspense>
  );
}
