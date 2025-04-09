<template>
  <div class="profile-container">
    <!-- 顶部个人信息卡片 -->
    <div class="profile-header">
      <div class="profile-cover">
        <div class="profile-avatar">
          <div v-if="avatarUrl" class="avatar-img">
            <img :src="avatarUrl" alt="用户头像" />
          </div>
          <div v-else class="avatar-placeholder">
            {{ userInitials }}
          </div>
        </div>
        <div class="profile-info">
          <h1 class="profile-name">{{ username }}</h1>
          <div class="profile-role">{{ userRole }}</div>
        </div>
      </div>
    </div>

    <!-- 主要内容区域 -->
    <div class="profile-content">
      <!-- 左侧统计卡片 -->
      <div class="stats-section">
        <div class="stats-card">
          <div class="stats-header">
            <el-icon><Trophy /></el-icon>
            <span>解题统计</span>
          </div>
          <div class="stats-grid">
            <div class="stats-item">
              <div class="stats-value">{{ solvedCount }}</div>
              <div class="stats-label">已解决</div>
            </div>
            <div class="stats-item">
              <div class="stats-value">{{ attemptedCount }}</div>
              <div class="stats-label">尝试中</div>
            </div>
            <div class="stats-item">
              <div class="stats-value">{{ submissionCount }}</div>
              <div class="stats-label">提交数</div>
            </div>
            <div class="stats-item">
              <div class="stats-value">{{ acceptanceRate }}%</div>
              <div class="stats-label">通过率</div>
            </div>
          </div>
        </div>

        <div class="stats-card">
          <div class="stats-header">
            <el-icon><Medal /></el-icon>
            <span>竞赛成就</span>
          </div>
          <div class="stats-grid">
            <div class="stats-item">
              <div class="stats-value">{{ contestCount }}</div>
              <div class="stats-label">参与竞赛</div>
            </div>
            <div class="stats-item">
              <div class="stats-value">{{ ranking }}</div>
              <div class="stats-label">当前排名</div>
            </div>
            <div class="stats-item">
              <div class="stats-value">{{ rating }}</div>
              <div class="stats-label">Rating</div>
            </div>
            <div class="stats-item">
              <div class="stats-value">{{ winRate }}%</div>
              <div class="stats-label">胜率</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 右侧活动记录 -->
      <div class="activity-section">
        <div class="activity-card">
          <div class="activity-header">
            <el-icon><List /></el-icon>
            <span>最近活动</span>
          </div>
          <div class="activity-list">
            <div v-for="(activity, index) in recentActivities" :key="index" class="activity-item">
              <div class="activity-icon" :class="activity.type">
                <el-icon><component :is="getActivityIcon(activity.type)" /></el-icon>
              </div>
              <div class="activity-content">
                <div class="activity-title">{{ activity.title }}</div>
                <div class="activity-time">{{ activity.time }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { Trophy, Medal, List, Check, Timer, Star, Warning } from '@element-plus/icons-vue';
import { checkAuth } from '@/utils/auth';
import axios from 'axios';

// 用户信息
const username = ref('');
const userRole = ref('');
const avatarUrl = ref('');
const defaultAvatarUrl = ref('');

// 统计数据
const solvedCount = ref(0);
const attemptedCount = ref(0);
const submissionCount = ref(0);
const acceptanceRate = ref(0);
const contestCount = ref(0);
const ranking = ref(0);
const rating = ref(0);
const winRate = ref(0);

// 从用户名生成缩写
const userInitials = computed(() => {
  if (!username.value) return '?';
  return username.value.substring(0, 2).toUpperCase();
});

// 获取活动图标
const getActivityIcon = (type: string) => {
  const icons = {
    solve: Check,
    attempt: Timer,
    contest: Trophy,
    achievement: Star,
    system: Warning
  };
  return icons[type as keyof typeof icons] || List;
};

// 模拟活动数据
const recentActivities = ref([
  {
    type: 'solve',
    title: '解决了题目 "两数之和"',
    time: '10分钟前'
  },
  {
    type: 'attempt',
    title: '尝试解决题目 "最长回文子串"',
    time: '30分钟前'
  },
  {
    type: 'contest',
    title: '参加了 "2024春季算法竞赛"',
    time: '2小时前'
  },
  {
    type: 'achievement',
    title: '获得了 "连续解题7天" 成就',
    time: '1天前'
  }
]);

// 获取用户数据
const fetchUserData = async () => {
  try {
    const { authenticated, user } = await checkAuth();
    if (authenticated && user) {
      username.value = user.uid || '用户';
      userRole.value = user.role || '普通用户';
      
      // 获取用户头像
      try {
        const response = await axios.get(`http://localhost:5000/api/user/${user.uid}/avatar`);
        if (response.data && response.data.avatarUrl) {
          avatarUrl.value = response.data.avatarUrl;
        }
      } catch (error) {
        console.error('获取用户头像失败:', error);
      }
      
      // 这里应该从后端API获取更多用户数据
      // 目前使用模拟数据
      solvedCount.value = 42;
      attemptedCount.value = 15;
      submissionCount.value = 89;
      acceptanceRate.value = 47;
      contestCount.value = 5;
      ranking.value = 128;
      rating.value = 1500;
      winRate.value = 65;
    }
  } catch (error) {
    console.error('获取用户数据失败:', error);
  }
};

onMounted(() => {
  fetchUserData();
});
</script>

<style scoped>
.profile-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  padding: 24px;
  padding-top: 100px;
}

.profile-header {
  max-width: 1200px;
  margin: 0 auto 24px;
}

.profile-cover {
  background: white;
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  display: flex;
  align-items: center;
  gap: 24px;
}

.profile-avatar {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border: 4px solid white;
}

.avatar-img {
  width: 100%;
  height: 100%;
}

.avatar-img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #42b983, #33c6aa);
  color: white;
  font-weight: 600;
  font-size: 36px;
}

.profile-info {
  flex: 1;
}

.profile-name {
  font-size: 28px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 8px;
}

.profile-role {
  display: inline-block;
  padding: 4px 12px;
  background: rgba(66, 185, 131, 0.1);
  color: #42b983;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
}

.profile-content {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}

.stats-section {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.stats-card {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.stats-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 20px;
  color: #1a1a1a;
  font-weight: 600;
  font-size: 18px;
}

.stats-header .el-icon {
  font-size: 20px;
  color: #42b983;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.stats-item {
  text-align: center;
  padding: 16px;
  background: rgba(66, 185, 131, 0.05);
  border-radius: 12px;
  transition: all 0.3s ease;
}

.stats-item:hover {
  transform: translateY(-2px);
  background: rgba(66, 185, 131, 0.08);
}

.stats-value {
  font-size: 24px;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 4px;
}

.stats-label {
  font-size: 14px;
  color: #666;
}

.activity-section {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.activity-card {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.activity-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 20px;
  color: #1a1a1a;
  font-weight: 600;
  font-size: 18px;
}

.activity-header .el-icon {
  font-size: 20px;
  color: #42b983;
}

.activity-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.activity-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background: rgba(66, 185, 131, 0.05);
  border-radius: 12px;
  transition: all 0.3s ease;
}

.activity-item:hover {
  transform: translateX(4px);
  background: rgba(66, 185, 131, 0.08);
}

.activity-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.activity-icon.solve {
  color: #42b983;
}

.activity-icon.attempt {
  color: #f59e0b;
}

.activity-icon.contest {
  color: #3b82f6;
}

.activity-icon.achievement {
  color: #8b5cf6;
}

.activity-icon.system {
  color: #ef4444;
}

.activity-content {
  flex: 1;
}

.activity-title {
  font-weight: 500;
  color: #1a1a1a;
  margin-bottom: 4px;
}

.activity-time {
  font-size: 14px;
  color: #666;
}

@media (max-width: 1024px) {
  .profile-content {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .profile-container {
    padding: 16px;
    padding-top: 80px;
  }

  .profile-cover {
    padding: 24px;
  }

  .profile-avatar {
    width: 80px;
    height: 80px;
  }

  .profile-name {
    font-size: 24px;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }
}
</style> 