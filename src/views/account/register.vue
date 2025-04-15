<template>
  <div>
    <headerheader />
    <div style="margin-bottom: 20px;">
      <RegisterForm />
    </div>
    <div class="footer-wrapper">
      <foot />
    </div>
  </div>
</template>

<script setup lang="ts">
import RegisterForm from "@/components/JGG/RegisterForm.vue";
import headerheader from "@/components/headerheader.vue";
import foot from "@/components/foot.vue";
</script>

<style scoped>
.footer-wrapper {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  clip-path: inset(calc(100% - 60px) 0 0 0);
  transition: clip-path 0.3s ease-in-out;
}

.footer-wrapper:hover {
  clip-path: inset(0 0 0 0);
}

.footer-wrapper > * {
  width: 100%;
}
</style>