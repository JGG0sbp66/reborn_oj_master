<template>
    <div class="sidebar-container">
      <div class="sidebar-items">
        <div :class="['sidebar-item', { active: isProblemsActive }]" @click="navigateToProblems">
          <div class="item-icon problem-icon">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 6H16M8 10H16M8 14H12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <div class="item-text">题目</div>
        </div>
        <div :class="['sidebar-item', { active: isRanksActive }]" @click="navigateToRanks">
          <div class="item-icon rank-icon">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 20V10M12 20V4M18 20V14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <div class="item-text">排名</div>
        </div>
      </div>
    </div>
  </template>
  
  <script lang="ts" setup>
  import { useRoute, useRouter } from 'vue-router';
  import { computed, onMounted } from 'vue';
  
  const route = useRoute();
  const router = useRouter();
  
  // 计算当前路由是否与题目页面匹配
  const isProblemsActive = computed(() => {
    return route.path.includes('/contest/problems');
  });
  
  // 计算当前路由是否与排名页面匹配
  const isRanksActive = computed(() => {
    return route.path.includes('/contest/ranks');
  });
  
  // 获取当前路由中的uid参数
  const getUid = () => {
    return route.query.uid || '';
  };
  
  // 跳转到题目页面
  const navigateToProblems = () => {
    const uid = getUid();
    if (uid) {
      router.push(`/contest/problems?uid=${uid}`);
    } else {
      router.push('/contest/problems');
    }
  };
  
  // 跳转到排名页面
  const navigateToRanks = () => {
    const uid = getUid();
    if (uid) {
      router.push(`/contest/ranks?uid=${uid}`);
    } else {
      router.push('/contest/ranks');
    }
  };
  
  // 初始化时如果没有明确路由，则跳转到题目页面
  onMounted(() => {
    if (!isProblemsActive.value && !isRanksActive.value) {
      // 如果当前路径是/contest/或类似路径，自动跳转到problems
      if (route.path.match(/^\/contest\/?$/)) {
        navigateToProblems();
      }
    }
  });
  </script>
  
  <style scoped>
  .sidebar-container {
    position: fixed;
    left: 0;
    top: 0;
    bottom: 0;
    width: 70px;
    height: 100vh;
    background-color: #fff;
    display: flex;
    flex-direction: column;
    align-items: center;
    transition: all 0.3s ease;
    z-index: 1000;
    box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
    border-right: 1px solid #e2e8f0;
  }
  
  .sidebar-items {
    margin-top: 100px;
    display: flex;
    flex-direction: column;
    gap: 20px;
    align-items: center;
    width: 100%;
  }
  
  .sidebar-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 10px 0;
    width: 100%;
    cursor: pointer;
    transition: all 0.3s ease;
  }
  
  .sidebar-item a, .sidebar-link {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-decoration: none;
    color: #64748b;
    gap: 6px;
    width: 100%;
  }
  
  .item-icon {
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 8px;
    transition: all 0.3s ease;
  }
  
  .problem-icon {
    background-color: #f3f4f6;
    color: #9ca3af;
  }
  
  .rank-icon {
    background-color: #f3f4f6;
    color: #9ca3af;
  }
  
  .item-text {
    font-size: 13px;
    font-weight: 500;
    margin-top: 2px;
    color: inherit;
  }
  
  .sidebar-item.active .item-icon {
    background-color: #ecfdf5;
    color: #10b981;
  }
  
  .sidebar-item.active .problem-icon {
    background-color: #ecfdf5;
    color: #10b981;
  }
  
  .sidebar-item.active .rank-icon {
    background-color: #ecfdf5;
    color: #10b981;
  }
  
  .sidebar-item.active .item-text {
    color: #10b981;
  }
  
  .sidebar-item:hover:not(.active) .item-icon {
    transform: translateY(-2px);
    background-color: #f3f4f6;
  }
  
  .sidebar-item svg {
    width: 24px;
    height: 24px;
  }
  </style>