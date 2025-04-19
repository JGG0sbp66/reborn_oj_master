<template>
  <div class="repassword-page">
    <RepasswordForm />
  </div>
</template>

<script setup lang="ts">
import RepasswordForm from "@/components/JGG/RepasswordForm.vue";
</script>

<style scoped>
.repassword-page {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  padding-top: 80px; /* 为页眉腾出空间 */
}
</style>