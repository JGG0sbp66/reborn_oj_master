<template>
  <headerheader />
  <div class="profile-container">
    <div class="profile-content">
      <!-- 左侧用户信息 -->
      <div class="user-profile-sidebar">
        <div class="user-card">
          <div class="user-avatar-container">
            <div class="user-avatar" @click="triggerFileUpload">
              <div v-if="avatarUrl || defaultAvatarUrl" class="avatar-img">
                <img :src="avatarUrl || defaultAvatarUrl" alt="用户头像" />
                <div class="avatar-upload-overlay">
                  <el-icon><Upload /></el-icon>
                  <span>更换头像</span>
                </div>
              </div>
              <div v-else class="avatar-placeholder">
                {{ userInitials }}
                <div class="avatar-upload-overlay">
                  <el-icon><Upload /></el-icon>
                  <span>上传头像</span>
                </div>
              </div>
              <input
                type="file"
                ref="fileInput"
                accept="image/*"
                style="display: none"
                @change="onFileChange"
              />
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
          <div 
            class="nav-item"
            :class="{ active: activeSection === 'profile' }"
            @click="activeSection = 'profile'"
          >
            <el-icon><UserFilled /></el-icon>
            <span>个人资料</span>
            </div>
          
          <div 
            class="nav-item"
            :class="{ active: activeSection === 'solved-problems' }"
            @click="activeSection = 'solved-problems'"
          >
            <el-icon><List /></el-icon>
            <span>解题记录</span>
          </div>
          
          <div 
            class="nav-item"
            :class="{ active: activeSection === 'competitions' }"
            @click="activeSection = 'competitions'"
          >
            <el-icon><Trophy /></el-icon>
            <span>参赛记录</span>
        </div>

          <div 
            class="nav-item"
            :class="{ active: activeSection === 'settings' }"
            @click="activeSection = 'settings'"
          >
            <el-icon><Setting /></el-icon>
            <span>账户设置</span>
          </div>
            </div>
            </div>

      <!-- 右侧内容区域 -->
      <div class="profile-main-content">
        <!-- 用户活动热力图 - 始终可见 -->
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
        
        <transition name="fade" mode="out-in">
          <div v-if="activeSection === 'profile'" class="section-container" key="profile">
            <!-- 用户资料 -->
            <UserProfile 
              :user-profile="{ 
                username, 
                email, 
                bio
              }" 
              @profile-updated="handleProfileUpdated" 
            />
        </div>

          <div v-else-if="activeSection === 'solved-problems'" class="section-container" key="solved-problems">
            <!-- 解题记录 -->
            <SolvedProblems :problems="recentProblems" />
      </div>

          <div v-else-if="activeSection === 'competitions'" class="section-container" key="competitions">
            <!-- 比赛记录 -->
            <CompetitionRecords :competitions="competitions" />
          </div>

          <div v-else-if="activeSection === 'settings'" class="section-container" key="settings">
            <!-- 账户设置 -->
            <AccountSettings 
              :security-settings="{ 
                twoFactorEnabled, 
                loginNotificationsEnabled 
              }"
              :privacy-settings="{
                publicSolvedProblems,
                publicRanking
              }"
              @security-settings-updated="handleSecuritySettingsUpdated"
              @privacy-settings-updated="handlePrivacySettingsUpdated"
              @password-changed="handlePasswordChanged"
            />
              </div>
        </transition>
              </div>
            </div>
          </div>
  <foot class="page-footer" />
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, defineAsyncComponent, defineExpose } from 'vue';
import { useRoute } from 'vue-router';
import headerheader from '@/components/headerheader.vue';
import foot from '@/components/foot.vue';
import UserProfile from '@/components/yao/UserProfile.vue';
import SolvedProblems from '@/components/yao/SolvedProblems.vue';
import CompetitionRecords from '@/components/yao/CompetitionRecords.vue';
import AccountSettings from '@/components/yao/AccountSettings.vue';
// 使用异步组件延迟加载热力图组件
const ActivityHeatmap = defineAsyncComponent(() => 
  import('@/components/ActivityHeatmap.vue')
);
import { UserFilled, List, Trophy, Setting, Upload } from '@element-plus/icons-vue';
import axios from 'axios';
import { ElMessage } from 'element-plus';

// 控制当前显示的内容区域
const activeSection = ref('profile');

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
const username = ref<string>('');
const userRole = ref<string>('普通用户');
const avatarUrl = ref<string>('');
const userJoinDate = ref<Date>(new Date());
const email = ref<string>('');
const bio = ref<string>('');
const organization = ref<string>('');
const website = ref<string>('');
const fileInput = ref<HTMLInputElement | null>(null);

// 账户设置相关数据
const oldPassword = ref<string>('');
const newPassword = ref<string>('');
const confirmPassword = ref<string>('');
const twoFactorEnabled = ref<boolean>(false);
const loginNotificationsEnabled = ref<boolean>(true);
const publicSolvedProblems = ref<boolean>(true);
const publicRanking = ref<boolean>(true);

// 比赛记录
interface Competition {
  title: string;
  startDate: Date;
  endDate: Date;
  rank: string;
  result: string; // 'good', 'average', 'poor'
}

const competitions = ref<Competition[]>([
  {
    title: '2023年春季编程大赛',
    startDate: new Date('2023-04-10'),
    endDate: new Date('2023-04-12'),
    rank: '第8名',
    result: 'good'
  },
  {
    title: '算法挑战赛',
    startDate: new Date('2023-03-05'),
    endDate: new Date('2023-03-05'),
    rank: '第15名',
    result: 'average'
  }
]);

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
  
  if (!username.value) {
    cachedUsername = '';
    cachedInitials = '?';
    return '?';
  }
  
  cachedUsername = username.value;
  cachedInitials = username.value.substring(0, 2).toUpperCase();
  return cachedInitials;
});

// 生成随机矢量图头像 - 添加缓存避免重复生成
const avatarCache = new Map<string, string>();
const generateAvatarSvg = (username: string): string => {
  // 检查缓存
  if (avatarCache.has(username)) {
    return avatarCache.get(username) || '';
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

const recentProblems = ref<ProblemRecord[]>([
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
const dateFormatCache = new Map<number, string>();
const formatDate = (date: Date): string => {
  if (!date) return '';
  
  // 创建缓存键
  const cacheKey = date.getTime();
  
  // 检查缓存
  if (dateFormatCache.has(cacheKey)) {
    return dateFormatCache.get(cacheKey) || '';
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
    // 先使用本地存储的数据
    username.value = localStorage.getItem('username') || '用户';
    userRole.value = localStorage.getItem('userRole') || '普通用户';
    
    // 然后从API获取用户信息
    try {
      const response = await axios.get('http://localhost:5000/api/user/profile');
      if (response.data.authenticated && response.data.user) {
        // 使用后端返回的数据
        const userData = response.data.user;
        username.value = userData.username; // 使用正确的username字段
        userRole.value = userData.role || '普通用户';
        
        // 保存到localStorage以便下次使用
        localStorage.setItem('username', userData.username);
        localStorage.setItem('userRole', userData.role);
      }
    } catch (apiError) {
      console.error('API调用失败，使用本地数据:', apiError);
    }
    
    // 假设这是从后端获取的其他用户数据
    userJoinDate.value = new Date('2023-01-15');
    problemSolved.value = 42;
    competitionsJoined.value = 5;
    rank.value = 128;
    email.value = 'user@example.com';
    bio.value = '热爱编程，喜欢解决复杂问题。正在学习算法和数据结构。';
  } catch (error) {
    console.error('获取用户信息失败:', error);
  }
};

// 延迟显示热力图
const showHeatmapAfterDelay = (): void => {
  // 使用 requestAnimationFrame 确保UI绘制完成后再加载热力图
  requestAnimationFrame(() => {
    // 200ms延迟，让基本内容先显示
    setTimeout(() => {
      isHeatmapVisible.value = true;
    }, 200);
  });
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
        type: 'success' as const
      });
    }, 500);
      } catch (error) {
    console.error('保存用户资料失败:', error);
    ElMessage({
      message: '保存失败，请稍后重试',
      type: 'error' as const
    });
  }
};

// 修改密码
const changePassword = async (): Promise<void> => {
  if (!oldPassword.value || !newPassword.value || !confirmPassword.value) {
    ElMessage({
      message: '请填写所有密码字段',
      type: 'warning' as const
    });
    return;
  }
  
  if (newPassword.value !== confirmPassword.value) {
    ElMessage({
      message: '两次输入的新密码不一致',
      type: 'error' as const
    });
    return;
  }
  
  try {
    // 这里应该发送请求到后端修改密码
    // const response = await axios.post('/api/user/change-password', {
    //   oldPassword: oldPassword.value,
    //   newPassword: newPassword.value
    // });
    
    // 模拟成功响应
    setTimeout(() => {
      ElMessage({
        message: '密码已成功修改',
        type: 'success' as const
      });
      // 清空表单
      oldPassword.value = '';
      newPassword.value = '';
      confirmPassword.value = '';
    }, 500);
  } catch (error) {
    console.error('修改密码失败:', error);
    ElMessage({
      message: '修改密码失败，请稍后重试',
      type: 'error' as const
    });
  }
};

// 处理从UserProfile组件传来的更新事件
interface UserProfileData {
  username: string;
  email: string;
  bio: string;
}

const handleProfileUpdated = (updatedProfile: UserProfileData) => {
  // 更新本地状态
  email.value = updatedProfile.email;
  bio.value = updatedProfile.bio;
  
  // 可以在这里做一些其他操作，比如保存到localStorage或其他状态管理
  console.log('Profile updated:', updatedProfile);
};

// 处理从AccountSettings组件传来的事件
interface SecuritySettings {
  twoFactorEnabled: boolean;
  loginNotificationsEnabled: boolean;
}

interface PrivacySettings {
  publicSolvedProblems: boolean;
  publicRanking: boolean;
}

const handleSecuritySettingsUpdated = (settings: SecuritySettings) => {
  // 更新本地状态
  twoFactorEnabled.value = settings.twoFactorEnabled;
  loginNotificationsEnabled.value = settings.loginNotificationsEnabled;
  
  // 可以在这里做一些其他操作，比如保存到后端
  console.log('Security settings updated:', settings);
};

const handlePrivacySettingsUpdated = (settings: PrivacySettings) => {
  // 更新本地状态
  publicSolvedProblems.value = settings.publicSolvedProblems;
  publicRanking.value = settings.publicRanking;
  
  // 可以在这里做一些其他操作，比如保存到后端
  console.log('Privacy settings updated:', settings);
};

const handlePasswordChanged = () => {
  console.log('Password has been changed');
  // 这里可以做一些额外的操作，比如显示全局通知等
};

// 组件挂载时获取用户信息
onMounted(() => {
  // 立即获取用户基本信息
  fetchUserProfile();
  
  // 延迟显示热力图
  showHeatmapAfterDelay();
});

// 处理头像上传
const triggerFileUpload = (): void => {
  if (fileInput.value) {
    fileInput.value.click();
  }
};

const onFileChange = (event: Event): void => {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files.length > 0) {
    const file = input.files[0];
    // 检查文件类型
    if (!file.type.startsWith('image/')) {
      ElMessage({
        message: '请上传图片文件',
        type: 'warning' as const
      });
      return;
    }
    
    // 检查文件大小 (限制为 2MB)
    if (file.size > 2 * 1024 * 1024) {
      ElMessage({
        message: '图片大小不能超过 2MB',
        type: 'warning' as const
      });
      return;
    }
    
    // 创建临时URL用于预览
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target && typeof e.target.result === 'string') {
        avatarUrl.value = e.target.result;
        
        // 这里应该将头像上传到服务器
        // 模拟上传成功
        setTimeout(() => {
          ElMessage({
            message: '头像更新成功',
            type: 'success' as const
          });
        }, 800);
      }
    };
    reader.readAsDataURL(file);
  }
  
  // 重置文件输入，以便同一文件可以再次选择
  if (input) {
    input.value = '';
  }
};

// 导出组件方法和属性，使其可以被父组件访问
defineExpose({
  triggerFileUpload,
  avatarUrl,
  defaultAvatarUrl,
  userInitials,
  onFileChange
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
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  margin-bottom: 20px;
  will-change: transform; /* 优化渲染性能 */
  transform: translateZ(0); /* 触发GPU加速 */
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
}

.user-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 35px rgba(66, 185, 131, 0.15);
}

.user-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 5px;
  background: linear-gradient(90deg, #42b983, #33c6aa);
}

.user-avatar-container {
  position: relative;
  width: 120px;
  height: 120px;
  margin: 0 auto 25px;
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
  box-shadow: 0 8px 20px rgba(66, 185, 131, 0.2);
  transform: translateZ(0); /* 触发GPU加速 */
  transition: all 0.3s ease;
  position: relative;
  cursor: pointer;
}

.user-avatar:hover .avatar-upload-overlay {
  opacity: 1;
}

.avatar-upload-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
  color: white;
}

.avatar-upload-overlay .el-icon {
  font-size: 24px;
  margin-bottom: 5px;
}

.avatar-upload-overlay span {
  font-size: 12px;
  font-weight: 500;
}

.user-avatar:hover {
  transform: scale(1.05);
  box-shadow: 0 10px 25px rgba(66, 185, 131, 0.3);
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
  font-size: 22px;
  font-weight: 600;
  margin: 0 0 5px;
  color: #333;
  letter-spacing: 0.5px;
}

.user-role {
  color: #42b983;
  font-size: 14px;
  margin-bottom: 15px;
  font-weight: 500;
  position: relative;
  display: inline-block;
  padding: 3px 12px;
  background-color: rgba(66, 185, 131, 0.1);
  border-radius: 20px;
}

.user-joined {
  color: #888;
  font-size: 13px;
  margin-bottom: 25px;
  position: relative;
}

.user-joined:after {
  content: '';
  position: absolute;
  bottom: -12px;
  left: 50%;
  transform: translateX(-50%);
  width: 40px;
  height: 2px;
  background-color: #f0f0f0;
}

.user-stats {
  display: flex;
  justify-content: space-around;
  border-top: 1px solid #f0f0f0;
  padding-top: 20px;
}

.stat-item {
  text-align: center;
  transition: all 0.3s ease;
  padding: 5px 10px;
  border-radius: 8px;
}

.stat-item:hover {
  background-color: rgba(66, 185, 131, 0.05);
  transform: translateY(-3px);
}

.stat-value {
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin-bottom: 5px;
  background: linear-gradient(90deg, #42b983, #33c6aa);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.stat-label {
  font-size: 13px;
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
  transition: all 0.3s ease;
  text-decoration: none;
  position: relative;
  overflow: hidden;
}

.nav-item:after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 0;
  background-color: rgba(66, 185, 131, 0.05);
  transition: height 0.3s ease;
  z-index: -1;
}

.nav-item:hover:after {
  height: 100%;
}

.nav-item .el-icon {
  font-size: 18px;
  transition: transform 0.3s ease, color 0.3s ease;
}

.nav-item:hover .el-icon {
  transform: translateY(-2px);
  color: #42b983;
}

.nav-item span {
  font-size: 15px;
  transition: transform 0.3s ease, color 0.3s ease;
}

.nav-item:hover span {
  transform: translateX(2px);
  color: #42b983;
}

.nav-item.active {
  color: #42b983;
  background-color: rgba(66, 185, 131, 0.05);
  font-weight: 500;
  position: relative;
}

.nav-item.active .el-icon,
.nav-item.active span {
  color: #42b983;
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
  animation: slideIn 0.3s ease;
}

@keyframes slideIn {
  from { transform: translateY(100%); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

.nav-item:last-child {
  border-bottom: none;
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

/* Animation for problem items */
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

/* Section container animations */
.section-container {
  will-change: transform, opacity;
  animation: sectionFadeIn 0.5s ease forwards;
}

@keyframes sectionFadeIn {
  from {
    opacity: 0;
    transform: translateY(15px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Enhance the settings sections */
.settings-section {
  border-top: 1px solid #f0f0f0;
  padding-top: 25px;
  margin-top: 5px;
  position: relative;
}

.settings-section::before {
  content: '';
  position: absolute;
  top: -1px;
  left: 0;
  width: 40px;
  height: 3px;
  background: linear-gradient(90deg, #f0f0f0, transparent);
  border-radius: 3px;
}

.settings-subtitle {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 0 0 20px;
  position: relative;
  display: inline-block;
}

.settings-subtitle::after {
  content: '';
  position: absolute;
  bottom: -5px;
  left: 0;
  width: 100%;
  height: 1px;
  background-color: rgba(66, 185, 131, 0.2);
}

.settings-option {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px dashed rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.settings-option:last-child {
  border-bottom: none;
}

.settings-option:hover {
  background-color: rgba(66, 185, 131, 0.02);
  padding-left: 5px;
}

.option-label {
  font-size: 14px;
  color: #555;
  transition: all 0.3s ease;
}

.settings-option:hover .option-label {
  color: #42b983;
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
  position: relative;
  overflow: hidden;
  z-index: 1;
}

.save-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, rgba(255,255,255,0.2), rgba(255,255,255,0));
  transition: 0.6s;
  z-index: -1;
}

.save-btn:hover::before {
  left: 100%;
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
  transition: all 0.3s ease;
  transform: translateX(0);
  animation: fadeIn 0.5s ease;
  animation-fill-mode: both;
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

/* 过渡动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

.el-form-item .el-button {
  border-radius: 8px;
  font-weight: 500;
  letter-spacing: 0.5px;
}

.el-switch {
  --el-switch-on-color: #42b983;
}

.el-switch.is-checked .el-switch__core {
  border-color: #42b983;
  background-color: #42b983;
}

/* 添加一些波纹效果的按钮，用于账户设置部分 */
.settings-container .el-button {
  position: relative;
  overflow: hidden;
}

.settings-container .el-button:after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 5px;
  height: 5px;
  background: rgba(255, 255, 255, 0.5);
  opacity: 0;
  border-radius: 100%;
  transform: scale(1, 1) translate(-50%);
  transform-origin: 50% 50%;
}

.settings-container .el-button:focus:not(:active)::after {
  animation: ripple 1s ease-out;
}

@keyframes ripple {
  0% {
    transform: scale(0, 0);
    opacity: 0.5;
  }
  20% {
    transform: scale(25, 25);
    opacity: 0.5;
  }
  100% {
    opacity: 0;
    transform: scale(40, 40);
  }
}

/* 美化输入框 */
.el-input__inner {
  transition: all 0.3s ease;
}

.el-input__inner:focus {
  border-color: #42b983 !important;
  box-shadow: 0 0 0 2px rgba(66, 185, 131, 0.2);
}

.el-textarea__inner:focus {
  border-color: #42b983 !important;
  box-shadow: 0 0 0 2px rgba(66, 185, 131, 0.2);
}

.settings-container {
  display: flex;
  flex-direction: column;
  gap: 25px;
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
