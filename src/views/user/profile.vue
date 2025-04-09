<template>
  <headerheader />
  <div class="profile-container">
    <div class="profile-content">
      <!-- 左侧用户信息 -->
      <div class="user-profile-sidebar">
        <div class="user-card">
          <div class="user-avatar-container">
            <div class="user-avatar">
              <div v-if="avatarUrl || defaultAvatarUrl" class="avatar-img">
                <img :src="avatarUrl || defaultAvatarUrl" alt="用户头像" />
              </div>
              <div v-else class="avatar-placeholder">
                {{ userInitials }}
              </div>
            </div>
          </div>
          <h2 class="user-name">{{ username }}</h2>
          <div class="user-role">{{ userRole }}</div>
          <div class="user-joined">
            加入时间: {{ formatDate(userJoinDate) }}
          </div>
          <div class="user-stats">
            <div class="stat-item">
              <div class="stat-value">{{ problemSolved }}</div>
              <div class="stat-label">已解题目</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">{{ competitionsJoined }}</div>
              <div class="stat-label">参与比赛</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">{{ rank }}</div>
              <div class="stat-label">当前排名</div>
            </div>
          </div>
        </div>

        <!-- 侧边导航菜单 -->
        <div class="user-nav">
          <router-link 
            to="/user/profile" 
            class="nav-item" 
            active-class="active"
            exact
          >
            <el-icon><UserFilled /></el-icon>
            <span>个人资料</span>
          </router-link>
          
          <router-link 
            to="/user/solved-problems" 
            class="nav-item" 
            active-class="active"
          >
            <el-icon><List /></el-icon>
            <span>解题记录</span>
          </router-link>
          
          <router-link 
            to="/user/competitions" 
            class="nav-item" 
            active-class="active"
          >
            <el-icon><Trophy /></el-icon>
            <span>参赛记录</span>
          </router-link>
          
          <router-link 
            to="/user/settings" 
            class="nav-item" 
            active-class="active"
          >
            <el-icon><Setting /></el-icon>
            <span>账户设置</span>
          </router-link>
        </div>
      </div>

      <!-- 右侧内容区域 -->
      <div class="profile-main-content">
        <router-view v-if="activeComponent !== 'profile'" />
        
        <template v-else>
          <!-- 用户活动热力图 - 采用延迟加载 -->
          <div v-if="isHeatmapVisible" class="profile-section">
            <h3 class="section-title">编程活动</h3>
            <ActivityHeatmap />
          </div>
          <div v-else class="profile-section heatmap-placeholder">
            <h3 class="section-title">编程活动</h3>
            <div class="loading-indicator">
              <div class="loading-spinner"></div>
              <span>加载中...</span>
            </div>
          </div>

          <!-- 用户资料 -->
          <div class="profile-section">
            <h3 class="section-title">基本资料</h3>
            <div class="profile-form">
              <el-form label-position="top">
                <el-form-item label="用户名">
                  <el-input v-model="username" disabled />
                </el-form-item>
                <el-form-item label="电子邮箱">
                  <el-input v-model="email" placeholder="请输入电子邮箱" />
                </el-form-item>
                <el-form-item label="个人简介">
                  <el-input v-model="bio" type="textarea" :rows="4" placeholder="介绍一下自己吧..." />
                </el-form-item>
                <el-form-item label="所在学校/单位">
                  <el-input v-model="organization" placeholder="请输入您的学校或单位" />
                </el-form-item>
                <el-form-item label="个人主页">
                  <el-input v-model="website" placeholder="https://" />
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" class="save-btn" @click="saveProfile">保存更改</el-button>
                </el-form-item>
              </el-form>
            </div>
          </div>

          <!-- 最近解题 -->
          <div class="profile-section">
            <h3 class="section-title">最近解题</h3>
            <div class="recent-problems">
              <div v-if="recentProblems.length > 0" class="problem-list">
                <div v-for="(problem, index) in recentProblems" :key="index" class="problem-item">
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
      </div>
    </div>
  </div>
  <foot class="page-footer" />
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, defineAsyncComponent } from 'vue';
import { useRoute } from 'vue-router';
import headerheader from '@/components/headerheader.vue';
import foot from '@/components/foot.vue';
// 使用异步组件延迟加载热力图组件
const ActivityHeatmap = defineAsyncComponent(() => 
  import('@/components/ActivityHeatmap.vue')
);
import { UserFilled, List, Trophy, Setting } from '@element-plus/icons-vue';
import axios from 'axios';
import { ElMessage } from 'element-plus';

// 控制组件延迟加载的状态
const isHeatmapVisible = ref(false);

// 用于确定当前显示的组件
const route = useRoute();
const activeComponent = computed(() => {
  const path = route.path;
  if (path.includes('/solved-problems')) return 'solved-problems';
  if (path.includes('/competitions')) return 'competitions';
  if (path.includes('/settings')) return 'settings';
  return 'profile';
});

// 用户基本信息
const username = ref('');
const userRole = ref('普通用户');
const avatarUrl = ref('');
const userJoinDate = ref(new Date());
const email = ref('');
const bio = ref('');
const organization = ref('');
const website = ref('');

// 用户统计信息
const problemSolved = ref(0);
const competitionsJoined = ref(0);
const rank = ref(0);

// 从用户名生成缩写 - 使用记忆化避免重复计算
let cachedInitials = '';
let cachedUsername = '';
const userInitials = computed(() => {
  if (username.value === cachedUsername && cachedInitials) {
    return cachedInitials;
  }
  
  if (!username.value || typeof username.value !== 'string') {
    cachedUsername = '';
    cachedInitials = '?';
    return '?';
  }
  
  cachedUsername = username.value;
  cachedInitials = username.value.substring(0, 2).toUpperCase();
  return cachedInitials;
});

// 生成随机矢量图头像 - 添加缓存避免重复生成
const avatarCache = new Map();
const generateAvatarSvg = (username: string): string => {
  // 检查缓存
  if (avatarCache.has(username)) {
    return avatarCache.get(username);
  }
  
  // 从用户名生成一个稳定的哈希值，确保同一用户名总是生成相同的图案
  const hash = username.split('').reduce((acc: number, char: string, i: number) => {
    return acc + (char.charCodeAt(0) * (i + 1));
  }, 0);
  
  // 定义一些颜色方案
  const colorSchemes = [
    { bg: '#E8F4F8', fg: ['#2980b9', '#3498db', '#1abc9c', '#16a085'] },
    { bg: '#F8F4E8', fg: ['#E67E22', '#F39C12', '#D35400', '#FFA07A'] },
    { bg: '#F4E8F8', fg: ['#8E44AD', '#9B59B6', '#745399', '#B19CD9'] },
    { bg: '#E8F8F4', fg: ['#27AE60', '#2ECC71', '#1E8449', '#A0DAA9'] },
    { bg: '#F8E8E8', fg: ['#C0392B', '#E74C3C', '#922B21', '#F5B7B1'] },
    { bg: '#E8F0F8', fg: ['#3498DB', '#2874A6', '#2E86C1', '#85C1E9'] }
  ];
  
  // 根据哈希值选择颜色方案
  const schemeIndex = hash % colorSchemes.length;
  const colorScheme = colorSchemes[schemeIndex];
  
  // 生成SVG的尺寸
  const size = 200;
  
  // 生成一些随机形状
  const shapes = [];
  const shapesCount = 4 + (hash % 4); // 4到7个形状
  
  for (let i = 0; i < shapesCount; i++) {
    const shapeType = (hash + i) % 3; // 0: 圆形, 1: 矩形, 2: 多边形
    const color = colorScheme.fg[i % colorScheme.fg.length];
    const shapeSeed = hash + (i * 13);
    
    if (shapeType === 0) {
      // 圆形
      const cx = 30 + (shapeSeed % (size - 60));
      const cy = 30 + ((shapeSeed * 5) % (size - 60));
      const r = 10 + (shapeSeed % 40);
      shapes.push(`<circle cx="${cx}" cy="${cy}" r="${r}" fill="${color}" opacity="0.8" />`);
    } else if (shapeType === 1) {
      // 矩形
      const x = 20 + (shapeSeed % (size - 80));
      const y = 20 + ((shapeSeed * 7) % (size - 80));
      const width = 15 + (shapeSeed % 50);
      const height = 15 + ((shapeSeed * 3) % 50);
      const rx = shapeSeed % 15; // 圆角
      shapes.push(`<rect x="${x}" y="${y}" width="${width}" height="${height}" rx="${rx}" fill="${color}" opacity="0.8" />`);
    } else {
      // 多边形 (三角形或其他简单形状)
      const points = [];
      const sides = 3 + (shapeSeed % 3); // 3到5条边
      const centerX = 30 + (shapeSeed % (size - 60));
      const centerY = 30 + ((shapeSeed * 11) % (size - 60));
      const radius = 10 + (shapeSeed % 30);
      
      for (let j = 0; j < sides; j++) {
        const angle = (j * 2 * Math.PI / sides) + (shapeSeed % Math.PI);
        const x = centerX + radius * Math.cos(angle);
        const y = centerY + radius * Math.sin(angle);
        points.push(`${x},${y}`);
      }
      
      shapes.push(`<polygon points="${points.join(' ')}" fill="${color}" opacity="0.8" />`);
    }
  }
  
  // 组合SVG
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">
      <rect width="${size}" height="${size}" fill="${colorScheme.bg}" />
      ${shapes.join('\n      ')}
    </svg>
  `;
  
  // 返回Data URL形式的SVG
  const svgUrl = `data:image/svg+xml;utf8,${encodeURIComponent(svg.trim())}`;
  
  // 存入缓存
  avatarCache.set(username, svgUrl);
  
  return svgUrl;
};

// 生成用户默认头像
const defaultAvatarUrl = computed(() => {
  if (avatarUrl.value) return avatarUrl.value;
  if (!username.value) return '';
  return generateAvatarSvg(username.value);
});

// 最近解题记录
interface ProblemRecord {
  title: string;
  difficulty: string;
  difficultyText: string;
  solvedAt: Date;
}

const recentProblems = ref([
  {
    title: '寻找两个有序数组的中位数',
    difficulty: 'hard',
    difficultyText: '困难',
    solvedAt: new Date('2023-09-15')
  },
  {
    title: '两数之和',
    difficulty: 'easy',
    difficultyText: '简单',
    solvedAt: new Date('2023-09-12')
  },
  {
    title: '最长回文子串',
    difficulty: 'medium',
    difficultyText: '中等',
    solvedAt: new Date('2023-09-10')
  }
]);

// 格式化日期 - 添加缓存避免重复计算
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

// 获取用户信息
const fetchUserProfile = async (): Promise<void> => {
  try {
    // 这里应该从你的后端获取用户信息
    // 为演示目的，先使用本地存储的数据
    username.value = localStorage.getItem('username') || '用户';
    userRole.value = localStorage.getItem('userRole') || '普通用户';
    
    // 假设这是从后端获取的其他用户数据
    userJoinDate.value = new Date('2023-01-15');
    problemSolved.value = 42;
    competitionsJoined.value = 5;
    rank.value = 128;
    email.value = 'user@example.com';
    bio.value = '热爱编程，喜欢解决复杂问题。正在学习算法和数据结构。';
    organization.value = '示例大学';
    website.value = 'https://github.com/username';
    
    // 模拟从后端API获取数据
    // const response = await axios.get('/api/user/profile');
    // if (response.data.success) {
    //   const userData = response.data.user;
    //   // 更新用户信息...
    // }
  } catch (error) {
    console.error('获取用户信息失败:', error);
  }
};

// 保存用户资料
const saveProfile = async (): Promise<void> => {
  try {
    // 这里应该发送请求到后端保存用户信息
    // const response = await axios.post('/api/user/profile', {
    //   email: email.value,
    //   bio: bio.value,
    //   organization: organization.value,
    //   website: website.value
    // });
    
    // 模拟成功响应
    setTimeout(() => {
      ElMessage({
        message: '个人资料已更新',
        type: 'success'
      });
    }, 500);
  } catch (error) {
    console.error('保存用户资料失败:', error);
    ElMessage({
      message: '保存失败，请稍后重试',
      type: 'error'
    });
  }
};

// 延迟显示热力图
const showHeatmapAfterDelay = () => {
  // 使用 requestAnimationFrame 确保UI绘制完成后再加载热力图
  requestAnimationFrame(() => {
    // 200ms延迟，让基本内容先显示
    setTimeout(() => {
      isHeatmapVisible.value = true;
    }, 200);
  });
};

// 组件挂载时获取用户信息
onMounted(() => {
  // 立即获取用户基本信息
  fetchUserProfile();
  
  // 延迟显示热力图
  showHeatmapAfterDelay();
});
</script>

<style scoped>
.profile-container {
  min-height: 100vh;
  background-color: #f7f9fc;
  padding-top: 84px;
  padding-bottom: 40px;
  will-change: transform; /* 优化渲染性能 */
}

.profile-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  gap: 30px;
}

/* 左侧侧边栏 */
.user-profile-sidebar {
  width: 280px;
  flex-shrink: 0;
}

.user-card {
  background-color: white;
  border-radius: 12px;
  padding: 30px 20px;
  text-align: center;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  margin-bottom: 20px;
  will-change: transform; /* 优化渲染性能 */
  transform: translateZ(0); /* 触发GPU加速 */
}

.user-avatar-container {
  position: relative;
  width: 120px;
  height: 120px;
  margin: 0 auto 20px;
}

.user-avatar {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  overflow: hidden;
  background-color: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 4px solid white;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  transform: translateZ(0); /* 触发GPU加速 */
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
  font-size: 32px;
  font-weight: 600;
  color: white;
  background: linear-gradient(135deg, #42b983, #33c6aa);
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.user-name {
  font-size: 20px;
  font-weight: 600;
  margin: 0 0 5px;
  color: #333;
}

.user-role {
  color: #42b983;
  font-size: 14px;
  margin-bottom: 15px;
  font-weight: 500;
}

.user-joined {
  color: #888;
  font-size: 13px;
  margin-bottom: 20px;
}

.user-stats {
  display: flex;
  justify-content: space-around;
  border-top: 1px solid #f0f0f0;
  padding-top: 15px;
}

.stat-item {
  text-align: center;
}

.stat-value {
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.stat-label {
  font-size: 12px;
  color: #888;
  margin-top: 3px;
}

.user-nav {
  background-color: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
}

.nav-item {
  padding: 16px 20px;
  display: flex;
  align-items: center;
  gap: 12px;
  color: #666;
  cursor: pointer;
  border-bottom: 1px solid #f5f5f5;
  transition: all 0.2s ease;
  text-decoration: none;
}

.nav-item:last-child {
  border-bottom: none;
}

.nav-item:hover {
  background-color: #f9f9f9;
  color: #42b983;
}

.nav-item.active {
  color: #42b983;
  background-color: rgba(66, 185, 131, 0.05);
  font-weight: 500;
  position: relative;
}

.nav-item.active::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 4px;
  background-color: #42b983;
  border-radius: 0 2px 2px 0;
}

/* 右侧内容区域 */
.profile-main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
  transform: translateZ(0); /* 触发GPU加速 */
}

.profile-section {
  background-color: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
}

/* 热力图加载占位符 */
.heatmap-placeholder {
  min-height: 300px;
  display: flex;
  flex-direction: column;
}

.loading-indicator {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  color: #999;
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

@keyframes spin {
  to { transform: rotate(360deg); }
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0 0 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  align-items: center;
}

.profile-form {
  max-width: 600px;
}

.save-btn {
  width: 100%;
  padding: 12px;
  font-size: 16px;
  background-color: #42b983;
  border-color: #42b983;
  transition: all 0.3s ease;
}

.save-btn:hover {
  background-color: #33a06f;
  border-color: #33a06f;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(66, 185, 131, 0.2);
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
  transition: all 0.2s ease;
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

/* 响应式布局 */
@media (max-width: 900px) {
  .profile-content {
    flex-direction: column;
  }
  
  .user-profile-sidebar {
    width: 100%;
  }
  
  .user-card {
    padding: 20px;
  }
  
  .user-avatar-container {
    width: 100px;
    height: 100px;
  }
}
</style>
