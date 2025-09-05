import { checkUserAuth, loginUser, userSlice } from '../slices/userSlice';

const mockUser = {
  email: 'test@example.com',
  name: 'Test User'
};

describe('user slice reducer', () => {
  const initialState = {
    user: null,
    isAuthChecked: false,
    isAuthenticated: false,
    isLoading: false,
    loginRequest: false,
    error: null
  };

  it('should return initial state', () => {
    const result = userSlice.reducer(undefined, { type: '' });
    expect(result).toEqual(initialState);
  });

  it('should handle checkUserAuth.pending', () => {
    const action = { type: checkUserAuth.pending.type };
    const result = userSlice.reducer(initialState, action);

    expect(result.isLoading).toBe(true);
    expect(result.error).toBeNull();
  });

  it('should handle checkUserAuth.fulfilled', () => {
    const action = {
      type: checkUserAuth.fulfilled.type,
      payload: mockUser
    };
    const result = userSlice.reducer(
      { ...initialState, isLoading: true },
      action
    );

    expect(result.isLoading).toBe(false);
    expect(result.isAuthChecked).toBe(true);
    expect(result.user).toEqual(mockUser);
    expect(result.isAuthenticated).toBe(true);
    expect(result.error).toBeNull();
  });

  it('should handle loginUser.pending', () => {
    const action = { type: loginUser.pending.type };
    const result = userSlice.reducer(initialState, action);

    expect(result.loginRequest).toBe(true);
    expect(result.error).toBeNull();
  });

  it('should handle loginUser.fulfilled', () => {
    const action = {
      type: loginUser.fulfilled.type,
      payload: mockUser
    };
    const result = userSlice.reducer(
      { ...initialState, loginRequest: true },
      action
    );

    expect(result.loginRequest).toBe(false);
    expect(result.user).toEqual(mockUser);
    expect(result.isAuthenticated).toBe(true);
    expect(result.isAuthChecked).toBe(true);
    expect(result.error).toBeNull();
  });
});
