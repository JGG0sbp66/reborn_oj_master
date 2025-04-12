<template>
  <!-- <showtitle text="这里是题库页面" /> -->
  <!-- <navlinks /> -->
  <div>
    <!-- 导航栏组件 -->
    <headerheader />
    <!-- 题库组件 -->
    <div class="content">
      <questiobSum></questiobSum>
    </div>
    <!-- 页尾组件 -->
    <foot />
    <AIAgent
      title="「黄金判官·葛孚雷」"
      buttonColor="#3b82f6"
    />
  </div>
</template>
  
<script setup lang="ts">
import { ref, reactive } from "vue";
import showtitle from "@/components/test/showtitle.vue";
import navlinks from "@/components/test/navlinks.vue";
import questiobSum from "@/components/chy/questionSum.vue";
import foot from "@/components/foot.vue";
import headerheader from "@/components/headerheader.vue";
import AIAgent from "@/components/AI-Agent.vue";
</script>

<style scoped>
.content {
  min-height: calc(100vh - 100px); /* 确保内容区域高度减去 footer 的高度 */
  padding-bottom: 30px; /* 给 footer 留出空间 */
  padding-top: 50px; /* 给 headerheader 留出空间 */
}
</style>