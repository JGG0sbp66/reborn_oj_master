<template>
  <div class="code-background">
    <div class="gradient-background"></div>
    
    <svg class="circuit-lines" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <pattern id="circuit-pattern" x="0" y="0" width="200" height="200" patternUnits="userSpaceOnUse">
        <path d="M10,10 L50,10 L50,50 L90,50 L90,10 L130,10" fill="none" stroke="#d0d7de" stroke-width="1" stroke-dasharray="3,3"/>
        <path d="M10,60 L130,60 L130,100 L170,100" fill="none" stroke="#d0d7de" stroke-width="1" stroke-dasharray="3,3"/>
        <path d="M10,120 L50,120 L50,160 L90,160 L90,120" fill="none" stroke="#d0d7de" stroke-width="1" stroke-dasharray="3,3"/>
        <path d="M110,170 L110,130 L150,130 L150,170 L190,170" fill="none" stroke="#d0d7de" stroke-width="1" stroke-dasharray="3,3"/>
      </pattern>
      <rect x="0" y="0" width="100%" height="100%" fill="url(#circuit-pattern)" />
    </svg>
    
    <transition-group name="code-symbol" tag="div" class="code-symbols-container">
      <div 
        v-for="symbol in visibleSymbols" 
        :key="symbol.id" 
        class="code-symbol"
        v-memo="[symbol.id]"
        :style="{
          left: symbol.x + 'px',
          top: symbol.y + 'px',
          opacity: symbol.opacity,
          transform: `rotate(${symbol.rotation}deg) scale(${symbol.scale})`,
          color: symbol.color
        }"
      >
        {{ symbol.text }}
      </div>
    </transition-group>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';

// 代码符号列表
const codeSymbols = [
  '{', '}', '(', ')', '[', ']', '<', '>', '//', '/*', '*/', '=>', '===', '&&', '||',
  'function', 'const', 'let', 'var', 'return', 'if', 'else', 'for', 'while', 'async', 'await'
];

// 符号状态
interface CodeSymbol {
  id: number;
  text: string;
  x: number;
  y: number;
  opacity: number;
  rotation: number;
  scale: number;
  color: string;
  speed: number;
  direction: number;
}

let nextId = 0;
const visibleSymbols = ref<CodeSymbol[]>([]);
const maxSymbols = 30; // 最大符号数量
let animationFrameId: number | null = null;

// 生成随机符号
const createRandomSymbol = (): CodeSymbol => {
  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;
  
  // 随机颜色 - 浅色调
  const colors = ['rgba(130, 130, 140, 0.2)', 'rgba(100, 120, 140, 0.15)', 'rgba(120, 140, 160, 0.25)'];
  
  return {
    id: nextId++,
    text: codeSymbols[Math.floor(Math.random() * codeSymbols.length)],
    x: Math.random() * windowWidth,
    y: Math.random() * windowHeight,
    opacity: 0.1 + Math.random() * 0.2, // 半透明
    rotation: Math.random() * 20 - 10,  // -10到10度
    scale: 0.8 + Math.random() * 0.7,   // 0.8到1.5
    color: colors[Math.floor(Math.random() * colors.length)],
    speed: 0.2 + Math.random() * 0.3,   // 移动速度
    direction: Math.random() * Math.PI * 2 // 随机方向（弧度）
  };
};

// 添加新符号
const addSymbol = () => {
  if (visibleSymbols.value.length < maxSymbols) {
    visibleSymbols.value.push(createRandomSymbol());
  }
};

// 更新符号位置和状态
const updateSymbols = () => {
  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;
  
  visibleSymbols.value = visibleSymbols.value.map((symbol: CodeSymbol) => {
    // 更新位置
    symbol.x += Math.cos(symbol.direction) * symbol.speed;
    symbol.y += Math.sin(symbol.direction) * symbol.speed;
    
    // 当符号移出屏幕，将其重置到屏幕的另一侧
    if (symbol.x < -50) symbol.x = windowWidth + 50;
    if (symbol.x > windowWidth + 50) symbol.x = -50;
    if (symbol.y < -50) symbol.y = windowHeight + 50;
    if (symbol.y > windowHeight + 50) symbol.y = -50;
    
    return symbol;
  });
  
  // 动画循环
  animationFrameId = requestAnimationFrame(updateSymbols);
};

// 初始化符号
const initSymbols = () => {
  // 初始添加一批符号
  for (let i = 0; i < Math.floor(maxSymbols / 2); i++) {
    addSymbol();
  }
  
  // 逐步添加剩余符号，创造渐进效果
  const interval = setInterval(() => {
    addSymbol();
    if (visibleSymbols.value.length >= maxSymbols) {
      clearInterval(interval);
    }
  }, 300);
  
  // 启动动画
  updateSymbols();
};

onMounted(() => {
  initSymbols();
});

onBeforeUnmount(() => {
  if (animationFrameId !== null) {
    cancelAnimationFrame(animationFrameId);
  }
});
</script>

<style scoped>
.code-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  overflow: hidden;
}

.gradient-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #f8f9fa 0%, #f0faff 100%);
}

.circuit-lines {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0.5;
}

.code-symbols-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.code-symbol {
  position: absolute;
  font-family: 'Consolas', 'Monaco', monospace;
  font-size: 1.5rem;
  font-weight: 500;
  user-select: none;
  pointer-events: none;
  transition: opacity 0.3s ease;
}

/* 符号的进入离开动画 */
.code-symbol-enter-active,
.code-symbol-leave-active {
  transition: opacity 0.8s ease, transform 0.8s ease;
}

.code-symbol-enter-from,
.code-symbol-leave-to {
  opacity: 0 !important;
  transform: scale(0.5) !important;
}
</style> 