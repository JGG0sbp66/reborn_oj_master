<template>
  <main>
    <competitionheader :raceInfo="raceInfo"/>
    <div class="main-content">
      <div class="left-panel">
        <sidebarproblem :raceInfo="raceInfo"/>
      </div>
      <div class="content-area">
        <div class="content-wrapper">
          <div class="left-main">
            <competitionshow :raceInfo="raceInfo" :uid="uid"/>
          </div>
          <div class="right-main">
            <competitioninformation :raceInfo="raceInfo"/>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import axios from "axios";
import competitionheader from "@/components/zq/competitionheader.vue";
import sidebarproblem from "@/components/zq/sidebar-problem.vue";
import competitionshow from "@/components/zq/compotitionshow.vue";
import competitioninformation from "@/components/zq/competitioninformation.vue";
import { useRoute } from "vue-router";

const raceInfo = reactive({}); // 定义一个响应式对象来存储比赛信息
const route = useRoute();
const uid = ref(route.query.uid);
console.log("uid", uid); // 打印 uid 以调试

const get_race_info = async () => {
  const { data: userData } = await axios({
    url: "http://localhost:5000/api/race-info",
    method: "post",
    data: { uid: uid.value },
  });
  return userData;
};

const fetchData = async () => {
  const race_info_data = await get_race_info();
  raceInfo.value = race_info_data; // 将获取到的数据存储到响应式变量中
};

onMounted(fetchData); // 在组件挂载时调用 fetchData 函数

</script>

<style scoped>
.main-content {
  display: flex;
  /* height: calc(100vh - 52px); */
  background-color: #ffffff;
  animation: fadeIn 0.6s ease-out;
  position: relative;
  /* top: 70px; */
  overflow: auto; /* 改为auto允许滚动 */
}

.page-title {
  animation: slideInDown 0.5s ease-out;
  position: relative;
}

.page-title::after {
  content: '';
  position: absolute;
  bottom: -3px;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 2px;
  background: linear-gradient(90deg, #10b981, #3b82f6);
  transition: width 0.4s ease;
}

.page-title:hover::after {
  width: 100px;
}

.left-panel {
  width: 70px;
  background-color: #fff;
  height: 100%;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.07);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 16px;
  transition: width 0.3s ease;
  z-index: 10;
}

.content-area {
  flex: 1;
  display: flex;
  flex-direction: row;
  padding: 24px;
  justify-content: center;
  position: relative;
  z-index: 1;
  min-width: 0; /* 防止内容溢出 */
  margin-top: 70px;
}

.content-wrapper {
  display: flex;
  width: 100%;
  gap: 24px;
  max-width: 1440px; /* 增加最大宽度 */
  margin: 0 auto;
}

.left-main {
  flex: 1;
  min-width: 0; /* 防止内容溢出 */
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
  padding: 24px;
  animation: fadeInUp 0.6s ease-out;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  position: relative;
  overflow: hidden;
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.95);
}

.right-main {
  width: 300px; /* 固定宽度 */
  flex-shrink: 0; /* 防止收缩 */
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

@keyframes slideInDown {
  from {
    transform: translateY(-20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes fadeInUp {
  from {
    transform: translateY(30px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

/* 新增样式 */
@keyframes pulse {
  0% { box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06); }
  50% { box-shadow: 0 4px 25px rgba(59, 130, 246, 0.15); }
  100% { box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06); }
}

main {
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  position: relative;
  overflow: hidden;
}

main::before {
  content: '';
  position: absolute;
  width: 100%;
  height: 100%;
  background-image: 
    radial-gradient(circle at 20% 20%, rgba(16, 185, 129, 0.03) 0, transparent 50px),
    radial-gradient(circle at 80% 80%, rgba(59, 130, 246, 0.03) 0, transparent 50px);
}

.content-area {
  position: relative;
  z-index: 1;
}

/* 响应式布局优化 */
@media (max-width: 1440px) {
  .content-wrapper {
    max-width: 1200px;
  }
}

@media (max-width: 1200px) {
  .content-wrapper {
    max-width: 960px;
  }
}

@media (max-width: 1024px) {
  .content-wrapper {
    flex-direction: column;
  }
  
  .right-main {
    width: 100%;
    margin-top: 20px;
  }
}

@media (max-width: 768px) {
  .main-content {
    padding: 16px;
  }
  
  .content-area {
    padding: 16px;
  }
  
  .left-main {
    padding: 16px;
  }
}
</style>