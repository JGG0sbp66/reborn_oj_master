<template>
    <div class="competition-problems">
        <div class="problems-card">
            <table class="problems-list">
                <thead class="problems-head">
                    <tr>
                        <th class="column-status">
                            <div class="th-content">
                                <el-icon>
                                    <Document />
                                </el-icon>
                                <span>状态</span>
                            </div>
                        </th>
                        <th class="column-title">
                            <div class="th-content">
                                <el-icon>
                                    <Edit />
                                </el-icon>
                                <span>题目</span>
                            </div>
                        </th>
                        <th class="column-first">
                            <div class="th-content">
                                <el-icon>
                                    <Trophy />
                                </el-icon>
                                <span>一血</span>
                            </div>
                        </th>
                        <th class="column-submit">
                            <div class="th-content">
                                <el-icon>
                                    <DataLine />
                                </el-icon>
                                <span>解决/提交</span>
                            </div>
                        </th>
                        <th class="column-rate">
                            <div class="th-content">
                                <el-icon>
                                    <TrendCharts />
                                </el-icon>
                                <span>通过率</span>
                            </div>
                        </th>
                    </tr>
                </thead>
                <tbody class="problems-body">
                    <tr v-for="(problem, index) in props.raceInfo?.value?.race_info.problems" :key="index" class="problem-row">
                        <td class="column-status">
                            <span class="status-tag" :class="getStatusClass(problem.status)">
                                {{ problem.status || '未提交' }}
                            </span>
                        </td>
                        <td class="column-title">
                            <a href="#" class="problem-link">
                                <span class="problem-id">{{ getAlphabetIndex(index) }}</span>
                                <span class="problem-name">{{ problem.title }}</span>
                            </a>
                        </td>
                        <td class="column-first">
                            <div class="first-blood" v-if="problem.first_blood_user">
                                <el-icon><User /></el-icon>
                                <span>{{ problem.first_blood_user }}</span>
                            </div>
                        </td>
                        <td class="column-submit">
                            <div class="submit-info">
                                <span class="solve-count">{{ problem.solve_num }}</span>
                                <span class="submit-divider">/</span>
                                <span class="submit-count">{{ problem.submit_num }}</span>
                            </div>
                        </td>
                        <td class="column-rate">
                            <div class="rate-info">{{ formatPassRate(problem.solve_num, problem.submit_num) }}</div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Document, Edit, Trophy, DataLine, TrendCharts, User } from '@element-plus/icons-vue';
import axios from 'axios';

const props = defineProps({
  raceInfo: Object,
});

// 获取字母索引（A, B, C...）
const getAlphabetIndex = (index: number) => {
  return String.fromCharCode(65 + index);
};

// 获取题目状态的样式类
const getStatusClass = (status: string) => {
  switch (status) {
    case 'AC':
      return 'status-accepted';
    case 'WA':
      return 'status-wrong';
    case 'PENDING':
      return 'status-pending';
    default:
      return 'status-default';
  }
};

// 格式化通过率
const formatPassRate = (solveNum: number, submitNum: number) => {
  if (submitNum === 0) return '0.00%';
  return ((solveNum / submitNum) * 100).toFixed(2) + '%';
};

console.log('props:', props.raceInfo);
</script>

<style scoped>
.competition-problems {
    width: 100%;
    padding: 16px;
    box-sizing: border-box;
    height: auto;
    min-height: 400px;
    display: flex;
    flex-direction: column;
}

.problems-card {
    background: #ffffff;
    border-radius: 12px;
    box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
    overflow: hidden;
    flex: 1;
    display: flex;
    flex-direction: column;
    padding-bottom: 16px;
}

.problems-list {
    width: 100%;
    border-collapse: separate;
    border-spacing: 0;
}

.problems-head {
    background: linear-gradient(to right, #f8fafc, #f1f5f9);
    border-bottom: 1px solid #e2e8f0;
    position: sticky;
    top: 0;
    z-index: 10;
}

.problems-body {
    overflow-y: auto;
    flex: 1;
}

/* 自定义滚动条样式 */
.problems-body::-webkit-scrollbar {
    width: 8px;
}

.problems-body::-webkit-scrollbar-track {
    background: #f1f5f9;
    border-radius: 4px;
}

.problems-body::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 4px;
}

.problems-body::-webkit-scrollbar-thumb:hover {
    background: #94a3b8;
}

.problems-head th {
    padding: 20px 24px;
    font-weight: 500;
    color: #475569;
    font-size: 14px;
    text-align: left;
    white-space: nowrap;
}

.th-content {
    display: flex;
    align-items: center;
    gap: 8px;
    height: 24px;
}

.th-content .el-icon {
    font-size: 16px;
    color: #64748b;
}

.problem-row {
    border-bottom: 1px solid #e2e8f0;
    transition: all 0.2s ease;
}

.problem-row:last-child {
    border-bottom: none;
}

.problem-row:hover {
    background-color: #f8fafc;
}

.problem-row td {
    padding: 20px 24px;
    font-size: 14px;
    vertical-align: middle;
}

.column-status {
    width: 120px;
}

.column-title {
    width: auto;
    min-width: 250px;
}

.column-first {
    width: 180px;
}

.column-submit {
    width: 120px;
}

.column-rate {
    width: 100px;
}

.status-tag {
    display: inline-flex;
    align-items: center;
    padding: 6px 12px;
    border-radius: 6px;
    font-size: 13px;
    font-weight: 500;
    min-width: 60px;
    justify-content: center;
}

.status-accepted {
    background-color: #ecfdf5;
    color: #10b981;
}

.status-wrong {
    background-color: #fef2f2;
    color: #ef4444;
}

.status-pending {
    background-color: #f3f4f6;
    color: #6b7280;
}

.status-default {
    background-color: #f3f4f6;
    color: #6b7280;
}

.problem-link {
    display: flex;
    align-items: center;
    color: #1f2937;
    text-decoration: none;
    transition: all 0.2s ease;
    height: 32px;
}

.problem-link:hover {
    color: #42b983;
}

.problem-id {
    font-weight: 600;
    color: #42b983;
    font-family: 'Roboto Mono', monospace;
    padding: 4px 8px;
    background: rgba(66, 185, 131, 0.1);
    border-radius: 4px;
    margin-right: 8px;
    min-width: 28px;
    text-align: center;
    display: inline-block;
}

.problem-name {
    color: #1f2937;
    transition: color 0.2s ease;
}

.problem-link:hover .problem-name {
    color: #42b983;
}

.first-blood {
    display: flex;
    align-items: center;
    gap: 8px;
    color: #6b7280;
    height: 24px;
}

.submit-info {
    display: flex;
    align-items: center;
    gap: 4px;
    font-family: 'Roboto Mono', monospace;
    height: 24px;
}

.solve-count,
.submit-count {
    color: #1f2937;
    font-weight: 500;
}

.submit-divider {
    color: #94a3b8;
}

.rate-info {
    font-family: 'Roboto Mono', monospace;
    font-weight: 500;
    color: #42b983;
    transition: color 0.2s ease;
    height: 24px;
    display: flex;
    align-items: center;
}

.rate-info.low {
    color: #f43f5e;
}

.rate-info.medium {
    color: #f59e0b;
}

.rate-info.high {
    color: #42b983;
}

@media (max-width: 768px) {
    .competition-problems {
        padding: 12px;
    }

    .problems-head th,
    .problem-row td {
        padding: 12px;
        font-size: 13px;
    }

    .th-content {
        gap: 6px;
    }

    .th-content .el-icon {
        font-size: 14px;
    }

    .status-tag {
        font-size: 12px;
        padding: 3px 6px;
    }
}

@media (max-width: 480px) {
    .competition-problems {
        padding: 8px;
    }

    .problems-head th,
    .problem-row td {
        padding: 8px;
    }
}
</style>
