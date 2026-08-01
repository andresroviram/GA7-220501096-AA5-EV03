import { Navigate } from 'react-router-dom';
import PendingScreen from './PendingScreen';
import authService from '../services/authService';
import { clearPendingFlow, hasPendingFlow } from '../utils/pendingFlow';

function PendingRoute({ onBackToLogin }) {
  if (authService.isAuthenticated()) {
    clearPendingFlow();
    return <Navigate to="/dashboard" replace />;
  }

  if (!hasPendingFlow()) {
    return <Navigate to="/login" replace />;
  }

  return <PendingScreen onBackToLogin={onBackToLogin} />;
}

export default PendingRoute;
