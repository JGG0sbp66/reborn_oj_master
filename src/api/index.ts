// src/api/index.ts
// API 层统一出口。
// 用法：import { authApi, questionApi } from '@/api'
import request from './request';

export * as authApi from './modules/auth';
export * as questionApi from './modules/question';
export * as raceApi from './modules/race';
export * as judgeApi from './modules/judge';
export * as userApi from './modules/user';
export * as adminApi from './modules/admin';
export * as aiApi from './modules/ai';
export * from './types';
export type { ApiResult, ApiError } from './request';
export { request };
export default request;
