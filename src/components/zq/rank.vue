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
                    </tr>
                </thead>
                <tbody class="rank-body">
                    <tr v-for="i in 3" :key="i" class="rank-row">
                        <td class="column-rank">
                            <div class="rank-number" :class="getRankClass(i)">
                                {{ i }}
                            </div>
                        </td>
                        <td class="column-player">
                            <div class="player-info">
                                <div class="player-avatar">
                                    <el-icon><User /></el-icon>
                                </div>
                                <span class="player-name">选手 {{ i }}</span>
                            </div>
                        </td>
                        <td class="column-solved">
                            <div class="solved-count">{{ 5 - i }}</div>
                        </td>
                        <td class="column-time">
                            <div class="total-time">{{ (i * 30) }}:00</div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script setup lang="ts">
import { Trophy, User, Check, Timer } from '@element-plus/icons-vue';

const getRankClass = (rank: number): string => {
    const classes = {
        1: 'rank-gold',
        2: 'rank-silver',
        3: 'rank-bronze'
    };
    return classes[rank as keyof typeof classes] || '';
};
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
}

.rank-list {
    width: 100%;
    border-collapse: collapse;
}

.rank-head {
    background: linear-gradient(to right, #f8fafc, #f1f5f9);
    border-bottom: 1px solid #e2e8f0;
}

.rank-head th {
    padding: 16px;
    font-weight: 500;
    color: #475569;
    font-size: 14px;
    text-align: left;
}

.th-content {
    display: flex;
    align-items: center;
    gap: 8px;
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
    padding: 16px;
    font-size: 14px;
}

.column-rank { width: 120px; }
.column-player { width: 200px; }
.column-solved { width: 120px; }
.column-time { width: 120px; }

.rank-number {
    width: 32px;
    height: 32px;
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
}

.rank-silver {
    background: linear-gradient(135deg, #f1f5f9, #cbd5e1);
    color: #475569;
}

.rank-bronze {
    background: linear-gradient(135deg, #fef2f2, #fca5a5);
    color: #991b1b;
}

.player-info {
    display: flex;
    align-items: center;
    gap: 12px;
}

.player-avatar {
    width: 36px;
    height: 36px;
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
}

.solved-count {
    font-family: 'Roboto Mono', monospace;
    font-weight: 600;
    font-size: 16px;
    color: #42b983;
}

.total-time {
    font-family: 'Roboto Mono', monospace;
    font-weight: 500;
    color: #6b7280;
}

@media (max-width: 768px) {
    .competition-rank {
        padding: 12px;
    }

    .rank-head th,
    .rank-row td {
        padding: 12px;
    }

    .th-content {
        gap: 6px;
    }

    .rank-number {
        width: 28px;
        height: 28px;
        font-size: 14px;
    }

    .player-avatar {
        width: 32px;
        height: 32px;
    }

    .solved-count {
        font-size: 14px;
    }
}

@media (max-width: 480px) {
    .competition-rank {
        padding: 8px;
    }

    .rank-head th,
    .rank-row td {
        padding: 8px;
    }

    .player-info {
        gap: 8px;
    }

    .player-avatar {
        width: 28px;
        height: 28px;
    }
}
</style>
