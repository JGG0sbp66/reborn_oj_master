<template>
    <header class="header">
      <div class="header-content">
        <!-- 网站标题 -->
        <a href="/" class="logo" @click="refreshPage">
          OJ Master
        </a>
  
        <!-- 主导航菜单 -->
        <!-- <nav class="main-nav">
          <router-link to="/nav/home" class="nav-item">
            <el-icon class="nav-icon"><House /></el-icon>
            首页
          </router-link>
          <router-link to="/nav/question" class="nav-item">
            <el-icon class="nav-icon"><Collection /></el-icon>
            题库
          </router-link>
          <router-link to="/nav/competition" class="nav-item">
            <el-icon class="nav-icon"><Trophy /></el-icon>
            竞赛
          </router-link>
        </nav> -->
  
        <!-- 用户操作区 -->
        <div class="user-actions">
          <router-link to="/account/register" class="btn btn-register">注册</router-link>
          <router-link to="/account/login" class="btn btn-login">登录</router-link>
        </div>
      </div>
    </header>
  </template>
  
  <script setup lang="ts">
  import { House, Collection, Trophy } from '@element-plus/icons-vue'
  
  const refreshPage = (event: MouseEvent) => {
    event.preventDefault()
    window.location.reload()
  }
  </script>
  
  <style scoped>
  .header {
    width: 100%;
    height: 64px;
    background-color: rgba(255, 255, 255, 0.98);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
    position: fixed;
    top: 0;
    left: 0;
    z-index: 1000;
    backdrop-filter: blur(8px);
  }
  
  .header-content {
    max-width: 1200px;
    height: 100%;
    margin: 0 auto;
    padding: 0 24px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  
  .logo {
    font-size: 26px;
    font-weight: 700;
    color: #2c3e50;
    text-decoration: none;
    letter-spacing: -0.5px;
    transition: all 0.3s ease;
  }
  
  .logo:hover {
    transform: translateY(-1px);
    text-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }
  
  .main-nav {
    display: flex;
    gap: 60px;
  }
  
  .nav-item {
    color: #4a5568;
    text-decoration: none;
    font-size: 16px;
    font-weight: 500;
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 20px 0;
    position: relative;
    transition: all 0.3s ease;
  }
  
  .nav-item:hover {
    color: #42b983;
    transform: translateY(-1px);
  }
  
  .nav-item::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, #42b983, #00c4ff);
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.4s cubic-bezier(0.23, 1, 0.32, 1);
    border-radius: 3px;
    box-shadow: 0 1px 3px rgba(66, 185, 131, 0.3);
  }
  
  .nav-item:hover::after {
    transform: scaleX(1);
  }
  
  .nav-item.router-link-active {
    color: #42b983;
    font-weight: 600;
  }
  
  .nav-item.router-link-active::after {
    transform: scaleX(1);
  }
  
  .user-actions {
    display: flex;
    gap: 16px;
  }
  
  .btn {
    padding: 8px 18px;
    border-radius: 6px;
    text-decoration: none;
    font-size: 15px;
    font-weight: 500;
    transition: all 0.3s ease;
    letter-spacing: 0.2px;
  }
  
  .btn-register {
    color: #4a5568;
    position: relative;
    overflow: hidden;
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
    box-shadow: 0 2px 6px rgba(66, 185, 131, 0.2);
  }
  
  .nav-icon {
    font-size: 18px;
    margin-right: 4px;
    transition: transform 0.3s ease;
  }
  
  .nav-item:hover .nav-icon {
    transform: translateY(-1px);
  }
  
  @media (max-width: 768px) {
    .main-nav {
      gap: 30px;
    }
    
    .nav-item {
      font-size: 15px;
    }
    
    .btn {
      padding: 6px 14px;
      font-size: 14px;
    }
  }
  </style> 