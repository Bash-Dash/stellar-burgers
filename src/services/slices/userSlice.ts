import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  register,
  login,
  logout,
  fetchUser,
  updateUserData,
  refreshToken
} from '../auth';
import { getCookie, setCookie } from '../../utils/cookie';
import type { RootState } from '../store';
import type { TUser } from '@utils-types';

export type TRegisterData = {
  name: string;
  email: string;
  password: string;
};

export type TLoginData = {
  email: string;
  password: string;
};

export type Nullable<T> = T | null;
export type StateError = Nullable<string>;

export type TUserState = {
  user: Nullable<TUser>;
  userOrders: any[];
  isAuthChecked: boolean;
  isAuthenticated: boolean;
  isLoading: boolean;
  loginRequest: boolean;
  error: StateError;
};

const initialState: TUserState = {
  user: null,
  userOrders: [],
  isAuthChecked: false,
  isAuthenticated: false,
  isLoading: false,
  loginRequest: false,
  error: null
};

const createUserThunk = <T>(type: string, apiCall: (data: T) => Promise<any>) =>
  createAsyncThunk(`user/${type}`, async (data: T, { rejectWithValue }) => {
    try {
      const response = await apiCall(data);
      return response.user;
    } catch (error: any) {
      return rejectWithValue(error.message || `${type} failed`);
    }
  });

const createSimpleThunk = (type: string, apiCall: () => Promise<any>) =>
  createAsyncThunk(`user/${type}`, async (_, { rejectWithValue }) => {
    try {
      const response = await apiCall();
      return response.user;
    } catch (error: any) {
      return rejectWithValue(error.message || `${type} failed`);
    }
  });

export const registerUser = createUserThunk('register', register);
export const loginUser = createUserThunk('login', login);
export const updateUserProfile = createUserThunk(
  'updateProfile',
  updateUserData
);
export const logoutUser = createSimpleThunk('logout', logout);
export const getUser = createSimpleThunk('getUser', fetchUser);

export const checkUserAuth = createAsyncThunk(
  'user/checkAuth',
  async (_, { rejectWithValue }) => {
    try {
      const accessToken = getCookie('accessToken');
      const refreshTokenValue = localStorage.getItem('refreshToken');

      if (!accessToken || !refreshTokenValue) {
        throw new Error('NOT_AUTHENTICATED');
      }

      const response = await fetchUser();
      return response.user;
    } catch (error: any) {
      if (error.message === 'NOT_AUTHENTICATED') {
        return rejectWithValue('not_authenticated');
      }

      try {
        const refreshData = await refreshToken();

        if (refreshData.accessToken) {
          const token = refreshData.accessToken.startsWith('Bearer ')
            ? refreshData.accessToken.split('Bearer ')[1]
            : refreshData.accessToken;
          setCookie('accessToken', token);
        }
        if (refreshData.refreshToken) {
          localStorage.setItem('refreshToken', refreshData.refreshToken);
        }

        const response = await fetchUser();
        return response.user;
      } catch (refreshError: any) {
        if (refreshError.message === 'REFRESH_TOKEN_NOT_FOUND') {
          return rejectWithValue('refresh_token_not_found');
        }
        if (refreshError.message === 'TOKEN_REFRESH_FAILED') {
          return rejectWithValue('token_refresh_failed');
        }
        return rejectWithValue('auth_check_failed');
      }
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setAuthChecked: (state, action: PayloadAction<boolean>) => {
      state.isAuthChecked = action.payload;
    },
    clearUser: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    },
    resetError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    const handlePending = (state: TUserState) => {
      state.isLoading = true;
      state.error = null;
    };

    const handleRejected = (state: TUserState, action: any) => {
      state.isLoading = false;
      state.error = action.payload as string;
    };

    builder
      .addCase(registerUser.pending, handlePending)
      .addCase(registerUser.rejected, handleRejected)
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.isAuthChecked = true;
      })
      .addCase(loginUser.pending, (state) => {
        state.loginRequest = true;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loginRequest = false;
        state.error = action.payload as string;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loginRequest = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.isAuthChecked = true;
      })
      .addCase(logoutUser.pending, handlePending)
      .addCase(logoutUser.rejected, handleRejected)
      .addCase(logoutUser.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.isAuthChecked = true;
      });

    builder
      .addCase(getUser.pending, (state) => {
        state.isAuthChecked = false;
      })
      .addCase(getUser.rejected, (state) => {
        state.isAuthChecked = true;
        state.isAuthenticated = false;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.isAuthChecked = true;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(updateUserProfile.pending, handlePending)
      .addCase(updateUserProfile.rejected, handleRejected)
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
      });

    builder
      .addCase(checkUserAuth.pending, (state) => {
        state.isAuthChecked = false;
      })
      .addCase(checkUserAuth.fulfilled, (state, action) => {
        state.isAuthChecked = true;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(checkUserAuth.rejected, (state, action) => {
        state.isAuthChecked = true;

        if (
          action.payload === 'not_authenticated' ||
          action.payload === 'refresh_token_not_found' ||
          action.payload === 'token_refresh_failed'
        ) {
          state.error = null;
          state.isAuthenticated = false;
        } else {
          state.error = action.payload as string;
          state.isAuthenticated = false;
        }
      });
  }
});

export const selectUser = (state: RootState) => state.user.user;
export const selectUserOrders = (state: RootState) => state.user.userOrders;
export const selectIsAuthenticated = (state: RootState) =>
  state.user.isAuthenticated;
export const selectIsAuthChecked = (state: RootState) =>
  state.user.isAuthChecked;
export const selectUserLoading = (state: RootState) => state.user.isLoading;
export const selectLoginRequest = (state: RootState) => state.user.loginRequest;
export const selectUserError = (state: RootState) => state.user.error;

export const { setAuthChecked, clearUser, resetError } = userSlice.actions;

export default userSlice.reducer;
