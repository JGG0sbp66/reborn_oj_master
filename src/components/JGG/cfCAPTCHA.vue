<template>
    <div class="turnstile-container">
        <!-- 占位符，当验证码未加载时显示 -->
        <div v-if="!loaded && !error" class="cf-placeholder">
            <div class="cf-placeholder-spinner"></div>
            <span>正在加载验证码...</span>
        </div>

        <!-- 错误提示 -->
        <div v-if="error" class="cf-error">
            <span>{{ error }}</span>
        </div>

        <!-- 实际验证码 -->
        <div class="cf-turnstile" :data-sitekey="sitekey" :data-theme="theme" ref="turnstileWidget"
            :style="{ display: loaded ? 'block' : 'none' }"></div>
    </div>
</template>

<script setup lang="ts">
import { ref, defineEmits, onMounted, type PropType } from "vue";

const props = defineProps({
    sitekey: {
        type: String,
        required: true,
        default: '输入前端密钥'
    },
    theme: {
        type: String as PropType<'light' | 'dark' | 'auto'>,
        default: 'light'
    }
});

// 定义事件
const emit = defineEmits(['verified', 'error', 'loaded']);

const turnstileWidget = ref<HTMLElement>();
const loaded = ref(false); // 控制验证码加载状态
const error = ref<string | null>(null); // 错误信息

// 重置验证码
const reset = () => {
    if (window.turnstile) {
        window.turnstile.reset(turnstileWidget.value);
    }
};

const initTurnstile = () => {
    if (turnstileWidget.value) {
        window.turnstile?.render(turnstileWidget.value, {
            sitekey: props.sitekey,
            theme: props.theme,
            callback: (token: string) => { // 验证成功回调
                loaded.value = true;
                emit('verified', token);
            },
            'error-callback': () => { // 验证失败回调
                error.value = '验证码加载失败，请刷新页面后再试';
                emit('error', '验证码加载失败');
            }
        });
    }
};

onMounted(() => {
    // 检查是否已加载 Turnstile 脚本
    if (window.turnstile) {
        initTurnstile();
    } else {
        // 动态加载脚本
        const script = document.createElement('script');
        script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
        script.onload = () => {
            initTurnstile();
        };
        script.onerror = () => {
            error.value = '无法加载验证码脚本，请检查网络连接或稍后再试';
            emit('error', '无法加载验证码脚本');
        };
        document.head.appendChild(script);
    }
});

defineExpose({ reset });
</script>

<style scoped>
.turnstile-container {
    width: 100%;
    min-height: 65px;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
}

/* 占位符样式 */
.cf-placeholder {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 65px;
    background-color: #f5f5f5;
    border-radius: 4px;
    color: #666;
    font-size: 14px;
}

.cf-placeholder-spinner {
    width: 24px;
    height: 24px;
    border: 3px solid rgba(0, 0, 0, 0.1);
    border-radius: 50%;
    border-top-color: #18a058;
    animation: spin 1s ease-in-out infinite;
    margin-bottom: 8px;
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}

/* 错误提示样式 */
.cf-error {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 65px;
    background-color: #f5f5f5;
    border-radius: 4px;
    color: #d32f2f;
    font-size: 14px;
}

.cf-turnstile {
    width: 100%;
}
</style>