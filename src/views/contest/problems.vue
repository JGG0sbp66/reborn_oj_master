<template>
  <competitionheader />
  <showtitle text="这里是比赛题目页面" />
  <navlinks />
  <main>
    <div class="main-content">
      <div class="left-panel">
        <sidebar />
      </div>
      <div class="content-area">
        <div class="left-main">
          <competitionshow />
        </div>
        <div class="right-main">
          <competitioninformation />
        </div>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue"
import showtitle from "@/components/test/showtitle.vue"
import navlinks from "@/components/test/navlinks.vue";
import competition from "@/components/zq/competitionheader.vue";
import sidebar from "@/components/zq/sidebar-problem.vue";
import competitionshow from "@/components/zq/compotitionshow.vue";
import competitioninformation from "@/components/zq/competitioninformation.vue";
import Competitionheader from "@/components/zq/competitionheader.vue";
</script>

<style scoped>
.main-content {
  display: flex;
  height: calc(100vh - 52px);
  background-color: #f9f9f9;
  animation: fadeIn 0.5s ease-in-out;
  /* 添加淡入动画 */
}

.left-panel {
  width: 64px;
  background-color: #fff;
  height: 100%;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 10px;
  animation: slideInLeft 0.5s ease-in-out;
  /* 添加从左侧滑入动画 */
}

.content-area {
  flex: 1;
  display: flex;
  flex-direction: row;
  padding: 20px;
}

.medium-main {
  max-width: 1200px;
  margin: 0 auto;
  margin-top: 15px;
  display: flex;
  left: -35px;
  position: relative;
}

.left-main {
  flex: 2;
  /* 调整宽度比例 */
  max-width: 860px;
  background-color: #fff;
  /* 添加背景色 */
  border-radius: 8px;
  /* 添加圆角 */
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  /* 添加阴影 */
  padding: 20px;
  /* 增加内边距 */
  animation: fadeInUp 0.5s ease-in-out;
  /* 添加从下方淡入动画 */
}

.right-main {
  flex: 1;
  /* 调整宽度比例 */
  max-width: 328px;
  margin-left: 20px;
  /* 调整间距 */
  font-size: 14px;
  border-radius: 8px;
  /* 添加圆角 */
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  /* 添加阴影 */
  padding: 20px;
  /* 增加内边距 */
  animation: fadeInUp 0.5s ease-in-out;
  /* 添加从下方淡入动画 */
}

/* 动画定义 */
@keyframes fadeIn {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

@keyframes slideInLeft {
  from {
    transform: translateX(-100%);
    opacity: 0;
  }

  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes fadeInUp {
  from {
    transform: translateY(20px);
    opacity: 0;
  }

  to {
    transform: translateY(0);
    opacity: 1;
  }
}
</style>