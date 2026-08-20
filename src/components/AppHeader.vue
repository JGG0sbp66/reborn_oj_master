<template>
  <header class="header" :class="`header--${variant}`">
    <div class="header-content">
      <!-- 答题页布局：logo 与导航组合在左侧 -->
      <div v-if="variant === 'detail'" class="header-left">
        <router-link to="/nav/home" class="logo">
          <span class="logo-text">OJ Master</span>
          <span class="logo-highlight"></span>
        </router-link>

        <nav class="main-nav">
          <router-link :to="questionRoute.path" class="nav-item">
            <el-icon class="nav-icon">
              <component :is="questionRoute.icon" />
            </el-icon>
            <span class="nav-text">{{ questionRoute.text }}</span>
            <span class="nav-hover-effect"></span>
          </router-link>
          <div class="nav-item nav-item--clickable" @click="handleShare">
            <el-icon class="nav-icon">
              <Share />
            </el-icon>
            <span class="nav-text">分享</span>
            <span class="nav-hover-effect"></span>
          </div>
        </nav>
      </div>

      <!-- 其他布局：独立 logo -->
      <router-link v-else to="/nav/home" class="logo">
        <span class="logo-text">OJ Master</span>
        <span class="logo-highlight"></span>
      </router-link>

      <!-- 标题布局：后台管理 / 竞赛标题 -->
      <div v-if="variant === 'title'" class="main-nav">
        <div class="competition-title">
          <span class="title-text">{{ title }}</span>
          <span class="title-highlight"></span>
        </div>
      </div>

      <!-- 默认布局：主导航菜单 -->
      <nav v-else-if="variant === 'default'" class="main-nav">
        <router-link to="/nav/home" class="nav-item">
          <el-icon class="nav-icon">
            <House />
          </el-icon>
          <span class="nav-text">首页</span>
          <span class="nav-hover-effect"></span>
        </router-link>
        <router-link to="/nav/question" class="nav-item">
          <el-icon class="nav-icon">
            <Collection />
          </el-icon>
          <span class="nav-text">题库</span>
          <span class="nav-hover-effect"></span>
        </router-link>
        <router-link to="/nav/competition" class="nav-item">
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
          <router-link to="/account/register" class="btn btn-register">注册</router-link>
          <router-link to="/account/login" class="btn btn-login">登录</router-link>
        </template>
        <div v-else class="user-profile">
          <router-link to="/user/profile" class="avatar-link">
            <div
              class="avatar"
              @mouseenter="handleUserMenuEnter"
              @mouseleave="handleUserMenuLeave"
              @click="goToUserProfile"
            >
              <div v-if="avatarUrl || defaultAvatarUrl" class="avatar-img">
                <img :src="avatarUrl || defaultAvatarUrl" alt="用户头像" />
              </div>
              <div v-else class="avatar-placeholder">
                {{ userInitials }}
              </div>
            </div>
          </router-link>
          <transition name="menu-fade">
            <div
              v-if="showUserMenu"
              class="user-menu"
              @mouseenter="handleUserMenuEnter"
              @mouseleave="handleUserMenuLeave"
            >
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
import { computed } from 'vue';
import {
  House,
  Collection,
  Trophy,
  UserFilled,
  SwitchButton,
  Share,
} from '@element-plus/icons-vue';
import { ElNotification } from 'element-plus';
import { useUserState } from '@/composables/useUserState';

const props = withDefaults(
  defineProps<{
    /** 头部布局：default=主导航；title=居中标题（后台/竞赛）；detail=答题页（返回导航+分享） */
    variant?: 'default' | 'title' | 'detail';
    /** variant 为 title 时显示的居中标题 */
    title?: string;
    /** variant 为 detail 时传入的竞赛 uid，用于「回到竞赛」路由 */
    raceUid?: string | number;
  }>(),
  {
    variant: 'default',
    title: '',
    raceUid: undefined,
  }
);

const {
  isAuthenticated,
  username,
  userRole,
  avatarUrl,
  showUserMenu,
  userInitials,
  defaultAvatarUrl,
  verifyUserState,
  logout,
  handleUserMenuEnter,
  handleUserMenuLeave,
  goToUserProfile,
} = useUserState();

// 计算题库路由地址（detail 布局使用）
const questionRoute = computed(() => {
  if (props.raceUid === undefined) {
    return {
      path: '/nav/question',
      icon: Collection,
      text: '回到题库',
    };
  }
  return {
    path: `/contest/problems?uid=${props.raceUid}`,
    icon: Trophy,
    text: '回到竞赛',
  };
});

// 分享功能（detail 布局使用）
const handleShare = async () => {
  try {
    const currentUrl = window.location.href;

    // 尝试使用现代 Clipboard API
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(currentUrl);
    } else {
      // 回退到传统方法
      const textarea = document.createElement('textarea');
      textarea.value = currentUrl;
      textarea.style.position = 'fixed'; // 避免滚动到页面底部
      document.body.appendChild(textarea);
      textarea.select();

      try {
        const successful = document.execCommand('copy');
        if (!successful) throw new Error('Copy command failed');
      } finally {
        document.body.removeChild(textarea);
      }
    }

    ElNotification({
      title: '复制成功',
      message: '内容已复制到剪贴板',
      type: 'success',
      duration: 2000,
    });
  } catch (err) {
    console.error('复制失败:', err);
    ElNotification.error({
      title: '复制失败',
      message: '请手动选择文本并复制',
      duration: 2000,
    });

    // 提供手动复制选项
    const currentUrl = window.location.href;
    prompt('请手动复制以下链接:', currentUrl);
  }
};

// 暴露方法给父组件
defineExpose({
  verifyUserState,
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
  z-index: 10000;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.3);
}

/* 标题与答题页布局保持原有层级，避免遮挡弹窗 */
.header--title,
.header--detail {
  z-index: 1000;
}

/* 答题页布局保持原有的绝对定位（随页面滚动） */
.header--detail {
  position: absolute;
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

/* 答题页布局：logo 与导航同处左侧容器 */
.header-left {
  display: flex;
  align-items: center;
  gap: 60px; /* 调整logo和导航菜单之间的间距 */
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

.header--detail .logo {
  width: auto;
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

/* 答题页布局：导航跟随 logo，不做绝对居中 */
.header--detail .main-nav {
  position: static;
  transform: none;
  margin: 0;
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

.nav-item--clickable {
  cursor: pointer;
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

.header--detail .user-actions {
  width: auto;
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
  content: '';
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
  content: '';
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
  background: linear-gradient(
    to right,
    rgba(0, 0, 0, 0.02),
    rgba(0, 0, 0, 0.06),
    rgba(0, 0, 0, 0.02)
  );
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

/* 居中标题样式（后台管理 / 竞赛标题布局） */
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

  .title-text {
    font-size: 20px;
  }

  .title-highlight {
    height: 6px;
    bottom: -3px;
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
</style>
