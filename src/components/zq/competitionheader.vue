<template>
  <header class="header">
    <div class="header-content">
      <!-- 网站标题 -->
      <router-link
        to="/nav/home"
        class="logo"
      >
        <span class="logo-text">OJ Master</span>
        <span class="logo-highlight"></span>
      </router-link>

      <!-- 修正后的主导航菜单 -->
      <div class="main-nav">
        <div class="competition-title">
          <span class="title-text">{{ props.raceInfo?.value?.race_info.title }}</span>
          <span class="title-highlight"></span>
        </div>
      </div>

      <!-- 用户操作区 -->
      <div class="user-actions">
        <template v-if="!isAuthenticated">
          <router-link
            to="/account/register"
            class="btn btn-register"
          >注册</router-link>
          <router-link
            to="/account/login"
            class="btn btn-login"
          >登录</router-link>
        </template>
        <div v-else class="user-profile">
          <router-link to="/user/profile" class="avatar-link">
            <div class="avatar" 
                 @mouseenter="handleUserMenuEnter" 
                 @mouseleave="handleUserMenuLeave"
                 @click="goToUserProfile">
              <div v-if="avatarUrl || defaultAvatarUrl" class="avatar-img">
                <img :src="avatarUrl || defaultAvatarUrl" alt="用户头像" />
              </div>
              <div v-else class="avatar-placeholder">
                {{ userInitials }}
              </div>
            </div>
          </router-link>
          <transition name="menu-fade">
            <div class="user-menu" v-if="showUserMenu" @mouseenter="handleUserMenuEnter" @mouseleave="handleUserMenuLeave">
              <div class="user-menu-header">
                <div class="user-menu-avatar">
                  <div v-if="avatarUrl || defaultAvatarUrl" class="menu-avatar-img">
                    <img :src="avatarUrl || defaultAvatarUrl" alt="用户头像" />
                  </div>
                  <div v-else class="menu-avatar-placeholder">
                    {{ userInitials }}
                  </div>
                </div>
                <div class="user-info">
                  <div class="user-menu-name">{{ username }}</div>
                  <div class="user-menu-role">{{ userRole }}</div>
                </div>
              </div>
              
              <div class="user-menu-divider"></div>
              
              <div class="menu-quick-actions">
                <router-link to="/user/profile" class="quick-action-btn">
                  <el-icon><UserFilled /></el-icon>
                  <span>个人中心</span>
                </router-link>
              </div>
              
              <div class="user-menu-items">
                <div class="user-menu-item logout" @click="logout">
                  <el-icon><SwitchButton /></el-icon>
                  <span>退出登录</span>
                </div>
              </div>
            </div>
          </transition>
        </div>
      </div>
    </div>
  </header>
</template>
  
<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, defineExpose } from "vue";
import { House, Collection, Trophy, UserFilled, SwitchButton } from "@element-plus/icons-vue";
import { checkAuth } from '@/utils/auth';
import axios from 'axios';
import { useRouter } from 'vue-router';

const router = useRouter();
const isAuthenticated = ref<boolean>(false);
const username = ref<string>('');
const userRole = ref<string>('');
const avatarUrl = ref<string>('');
const showUserMenu = ref<boolean>(false);
const menuCloseTimer = ref<number | null>(null); // 用于延迟关闭菜单

const props = defineProps({
  raceInfo: Object,
});
console.log(props.raceInfo);
// 从用户名生成缩写
const userInitials = computed(() => {
  if (!username.value || typeof username.value !== 'string') return '?';
  return username.value.substring(0, 2).toUpperCase();
});

// 生成随机颜色以便为用户头像创建背景色
const getRandomColor = () => {
  const colors = [
    '#42b983', '#33c6aa', '#00c4ff', '#3399ff', '#2979ff',
    '#5e72e4', '#7795f8', '#6772e5', '#7b69ee', '#6f42c1'
  ];
  const randomIndex = Math.floor(Math.random() * colors.length);
  return colors[randomIndex];
};

// 生成随机矢量图头像
const generateAvatarSvg = (username: string) => {
  // 从用户名生成一个稳定的哈希值，确保同一用户名总是生成相同的图案
  const hash = username.split('').reduce((acc, char, i) => {
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
  const halfSize = size / 2;
  
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
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg.trim())}`;
};

// 生成用户默认头像
const defaultAvatarUrl = computed(() => {
  if (avatarUrl.value) return avatarUrl.value;
  if (!username.value) return '';
  return generateAvatarSvg(username.value);
});

// 验证用户状态
const verifyUserState = async () => {
  try {
    // 先检查localStorage中是否有登录状态
    const isLoggedInFromStorage = localStorage.getItem('isLoggedIn') === 'true';
    const usernameFromStorage = localStorage.getItem('username');
    const userRoleFromStorage = localStorage.getItem('userRole');
    
    // 如果localStorage中有数据，先使用这些数据更新UI
    if (isLoggedInFromStorage && usernameFromStorage) {
      isAuthenticated.value = true;
      username.value = usernameFromStorage;
      userRole.value = userRoleFromStorage || '普通用户';
    }
    
    // 然后再通过API获取最新状态
    const { authenticated, user } = await checkAuth();
    isAuthenticated.value = authenticated;
    if (authenticated && user) {
      username.value = user.uid ? String(user.uid) : '用户'; // 确保转为字符串
      userRole.value = user.role || '普通用户';
      
      // 更新localStorage
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('username', user.uid);
      localStorage.setItem('userRole', user.role);
    } else {
      // 如果API返回未认证，清除localStorage
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('username');
      localStorage.removeItem('userRole');
    }
  } catch (error) {
    console.error('验证用户状态错误:', error);
    isAuthenticated.value = false;
  }
};

// 退出登录
const logout = async () => {
  try {
    await axios.post('http://localhost:5000/api/logout');
    isAuthenticated.value = false;
    showUserMenu.value = false;
    
    // 清除localStorage中的登录信息
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('username');
    localStorage.removeItem('userRole');
    
    router.push('/nav/home');
  } catch (error) {
    console.error('退出登录失败:', error);
  }
};

// 处理鼠标移入用户头像或菜单
const handleUserMenuEnter = () => {
  // 清除可能存在的关闭定时器
  if (menuCloseTimer.value !== null) {
    clearTimeout(menuCloseTimer.value);
    menuCloseTimer.value = null;
  }
  // 显示菜单
  showUserMenu.value = true;
};

// 处理鼠标移出菜单或头像
const handleUserMenuLeave = () => {
  // 设置延迟关闭定时器，给用户足够时间移动到菜单上
  menuCloseTimer.value = window.setTimeout(() => {
    showUserMenu.value = false;
    menuCloseTimer.value = null;
  }, 500); // 500毫秒(0.5秒)延迟
};

// 跳转到用户个人中心
const goToUserProfile = () => {
  router.push('/user/profile');
};

// 组件加载时验证用户状态
onMounted(() => {
  verifyUserState();
});

// 组件销毁前清除定时器
onBeforeUnmount(() => {
  if (menuCloseTimer.value !== null) {
    clearTimeout(menuCloseTimer.value);
  }
});

// 暴露方法给父组件
defineExpose({
  verifyUserState
});
</script>
  
<style scoped>
/* 基础样式 */
.header {
  width: 100%;
  height: 80px;
  background: rgba(255, 255, 255, 0.75);
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.05);
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.3);
}

.header-content {
  max-width: 1280px;
  height: 100%;
  margin: 0 auto;
  padding: 0 32px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

/* 标志设计 */
.logo {
  font-size: 28px;
  font-weight: 800;
  color: #1a1a1a;
  text-decoration: none;
  position: relative;
  display: flex;
  align-items: center;
  padding: 10px 0;
  flex: 0 0 auto; /* 防止flex缩放 */
  width: 180px; /* 固定宽度 */
}

.logo-text {
  position: relative;
  z-index: 2;
  letter-spacing: -0.5px;
  background: linear-gradient(135deg, #42b983 0%, #00c4ff 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.logo-highlight {
  position: absolute;
  width: 36px;
  height: 36px;
  background: rgba(66, 185, 131, 0.15);
  border-radius: 50%;
  left: -8px;
  z-index: 1;
  transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}

.logo:hover .logo-text {
  transform: translateY(-2px);
  text-shadow: 0 4px 12px rgba(66, 185, 131, 0.25);
}

.logo:hover .logo-highlight {
  transform: scale(1.4);
  opacity: 0.3;
}

/* 导航菜单 */
.main-nav {
  display: flex;
  gap: 40px;
  flex: 0 0 auto; /* 防止flex缩放 */
  justify-content: center; /* 居中对齐 */
  margin: 0 auto; /* 自动边距 */
  position: absolute; /* 绝对定位 */
  left: 50%; /* 水平居中 */
  transform: translateX(-50%); /* 水平居中 */
}

.nav-item {
  color: #4a5568;
  text-decoration: none;
  font-size: 16px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 24px 0;
  position: relative;
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.nav-icon {
  font-size: 20px;
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  color: currentColor; /* 让图标继承文字颜色 */
}

.nav-text {
  position: relative;
  z-index: 2;
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  display: inline-block;
}

.nav-hover-effect {
  position: absolute;
  bottom: 20px;
  left: 0;
  width: 100%;
  height: 2px;
  background: linear-gradient(90deg, #42b983, #00c4ff);
  transform: scaleX(0);
  transform-origin: right;
  transition: transform 0.6s cubic-bezier(0.23, 1, 0.32, 1);
  border-radius: 2px;
}

.nav-item:hover {
  color: #42b983;
}

.nav-item:hover .nav-icon {
  transform: translateY(-3px) rotate(-5deg);
  color: #42b983; /* 确保图标颜色与文字一致 */
  filter: drop-shadow(0 2px 4px rgba(66, 185, 131, 0.3)); /* 添加图标阴影 */
}

.nav-item:hover .nav-text {
  transform: translateY(-3px); /* 文字上浮 */
  text-shadow: 0 2px 8px rgba(66, 185, 131, 0.2); /* 添加文字阴影 */
}

.nav-item:hover .nav-hover-effect {
  transform: scaleX(1);
  transform-origin: left;
}

.nav-item.router-link-active {
  color: #42b983;
  font-weight: 600;
}

.nav-item.router-link-active .nav-text {
  transform: translateY(-1px);
}

.nav-item.router-link-active .nav-icon {
  color: #42b983;
  transform: translateY(-1px);
}

.nav-item.router-link-active .nav-hover-effect {
  transform: scaleX(1);
}

/* 用户操作按钮 */
.user-actions {
  display: flex;
  gap: 16px;
  align-items: center;
  flex: 0 0 auto; /* 防止flex缩放 */
  width: 180px; /* 与logo宽度一致 */
  justify-content: flex-end; /* 靠右对齐 */
}

.btn {
  padding: 10px 24px;
  border-radius: 8px;
  text-decoration: none;
  font-size: 15px;
  font-weight: 500;
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn span {
  position: relative;
  z-index: 2;
}

.btn-register {
  color: #4a5568;
  position: relative;
  overflow: hidden;
  padding: 8px 18px;
  border-radius: 6px;
  text-decoration: none;
  font-size: 15px;
  font-weight: 500;
  transition: all 0.3s ease;
  letter-spacing: 0.2px;
  background: transparent;
  border: none;
}

.btn-register::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 1px;
  background: linear-gradient(90deg, transparent, #42b983, transparent);
  transform: scaleX(0);
  transition: transform 0.3s ease;
}

.btn-register:hover {
  color: #42b983;
}

.btn-register:hover::after {
  transform: scaleX(1);
}

.btn-login {
  background: linear-gradient(90deg, #42b983, #00c4ff);
  color: white;
  border: none;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: relative;
  z-index: 1;
  overflow: hidden;
  padding: 8px 18px;
  border-radius: 6px;
  text-decoration: none;
  font-size: 15px;
  font-weight: 500;
  transition: all 0.3s ease;
  letter-spacing: 0.2px;
}

.btn-login::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, #3aa876, #00b3e6);
  z-index: -1;
  transition: opacity 0.3s ease;
  opacity: 0;
}

.btn-login:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(66, 185, 131, 0.25);
}

.btn-login:hover::before {
  opacity: 1;
}

.btn-login:active {
  transform: translateY(0);
  box-shadow: 0 4px 12px rgba(66, 185, 131, 0.3);
}

/* 用户头像和菜单样式 */
.user-profile {
  position: relative;
  display: flex;
  justify-content: flex-end; /* 靠右对齐 */
  width: 100%; /* 占满容器宽度 */
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.avatar:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(66, 185, 131, 0.25);
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
  font-size: 16px;
}

.user-menu {
  position: absolute;
  right: 0;
  top: 50px;
  width: 240px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
  z-index: 1000;
  overflow: hidden;
  border: 1px solid rgba(230, 230, 230, 0.7);
}

/* 添加菜单与头像之间的连接区域，防止鼠标移动时触发mouseleave */
.user-menu::before {
  content: '';
  position: absolute;
  top: -10px; /* 向上延伸 */
  right: 0;
  width: 100%;
  height: 10px;
  background: transparent; /* 保持透明 */
}

.user-menu-header {
  padding: 18px;
  background: linear-gradient(135deg, rgba(66, 185, 131, 0.05), rgba(0, 196, 255, 0.05));
  border-bottom: 1px solid rgba(0, 0, 0, 0.04);
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-menu-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  overflow: hidden;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.1);
  border: 2px solid rgba(255, 255, 255, 0.8);
}

.menu-avatar-img {
  width: 100%;
  height: 100%;
}

.menu-avatar-img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.menu-avatar-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #42b983, #33c6aa);
  color: white;
  font-weight: 600;
  font-size: 18px;
}

.user-info {
  flex: 1;
}

.user-menu-name {
  font-weight: 600;
  font-size: 15px;
  color: #333;
  margin-bottom: 4px;
}

.user-menu-role {
  font-size: 12px;
  color: #888;
  background: rgba(0, 0, 0, 0.04);
  padding: 2px 8px;
  border-radius: 12px;
  display: inline-block;
}

.user-menu-divider {
  height: 1px;
  background: linear-gradient(to right, rgba(0,0,0,0.02), rgba(0,0,0,0.06), rgba(0,0,0,0.02));
  margin: 0 15px;
}

.menu-quick-actions {
  padding: 16px;
  display: flex;
  justify-content: center;
}

.quick-action-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 20px;
  background: linear-gradient(135deg, #42b983, #33c6aa);
  color: white;
  border-radius: 20px;
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s ease;
  box-shadow: 0 3px 8px rgba(66, 185, 131, 0.2);
}

.quick-action-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 12px rgba(66, 185, 131, 0.3);
}

.quick-action-btn .el-icon {
  font-size: 16px;
}

.user-menu-items {
  padding: 10px 0;
}

.user-menu-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 18px;
  color: #333;
  text-decoration: none;
  transition: all 0.2s ease;
  cursor: pointer;
}

.user-menu-item:hover {
  background-color: rgba(66, 185, 131, 0.08);
  color: #42b983;
}

.user-menu-item .el-icon {
  font-size: 18px;
  color: #999;
  transition: all 0.2s ease;
}

.user-menu-item:hover .el-icon {
  color: #42b983;
  transform: translateX(2px);
}

.logout {
  color: #666;
  margin-top: 0;
  border-top: none;
  padding-top: 12px;
  opacity: 0.8;
}

.logout:hover {
  background-color: rgba(240, 240, 240, 0.5);
  color: #666;
  opacity: 1;
}

.logout:hover .el-icon {
  color: #666;
  transform: translateX(2px);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .header {
    height: 64px;
  }

  .header-content {
    padding: 0 20px;
  }

  .logo {
    font-size: 24px;
  }

  .main-nav {
    gap: 20px;
  }

  .nav-item {
    font-size: 15px;
    padding: 20px 0;
  }

  .btn {
    padding: 8px 16px;
    font-size: 14px;
  }
  
  .avatar {
    width: 36px;
    height: 36px;
  }
  
  .user-menu {
    width: 200px;
  }
}

.avatar-link {
  text-decoration: none;
  display: block;
}

/* 菜单淡入淡出动画 - 优化使其更加丝滑 */
.menu-fade-enter-active {
  animation: menu-fade-in 0.35s cubic-bezier(0.21, 1.11, 0.81, 1.05) forwards;
}

.menu-fade-leave-active {
  animation: menu-fade-out 0.25s cubic-bezier(0.55, 0.06, 0.68, 0.19) forwards;
}

@keyframes menu-fade-in {
  0% {
    opacity: 0;
    transform: translateY(-12px) scale(0.96);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0);
  }
  70% {
    opacity: 1;
    transform: translateY(2px) scale(1.01);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
  }
}

@keyframes menu-fade-out {
  0% {
    opacity: 1;
    transform: translateY(0) scale(1);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
  }
  100% {
    opacity: 0;
    transform: translateY(-12px) scale(0.96);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0);
  }
}

/* 比赛标题样式 */
.competition-title {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 20px;
}

.title-text {
  position: relative;
  z-index: 2;
  font-size: 24px;
  font-weight: 700;
  color: #1a1a1a;
  letter-spacing: -0.5px;
  background: linear-gradient(135deg, #42b983 0%, #00c4ff 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.title-highlight {
  position: absolute;
  width: 100%;
  height: 8px;
  background: rgba(66, 185, 131, 0.15);
  border-radius: 4px;
  bottom: -4px;
  left: 0;
  z-index: 1;
  transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
  transform: scaleX(0.8);
  transform-origin: center;
}

.competition-title:hover .title-text {
  transform: translateY(-2px);
  text-shadow: 0 4px 12px rgba(66, 185, 131, 0.25);
}

.competition-title:hover .title-highlight {
  transform: scaleX(1);
  opacity: 0.3;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .title-text {
    font-size: 20px;
  }
  
  .title-highlight {
    height: 6px;
    bottom: -3px;
  }
}
</style>


