<template>
  <div class="register-page">
    <RegisterForm />
  </div>
</template>

<script setup lang="ts">
import RegisterForm from "@/components/JGG/RegisterForm.vue";
</script>

<style scoped>
.register-page {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  padding-top: 80px; /* 为页眉腾出空间 */
}
</style>