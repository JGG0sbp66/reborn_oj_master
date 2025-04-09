<template>
    <div class="competition-rank">
        <div class="rank-card">
            <table class="rank-list">
                <thead class="rank-head">
                    <tr>
                        <th class="column-rank">
                            <div class="th-content">
                                <el-icon><Trophy /></el-icon>
                                <span>排名</span>
                            </div>
                        </th>
                        <th class="column-player">
                            <div class="th-content">
                                <el-icon><User /></el-icon>
                                <span>选手</span>
                            </div>
                        </th>
                        <th class="column-solved">
                            <div class="th-content">
                                <el-icon><Check /></el-icon>
                                <span>解题数</span>
                            </div>
                        </th>
                        <th class="column-time">
                            <div class="th-content">
                                <el-icon><Timer /></el-icon>
                                <span>总用时</span>
                            </div>
                        </th>
                        <th v-for="(problem, index) in problems" :key="index" class="column-problem">
                            <div class="th-content problem-header">
                                {{ problem }}
                            </div>
                        </th>
                    </tr>
                </thead>
                <tbody class="rank-body">
                    <tr v-for="(rank, index) in raceRank.race_rank" :key="rank.user_id" class="rank-row">
                        <td class="column-rank">
                            <div class="rank-number-wrapper">
                                <div class="rank-number" :class="getRankClass(index + 1)">
                                    {{ index + 1 }}
                                </div>
                            </div>
                        </td>
                        <td class="column-player">
                            <div class="player-info">
                                <div class="player-avatar">
                                    <el-icon><User /></el-icon>
                                </div>
                                <span class="player-name">选手 {{ rank.user_id }}</span>
                            </div>
                        </td>
                        <td class="column-solved">
                            <div class="solved-count">{{ rank.total_solved }}</div>
                        </td>
                        <td class="column-time">
                            <div class="total-time">{{ rank.total_penalty }}分钟</div>
                        </td>
                        <td v-for="(problem, pIndex) in problems" :key="pIndex" class="column-problem">
                            <div 
                                class="problem-status" 
                                :class="getProblemStatusClass(rank.problem_stats['problem_' + (pIndex + 1)])">
                                <template v-if="rank.problem_stats['problem_' + (pIndex + 1)]">
                                    <div v-if="rank.problem_stats['problem_' + (pIndex + 1)].solved" class="status-solved">
                                        {{ rank.problem_stats['problem_' + (pIndex + 1)].penalty_time }}
                                        <div class="submit-count">{{ rank.problem_stats['problem_' + (pIndex + 1)].submit_count }} {{ rank.problem_stats['problem_' + (pIndex + 1)].submit_count > 1 ? 'trys' : 'try' }}</div>
                                    </div>
                                    <div v-else-if="rank.problem_stats['problem_' + (pIndex + 1)].submit_count > 0" class="status-attempted">
                                        <div class="submit-count">{{ rank.problem_stats['problem_' + (pIndex + 1)].submit_count }} {{ rank.problem_stats['problem_' + (pIndex + 1)].submit_count > 1 ? 'trys' : 'try' }}</div>
                                    </div>
                                    <div v-else class="status-unattempted">—</div>
                                </template>
                                <div v-else class="status-unattempted">—</div>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script setup>
import { Trophy, User, Check, Timer } from '@element-plus/icons-vue';
import { ref, computed, defineProps } from 'vue';

// 定义题目列
const problems = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M'];

// 排名样式类
const getRankClass = (rank) => {
    const classes = {
        1: 'rank-gold',
        2: 'rank-silver',
        3: 'rank-bronze'
    };
    return classes[rank] || '';
};

// 获取题目状态的样式类
const getProblemStatusClass = (problem) => {
    if (!problem) return 'status-none';
    if (problem.solved) return 'status-solved';
    if (problem.submit_count > 0) return 'status-attempted';
    return 'status-unattempted';
};

const props = defineProps({
    raceRank: {
        type: Object,
        required: true
    }
});

// 使用计算属性代替直接访问props
const raceRank = computed(() => props.raceRank);

console.log('Rank组件接收到的数据:', raceRank.value);
</script>

<style scoped>
.competition-rank {
    width: 100%;
    padding: 16px;
}

.rank-card {
    background: #ffffff;
    border-radius: 12px;
    box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
    overflow: hidden;
    max-width: 1400px;
    margin: 0 auto;
}

.rank-list {
    width: 100%;
    border-collapse: collapse;
    table-layout: fixed;
}

.rank-head {
    background: linear-gradient(to right, #f8fafc, #f1f5f9);
    border-bottom: 1px solid #e2e8f0;
    position: sticky;
    top: 0;
    z-index: 10;
}

.rank-head th {
    padding: 12px 8px;
    font-weight: 500;
    color: #475569;
    font-size: 14px;
    text-align: center;
}

.problem-header {
    background-color: #f1f5f9;
    padding: 8px 6px;
    border-radius: 4px;
    font-weight: 600;
    color: #475569;
}

.th-content {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
}

.th-content .el-icon {
    font-size: 16px;
    color: #64748b;
}

.rank-row {
    border-bottom: 1px solid #e2e8f0;
    transition: all 0.2s ease;
}

.rank-row:hover {
    background-color: #f8fafc;
}

.rank-row td {
    padding: 12px 8px;
    font-size: 14px;
    text-align: center;
}

.column-rank { width: 60px; }
.column-player { width: 160px; }
.column-solved { width: 80px; }
.column-time { width: 80px; }
.column-problem { width: 60px; }

.rank-number-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
}

.rank-number {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    font-size: 16px;
    color: #64748b;
    background: #f1f5f9;
}

.rank-gold {
    background: linear-gradient(135deg, #fef3c7, #fcd34d);
    color: #92400e;
    box-shadow: 0 2px 6px rgba(246, 173, 85, 0.3);
}

.rank-silver {
    background: linear-gradient(135deg, #f1f5f9, #cbd5e1);
    color: #475569;
    box-shadow: 0 2px 6px rgba(203, 213, 225, 0.3);
}

.rank-bronze {
    background: linear-gradient(135deg, #fef2f2, #fca5a5);
    color: #991b1b;
    box-shadow: 0 2px 6px rgba(252, 165, 165, 0.3);
}

.player-info {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
}

.player-avatar {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: linear-gradient(135deg, #e0f2fe, #bae6fd);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #0284c7;
}

.player-name {
    font-weight: 500;
    color: #1f2937;
    white-space: nowrap;
    text-align: center;
}

.solved-count {
    font-family: 'Inter', 'Roboto Mono', monospace, sans-serif;
    font-weight: 600;
    font-size: 16px;
    color: #10b981;
}

.total-time {
    font-family: 'Inter', 'Roboto Mono', monospace, sans-serif;
    font-weight: 500;
    color: #6b7280;
}

/* 问题状态样式 */
.problem-status {
    padding: 6px 4px;
    border-radius: 4px;
    font-family: 'Inter', 'Roboto Mono', monospace, sans-serif;
    text-align: center;
    min-height: 38px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

.status-solved {
    background-color: rgba(16, 185, 129, 0.15);
    color: #059669;
    font-weight: 600;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
}

.status-attempted {
    background-color: rgba(239, 68, 68, 0.15);
    color: #dc2626;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
}

.status-unattempted, .status-none {
    color: #94a3b8;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    font-size: 16px;
}

.submit-count {
    font-size: 11px;
    margin-top: 2px;
    opacity: 0.9;
}

@media (max-width: 992px) {
    .rank-card {
        max-width: 100%;
    }
    
    .th-content {
        flex-direction: column;
        gap: 3px;
    }
    
    .player-info {
        flex-direction: column;
        gap: 3px;
        align-items: center;
    }
    
    .column-rank { width: 50px; }
    .column-player { width: 80px; }
    .column-solved { width: 60px; }
    .column-time { width: 70px; }
    .column-problem { width: 40px; }
}
</style>
