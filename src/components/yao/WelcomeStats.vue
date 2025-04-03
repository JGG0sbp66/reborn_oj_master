<template>
  <div class="welcome-section" :class="{ appear: appear }">
    <h3 class="welcome-title"><i class="welcome-icon"></i> 欢迎来到 OJ Master</h3>
    <div class="welcome-content">
      <p>{{ message }}</p>
      <div class="welcome-stats">
        <div class="stat-item" v-for="(stat, index) in statsData" :key="index">
          <div class="stat-value">
            <span class="count number-animate" :class="{ animate: animationTriggered[index] }">{{ formattedCounts[index] }}</span>
          </div>
          <div class="stat-label">{{ stat.label }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, defineProps, computed } from 'vue';

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
const animationTriggered = ref<boolean[]>(props.statsData.map(() => false));

// 格式化数字，添加千位分隔符
const formattedCounts = computed(() => {
  return counts.value.map((count: number) => {
    return count.toLocaleString('zh-CN');
  });
});

// 优化动画函数 - 使用更加平滑的过渡
const animateNumbers = () => {
  props.statsData.forEach((stat: StatItem, index: number) => {
    const targetValue = stat.value;
    const duration = 1500; // 增加动画持续时间
    const easing = (t: number) => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1; // 三次贝塞尔缓动函数
    
    const startTime = Date.now();
    const startValue = 0;
    
    const updateValue = () => {
      const currentTime = Date.now();
      const elapsed = currentTime - startTime;
      
      if (elapsed < duration) {
        const progress = easing(elapsed / duration);
        const currentValue = Math.floor(startValue + progress * (targetValue - startValue));
        
        // 只有数值变化时才触发动画
        if (counts.value[index] !== currentValue) {
          counts.value[index] = currentValue;
          animationTriggered.value[index] = true;
          
          // 重置动画状态，允许下一次触发
          setTimeout(() => {
            animationTriggered.value[index] = false;
          }, 400);
        }
        
        requestAnimationFrame(updateValue);
      } else {
        // 确保最终值精确
        counts.value[index] = targetValue;
      }
    };
    
    // 开始动画
    setTimeout(() => {
      requestAnimationFrame(updateValue);
    }, props.animationDelay + index * 150); // 为每个数字添加不同的延迟
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
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.3s ease;
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