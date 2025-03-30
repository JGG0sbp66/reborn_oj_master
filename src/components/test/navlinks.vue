<template>
    <div class="nav-menu">
      <!-- 遍历过滤后的路由生成链接 -->
      <router-link 
        v-for="route in filteredRoutes" 
        :key="route.path"
        :to="route.path"
        class="nav-link"
      >
        {{ getDisplayName(route.name ?? '') }}
      </router-link>
    </div>
  </template>
  
  <script setup lang="ts">
  import { useRouter } from 'vue-router';
  import { computed } from 'vue';
  
  const router = useRouter();
  
  // 过滤掉别名路由和重定向路由
  const filteredRoutes = computed(() => {
    return router.getRoutes().filter(route => {
      return !route.redirect && !route.aliasOf;
    });
  });
  
  // 路由名称映射为更友好的显示名称
  const getDisplayName = (name: string | symbol) => {
    if (typeof name !== 'string') return '';
    
    const nameMap: Record<string, string> = {
      home: '首页',
      competition: '竞赛',
      question: '题库',
      questions_detail: '题目详情',
      login: '登录',
      register: '注册',
      problems: '比赛题目',
      ranks: '排行榜'
    };
    
    return nameMap[name] || name;
  };
  </script>
  
  <style scoped>
  .nav-menu {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    padding: 10px;
    background: #f0f0f0;
  }
  
  .nav-link {
    padding: 5px 10px;
    border-radius: 4px;
    background: white;
    text-decoration: none;
    color: #333;
  }
  
  .nav-link:hover {
    background: #e0e0e0;
  }
  
  .router-link-active {
    font-weight: bold;
    color: #42b983;
  }
  </style>