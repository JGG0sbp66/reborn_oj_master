<template>
  <div class="profile-section">
    <h3 class="section-title">解题记录</h3>
    <div class="solved-problems-container">
      <div v-if="problems.length > 0" class="problem-list full-list">
        <div v-for="(problem, index) in problems" :key="index" class="problem-item">
          <div class="problem-info">
            <div class="problem-title">{{ problem.title }}</div>
            <div class="problem-difficulty" :class="problem.difficulty">{{ problem.difficultyText }}</div>
          </div>
          <div class="problem-date">{{ formatDate(problem.solvedAt) }}</div>
        </div>
      </div>
      <div v-else class="empty-state">
        <div class="empty-icon">📝</div>
        <div class="empty-text">暂无解题记录，开始刷题吧！</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, ref, computed } from 'vue';

interface ProblemRecord {
  title: string;
  difficulty: string;
  difficultyText: string;
  solvedAt: Date;
}

const props = defineProps<{
  problems: ProblemRecord[];
}>();

// 格式化日期函数
const dateFormatCache = new Map();
const formatDate = (date: Date): string => {
  if (!date) return '';
  
  // 创建缓存键
  const cacheKey = date.getTime();
  
  // 检查缓存
  if (dateFormatCache.has(cacheKey)) {
    return dateFormatCache.get(cacheKey);
  }
  
  // 格式化日期
  const formatted = new Date(date).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  // 存入缓存
  dateFormatCache.set(cacheKey, formatted);
  
  return formatted;
};
</script>

<style scoped>
.profile-section {
  background-color: white;
  border-radius: 12px;
  padding: 25px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.06);
  position: relative;
  transition: all 0.3s ease;
  overflow: hidden;
}

.profile-section:hover {
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0 0 25px;
  padding-bottom: 15px;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  align-items: center;
  position: relative;
}

.section-title::before {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 0;
  width: 50px;
  height: 3px;
  background: linear-gradient(90deg, #42b983, #33c6aa);
  border-radius: 3px;
}

/* 最近解题记录 */
.problem-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.problem-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background-color: #f9f9f9;
  border-radius: 8px;
  transition: all 0.3s ease;
  transform: translateX(0);
  animation: fadeIn 0.5s ease;
  animation-fill-mode: both;
}

@keyframes fadeIn {
  from { 
    opacity: 0; 
    transform: translateX(-15px);
  }
  to { 
    opacity: 1;
    transform: translateX(0);
  }
}

.problem-item:nth-child(2) {
  animation-delay: 0.1s;
}

.problem-item:nth-child(3) {
  animation-delay: 0.2s;
}

.problem-item:nth-child(4) {
  animation-delay: 0.3s;
}

.problem-item:nth-child(5) {
  animation-delay: 0.4s;
}

.problem-item:hover {
  background-color: #f0f0f0;
  transform: translateX(3px);
}

.problem-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.problem-title {
  font-weight: 500;
  color: #333;
}

.problem-difficulty {
  padding: 2px 8px;
  border-radius: 10px;
  font-size: 12px;
  font-weight: 500;
}

.problem-difficulty.easy {
  background-color: #e6f7f0;
  color: #42b983;
}

.problem-difficulty.medium {
  background-color: #fff8e6;
  color: #ffaa00;
}

.problem-difficulty.hard {
  background-color: #ffe6e6;
  color: #ff6666;
}

.problem-date {
  color: #888;
  font-size: 13px;
}

/* 空状态 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  color: #888;
}

.empty-icon {
  font-size: 36px;
  margin-bottom: 10px;
}

.empty-text {
  font-size: 15px;
}

/* 完整的问题列表 */
.full-list {
  max-height: 500px;
  overflow-y: auto;
  padding-right: 5px;
}

.full-list::-webkit-scrollbar {
  width: 6px;
}

.full-list::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

.full-list::-webkit-scrollbar-thumb {
  background: #ccc;
  border-radius: 10px;
}

.full-list::-webkit-scrollbar-thumb:hover {
  background: #aaa;
}
</style> 