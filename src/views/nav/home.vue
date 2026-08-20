<template>
  <AppHeader />
  <div class="home-container">
    <div class="main-content">
      <!-- 轮播图部分 -->
      <div class="banner-container">
        <div class="banner-image">
          <div
            v-for="(slide, index) in bannerSlides"
            :key="index"
            class="banner-slide"
            :class="{ active: currentSlide === index }"
          >
            <div class="banner-placeholder" :style="{ background: slide.gradient }">
              <div class="banner-content">
                <h3 class="fade-in-up" :style="{ animationDelay: '0.1s' }">{{ slide.title }}</h3>
                <p class="fade-in-up" :style="{ animationDelay: '0.3s' }">{{ slide.subtitle }}</p>
                <button class="banner-btn fade-in-up" :style="{ animationDelay: '0.5s' }">
                  立即探索
                </button>
              </div>
            </div>
          </div>
          <div class="banner-controls">
            <div class="banner-dots">
              <span
                v-for="(slide, index) in bannerSlides"
                :key="index"
                class="dot"
                :class="{ active: currentSlide === index }"
                @click="setSlide(index)"
              ></span>
            </div>
          </div>
        </div>
      </div>

      <div class="content-wrapper">
        <!-- 主内容区 -->
        <div class="competitions-section">
          <!-- 热力图部分 -->
          <ActivityHeatmap />

          <!-- 竞赛部分 -->
          <div class="section-header">
            <div class="title-with-icon">
              <el-icon class="section-icon">
                <Trophy />
              </el-icon>
              <h2 class="section-title">最新竞赛</h2>
              <span class="subtitle">竞赛系统</span>
            </div>
            <router-link to="/nav/competition" class="more-link">
              更多比赛 <i class="more-icon">›</i>
            </router-link>
          </div>

          <!-- 竞赛列表 -->
          <div class="competition-list">
            <CompetitionCard
              v-for="(item, index) in competitions.slice(0, 4)"
              :key="index"
              :competition="item"
              :appear="true"
              :index="index"
              :action-link="`/contest/problems?uid=${item.race_uid}`"
            />
          </div>
        </div>

        <!-- 侧边栏 -->
        <div class="sidebar">
          <!-- 欢迎部分 -->
          <div class="sidebar-section">
            <WelcomeStats :stats-data="statsData" message="开始你的编程之旅，提升算法能力！" />
          </div>

          <!-- 推荐题库 -->
          <div class="sidebar-section">
            <RecommendedSites title="推荐题库" :sites="recommendedSites" />
          </div>

          <!-- 最新题目 -->
          <div class="sidebar-section">
            <LatestProblems title="最新题目" :problems="latestProblems" />
          </div>

          <!-- 开源项目 -->
          <div class="sidebar-section">
            <ProjectLinks title="开源项目" :projects="openSourceProjects" />
          </div>

          <!-- 在线服务 -->
          <div class="sidebar-section">
            <ServiceLinks title="在线服务" :services="onlineServices" />
          </div>
        </div>
      </div>
    </div>
  </div>

  <AIAgent title="「黄金判官·葛孚雷」" button-color="#3b82f6" />
  <foot class="page-footer" />
</template>

<script setup lang="ts">
import { ref, computed, reactive, onMounted, onBeforeUnmount } from 'vue';
import AppHeader from '@/components/AppHeader.vue';
import ActivityHeatmap from '@/components/ActivityHeatmap.vue';
import CompetitionCard from '@/components/yao/CompetitionCard.vue';
import WelcomeStats from '@/components/yao/WelcomeStats.vue';
import RecommendedSites from '@/components/yao/RecommendedSites.vue';
import LatestProblems from '@/components/yao/LatestProblems.vue';
import ProjectLinks from '@/components/yao/ProjectLinks.vue';
import ServiceLinks from '@/components/yao/ServiceLinks.vue';
import foot from '@/components/foot.vue';
import AIAgent from '@/components/AI-Agent.vue';
import { Trophy } from '@element-plus/icons-vue';
import { questionApi, raceApi } from '@/api';

// 轮播图数据
const bannerSlides = [
  {
    title: '欢迎使用 OJ Master 在线评测系统',
    subtitle: '挑战算法，提升编程能力',
    gradient: 'linear-gradient(120deg, #42b983 0%, #35a875 50%, #2979ff 100%)',
  },
  {
    title: '参加在线编程竞赛',
    subtitle: '与其他程序员一较高下',
    gradient: 'linear-gradient(120deg, #36a985 0%, #2a9e89 50%, #0072ff 100%)',
  },
  {
    title: '丰富的题库资源',
    subtitle: '从基础到高级的编程挑战',
    gradient: 'linear-gradient(120deg, #33c6aa 0%, #2bb797 50%, #3399ff 100%)',
  },
];

// 当前显示的轮播图索引
const currentSlide = ref(0);
let slideInterval: number | undefined;

// 下一张轮播图
const nextSlide = () => {
  currentSlide.value = (currentSlide.value + 1) % bannerSlides.length;
};

// 上一张轮播图
const prevSlide = () => {
  currentSlide.value = (currentSlide.value - 1 + bannerSlides.length) % bannerSlides.length;
};

// 设置特定轮播图
const setSlide = (index: number) => {
  currentSlide.value = index;
  // 重新启动自动切换
  startSlideshow();
};

// 自动切换轮播图
const startSlideshow = () => {
  stopSlideshow(); // 先停止之前的
  slideInterval = window.setInterval(() => {
    nextSlide();
  }, 5000); // 每5秒切换一次
};

// 停止自动切换
const stopSlideshow = () => {
  if (slideInterval) {
    clearInterval(slideInterval);
    slideInterval = undefined;
  }
};

// 竞赛数据
const competitions = ref([
  {
    title: '全国高校编程马拉松',
    logos: ['ACM', 'ICPC', 'CCF'],
    startTime: '2024-04-10 09:00:00',
    endTime: '2024-04-10 13:00:00',
    duration: '04 小时 00 分 00 秒',
    tags: [
      { name: '未开始', type: 'running' },
      { name: '个人赛', type: 'individual' },
      { name: 'OI赛制', type: 'oi' },
    ],
  },
]);

// 难度等级映射
const difficultyMap = {
  入门: { level: '入门', difficulty: '入门' },
  普及: { level: '普及', difficulty: '普及' },
  提高: { level: '提高', difficulty: '提高' },
  省选: { level: '省选', difficulty: '省选' },
  NOI: { level: 'NOI', difficulty: 'NOI' },
  CTSC: { level: 'CTSC', difficulty: 'CTSC' },
};

// 最新题目 - 改为从API获取
const latestProblems = ref([]);

// 获取最新题目数据
const fetchLatestProblems = async () => {
  try {
    const data = await questionApi.getHomeQuestions();
    if (data.success) {
      // console.log('获取最新题目数据:', data.questions);
      latestProblems.value = data.questions.map((question) => ({
        uid: question.uid,
        title: question.title,
        ...(difficultyMap[question.topic] || { level: '未知', difficulty: 'entry' }), // 默认值处理
      }));
      console.log('最新题目数据:', latestProblems.value);
    }
  } catch (error) {
    console.error('获取最新题目失败:', error);
    // 使用默认数据作为备份
    latestProblems.value = [{ title: '暂无数据', level: '入门', difficulty: '入门' }];
  }
};

// 最新题目
const latestProblemsBackup = [
  { title: '简单的数学问题', level: '入门', difficulty: 'entry' },
  { title: '字符串反转', level: '基础', difficulty: 'easy' },
  { title: '二叉树遍历', level: '提高', difficulty: 'medium' },
  { title: '动态规划基础', level: '进阶', difficulty: 'hard' },
  { title: '图论算法与最短路径', level: '竞赛', difficulty: 'expert' },
];

// 统计数据
const statsData = [
  { value: 24680, label: '题目总数' },
  { value: 1243, label: '注册用户' },
  { value: 89, label: '近期比赛' },
];

// 推荐题库数据
const recommendedSites = [
  { name: 'LibreOJ', url: 'https://loj.ac' },
  { name: 'Vijos', url: 'https://vijos.org' },
  { name: 'Luogu', url: 'https://www.luogu.com.cn' },
  { name: 'CodeForces', url: 'https://codeforces.com' },
  { name: 'AtCoder', url: 'https://atcoder.jp' },
];

// 开源项目数据
const openSourceProjects = [
  {
    title: 'CYaRon 测试数据生成器',
    description: '自动生成高质量的测试数据',
    url: 'https://github.com/luogu-dev/cyaron/wiki',
  },
  {
    title: 'Markdown+Palettes',
    description: '增强的Markdown编辑器',
    url: 'https://github.com/luogu-dev/markdown-palettes',
  },
];

// 在线服务数据
const onlineServices = [
  { title: '深入浅出算法设计竞赛', url: '#' },
  { title: '算法竞赛学习', url: '#' },
  { title: '学校模拟训练辅助工具', url: '#' },
  { title: '协办企业院校在线编程比赛', url: '#' },
];

// 存储从服务器获取的竞赛数据
const contestData = ref(null);

// 从服务器获取竞赛数据
const fetchCompetitions = async () => {
  try {
    // 检查数据结构并提取竞赛信息
    const data = await raceApi.getRaceList();

    if (data && data.race_info && Array.isArray(data.race_info)) {
      // 将获取到的竞赛数据赋值给competitions
      competitions.value = data.race_info.map((race: any) => {
        // 转换API返回的数据格式为组件需要的格式
        return {
          uid: race.race_uid, // 使用API返回的race_uid作为uid
          race_uid: race.race_uid, // 同时保留原始的race_uid
          title: race.title,
          logos: race.logos || [],
          startTime: race.startTime,
          endTime: race.endTime,
          duration: race.duration,
          status: race.status,
          tags: race.tags || [],
        };
      });

      // 按照开始时间排序，将最新的竞赛排在前面
      competitions.value.sort((a, b) => {
        // 将时间字符串转换为日期对象进行比较
        const dateA = new Date(a.startTime);
        const dateB = new Date(b.startTime);
        // 降序排列，最新的日期在前面
        return dateB.getTime() - dateA.getTime();
      });

      console.log('首页获取到竞赛数据:', competitions.value.slice(0, 4));
    } else {
      console.warn('获取到的竞赛数据格式不正确:', data);
    }
  } catch (error) {
    console.error('获取竞赛数据失败:', error);
  }
};

// 页面加载完成后执行
onMounted(async () => {
  // 启动轮播图自动切换
  startSlideshow();

  // 获取竞赛数据
  fetchCompetitions();

  // 获取最新题目数据
  await fetchLatestProblems();
});

// 在组件销毁前清除定时器
onBeforeUnmount(() => {
  stopSlideshow();
});

// 添加隐藏滚动条的全局样式
const addGlobalStyle = () => {
  const style = document.createElement('style');
  style.setAttribute('id', 'no-scrollbar-style');
  style.textContent = `
    html, body {
      overflow-x: hidden;
      scrollbar-width: none;
      -ms-overflow-style: none;
    }
    
    html::-webkit-scrollbar, body::-webkit-scrollbar {
      display: none;
    }
  `;
  document.head.appendChild(style);
};

// 删除全局样式
const removeGlobalStyle = () => {
  const style = document.getElementById('no-scrollbar-style');
  if (style) {
    document.head.removeChild(style);
  }
};

onMounted(() => {
  startSlideshow();

  // 添加隐藏滚动条的全局样式
  addGlobalStyle();

  // 添加页面滚动动画 - 优化动画参数
  const observerOptions = {
    threshold: 0.05, // 降低可见阈值，使元素更早触发动画
    rootMargin: '0px 0px -50px 0px', // 调整触发区域，提前触发
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('appear');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // 只监听热力图组件，不再监听竞赛卡片和侧边栏
  document.querySelectorAll('.heatmap-container').forEach((el) => {
    observer.observe(el);
  });

  // 预先添加热力图组件的出现类，避免滚动触发
  setTimeout(() => {
    document.querySelectorAll('.heatmap-container').forEach((el) => {
      el.classList.add('appear');
    });
  }, 100);

  // 页面平滑滚动设置
  document.documentElement.style.scrollBehavior = 'smooth';
});

onBeforeUnmount(() => {
  stopSlideshow();
  // 移除平滑滚动设置
  document.documentElement.style.scrollBehavior = '';
  // 移除隐藏滚动条的全局样式
  removeGlobalStyle();
});

const yourApiEndpoint = ref('https://your-ai-api.com/chat'); // 替换为你的实际API端点
</script>

<style scoped>
/* 全局滚动条样式，在组件级别设置global属性 */
:global(html),
:global(body) {
  overflow-x: hidden;
  scrollbar-width: none;
  /* Firefox */
  -ms-overflow-style: none;
  /* IE and Edge */
}

:global(html::-webkit-scrollbar),
:global(body::-webkit-scrollbar) {
  display: none;
}

/* 数字动画效果 */
:deep(.number-animate) {
  display: inline-block;
  position: relative;
  transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}

:deep(.number-animate.animate) {
  animation: numberBlur 0.8s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes numberBlur {
  0% {
    filter: blur(0px);
    opacity: 1;
    transform: scale(1);
  }

  50% {
    filter: blur(2px);
    opacity: 0.8;
    transform: scale(1.1);
  }

  100% {
    filter: blur(0px);
    opacity: 1;
    transform: scale(1);
  }
}

.home-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #f7f9fc;
  overflow-x: hidden;
  /* 隐藏水平滚动条 */
}

.main-content {
  margin-top: 64px;
  padding: 0px 0 0;
  /* 移除底部内边距 */
  animation: fadeIn 0.5s ease-out;
  overflow: hidden;
  /* 隐藏所有溢出 */
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

/* 轮播图样式 */
.banner-container {
  width: 100%;
  max-width: 1200px;
  margin: 20px auto;
  padding: 0 20px;
}

.banner-image {
  position: relative;
  width: 100%;
  height: 350px;
  border-radius: 16px;
  overflow: hidden;
  box-shadow:
    0 10px 35px rgba(66, 185, 131, 0.15),
    0 5px 25px rgba(41, 121, 255, 0.1);
  color: white;
  transform: translateZ(0);
  backface-visibility: hidden;
}

.banner-slide {
  position: absolute;
  width: 100%;
  height: 100%;
  opacity: 0;
  transition:
    opacity 1.5s cubic-bezier(0.215, 0.61, 0.355, 1),
    transform 1.5s cubic-bezier(0.215, 0.61, 0.355, 1);
  transform: scale(1.05);
  z-index: 1;
  will-change: opacity, transform;
}

.banner-slide.active {
  opacity: 1;
  transform: scale(1);
  z-index: 2;
}

.banner-placeholder {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  text-align: center;
  padding: 20px;
  background-size: 200% 200% !important;
  animation: gradientBG 15s ease infinite;
  position: relative;
}

@keyframes gradientBG {
  0% {
    background-position: 0% 50%;
  }

  50% {
    background-position: 100% 50%;
  }

  100% {
    background-position: 0% 50%;
  }
}

.banner-placeholder::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle at center, transparent 0%, rgba(0, 0, 0, 0.2) 100%);
  opacity: 0.7;
  z-index: 0;
}

.banner-content {
  max-width: 650px;
  padding: 20px;
  margin-top: -50px;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  z-index: 1;
}

.banner-placeholder h3 {
  font-size: 32px;
  margin-bottom: 16px;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.25);
  font-weight: 700;
  letter-spacing: 0.5px;
}

.banner-placeholder p {
  font-size: 20px;
  opacity: 0.9;
  margin-bottom: 30px;
  max-width: 580px;
  text-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
}

.banner-btn {
  background-color: white;
  color: #42b983;
  border: none;
  padding: 12px 30px;
  border-radius: 30px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.215, 0.61, 0.355, 1);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  margin-top: 5px;
  overflow: hidden;
  position: relative;
  z-index: 1;
}

.banner-btn::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, rgba(66, 185, 131, 0.1), rgba(0, 196, 255, 0.1));
  z-index: -1;
  transform: scaleX(0);
  transform-origin: right;
  transition: transform 0.5s cubic-bezier(0.215, 0.61, 0.355, 1);
}

.banner-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  background-color: #f8f8f8;
  color: #33a06f;
}

.banner-btn:hover::after {
  transform: scaleX(1);
  transform-origin: left;
}

.banner-controls {
  position: absolute;
  bottom: 15px;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 3;
}

.banner-dots {
  display: flex;
  gap: 12px;
  align-items: center;
  padding: 8px 16px;
  border-radius: 20px;
  backdrop-filter: blur(4px);
}

.dot {
  width: 20px;
  height: 4px;
  border-radius: 2px;
  background-color: rgba(255, 255, 255, 0.5);
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.215, 0.61, 0.355, 1);
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.15);
}

.dot:hover {
  background-color: rgba(255, 255, 255, 0.8);
}

.dot.active {
  width: 30px;
  height: 4px;
  border-radius: 2px;
  background-color: white;
  box-shadow: 0 0 8px rgba(255, 255, 255, 0.5);
}

/* 内容区样式 */
.content-wrapper {
  display: flex;
  max-width: 1200px;
  margin: 30px auto 0;
  padding: 0 20px;
  gap: 30px;
  flex-wrap: wrap;
}

/* 竞赛区域样式 */
.competitions-section {
  flex: 1;
  min-width: 300px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.title-with-icon {
  display: flex;
  align-items: center;
  gap: 10px;
}

.section-icon {
  width: 24px;
  height: 24px;
  color: #42b983;
  filter: drop-shadow(0 2px 4px rgba(66, 185, 131, 0.2));
}

.section-title {
  font-size: 20px;
  font-weight: 600;
  color: #333;
  margin: 0;
  position: relative;
}

.subtitle {
  color: #888;
  font-size: 14px;
  margin-left: 10px;
}

.more-link {
  color: #42b983;
  text-decoration: none;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 5px;
  transition: all 0.2s cubic-bezier(0.215, 0.61, 0.355, 1);
  padding: 5px 10px;
  border-radius: 4px;
}

.more-link:hover {
  color: #33a06f;
  transform: translateX(2px);
  background-color: rgba(66, 185, 131, 0.05);
}

.more-icon {
  font-style: normal;
  font-size: 18px;
  line-height: 1;
}

/* 竞赛列表样式 */
.competition-list {
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
  margin-top: 20px;
}

/* 热力图容器样式 */
.heatmap-container {
  opacity: 0;
  transform: translateY(15px);
  transition: all 0.25s ease;
  will-change: opacity, transform;
}

.heatmap-container.appear {
  opacity: 1;
  transform: translateY(0);
}

/* 侧边栏样式 */
.sidebar {
  width: 300px;
  flex-shrink: 0;
}

.welcome-icon::before {
  content: '👋';
}

.problem-icon::before {
  content: '📝';
}

.welcome-content p {
  color: #666;
  margin-top: 0;
  margin-bottom: 16px;
  line-height: 1.5;
}

.problem-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.problem-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #f0f0f0;
  transition: all 0.2s ease;
}

.problem-row:hover {
  background-color: rgba(66, 185, 131, 0.03);
  padding-left: 5px;
}

.problem-row:last-child {
  border-bottom: none;
}

.problem-title {
  color: #333;
  text-decoration: none;
  font-size: 14px;
  transition: color 0.2s ease;
  font-weight: 500;
}

.problem-title:hover {
  color: #42b983;
}

.problem-tag {
  padding: 2px 10px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  transition: all 0.2s ease;
}

.problem-tag:hover {
  transform: scale(1.05);
}

.problem-tag.entry {
  background-color: #e6f7f0;
  color: #42b983;
}

.problem-tag.easy {
  background-color: #fff8e6;
  color: #ffaa00;
}

.problem-tag.medium {
  background-color: #e6f1ff;
  color: #3399ff;
}

.problem-tag.hard {
  background-color: #ffe6e6;
  color: #ff6666;
}

.problem-tag.expert {
  background-color: #f2e6ff;
  color: #9966cc;
}

/* 保留侧边栏的动画延迟 */
.sidebar-section:nth-child(1) {
  transition-delay: 0.05s;
}

.sidebar-section:nth-child(2) {
  transition-delay: 0.1s;
}

.sidebar-section:nth-child(3) {
  transition-delay: 0.15s;
}

.sidebar-section:nth-child(4) {
  transition-delay: 0.2s;
}

.sidebar-section:nth-child(5) {
  transition-delay: 0.25s;
}

@media (max-width: 768px) {
  .content-wrapper {
    flex-direction: column;
  }

  .sidebar {
    width: 100%;
    margin-top: 30px;
  }
}

/* 侧边栏标题样式 */
.sidebar-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0 0 16px 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.problem-icon::before {
  content: '📝';
}

/* 链接列表样式 */
.link-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.sidebar-link {
  color: #666;
  text-decoration: none;
  font-size: 14px;
  transition: all 0.2s ease;
  display: flex;
  flex-direction: column;
  padding: 8px 10px;
  border-radius: 6px;
  border-left: 2px solid transparent;
}

.sidebar-link:hover {
  color: #42b983;
  background-color: #f5f5f5;
  border-left-color: #42b983;
  padding-left: 12px;
}

.link-title {
  font-weight: 500;
}

.link-desc {
  font-size: 12px;
  color: #888;
  margin-top: 4px;
}

/* 侧边栏部分 */
.sidebar-section {
  margin-bottom: 20px;
  transition: all 0.3s ease;
}

.sidebar-section.appear {
  animation: fadeUp 0.5s ease forwards;
}

@keyframes fadeUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 问题列表样式 */
.problem-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.problem-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #f0f0f0;
  transition: all 0.2s ease;
}

.problem-row:hover {
  background-color: rgba(66, 185, 131, 0.03);
  padding-left: 5px;
}

.problem-row:last-child {
  border-bottom: none;
}

.problem-title {
  color: #333;
  text-decoration: none;
  font-size: 14px;
  transition: color 0.2s ease;
  font-weight: 500;
}

.problem-title:hover {
  color: #42b983;
}

.problem-tag {
  padding: 2px 10px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  transition: all 0.2s ease;
}

.problem-tag:hover {
  transform: scale(1.05);
}

.problem-tag.entry {
  background-color: #e6f7f0;
  color: #42b983;
}

.problem-tag.easy {
  background-color: #fff8e6;
  color: #ffaa00;
}

.problem-tag.medium {
  background-color: #e6f1ff;
  color: #3399ff;
}

.problem-tag.hard {
  background-color: #ffe6e6;
  color: #ff6666;
}

.problem-tag.expert {
  background-color: #f2e6ff;
  color: #9966cc;
}
</style>
```
