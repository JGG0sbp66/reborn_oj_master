// src/api/modules/judge.ts
// 评测提交相关接口
import request from '../request';
import type { SubmitResult } from '../types';

/**
 * 提交代码评测。
 * 后端 /submit 使用 multipart/form-data 解析，
 * 字段：code / language / problem_id / race_id(可选)
 */
export const submitCode = (formData: FormData) =>
  request
    .post<SubmitResult>('/submit', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    .then((r) => r.data);
