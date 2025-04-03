<template>
  <div class="latest-problems" :class="{ appear }">
    <h3 class="problems-title"><i class="problem-icon"></i> {{ title }}</h3>
    <div class="problem-list">
      <div class="problem-row" v-for="(problem, index) in problems" :key="index">
        <a :href="problem.url" class="problem-title">{{ problem.title }}</a>
        <span class="problem-tag" :class="problem.difficulty">{{ problem.level }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
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
</script>

<style scoped>
.latest-problems {
  background-color: #ffffff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;
  opacity: 0;
  transform: translateY(15px);
  will-change: opacity, transform;
}

.latest-problems.appear {
  opacity: 1;
  transform: translateY(0);
}

.problems-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0 0 16px 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.problem-icon::before {
  content: '📝';
}

.problem-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.problem-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #f0f0f0;
  transition: all 0.2s ease;
}

.problem-row:hover {
  background-color: rgba(66, 185, 131, 0.03);
  padding-left: 5px;
}

.problem-row:last-child {
  border-bottom: none;
}

.problem-title {
  color: #333;
  text-decoration: none;
  font-size: 14px;
  transition: color 0.2s ease;
  font-weight: 500;
}

.problem-title:hover {
  color: #42b983;
}

.problem-tag {
  padding: 2px 10px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  transition: all 0.2s ease;
}

.problem-tag:hover {
  transform: scale(1.05);
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
</style> 