export const PENDING_FLOW_STORAGE_KEY = 'sistema-integral.pending-flow';

export function markPendingFlow() {
  sessionStorage.setItem(PENDING_FLOW_STORAGE_KEY, '1');
}

export function hasPendingFlow() {
  return sessionStorage.getItem(PENDING_FLOW_STORAGE_KEY) === '1';
}

export function clearPendingFlow() {
  sessionStorage.removeItem(PENDING_FLOW_STORAGE_KEY);
}

export function navigateToPending(navigate) {
  markPendingFlow();
  navigate('/pendiente', { replace: true });
}

export function leavePendingFlow(navigate) {
  clearPendingFlow();
  navigate('/login', { replace: true });
}
