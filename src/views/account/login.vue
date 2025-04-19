<template>
  <div class="login-page">
    <LoginForm @login-success="handleLoginSuccess" />
  </div>
</template>


<script setup lang="ts">
import { ref, onMounted } from "vue"
import LoginForm from "@/components/JGG/LoginForm.vue";
import { useRouter } from 'vue-router';

const router = useRouter();

// 处理登录成功事件
const handleLoginSuccess = async () => {
  console.log('登录成功事件被触发');
  // 登录成功后直接跳转
  setTimeout(() => {
    router.push("/nav/home");
  }, 1000);
};
</script>


<style scoped>
.login-page {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  padding-top: 80px; /* 为页眉腾出空间 */
}
</style>
