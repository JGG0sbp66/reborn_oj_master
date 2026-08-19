// src/api/modules/auth.ts
// 认证相关接口：登录 / 注册 / 改密 / 验证码 / 会话
import request from '../request';
import type { ApiResult } from '../request';
import type { UserInfo } from '../types';

export interface LoginResponse extends ApiResult {
  user?: UserInfo;
}

export interface RegisterPayload {
  username: string;
  email: string;
  email_code: string;
  password: string;
  cfToken: string;
}

export interface AuthStatus {
  authenticated: boolean;
  user?: Pick<UserInfo, 'uid' | 'username' | 'role'>;
}

export const login = (username: string, password: string, cfToken = '') =>
  request.post<LoginResponse>('/login', { username, password, cfToken }).then((r) => r.data);

export const register = (payload: RegisterPayload) =>
  request.post<ApiResult>('/register', payload).then((r) => r.data);

export interface RepasswordPayload {
  username?: string;
  email: string;
  email_code: string;
  password: string;
}

export const repassword = (payload: RepasswordPayload) =>
  request.post<ApiResult>('/repassword', payload).then((r) => r.data);

export const logout = () => request.post<ApiResult>('/logout').then((r) => r.data);

/** 校验当前 Cookie 会话是否有效（路由守卫用） */
export const verifyToken = () =>
  request.get<AuthStatus>('/verify-token').then((r) => r.data);

export const sendHeartbeat = () =>
  request.post<ApiResult>('/heartbeat').then((r) => r.data);

export const sendEmailCode = (email: string) =>
  request.post<ApiResult>('/send-email-code', { email }).then((r) => r.data);

export const verifyEmailCode = (email: string, code: string) =>
  request.post<ApiResult>('/verify-email-code', { email, code }).then((r) => r.data);

export const verifyCfToken = (cfToken: string) =>
  request.post<ApiResult>('/verify-cf', { cfToken }).then((r) => r.data);

/** 获取用户头像（Blob，调用方负责 URL.createObjectURL / revoke） */
export const getUserAvatar = (uid: number | string, timestamp?: string) =>
  request
    .get<Blob>(`/avatar-get/${uid}`, {
      responseType: 'blob',
      params: timestamp ? { t: timestamp } : {},
    })
    .then((r) => r.data);
