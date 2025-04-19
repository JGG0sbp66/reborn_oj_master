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
                <button 
                    class="signup-button" 
                    @click="handleSignup"
                    :disabled="loading || isSignedUp"
                    :class="{ 'signup-button-disabled': isSignedUp }"
                >
                    <el-icon v-if="loading" class="button-icon is-loading"><Loading /></el-icon>
                    <el-icon v-else-if="isSignedUp" class="button-icon"><Check /></el-icon>
                    <el-icon v-else class="button-icon"><Plus /></el-icon>
                    <span>{{ buttonText }}</span>
                </button>
            </div>
        </div>
        <!-- 添加AlertBox组件 -->
        <AlertBox ref="alertBoxRef" />
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { Timer, Plus, Check, Loading } from '@element-plus/icons-vue';  
import axios from 'axios';
import AlertBox from '../JGG/alertbox.vue';

const props = defineProps({
    raceInfo: {
        type: Object,
        required: true
    },
    uid: {
        type: String,
        required: true
    }
});

const emit = defineEmits(['refresh']);

// 状态变量
const loading = ref(false);
const isSignedUp = computed(() => props.raceInfo?.value?.race_info?.is_registered === '已报名');
const alertBoxRef = ref(null);

// 按钮文本
const buttonText = computed(() => {
    if (loading.value) return '报名中...';
    if (isSignedUp.value) return '已报名';
    return '立即报名';
});

// 报名函数
const handleSignup = async () => {
    if (loading.value || isSignedUp.value) return;
    
    try {
    loading.value = true;
    const { data } = await axios.post("http://localhost:5000/api/race-register", { race_uid: props.uid });
    
    if (data.success) {
      // 直接更新本地状态
      if (props.raceInfo.value) {
        props.raceInfo.value.race_info.is_registered = '已报名';
      } else if (props.raceInfo) {
        props.raceInfo.race_info.is_registered = '已报名';
      }
      
      emit('refresh'); // 仍然通知父组件更新数据
      alertBoxRef.value?.show('报名成功！', 0);
    }
  } catch (error) {
        console.error('报名失败:', error);
        if (error.response?.status === 401 || error.response?.status === 403) {
            alertBoxRef.value?.show('请先登录后再报名', 2);
            return;
        }
        alertBoxRef.value?.show(error.response.data.message, 2);
    } finally {
        loading.value = false;
    }
};

// 格式化日期时间
const formatDateTime = (dateStr) => {
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
    // 获取比赛状态
    const status = props.raceInfo?.value?.race_info?.status;
    
    if (!status) {
        return {
            status: 'not-started',
            title: '加载中',
            subtitle: '正在获取比赛信息...'
        };
    }

    switch (status) {
        case 'upcoming':
            return {
                status: 'signup',  // 保持 CSS 类名不变
                title: '比赛报名中',
                subtitle: `将于 ${formatDateTime(props.raceInfo?.value?.race_info.start_time)} 开始`
            };
        case 'running':
            return {
                status: 'in-progress',
                title: '比赛进行中',
                subtitle: `将于 ${formatDateTime(props.raceInfo?.value?.race_info.end_time)} 结束`
            };
        case 'ended':
            return {
                status: 'ended',
                title: '比赛已结束',
                subtitle: `于 ${formatDateTime(props.raceInfo?.value?.race_info.end_time)} 结束`
            };
        default:
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
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
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

.signup-button:hover:not(:disabled) {
    background: #b45309;
}

.signup-button:disabled {
    cursor: not-allowed;
    opacity: 0.7;
}

.signup-button-disabled {
    background: #10b981;
}

.signup-button-disabled:hover {
    background: #059669;
}

.button-icon {
    font-size: 18px;
}

.button-icon.is-loading {
    animation: spin 1s linear infinite;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
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