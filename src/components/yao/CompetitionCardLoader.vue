<template>
  <div class="competition-loader">
    <div v-if="loading" class="loading-state">
      <div class="loading-spinner"></div>
      <div class="loading-text">正在加载竞赛信息...</div>
    </div>
    <div v-else-if="error" class="error-state">
      <div class="error-icon">!</div>
      <div class="error-message">{{ errorMessage }}</div>
      <button class="retry-button" @click="fetchCompetitions">重试</button>
    </div>
    <div v-else class="competition-list">
      <CompetitionCard
        v-for="(competition, index) in competitions"
        :key="competition.id || index"
        :competition="competition"
        :appear="true"
        :index="index"
        :action-link="getActionLink(competition)"
        :action-text="actionText"
      />
      <div v-if="competitions.length === 0" class="no-data">
        暂无竞赛信息
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';
import CompetitionCard from './CompetitionCard.vue';

// 定义接口
interface Tag {
  name: string;
  type: string;
}

interface Competition {
  id?: number;
  title: string;
  logos: string[];
  startTime: string;
  endTime: string;
  duration: string;
  tags: Tag[];
  [key: string]: any;
}

// 组件属性
interface Props {
  apiUrl?: string;
  limit?: number;
  actionText?: string;
  customActionLink?: string | ((competition: Competition) => string);
  filterOptions?: Record<string, any>;
}

const props = withDefaults(defineProps<Props>(), {
  apiUrl: '/api/competitions',
  limit: 10,
  actionText: "Let's go",
  customActionLink: '',
  filterOptions: () => ({})
});

// 状态变量
const competitions = ref<Competition[]>([]);
const loading = ref(true);
const error = ref(false);
const errorMessage = ref('加载竞赛数据失败，请稍后重试');

// 获取竞赛列表数据
const fetchCompetitions = async () => {
  loading.value = true;
  error.value = false;
  
  try {
    const { data } = await axios({
      url: props.apiUrl,
      method: 'post',
      data: {
        limit: props.limit,
        ...props.filterOptions
      }
    });
    
    if (data.success) {
      competitions.value = data.competitions || [];
      console.log('获取到竞赛列表:', competitions.value);
    } else {
      throw new Error(data.message || '获取竞赛数据失败');
    }
  } catch (err) {
    error.value = true;
    errorMessage.value = err instanceof Error ? err.message : '未知错误';
    console.error('获取竞赛列表失败:', err);
  } finally {
    loading.value = false;
  }
};

// 生成竞赛详情页链接
const getActionLink = (competition: Competition): string => {
  if (typeof props.customActionLink === 'function') {
    return props.customActionLink(competition);
  }
  
  if (props.customActionLink) {
    return props.customActionLink;
  }
  
  return competition.id 
    ? `/contest/problems/${competition.id}` 
    : '/contest/problems';
};

// 组件挂载时获取数据
onMounted(() => {
  fetchCompetitions();
});
</script>

<style scoped>
.competition-loader {
  width: 100%;
}

.competition-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.loading-state,
.error-state,
.no-data {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  border-radius: 12px;
  background-color: #f8f9fa;
  text-align: center;
  margin: 20px 0;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(66, 185, 131, 0.2);
  border-radius: 50%;
  border-top-color: #42b983;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.loading-text {
  color: #666;
  font-size: 16px;
}

.error-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #f56c6c;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 16px;
}

.error-message {
  color: #666;
  font-size: 16px;
  margin-bottom: 16px;
}

.retry-button {
  padding: 8px 16px;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s;
}

.retry-button:hover {
  background-color: #33a06f;
  transform: translateY(-2px);
}

.no-data {
  color: #999;
  font-size: 16px;
  padding: 40px;
}
</style> 