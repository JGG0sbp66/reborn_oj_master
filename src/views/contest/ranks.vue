<template>
  <competitionheader :raceInfo="raceInfo" />
  <main>
    <div class="main-content">
      <div class="left-panel">
        <sidebarrank />
      </div>
      <div class="content-area">
        <div class="content-wrapper">
          <div class="left-main">
            <rank :raceRank="raceRank" />
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref } from "vue"
import showtitle from "@/components/test/showtitle.vue"
import navlinks from "@/components/test/navlinks.vue";
import competitionheader from "@/components/zq/competitionheader.vue";
import sidebarrank from "@/components/zq/sidebar-rank.vue";
import rank from "@/components/zq/rank.vue";
import axios from "axios";
import { onMounted } from "vue";

const raceInfo = ref({});
const raceRank = ref({
    race_rank: []
});

const get_race_info = async () => {
    try {
        const { data: raceData } = await axios({
            url: "http://localhost:5000/api/race-info",
            method: "post",
            data: { uid: 1 },
        });
        console.log('比赛信息:', raceData);
        // 确保返回的数据格式正确
        return {
            value: {
                race_info: {
                    title: raceData.race_info?.title || '未知比赛',
                    start_time: raceData.race_info?.start_time || '',
                    end_time: raceData.race_info?.end_time || '',
                    tags: raceData.race_info?.tags || [],
                    problems: raceData.race_info?.problems || [],
                    user_num: raceData.race_info?.user_num || 0,
                    user_status: raceData.race_info?.user_status || []
                }
            }
        };
    } catch (error) {
        console.error('获取比赛信息失败:', error);
        return {
            value: {
                race_info: {
                    title: '加载失败',
                    start_time: '',
                    end_time: '',
                    tags: [],
                    problems: [],
                    user_num: 0,
                    user_status: []
                }
            }
        };
    }
};

const get_race_rank = async () => {
    try {
        const { data: userData } = await axios({
            url: "http://localhost:5000/api/race-rank",
            method: "post",
            data: { uid: 1 },
        });
        console.log('API返回数据:', userData);
        return userData;
    } catch (error) {
        console.error('获取排名数据失败:', error);
        return null;
    }
};

const fetchData = async () => {
    try {
        const [race_info_data, race_rank_data] = await Promise.all([
            get_race_info(),
            get_race_rank()
        ]);
        
        if (race_info_data) {
            raceInfo.value = race_info_data;
            console.log('更新后的raceInfo:', raceInfo.value);
            console.log('比赛标题:', raceInfo.value?.value?.race_info?.title);
        }
        
        if (race_rank_data) {
            raceRank.value = race_rank_data;
            console.log('更新后的raceRank:', raceRank.value);
        }
    } catch (error) {
        console.error('更新数据失败:', error);
    }
};

onMounted(() => {
    console.log('组件挂载，开始获取数据');
    fetchData();
});
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
  background-color: #f1f5f9;
  overflow: auto;
}

.content-wrapper {
  display: flex;
  width: 100%;
  max-width: 1800px;
  gap: 24px;
  justify-content: center;
  position: relative;
}

.left-main {
  flex: 1;
  width: 100%;
  min-width: 0;
  background-color: transparent;
  border-radius: 12px;
  animation: fadeInUp 0.6s ease-out;
  transition: transform 0.3s ease;
  position: relative;
  overflow: visible;
  padding: 0;
}

.left-main::after {
  display: none;
}

.left-main:hover {
  transform: none;
  box-shadow: none;
}

.right-main {
  flex: 1;
  max-width: 328px;
  background-color: #fff;
  font-size: 14px;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
  padding: 24px;
  animation: fadeInUp 0.6s ease-out 0.1s;
  animation-fill-mode: both;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  position: relative;
  overflow: hidden;
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.95);
}

.right-main:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.08);
}

.right-main::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 3px;
  background: linear-gradient(90deg, #3b82f6, #10b981);
  transform: scaleX(0);
  transform-origin: right;
  transition: transform 0.4s ease;
}

.right-main:hover::after {
  transform: scaleX(1);
}

/* 比赛信息卡片样式 */
.info-card {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.info-item {
  padding: 16px;
  border-radius: 8px;
  background-color: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.info-item:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.info-label {
  font-size: 16px;
  font-weight: 500;
  color: #1e293b;
}

.status-item {
  padding: 12px;
  border-radius: 8px;
  background-color: #f1f5f9;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.status-text {
  font-size: 15px;
  font-weight: 500;
  color: #0f172a;
}

.timeline {
  margin-top: 10px;
  padding: 20px 10px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  position: relative;
}

.timeline-line {
  position: absolute;
  left: 12px;
  top: 42px;
  bottom: 42px;
  width: 2px;
  background-color: #e2e8f0;
}

.timeline-item {
  display: flex;
  align-items: center;
  gap: 15px;
  position: relative;
  z-index: 1;
}

.circle {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.circle.start {
  background-color: rgba(16, 185, 129, 0.1);
  border: 2px solid #10b981;
}

.circle.end {
  background-color: rgba(239, 68, 68, 0.1);
  border: 2px solid #ef4444;
}

.timeline-text {
  font-size: 14px;
  color: #475569;
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
  0% {
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
  }

  50% {
    box-shadow: 0 4px 25px rgba(59, 130, 246, 0.15);
  }

  100% {
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
  }
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
    radial-gradient(circle at 20% 20%, rgba(16, 185, 129, 0.03) 0, transparent 200px),
    radial-gradient(circle at 80% 80%, rgba(59, 130, 246, 0.03) 0, transparent 200px);
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

  .left-main {
    padding: 0;
  }
}
</style>