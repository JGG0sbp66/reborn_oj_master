<template>
  <div class="code-background-container">
    <canvas ref="canvasRef" 
            @mousemove="handleMouseMove"
            @mouseleave="resetMousePosition"></canvas>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue';

// 画布引用
const canvasRef = ref<HTMLCanvasElement | null>(null);
let ctx: CanvasRenderingContext2D | null = null;
let animationFrameId: number | null = null;

// 代码片段示例 - 常见算法代码片段
const codeSnippets = [
  // 快速排序
  [
    "function quickSort(arr) {",
    "  if (arr.length <= 1) return arr;",
    "  const pivot = arr[0];",
    "  const left = [];",
    "  const right = [];",
    "  for (let i = 1; i < arr.length; i++) {",
    "    if (arr[i] < pivot) left.push(arr[i]);",
    "    else right.push(arr[i]);",
    "  }",
    "  return [...quickSort(left), pivot, ...quickSort(right)];",
    "}"
  ],
  // 二分搜索
  [
    "function binarySearch(arr, target) {",
    "  let left = 0;",
    "  let right = arr.length - 1;",
    "  while (left <= right) {",
    "    const mid = Math.floor((left + right) / 2);",
    "    if (arr[mid] === target) return mid;",
    "    if (arr[mid] < target) left = mid + 1;",
    "    else right = mid - 1;",
    "  }",
    "  return -1;",
    "}"
  ],
  // 动态规划 - 斐波那契
  [
    "function fibonacci(n) {",
    "  const dp = new Array(n + 1);",
    "  dp[0] = 0;",
    "  dp[1] = 1;",
    "  for (let i = 2; i <= n; i++) {",
    "    dp[i] = dp[i-1] + dp[i-2];",
    "  }",
    "  return dp[n];",
    "}"
  ],
  // 深度优先搜索
  [
    "function dfs(graph, start, visited = new Set()) {",
    "  visited.add(start);",
    "  console.log(start);",
    "  for (const neighbor of graph[start]) {",
    "    if (!visited.has(neighbor)) {",
    "      dfs(graph, neighbor, visited);",
    "    }",
    "  }",
    "}"
  ]
];

// 参数配置
const config = {
  numLines: 70,             // 减少代码行数，避免太密集
  lineSpacing: 15,
  baseSpeed: 0.3,           // 降低基础速度
  maxSpeed: 1.5,            // 降低最大速度
  minOpacity: 0.1,
  maxOpacity: 0.5,          // 降低最大不透明度，让背景更淡
  textColor: '#42b983',     // Vue绿色
  fontSize: 13,             // 字体稍微小一点
  fontFamily: '"Fira Code", "Source Code Pro", monospace' // 更好的代码字体
};

// 鼠标位置
const mousePosition = ref({ x: 0, y: 0 });
const isMouseInCanvas = ref(false);

// 代码行数据结构
interface CodeLine {
  text: string;
  x: number;
  y: number;
  speed: number;
  opacity: number;
  snippetIndex: number;
  lineIndex: number;
}

// 代码行数组
let codeLines: CodeLine[] = [];

// 处理鼠标移动
const handleMouseMove = (e: MouseEvent) => {
  if (!canvasRef.value) return;
  const rect = canvasRef.value.getBoundingClientRect();
  mousePosition.value = {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top
  };
  isMouseInCanvas.value = true;
};

// 重置鼠标位置
const resetMousePosition = () => {
  isMouseInCanvas.value = false;
};

// 初始化代码行
const initCodeLines = () => {
  if (!canvasRef.value) return;
  
  const canvas = canvasRef.value;
  const width = canvas.width;
  const height = canvas.height;
  
  codeLines = [];
  
  for (let i = 0; i < config.numLines; i++) {
    const snippetIndex = Math.floor(Math.random() * codeSnippets.length);
    const lineIndex = Math.floor(Math.random() * codeSnippets[snippetIndex].length);
    const text = codeSnippets[snippetIndex][lineIndex];
    
    codeLines.push({
      text,
      x: Math.random() * width,
      y: Math.random() * height,
      speed: config.baseSpeed + Math.random() * (config.maxSpeed - config.baseSpeed),
      opacity: config.minOpacity + Math.random() * (config.maxOpacity - config.minOpacity),
      snippetIndex,
      lineIndex
    });
  }
};

// 更新代码行
const updateCodeLines = () => {
  if (!canvasRef.value || !ctx) return;
  
  const canvas = canvasRef.value;
  const width = canvas.width;
  const height = canvas.height;
  
  // 更新代码行位置
  for (const line of codeLines) {
    line.y += line.speed;
    
    // 如果超出画布底部，重置到顶部
    if (line.y > height + 20) {
      line.y = -20;
      line.x = Math.random() * width;
      
      // 可能更换代码片段
      if (Math.random() < 0.3) {
        line.snippetIndex = Math.floor(Math.random() * codeSnippets.length);
        line.lineIndex = Math.floor(Math.random() * codeSnippets[line.snippetIndex].length);
        line.text = codeSnippets[line.snippetIndex][line.lineIndex];
      }
    }
    
    // 根据鼠标位置调整速度和透明度
    if (isMouseInCanvas.value) {
      const dx = line.x - mousePosition.value.x;
      const dy = line.y - mousePosition.value.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const influence = Math.max(0, 1 - distance / 300); // 影响半径
      
      // 鼠标附近代码减速并增加透明度
      line.speed = config.baseSpeed + (1 - influence) * (line.speed - config.baseSpeed);
      line.opacity = Math.min(config.maxOpacity * 1.5, line.opacity + influence * 0.2);
    } else {
      // 恢复正常速度和透明度
      line.speed = config.baseSpeed + Math.random() * (config.maxSpeed - config.baseSpeed);
      line.opacity = config.minOpacity + Math.random() * (config.maxOpacity - config.minOpacity);
    }
  }
};

// 绘制代码行
const drawCodeLines = () => {
  if (!canvasRef.value || !ctx) return;
  
  const canvas = canvasRef.value;
  
  // 清空画布 - 使用半透明黑色背景以增加对比度
  ctx.fillStyle = 'rgba(10, 15, 20, 0.05)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // 设置字体
  ctx.font = `${config.fontSize}px ${config.fontFamily}`;
  
  // 绘制代码行
  for (const line of codeLines) {
    // 使用绿色阴影增加发光效果
    ctx.shadowColor = 'rgba(66, 185, 131, 0.5)';
    ctx.shadowBlur = 5;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    
    ctx.fillStyle = `rgba(66, 185, 131, ${line.opacity})`;
    ctx.fillText(line.text, line.x, line.y);
    
    // 重置阴影，避免影响性能
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
  }
};

// 动画循环
const animate = () => {
  updateCodeLines();
  drawCodeLines();
  animationFrameId = requestAnimationFrame(animate);
};

// 设置画布大小
const resizeCanvas = () => {
  if (!canvasRef.value || !ctx) return;
  
  const canvas = canvasRef.value;
  canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
  canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;
  
  // 重新初始化代码行
  initCodeLines();
};

// 监听组件挂载
onMounted(() => {
  if (!canvasRef.value) return;
  
  ctx = canvasRef.value.getContext('2d');
  if (!ctx) return;
  
  // 设置画布大小
  resizeCanvas();
  
  // 监听窗口大小变化
  window.addEventListener('resize', resizeCanvas);
  
  // 开始动画
  animate();
});

// 组件卸载时清理
onUnmounted(() => {
  window.removeEventListener('resize', resizeCanvas);
  
  if (animationFrameId !== null) {
    cancelAnimationFrame(animationFrameId);
  }
});
</script>

<style scoped>
.code-background-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  overflow: hidden;
  background-color: rgba(15, 20, 25, 0.92); /* 深色背景，略微透明 */
}

canvas {
  display: block;
  width: 100%;
  height: 100%;
  filter: contrast(1.1); /* 增加对比度 */
}
</style> 