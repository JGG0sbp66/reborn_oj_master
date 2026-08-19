// src/api/modules/admin.ts
// 后台管理相关接口（需 admin 权限）
import request from '../request';
import type { ApiResult } from '../request';
import type { QuestionDetail } from '../types';

// —— 用户管理 ——
export const getUserList = (params: Record<string, unknown> = {}) =>
  request.post<ApiResult>('/admin-get-user-list', params).then((r) => r.data);

export const banUser = (uid: number, banEndTime?: string | null) =>
  request.post<ApiResult>('/admin-ban-user', { uid, ban_end_time: banEndTime }).then((r) => r.data);

export const unbanUser = (uid: number) =>
  request.post<ApiResult>('/admin-unban-user', { uid }).then((r) => r.data);

export const updateUserRole = (uid: number, role: string) =>
  request.post<ApiResult>('/update-user-role', { uid, role }).then((r) => r.data);

// —— 题目管理 ——
export const getAdminQuestionListAll = () =>
  request.get<Record<string, unknown>[]>('/admin-question').then((r) => r.data);

export const getAdminQuestions = (params: Record<string, unknown> = {}) =>
  request.post<ApiResult>('/admin-get-questions', params).then((r) => r.data);

export const createQuestion = (question: Partial<QuestionDetail>) =>
  request.post<ApiResult>('/admin-question', question).then((r) => r.data);

export const updateQuestion = (questionId: number, question: Partial<QuestionDetail>) =>
  request.put<ApiResult>(`/admin-question/${questionId}`, question).then((r) => r.data);

export const deleteQuestion = (questionId: number) =>
  request.delete<ApiResult>(`/admin-question/${questionId}`).then((r) => r.data);

export const getAdminQuestionDetail = (questionId: number) =>
  request.get<ApiResult>(`/admin-question/${questionId}`).then((r) => r.data);

/** 上传题目评测用例（zip） */
export const uploadTestcase = (questionId: number, file: File) => {
  const form = new FormData();
  form.append('testcase', file);
  return request
    .post<ApiResult>(`/testcase-upload/${questionId}`, form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    .then((r) => r.data);
};

// —— 竞赛管理 ——
export const getAdminRaceList = () => request.get<ApiResult>('/races').then((r) => r.data);

export const getAdminRaceDetail = (raceId: number) =>
  request.get<ApiResult>(`/races/${raceId}`).then((r) => r.data);

export const createRace = (race: Record<string, unknown>) =>
  request.post<ApiResult>('/races', race).then((r) => r.data);

export const updateRace = (raceId: number, race: Record<string, unknown>) =>
  request.put<ApiResult>(`/races/${raceId}`, race).then((r) => r.data);

export const deleteRace = (raceId: number) =>
  request.delete<ApiResult>(`/races/${raceId}`).then((r) => r.data);
