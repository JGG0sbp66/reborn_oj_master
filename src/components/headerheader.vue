<template>
  <header class="header">
    <div class="header-content">
      <!-- 网站标题 -->
      <a
        href="/"
        class="logo"
        @click="refreshPage"
      >
        <span class="logo-text">OJ Master</span>
        <span class="logo-highlight"></span>
      </a>

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
        <router-link
          to="/account/register"
          class="btn btn-register"
        >注册</router-link>
        <router-link
          to="/account/login"
          class="btn btn-login"
        >登录</router-link>
      </div>
    </div>
  </header>
</template>
  
<script setup lang="ts">
import { House, Collection, Trophy } from "@element-plus/icons-vue";

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
}
</style>


