<template>
  <!-- <showtitle text="这里是题目详情页面"/> -->
  <!-- <navlinks /> -->
  <!-- 题目详情页页眉组件 -->
  <questions_detailHeader :raceUid="race_uid"></questions_detailHeader>
  <!-- 题目详情组件 -->
  <div class="content">
    <questions_detailBody :raceUid="race_uid"></questions_detailBody>
  </div>
  <!-- 页脚组件 -->
  <div class="footer-wrapper">
    <foot />
  </div>

</template>
  
  
  <script setup lang="ts">
import { ref, reactive } from "vue";
import showtitle from "@/components/test/showtitle.vue";
import navlinks from "@/components/test/navlinks.vue";
import questions_detailHeader from "@/components/chy/questions_detailHeader.vue";
import questions_detailBody from "@/components/chy/questions_detailBody.vue";
import foot from "@/components/foot.vue";
import { useRoute } from "vue-router";

const route = useRoute();
const race_uid = route.query.race_uid; // 从 query 获取

console.log("接收到的参数:", { race_uid });
</script>
  
  
<style scoped>
.content {
  min-height: calc(100vh - 100px); /* 确保内容区域高度减去 footer 的高度 */
  padding-bottom: 50px; /* 给 footer 留出空间 */
  padding-top: 40px; /* 给 headerheader 留出空间 */
  position: relative; /* 添加相对定位 */
  z-index: 1; /* 设置基础层级 */
}
.footer-wrapper {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  clip-path: inset(calc(100% - 60px) 0 0 0);
  transition: clip-path 0.3s ease-in-out;
  z-index: 1000; /* 添加较高的层级 */
}

.footer-wrapper:hover {
  clip-path: inset(0 0 0 0);
}

.footer-wrapper > * {
  width: 100%;
}
</style>
