<template>
  <div class="account-layout">
    <!-- 恢复彩色气泡背景 -->
    <AnimatedBackground />
    
    <!-- 添加代码背景组件 -->
    <CodeBackground />
    
    <!-- 固定不变的页眉 -->
    <headerheader ref="headerRef" />
    
    <!-- 只对主内容应用过渡效果 -->
    <div class="content-container">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <keep-alive>
            <component :is="Component" />
          </keep-alive>
        </transition>
      </router-view>
    </div>
    
    <!-- 固定不变的页脚 -->
    <div class="footer-wrapper">
      <foot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import AnimatedBackground from "@/components/yao/AnimatedBackground.vue";
import headerheader from "@/components/headerheader.vue";
import foot from "@/components/foot.vue";
import { checkAuth } from '@/utils/auth';
import { useRouter } from 'vue-router';
import CodeBackground from '@/components/JGG/CodeBackground.vue';

// 页眉引用
const headerRef = ref(null);

// 用于检查用户是否已登录，如果已经登录就跳转到首页
const router = useRouter();

// 用于定期检查身份验证状态的计时器
let authCheckInterval: number | null = null;

// 预先验证用户状态
const verifyUser = async () => {
  const { authenticated, user } = await checkAuth();
  // 可以在布局组件中处理验证逻辑，避免在各页面重复
  return { authenticated, user };
};

// 检查身份验证状态
const checkAuthStatus = async () => {
  try {
    const { authenticated } = await checkAuth();
    if (authenticated) {
      router.push('/nav/home');
      return true;
    }
    return false;
  } catch (error) {
    console.error('身份验证检查失败:', error);
    return false;
  }
};

onMounted(async () => {
  // 首次检查
  await checkAuthStatus();
  
  // 每60秒检查一次身份验证状态
  authCheckInterval = setInterval(checkAuthStatus, 60000);
});

onUnmounted(() => {
  // 清除定时器
  if (authCheckInterval) {
    clearInterval(authCheckInterval);
  }
});
</script>

<style scoped>
.account-layout {
  min-height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
}

.content-container {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  margin: 0;
  position: absolute;
  top: 60px; /* 为页眉留出空间 */
  left: 0;
  right: 0;
  bottom: 60px; /* 为页脚留出空间 */
  z-index: 1;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* 页脚样式 */
.footer-wrapper {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  clip-path: inset(calc(100% - 60px) 0 0 0);
  transition: clip-path 0.3s ease-in-out;
  z-index: 10;
}

.footer-wrapper:hover {
  clip-path: inset(0 0 0 0);
}

.footer-wrapper > * {
  width: 100%;
}
</style> 