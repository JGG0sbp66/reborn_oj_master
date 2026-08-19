// src/api/modules/question.ts
// 题库相关接口
import request from '../request';
import type { ApiResult } from '../request';
import type { QuestionDetail, QuestionSummary } from '../types';

export interface QuestionListResponse extends ApiResult {
  questions: QuestionSummary[];
  total_page: number;
  total_count?: number;
}

export interface QuestionListParams {
  page?: number;
  category?: string;
  topic?: string;
  input?: string;
}

export const getQuestions = (params: QuestionListParams = {}) =>
  request.post<QuestionListResponse>('/questions', params).then((r) => r.data);

export const getQuestionDetail = (uid: number | string) =>
  request
    .post<ApiResult & { question_detail: QuestionDetail }>('/question-detail', { uid })
    .then((r) => r.data);

export const getHomeQuestions = () =>
  request
    .get<ApiResult & { questions: QuestionSummary[] }>('/home-get-question')
    .then((r) => r.data);

export const getUserQuestions = () => request.get<ApiResult>('/user-questions').then((r) => r.data);
