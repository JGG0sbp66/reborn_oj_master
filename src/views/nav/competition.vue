<template>
  <AppHeader />
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
        <div class="filter-container">
          <!-- 自定义状态下拉框 -->
          <div ref="statusDropdownWrapper" class="filter-wrapper">
            <span
              class="filter-button"
              :class="{ 'active-filter': statusFilter !== 'all' }"
              tabindex="0"
              @click="toggleStatusDropdown"
            >
              {{ getStatusText }}
              <svg
                class="filter-arrow"
                :class="{ rotated: statusDropdownOpen }"
                viewBox="0 0 24 24"
              >
                <path
                  d="M6 15l6-6l6 6"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                ></path>
              </svg>
            </span>
          </div>

          <!-- 自定义类型下拉框 -->
          <div ref="typeDropdownWrapper" class="filter-wrapper">
            <span
              class="filter-button"
              :class="{ 'active-filter': typeFilter !== 'all' }"
              tabindex="0"
              @click="toggleTypeDropdown"
            >
              {{ getTypeText }}
              <svg class="filter-arrow" :class="{ rotated: typeDropdownOpen }" viewBox="0 0 24 24">
                <path
                  d="M6 15l6-6l6 6"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                ></path>
              </svg>
            </span>
          </div>
        </div>

        <!-- 搜索框 -->
        <div class="search-container">
          <svg class="search-icon" viewBox="0 0 1024 1024">
            <path
              d="M909.6 854.5L649.9 594.8C690.2 542.7 712 479 712 412c0-80.2-31.3-155.4-87.9-212.1c-56.6-56.7-132-87.9-212.1-87.9s-155.5 31.3-212.1 87.9C143.2 256.5 112 331.8 112 412c0 80.1 31.3 155.5 87.9 212.1C256.5 680.8 331.8 712 412 712c67 0 130.6-21.8 182.7-62l259.7 259.6a8.2 8.2 0 0 0 11.6 0l43.6-43.5a8.2 8.2 0 0 0 0-11.6zM570.4 570.4C528 612.7 471.8 636 412 636s-116-23.3-158.4-65.6C211.3 528 188 471.8 188 412s23.3-116.1 65.6-158.4C296 211.3 352.2 188 412 188s116.1 23.2 158.4 65.6S636 352.2 636 412s-23.3 116.1-65.6 158.4z"
              fill="currentColor"
            ></path>
          </svg>
          <input
            v-model="searchQuery"
            class="search-input"
            type="search"
            placeholder="搜索竞赛..."
          />
        </div>
      </div>

      <div class="competition-list">
        <!-- 竞赛卡片 -->
        <div
          v-for="(competition, index) in paginatedCompetitions"
          :key="index"
          class="competition-card"
          :class="{
            ended: competition.status === 'ended',
            upcoming: competition.status === 'upcoming',
          }"
        >
          <div class="card-header" :class="getStatusClass(competition.status)">
            <h2 class="competition-title">{{ competition.title }}</h2>
            <div class="competition-logos">
              <div v-for="(logo, i) in competition.logos" :key="i" class="logo-badge">
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
                  :style="getTagStyle(tag)"
                >
                  {{ tag.name }}
                </span>
              </div>
            </div>

            <div class="action-section">
              <router-link
                :to="`/contest/problems?uid=${competition.race_uid}`"
                class="action-btn"
                target="_blank"
              >
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
          <button
            class="page-btn next-btn"
            :disabled="currentPage === totalPages"
            @click="nextPage"
          >
            <span class="chevron-right"></span>
          </button>
        </div>
      </div>
    </div>
  </div>
  <foot class="page-footer" />

  <!-- 将下拉菜单放在页面最顶层 -->
  <!-- 状态下拉菜单 -->
  <div v-if="statusDropdownOpen" class="dropdown-menu" :style="statusDropdownStyle">
    <div class="dropdown-arrow"></div>
    <div class="dropdown-content">
      <div
        v-for="option in statusOptions"
        :key="option.value"
        class="dropdown-item"
        :class="{ active: statusFilter === option.value }"
        @click="selectStatus(option.value)"
      >
        <span>{{ option.label }}</span>
      </div>
    </div>
  </div>

  <!-- 类型下拉菜单 -->
  <div v-if="typeDropdownOpen" class="dropdown-menu" :style="typeDropdownStyle">
    <div class="dropdown-arrow"></div>
    <div class="dropdown-content">
      <div
        v-for="option in typeOptions"
        :key="option.value"
        class="dropdown-item"
        :class="{ active: typeFilter === option.value }"
        @click="selectType(option.value)"
      >
        <span>{{ option.label }}</span>
      </div>
    </div>
  </div>
  <AIAgent title="「黄金判官·葛孚雷」" button-color="#3b82f6" />
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, onBeforeUnmount, watch } from 'vue';
import type { CSSProperties } from 'vue';
import showtitle from '@/components/test/showtitle.vue';
import AppHeader from '@/components/AppHeader.vue';
import foot from '@/components/foot.vue';
import { raceApi } from '@/api';
import AIAgent from '@/components/AI-Agent.vue';

// 定义类型
interface Tag {
  name: string;
  type: string;
}

interface Competition {
  uid: number; // 保留uid字段来兼容内部使用
  race_uid?: number; // 可选字段，保留原始race_uid
  title: string;
  logos: string[];
  startTime: string;
  endTime: string;
  duration: string;
  status: string;
  tags: Tag[];
}

// 搜索和筛选
const searchQuery = ref('');
const statusFilter = ref('all');
const typeFilter = ref('all');

// 下拉菜单状态
const statusDropdownOpen = ref(false);
const typeDropdownOpen = ref(false);
const statusDropdownWrapper = ref<HTMLElement | null>(null);
const typeDropdownWrapper = ref<HTMLElement | null>(null);

// 下拉菜单选项
const statusOptions = [
  { value: 'all', label: '全部状态' },
  { value: 'upcoming', label: '报名中' },
  { value: 'running', label: '进行中' },
  { value: 'ended', label: '已结束' },
];

const typeOptions = [
  { value: 'all', label: '全部类型' },
  { value: 'individual', label: '个人赛' },
  { value: 'team', label: '团队赛' },
  { value: 'regional', label: '官方比赛' },
];

// 下拉菜单文本显示
const getStatusText = computed(() => {
  const option = statusOptions.find((option) => option.value === statusFilter.value);
  return option ? option.label : '全部状态';
});

const getTypeText = computed(() => {
  const option = typeOptions.find((option) => option.value === typeFilter.value);
  return option ? option.label : '全部类型';
});

// 切换下拉菜单显示/隐藏
const toggleStatusDropdown = () => {
  statusDropdownOpen.value = !statusDropdownOpen.value;
  if (statusDropdownOpen.value) {
    typeDropdownOpen.value = false;
    // 菜单打开时添加滚动事件监听
    window.addEventListener('scroll', handleScroll);
    // 立即执行一次以确保初始位置正确
    setTimeout(updateDropdownPositions, 0);
  } else {
    // 菜单关闭时移除滚动事件监听
    window.removeEventListener('scroll', handleScroll);
  }
};

const toggleTypeDropdown = () => {
  typeDropdownOpen.value = !typeDropdownOpen.value;
  if (typeDropdownOpen.value) {
    statusDropdownOpen.value = false;
    // 菜单打开时添加滚动事件监听
    window.addEventListener('scroll', handleScroll);
    // 立即执行一次以确保初始位置正确
    setTimeout(updateDropdownPositions, 0);
  } else {
    // 菜单关闭时移除滚动事件监听
    window.removeEventListener('scroll', handleScroll);
  }
};

// 选择下拉菜单选项
const selectStatus = (value: string) => {
  statusFilter.value = value;
  statusDropdownOpen.value = false;
  // 菜单关闭时移除滚动事件监听
  window.removeEventListener('scroll', handleScroll);
};

const selectType = (value: string) => {
  typeFilter.value = value;
  typeDropdownOpen.value = false;
  // 菜单关闭时移除滚动事件监听
  window.removeEventListener('scroll', handleScroll);
};

// 点击外部关闭下拉菜单
const handleClickOutside = (event: MouseEvent) => {
  // 检查点击目标是否是筛选按钮或其子元素
  const target = event.target as HTMLElement;

  // 检查是否点击了状态筛选按钮或其子元素（包括SVG图标）
  const isStatusButtonOrChild =
    target.closest('.filter-button') && statusDropdownWrapper.value?.contains(target);

  // 检查是否点击了类型筛选按钮或其子元素（包括SVG图标）
  const isTypeButtonOrChild =
    target.closest('.filter-button') && typeDropdownWrapper.value?.contains(target);

  // 如果点击的不是筛选按钮或其子元素，且不在下拉菜单内，则关闭下拉菜单
  if (!isStatusButtonOrChild && !target.closest('.dropdown-menu')) {
    if (statusDropdownOpen.value) {
      statusDropdownOpen.value = false;
      // 移除滚动事件监听器
      window.removeEventListener('scroll', handleScroll);
    }
  }

  if (!isTypeButtonOrChild && !target.closest('.dropdown-menu')) {
    if (typeDropdownOpen.value) {
      typeDropdownOpen.value = false;
      // 移除滚动事件监听器
      window.removeEventListener('scroll', handleScroll);
    }
  }
};

// 下拉菜单位置计算
// scrollTick 作为响应式依赖：页面滚动时自增，驱动下面两个计算属性重新求值
const scrollTick = ref(0);

const statusDropdownStyle = computed<CSSProperties>(() => {
  void scrollTick.value; // 建立响应式依赖
  if (!statusDropdownWrapper.value) return {};

  const rect = statusDropdownWrapper.value.getBoundingClientRect();
  return {
    position: 'absolute',
    top: `${rect.bottom + 8}px`,
    left: `${rect.left}px`,
    width: `${rect.width}px`,
  };
});

const typeDropdownStyle = computed<CSSProperties>(() => {
  void scrollTick.value; // 建立响应式依赖
  if (!typeDropdownWrapper.value) return {};

  const rect = typeDropdownWrapper.value.getBoundingClientRect();
  return {
    position: 'absolute',
    top: `${rect.bottom + 8}px`,
    left: `${rect.left}px`,
    width: `${rect.width}px`,
  };
});

// 处理页面滚动时更新下拉菜单位置
const handleScroll = () => {
  if (statusDropdownOpen.value || typeDropdownOpen.value) {
    // 自增计数器，触发计算属性重新计算下拉框位置
    scrollTick.value++;
  }
};

// 打开下拉菜单后立即重算一次位置（通过 scrollTick 驱动计算属性重新求值）
const updateDropdownPositions = () => {
  scrollTick.value++;
};

// 监听点击事件，不再需要全局监听滚动事件
onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside);
  // 确保在组件卸载时移除所有可能的滚动事件监听器
  window.removeEventListener('scroll', handleScroll);
});

// 监听下拉菜单状态变化
watch(
  [statusDropdownOpen, typeDropdownOpen],
  ([newStatusOpen, newTypeOpen], [oldStatusOpen, oldTypeOpen]) => {
    // 从关闭到打开状态时，添加滚动事件监听并立即更新位置
    if ((!oldStatusOpen && newStatusOpen) || (!oldTypeOpen && newTypeOpen)) {
      window.addEventListener('scroll', handleScroll);
      // 立即执行一次以确保初始位置正确
      setTimeout(updateDropdownPositions, 0);
    }

    // 从打开到关闭状态，且两个菜单都关闭时，移除滚动事件监听
    if ((oldStatusOpen || oldTypeOpen) && !newStatusOpen && !newTypeOpen) {
      window.removeEventListener('scroll', handleScroll);
    }
  }
);

// 分页
const currentPage = ref(1);
const pageSize = ref(4);

// 竞赛数据
const competitionData = ref<Competition[]>([]);

const fetchCompetitions = async () => {
  try {
    const data = await raceApi.getRaceList();
    console.log(data);

    // 添加以下代码来获取和打印每条数据的status
    if (data && data.race_info && Array.isArray(data.race_info)) {
      // // 方法1：直接打印所有status
      // console.log('所有竞赛的status值：', data.race_info.map(race => race.status));

      // 方法2：遍历每条数据单独处理
      data.race_info.forEach((race, index) => {
        console.log(`第${index + 1}条竞赛的status值:`, race.status);
      });

      // 检查数据结构并提取竞赛信息
      if (data && data.race_info && Array.isArray(data.race_info)) {
        // 将获取到的竞赛数据赋值给competitionData
        competitionData.value = data.race_info.map((race: any) => {
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
        competitionData.value.sort((a, b) => {
          // 将时间字符串转换为日期对象进行比较
          const dateA = new Date(a.startTime);
          const dateB = new Date(b.startTime);
          // 降序排列，最新的日期在前面
          return dateB.getTime() - dateA.getTime();
        });

        console.log('获取到竞赛数据:', competitionData.value);
      } else {
        console.warn('获取到的竞赛数据格式不正确:', data);
      }
    }
  } catch (error) {
    console.error('获取竞赛数据失败:', error);
  }
};

// 组件挂载后获取数据
onMounted(() => {
  // 调用获取竞赛数据的方法
  fetchCompetitions();
});

// 获取竞赛状态对应的类名
const getStatusClass = (status: string) => {
  switch (status) {
    case 'upcoming':
      return 'status-upcoming';
    case 'running':
      return 'status-running';
    case 'ended':
      return 'status-ended';
    default:
      return '';
  }
};

// 为标签生成动态样式
const getTagStyle = (tag: Tag) => {
  // 如果是已知类型，不需要特殊样式
  if (['running', 'ended', 'individual', 'team', 'oi', 'acm', 'regional'].includes(tag.type)) {
    return {};
  }

  // 基于标签名称生成哈希值作为颜色基础
  const nameHash = tag.name.split('').reduce((acc: number, char: string) => {
    return acc + char.charCodeAt(0);
  }, 0);

  // 选择预定义的柔和颜色方案
  const colorSchemes = [
    { bg: '#E8F4F8', text: '#2980b9' }, // 蓝色系
    { bg: '#F8F4E8', text: '#E67E22' }, // 橙色系
    { bg: '#F4E8F8', text: '#8E44AD' }, // 紫色系
    { bg: '#E8F8F4', text: '#27AE60' }, // 绿色系
    { bg: '#F8E8E8', text: '#C0392B' }, // 红色系
    { bg: '#F4F8E8', text: '#16A085' }, // 青绿色系
  ];

  // 使用哈希值选择颜色方案，确保同名标签颜色一致
  const colorIndex = nameHash % colorSchemes.length;
  const colors = colorSchemes[colorIndex];

  return {
    backgroundColor: colors.bg,
    color: colors.text,
    borderColor: colors.text + '33', // 添加透明度33 (20%)
  };
};

// 过滤后的竞赛列表
const filteredCompetitions = computed(() => {
  let results = competitionData.value;

  // 按状态筛选
  if (statusFilter.value !== 'all') {
    results = results.filter((comp: Competition) => comp.status === statusFilter.value);
  }

  // 按类型筛选
  if (typeFilter.value !== 'all') {
    results = results.filter((comp: Competition) =>
      comp.tags.some((tag: Tag) => tag.type === typeFilter.value)
    );
  }

  // 按关键字搜索
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    results = results.filter(
      (comp: Competition) =>
        comp.title.toLowerCase().includes(query) ||
        comp.tags.some((tag: Tag) => tag.name.toLowerCase().includes(query))
    );
  }

  return results;
});

// 计算总页数
const totalPages = computed(() => {
  return Math.ceil(filteredCompetitions.value.length / pageSize.value);
});

// 当前页面显示的竞赛列表
const paginatedCompetitions = computed(() => {
  const startIndex = (currentPage.value - 1) * pageSize.value;
  const endIndex = startIndex + pageSize.value;
  return filteredCompetitions.value.slice(startIndex, endIndex);
});

// 如果过滤条件变化，重置到第一页
watch([searchQuery, statusFilter, typeFilter], () => {
  currentPage.value = 1;
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
  background-color: #fff;
  padding: 16px 20px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: all 0.5s cubic-bezier(0.25, 1, 0.5, 1);
  border: 1px solid #e2e8f0;
  animation: fadeInDown 0.6s ease-out;
}

@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.search-filter-container:hover {
  box-shadow: 0 6px 16px rgba(66, 185, 131, 0.12);
  transform: translateY(-2px);
}

.filter-container {
  display: flex;
  gap: 12px;
}

.filter-wrapper {
  position: relative;
  display: inline-block;
}

.filter-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 38px;
  padding: 0 18px;
  background-color: #f5f7fa;
  border-radius: 8px;
  font-size: 14px;
  color: #4a5568;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.25, 1, 0.5, 1);
  border: 1px solid transparent;
  position: relative;
  user-select: none;
  overflow: hidden;
  z-index: 1;
}

.filter-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, rgba(66, 185, 131, 0.1), transparent);
  transition: left 0.5s cubic-bezier(0.25, 1, 0.5, 1);
  z-index: -1;
}

.filter-button:hover {
  background-color: #ebf0f5;
  border-color: #d1dbe5;
  transform: translateY(-2px);
}

.filter-button:hover::before {
  left: 100%;
}

.filter-button.active-filter {
  background: linear-gradient(to right, #edf7f2, #e0f5eb);
  color: #42b983;
  border: 1px solid #a6e5c9;
  box-shadow: 0 2px 8px rgba(66, 185, 131, 0.15);
  position: relative;
  overflow: hidden;
}

.filter-button.active-filter::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background: linear-gradient(to right, #42b983, #33c6aa);
  transition: all 0.3s ease;
}

.filter-button.active-filter:hover::after {
  height: 3px;
}

.filter-arrow {
  width: 16px;
  height: 16px;
  margin-left: 8px;
  transition: transform 0.3s cubic-bezier(0.25, 1, 0.5, 1);
  color: currentColor;
}

.filter-arrow.rotated {
  transform: rotate(180deg);
}

.search-container {
  position: relative;
  display: flex;
  align-items: center;
  width: 280px;
  transition: all 0.5s cubic-bezier(0.25, 1, 0.5, 1);
}

.search-container:focus-within {
  width: 350px;
}

.search-icon {
  position: absolute;
  left: 12px;
  width: 16px;
  height: 16px;
  color: #a0aec0;
  z-index: 1;
  transition: all 0.3s ease;
}

.search-container:focus-within .search-icon {
  color: #42b983;
  transform: scale(1.1);
}

.search-input {
  width: 100%;
  height: 38px;
  padding: 8px 12px 8px 36px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
  color: #4a5568;
  background-color: #f8fafc;
  transition: all 0.3s cubic-bezier(0.25, 1, 0.5, 1);
  outline: none;
}

.search-input:hover {
  border-color: #99a1a9;
  background-color: #fff;
}

.search-input:focus {
  border-color: #42b983;
  box-shadow: 0 0 0 3px rgba(66, 185, 131, 0.2);
  background-color: #fff;
}

/* 下拉菜单样式 */
.dropdown-menu {
  position: fixed;
  z-index: 9999; /* 极高的z-index确保始终在最上层 */
  min-width: 160px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 6px 30px rgba(0, 0, 0, 0.2);
  transform-origin: top center;
  animation: dropdownFadeIn 0.3s cubic-bezier(0.25, 1, 0.5, 1);
  pointer-events: auto; /* 确保下拉菜单可以接收鼠标事件 */
}

@keyframes dropdownFadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.dropdown-arrow {
  width: 12px;
  height: 12px;
  background-color: white;
  position: absolute;
  left: 16px;
  top: -6px;
  transform: rotate(45deg);
  box-shadow: -1px -1px 1px rgba(0, 0, 0, 0.1);
}

.dropdown-content {
  padding: 8px 0;
  border-radius: 8px;
  overflow: hidden;
}

.dropdown-item {
  display: flex;
  align-items: center;
  padding: 10px 16px;
  font-size: 14px;
  line-height: 20px;
  color: #333;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  overflow: hidden;
}

.dropdown-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, rgba(66, 185, 131, 0.1), transparent);
  transition: left 0.4s cubic-bezier(0.25, 1, 0.5, 1);
  z-index: -1;
}

.dropdown-item:hover {
  background-color: #f5f7fa;
  color: #42b983;
  padding-left: 22px;
}

.dropdown-item:hover::before {
  left: 100%;
}

.dropdown-item.active {
  background-color: #edf7f2;
  color: #42b983;
  font-weight: 500;
}

/* 移除旧的样式 */
.search-input::before,
.search-input:hover::before,
.search-input:focus-within::before,
.dropdown-toggle,
.dropdown-toggle:hover,
.dropdown-arrow,
.dropdown-menu.show,
.dropdown-item.active {
  /* 这些选择器会被新样式覆盖，所以这里不需要添加具体样式 */
}

/* 响应式调整 */
@media (max-width: 768px) {
  .search-filter-container {
    flex-direction: column;
    align-items: stretch;
  }

  .filter-container {
    width: 100%;
    justify-content: space-between;
  }

  .search-container {
    width: 100%;
  }

  .status-dropdown,
  .type-dropdown {
    position: fixed;
    top: auto;
    left: 50%;
    transform: translateX(-50%);
    margin-top: 8px;
  }
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
  position: relative;
  z-index: 1; /* 低于下拉菜单 */
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
  background: linear-gradient(to bottom, #ffaa00, #ffc107);
}

.status-running .competition-title::before {
  background: linear-gradient(to bottom, #42b983, #33c6aa);
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

.competition-card:hover .status-upcoming .logo-badge {
  background-color: #fff8e0;
  color: #ffaa00;
  transform: translateY(-2px);
  box-shadow: 0 3px 6px rgba(255, 170, 0, 0.15);
}
.competition-card:hover .status-running .logo-badge {
  background-color: #e8f7f1;
  color: #42b983;
  transform: translateY(-2px);
  box-shadow: 0 3px 6px rgba(66, 185, 131, 0.15);
}
.competition-card:hover .status-ended .logo-badge {
  background-color: #f0f0f0;
  color: #888888;
  transform: translateY(-2px);
  box-shadow: 0 3px 6px rgba(136, 136, 136, 0.15);
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

.upcoming .card-header {
  background: linear-gradient(to right, #f9f9f9, #f2f2f2);
}

.upcoming .action-btn {
  background: linear-gradient(135deg, #ffaa00, #ffc107);
  box-shadow: 0 6px 15px rgba(255, 170, 0, 0.25);
}

.upcoming .action-btn::after {
  background: linear-gradient(90deg, #ffc107, #ffaa00);
}

.upcoming .competition-title {
  color: #333;
}

/* 分页样式 */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
  margin-bottom: 30px;
  gap: 12px;
  position: relative;
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

.chevron-left,
.chevron-right {
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

/* 将下拉菜单移到第178行的模板末尾，改为全局定位 */
.dropdown-menu {
  position: fixed;
  z-index: 9999; /* 极高的z-index确保始终在最上层 */
  min-width: 160px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 6px 30px rgba(0, 0, 0, 0.2);
  transform-origin: top center;
  animation: dropdownFadeIn 0.3s cubic-bezier(0.25, 1, 0.5, 1);
  pointer-events: auto; /* 确保下拉菜单可以接收鼠标事件 */
}

/* 删除以下不再需要的样式 */
.top-layer {
  position: fixed;
  z-index: 9999;
}

/* 调整下拉菜单位置样式，使用JS计算偏移量 */
.dropdown-menu.top-layer {
  position: fixed;
  min-width: 160px;
  box-shadow: 0 6px 30px rgba(0, 0, 0, 0.2);
}
</style>
