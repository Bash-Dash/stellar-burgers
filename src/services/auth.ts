import {
  getOrdersApi,
  registerUserApi,
  updateUserApi,
  getUserApi,
  loginUserApi,
  logoutApi
} from '@api';
import { deleteCookie, setCookie, getCookie } from '../utils/cookie';

const checkResponse = <T>(res: Response): Promise<T> =>
  res.ok ? res.json() : res.json().then((err) => Promise.reject(err));

export type TUser = {
  email: string;
  name: string;
};

export type TLoginData = {
  email: string;
  password: string;
};

export type TRegisterData = {
  name: string;
  email: string;
  password: string;
};

export type TAuthResponse = {
  success: boolean;
  accessToken: string;
  refreshToken: string;
  user: TUser;
};

export const refreshToken = async (): Promise<{
  accessToken: string;
  refreshToken: string;
}> => {
  try {
    const refreshTokenValue = localStorage.getItem('refreshToken');

    if (!refreshTokenValue) {
      console.log('No refresh token found in localStorage');
      throw new Error('REFRESH_TOKEN_NOT_FOUND');
    }

    const response = await fetch(`${URL}/auth/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ token: refreshTokenValue })
    });

    const data = await checkResponse<{
      success: boolean;
      accessToken: string;
      refreshToken: string;
    }>(response);

    if (data.success) {
      return {
        accessToken: data.accessToken,
        refreshToken: data.refreshToken
      };
    } else {
      throw new Error('Token refresh unsuccessful');
    }
  } catch (error) {
    console.log('Refresh token attempt failed');

    if (error instanceof Error && error.message === 'REFRESH_TOKEN_NOT_FOUND') {
      throw error;
    }
    throw new Error('TOKEN_REFRESH_FAILED');
  }
};
export const fetchWithRefresh = async <T>(
  url: RequestInfo,
  options: RequestInit
): Promise<T> => {
  try {
    const res = await fetch(url, options);
    return await checkResponse<T>(res);
  } catch (err) {
    if (
      (err as any).message === 'jwt expired' ||
      (err as any).message.includes('token')
    ) {
      try {
        const refreshData = await refreshToken();

        setCookie('accessToken', refreshData.accessToken.split('Bearer ')[1]);
        localStorage.setItem('refreshToken', refreshData.refreshToken);

        const newOptions = {
          ...options,
          headers: {
            ...options.headers,
            authorization: refreshData.accessToken
          }
        };

        const res = await fetch(url, newOptions);
        return await checkResponse<T>(res);
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        throw new Error('Authentication failed');
      }
    } else {
      throw err;
    }
  }
};

const handleAuthResponse = (data: TAuthResponse): TAuthResponse => {
  if (!data.success) {
    throw new Error('Authentication failed');
  }

  if (data.accessToken) {
    const token = data.accessToken.startsWith('Bearer ')
      ? data.accessToken.split('Bearer ')[1]
      : data.accessToken;
    setCookie('accessToken', token);
  }

  if (data.refreshToken) {
    localStorage.setItem('refreshToken', data.refreshToken);
  }

  return data;
};

export const register = async (data: TRegisterData): Promise<TAuthResponse> => {
  try {
    const response = await registerUserApi(data);
    return handleAuthResponse(response);
  } catch (error) {
    console.error('Registration failed:', error);
    throw error;
  }
};

export const login = async (data: TLoginData): Promise<TAuthResponse> => {
  try {
    const response = await loginUserApi(data);
    return handleAuthResponse(response);
  } catch (error) {
    console.error('Login failed:', error);
    throw error;
  }
};

export const fetchUser = async (): Promise<{ user: TUser }> => {
  try {
    return await getUserApi();
  } catch (error) {
    console.error('Failed to fetch user:', error);
    throw error;
  }
};

export const fetchUserOrders = async (): Promise<any[]> => {
  try {
    const response = await getOrdersApi();

    if (Array.isArray(response)) {
      return response;
    }

    if (response && typeof response === 'object' && 'orders' in response) {
      return (response as { orders: any[] }).orders || [];
    }

    return [];
  } catch (error) {
    console.error('Failed to fetch user orders:', error);
    throw error;
  }
};

export const updateUserData = async (
  data: Partial<TUser>
): Promise<{ user: TUser }> => {
  try {
    return await updateUserApi(data);
  } catch (error) {
    console.error('Failed to update user:', error);
    throw error;
  }
};

export const logout = async (): Promise<void> => {
  try {
    await logoutApi();
  } finally {
    localStorage.removeItem('refreshToken');
    deleteCookie('accessToken');
  }
};

export const isAuthenticated = (): boolean => {
  try {
    const accessToken = getCookie('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');
    return !!(accessToken && refreshToken);
  } catch {
    return false;
  }
};
