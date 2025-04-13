<template>
  <div class="profile-section">
    <h3 class="section-title">参赛记录</h3>
    <div class="competitions-container">
      <!-- 示例比赛记录 -->
      <div v-if="competitions.length > 0" class="competition-list">
        <div v-for="(competition, index) in competitions" :key="index" class="competition-item">
          <div class="competition-info">
            <div class="competition-title">{{ competition.title }}</div>
            <div class="competition-date">
              {{ formatDate(competition.startDate) }} - {{ formatDate(competition.endDate) }}
            </div>
          </div>
          <div class="competition-result" :class="competition.result">
            {{ competition.rank }}
          </div>
        </div>
      </div>
      <div v-else class="empty-state">
        <div class="empty-icon">🏆</div>
        <div class="empty-text">暂无参赛记录，快来参加比赛吧！</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';

interface Competition {
  title: string;
  startDate: Date;
  endDate: Date;
  rank: string;
  result: string; // 'good', 'average', 'poor'
}

const props = defineProps<{
  competitions: Competition[];
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

/* 比赛记录 */
.competition-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.competition-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 16px;
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

.competition-item:nth-child(2) {
  animation-delay: 0.1s;
}

.competition-item:nth-child(3) {
  animation-delay: 0.2s;
}

.competition-item:hover {
  background-color: #f0f0f0;
  transform: translateX(3px);
}

.competition-info {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.competition-title {
  font-weight: 500;
  color: #333;
}

.competition-date {
  font-size: 13px;
  color: #888;
}

.competition-result {
  font-weight: 600;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 14px;
}

.competition-result.good {
  background-color: #e6f7f0;
  color: #42b983;
}

.competition-result.average {
  background-color: #fff8e6;
  color: #ffaa00;
}

.competition-result.poor {
  background-color: #ffe6e6;
  color: #ff6666;
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
</style> 