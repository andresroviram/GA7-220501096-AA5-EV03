import axios from 'axios';
import authService from '../src/services/authService';

jest.mock('axios', () => ({ __esModule: true, default: { post: jest.fn() } }));

describe('authService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    sessionStorage.clear();
  });

  test('maps backend USER_PENDING responses to a stable application error', async () => {
    axios.post.mockRejectedValueOnce({ response: { status: 401, data: { code: 'USER_PENDING' } } });
    await expect(authService.login('pending@escuela.edu', 'secret')).rejects.toMatchObject({ code: 'USER_PENDING', message: 'Usuario pendiente de activación' });
  });
});
