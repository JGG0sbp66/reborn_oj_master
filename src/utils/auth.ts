// src/utils/auth.ts
// 登录态校验（路由守卫专用）。业务代码请直接使用 @/api 的 authApi。
import { authApi } from '@/api';
import type { AuthStatus } from '@/api/modules/auth';

export type { AuthStatus };

export const checkAuth = async (): Promise<AuthStatus> => {
  try {
    return await authApi.verifyToken();
  } catch {
    return { authenticated: false };
  }
};
