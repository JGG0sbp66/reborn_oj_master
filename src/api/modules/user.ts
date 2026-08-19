// src/api/modules/user.ts
// 个人中心相关接口
import request from '../request';
import type { ApiResult } from '../request';

export const getUserInfo = () => request.get<ApiResult>('/get-user-info').then((r) => r.data);

export const getUsername = (uid: number) =>
  // 注意：后端把用户名放在 message 字段返回
  request.get<ApiResult>(`/get-username/${uid}`).then((r) => r.data);

export const getStats = () => request.get<ApiResult>('/getStats').then((r) => r.data);

export const getHeatmap = (year?: number) =>
  request
    .get<ApiResult>('/getHeatmap', { params: year ? { year } : {} })
    .then((r) => r.data);

export const changeUsername = (newUsername: string) =>
  request.post<ApiResult>('/user-change-username', { new_username: newUsername }).then((r) => r.data);

export const changeDescription = (newDescription: string) =>
  request
    .post<ApiResult>('/user-change-description', { new_description: newDescription })
    .then((r) => r.data);

export const changeEmail = (newEmail: string, newEmailCode: string) =>
  request
    .post<ApiResult>('/user-change-email', { new_email: newEmail, new_email_code: newEmailCode })
    .then((r) => r.data);

export const changePassword = (oldPassword: string, newPassword: string, reNewPassword: string) =>
  request
    .post<ApiResult>('/user-change-password', {
      old_password: oldPassword,
      new_password: newPassword,
      re_new_password: reNewPassword,
    })
    .then((r) => r.data);

/** 上传头像（multipart/form-data，后端字段名为 file） */
export const uploadAvatar = (file: File) => {
  const form = new FormData();
  form.append('file', file);
  return request
    .post<ApiResult>('/avatar-upload', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    .then((r) => r.data);
};
