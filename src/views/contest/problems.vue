<template>
  <main>
    <competitionheader />
    <div class="main-content">
      <div class="left-panel">
        <sidebarproblem />
      </div>
      <div class="content-area">
        <div class="content-wrapper">
          <div class="left-main">
            <competitionshow :raceInfo="raceInfo"/>
          </div>
          <div class="right-main">
            <competitioninformation />
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

const raceInfo = reactive({}); // 定义一个响应式对象来存储比赛信息

const get_race_info = async () => {
  const { data: userData } = await axios({
    url: "http://localhost:5000/api/race-info",
    method: "post",
    data: { uid: 1 },
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
  height: calc(100vh - 52px);
  background-color: #f8fafc;
  animation: fadeIn 0.6s ease-out;
  position: relative;
  top: 70px;
  overflow: hidden;
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
}

.content-wrapper {
  display: flex;
  max-width: 1280px;
  width: 100%;
  gap: 24px;
}

.medium-main {
  max-width: 1200px;
  margin: 0 auto;
  margin-top: 15px;
  display: flex;
  position: relative;
}

.left-main {
  flex: 2;
  max-width: 860px;
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

.left-main:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.08);
}

.left-main::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 3px;
  background: linear-gradient(90deg, #10b981, #3b82f6);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.4s ease;
}

.left-main:hover::after {
  transform: scaleX(1);
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

/* 媒体查询适配不同屏幕尺寸 */
@media (max-width: 1024px) {
  .content-wrapper {
    flex-direction: column;
  }
  
  .right-main {
    max-width: 100%;
    margin-top: 20px;
  }
}

@media (max-width: 768px) {
  .main-content {
    flex-direction: column;
  }
  
  .left-panel {
    width: 100%;
    height: auto;
    flex-direction: row;
    padding: 10px;
    justify-content: center;
  }
  
  .content-area {
    padding: 16px;
  }
  
  .left-main, .right-main {
    padding: 16px;
  }
}
</style>