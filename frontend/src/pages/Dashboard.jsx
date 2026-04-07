import { lazy, Suspense } from 'react';
import { useIsMobile } from '../hooks/useIsMobile';

const Desktop = lazy(() => import('./desktop/DashboardDesktop'));
const Mobile  = lazy(() => import('./mobile/DashboardMobile'));

function PageLoading() {
  return <div className="page-loading" />;
}

export default function Dashboard() {
  const isMobile = useIsMobile();
  return (
    <Suspense fallback={<PageLoading />}>
      {isMobile ? <Mobile /> : <Desktop />}
    </Suspense>
  );
}
