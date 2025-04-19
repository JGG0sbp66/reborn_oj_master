<template>
  <div class="code-background">
    <div class="gradient-overlay"></div>
    
    <TransitionGroup 
      name="code-symbol"
      tag="div"
      class="code-symbols-container"
    >
      <div 
        v-for="symbol in visibleSymbols" 
        :key="symbol.id"
        class="code-symbol"
        :style="{
          left: `${symbol.x}%`,
          top: `${symbol.y}%`,
          opacity: symbol.opacity,
          fontSize: `${symbol.size}px`,
          transform: `rotate(${symbol.rotation}deg)`,
          color: symbol.color
        }"
        v-memo="[symbol.id]"
      >
        {{ symbol.content }}
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue';

// 代码符号列表
const codeSymbols = ['{', '}', '<', '>', '//', '/*', '*/', '()', '[]', '=>', '===', '&&', '||', 'if', 'for', 'const', 'let', 'function', 'return', ';', ':', '?'];

// 代码颜色列表 - 使用代码语法高亮常见的颜色
const codeColors = [
  '#18a058', // 绿色
  '#2080f0', // 蓝色
  '#d03050', // 红色
  '#f0a020', // 橙色
  '#8a2be2', // 紫色
  '#0096c7', // 青色
  '#e63946', // 亮红色
  '#087f5b', // 深绿色
  '#6a4c93'  // 暗紫色
];

// 可见符号的状态
const symbols = ref<{id: number, content: string, x: number, y: number, opacity: number, size: number, rotation: number, lifespan: number, color: string}[]>([]);
const visibleSymbols = computed(() => symbols.value);

// 创建一个新的代码符号
const createSymbol = () => {
  const id = Date.now() + Math.random();
  const content = codeSymbols[Math.floor(Math.random() * codeSymbols.length)];
  const x = Math.random() * 100;
  const y = Math.random() * 100;
  const opacity = 0.4 + Math.random() * 0.4; // 0.4到0.8之间的透明度
  const size = 16 + Math.random() * 24; // 16px到40px之间的大小
  const rotation = Math.random() * 40 - 20; // -20到20度之间的旋转
  const lifespan = 5000 + Math.random() * 10000; // 5-15秒的生命周期
  const color = codeColors[Math.floor(Math.random() * codeColors.length)]; // 随机选择一个颜色
  
  return { id, content, x, y, opacity, size, rotation, lifespan, color };
};

// 初始化符号
const initBackground = () => {
  // 初始化15-25个符号
  const initialSymbolCount = 15 + Math.floor(Math.random() * 11);
  for (let i = 0; i < initialSymbolCount; i++) {
    symbols.value.push(createSymbol());
  }
};

// 动画定时器
let symbolTimer: number | null = null;

// 更新符号的生命周期
const updateSymbols = () => {
  const now = Date.now();
  
  // 移除过期的符号
  symbols.value = symbols.value.filter(symbol => {
    const creationTime = symbol.id - Math.random() * 1000; // 修正近似创建时间的计算
    return now - creationTime < symbol.lifespan;
  });
  
  // 确保总是添加新符号，维持最小数量
  if (symbols.value.length < 15 || (Math.random() < 0.3 && symbols.value.length < 30)) {
    const newSymbol = createSymbol();
    symbols.value.push(newSymbol);
  }
  
  symbolTimer = setTimeout(updateSymbols, 800); // 更频繁地检查和添加
};

onMounted(() => {
  initBackground();
  updateSymbols();
});

onUnmounted(() => {
  if (symbolTimer) clearTimeout(symbolTimer);
});
</script>

<style scoped>
.code-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  overflow: hidden;
  background-color: rgba(248, 249, 250, 0.9); /* 添加轻微透明背景确保可见 */
}

.gradient-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(120deg, #f8f9fa, #f0faff);
  z-index: 1;
  opacity: 0.85; /* 稍微降低透明度 */
}

.code-symbols-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 2;
}

.code-symbol {
  position: absolute;
  font-family: 'Fira Code', 'Courier New', monospace;
  font-weight: 600; /* 更粗的字体 */
  user-select: none;
  pointer-events: none;
  opacity: 0.7; /* 统一设置基础不透明度 */
  text-shadow: 0 0 3px rgba(0, 0, 0, 0.1); /* 轻微阴影增加可读性 */
}

/* 过渡动画 */
.code-symbol-enter-active,
.code-symbol-leave-active {
  transition: opacity 1.5s ease, transform 1.5s ease;
}

.code-symbol-enter-from,
.code-symbol-leave-to {
  opacity: 0 !important;
  transform: scale(0.8) !important;
}
</style> 