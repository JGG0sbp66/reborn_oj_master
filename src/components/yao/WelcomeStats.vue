<template>
  <div class="welcome-section" :class="{ appear }">
    <h3 class="welcome-title"><i class="welcome-icon"></i> 欢迎来到 OJ Master</h3>
    <div class="welcome-content">
      <p>{{ message }}</p>
      <div class="welcome-stats">
        <div class="stat-item" v-for="(stat, index) in statsData" :key="index">
          <div class="stat-value">
            <span class="count">{{ counts[index] }}</span>
          </div>
          <div class="stat-label">{{ stat.label }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, defineProps, watchEffect } from 'vue';

interface StatItem {
  value: number;
  label: string;
}

const props = defineProps({
  statsData: {
    type: Array as () => StatItem[],
    required: true
  },
  message: {
    type: String,
    default: '开始你的编程之旅，提升算法能力！'
  },
  appear: {
    type: Boolean,
    default: true
  },
  animationDelay: {
    type: Number,
    default: 300
  }
});

// 为统计数字创建动画效果
const counts = ref<number[]>(props.statsData.map(() => 0));

// 动画函数 - 让数字从0增长到目标值
const animateNumbers = () => {
  props.statsData.forEach((stat, index) => {
    const targetValue = stat.value;
    const duration = 1000; // 动画持续时间(毫秒)
    const interval = 20; // 每次更新的间隔(毫秒)
    const steps = duration / interval;
    const increment = Math.ceil(targetValue / steps);
    
    let currentValue = 0;
    const counter = setInterval(() => {
      currentValue = Math.min(currentValue + increment, targetValue);
      counts.value[index] = currentValue;
      
      if (currentValue >= targetValue) {
        clearInterval(counter);
      }
    }, interval);
  });
};

// 组件挂载后启动动画
onMounted(() => {
  setTimeout(animateNumbers, props.animationDelay);
});
</script>

<style scoped>
.welcome-section {
  background-color: #ffffff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;
  opacity: 0;
  transform: translateY(15px);
  will-change: opacity, transform;
}

.welcome-section.appear {
  opacity: 1;
  transform: translateY(0);
}

.welcome-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0 0 16px 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.welcome-icon::before {
  content: '👋';
}

.welcome-content p {
  color: #666;
  margin-top: 0;
  margin-bottom: 16px;
  line-height: 1.5;
}

.welcome-stats {
  display: flex;
  justify-content: space-between;
  margin-top: 16px;
  background: linear-gradient(to right, rgba(66, 185, 131, 0.05), rgba(0, 196, 255, 0.05));
  padding: 12px;
  border-radius: 8px;
}

.stat-item {
  text-align: center;
  flex: 1;
}

.stat-value {
  font-size: 18px;
  font-weight: 600;
  color: #42b983;
  text-shadow: 0 1px 2px rgba(66, 185, 131, 0.1);
}

.count {
  display: inline-block;
  transition: all 0.2s ease;
}

.stat-label {
  font-size: 12px;
  color: #888;
  margin-top: 4px;
}

@media (max-width: 480px) {
  .welcome-stats {
    flex-direction: column;
    gap: 10px;
  }
  
  .stat-item {
    display: flex;
    align-items: center;
    text-align: left;
  }
  
  .stat-value {
    margin-right: 8px;
  }
}
</style> 