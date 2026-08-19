// src/api/modules/race.ts
// 竞赛相关接口
import request from '../request';
import type { ApiResult } from '../request';
import type { RaceInfo } from '../types';

export interface RaceListResponse {
  race_info: RaceInfo[];
}

export const getRaceList = () => request.get<RaceListResponse>('/race-list').then((r) => r.data);

export const getRaceInfo = (raceUid: number | string) =>
  request
    .post<ApiResult & Record<string, unknown>>('/race-info', { uid: raceUid })
    .then((r) => r.data);

export const getRaceRank = (raceUid: number | string) =>
  request
    .post<ApiResult & Record<string, unknown>>('/race-rank', { uid: raceUid })
    .then((r) => r.data);

export const registerRace = (raceUid: number) =>
  request.post<ApiResult>('/race-register', { race_uid: raceUid }).then((r) => r.data);

export const getUserRaces = () => request.get<ApiResult>('/user-race').then((r) => r.data);
