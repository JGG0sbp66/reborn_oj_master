// src/api/types.ts
// 跨模块共享的接口类型定义

export interface UserInfo {
  uid: number;
  username: string;
  role: 'user' | 'admin' | 'superAdmin';
  auth_token?: string;
  is_banned?: boolean;
}

export interface QuestionSummary {
  uid: number;
  title: string;
  state: string;
  topic: string;
  submit_num: number;
  solve_num: number;
}

export interface QuestionExample {
  input: string;
  output: string;
}

export interface QuestionDetail {
  uid: number;
  title: string;
  description: string;
  time_limit: number;
  memory_limit: number;
  input_format?: string;
  output_format?: string;
  constraints?: string[];
  examples?: QuestionExample[];
  topic: string;
  submit_num?: number;
  solve_num?: number;
}

export interface RaceTag {
  name: string;
  type: string;
}

export interface RaceInfo {
  race_uid: number;
  title: string;
  logos: string[];
  startTime: string;
  endTime: string;
  duration: string;
  status: 'upcoming' | 'running' | 'ended';
  tags: RaceTag[];
}

export interface SubmitResult {
  success: boolean;
  message?: string;
  status?: string;
  [key: string]: unknown;
}
