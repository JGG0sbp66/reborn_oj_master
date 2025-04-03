<template>
  <div class="latest-problems" :class="{ appear }">
    <h3 class="problems-title"><i class="problem-icon"></i> {{ title }}</h3>
    <div class="problem-list">
      <div 
        class="problem-row" 
        v-for="(problem, index) in problems" 
        :key="index"
        @mouseenter="handleMouseEnter"
        @mouseleave="handleMouseLeave"
      >
        <a :href="problem.url" class="problem-title">{{ problem.title }}</a>
        <span class="problem-tag" :class="problem.difficulty">{{ problem.level }}</span>
        <span class="problem-row-hover-effect"></span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

interface Problem {
  title: string;
  level: string;
  difficulty: string;
  url?: string;
}

defineProps({
  title: {
    type: String,
    default: '最新题目'
  },
  problems: {
    type: Array as () => Problem[],
    required: true
  },
  appear: {
    type: Boolean,
    default: true
  }
});

// 添加鼠标悬停效果
const handleMouseEnter = (event: MouseEvent) => {
  const target = event.currentTarget as HTMLElement;
  target.classList.add('hover-active');
};

const handleMouseLeave = (event: MouseEvent) => {
  const target = event.currentTarget as HTMLElement;
  target.classList.remove('hover-active');
};
</script>

<style scoped>
.latest-problems {
  background-color: #ffffff;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  transition: all 0.3s cubic-bezier(0.25, 1, 0.5, 1);
  opacity: 0;
  transform: translateY(15px);
  will-change: opacity, transform;
  position: relative;
  overflow: hidden;
}

.latest-problems::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 3px;
  background: linear-gradient(90deg, #42b983, #3eaf7c, #64c8a3);
  transform: translateX(-100%);
  transition: transform 1s cubic-bezier(0.19, 1, 0.22, 1);
}

.latest-problems.appear {
  opacity: 1;
  transform: translateY(0);
}

.latest-problems.appear::before {
  transform: translateX(0);
}

.problems-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0 0 16px 0;
  display: flex;
  align-items: center;
  gap: 8px;
  position: relative;
}

.problems-title::after {
  content: '';
  position: absolute;
  bottom: -6px;
  left: 0;
  width: 36px;
  height: 2px;
  background: linear-gradient(90deg, #42b983, #64c8a3);
  border-radius: 2px;
  transition: width 0.4s ease;
}

.latest-problems:hover .problems-title::after {
  width: 100%;
}

.problem-icon::before {
  content: '📝';
}

.problem-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 20px;
}

.problem-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  border-radius: 8px;
  position: relative;
  transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
  z-index: 1;
  overflow: hidden;
  background-color: #f9fafc;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.02);
  border: 1px solid transparent;
}

.problem-row-hover-effect {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  background: radial-gradient(circle, rgba(66, 185, 131, 0.15), transparent 70%);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  transition: width 0.6s cubic-bezier(0.165, 0.84, 0.44, 1), 
              height 0.6s cubic-bezier(0.165, 0.84, 0.44, 1);
  z-index: -1;
}

.problem-row.hover-active {
  transform: translateY(-4px);
  border-color: rgba(66, 185, 131, 0.2);
  box-shadow: 0 6px 16px rgba(66, 185, 131, 0.12);
}

.problem-row.hover-active .problem-title {
  color: #42b983;
}

.problem-row.hover-active .problem-row-hover-effect {
  width: 250%;
  height: 250%;
}

.problem-title {
  color: #333;
  text-decoration: none;
  font-size: 14px;
  transition: all 0.3s ease;
  font-weight: 500;
  z-index: 1;
}

.problem-tag {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  transition: all 0.3s ease;
  z-index: 1;
}

.problem-row.hover-active .problem-tag {
  transform: scale(1.05);
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.1);
}

.problem-tag.entry {
  background-color: #e6f7f0;
  color: #42b983;
}

.problem-tag.easy {
  background-color: #fff8e6;
  color: #ffaa00;
}

.problem-tag.medium {
  background-color: #e6f1ff;
  color: #3399ff;
}

.problem-tag.hard {
  background-color: #ffe6e6;
  color: #ff6666;
}

.problem-tag.expert {
  background-color: #f2e6ff;
  color: #9966cc;
}

@media (max-width: 480px) {
  .problem-row {
    padding: 10px;
  }
}
</style> 