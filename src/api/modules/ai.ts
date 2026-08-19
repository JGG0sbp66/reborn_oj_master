// src/api/modules/ai.ts
// AI 助手相关接口
import request from '../request';
import type { ApiResult } from '../request';

export interface AskAiMsgPayload {
  message: string;
  history?: unknown[];
  [key: string]: unknown;
}

export const askAiMsg = (payload: AskAiMsgPayload) =>
  request.post<ApiResult>('/askAi-msg', payload).then((r) => r.data);

export const askAiQuestion = (payload: Record<string, unknown>) =>
  request.post<ApiResult>('/askAi-question', payload).then((r) => r.data);
