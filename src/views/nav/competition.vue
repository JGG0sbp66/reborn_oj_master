<template>
  <headerheader />
  <div class="competition-page">
    <div class="container">
      <!-- 简化的标题栏设计，参照首页 -->
      <div class="title-container">
        <div class="title-section">
          <div class="trophy-icon">🏆</div>
          <h1 class="main-title">最新竞赛</h1>
          <span class="subtitle">竞赛系统</span>
        </div>
      </div>
      
      <!-- 将搜索和筛选部分移到单独的行 -->
      <div class="search-filter-container">
        <div class="search-input">
          <input type="text" placeholder="搜索竞赛..." v-model="searchQuery" />
        </div>
        
        <div class="filter-dropdowns">
          <!-- 自定义状态下拉框 -->
          <div class="custom-dropdown" ref="statusDropdown">
            <div class="dropdown-toggle" @click="toggleStatusDropdown">
              <span>{{ getStatusText }}</span>
              <div class="dropdown-arrow">▼</div>
            </div>
            <div class="dropdown-menu" :class="{ 'show': statusDropdownOpen }">
              <div class="dropdown-item" 
                   v-for="option in statusOptions" 
                   :key="option.value"
                   @click="selectStatus(option.value)"
                   :class="{ 'active': statusFilter === option.value }">
                {{ option.label }}
              </div>
            </div>
          </div>
          
          <!-- 自定义类型下拉框 -->
          <div class="custom-dropdown" ref="typeDropdown">
            <div class="dropdown-toggle" @click="toggleTypeDropdown">
              <span>{{ getTypeText }}</span>
              <div class="dropdown-arrow">▼</div>
            </div>
            <div class="dropdown-menu" :class="{ 'show': typeDropdownOpen }">
              <div class="dropdown-item" 
                   v-for="option in typeOptions" 
                   :key="option.value"
                   @click="selectType(option.value)"
                   :class="{ 'active': typeFilter === option.value }">
                {{ option.label }}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="competition-list">
        <!-- 竞赛卡片 -->
        <div 
          v-for="(competition, index) in filteredCompetitions" 
          :key="index"
          class="competition-card"
          :class="{ 'ended': competition.status === 'ended' }"
        >
          <div class="card-header" :class="getStatusClass(competition.status)">
            <h2 class="competition-title">{{ competition.title }}</h2>
            <div class="competition-logos">
              <div 
                v-for="(logo, i) in competition.logos" 
                :key="i" 
                class="logo-badge"
              >
                {{ logo }}
              </div>
            </div>
          </div>
          
          <div class="card-content">
            <div class="info-section">
              <div class="time-info">
                <div class="time-row">
                  <span class="time-label">开始时间:</span>
                  <span class="time-value">{{ competition.startTime }}</span>
                </div>
                <div class="time-row">
                  <span class="time-label">结束时间:</span>
                  <span class="time-value">{{ competition.endTime }}</span>
                </div>
                <div class="time-row">
                  <span class="time-label">比赛时长:</span>
                  <span class="time-value">{{ competition.duration }}</span>
                </div>
              </div>
              
              <div class="tags-section">
                <span 
                  v-for="(tag, i) in competition.tags" 
                  :key="i"
                  class="competition-tag"
                  :class="tag.type"
                >
                  {{ tag.name }}
                </span>
              </div>
            </div>
            
            <div class="action-section">
              <router-link to="/contest/problems" class="action-btn">
                <span>Let's go</span>
                <i class="btn-arrow">→</i>
              </router-link>
            </div>
          </div>
        </div>
        
        <!-- 分页控件 -->
        <div class="pagination">
          <button class="page-btn prev-btn" :disabled="currentPage === 1" @click="prevPage">
            <span class="chevron-left"></span>
          </button>
          <div class="page-numbers">
            <button 
              v-for="num in totalPages" 
              :key="num"
              class="page-number"
              :class="{ active: currentPage === num }"
              @click="goToPage(num)"
            >
              {{ num }}
            </button>
          </div>
          <button class="page-btn next-btn" :disabled="currentPage === totalPages" @click="nextPage">
            <span class="chevron-right"></span>
          </button>
        </div>
      </div>
    </div>
  </div>
  <foot class="page-footer" />
</template>


<script setup lang="ts">
import { ref, reactive, computed, onMounted, onBeforeUnmount } from "vue"
import showtitle from "@/components/test/showtitle.vue"
import headerheader from "@/components/headerheader.vue";
import foot from "@/components/foot.vue";
import axios from "axios";

// 搜索和筛选
const searchQuery = ref('');
const statusFilter = ref('all');
const typeFilter = ref('all');

// 下拉菜单状态
const statusDropdownOpen = ref(false);
const typeDropdownOpen = ref(false);
const statusDropdown = ref<HTMLElement | null>(null);
const typeDropdown = ref<HTMLElement | null>(null);

// 下拉菜单选项
const statusOptions = [
  { value: 'all', label: '全部状态' },
  { value: 'upcoming', label: '未开始' },
  { value: 'ongoing', label: '进行中' },
  { value: 'ended', label: '已结束' }
];

const typeOptions = [
  { value: 'all', label: '全部类型' },
  { value: 'individual', label: '个人赛' },
  { value: 'team', label: '团队赛' },
  { value: 'regional', label: '官方比赛' }
];

// 下拉菜单文本显示
const getStatusText = computed(() => {
  const option = statusOptions.find(option => option.value === statusFilter.value);
  return option ? option.label : '全部状态';
});

const getTypeText = computed(() => {
  const option = typeOptions.find(option => option.value === typeFilter.value);
  return option ? option.label : '全部类型';
});

// 切换下拉菜单显示/隐藏
const toggleStatusDropdown = () => {
  statusDropdownOpen.value = !statusDropdownOpen.value;
  if (statusDropdownOpen.value) {
    typeDropdownOpen.value = false;
  }
};

const toggleTypeDropdown = () => {
  typeDropdownOpen.value = !typeDropdownOpen.value;
  if (typeDropdownOpen.value) {
    statusDropdownOpen.value = false;
  }
};

// 选择下拉菜单选项
const selectStatus = (value: string) => {
  statusFilter.value = value;
  statusDropdownOpen.value = false;
};

const selectType = (value: string) => {
  typeFilter.value = value;
  typeDropdownOpen.value = false;
};

// 点击外部关闭下拉菜单
const handleClickOutside = (event: MouseEvent) => {
  if (statusDropdown.value && !statusDropdown.value.contains(event.target as Node)) {
    statusDropdownOpen.value = false;
  }
  if (typeDropdown.value && !typeDropdown.value.contains(event.target as Node)) {
    typeDropdownOpen.value = false;
  }
};

// 监听点击事件
onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside);
});

// 分页
const currentPage = ref(1);
const pageSize = ref(5);
const totalPages = ref(4);

// 竞赛数据
const competitionData = ref([
  {
    title: "全国高校编程马拉松",
    logos: ["ACM", "ICPC", "CCF"],
    startTime: "2024-04-10 09:00:00",
    endTime: "2024-04-10 13:00:00",
    duration: "04 小时 00 分 00 秒",
    status: "upcoming",
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
    status: "upcoming",
    tags: [
      { name: "未开始", type: "running" },
      { name: "个人赛", type: "individual" },
      { name: "OI赛制", type: "oi" },
      { name: "官方比赛", type: "regional" }
    ]
  },
  {
    title: "第六届多校新生程序设计邀请赛",
    logos: ["ACM", "ICPC", "CCF"],
    startTime: "2024-12-21 12:00:00",
    endTime: "2024-12-21 16:00:00",
    duration: "04 小时 00 分 00 秒",
    status: "ended",
    tags: [
      { name: "已结束", type: "ended" },
      { name: "个人赛", type: "individual" },
      { name: "OI赛制", type: "oi" },
      { name: "官方比赛", type: "regional" }
    ]
  },
  {
    title: "2024年春季程序设计挑战赛",
    logos: ["ACM", "ICPC", "CCF"],
    startTime: "2024-03-15 10:00:00",
    endTime: "2024-03-15 15:00:00",
    duration: "05 小时 00 分 00 秒",
    status: "ended",
    tags: [
      { name: "已结束", type: "ended" },
      { name: "团队赛", type: "team" },
      { name: "ACM赛制", type: "acm" },
      { name: "官方比赛", type: "regional" }
    ]
  }
]);

// 获取竞赛状态对应的类名
const getStatusClass = (status: string) => {
  switch(status) {
    case 'upcoming':
      return 'status-upcoming';
    case 'ongoing':
      return 'status-ongoing';
    case 'ended':
      return 'status-ended';
    default:
      return '';
  }
};

// 过滤后的竞赛列表
const filteredCompetitions = computed(() => {
  let results = competitionData.value;
  
  // 搜索过滤
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    results = results.filter(comp => 
      comp.title.toLowerCase().includes(query)
    );
  }
  
  // 状态过滤
  if (statusFilter.value !== 'all') {
    results = results.filter(comp => 
      comp.status === statusFilter.value
    );
  }
  
  // 类型过滤
  if (typeFilter.value !== 'all') {
    results = results.filter(comp => 
      comp.tags.some(tag => tag.type === typeFilter.value)
    );
  }
  
  return results;
});

// 分页控制方法
const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
};

const goToPage = (page: number) => {
  currentPage.value = page;
};

// 从服务器获取竞赛数据
const fetchCompetitions = async () => {
  try {
    // 这里应该替换为实际的API端点
    const response = await axios.get('http://localhost:5000/api/competitions', {
      params: {
        page: currentPage.value,
        limit: pageSize.value
      }
    });
    
    // 假设服务器返回了结构化数据，包括总页数和当前页的竞赛
    // competitionData.value = response.data.competitions;
    // totalPages.value = response.data.totalPages;
    
    // 由于现在是模拟数据，这里不做实际赋值
  } catch (error) {
    console.error('获取竞赛数据失败:', error);
  }
};

// 组件挂载后获取数据
onMounted(() => {
  // 实际项目中取消注释下面这行
  // fetchCompetitions();
});
</script>


<style scoped>
.competition-page {
  padding: 64px 0 0;
  min-height: 100vh;
  background-color: #f7f9fc;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

/* 简化的标题栏样式，参照首页 */
.title-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  margin-top: 30px;
}

.title-section {
  display: flex;
  align-items: center;
  gap: 8px;
}

.trophy-icon {
  font-size: 28px;
  color: #ffaa00;
}

.main-title {
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.subtitle {
  color: #888;
  font-size: 14px;
  margin-left: 10px;
}

/* 新的搜索和筛选容器样式 */
.search-filter-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 16px;
  background-color: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  padding: 16px 20px;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.05);
  transition: all 0.4s ease;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.search-filter-container:hover {
  box-shadow: 0 12px 36px rgba(0, 0, 0, 0.08);
}

.search-input {
  position: relative;
  width: 180px;
  transition: all 0.5s cubic-bezier(0.25, 1, 0.5, 1);
}

.search-input:focus-within {
  width: 300px;
}

.search-input input {
  width: 100%;
  padding: 8px 16px;
  border-radius: 40px;
  border: 1px solid transparent;
  background-color: #f4f6f8;
  font-size: 14px;
  outline: none;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  color: #333;
  overflow: hidden;
  position: relative;
  z-index: 1;
}

.search-input::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 40px;
  background: linear-gradient(120deg, #e6e8ea, #f0f3f6);
  z-index: 0;
  transition: opacity 0.3s ease;
  opacity: 1;
}

.search-input:hover::before {
  background: linear-gradient(120deg, #e9f7f2, #e0f5eb);
  opacity: 1;
}

.search-input:focus-within::before {
  background: linear-gradient(120deg, #e0f5eb, #d6f2e6);
  opacity: 1;
}

.search-input input:focus {
  border-color: rgba(66, 185, 131, 0.6);
  box-shadow: 0 0 0 2px rgba(66, 185, 131, 0.1);
}

/* 确保输入框覆盖在渐变层之上 */
.search-input {
  display: flex;
  align-items: center;
  border-radius: 40px;
}

.search-input input {
  background-color: transparent;
}

.filter-dropdowns {
  display: flex;
  gap: 12px;
}

/* 自定义下拉框样式 */
.custom-dropdown {
  position: relative;
  width: 160px;
  user-select: none;
}

.dropdown-toggle {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 14px;
  background-color: #fff;
  border: 1px solid #e0e7ee;
  border-radius: 40px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 14px;
  color: #333;
}

.dropdown-toggle:hover {
  border-color: #42b983;
}

.dropdown-arrow {
  font-size: 10px;
  color: #888;
  margin-left: 6px;
  transition: transform 0.2s ease;
}

.dropdown-menu {
  position: absolute;
  top: calc(100% + 5px);
  left: 0;
  width: 100%;
  background-color: #fff;
  border-radius: 8px;
  border: 1px solid #e0e7ee;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  max-height: 0;
  overflow: hidden;
  opacity: 0;
  z-index: 100;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  transform-origin: top center;
  transform: translateY(-8px) scale(0.98);
}

.dropdown-menu.show {
  max-height: 200px;
  opacity: 1;
  transform: translateY(0) scale(1);
}

.dropdown-item {
  padding: 10px 14px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 14px;
  color: #555;
}

.dropdown-item:hover {
  background-color: #f5faf8;
}

.dropdown-item.active {
  background-color: #edf7f2;
  color: #42b983;
  font-weight: 500;
}

.competition-list {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.competition-card {
  background-color: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  transition: all 0.3s cubic-bezier(0.25, 1, 0.5, 1);
  border: 1px solid rgba(235, 240, 245, 0.8);
  animation: fadeInUp 0.4s ease-out;
}

.competition-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.08);
  border-color: rgba(66, 185, 131, 0.15);
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(15px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.card-header {
  padding: 20px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  background: linear-gradient(to right, #f9fafb, #f5f7fa);
  flex-wrap: wrap;
  gap: 16px;
}

.competition-title {
  font-size: 20px;
  font-weight: 600;
  color: #333;
  margin: 0;
  position: relative;
  padding-left: 12px;
  max-width: 600px;
}

.competition-title::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 4px;
  height: 100%;
  border-radius: 2px;
}

.status-upcoming .competition-title::before {
  background: linear-gradient(to bottom, #42b983, #33c6aa);
}

.status-ongoing .competition-title::before {
  background: linear-gradient(to bottom, #3399ff, #2a89f3);
}

.status-ended .competition-title::before {
  background: linear-gradient(to bottom, #bbbbbb, #999999);
}

.competition-logos {
  display: flex;
  gap: 8px;
}

.logo-badge {
  height: 28px;
  min-width: 50px;
  background-color: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  font-weight: bold;
  font-size: 12px;
  color: #666;
  padding: 0 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.competition-card:hover .logo-badge {
  background-color: #e8f5f0;
  color: #42b983;
  transform: translateY(-2px);
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1);
}

.card-content {
  padding: 24px;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 24px;
}

.info-section {
  display: flex;
  flex-direction: column;
  gap: 20px;
  flex: 1;
  min-width: 280px;
}

.time-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.time-row {
  display: flex;
  font-size: 14px;
}

.time-label {
  color: #666;
  width: 80px;
  flex-shrink: 0;
}

.time-value {
  color: #333;
  font-weight: 500;
}

.tags-section {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.competition-tag {
  padding: 4px 14px;
  border-radius: 16px;
  font-size: 12px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.competition-tag:hover {
  transform: translateY(-2px);
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.08);
}

.competition-tag.running {
  background-color: #e6f7f0;
  color: #42b983;
}

.competition-tag.ended {
  background-color: #f0f0f0;
  color: #888888;
}

.competition-tag.individual {
  background-color: #e6f1ff;
  color: #3399ff;
}

.competition-tag.team {
  background-color: #fff0e6;
  color: #ff9933;
}

.competition-tag.oi {
  background-color: #fff8e6;
  color: #ffaa00;
}

.competition-tag.acm {
  background-color: #e6fffa;
  color: #00c4b6;
}

.competition-tag.regional {
  background-color: #f2e6ff;
  color: #9966cc;
}

.action-section {
  display: flex;
  align-items: flex-end;
}

.action-btn {
  background: linear-gradient(135deg, #42b983, #33c6aa);
  color: white;
  border: none;
  padding: 12px 28px;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.215, 0.61, 0.355, 1);
  box-shadow: 0 6px 15px rgba(66, 185, 131, 0.25);
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 8px;
  position: relative;
  overflow: hidden;
}

.action-btn::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, #33c6aa, #42b983);
  z-index: 0;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.action-btn span {
  position: relative;
  z-index: 1;
}

.btn-arrow {
  position: relative;
  z-index: 1;
  font-style: normal;
  transition: transform 0.3s ease;
}

.action-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 25px rgba(66, 185, 131, 0.3);
}

.action-btn:hover .btn-arrow {
  transform: translateX(4px);
}

.action-btn:hover::after {
  opacity: 1;
}

.ended .card-header {
  background: linear-gradient(to right, #f9f9f9, #f2f2f2);
}

.ended .action-btn {
  background: linear-gradient(135deg, #a3a3a3, #888888);
  box-shadow: 0 6px 15px rgba(100, 100, 100, 0.2);
}

.ended .action-btn::after {
  background: linear-gradient(90deg, #888888, #a3a3a3);
}

.ended .competition-title {
  color: #777;
}

/* 分页样式 */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
  margin-bottom: 30px;
  gap: 12px;
}

.page-numbers {
  display: flex;
  gap: 8px;
}

.page-number {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  border: 1px solid #eaecf0;
  background-color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.25, 1, 0.5, 1);
  font-size: 14px;
  color: #666;
  position: relative;
  overflow: hidden;
}

.page-number::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(120deg, #e9f7f2, #d6f2e6);
  opacity: 0;
  transition: opacity 0.4s ease;
  z-index: 0;
}

.page-number:hover::before {
  opacity: 1;
}

.page-number:hover {
  border-color: #42b983;
  color: #42b983;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(66, 185, 131, 0.15);
}

.page-number span,
.page-number i {
  position: relative;
  z-index: 1;
}

.page-number.active {
  background-color: #42b983;
  color: white;
  border-color: #42b983;
  box-shadow: 0 4px 12px rgba(66, 185, 131, 0.3);
  transform: translateY(-2px) scale(1.05);
}

.page-btn {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  border: 1px solid #eaecf0;
  background-color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.25, 1, 0.5, 1);
  color: #666;
  position: relative;
  overflow: hidden;
}

.page-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(120deg, #e9f7f2, #d6f2e6);
  opacity: 0;
  transition: opacity 0.4s ease;
  z-index: 0;
}

.page-arrow {
  position: relative;
  z-index: 1;
  font-style: normal;
  transition: transform 0.3s ease;
  font-weight: 600;
  font-size: 16px;
}

.chevron-left, .chevron-right {
  position: relative;
  z-index: 1;
  display: inline-block;
  width: 8px;
  height: 8px;
  border-style: solid;
  border-width: 2px 2px 0 0;
  transition: transform 0.3s ease;
  top: -1px;
}

.chevron-left {
  transform: rotate(-135deg);
  margin-left: 3px;
}

.chevron-right {
  transform: rotate(45deg);
  margin-right: 3px;
}

.prev-btn:hover .chevron-left {
  transform: rotate(-135deg) translateX(-3px);
}

.next-btn:hover .chevron-right {
  transform: rotate(45deg) translateX(3px);
}

.page-btn:hover:not(:disabled)::before {
  opacity: 1;
}

.page-btn:hover:not(:disabled) {
  border-color: #42b983;
  color: #42b983;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(66, 185, 131, 0.15);
}

.page-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

/* 添加一个连接元素 */
.pagination::after {
  content: '';
  position: absolute;
  bottom: -15px;
  left: 50%;
  transform: translateX(-50%);
  width: 100px;
  height: 3px;
  background: linear-gradient(90deg, transparent, rgba(66, 185, 131, 0.3), transparent);
  border-radius: 3px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .search-filter-container {
    flex-direction: column;
    align-items: stretch;
  }
  
  .search-input {
    width: 100%;
  }
  
  .filter-dropdowns {
    width: 100%;
    justify-content: space-between;
  }
  
  .custom-dropdown {
    flex: 1;
    min-width: 0;
    width: auto;
  }
}
</style>

