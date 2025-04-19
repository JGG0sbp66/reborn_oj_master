<template>
  <div class="animated-background">
    <div 
      v-for="(circle, index) in state.circles" 
      :key="index" 
      class="circle" 
      :style="{ 
        backgroundColor: circle.color, 
        width: circle.size + 'px', 
        height: circle.size + 'px',
        left: circle.x + 'px', 
        top: circle.y + 'px',
        opacity: circle.opacity
      }"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount } from 'vue';
import backgroundState from '@/utils/backgroundState';

// 使用全局状态
const { state, startAnimation, stopAnimation } = backgroundState;

// 生命周期钩子
onMounted(() => {
  // 启动动画
  startAnimation();
});

// 不在组件卸载时停止动画，保持全局状态
// 只有在整个应用销毁时才清理
</script>

<style scoped>
.animated-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #f7f9fc;
  z-index: -1;
  overflow: hidden;
}

.circle {
  position: absolute;
  border-radius: 50%;
  filter: blur(12px);
  pointer-events: none;
  mix-blend-mode: multiply;
  animation: pulse 15s infinite alternate ease-in-out;
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
}
</style> 