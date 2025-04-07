<template>
  <!-- <showtitle text="这里是登陆页面" />
  <navlinks /> -->
  <headerheader ref="headerRef" />
  <div style="margin-bottom: 20px;">
    <LoginForm @login-success="handleLoginSuccess" />
  </div>
  <foot />
</template>


<script setup lang="ts">
import { ref, reactive, onMounted } from "vue"
import showtitle from "@/components/test/showtitle.vue"
import navlinks from "@/components/test/navlinks.vue";
import LoginForm from "@/components/JGG/LoginForm.vue";
import headerheader from "@/components/headerheader.vue";
import foot from "@/components/foot.vue";
import { checkAuth } from '@/utils/auth';

const headerRef = ref(null);

// 处理登录成功事件
const handleLoginSuccess = async () => {
  console.log('登录成功事件被触发');
  // 如果headerRef存在，调用其verifyUserState方法更新用户状态
  if (headerRef.value && typeof (headerRef.value as any).verifyUserState === 'function') {
    try {
      await (headerRef.value as any).verifyUserState();
      console.log('成功更新页眉组件用户状态');
    } catch (error) {
      console.error('更新页眉组件状态失败:', error);
    }
  }
};

// 验证用户状态函数，可用于检查用户是否已登录
const verifyUser = async () => {
  const { authenticated, user } = await checkAuth();
  console.log('用户认证状态:', authenticated);
  if (authenticated) {
    console.log('用户信息:', user);
  } else {
    console.log('用户未登录或验证失败');
  }
};

// 组件挂载时验证一次用户状态
onMounted(() => {
  verifyUser();
  // 同时确保页眉组件状态是最新的
  if (headerRef.value && typeof (headerRef.value as any).verifyUserState === 'function') {
    (headerRef.value as any).verifyUserState();
  }
});
</script>


<style scoped>
footer {
  position: absolute;
  bottom: 0;
  width: 100%;
}
</style>
