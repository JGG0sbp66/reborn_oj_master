import { reactive, readonly } from 'vue';

// 圆形对象接口
interface Circle {
  x: number;
  y: number;
  size: number;
  color: string;
  opacity: number;
  speedX: number;
  speedY: number;
}

// 配置
const CIRCLE_COUNT = 30;
const MIN_SIZE = 100;
const MAX_SIZE = 280;
const COLORS = [
  '#42b983', // 绿色
  '#3498db', // 蓝色
  '#ff7849', // 橙色
  '#fd5c63', // 红色
  '#a855f7', // 紫色
  '#2dd4bf', // 青色
  '#ffdb4d'  // 黄色
];
const MIN_OPACITY = 0.25;
const MAX_OPACITY = 0.38;
const SPEED_FACTOR = 0.35;

// 全局状态
const state = reactive({
  circles: [] as Circle[],
  isInitialized: false,
  animationFrameId: null as number | null,
  windowWidth: window.innerWidth,
  windowHeight: window.innerHeight
});

// 生成随机数
const random = (min: number, max: number) => Math.random() * (max - min) + min;

// 初始化圆形
const initCircles = () => {
  if (state.isInitialized) return;
  
  state.circles = [];
  state.windowWidth = window.innerWidth;
  state.windowHeight = window.innerHeight;
  
  for (let i = 0; i < CIRCLE_COUNT; i++) {
    const size = random(MIN_SIZE, MAX_SIZE);
    state.circles.push({
      x: random(0, state.windowWidth - size),
      y: random(0, state.windowHeight - size),
      size,
      color: COLORS[Math.floor(random(0, COLORS.length))],
      opacity: random(MIN_OPACITY, MAX_OPACITY),
      speedX: random(-SPEED_FACTOR, SPEED_FACTOR),
      speedY: random(-SPEED_FACTOR, SPEED_FACTOR)
    });
  }
  
  state.isInitialized = true;
};

// 更新圆形位置
const updateCircles = () => {
  for (const circle of state.circles) {
    // 更新位置
    circle.x += circle.speedX;
    circle.y += circle.speedY;
    
    // 碰到边界反弹
    if (circle.x <= 0 || circle.x + circle.size >= state.windowWidth) {
      circle.speedX *= -1;
    }
    if (circle.y <= 0 || circle.y + circle.size >= state.windowHeight) {
      circle.speedY *= -1;
    }
  }
  
  state.animationFrameId = requestAnimationFrame(updateCircles);
};

// 处理窗口大小变化
const handleResize = () => {
  const oldWidth = state.windowWidth;
  const oldHeight = state.windowHeight;
  state.windowWidth = window.innerWidth;
  state.windowHeight = window.innerHeight;
  
  // 按比例调整圆形位置
  for (const circle of state.circles) {
    circle.x = (circle.x / oldWidth) * state.windowWidth;
    circle.y = (circle.y / oldHeight) * state.windowHeight;
  }
};

// 启动动画
const startAnimation = () => {
  if (!state.isInitialized) {
    initCircles();
  }
  
  if (!state.animationFrameId) {
    updateCircles();
  }
  
  window.addEventListener('resize', handleResize);
};

// 停止动画
const stopAnimation = () => {
  if (state.animationFrameId) {
    cancelAnimationFrame(state.animationFrameId);
    state.animationFrameId = null;
  }
  
  window.removeEventListener('resize', handleResize);
};

// 清理资源
const cleanup = () => {
  stopAnimation();
  state.circles = [];
  state.isInitialized = false;
};

// 导出的方法和只读状态
export default {
  state: readonly(state),
  startAnimation,
  stopAnimation,
  cleanup
}; 