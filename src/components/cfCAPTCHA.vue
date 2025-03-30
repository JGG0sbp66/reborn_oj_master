<template>
    <div class="turnstile-container">
        <div class="cf-turnstile" :data-sitekey="sitekey" :data-theme="theme" ref="turnstileWidget"></div>
    </div>
</template>


<script setup lang="ts">
import { ref, defineEmits, onMounted, type PropType } from "vue"

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
// 定义事件，分别是成功（有token）和失败（没有token）
const emit = defineEmits(['verified', 'error']);
const turnstileWidget = ref<HTMLElement>();
// 定义函数
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
                emit('verified', token); // 通知父组件
            },
            'error-callback': () => { // 验证失败回调
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
        script.onload = initTurnstile; // 脚本加载完成后初始化
        document.head.appendChild(script);
    }
});

defineExpose({ reset});
</script>


<style scoped></style>
