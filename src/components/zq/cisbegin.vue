<template>
    <div class="competition-status">
        <div class="status-card" :class="competitionStatusClass">
            <div class="card-content">
                <div class="status-icon">
                    <el-icon><Timer /></el-icon>
                </div>
                <div class="status-content">
                    <div class="status-title">{{ competitionStatus.title }}</div>
                    <div class="status-subtitle">{{ competitionStatus.subtitle }}</div>
                </div>
            </div>
            
            <!-- 报名按钮 -->
            <div v-if="competitionStatus.status === 'signup'" class="signup-button-container">
                <button class="signup-button" @click="handleSignup">
                    <el-icon class="button-icon"><Plus /></el-icon>
                    <span>立即报名</span>
                </button>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue';
import type { ComputedRef } from 'vue';
import { Timer, Plus } from '@element-plus/icons-vue';  

// 定义类型
interface RaceInfo {
    value: {
        race_info: {
            tags: Array<{ name: string }>;
            start_time: string;
            end_time: string;
        }
    }
}

// 使用defineProps接收传递过来的raceInfo
const props = defineProps({
    raceInfo: {
        type: Object,
        required: true
    }
});
console.log(props.raceInfo);

// 处理报名点击事件
const handleSignup = () => {
    // 在这里添加报名逻辑
    console.log('用户点击了报名按钮');
    // 可以触发事件通知父组件
    emit('signup-clicked');
};

// 定义emit
const emit = defineEmits(['signup-clicked']);

// 格式化日期时间
const formatDateTime = (dateStr: string): string => {
    const date = new Date(dateStr);
    return date.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    });
};

// 计算比赛状态
const competitionStatus = computed(() => {
    // 检查是否有tags数据
    if (!props.raceInfo?.value?.race_info.tags || props.raceInfo?.value?.race_info.tags.length === 0) {
        return {
            status: 'not-started',
            title: '加载中',
            subtitle: '正在获取比赛信息...'
        };
    }

    // 获取第一个tag的name
    const firstTagName = props.raceInfo?.value?.race_info.tags[0].name;

    // 根据tag name判断状态
    if (firstTagName === '未开始') {
        return {
            status: 'not-started',
            title: '比赛未开始',
            subtitle: `将于 ${formatDateTime(props.raceInfo?.value?.race_info.start_time)} 开始`
        };
    } 
    else if (firstTagName === '报名中') {
        return {
            status: 'signup',
            title: '比赛报名中',
            subtitle: `将于 ${formatDateTime(props.raceInfo?.value?.race_info.end_time)} 结束`
        };
    }
    else if (firstTagName === '进行中') {
        return {
            status: 'in-progress',
            title: '比赛进行中',
            subtitle: `将于 ${formatDateTime(props.raceInfo?.value?.race_info.end_time)} 结束`
        };
    } else if (firstTagName === '已结束') {
        return {
            status: 'ended',
            title: '比赛已结束',
            subtitle: `于 ${formatDateTime(props.raceInfo?.value?.race_info.end_time)} 结束`
        };
    } else {
        // 默认状态
        return {
            status: 'not-started',
            title: '状态未知',
            subtitle: '请刷新页面重试'
        };
    }
});

// 根据状态设置样式类
const competitionStatusClass = computed(() => ({
    'status-not-started': competitionStatus.value.status === 'not-started',
    'status-in-progress': competitionStatus.value.status === 'in-progress',
    'status-ended': competitionStatus.value.status === 'ended',
    'status-signup': competitionStatus.value.status === 'signup'
}));

</script>

<style scoped>
.competition-status {
    width: 100%;
    padding: 16px;
}

.status-card {
    background: #ffffff;
    border-radius: 12px;
    box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 20px;
    transition: all 0.3s ease;
}

.card-content {
    display: flex;
    align-items: center;
    gap: 16px;
}

.status-card:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(66, 185, 131, 0.15);
}

.status-icon {
    width: 48px;
    height: 48px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
}

.status-content {
    flex: 1;
}

.status-title {
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 4px;
}

.status-subtitle {
    font-size: 14px;
    color: #6b7280;
}

/* 报名按钮样式 */
.signup-button-container {
    text-align: center;
}

.signup-button {
    background: #d97706; /* 橙色背景，与图片一致 */
    color: white;
    border: none;
    border-radius: 8px;
    padding: 12px 24px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    transition: all 0.3s ease;
    width: 100%;
    max-width: 220px;
}

.signup-button:hover {
    background: #b45309;
}

.button-icon {
    font-size: 18px;
}

/* 未开始状态 */
.status-not-started .status-icon {
    background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
    color: #6b7280;
}

.status-not-started .status-title {
    color: #6b7280;
}

/* 进行中状态 */
.status-in-progress .status-icon {
    background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%);
    color: #10b981;
}

.status-in-progress .status-title {
    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
}

/* 已结束状态 */
.status-ended .status-icon {
    background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
    color: #3b82f6;
}

.status-ended .status-title {
    background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
}

/* 报名中状态 */
.status-signup .status-icon {
    background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
    color: #d97706;
}

.status-signup .status-title {
    background: linear-gradient(135deg, #d97706 0%, #b45309 100%);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
}

@media (max-width: 768px) {
    .competition-status {
        padding: 12px;
    }

    .status-card {
        padding: 16px;
    }

    .status-icon {
        width: 40px;
        height: 40px;
        font-size: 20px;
    }

    .status-title {
        font-size: 16px;
    }

    .status-subtitle {
        font-size: 13px;
    }
    
    .signup-button {
        padding: 10px 20px;
        font-size: 14px;
    }
}

@media (max-width: 480px) {
    .competition-status {
        padding: 8px;
    }

    .status-card {
        padding: 12px;
    }

    .card-content {
        gap: 12px;
    }
    
    .status-icon {
        width: 36px;
        height: 36px;
        font-size: 18px;
    }
}
</style>