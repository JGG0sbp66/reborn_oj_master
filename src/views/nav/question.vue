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
 <foot />
</template>
  
  
<script setup lang="ts">
import { ref, reactive } from "vue";
import showtitle from "@/components/test/showtitle.vue";
import navlinks from "@/components/test/navlinks.vue";
import questiobSum from "@/components/chy/questionSum.vue";
import foot from "@/components/foot.vue";
</script>

<style scoped>
footer {
  position: absolute;
  bottom: 0;
  width: 100%;
}
</style>