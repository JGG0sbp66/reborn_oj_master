<template>
  <headerheader />
  <RegisterForm />
  <foot />
</template>

<script setup lang="ts">
import RegisterForm from "@/components/RegisterForm.vue";
import headerheader from "@/components/headerheader.vue";
import foot from "@/components/foot.vue";
</script>

<style scoped>
footer {
  position: absolute;
  bottom: 0;
  width: 100%;
}
</style>