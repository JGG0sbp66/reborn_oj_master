<template>
  <div class="competition-api-example">
    <h2 class="example-title">竞赛数据加载示例</h2>
    
    <!-- 筛选选项 -->
    <div class="filter-section">
      <div class="filter-dropdown">
        <label>状态筛选:</label>
        <select v-model="statusFilter" @change="updateFilters">
          <option value="all">全部状态</option>
          <option value="upcoming">未开始</option>
          <option value="ongoing">进行中</option>
          <option value="ended">已结束</option>
        </select>
      </div>
      
      <div class="filter-dropdown">
        <label>类型筛选:</label>
        <select v-model="typeFilter" @change="updateFilters">
          <option value="all">全部类型</option>
          <option value="individual">个人赛</option>
          <option value="team">团队赛</option>
          <option value="oi">OI赛制</option>
          <option value="acm">ACM赛制</option>
        </select>
      </div>
      
      <div class="filter-search">
        <input 
          type="text" 
          v-model="searchQuery" 
          placeholder="搜索竞赛..." 
          @input="updateFilters"
        >
      </div>
    </div>
    
    <!-- 使用CompetitionCardLoader加载数据 -->
    <CompetitionCardLoader
      :apiUrl="apiUrl"
      :limit="pageSize"
      actionText="参与竞赛"
      :filterOptions="filterOptions"
      ref="loader"
    />
    
    <!-- 分页控制 -->
    <div class="pagination-controls">
      <button 
        class="page-button prev-button" 
        :disabled="currentPage <= 1"
        @click="prevPage"
      >
        上一页
      </button>
      
      <span class="page-info">{{ currentPage }} / {{ totalPages || 1 }}</span>
      
      <button 
        class="page-button next-button" 
        :disabled="currentPage >= totalPages"
        @click="nextPage"
      >
        下一页
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue';
import CompetitionCardLoader from './CompetitionCardLoader.vue';

// API 配置
const apiUrl = ref('http://localhost:5000/api/competitions');

// 分页配置
const currentPage = ref(1);
const pageSize = ref(5);
const totalPages = ref(1);

// 筛选条件
const statusFilter = ref('all');
const typeFilter = ref('all');
const searchQuery = ref('');

// 加载器引用
const loader = ref(null);

// 合并后的筛选选项
const filterOptions = computed(() => {
  return {
    page: currentPage.value,
    pageSize: pageSize.value,
    status: statusFilter.value !== 'all' ? statusFilter.value : undefined,
    type: typeFilter.value !== 'all' ? typeFilter.value : undefined,
    query: searchQuery.value || undefined
  };
});

// 分页方法
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

// 当筛选条件更新时重置分页
const updateFilters = () => {
  currentPage.value = 1;
  // 如果loader组件提供了刷新方法，调用它
  if (loader.value && typeof loader.value.fetchCompetitions === 'function') {
    loader.value.fetchCompetitions();
  }
};

// 监听数据变化，更新总页数
watch(() => loader.value?.totalPages, (newTotalPages) => {
  if (newTotalPages) {
    totalPages.value = newTotalPages;
  }
});

// 监听页码变化，刷新数据
watch(currentPage, () => {
  // 如果loader组件提供了刷新方法，调用它
  if (loader.value && typeof loader.value.fetchCompetitions === 'function') {
    loader.value.fetchCompetitions();
  }
});
</script>

<style scoped>
.competition-api-example {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.example-title {
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin-bottom: 24px;
  position: relative;
  padding-left: 16px;
}

.example-title::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 4px;
  background: linear-gradient(135deg, #42b983, #33c6aa);
  border-radius: 4px;
}

.filter-section {
  display: flex;
  gap: 20px;
  margin-bottom: 30px;
  flex-wrap: wrap;
  align-items: center;
}

.filter-dropdown,
.filter-search {
  min-width: 200px;
}

.filter-dropdown label {
  display: block;
  margin-bottom: 6px;
  font-size: 14px;
  color: #666;
}

.filter-dropdown select,
.filter-search input {
  width: 100%;
  padding: 10px 14px;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
  background-color: white;
  font-size: 14px;
  transition: all 0.3s;
}

.filter-dropdown select:focus,
.filter-search input:focus {
  border-color: #42b983;
  outline: none;
  box-shadow: 0 0 0 3px rgba(66, 185, 131, 0.1);
}

.pagination-controls {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 40px;
  gap: 20px;
}

.page-button {
  padding: 10px 16px;
  border-radius: 8px;
  border: none;
  background-color: #f1f5f9;
  color: #333;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
}

.page-button:hover:not(:disabled) {
  background-color: #e8f5f0;
  color: #42b983;
}

.page-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-info {
  font-size: 14px;
  color: #666;
}

@media (max-width: 768px) {
  .filter-section {
    flex-direction: column;
    gap: 15px;
  }
  
  .filter-dropdown,
  .filter-search {
    width: 100%;
  }
}
</style> 