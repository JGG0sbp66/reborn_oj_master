<template>
  <showtitle text="这里是题库页面" />
  <!-- <navlinks /> -->
  <main>
    <div>
      <!-- 导航栏组件 -->
      <headerheader/>
      <!-- 题库组件 -->
      <div style="min-height: 133vh;"><questiobSum /></div>
      <!-- 页尾组件 -->
      <foot/>
    </div>
  </main>
</template>
  
  
<script setup lang="ts">
import { ref, reactive } from "vue";
import showtitle from "@/components/test/showtitle.vue";
import navlinks from "@/components/test/navlinks.vue";
import questiobSum from "@/components/chy/questionSum.vue";
import foot from "@/components/foot.vue";
import headerheader from "@/components/headerheader.vue";
</script>

<style scoped>
/* footer {
  position: absolute;
  bottom: 0;
  width: 100%;
  min-width: 100vh;
} */
</style>