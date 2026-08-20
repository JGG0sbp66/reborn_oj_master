<template>
  <div class="profile-section">
    <h3 class="section-title">参赛记录</h3>
    <div class="competitions-container">
      <!-- 比赛记录列表 -->
      <div v-if="loading" class="loading-state">
        <div class="loading-spinner"></div>
        <div class="loading-text">加载中...</div>
      </div>
      <div v-else-if="competitions.length > 0" class="competition-list">
        <div v-for="(competition, index) in competitions" :key="index" class="competition-item">
          <div class="competition-info">
            <div class="competition-title">{{ competition.title }}</div>
            <div class="competition-date">
              {{ formatDate(competition.start_time) }} - {{ formatDate(competition.end_time) }}
            </div>
            <div v-if="competition.register_time" class="competition-registration">
              注册时间: {{ formatDate(competition.register_time) }}
            </div>
          </div>
          <div class="competition-result" :class="getResultClass(competition)">
            {{ getResultText(competition) }}
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
import { ref, computed, onMounted } from 'vue';
import { raceApi } from '@/api';

// 定义接口数据结构，与API返回格式匹配
interface ProblemStat {
  solved: boolean;
  submit_count: number;
  penalty_time?: number;
  first_solve_time?: string;
}

interface Ranking {
  rank: number;
  total_solved: number;
  total_penalty: number;
  problem_stats: Record<string, ProblemStat>;
  total_participants: number;
}

interface Competition {
  register_time: string;
  title: string;
  start_time: string;
  end_time: string;
  race_uid: string;
  status: string; // 'active', 'pending', 'ended'
  ranking?: Ranking;
}

const props = defineProps<{
  competitions?: Competition[]; // 可选参数，允许从父组件传入数据
  loading?: boolean; // 加载状态
}>();

// 本地存储比赛列表
const localCompetitions = ref<Competition[]>([]);

// 合并本地和传入的比赛列表
const competitions = computed(() => {
  return props.competitions || localCompetitions.value;
});

// 在组件挂载时，如果没有传入competitions，则从API获取
onMounted(async () => {
  if (!props.competitions) {
    try {
      const data = await raceApi.getUserRaces();
      if (data && Array.isArray(data)) {
        localCompetitions.value = data;
      }
    } catch (error) {
      console.error('获取参赛记录失败:', error);
    }
  }
});

// 根据比赛状态和排名确定结果样式类
const getResultClass = (competition: Competition): string => {
  if (!competition.ranking) return 'poor';

  const { rank, total_participants } = competition.ranking;

  // 计算百分比排名
  const percentile = rank / total_participants;

  if (percentile <= 0.2) return 'good'; // 前20%
  if (percentile <= 0.5) return 'average'; // 前50%
  return 'poor'; // 后50%
};

// 获取结果文本
const getResultText = (competition: Competition): string => {
  if (competition.status === 'pending') return '未开始';
  if (competition.status === 'active') return '进行中';

  if (!competition.ranking) return '未参与';

  const { rank, total_participants } = competition.ranking;
  return `第${rank}名 / 共${total_participants}人`;
};

// 格式化日期函数
const dateFormatCache = new Map();
const formatDate = (dateString: string): string => {
  if (!dateString) return '';

  // 创建缓存键
  const cacheKey = dateString;

  // 检查缓存
  if (dateFormatCache.has(cacheKey)) {
    return dateFormatCache.get(cacheKey);
  }

  // 解析日期字符串
  const date = new Date(dateString);

  // 格式化日期
  const formatted = date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
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

.competition-registration {
  font-size: 12px;
  color: #999;
  font-style: italic;
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

/* 加载状态 */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  color: #888;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  margin-bottom: 15px;
  border: 3px solid rgba(66, 185, 131, 0.2);
  border-top-color: #42b983;
  border-radius: 50%;
  animation: spin 1s ease-in-out infinite;
}

.loading-text {
  font-size: 15px;
  color: #888;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
