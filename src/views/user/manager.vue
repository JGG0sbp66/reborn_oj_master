<template>
    <managerhead />
    <div class="manager-container">
        <managerslider @sidebar-state-change="handleSidebarStateChange" />
        <div class="manager-content" :class="{ 'collapsed-content': isCollapsed }">
            <div class="dashboard">
                <!-- 欢迎信息 -->
                <managerwelcome />

                <!-- 数据统计和图表 -->
                <div class="data-section">
                    <manageractive />

                    <div class="tables-container">
                        <div style="display: flex; flex-direction: column; gap: 24px;">
                            <managerprobleminfo />
                            <managerraceinfo />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import managerslider from '@/components/zq/manager-sidebar.vue';
import managerhead from '@/components/zq/manager-head.vue';
import managerwelcome from '@/components/zq/manager-welcome.vue';
import manageractive from '@/components/zq/manager-active.vue';
import managerprobleminfo from '@/components/zq/manager-probleminfo.vue';
import managerraceinfo from '@/components/zq/manager-raceinfo.vue';
import { checkAuth } from '@/utils/auth';
import { useRouter, useRoute } from 'vue-router';
import {
    User, Document, TrendCharts,
    Monitor, Connection, Timer
} from '@element-plus/icons-vue';
import axios from 'axios';

// 获取侧边栏折叠状态
const isCollapsed = ref<boolean>(true);

// 监听managerslider组件的折叠状态
const handleSidebarStateChange = (collapsed: boolean) => {
    isCollapsed.value = collapsed;
};

// 当前日期
const currentDate = ref(new Date().toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long'
}));

// 获取难度标签类型
const getDifficultyType = (difficulty: string) => {
    switch (difficulty) {
        case '入门': return 'success';
        case '普及': return 'warning';
        case '提高': return 'danger';
        case '省选': return 'primary';
        case 'NOI': return 'danger';
        case 'CTSC': return 'danger';
        default: return 'info';
    }
};

// 根据题目复杂度推断难度
const getDifficultyByComplexity = (question: any): string => {
    // 基于题目的约束条件、时间和内存限制等推断难度
    const constraints = question?.constraints || [];
    const timeLimit = question?.time_limit || 1000;
    const memoryLimit = question?.memory_limit || 128;

    // 简单的难度判断逻辑
    if (timeLimit <= 500 && memoryLimit <= 64) {
        return '入门';
    } else if (timeLimit <= 1000 && memoryLimit <= 128) {
        return '普及';
    } else if (timeLimit <= 2000 && memoryLimit <= 256) {
        return '提高';
    } else if (timeLimit <= 5000 && memoryLimit <= 512) {
        return '省选';
    } else if (timeLimit <= 10000 && memoryLimit <= 1024) {
        return 'NOI';
    } else {
        return 'CTSC';
    }
};

onMounted(() => {
    // 在组件挂载后，获取侧边栏的折叠状态
    const slider = document.querySelector('.manager-sidebar');
    if (slider && slider.classList.contains('collapsed')) {
        isCollapsed.value = true;
    }

    // 监听侧边栏折叠事件，实际项目中可能需要使用事件总线或状态管理
    // 这里只是示例，实际实现需要根据项目架构调整
    document.addEventListener('sliderToggle', (e: any) => {
        isCollapsed.value = e.detail.collapsed;
    });

    // 初始设置为收缩状态
    isCollapsed.value = true;
});

const router = useRouter();
const route = useRoute();

const verifyAuth = async () => {
    const { authenticated } = await checkAuth();
    if (!authenticated) {
        router.push({
            path: '/account/login',
            query: { redirect: route.fullPath }
        });
    }
};

// 在 setup 中调用或返回给模板使用
verifyAuth();
</script>

<style scoped>
.manager-container {
    display: flex;
    min-height: calc(100vh - 80px);
    margin-top: 80px;
    background: #f7f9fc;
}

.manager-content {
    flex: 1;
    padding: 20px;
    margin-left: 220px; /* 展开时的宽度 */
    transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.collapsed-content {
    margin-left: 80px; /* 折叠时的宽度 */
}

.dashboard {
    max-width: 1280px;
    margin: 0 auto;
}


/* 数据和图表区域样式 */
.data-section {
    display: grid;
    grid-template-columns: 1fr;
    gap: 24px;
    margin-bottom: 24px;
}

@media (min-width: 992px) {
    .data-section {
        grid-template-columns: 1fr 1fr;
    }
}

/* 最近数据样式 */
.recent-data-section {
    display: grid;
    grid-template-columns: 1fr;
    gap: 24px;
    margin-top: 24px;
}

@media (min-width: 992px) {
    .recent-data-section {
        grid-template-columns: 1fr 1fr;
    }
}

.recent-card {
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    padding: 16px;
}

.recent-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
    padding-bottom: 8px;
    border-bottom: 1px solid #ebeef5;
}

.recent-header h3 {
    font-size: 16px;
    margin: 0;
    color: #303133;
}
</style>
