<template>
    <div class="welcome-section">
                    <div class="welcome-card">
                        <div class="welcome-info">
                            <h1 class="welcome-title">欢迎回来，管理员</h1>
                            <p class="welcome-subtitle">今天是 {{ currentDate }}，祝您有个愉快的一天！</p>
                            <div class="quick-stats">
                                <div class="stat-item">
                                    <el-icon class="stat-icon"><User /></el-icon>
                                    <div class="stat-content">
                                        <div class="stat-value">{{ userCount }}</div>
                                        <div class="stat-label">注册用户</div>
                                    </div>
                                </div>
                                <div class="stat-item">
                                    <el-icon class="stat-icon"><Document /></el-icon>
                                    <div class="stat-content">
                                        <div class="stat-value">{{ questionCount }}</div>
                                        <div class="stat-label">题目总数</div>
                                    </div>
                                </div>
                                <div class="stat-item">
                                    <el-icon class="stat-icon"><TrendCharts /></el-icon>
                                    <div class="stat-content">
                                        <div class="stat-value">{{ competitionCount }}</div>
                                        <div class="stat-label">竞赛数量</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="welcome-decoration">
                            <div class="decoration-circle"></div>
                            <div class="decoration-square"></div>
                            <div class="decoration-triangle"></div>
                        </div>
                    </div>
                </div>  
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { User, Document, TrendCharts } from '@element-plus/icons-vue';

const currentDate = computed(() => {
    const date = new Date();
    return date.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' });
});

// 模拟数据
const userCount = ref(1243);
const questionCount = ref(568);
const competitionCount = ref(32);
</script>

<style scoped>
.welcome-section {
    margin-bottom: 24px;
}

.welcome-card {
    background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
    border-radius: 16px;
    padding: 24px;
    display: flex;
    position: relative;
    overflow: hidden;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
}

.welcome-info {
    flex: 1;
    z-index: 2;
}

.welcome-title {
    font-size: 24px;
    font-weight: 700;
    margin: 0 0 8px 0;
    color: #2c3e50;
}

.welcome-subtitle {
    font-size: 16px;
    color: #5c6c7c;
    margin: 0 0 24px 0;
}

.quick-stats {
    display: flex;
    gap: 24px;
}

.stat-item {
    display: flex;
    align-items: center;
    background: rgba(255, 255, 255, 0.8);
    padding: 12px 16px;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.stat-icon {
    font-size: 24px;
    color: #42b983;
    margin-right: 12px;
}

.stat-value {
    font-size: 20px;
    font-weight: 700;
    color: #2c3e50;
}

.stat-label {
    font-size: 12px;
    color: #5c6c7c;
}

.welcome-decoration {
    position: absolute;
    right: 0;
    top: 0;
    height: 100%;
    width: 300px;
    overflow: hidden;
    opacity: 0.2;
}

.decoration-circle,
.decoration-square,
.decoration-triangle {
    position: absolute;
}

.decoration-circle {
    width: 150px;
    height: 150px;
    border-radius: 50%;
    background: linear-gradient(135deg, #42b983, #33c6aa);
    top: -40px;
    right: -40px;
}

.decoration-square {
    width: 80px;
    height: 80px;
    background: linear-gradient(135deg, #33c6aa, #00c4ff);
    bottom: 40px;
    right: 60px;
    transform: rotate(45deg);
}

.decoration-triangle {
    width: 0;
    height: 0;
    border-left: 60px solid transparent;
    border-right: 60px solid transparent;
    border-bottom: 120px solid rgba(0, 196, 255, 0.8);
    bottom: -40px;
    right: 160px;
    transform: rotate(15deg);
}
</style>



