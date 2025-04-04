<template>
  <!-- <showtitle text="这里是登陆页面" />
  <navlinks /> -->
  <headerheader />
  <div style="margin-bottom: 20px;">
    <LoginForm />
  </div>
  <foot />
</template>


<script setup lang="ts">
import { ref, reactive } from "vue"
import showtitle from "@/components/test/showtitle.vue"
import navlinks from "@/components/test/navlinks.vue";
import LoginForm from "@/components/JGG/LoginForm.vue";
import headerheader from "@/components/headerheader.vue";
import foot from "@/components/foot.vue";
import { checkAuth } from '@/utils/auth';

const verifyUser = async () => {
  const { authenticated, user } = await checkAuth();
  if (authenticated) {
    console.log('当前用户:', user?.role);
  } else {
    console.log('用户未登录或验证失败');
  }
};

verifyUser();
</script>


<style scoped>
footer {
  position: absolute;
  bottom: 0;
  width: 100%;
}
</style>
