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
                                <span class="solve-count">{{ problem.solve_num || 0 }}</span>
                                <span class="submit-divider">/</span>
                                <span class="submit-count">{{ problem.submit_num || 0 }}</span>
                            </div>
                        </td>
                        <td class="column-rate">
                            <div class="rate-info">{{ formatPassRate(problem.solve_num || 0, problem.submit_num || 0) }}</div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { Document, Edit, Trophy, DataLine, TrendCharts, User } from '@element-plus/icons-vue';
import axios from 'axios';

const props = defineProps({
  raceInfo: {
    type: Object,
    required: true
  }
});

// 计算属性获取题目列表
const problems = computed(() => {
  return props.raceInfo?.race_info?.problems || [];
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
    height: 100%;
    min-height: 600px;
    display: flex;
    flex-direction: column;
    padding: 0;
}

.problems-card {
    border-radius: 16px;
    overflow: hidden;
    flex: 1;
    display: flex;
    flex-direction: column;
    width: 100%;
}

.problems-list {
    width: 100%;
    border-collapse: separate;
    border-spacing: 0;
    table-layout: fixed;
}

.problems-head {
    background: linear-gradient(to right, rgba(248, 250, 252, 0.8), rgba(241, 245, 249, 0.8));
    border-bottom: 1px solid #e2e8f0;
    position: sticky;
    top: 0;
    z-index: 10;
    backdrop-filter: blur(8px);
}

.problems-body {
    background: transparent;
}

.problem-row {
    border-bottom: 1px solid rgba(226, 232, 240, 0.6);
    transition: all 0.3s ease;
    position: relative;
}

.problem-row:last-child {
    border-bottom: none;
}

.problem-row:hover {
    background-color: rgba(248, 250, 252, 0.8);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.problem-row:hover .problem-link {
    color: #42b983;
}

.problem-row:hover .problem-id {
    background: rgba(66, 185, 131, 0.2);
    transform: scale(1.05);
}

.column-status {
    width: 120px;
}

.column-title {
    width: auto;
}

.column-first {
    width: 160px;
}

.column-submit {
    width: 120px;
}

.column-rate {
    width: 100px;
}

.problems-head th {
    padding: 16px;
    text-align: left;
    font-weight: 500;
    color: #475569;
    font-size: 14px;
    white-space: nowrap;
}

.th-content {
    display: flex;
    align-items: center;
    gap: 8px;
    transition: all 0.3s ease;
}

.th-content:hover {
    color: #42b983;
}

.th-content:hover .el-icon {
    color: #42b983;
    transform: scale(1.1);
}

.problem-row td {
    padding: 16px;
    vertical-align: middle;
    line-height: 1.5;
}

.problem-link {
    display: flex;
    align-items: center;
    gap: 12px;
    text-decoration: none;
    color: #1f2937;
    padding: 4px 0;
    transition: all 0.3s ease;
}

.problem-id {
    font-weight: 600;
    color: #42b983;
    background: rgba(66, 185, 131, 0.1);
    padding: 4px 12px;
    border-radius: 6px;
    min-width: 28px;
    text-align: center;
    transition: all 0.3s ease;
}

.problem-name {
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    transition: color 0.3s ease;
}

.status-tag {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 6px 12px;
    border-radius: 6px;
    font-size: 13px;
    font-weight: 500;
    min-width: 72px;
    transition: all 0.3s ease;
}

.status-accepted {
    background-color: rgba(236, 253, 245, 0.8);
    color: #10b981;
}

.status-wrong {
    background-color: rgba(254, 242, 242, 0.8);
    color: #ef4444;
}

.status-pending {
    background-color: rgba(243, 244, 246, 0.8);
    color: #6b7280;
}

.status-default {
    background-color: rgba(243, 244, 246, 0.8);
    color: #6b7280;
}

.first-blood {
    display: flex;
    align-items: center;
    gap: 8px;
    color: #6b7280;
    height: 24px;
    transition: all 0.3s ease;
}

.first-blood:hover {
    color: #42b983;
}

.submit-info {
    display: flex;
    align-items: center;
    gap: 4px;
    font-family: 'Roboto Mono', monospace;
    height: 24px;
    transition: all 0.3s ease;
}

.submit-info:hover {
    color: #42b983;
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
    height: 24px;
    display: flex;
    align-items: center;
    transition: all 0.3s ease;
}

.rate-info:hover {
    transform: scale(1.05);
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
    .problems-head th,
    .problem-row td {
        padding: 12px;
    }

    .column-first {
        display: none;
    }
}
</style>
