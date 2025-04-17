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
              <div class="stat-value" :class="{ 'animate-number': isAnimatingStats }">{{ displayProblemSolved }}</div>
              <div class="stat-label">已解题目</div>
          </div>
            <div class="stat-item">
              <div class="stat-value" :class="{ 'animate-number': isAnimatingStats }">{{ displayCompetitionsJoined }}</div>
              <div class="stat-label">参与比赛</div>
            </div>
            <div class="stat-item">
              <div class="stat-value" :class="{ 'animate-number': isAnimatingStats }">{{ displayRank }}</div>
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
        
        <!-- 管理员后台入口按钮, 只对admin角色可见 -->
        <router-link 
          v-if="userRole === 'admin'"
          to="/user/manager" 
          class="admin-button"
          target="_blank"
        >
          <el-icon><Monitor /></el-icon>
          <span>后台管理</span>
        </router-link>
            </div>

      <!-- 右侧内容区域 -->
      <div class="profile-main-content">
        <!-- 用户活动热力图 - 始终可见 -->
        <div class="profile-section">
          <h3 class="section-title">编程活动</h3>
          <ActivityHeatmap />
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
            <SolvedProblems :problems="solvedProblemsData" :loading="isLoadingSolvedProblems" />
        </div>

          <div v-else-if="activeSection === 'competitions'" class="section-container" key="competitions">
            <!-- 比赛记录 -->
            <CompetitionRecords 
              v-if="activeSection === 'competitions'"
              :competitions="competitionRecordsData"
              :loading="isLoadingCompetitions"
            />
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
import { ref, computed, onMounted, watch, defineAsyncComponent, defineExpose, onBeforeUnmount } from 'vue';
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
import { UserFilled, List, Trophy, Setting, Upload, Monitor } from '@element-plus/icons-vue';
import axios from 'axios';
import { ElMessage, ElLoading } from 'element-plus';
import emitter from '@/utils/eventBus';

// 控制当前显示的内容区域
const activeSection = ref('profile');

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

// 用户统计信息
const problemSolved = ref(0);
const competitionsJoined = ref(0);
const rank = ref(0);

// 数字动画相关
const isAnimatingStats = ref(false);
const displayProblemSolved = ref(0);
const displayCompetitionsJoined = ref(0);
const displayRank = ref(0);

// 为统计数据添加增长动画
const animateStats = () => {
  // 如果数据全为0，不需要动画
  if (problemSolved.value === 0 && competitionsJoined.value === 0 && rank.value === 0) return;
  
  // 开始动画
  isAnimatingStats.value = true;
  
  // 重置显示值
  displayProblemSolved.value = 0;
  displayCompetitionsJoined.value = 0;
  displayRank.value = 0;
  
  // 使用更平滑的动画
  const duration = 1500; // 和热力图相同的动画时间
  const startTime = Date.now();
  
  // 缓动函数 - 使用与热力图相同的三次贝塞尔
  const easing = (t: number) => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
  
  const updateValues = () => {
    const currentTime = Date.now();
    const elapsed = currentTime - startTime;
    
    if (elapsed < duration) {
      const progress = easing(elapsed / duration);
      
      // 同步更新所有数值
      displayProblemSolved.value = Math.floor(progress * problemSolved.value);
      displayCompetitionsJoined.value = Math.floor(progress * competitionsJoined.value);
      displayRank.value = Math.floor(progress * rank.value);
      
      requestAnimationFrame(updateValues);
    } else {
      // 确保最终值精确
      displayProblemSolved.value = problemSolved.value;
      displayCompetitionsJoined.value = competitionsJoined.value;
      displayRank.value = rank.value;
      
      // 动画结束
      setTimeout(() => {
        isAnimatingStats.value = false;
      }, 200);
    }
  };
  
  // 启动动画
  setTimeout(() => {
    requestAnimationFrame(updateValues);
  }, 100);
};

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

// 修改refreshUserAvatar方法，使用Base64存储图片数据
const refreshUserAvatar = async (userId?: string | number) => {
  try {
    // 使用提供的userId或从localStorage获取
    const id = userId || localStorage.getItem('uid');
    if (!id) return;
    
    // 添加时间戳防止缓存
    const timestamp = localStorage.getItem('avatar_timestamp') || Date.now().toString();
    
    // 获取头像
    const avatarResponse = await axios.get(`http://localhost:5000/api/avatar-get/${id}?t=${timestamp}`, {
      responseType: 'blob',
      withCredentials: true
    });
    
    // 处理响应
    if (avatarResponse.status === 200 && avatarResponse.data) {
      // 释放之前的blob URL资源
      if (avatarUrl.value && avatarUrl.value.startsWith('blob:')) {
        try {
          URL.revokeObjectURL(avatarUrl.value);
        } catch (e) {
          console.log('释放旧头像URL资源失败:', e);
        }
      }
      
      // 创建新的blob URL用于当前会话显示
      const blob = new Blob([avatarResponse.data], { type: 'image/jpeg' });
      const imageUrl = URL.createObjectURL(blob);
      avatarUrl.value = imageUrl;
      
      // 将blob转换为Base64，用于持久化存储
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result) {
          // 保存Base64格式的图片到localStorage
          localStorage.setItem('avatarBase64', reader.result.toString());
          // 更新时间戳
          localStorage.setItem('avatar_timestamp', Date.now().toString());
        }
      };
      reader.readAsDataURL(blob);
    }
  } catch (error) {
    console.log('获取用户头像失败:', error);
  }
};

// 修改defaultAvatarUrl计算属性
const defaultAvatarUrl = computed(() => {
  // 首先检查localStorage中是否有Base64格式的头像
  const cachedAvatarBase64 = localStorage.getItem('avatarBase64');
  if (cachedAvatarBase64) return cachedAvatarBase64;
  
  // 其次检查响应式变量中的头像
  if (avatarUrl.value) return avatarUrl.value;
  
  // 最后才生成默认头像
  if (!username.value) return '';
  return generateAvatarSvg(username.value);
});

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

// 修改fetchUserProfile函数，改进头像加载逻辑
const fetchUserProfile = async (): Promise<void> => {
  try {
    // 先使用本地存储的数据
    username.value = localStorage.getItem('username') || '用户';
    userRole.value = localStorage.getItem('userRole') || '普通用户';
    
    // 优先使用缓存的Base64头像，避免闪烁
    const cachedAvatarBase64 = localStorage.getItem('avatarBase64');
    if (cachedAvatarBase64) {
      avatarUrl.value = cachedAvatarBase64;
    } else {
      // 如果没有Base64缓存，检查旧版本的Blob URL
      const cachedAvatar = localStorage.getItem('avatarUrl');
      if (cachedAvatar) {
        avatarUrl.value = cachedAvatar;
      }
    }
    
    // 获取用户ID
    const userId = localStorage.getItem('uid');
    
    // 始终尝试获取最新头像，但不阻塞UI显示
    if (userId) {
      requestAnimationFrame(() => {
        refreshUserAvatar(userId);
      });
    }
    
    // 从新的API获取用户信息
    try {
      const response = await axios.get('http://localhost:5000/api/get-user-info', {
        withCredentials: true
      });
      
      // 处理新的数据结构
      if (response.data) {
        // 使用API返回的数据
        const userData = response.data;
        
        // 更新用户名和邮箱
        if (userData.username) {
          username.value = userData.username;
          localStorage.setItem('username', userData.username);
        }
        
        if (userData.email) {
          email.value = userData.email;
        }
        
        // 尝试获取头像 (如果有userId)
        if (userId && !avatarUrl.value) {
          refreshUserAvatar(userId);
        }
      }
    } catch (apiError) {
      console.error('API调用失败，使用本地数据:', apiError);
      
      // 如果API调用失败，确保从localStorage获取的用户名是正确的格式
      if (username.value && !isNaN(Number(username.value))) {
        // 尝试从本地存储获取其他可能保存了正确username的位置
        const possibleUsername = localStorage.getItem('user_name') || 
                               localStorage.getItem('displayName') || 
                               'user' + username.value; // 格式化为"userN"
        username.value = possibleUsername;
      }
    }
    
    // 使用一些模拟数据填充其他字段
    userJoinDate.value = new Date('2023-01-15');
    problemSolved.value = 42;
    competitionsJoined.value = 5;
    rank.value = 128;
    bio.value = '热爱编程，喜欢解决复杂问题。正在学习算法和数据结构。';
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
  if (username.value !== updatedProfile.username) {
    username.value = updatedProfile.username;
    // 如果用户名修改了，需要更新页面标题和其他显示用户名的地方
    localStorage.setItem('username', updatedProfile.username);
    
    // 强制更新DOM，确保页面立即反映新用户名
    document.querySelectorAll('.user-name').forEach(el => {
      (el as HTMLElement).innerText = updatedProfile.username;
    });
    
    // 重新生成用户首字母缩写
    cachedUsername = '';
    cachedInitials = '';
  }
  
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

// 添加新的状态变量，用于预加载数据
const solvedProblemsData = ref([]);
const competitionRecordsData = ref([]);
const isLoadingSolvedProblems = ref(true);
const isLoadingCompetitions = ref(true);

// 在组件挂载时获取用户信息和预加载数据
onMounted(() => {
  // 立即获取用户基本信息
  fetchUserProfile();
  
  // 并行获取解题记录数据
  fetchSolvedProblems();
  
  // 并行获取参赛记录数据
  fetchCompetitionRecords();
  
  // 在获取数据后添加动画效果
  setTimeout(() => {
    animateStats();
  }, 500);
});

// 添加获取解题记录数据的函数
const fetchSolvedProblems = async () => {
  try {
    isLoadingSolvedProblems.value = true;
    const response = await axios.get('http://localhost:5000/api/user-questions');
    if (response.data && Array.isArray(response.data)) {
      solvedProblemsData.value = response.data;
    }
  } catch (error) {
    console.error('获取解题记录失败:', error);
  } finally {
    isLoadingSolvedProblems.value = false;
  }
};

// 添加获取参赛记录数据的函数
const fetchCompetitionRecords = async () => {
  try {
    isLoadingCompetitions.value = true;
    const response = await axios.get('http://localhost:5000/api/user-race');
    if (response.data && Array.isArray(response.data)) {
      competitionRecordsData.value = response.data;
    }
  } catch (error) {
    console.error('获取参赛记录失败:', error);
  } finally {
    isLoadingCompetitions.value = false;
  }
};

// 处理头像上传
const triggerFileUpload = (): void => {
  if (fileInput.value) {
    fileInput.value.click();
  }
};

// 修改onFileChange函数，使用Base64存储头像
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
        // 本地临时预览
        avatarUrl.value = e.target.result;
        
        // 创建FormData对象用于上传文件
        const formData = new FormData();
        formData.append('file', file);
        
        // 显示上传中提示
        const loadingInstance = ElLoading.service({
          lock: true,
          text: '头像上传中...',
          background: 'rgba(0, 0, 0, 0.7)'
        });
        
        // 将头像上传到服务器
        axios.post('http://localhost:5000/api/avatar-upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          },
          withCredentials: true
        })
        .then(response => {
          loadingInstance.close();
          
          if (response.data && response.data.success) {
            // 创建更新时间戳
            const timestamp = Date.now();
            localStorage.setItem('avatar_timestamp', timestamp.toString());
            
            // 保存Base64格式的图片到localStorage
            localStorage.setItem('avatarBase64', e.target.result);
            
            // 触发全局事件，通知其他组件更新头像
            emitter.emit('avatar-updated', {
              avatarUrl: e.target.result,
              timestamp: timestamp
            });
            
            ElMessage({
              message: '头像更新成功',
              type: 'success' as const
            });
          } else {
            // 处理服务器返回的错误信息
            const errorMsg = response.data?.message || '头像上传失败';
            ElMessage({
              message: errorMsg,
              type: 'error' as const
            });
            
            // 恢复之前的头像
            avatarUrl.value = localStorage.getItem('avatarBase64') || '';
          }
        })
        .catch(error => {
          loadingInstance.close();
          console.error('头像上传失败:', error);
          
          // 更详细的错误信息
          let errorMessage = '头像上传失败，请稍后重试';
          if (error.response) {
            // 服务器响应了，但状态码不是2xx
            errorMessage += ` (${error.response.status})`;
            console.log('错误响应数据:', error.response.data);
          } else if (error.request) {
            // 请求发送了但没有收到响应
            errorMessage = '服务器未响应，请检查网络连接';
          }
          
          ElMessage({
            message: errorMessage,
            type: 'error' as const
          });
          
          // 恢复之前的头像
          avatarUrl.value = localStorage.getItem('avatarBase64') || '';
        });
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

// 在onBeforeUnmount中添加资源清理
onBeforeUnmount(() => {
  // 释放blob URL资源
  if (avatarUrl.value && avatarUrl.value.startsWith('blob:')) {
    try {
      URL.revokeObjectURL(avatarUrl.value);
    } catch (e) {
      console.log('释放头像URL资源失败:', e);
    }
  }
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
  justify-content: space-between;
  margin-top: 15px;
}

.stat-item {
  flex: 1;
  text-align: center;
  padding: 5px 0;
  border-radius: 6px;
  transition: background-color 0.2s;
}

.stat-item:hover {
  background-color: rgba(66, 185, 131, 0.06);
}

.stat-value {
  font-size: 24px;
  font-weight: 600;
  color: #42b983;
  display: inline-block;
  min-width: 2em; /* 保持数字宽度稳定，防止闪烁 */
  transition: color 0.3s ease, transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.stat-label {
  font-size: 13px;
  color: #888;
  margin-top: 5px;
}

/* 添加和热力图相同的数字变化动画 */
.stat-value.animate-number {
  animation: countBlur 0.8s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes countBlur {
  0% {
    filter: blur(0px);
    opacity: 1;
    transform: scale(1);
  }
  50% {
    filter: blur(1.5px);
    opacity: 0.9;
    transform: scale(1.1);
  }
  100% {
    filter: blur(0px);
    opacity: 1;
    transform: scale(1);
  }
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

/* 独立的管理员按钮样式 */
.admin-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 20px;
  padding: 12px 20px;
  background: linear-gradient(to right, #42b983, #33c6aa);
  color: white !important;
  border-radius: 8px;
  font-weight: 500;
  text-decoration: none;
  box-shadow: 0 4px 12px rgba(66, 185, 131, 0.2);
  transition: all 0.3s cubic-bezier(0.25, 1, 0.5, 1);
  position: relative;
  overflow: hidden;
  text-align: center;
  will-change: transform; /* 提高动画性能 */
  isolation: isolate; /* 创建独立的堆叠上下文 */
}

.admin-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.6s cubic-bezier(0.25, 1, 0.5, 1);
  z-index: 0;
}

.admin-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 15px rgba(66, 185, 131, 0.25);
}

.admin-button:hover::before {
  left: 100%;
}

.admin-button .el-icon {
  color: white;
  z-index: 1;
  position: relative;
  transition: transform 0.3s ease;
  font-size: 18px;
}

.admin-button span {
  position: relative;
  z-index: 1;
  transition: transform 0.3s ease;
  font-size: 16px;
}

.admin-button:hover .el-icon {
  transform: translateY(-2px);
}

.admin-button:hover span {
  transform: translateX(2px);
}

/* 添加边缘缓冲区域，防止鼠标在边缘时产生抖动 */
.admin-button::after {
  content: '';
  position: absolute;
  top: -5px;
  left: -5px;
  right: -5px;
  bottom: -5px;
  z-index: -1;
  opacity: 0;
  pointer-events: none;
}
</style> 
