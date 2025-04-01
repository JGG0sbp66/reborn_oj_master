<template>
  <div class="home-container">
    <headerheader />
    
    <div class="main-content">
      <!-- 轮播图部分 -->
      <div class="banner-container">
        <div class="banner-image">
          <div v-for="(slide, index) in bannerSlides" 
               :key="index" 
               class="banner-slide" 
               :class="{ active: currentSlide === index }">
            <div class="banner-placeholder" :style="{ background: slide.gradient }">
              <div class="banner-content">
                <h3 class="fade-in-up" :style="{ animationDelay: '0.1s' }">{{ slide.title }}</h3>
                <p class="fade-in-up" :style="{ animationDelay: '0.3s' }">{{ slide.subtitle }}</p>
                <button class="banner-btn fade-in-up" :style="{ animationDelay: '0.5s' }">立即探索</button>
              </div>
            </div>
          </div>
          <div class="banner-controls">
            <div class="banner-nav prev" @click="prevSlide">
              <i class="nav-arrow left"></i>
            </div>
            <div class="banner-dots">
              <span v-for="(slide, index) in bannerSlides" 
                    :key="index" 
                    class="dot" 
                    :class="{ active: currentSlide === index }"
                    @click="setSlide(index)"></span>
            </div>
            <div class="banner-nav next" @click="nextSlide">
              <i class="nav-arrow right"></i>
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
              <el-icon class="section-icon"><Trophy /></el-icon>
              <h2 class="section-title">最新竞赛</h2>
              <span class="subtitle">竞赛系统</span>
            </div>
            <router-link to="/nav/competition" class="more-link">更多比赛 <i class="more-icon">›</i></router-link>
          </div>

          <!-- 竞赛列表 -->
          <div class="competition-list">
            <!-- 竞赛项目1 -->
            <div class="competition-item" v-for="(item, index) in competitions" :key="index">
              <div class="competition-header">{{ item.title }}</div>
              <div class="competition-logos">
                <div class="logo-placeholder" v-for="(logo, i) in item.logos" :key="i">{{ logo }}</div>
              </div>
              <div class="competition-info">
                <div class="time-info">
                  <p>开始时间: {{ item.startTime }}</p>
                  <p>结束时间: {{ item.endTime }}</p>
                  <p>比赛时长: {{ item.duration }}</p>
                </div>
                <div class="action">
                  <router-link to="/contest/problems">
                    <button class="lets-go-btn">Let's go</button>
                  </router-link>
                </div>
              </div>
              <div class="competition-tags">
                <span v-for="(tag, i) in item.tags" :key="i" class="tag" :class="tag.type">{{ tag.name }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 侧边栏 -->
        <div class="sidebar">
          <!-- 欢迎部分 -->
          <div class="welcome-section sidebar-section">
            <h3 class="sidebar-title"><i class="welcome-icon"></i> 欢迎来到 OJ Master</h3>
            <div class="welcome-content">
              <p>开始你的编程之旅，提升算法能力！</p>
              <div class="welcome-stats">
                <div class="stat-item">
                  <div class="stat-value">24,680</div>
                  <div class="stat-label">题目总数</div>
                </div>
                <div class="stat-item">
                  <div class="stat-value">1,243</div>
                  <div class="stat-label">活跃用户</div>
                </div>
                <div class="stat-item">
                  <div class="stat-value">89</div>
                  <div class="stat-label">近期比赛</div>
                </div>
              </div>
            </div>
          </div>

          <!-- 推荐题库 -->
          <div class="sidebar-section">
            <h3 class="sidebar-title">推荐题库</h3>
            <div class="tag-list">
              <a href="#" class="sidebar-tag">LibreOJ</a>
              <a href="#" class="sidebar-tag">Vijos</a>
              <a href="#" class="sidebar-tag">Luogu</a>
              <a href="#" class="sidebar-tag">CodeForces</a>
              <a href="#" class="sidebar-tag">AtCoder</a>
            </div>
          </div>

          <!-- 最新题目 -->
          <div class="sidebar-section">
            <h3 class="sidebar-title"><i class="problem-icon"></i> 最新题目</h3>
            <div class="problem-list">
              <div class="problem-row" v-for="(problem, index) in latestProblems" :key="index">
                <a href="#" class="problem-title">{{ problem.title }}</a>
                <span class="problem-tag" :class="problem.difficulty">{{ problem.level }}</span>
              </div>
            </div>
          </div>

          <!-- 开源项目 -->
          <div class="sidebar-section">
            <h3 class="sidebar-title">开源项目</h3>
            <div class="link-list">
              <a href="#" class="sidebar-link">
                <span class="link-title">CYaRon 测试数据生成器</span>
                <span class="link-desc">自动生成高质量的测试数据</span>
              </a>
              <a href="#" class="sidebar-link">
                <span class="link-title">Markdown+Palettes</span>
                <span class="link-desc">增强的Markdown编辑器</span>
              </a>
            </div>
          </div>

          <!-- 在线服务 -->
          <div class="sidebar-section">
            <h3 class="sidebar-title">在线服务</h3>
            <div class="link-list">
              <a href="#" class="sidebar-link">
                <span class="link-title">深入浅出算法设计竞赛</span>
              </a>
              <a href="#" class="sidebar-link">
                <span class="link-title">算法竞赛学习</span>
              </a>
              <a href="#" class="sidebar-link">
                <span class="link-title">学校模拟训练辅助工具</span>
              </a>
              <a href="#" class="sidebar-link">
                <span class="link-title">协办企业院校在线编程比赛</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onBeforeUnmount } from "vue";
import headerheader from "@/components/headerheader.vue";
import ActivityHeatmap from "@/components/ActivityHeatmap.vue";
import { Trophy } from '@element-plus/icons-vue';

// 轮播图数据
const bannerSlides = [
  {
    title: "欢迎使用 OJ Master 在线评测系统",
    subtitle: "挑战算法，提升编程能力",
    gradient: "linear-gradient(135deg, #42b983, #2979ff)"
  },
  {
    title: "参加在线编程竞赛",
    subtitle: "与其他程序员一较高下",
    gradient: "linear-gradient(135deg, #00c6ff, #0072ff)"
  },
  {
    title: "丰富的题库资源",
    subtitle: "从基础到高级的编程挑战",
    gradient: "linear-gradient(135deg, #11998e, #38ef7d)"
  }
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
const competitions = [
  {
    title: "全国高校编程马拉松",
    logos: ["ACM", "ICPC", "CCF"],
    startTime: "2024-04-10 09:00:00",
    endTime: "2024-04-10 13:00:00",
    duration: "04 小时 00 分 00 秒",
    tags: [
      { name: "未开始", type: "running" },
      { name: "个人赛", type: "individual" },
      { name: "OI赛制", type: "oi" }
    ]
  },
  {
    title: "第五届全国青少年编程大赛",
    logos: ["ACM", "ICPC", "CCF"],
    startTime: "2024-08-16 08:00:00",
    endTime: "2024-08-16 12:00:00",
    duration: "04 小时 00 分 00 秒",
    tags: [
      { name: "未开始", type: "running" },
      { name: "个人赛", type: "individual" },
      { name: "OI赛制", type: "oi" },
      { name: "官方比赛", type: "regional" }
    ]
  }
];

// 最新题目
const latestProblems = [
  { title: "简单的数学问题", level: "入门", difficulty: "entry" },
  { title: "字符串反转", level: "基础", difficulty: "easy" },
  { title: "二叉树遍历", level: "提高", difficulty: "medium" },
  { title: "动态规划基础", level: "进阶", difficulty: "hard" },
  { title: "图论算法与最短路径", level: "竞赛", difficulty: "expert" }
];

onMounted(() => {
  startSlideshow();
  
  // 添加页面滚动动画
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('appear');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);
  
  // 监听所有需要动画的元素
  document.querySelectorAll('.competition-item, .sidebar-section').forEach(el => {
    observer.observe(el);
  });
});

onBeforeUnmount(() => {
  stopSlideshow();
});
</script>

<style scoped>
.home-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #f7f9fc;
}

.main-content {
  margin-top: 64px;
  padding: 0px 0 40px;
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
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
  color: white;
}

.banner-slide {
  position: absolute;
  width: 100%;
  height: 100%;
  opacity: 0;
  transition: opacity 1.2s ease, transform 1.2s ease;
  transform: scale(1.05);
  z-index: 1;
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
}

.banner-content {
  max-width: 650px;
  padding: 20px;
}

.banner-placeholder h3 {
  font-size: 32px;
  margin-bottom: 16px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  font-weight: 700;
}

.banner-placeholder p {
  font-size: 20px;
  opacity: 0.9;
  margin-bottom: 30px;
}

.banner-btn {
  background-color: white;
  color: #42b983;
  border: none;
  padding: 12px 28px;
  border-radius: 30px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.banner-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  background-color: #f8f8f8;
}

.banner-controls {
  position: absolute;
  bottom: 30px;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  z-index: 3;
}

.banner-nav {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.2s ease;
}

.banner-nav:hover {
  background-color: rgba(255, 255, 255, 0.3);
  transform: scale(1.1);
}

.nav-arrow {
  display: inline-block;
  width: 10px;
  height: 10px;
  border-top: 2px solid white;
  border-right: 2px solid white;
}

.nav-arrow.left {
  transform: rotate(-135deg);
}

.nav-arrow.right {
  transform: rotate(45deg);
}

.banner-dots {
  display: flex;
  gap: 12px;
  align-items: center;
}

.dot {
  width: 20px;
  height: 4px;
  border-radius: 2px;
  background-color: rgba(255, 255, 255, 0.5);
  cursor: pointer;
  transition: all 0.3s ease;
}

.dot:hover {
  background-color: rgba(255, 255, 255, 0.8);
}

.dot.active {
  width: 30px;
  height: 4px;
  border-radius: 2px;
  background-color: white;
}

/* 内容区样式 */
.content-wrapper {
  display: flex;
  max-width: 1200px;
  margin: 30px auto 0;
  padding: 0 20px;
  gap: 30px;
}

/* 竞赛区域样式 */
.competitions-section {
  flex: 1;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
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
}

.section-title {
  font-size: 20px;
  font-weight: 600;
  color: #333;
  margin: 0;
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
  transition: all 0.2s ease;
}

.more-link:hover {
  color: #33a06f;
  transform: translateX(2px);
}

.more-icon {
  font-style: normal;
  font-size: 18px;
  line-height: 1;
}

/* 竞赛项目样式 */
.competition-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.competition-item {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  border: 1px solid #eee;
  transition: all 0.3s ease;
  opacity: 0;
  transform: translateY(20px);
}

.competition-item:hover {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px) !important;
}

.competition-item.appear {
  opacity: 1;
  transform: translateY(0);
}

.competition-header {
  background-color: #f8f9fa;
  padding: 14px 20px;
  color: #333;
  font-weight: 600;
  border-bottom: 1px solid #eee;
}

.competition-logos {
  display: flex;
  gap: 15px;
  padding: 15px 20px;
}

.logo-placeholder {
  height: 40px;
  width: 80px;
  background-color: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  font-weight: bold;
  color: #666;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.competition-info {
  display: flex;
  justify-content: space-between;
  padding: 14px 20px;
  border-bottom: 1px solid #eee;
}

.time-info p {
  margin: 4px 0;
  color: #666;
}

.lets-go-btn {
  background: linear-gradient(90deg, #42b983, #33c6aa);
  color: white;
  border: none;
  padding: 10px 24px;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(66, 185, 131, 0.3);
  width: 100%;
}

.lets-go-btn:hover {
  box-shadow: 0 6px 16px rgba(66, 185, 131, 0.4);
  transform: translateY(-2px);
}

.competition-tags {
  display: flex;
  gap: 10px;
  padding: 12px 20px;
}

.tag {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
}

.tag.running {
  background-color: #e6f7f0;
  color: #42b983;
}

.tag.individual {
  background-color: #e6f1ff;
  color: #3399ff;
}

.tag.oi {
  background-color: #fff8e6;
  color: #ffaa00;
}

.tag.regional {
  background-color: #f2e6ff;
  color: #9966cc;
}

/* 侧边栏样式 */
.sidebar {
  width: 300px;
  flex-shrink: 0;
}

.sidebar-section {
  background: white;
  border-radius: 12px;
  padding: 18px 20px;
  margin-bottom: 24px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  opacity: 0;
  transform: translateY(20px);
}

.sidebar-section.appear {
  opacity: 1;
  transform: translateY(0);
}

.sidebar-section:hover {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
}

.sidebar-title {
  font-size: 16px;
  margin-top: 0;
  margin-bottom: 14px;
  color: #333;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 6px;
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
}

.welcome-stats {
  display: flex;
  justify-content: space-between;
  margin-top: 16px;
}

.stat-item {
  text-align: center;
}

.stat-value {
  font-size: 18px;
  font-weight: 600;
  color: #42b983;
}

.stat-label {
  font-size: 12px;
  color: #888;
  margin-top: 4px;
}

.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.sidebar-tag {
  padding: 6px 14px;
  background-color: #f0f0f0;
  border-radius: 20px;
  color: #666;
  text-decoration: none;
  font-size: 13px;
  transition: all 0.2s ease;
}

.sidebar-tag:hover {
  background-color: #e0e0e0;
  color: #42b983;
  transform: translateY(-2px);
}

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
}

.sidebar-link:hover {
  color: #42b983;
  background-color: #f5f5f5;
}

.link-title {
  font-weight: 500;
}

.link-desc {
  font-size: 12px;
  color: #888;
  margin-top: 4px;
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

/* 动画 */
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

.fade-in-up {
  animation: fadeInUp 0.8s ease forwards;
  opacity: 0;
  transform: translateY(20px);
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.competition-item:nth-child(1) {
  transition-delay: 0.1s;
}

.competition-item:nth-child(2) {
  transition-delay: 0.2s;
}

.sidebar-section:nth-child(1) {
  transition-delay: 0.1s;
}

.sidebar-section:nth-child(2) {
  transition-delay: 0.2s;
}

.sidebar-section:nth-child(3) {
  transition-delay: 0.3s;
}

.sidebar-section:nth-child(4) {
  transition-delay: 0.4s;
}

.sidebar-section:nth-child(5) {
  transition-delay: 0.5s;
}
</style>