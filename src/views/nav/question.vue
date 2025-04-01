<template>
  <showtitle text="这里是题库页面" />
  <navlinks />
  <main>
    <div>
      <!-- 导航栏组件 -->

      <!-- 题库组件 -->
      <questiobSum />

      <!-- 页尾组件 -->

    </div>
  </main>

</template>
  
  
<script setup lang="ts">
import { ref, reactive } from "vue";
import showtitle from "@/components/test/showtitle.vue";
import navlinks from "@/components/test/navlinks.vue";
import questiobSum from "@/components/chy/questionSum.vue";
</script>
  
  
<style scoped>
</style>



