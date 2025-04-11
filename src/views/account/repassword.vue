<template>
  <div>
    <headerheader />
    <div style="margin-bottom: 20px;">
      <RepasswordForm />
    </div>
  </div>
</template>

<script setup lang="ts">
import RepasswordForm from "@/components/JGG/RepasswordForm.vue";
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