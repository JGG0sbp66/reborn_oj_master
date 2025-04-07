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
      <nav class="main-nav">
        <router-link
          to="/nav/home"
          class="nav-item"
        >
          <el-icon class="nav-icon">
            <House />
          </el-icon>
          <span class="nav-text">首页</span>
          <span class="nav-hover-effect"></span>
        </router-link>
        <router-link
          to="/nav/question"
          class="nav-item"
        >
          <el-icon class="nav-icon">
            <Collection />
          </el-icon>
          <span class="nav-text">题库</span>
          <span class="nav-hover-effect"></span>
        </router-link>
        <router-link
          to="/nav/competition"
          class="nav-item"
        >
          <el-icon class="nav-icon">
            <Trophy />
          </el-icon>
          <span class="nav-text">竞赛</span>
          <span class="nav-hover-effect"></span>
        </router-link>
      </nav>

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
          <div class="avatar" @click="toggleUserMenu">
            <div v-if="avatarUrl" class="avatar-img">
              <img :src="avatarUrl" alt="用户头像" />
            </div>
            <div v-else class="avatar-placeholder">
              {{ userInitials }}
            </div>
          </div>
          <div class="user-menu" v-if="showUserMenu">
            <div class="user-menu-header">
              <div class="user-menu-name">{{ username }}</div>
              <div class="user-menu-role">{{ userRole }}</div>
            </div>
            <div class="user-menu-items">
              <router-link to="/user/profile" class="user-menu-item">
                <el-icon><UserFilled /></el-icon>
                <span>个人中心</span>
              </router-link>
              <router-link to="/user/settings" class="user-menu-item">
                <el-icon><Setting /></el-icon>
                <span>设置</span>
              </router-link>
              <div class="user-menu-item logout" @click="logout">
                <el-icon><SwitchButton /></el-icon>
                <span>退出登录</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>
  
<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
import { House, Collection, Trophy, UserFilled, Setting, SwitchButton } from "@element-plus/icons-vue";
import { checkAuth } from '@/utils/auth';
import axios from 'axios';
import { useRouter } from 'vue-router';

const router = useRouter();
const isAuthenticated = ref(false);
const username = ref('');
const userRole = ref('');
const avatarUrl = ref('');
const showUserMenu = ref(false);

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

// 切换用户菜单显示状态
const toggleUserMenu = () => {
  showUserMenu.value = !showUserMenu.value;
};

// 关闭用户菜单的事件处理
const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement;
  if (showUserMenu.value && !target.closest('.user-profile')) {
    showUserMenu.value = false;
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

// 组件加载时验证用户状态
onMounted(() => {
  verifyUserState();
  // 添加点击外部关闭菜单的事件监听
  document.addEventListener('click', handleClickOutside);
});

// 组件销毁前移除事件监听
onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside);
});

const refreshPage = (event: MouseEvent) => {
  event.preventDefault();
  window.location.reload();
};
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
  width: 220px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  overflow: hidden;
  animation: menu-appear 0.2s ease-out;
}

@keyframes menu-appear {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.user-menu-header {
  padding: 15px;
  background: linear-gradient(to right, rgba(66, 185, 131, 0.1), rgba(0, 196, 255, 0.1));
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.user-menu-name {
  font-weight: 600;
  font-size: 15px;
  color: #333;
  margin-bottom: 3px;
}

.user-menu-role {
  font-size: 12px;
  color: #888;
}

.user-menu-items {
  padding: 8px 0;
}

.user-menu-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 15px;
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
}

.user-menu-item:hover .el-icon {
  color: #42b983;
}

.logout {
  color: #dc3545;
  border-top: 1px solid rgba(0, 0, 0, 0.05);
  margin-top: 5px;
  padding-top: 10px;
}

.logout:hover {
  background-color: rgba(220, 53, 69, 0.08);
  color: #dc3545;
}

.logout:hover .el-icon {
  color: #dc3545;
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
</style>


