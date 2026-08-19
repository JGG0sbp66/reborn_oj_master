// src/api/request.ts
// 全局唯一的 axios 实例：统一 baseURL、超时、Cookie 携带与错误处理。
// 业务代码一律通过 src/api/modules 调用，禁止再直接 import axios。
import axios from 'axios';
import type { AxiosError, AxiosInstance, AxiosResponse } from 'axios';

/** 后端统一响应结构（大部分接口遵守 success/message 约定） */
export interface ApiResult<T = unknown> {
  success: boolean;
  message?: string;
  [key: string]: unknown;
}

/** 归一化后的错误对象，组件里 catch 到的就是它 */
export interface ApiError {
  status: number | null;
  message: string;
  raw: unknown;
}

const request: AxiosInstance = axios.create({
  // 开发环境走 vite 代理 /api -> http://localhost:5000，可用 VITE_API_BASE_URL 覆盖
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 15000,
  withCredentials: true, // 后端基于 Cookie 会话，必须携带
});

function normalizeError(error: AxiosError<{ message?: string }>): ApiError {
  if (error.response) {
    return {
      status: error.response.status,
      message: error.response.data?.message || `请求失败（${error.response.status}）`,
      raw: error.response.data,
    };
  }
  if (error.request) {
    return { status: null, message: '网络异常或后端无响应', raw: error.message };
  }
  return { status: null, message: error.message || '未知错误', raw: error };
}

request.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError<{ message?: string }>) => {
    // 注意：心跳、登录等接口在未登录时会正常返回 401，
    // 因此这里不做自动跳转，登录态守卫由 router.beforeEach 负责。
    return Promise.reject(normalizeError(error));
  },
);

export default request;
