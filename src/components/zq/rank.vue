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
                        <th v-for="problem in problemColumns" :key="problem.index" class="column-problem">
                            <div class="th-content problem-header">
                                {{ problem.label }}
                            </div>
                        </th>
                    </tr>
                </thead>
                <tbody class="rank-body">
                    <template v-if="hasRankData">
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
                                        <img 
                                            :src="`/api/avatar-get/${rank.user_info.uid}`" 
                                            :alt="rank.user_info.username"
                                            @error="handleAvatarError"
                                        />
                                    </div>
                                    <span class="player-name">{{ rank.user_info.username }}</span>
                                </div>
                            </td>
                            <td class="column-solved">
                                <div class="solved-count">{{ rank.total_solved }}</div>
                            </td>
                            <td class="column-time">
                                <div class="total-time">{{ rank.total_penalty }}分钟</div>
                            </td>
                            <td v-for="problem in problemColumns" :key="problem.index" class="column-problem">
                                <div 
                                    class="problem-status" 
                                    :class="getProblemStatusClass(rank.problem_stats[problem.problemId])">
                                    <!-- 已解决状态 -->
                                    <template v-if="rank.problem_stats[problem.problemId]?.solved">
                                        <div class="penalty-time">{{ rank.problem_stats[problem.problemId].penalty_time }}</div>
                                        <div class="submit-count">{{ rank.problem_stats[problem.problemId].submit_count }} {{ rank.problem_stats[problem.problemId].submit_count > 1 ? 'trys' : 'try' }}</div>
                                    </template>
                                    
                                    <!-- 尝试未解决状态 -->
                                    <template v-else-if="rank.problem_stats[problem.problemId]?.submit_count > 0">
                                        <div class="submit-count">{{ rank.problem_stats[problem.problemId].submit_count }} {{ rank.problem_stats[problem.problemId].submit_count > 1 ? 'trys' : 'try' }}</div>
                                    </template>
                                    
                                    <!-- 未尝试状态 -->
                                    <template v-else>
                                        <div class="no-attempt">·</div>
                                    </template>
                                </div>
                            </td>
                        </tr>
                    </template>
                    <tr v-else class="empty-row">
                        <td :colspan="problemColumns.length + 4" class="empty-cell">
                            <div class="empty-content">
                                <el-icon class="empty-icon"><DataLine /></el-icon>
                                <span class="empty-text">暂无排名数据</span>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script setup>
import { Trophy, User, Check, Timer, DataLine } from '@element-plus/icons-vue';
import { ref, computed, defineProps } from 'vue';

// 最大可能的题目数字母
const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

// 根据实际题目数量计算题目列
const problemColumns = computed(() => {
    // 获取比赛题目的实际数量
    const problemCount = getProblemCount();
    
    // 生成对应数量的题目列
    return Array.from({ length: problemCount }, (_, i) => ({
        index: i,
        label: ALPHABET[i],
        problemId: ALPHABET[i] // 直接使用字母作为键名
    }));
});

// 获取比赛题目的实际数量
function getProblemCount() {
    if (!props.raceRank || !props.raceRank.race_info || !props.raceRank.race_info.problems) {
        console.warn('无法获取题目信息，当前props:', props.raceRank);
        return 0;
    }
    return props.raceRank.race_info.problems.length;
}

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

// 判断是否有排名数据
const hasRankData = computed(() => {
    return raceRank.value && 
           raceRank.value.race_rank && 
           Array.isArray(raceRank.value.race_rank) && 
           raceRank.value.race_rank.length > 0;
});

// 头像加载错误处理函数
const handleAvatarError = (e) => {
    // 头像加载失败时使用默认的用户图标
    e.target.style.display = 'none';
    e.target.parentElement.innerHTML = '<el-icon><User /></el-icon>';
};

console.log('Rank组件接收到的数据:', raceRank.value);
</script>

<style scoped>
/* 样式部分保持不变 */
.competition-rank {
    width: 100%;
    padding: 16px;
    overflow-x: auto;
}

.rank-card {
    background: #ffffff;
    border-radius: 12px;
    box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
    overflow: hidden;
    min-width: 1000px;
    margin: 0 auto;
}

.rank-list {
    width: 100%;
    border-collapse: collapse;
    table-layout: fixed;
    border: 1px solid #e2e8f0;
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
    border: 1px solid #e2e8f0;
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
    padding: 0;
    font-size: 14px;
    text-align: center;
    vertical-align: middle;
    border: 1px solid #e2e8f0;
}

.rank-row td.column-rank,
.rank-row td.column-player,
.rank-row td.column-solved,
.rank-row td.column-time {
    padding: 12px 8px;
}

.column-rank { min-width: 60px; width: 60px; }
.column-player { min-width: 160px; width: 160px; }
.column-solved { min-width: 80px; width: 80px; }
.column-time { min-width: 80px; width: 80px; }
.column-problem { min-width: 60px; width: 60px; padding: 0 !important; overflow: hidden; }

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
    overflow: hidden; /* 添加此行确保图片不会溢出圆形边框 */
}

.player-avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.player-name {
    font-weight: 500;
    color: #1f2937;
    white-space: nowrap;
    text-align: center;
}

.solved-count {
    font-weight: 600;
    font-size: 15px;
    color: #10b981;
}

.total-time {
    font-weight: 500;
    color: #6b7280;
}

.problem-status {
    text-align: center;
    min-height: 48px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    padding: 8px 4px;
    border-radius: 0;
    transition: all 0.2s ease;
}

.status-solved {
    background-color: #67e56d;
    color: #000;
}

.status-attempted {
    background-color: #ff7c7c;
    color: #000;
}

.status-unattempted, .status-none {
    color: #000;
    background-color: #f1f1f1;
}

.no-attempt {
    font-size: 24px;
    line-height: 1;
}

.penalty-time {
    font-size: 13px;
    font-weight: 600;
    margin-bottom: 2px;
}

.submit-count {
    font-size: 12px;
}

.problem-status:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    z-index: 1;
}

.status-solved:hover {
    background-color: #4ad850;
}

.status-attempted:hover {
    background-color: #ff6a6a;
}

.empty-row {
    height: 200px;
}

.empty-cell {
    text-align: center;
    color: #94a3b8;
}

.empty-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 40px 0;
    gap: 16px;
}

.empty-icon {
    font-size: 48px;
    color: #cbd5e1;
}

.empty-text {
    font-size: 16px;
    color: #64748b;
}

@media (max-width: 992px) {
    .rank-card {
        min-width: 800px;
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
    
    .column-rank { min-width: 50px; width: 50px; }
    .column-player { min-width: 80px; width: 80px; }
    .column-solved { min-width: 60px; width: 60px; }
    .column-time { min-width: 70px; width: 70px; }
    .column-problem { min-width: 40px; width: 40px; }
}
</style>