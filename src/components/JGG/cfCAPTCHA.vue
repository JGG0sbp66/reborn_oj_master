<template>
    <div class="turnstile-container" @click="handleClick">
        <!-- 占位符（允许点击穿透） -->
        <div v-if="!loaded && !error" class="cf-placeholder">
            <div class="cf-placeholder-spinner"></div>
            <span>正在加载验证码...</span>
        </div>

        <!-- 错误提示（允许点击穿透） -->
        <div v-if="error" class="cf-error">
            <span>{{ error }}</span>
        </div>

        <!-- 实际验证码 -->
        <div class="cf-turnstile" :data-sitekey="sitekey" :data-theme="theme" ref="turnstileWidget"
            :style="{ display: loaded ? 'block' : 'none' }">
        </div>
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

const emit = defineEmits(['verified', 'error', 'loaded']);
const turnstileWidget = ref<HTMLElement>();
const loaded = ref(true);
const error = ref<string | null>(null);
const widgetId = ref<string | null>(null);

// 重置函数
const reset = () => {
    if (window.turnstile && widgetId.value) {
        try {
            window.turnstile.reset(widgetId.value);
            console.log('验证码已重置');
            error.value = null; // 可选：清除错误状态
        } catch (e) {
            console.error('重置失败:', e);
            error.value = '验证码重置失败';
        }
    } else {
        console.warn('重置被跳过：Turnstile 未加载或 widgetId 无效');
    }
};

const handleClick = (event: MouseEvent) => {
    console.log('点击事件触发', event.target);
    reset();
};

const initTurnstile = () => {
    if (turnstileWidget.value && window.turnstile) {
        setTimeout(() => {
            loaded.value = false;
        }, 100);
        try {
            widgetId.value = window.turnstile.render(turnstileWidget.value, {
                sitekey: props.sitekey,
                theme: props.theme,
                callback: (token: string) => {
                    loaded.value = true;
                    emit('verified', token);
                },
                'error-callback': () => {
                    error.value = '验证失败，请重试';
                    emit('error', '验证失败');
                }
            });
            console.log('Turnstile 初始化成功，widgetId:', widgetId.value);
        } catch (e) {
            error.value = '验证码加载失败';
            console.error('初始化错误:', e);
        }
    }
};

onMounted(() => {
    if (window.turnstile) {
        initTurnstile();
    } else {
        const script = document.createElement('script');
        script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
        script.onload = initTurnstile;
        script.onerror = () => {
            error.value = '无法加载验证码脚本';
            console.error('脚本加载失败');
        };
        document.head.appendChild(script);
    }
});

defineExpose({ reset });
</script>

<style scoped>
.cf-placeholder,
.cf-error {
    pointer-events: none;
    /* 允许点击事件穿透 */
}

.turnstile-container {
    width: 100%;
    min-height: 65px;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    cursor: pointer;
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