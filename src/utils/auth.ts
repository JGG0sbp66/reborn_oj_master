// src/utils/auth.ts
import axios from 'axios';
import type { AxiosResponse } from 'axios';

axios.defaults.withCredentials = true  // 允许跨域携带Cookie

interface AuthResponse {
  authenticated: boolean;
  user?: {
    uid: string | number;
    username: string;
    role: string;
  };
}

export const checkAuth = async (): Promise<AuthResponse> => {
  try {
    const res: AxiosResponse<AuthResponse> = await axios.get(
      'http://localhost:5000/api/verify-token',
      { withCredentials: true }
    );
    return res.data;
  } catch (error) {
    return { authenticated: false };
  }
};