<template>
  <div class="heatmap-container">
    <div class="heatmap-header">
      <div class="title-wrapper">
        <h3 class="heatmap-title">
          <div class="year-selector">
            <button 
              class="year-btn prev-year" 
              @click="changeYear(-1)"
              :disabled="selectedYear <= minYear"
              :title="selectedYear <= minYear ? '无更早数据' : '查看上一年'"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
            </button>
            <div class="year-display">{{ selectedYear }}</div>
            <button 
              class="year-btn next-year" 
              @click="changeYear(1)"
              :disabled="selectedYear >= maxYear"
              :title="selectedYear >= maxYear ? '当前年份' : '查看下一年'"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </button>
          </div>
          年 - <span class="total-count" :class="{ 'animate-number': isAnimating }">{{ formattedDisplayTotal }}</span> 题已完成
        </h3>
      </div>
      <div class="heatmap-legend">
        <span>较少</span>
        <div class="legend-cells">
          <div class="legend-cell" v-for="level in 5" :key="level" :class="`level-${level-1}`"></div>
        </div>
        <span>较多</span>
      </div>
    </div>
    
    <div class="heatmap-grid">
      <div class="month-labels">
        <div 
          v-for="(month, index) in months" 
          :key="month" 
          class="month-label"
          :style="{ left: `${monthPositions[index]}px` }"
        >
          {{ month }}
        </div>
      </div>
      
      <div class="day-labels">
        <div class="day-label mon">周一</div>
        <div class="day-label wed">周三</div>
        <div class="day-label fri">周五</div>
      </div>
      
      <div class="cells-container">
        <div class="calendar-grid">
          <!-- 日期单元格 - 按周从左往右排列 -->
          <div v-for="rowIndex in 7" :key="`row-${rowIndex}`" class="day-row">
            <div 
              v-for="(week, weekIndex) in calendarData" 
              :key="`${rowIndex}-${weekIndex}`" 
              class="day-cell"
              :class="{
                [`level-${week[rowIndex-1]?.level || 0}`]: week[rowIndex-1]?.date !== '',
                'hidden-cell': !week[rowIndex-1] || week[rowIndex-1]?.date === ''
              }"
              @mouseenter="week[rowIndex-1]?.date && showTooltip($event, week[rowIndex-1])"
              @mousemove="week[rowIndex-1]?.date && updateTooltipPosition($event)"
              @mouseleave="hideTooltip"
            ></div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 自定义悬停提示框 -->
    <div ref="tooltip" class="custom-tooltip" v-show="tooltipVisible" :style="tooltipStyle">
      <div class="tooltip-date">{{ tooltipData.date }}</div>
      <div class="tooltip-count">{{ tooltipData.count }} 题</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';

// 定义类型
interface DayData {
  date: string;
  count: number;
  level: number;
}

// 节流函数
let lastUpdateTime = 0;
const throttle = (fn: Function, delay: number = 10) => {
  return (...args: any[]) => {
    const now = Date.now();
    if (now - lastUpdateTime >= delay) {
      fn(...args);
      lastUpdateTime = now;
    }
  };
};

// 年份选择相关
const today = new Date();
const currentYear = today.getFullYear();
const minYear = 2020;
const maxYear = currentYear; // 最大年份限制为当前年份
const selectedYear = ref(currentYear);

// 更改年份
const changeYear = (delta: number) => {
  const newYear = selectedYear.value + delta;
  if (newYear >= minYear && newYear <= maxYear) {
    selectedYear.value = newYear;
    // 切换年份时重置并开始新的动画
    displayTotal.value = 0;
    setTimeout(() => {
      animateTotal();
    }, 100);
  }
};

// 月份标签
const months = ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"];

// 每个月的起始位置（基于星期和日期计算得到）
const monthPositions = ref<number[]>([]);

// 悬停提示相关状态
const tooltip = ref<HTMLElement | null>(null);
const tooltipVisible = ref(false);
const tooltipStyle = ref({
  top: '0px',
  left: '0px',
  opacity: '0',  // 初始透明
  transform: 'translateY(10px)'  // 初始位置略微下移
});
const tooltipData = ref({
  date: '',
  count: 0
});

// 是否已经完成初始动画
let isTooltipAnimated = false;

// 日历数据 - 按周存储
const calendarData = ref<DayData[][]>([]);

// 显示提示框
const showTooltip = (event: MouseEvent, day: DayData) => {
  if (!tooltip.value || day.date === '') return;
  
  // 取消任何正在进行的隐藏动画
  if (hideTimeout) {
    clearTimeout(hideTimeout);
    hideTimeout = null;
  }
  
  // 解析日期字符串
  const [year, month, dayOfMonth] = day.date.split('-').map(num => parseInt(num, 10));
  
  // 创建日期对象
  const dateObj = new Date(year, month - 1, dayOfMonth);
  
  // 格式化日期为"2024年1月1日 星期一"的格式
  const formattedDate = dateObj.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long'
  });
  
  tooltipData.value = {
    date: formattedDate,
    count: day.count
  };
  
  // 获取热力图容器的位置
  const target = event.currentTarget as HTMLElement;
  const heatmapContainer = target.closest('.heatmap-container') as HTMLElement;
  const rect = heatmapContainer.getBoundingClientRect();
  
  // 计算相对于容器的鼠标位置
  const mouseX = event.clientX - rect.left;
  const mouseY = event.clientY - rect.top;
  
  // 初始化位置到鼠标附近，但设为不可见
  Object.assign(tooltipStyle.value, {
    top: `${mouseY - 15}px`,
    left: `${mouseX + 15}px`,
    opacity: '0',
    transform: 'translateY(10px)'
  });
  
  // 先显示元素
  tooltipVisible.value = true;
  isTooltipAnimated = false;
  
  // 使用requestAnimationFrame确保浏览器已经渲染了提示框的初始位置
  requestAnimationFrame(() => {
    // 在下一帧应用动画效果
    requestAnimationFrame(() => {
      // 重置样式以触发动画
      Object.assign(tooltipStyle.value, {
        opacity: '1',
        transform: 'translateY(0)'
      });
      isTooltipAnimated = true;
    });
  });
};

// 更新提示框位置 - 原始函数
const _updateTooltipPosition = (event: MouseEvent) => {
  // 即使动画还没完成，也允许更新位置
  if (!tooltipVisible.value) return;
  
  // 获取热力图容器的位置
  const target = event.currentTarget as HTMLElement;
  const heatmapContainer = target.closest('.heatmap-container') as HTMLElement;
  const rect = heatmapContainer.getBoundingClientRect();
  
  // 计算相对于容器的鼠标位置
  const mouseX = event.clientX - rect.left;
  const mouseY = event.clientY - rect.top;
  
  // 更新提示框位置
  Object.assign(tooltipStyle.value, {
    top: `${mouseY - 15}px`,
    left: `${mouseX + 15}px`
  });
};

// 使用节流的更新提示框位置函数
const updateTooltipPosition = throttle(_updateTooltipPosition, 10);

// 开始淡出动画
let hideTimeout: number | null = null;

// 隐藏提示框
const hideTooltip = () => {
  if (!tooltipVisible.value) return;
  
  // 首先应用淡出和下落动画
  Object.assign(tooltipStyle.value, {
    opacity: '0',
    transform: 'translateY(10px)'
  });
  
  // 然后在动画完成后隐藏元素
  if (hideTimeout) clearTimeout(hideTimeout);
  hideTimeout = window.setTimeout(() => {
    tooltipVisible.value = false;
    isTooltipAnimated = false;
    hideTimeout = null;
  }, 300); // 动画时间略长，确保完整显示
};

// 生成日历网格数据
function generateCalendarGrid(year: number): void {
  // 预分配数组大小，减少扩容操作
  const weeks: DayData[][] = new Array(53); // 一年最多53周
  const positions: number[] = new Array(12); // 12个月
  
  // 计算块操作
  setTimeout(() => {
    // 创建一个数组来存储所有周
    let currentWeek: DayData[] = [];
    let currentPosition = 0;
    
    // 获取该年1月1日是星期几 (0 = 周日, 1 = 周一, ...)
    const firstDayOfYear = new Date(year, 0, 1).getDay();
    currentPosition = firstDayOfYear; // 1月1日的位置
    positions[0] = 0; // 1月的起始位置
    
    // 添加上一年的日期占位符
    currentWeek = new Array(firstDayOfYear).fill(null).map(() => ({
      date: '',
      count: 0,
      level: 0
    }));
    
    // 循环遍历整年的每一天
    const daysInYear = (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0) ? 366 : 365;
    let prevMonth = 0;
    let weekIndex = 0;
    
    // 获取当前日期，用于比较
    const now = new Date();
    now.setHours(23, 59, 59, 999);
    
    for (let dayOfYear = 1; dayOfYear <= daysInYear; dayOfYear++) {
      const loopDate = new Date(year, 0, dayOfYear);
      
      // 确保我们仍在当前年份内
      if (loopDate.getFullYear() !== year) continue;
      
      // 检查月份变化，记录新月份的起始位置
      const currentMonth = loopDate.getMonth();
      if (currentMonth !== prevMonth) {
        // 格子宽度 + 间距 = 11px + 3px = 14px
        positions[currentMonth] = Math.floor(currentPosition / 7) * 14;
        prevMonth = currentMonth;
      }
      
      // 判断是否是未来日期 - 直接使用Date对象比较
      const isFutureDate = loopDate > now;
      
      // 创建日期数据
      const dateStr = `${year}-${loopDate.getMonth() + 1}-${loopDate.getDate()}`;
      
      // 如果是未来日期，则不显示数据
      let count = 0;
      let level = 0;
      
      if (!isFutureDate) {
        // 随机生成题目数量 - 在实际应用中，这里应该从API获取真实数据
        count = Math.floor(Math.random() * 10);
        level = count === 0 ? 0 : 
                count < 2 ? 1 : 
                count < 4 ? 2 : 
                count < 6 ? 3 : 4;
      }
      
      const dayData: DayData = {
        date: dateStr,
        count,
        level
      };
      
      // 添加到当前周
      currentWeek.push(dayData);
      currentPosition++;
      
      // 如果是周六或最后一天，完成当前周并开始新的一周
      if (loopDate.getDay() === 6 || dayOfYear === daysInYear) {
        // 如果当前周不足7天，添加空白填充
        while (currentWeek.length < 7) {
          currentWeek.push({
            date: '',
            count: 0,
            level: 0
          });
          currentPosition++;
        }
        
        weeks[weekIndex] = [...currentWeek];
        weekIndex++;
        currentWeek = [];
      }
    }
    
    // 更新数据，触发一次性重新渲染
    calendarData.value = weeks.filter(Boolean); // 过滤掉未使用的空槽位
    monthPositions.value = positions;
  }, 0);
}

// 计算总题目数
const total = computed(() => {
  let sum = 0;
  calendarData.value.forEach(week => {
    week.forEach(day => {
      sum += day.count;
    });
  });
  return sum;
});

// 添加数字递增动画效果
const displayTotal = ref(0);
const isAnimating = ref(false);

// 格式化显示的数字，添加千位分隔符
const formattedDisplayTotal = computed(() => {
  return displayTotal.value.toLocaleString('zh-CN');
});

// 动态调整动画速度，确保总是在适当的时间内完成
const animateTotal = () => {
  // 重置为0
  displayTotal.value = 0;
  
  // 如果total为0，无需动画
  if (total.value === 0) return;
  
  // 开始动画
  isAnimating.value = true;
  
  // 使用更平滑的动画
  const duration = 1500; // 延长动画时间
  const startTime = Date.now();
  const startValue = 0;
  const targetValue = total.value;
  
  // 缓动函数 - 三次贝塞尔
  const easing = (t: number) => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
  
  const updateValue = () => {
    const currentTime = Date.now();
    const elapsed = currentTime - startTime;
    
    if (elapsed < duration) {
      const progress = easing(elapsed / duration);
      const currentValue = Math.floor(startValue + progress * (targetValue - startValue));
      displayTotal.value = currentValue;
      requestAnimationFrame(updateValue);
    } else {
      // 确保最终值精确
      displayTotal.value = targetValue;
      
      // 动画结束
      setTimeout(() => {
        isAnimating.value = false;
      }, 200);
    }
  };
  
  // 启动动画
  setTimeout(() => {
    requestAnimationFrame(updateValue);
  }, 100);
};

// 监听年份变化，重新生成日历数据
watch(selectedYear, (newYear) => {
  generateCalendarGrid(newYear);
});

// 组件挂载时执行
onMounted(() => {
  // 获取tooltip元素引用
  tooltip.value = document.querySelector('.custom-tooltip') as HTMLElement;
  
  // 使用requestIdleCallback或setTimeout更高效地初始化
  const initializeHeatmap = () => {
    // 渲染优先级较低的组件
    // 生成初始日历数据
    generateCalendarGrid(selectedYear.value);
    
    // 使用RAF保证在下一帧之前不会渲染(优先处理其他UI渲染)
    requestAnimationFrame(() => {
      // 启动数字增长动画，优先级更低
      setTimeout(animateTotal, 50);
    });
  };
  
  // 使用requestIdleCallback在浏览器空闲时执行
  if ('requestIdleCallback' in window) {
    (window as any).requestIdleCallback(initializeHeatmap, { timeout: 100 });
  } else {
    // 兼容性方案
    setTimeout(initializeHeatmap, 0);
  }
});
</script>

<style scoped>
.heatmap-container {
  background-color: #ffffff;
  border-radius: 8px;
  padding: 16px 20px;
  margin-bottom: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  color: #333333;
  position: sticky;
  top: 80px; /* 顶部固定位置，留出导航栏的空间 */
  z-index: 10;
}

.heatmap-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.title-wrapper {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.heatmap-title {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #333;
  display: flex;
  align-items: center;
  gap: 4px;
}

.total-count {
  display: inline-block;
  font-weight: 700;
  color: #42b983;
  min-width: 2.5em; /* 保持数字宽度稳定，防止闪烁 */
  text-align: center;
  position: relative;
  transition: color 0.3s ease, transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.total-count.animate-number {
  animation: countBlur 0.8s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes countBlur {
  0% {
    filter: blur(0px);
    opacity: 1;
    transform: scale(1);
  }
  50% {
    filter: blur(1.5px);
    opacity: 0.9;
    transform: scale(1.1);
  }
  100% {
    filter: blur(0px);
    opacity: 1;
    transform: scale(1);
  }
}

.total-count::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 100%;
  height: 2px;
  background: linear-gradient(90deg, transparent, #42b983, transparent);
  display: none; /* 隐藏下划线 */
}

.year-selector {
  display: flex;
  align-items: center;
  background-color: #f8f9fa;
  border-radius: 8px;
  padding: 3px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
  text-decoration: none;
  position: relative;
  border: none;
  margin-right: 2px;
}

.year-selector::before,
.year-selector::after {
  display: none;
}

.year-btn {
  width: 28px;
  height: 28px;
  border-radius: 6px;
  border: none;
  background-color: transparent;
  color: #555;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  padding: 0;
  transition: all 0.2s ease;
}

.year-btn:hover:not(:disabled) {
  background-color: rgba(66, 185, 131, 0.1);
  color: #42b983;
}

.year-btn:active:not(:disabled) {
  background-color: rgba(66, 185, 131, 0.2);
  transform: scale(0.95);
}

.year-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.year-display {
  font-size: 15px;
  font-weight: 500;
  color: #444;
  min-width: 50px;
  text-align: center;
  padding: 0 8px;
  background-color: white;
  border-radius: 6px;
  height: 28px;
  line-height: 28px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  text-decoration: none;
  border: none;
  border-bottom: none;
  position: relative;
  margin: 0 2px;
}

.year-display::before,
.year-display::after {
  display: none;
}

/* 确保年份选择器和年份显示之间没有分隔线 */
.year-btn + .year-display,
.year-display + .year-btn {
  border-left: none;
  border-right: none;
  margin-left: 0;
  margin-right: 0;
}

/* 去掉其他可能的下划线 */
.heatmap-container *,
.heatmap-container *::before,
.heatmap-container *::after {
  text-decoration: none;
  border-bottom: none;
}

.heatmap-legend {
  display: flex;
  align-items: center;
  font-size: 12px;
  color: #666666;
  text-decoration: none;
}

.legend-cells {
  display: flex;
  margin: 0 8px;
}

.legend-cell {
  width: 12px;
  height: 12px;
  margin: 0 2px;
  border-radius: 2px;
}

.heatmap-grid {
  position: relative;
  padding-left: 36px;
  padding-top: 20px;
  margin-right: 10px;
  overflow: hidden;
}

.month-labels {
  position: absolute;
  top: 0;
  left: 36px;
  right: 0;
  height: 20px;
}

.month-label {
  position: absolute;
  text-align: left;
  font-size: 12px;
  color: #888888;
  white-space: nowrap;
  text-decoration: none;
  border-bottom: none;
}

.day-labels {
  position: absolute;
  left: 4px;
  top: 40px;
  width: 32px;
  height: 85px;
  margin: 0;
}

.day-label {
  position: absolute;
  left: 4px;
  font-size: 12px;
  color: #999;
  white-space: nowrap;
  font-weight: normal;
  line-height: 14px;
  text-decoration: none;
  border-bottom: none;
}

.day-label.mon {
  top: 11px;
}

.day-label.wed {
  top: 35px;
}

.day-label.fri {
  top: 59px;
}

.cells-container {
  padding-top: 15px;
  max-width: 100%;
  overflow-x: auto;
  overflow-y: hidden;
}

.calendar-grid {
  display: flex;
  flex-direction: column;
  gap: 3px;
  width: max-content;
}

.day-row {
  display: flex;
  gap: 3px;
  height: 11px;
}

.day-cell {
  width: 11px;
  height: 11px;
  min-width: 11px;
  border-radius: 2px;
  transition: transform 0.1s ease;
  position: relative;
  box-sizing: border-box;
}

.day-cell:hover {
  transform: scale(1.2);
  z-index: 1;
}

/* 热力图颜色级别 */
.level-0 {
  background-color: #ebedf0;
  border: 1px solid rgba(27, 31, 35, 0.06);
}

.level-1 {
  background-color: #55d8c1;
  border: 1px solid transparent;
}

.level-2 {
  background-color: #33c6aa;
  border: 1px solid transparent;
}

.level-3 {
  background-color: #17a389;
  border: 1px solid transparent;
}

.level-4 {
  background-color: #0d7f6a;
  border: 1px solid transparent;
}

/* 自定义悬停提示框样式 */
.custom-tooltip {
  position: absolute;
  z-index: 1000;
  background-color: rgba(45, 45, 45, 0.95);
  color: white;
  padding: 8px 12px;
  border-radius: 4px;
  font-size: 13px;
  pointer-events: none;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.25);
  min-width: 150px;
  text-align: left;
  will-change: opacity, transform;
  transition: 
    opacity 0.25s ease, 
    transform 0.25s ease,
    top 0.08s linear, 
    left 0.08s linear;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.tooltip-date {
  font-weight: 500;
  margin-bottom: 4px;
  color: #ffffff;
}

.tooltip-count {
  color: #33c6aa;
  font-weight: 600;
  display: flex;
  align-items: center;
}

.tooltip-count::before {
  content: "●";
  margin-right: 5px;
  font-size: 10px;
  color: #55d8c1;
}

.hidden-cell {
  visibility: hidden;
  pointer-events: none;
}
</style> 