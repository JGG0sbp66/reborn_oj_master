<template>
    <managerhead />
    <div class="manager-container">
        <managerslider />
        <div class="manager-content" :class="{ 'collapsed-content': isCollapsed }">
            <div class="dashboard">
                <!-- 欢迎信息 -->
                <managerwelcome />


                <!-- 数据统计和图表 -->
                <div class="data-section">
                    <manageractive />

                    <div class="tables-container">
                        <managerprobleminfo />
                        <managerraceinfo />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import managerslider from '@/components/zq/manager-slider.vue';
import managerhead from '@/components/zq/manager-head.vue';
import managerwelcome from '@/components/zq/manager-welcome.vue';
import manageractive from '@/components/zq/manager-active.vue';
import managerprobleminfo from '@/components/zq/manager-probleminfo.vue';
import managerraceinfo from '@/components/zq/manager-raceinfo.vue';
import {
    User, Document, TrendCharts,
    Monitor, Connection, Timer
} from '@element-plus/icons-vue';


// 获取侧边栏折叠状态
const isCollapsed = ref(false);

// 当前日期
const currentDate = ref(new Date().toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long'
}));


// 颜色计算
const getCpuColor = computed(() => {
    if (cpuUsage.value < 60) return '#42b983';
    if (cpuUsage.value < 80) return '#e6a23c';
    return '#f56c6c';
});

const getMemoryColor = computed(() => {
    if (memoryUsage.value < 60) return '#42b983';
    if (memoryUsage.value < 80) return '#e6a23c';
    return '#f56c6c';
});

const getDiskColor = computed(() => {
    if (diskUsage.value < 70) return '#42b983';
    if (diskUsage.value < 90) return '#e6a23c';
    return '#f56c6c';
});


// 最近题目数据
const recentQuestions = ref([
    { id: 'Q-1024', title: '两数之和的高效算法', difficulty: '简单', createdAt: '2023-12-01 10:30:45' },
    { id: 'Q-1025', title: '二叉树的中序遍历', difficulty: '中等', createdAt: '2023-12-02 14:22:10' },
    { id: 'Q-1026', title: '最长回文子串', difficulty: '中等', createdAt: '2023-12-03 09:15:33' },
    { id: 'Q-1027', title: '高级动态规划问题', difficulty: '困难', createdAt: '2023-12-04 16:40:27' },
    { id: 'Q-1028', title: '字符串匹配算法', difficulty: '简单', createdAt: '2023-12-05 11:05:19' }
]);

// 最近竞赛数据
const recentCompetitions = ref([
    { id: 'C-256', title: '周末算法挑战赛', status: '进行中', startTime: '2023-12-02 09:00:00' },
    { id: 'C-257', title: '高校编程大赛预选赛', status: '已结束', startTime: '2023-11-25 13:30:00' },
    { id: 'C-258', title: '新手入门编程竞赛', status: '未开始', startTime: '2023-12-10 10:00:00' },
    { id: 'C-259', title: '冬季算法竞赛', status: '未开始', startTime: '2023-12-15 09:30:00' },
    { id: 'C-260', title: '企业编程挑战赛', status: '已结束', startTime: '2023-11-18 14:00:00' }
]);

// 获取难度标签类型
const getDifficultyType = (difficulty: string) => {
    switch (difficulty) {
        case '简单': return 'success';
        case '中等': return 'warning';
        case '困难': return 'danger';
        default: return 'info';
    }
};

// 获取状态标签类型
const getStatusType = (status: string) => {
    switch (status) {
        case '进行中': return 'success';
        case '未开始': return 'info';
        case '已结束': return 'danger';
        default: return 'info';
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

    // 模拟获取数据
    fetchDashboardData();
});

// 模拟获取仪表盘数据
const fetchDashboardData = () => {
    // 实际项目中，这里会通过API获取真实数据
    // 这里只是模拟数据加载
    setTimeout(() => {
        // 数据已经在上面初始化了
    }, 1000);
};
</script>

<style scoped>
.manager-container {
    display: flex;
    min-height: calc(100vh - 80px);
    margin-top: 80px;
}

.manager-content {
    flex: 1;
    padding: 20px;
    margin-left: 220px;
    /* 侧边栏宽度 */
    transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.collapsed-content {
    margin-left: 60px;
    /* 折叠后的侧边栏宽度 */
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
}

@media (min-width: 992px) {
    .data-section {
        grid-template-columns: 1fr 1fr;
    }
}






</style>
