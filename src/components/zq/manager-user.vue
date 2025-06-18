<template>
    <div class="page-header">
                <div class="header-left">
                    <h2 class="page-title">用户管理</h2>
                    <p class="page-description">管理所有用户权限，包括创建、编辑和封禁用户</p>
                </div>
                <div class="header-right">
                    <el-button type="primary" class="create-button" @click="CreateRace">
                        <el-icon class="button-icon"><Plus /></el-icon>
                        <span>创建用户</span>
                    </el-button>
                    <race-create @refreshData="fetchData" :alertBoxRef="alertBox" ref="raceCreateRef" />
                    <race-edit @refreshData="fetchData" :alertBoxRef="alertBox" ref="raceEditRef" />
                    <race-detail @refreshData="fetchData" @editRace="handleEditFromDetail" :alertBoxRef="alertBox" ref="raceDetailRef" />
                </div>
            </div>

            <AlertBox ref="alertBox" />

            <div class="filter-bar">
                <div class="filter-left">
                    <el-input
                        placeholder="搜索用户名称或ID"
                        prefix-icon="Search"
                        v-model="searchQuery"
                        clearable
                        class="search-input"
                        @input="handleSearch"
                    >
                        <template #append>
                            <el-button @click="handleSearch" style="background-color: #18a058; border-color: #18a058; color: white;">搜索</el-button>
                        </template>
                    </el-input>
                    <el-button type="primary" plain @click="showAdvancedSearch = !showAdvancedSearch" style="background-color: rgba(24, 160, 88, 0.05); border-color: #18a05880; color: #18a058;">
                        {{ showAdvancedSearch ? '收起' : '高级筛选' }}
                        <el-icon>
                            <component :is="showAdvancedSearch ? 'ArrowUp' : 'ArrowDown'" />
                        </el-icon>
                    </el-button>
                </div>
            </div>

            <transition name="dropdown">
                <div class="advanced-search" v-if="showAdvancedSearch">
                    <div class="advanced-search-header">
                        <h3 class="advanced-search-title">高级筛选</h3>
                        <el-button type="text" @click="resetAdvancedSearch" class="reset-btn">
                            <el-icon><Refresh /></el-icon> 重置筛选
                        </el-button>
                    </div>
                    <div class="advanced-search-content">
                        <div class="search-row">
                            <div class="search-item">
                                <span class="search-label">用户状态:</span>
                                <el-select v-model="statusFilter" placeholder="用户状态" clearable @change="handleSearch" style="flex: 1; max-width: 200px;">
                                    <el-option label="全部" value="" />
                                    <el-option label="报名中" value="upcoming" />
                                    <el-option label="进行中" value="running" />
                                    <el-option label="已结束" value="ended" />
                                </el-select>
                            </div>
                            <div class="search-item">
                                <span class="search-label">用户时长:</span>
                                <el-select v-model="durationFilter" placeholder="用户时长" clearable @change="handleSearch" style="flex: 1; max-width: 200px;">
                                    <el-option label="全部" value="" />
                                    <el-option label="1天以内" value="<1" />
                                    <el-option label="1-3天" value="1-3" />
                                    <el-option label="3天以上" value=">3" />
                                </el-select>
                            </div>
                        </div>
                        <div class="search-row">
                            <div class="search-item">
                                <span class="search-label">用户类型:</span>
                                <el-select v-model="competitionTypeFilter" placeholder="用户类型" clearable @change="handleSearch" style="flex: 1; max-width: 200px;">
                                    <el-option label="全部" value="" />
                                    <el-option label="个人赛" value="individual" />
                                    <el-option label="团队赛" value="team" />
                                </el-select>
                            </div>
                            <div class="search-item">
                                <span class="search-label">赛制类型:</span>
                                <el-select v-model="competitionModeFilter" placeholder="赛制类型" clearable @change="handleSearch" style="flex: 1; max-width: 200px;">
                                    <el-option label="全部" value="" />
                                    <el-option label="ACM赛制" value="acm" />
                                    <el-option label="OI赛制" value="oi" />
                                </el-select>
                            </div>
                        </div>
                        <div class="search-item full-width">
                            <span class="search-label">日期范围:</span>
                            <el-date-picker
                                v-model="dateRange"
                                type="daterange"
                                range-separator="至"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期"
                                format="YYYY-MM-DD"
                                @change="handleSearch"
                                style="flex: 1; max-width: 400px;"
                            />
                        </div>
                        <div class="search-item full-width">
                            <span class="search-label">参与人数:</span>
                            <el-slider
                                v-model="participantsRange"
                                range
                                :min="0"
                                :max="200"
                                :marks="{0: '0', 50: '50', 100: '100', 150: '150', 200: '200'}"
                                @change="handleSearch"
                                style="flex: 1;"
                            />
                        </div>
                    </div>
                    <div class="advanced-search-footer">
                        <div class="search-result-info">已筛选出 {{ totalCompetitions }} 场用户</div>
                        <div class="search-actions">
                            <el-button type="primary" @click="applyAdvancedSearch">应用</el-button>
                        </div>
                    </div>
                </div>
            </transition>

            <div class="batch-operations" v-if="selectedCompetitions.length > 0">
                <div class="selected-count">已选择 {{ selectedCompetitions.length }} 场用户</div>
                <!-- <div class="batch-actions">
                    <el-button type="primary" plain size="small" @click="batchExport">批量导出</el-button>
                    <el-button type="warning" plain size="small" @click="batchChangeStatus">修改状态</el-button>
                    <el-button type="danger" plain size="small" @click="batchDelete">批量删除</el-button>
                </div> -->
            </div>

            <div class="competition-table">
                <el-table
                    :data="filteredCompetitions"
                    style="width: 100%"
                    :row-class-name="tableRowClassName"
                    v-loading="loading"
                    @selection-change="handleSelectionChange"
                    :border="false"
                    stripe
                    :cell-style="cellStyle"
                    :header-cell-style="{ backgroundColor: '#f8f9fa', color: '#2c3e50', fontWeight: '600'}"
                    :show-overflow-tooltip="false"
                    :max-height="'none'"
                    :height="'auto'"
                >
                    <el-table-column type="selection" width="50" align="center" />
                    <el-table-column prop="uid" label="uid" width="110" align="center" />
                    <el-table-column prop="username" label="用户名" min-width="100" />
                    <el-table-column prop="role" label="注册时间" width="200" align="center" />
                    <el-table-column prop="rating" label="状态" width="200" align="center" />
                    <el-table-column label="操作" width="180" fixed="right" align="center">
                        <template #default="scope">
                            <div class="action-buttons">
                                <el-button 
                                    type="danger" 
                                    size="small" 
                                    text
                                    @click="banUser(scope.row)"
                                >
                                    封禁
                                </el-button>
                                <el-button 
                                    type="primary" 
                                    size="small" 
                                    text
                                    @click="manageUser(scope.row)"
                                >
                                    管理
                                </el-button>
                            </div>
                        </template>
                    </el-table-column>
                </el-table>
            </div>

            <div class="pagination-container">
                <div class="pagination">
                    <button class="page-btn prev-btn" :disabled="currentPage === 1" @click="handleCurrentChange(currentPage - 1)">
                        <span class="chevron-left"></span>
                    </button>
                    <div class="page-numbers">
                        <button 
                            v-for="num in displayedPages" 
                            :key="num"
                            class="page-number"
                            :class="{ active: currentPage === num }"
                            @click="handleCurrentChange(num)"
                        >
                            {{ num }}
                        </button>
                    </div>
                    <button class="page-btn next-btn" :disabled="currentPage === totalPages" @click="handleCurrentChange(currentPage + 1)">
                        <span class="chevron-right"></span>
                    </button>
                </div>
            </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import type { FormInstance } from 'element-plus';
import { Plus, Search, ArrowUp, ArrowDown, Timer, Collection, Refresh } from '@element-plus/icons-vue';
import AlertBox from '../JGG/alertbox.vue';
import axios from 'axios';
import RaceCreate from './race-create.vue';
import RaceEdit from './race-edit.vue';
import RaceDetail from './race-detail.vue';

// 定义用户标签类型
interface CompetitionTag {
  name: string;
  type: string;
}

// 定义API返回的用户数据类型
interface ApiCompetition {
  uid: number;
  title: string;
  logos?: string[];
  start_time: string;
  end_time: string;
  duration: string;
  tags?: CompetitionTag[];
  created_at: string;
  updated_at: string;
  problems_list?: number[];
  user_list?: number[];
  status: string;
  description?: string;
}

// 定义示例数据类型
interface ExampleItem {
  input: string;
  output: string;
  explanation: string;
}

// 定义表格显示的用户数据类型
interface FormattedCompetition {
  id: string;
  title: string;
  participantsCount: number;
  startTime: string;
  endTime: string;
  status: string;
  raw?: ApiCompetition;
}

// AlertBox引用
const alertBox = ref(null);
const raceCreateRef = ref(null);
const raceEditRef = ref(null);
const raceDetailRef = ref(null);

// 页面状态
const loading = ref(false);
const searchQuery = ref('');
const statusFilter = ref('');
const dateRange = ref([]);
const currentPage = ref(1);
const pageSize = ref(8);
const totalCompetitions = ref(100);
const showAdvancedSearch = ref(false);
const participantsRange = ref([0, 200]);
const durationFilter = ref('');
const selectedCompetitions = ref([]);
const searchTimeout = ref(null);
const competitionTypeFilter = ref('');
const competitionModeFilter = ref('');

// 用户数据
const competitions = ref([]);
// 预取的下一页数据缓存
const nextPageCache = ref([]);
// 分页数据缓存，key为页码，value为用户数据
const pageDataCache = ref({});

// 总页数
const totalPages = ref(1);

// 当前显示的页码数组（最多显示5个页码按钮，含当前页）
const displayedPages = computed(() => {
  const pages = [];
  // 总页数小于等于7时全部显示
  if (totalPages.value <= 7) {
    for (let i = 1; i <= totalPages.value; i++) {
      pages.push(i);
    }
    return pages;
  }
  // 当前页靠近开头
  if (currentPage.value <= 4) {
    pages.push(1, 2, 3, 4, 5, '...', totalPages.value);
    return pages;
  }
  // 当前页靠近结尾
  if (currentPage.value >= totalPages.value - 3) {
    pages.push(1, '...', totalPages.value - 4, totalPages.value - 3, totalPages.value - 2, totalPages.value - 1, totalPages.value);
    return pages;
  }
  // 当前页在中间，两侧省略
  pages.push(1, '...', currentPage.value - 1, currentPage.value, currentPage.value + 1, '...', totalPages.value);
  return pages;
});

// 创建用户
const CreateRace = () => {
  if (raceCreateRef.value) {
    raceCreateRef.value.openCreateDialog();
  }
};

// 获取用户列表（新接口）
const fetchUsers = async (page = 1) => {
  // 保证页码不小于1
  const safePage = page < 1 ? 1 : page;
  try {
    const res = await axios.post('/api/admin-get-user-list', {
      page: safePage
      // 其他参数可选
    });
    if (res.data.success) {
      return res.data.data; // 返回数据
    } else {
      alertBox.value?.show('获取用户数据失败，请稍后重试', 1);
      return null;
    }
  } catch (e) {
    console.error('用户数据请求异常', e);
    alertBox.value?.show('获取用户数据失败，请稍后重试', 1);
    return null;
  }
};

// 格式化用户数据，适配表格
const formatUserData = (data: any[]): any[] => {
  return data.map(user => ({
    uid: user.uid,
    username: user.username,
    role: user.create_time || '', // 注册时间
    rating: user.is_banned ? '已封禁' : '未封禁', // 状态
    raw: user, // 保留原始数据
  }));
};

// 获取并设置当前页数据，optionally预取下一页
const fetchData = async (preloadNext = false) => {
  loading.value = true;
  try {
    // 优先从缓存取
    if (pageDataCache.value[currentPage.value]) {
      competitions.value = pageDataCache.value[currentPage.value];
    } else {
      // 当前页
      const res = await fetchUsers(currentPage.value);
      const users = res?.users || res?.data?.users || [];
      const formatted = formatUserData(users);
      competitions.value = formatted;
      pageDataCache.value[currentPage.value] = formatted;
      totalCompetitions.value = res?.total_items || res?.data?.total_items || 0;
      totalPages.value = res?.total_pages || res?.data?.total_pages || 1;
    }
    // 预取下一页
    if (preloadNext) {
      const nextPage = currentPage.value + 1;
      if (!pageDataCache.value[nextPage]) {
        const nextRes = await fetchUsers(nextPage);
        const nextUsers = nextRes?.users || nextRes?.data?.users || [];
        const nextFormatted = formatUserData(nextUsers);
        nextPageCache.value = nextFormatted;
        pageDataCache.value[nextPage] = nextFormatted;
      } else {
        nextPageCache.value = pageDataCache.value[nextPage];
      }
    }
  } catch (error) {
    console.error('获取用户数据失败:', error);
    alertBox.value?.show('获取用户数据失败，请稍后重试', 1);
  } finally {
    loading.value = false;
  }
};

onMounted(async () => {
  // 获取第一页数据并预取第二页
  await fetchData(true);
  // 告知子组件预加载题目数据
  if (raceCreateRef.value) {
    raceCreateRef.value.loadAvailableProblems();
  }
  if (raceEditRef.value) {
    raceEditRef.value.loadAvailableProblems();
  }
});

// 处理延迟搜索，避免频繁过滤
const handleSearch = () => {
    if (searchTimeout.value) {
        clearTimeout(searchTimeout.value);
    }
    
    searchTimeout.value = setTimeout(() => {
        console.log('搜索条件:', {
            searchQuery: searchQuery.value,
            status: statusFilter.value,
            dateRange: dateRange.value,
            participantsRange: participantsRange.value,
            durationFilter: durationFilter.value,
            competitionTypeFilter: competitionTypeFilter.value,
            competitionModeFilter: competitionModeFilter.value
        });
        
        // 触发过滤计算
        // 如果是API请求，这里不需要手动触发，因为计算属性会自动重新计算
    }, 300);
};

// 处理表格选择变更
const handleSelectionChange = (selection: any[]) => {
    selectedCompetitions.value = selection;
};

// 批量操作方法
const batchExport = () => {
    const ids = selectedCompetitions.value.map((competition: any) => competition.id).join(', ');
    alertBox.value.show(`已导出用户: ${ids}`, 0);
};

const batchChangeStatus = () => {
    ElMessageBox.prompt('请选择新的用户状态', '批量修改状态', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /.*/ // 使用正则表达式验证
    }).then(({ value }) => {
        const ids = selectedCompetitions.value.map((competition: FormattedCompetition) => competition.id).join(', ');
        if (alertBox.value) {
            alertBox.value.show(`已将用户 ${ids} 的状态修改为 ${value}`, 0);
        }
    }).catch(() => {
        if (alertBox.value) {
            alertBox.value.show('已取消操作', 1);
        }
    });
};

const batchDelete = () => {
    const ids = selectedCompetitions.value.map((competition: any) => competition.id).join(', ');
    ElMessageBox.confirm(
        `确定要删除这 ${selectedCompetitions.value.length} 场用户吗？此操作不可逆。`,
        '批量删除确认',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
        }
    )
    .then(() => {
        alertBox.value.show(`已删除用户: ${ids}`, 0);
        selectedCompetitions.value = [];
    })
    .catch(() => {
        alertBox.value.show('已取消删除', 1);
    });
};

// 监听筛选条件变化，重置分页
watch([searchQuery, statusFilter, dateRange, participantsRange, durationFilter, competitionTypeFilter, competitionModeFilter], () => {
    currentPage.value = 1;
});

// 过滤后的用户数据
const filteredCompetitions = computed(() => {
    // 只做过滤，不做分页切片
    return competitions.value.filter((user: any) => {
        // 搜索过滤
        const matchesSearch = searchQuery.value
            ? user.username.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
              String(user.uid).includes(searchQuery.value)
            : true;
        // 状态过滤
        const matchesStatus = statusFilter.value
            ? user.rating === statusFilter.value
            : true;
        // 其他过滤条件可根据需要添加
        return matchesSearch && matchesStatus;
    });
});

// 表格行样式
const tableRowClassName = ({ row }: { row: any }) => {
    if (row.status === '进行中') {
        return 'active-row';
    } else if (row.status === '报名中') {
        return 'registration-row';
    }
    return '';
};

// 获取状态标签类型
const getStatusType = (status: string) => {
    switch (status) {
        case '进行中': return 'success';
        case '报名中': return 'warning';
        case '已结束': return 'info';
        default: return 'info';
    }
};

// 分页处理
const handleCurrentChange = async (page: number) => {
    currentPage.value = page;
    // 优先从缓存取
    if (pageDataCache.value[page]) {
      competitions.value = pageDataCache.value[page];
      // 预取下一页
      const nextPage = page + 1;
      if (!pageDataCache.value[nextPage]) {
        loading.value = true;
        try {
          const nextRes = await fetchUsers(nextPage);
          const nextUsers = nextRes?.users || nextRes?.data?.users || [];
          const nextFormatted = formatUserData(nextUsers);
          nextPageCache.value = nextFormatted;
          pageDataCache.value[nextPage] = nextFormatted;
        } catch (e) {
          nextPageCache.value = [];
        } finally {
          loading.value = false;
        }
      } else {
        nextPageCache.value = pageDataCache.value[nextPage];
      }
    } else {
      // 其他页正常请求
      await fetchData(page === 1); // 如果是第一页，预取第二页
    }
};

// 封禁用户
const banUser = (user: FormattedCompetition) => {
    ElMessageBox.confirm(
        `确定要封禁用户 ${user.title} 吗？`,
        '封禁确认',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
        }
    )
    .then(async () => {
        try {
            loading.value = true;
            // 假设uid格式为 C-123
            const uid = parseInt(user.id.replace('C-', ''));
            await axios.post(`/api/user/ban/${uid}`);
            alertBox.value.show(`用户 ${user.title} 已被封禁`, 0);
            await fetchData();
        } catch (error: any) {
            alertBox.value.show(`封禁失败: ${error.response?.data?.message || error.message || '服务器错误'}`, 1);
        } finally {
            loading.value = false;
        }
    })
    .catch(() => {
        alertBox.value.show('已取消封禁', 1);
    });
};

// 管理用户（弹窗展示用户信息）
const manageUser = (user: FormattedCompetition) => {
    ElMessageBox.alert(
        `ID: ${user.id}<br>用户名: ${user.title}<br>参与数: ${user.participantsCount}<br>状态: ${user.status}`,
        '用户信息',
        {
            dangerouslyUseHTMLString: true,
            confirmButtonText: '关闭',
        }
    );
};

// 表格单元格样式，用户名列左对齐，其余居中
const cellStyle = ({ column }: any) => {
  if (column.property === 'username') {
    return { textAlign: 'left', padding: '12px 0' };
  }
  return { textAlign: 'center', padding: '12px 0' };
};
</script>

<style scoped>
    .page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
}

.page-title {
    font-size: 24px;
    font-weight: 600;
    color: #2c3e50;
    margin: 0;
    margin-bottom: 8px;
}

.page-description {
    font-size: 14px;
    color: #6a778e;
    margin: 0;
}

.filter-bar {
    display: flex;
    justify-content: space-between;
    margin-bottom: 24px;
    flex-wrap: wrap;
    gap: 16px;
}

.filter-left {
    display: flex;
    gap: 12px;
    align-items: center;
}

.filter-right {
    display: flex;
    gap: 16px;
}

.search-input {
    width: 300px;
}

.advanced-search {
    background: #f8f9fa;
    border-radius: 12px;
    padding: 20px;
    margin-bottom: 24px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
    border-left: 3px solid rgba(24, 160, 88, 0.3);
    transition: all 0.3s ease;
}

.advanced-search-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
    padding-bottom: 12px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.06);
}

.advanced-search-title {
    font-size: 16px;
    font-weight: 600;
    color: #2c3e50;
    margin: 0;
    position: relative;
}

.advanced-search-title::before {
    content: '';
    position: absolute;
    left: -20px;
    top: 50%;
    transform: translateY(-50%);
    width: 4px;
    height: 16px;
    background-color: #18a058;
    border-radius: 2px;
}

.advanced-search-content {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.search-row {
    display: flex;
    gap: 24px;
}

.search-item {
    display: flex;
    align-items: center;
    gap: 12px;
    flex: 1;
}

.full-width {
    width: 100%;
}

.search-label {
    font-size: 14px;
    color: #606266;
    white-space: nowrap;
    min-width: 80px;
    font-weight: 500;
}

.search-item :deep(.el-slider) {
    width: 100%;
    margin: 8px 0;
}

.search-item :deep(.el-slider__bar) {
    background-color: #18a058;
}

.search-item :deep(.el-slider__button) {
    border-color: #18a058;
}

.search-item :deep(.el-select) {
    width: 100%;
}

.search-item :deep(.el-date-editor) {
    width: 100%;
}

.advanced-search-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 20px;
    padding-top: 16px;
    border-top: 1px solid rgba(0, 0, 0, 0.06);
}

.search-result-info {
    font-size: 14px;
    color: #606266;
    display: flex;
    align-items: center;
    gap: 6px;
}

.search-result-info::before {
    content: '';
    display: inline-block;
    width: 8px;
    height: 8px;
    background-color: #18a058;
    border-radius: 50%;
}

.search-actions {
    display: flex;
    gap: 12px;
}

.reset-btn {
    color: #606266;
    display: flex;
    align-items: center;
    gap: 4px;
}

.reset-btn:hover {
    color: #18a058;
}

.batch-operations {
    background: #fff;
    border-radius: 8px;
    padding: 12px 16px;
    margin-bottom: 16px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
    border-left: 3px solid rgba(24, 160, 88, 0.3);
}

.selected-count {
    font-size: 14px;
    color: #909399;
}

.batch-actions {
    display: flex;
    gap: 8px;
}

.competition-table {
    background: white;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
    margin-bottom: 24px;
    border: none;
}

.competition-table :deep(.el-table__inner-wrapper) {
    border: none;
}

.competition-table :deep(.el-scrollbar__bar.is-horizontal) {
    display: none;
}

.competition-table :deep(.el-scrollbar__bar.is-vertical) {
    display: none;
}

.competition-table :deep(.el-table__border-left),
.competition-table :deep(.el-table__border-right),
.competition-table :deep(.el-table__border-top),
.competition-table :deep(.el-table__border-bottom) {
    display: none;
}

.competition-table :deep(.el-table__row) {
    border-bottom: 1px solid #f0f0f0;
}

.competition-table :deep(.el-table__row:last-child) {
    border-bottom: none;
}

.competition-table :deep(.el-table__header) {
    border-bottom: 1px solid #ebeef5;
}

.competition-table :deep(.el-table__cell) {
    border: none;
}

.competition-table :deep(.el-table--stripe .el-table__body tr.el-table__row--striped) {
    background: rgba(24, 160, 88, 0.02);
}

.competition-table :deep(.el-table__fixed-right),
.competition-table :deep(.el-table__fixed) {
    box-shadow: none;
    border-right: none;
    border-left: none;
}

/* 为表格添加行高和单元格内边距控制 */
.competition-table :deep(.el-table__row) {
    height: 70px; /* 增加行高 */
}

.competition-table :deep(.el-table__cell) {
    padding: 10px 0; /* 增加单元格内边距 */
    vertical-align: middle;
}

/* 统一表头样式 */
.competition-table :deep(.el-table__header-row) {
    height: 60px; /* 增加表头行高 */
}

.competition-table :deep(.el-table__header-cell) {
    background-color: #f8f9fa;
    font-weight: 600;
    color: #2c3e50;
}

.competition-title {
    display: flex;
    align-items: flex-start;
    flex-direction: column;
    gap: 6px;
}

.competition-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
    margin-top: 2px;
}

.competition-tag {
    margin-right: 0;
}

.competition-meta {
    display: flex;
    gap: 12px;
    font-size: 12px;
    color: #909399;
    margin-top: 2px;
}

.meta-item {
    display: flex;
    align-items: center;
    gap: 4px;
}

.meta-item .el-icon {
    font-size: 14px;
}

.action-buttons {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 5px;
}

.action-buttons :deep(.el-button) {
    margin: 0;
    padding: 4px 8px;
    font-size: 12px;
    min-height: 28px;
    line-height: 1;
}

.action-buttons :deep(.el-button--text) {
    color: #18a058;
}

.action-buttons :deep(.el-button--text.el-button--danger) {
    color: #F56C6C;
}

.pagination-container {
    display: flex;
    justify-content: center;
    margin-top: 24px;
}

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
    border-color: #18a058;
    color: #18a058;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(24, 160, 88, 0.15);
}

.page-number.active {
    background-color: #18a058;
    color: white;
    border-color: #18a058;
    box-shadow: 0 4px 12px rgba(24, 160, 88, 0.3);
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

.page-btn:hover:not(:disabled)::before {
    opacity: 1;
}

.page-btn:hover:not(:disabled) {
    border-color: #18a058;
    color: #18a058;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(24, 160, 88, 0.15);
}

.page-btn:disabled {
    opacity: 0.4;
    cursor: not-allowed;
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

/* 表格行样式 */
:deep(.active-row) {
    background-color: rgba(24, 160, 88, 0.05);  /* 更浅的蓝绿色 */
}

:deep(.registration-row) {
    background-color: rgba(24, 160, 88, 0.02);  /* 非常浅的蓝绿色 */
}

/* 响应式调整 */
@media (max-width: 768px) {
    .content-container {
        margin-left: 0;
        padding: 16px;
    }
    
    .filter-bar, 
    .advanced-search-content,
    .batch-operations {
        flex-direction: column;
    }
    
    .search-item {
        width: 100%;
    }
    
    .filter-left,
    .filter-right {
        width: 100%;
    }
}

.header-right {
    display: flex;
}

.header-right .el-button {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
}

/* 确保图标和文字垂直居中 */
.el-button .el-icon {
    display: flex;
    align-items: center;
    justify-content: center;
}

.create-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background-color: #18a058;
    border-color: #18a058;
}

.button-icon {
    margin-right: 4px;
    display: flex;
}

/* 输入框聚焦时的样式 */
:deep(.el-input__wrapper.is-focus) {
    box-shadow: 0 0 0 1px #18a058 inset !important;
}

:deep(.el-input__wrapper:hover) {
    box-shadow: 0 0 0 1px #18a058 inset !important;
}

/* 下拉菜单框聚焦 */
:deep(.el-select .el-input.is-focus .el-input__wrapper) {
    box-shadow: 0 0 0 1px #18a058 inset !important;
}

/* 日期选择器激活状态 */
:deep(.el-date-editor.is-active),
:deep(.el-date-editor.is-active:hover) {
    box-shadow: 0 0 0 1px #18a058 inset !important;
}

/* Element Plus 主题色定制 */
:deep(.el-date-table td.current:not(.disabled)) span {
    background-color: #18a058 !important;
    color: #fff !important;
}

:deep(.el-date-table td.today span) {
    color: #18a058 !important;
}

:deep(.el-date-picker__header-label:hover),
:deep(.el-date-picker__header-button:hover) {
    color: #18a058 !important;
}

:deep(.el-date-picker__time-header) {
    border-bottom: 1px solid #e4e7ed;
}

:deep(.el-picker-panel__icon-btn:hover) {
    color: #18a058 !important;
}

:deep(.el-date-picker__header-label.active),
:deep(.el-date-picker__header-label:hover) {
    color: #18a058 !important;
}

:deep(.el-picker-panel__link-btn) {
    color: #18a058 !important;
}

/* 下拉菜单选中或悬浮样式 */
:deep(.el-select-dropdown__item.hover),
:deep(.el-select-dropdown__item:hover) {
    background-color: rgba(24, 160, 88, 0.1) !important;
}

:deep(.el-select-dropdown__item.selected) {
    color: #18a058 !important;
}

/* 日历选择器区间颜色 */
:deep(.el-date-table td.in-range div) {
    background-color: rgba(24, 160, 88, 0.1) !important;
}

:deep(.el-date-table td.start-date span, 
       .el-date-table td.end-date span) {
    background-color: #18a058 !important;
}

:deep(.el-date-table td.available:hover) {
    color: #18a058 !important;
}

:deep(.el-date-range-picker__header) {
    padding: 0 12px 12px;
}

/* 滑块颜色 */
:deep(.el-slider__button) {
    border-color: #18a058 !important;
}

:deep(.el-slider__bar) {
    background-color: #18a058 !important;
}

:deep(.el-slider__button-wrapper:hover, 
       .el-slider__button-wrapper.hover) {
    cursor: grab;
}

:deep(.el-slider__button-wrapper.active) {
    cursor: grabbing;
}

/* 弹窗样式 */
:deep(.el-message-box__headerbtn:focus .el-message-box__close, 
       .el-message-box__headerbtn:hover .el-message-box__close) {
    color: #18a058 !important;
}

:deep(.el-message-box__title) {
    color: #2c3e50 !important;
}

:deep(.el-message-box__btns .el-button--primary) {
    background-color: #18a058 !important;
    border-color: #18a058 !important;
}

:deep(.el-message-box__btns .el-button--primary:hover) {
    background-color: #35b371 !important;
    border-color: #35b371 !important;
}

/* 创建用户表单样式 */
.form-row {
    display: flex;
    gap: 24px;
}

.form-row .el-form-item {
    flex: 1;
}

.constraints-list, .examples-list {
    margin-top: 12px;
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.constraint-item, .example-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 12px;
    background-color: #f8f9fa;
    border-radius: 6px;
    font-size: 14px;
}

.constraint-item .el-icon, .example-item .el-icon {
    cursor: pointer;
    color: #909399;
}

.constraint-item .el-icon:hover, .example-item .el-icon:hover {
    color: #f56c6c;
}

.example-inputs {
    display: flex;
    flex-direction: column;
    gap: 16px;
    margin-bottom: 16px;
}

.example-content {
    font-size: 13px;
    color: #606266;
    margin: 4px 0;
    flex: 1;
}

/* 覆盖表格高度和滚动行为 */
.competition-table :deep(.el-table) {
    overflow: visible;
}

.competition-table :deep(.el-table__body-wrapper) {
    overflow: visible !important;
    height: auto !important;
    max-height: none !important;
}

.competition-table :deep(.el-scrollbar__wrap) {
    overflow: visible !important;
    height: auto !important;
    max-height: none !important;
}

.competition-table :deep(.el-scrollbar__view) {
    height: auto !important;
    max-height: none !important;
}

.competition-table :deep(.el-scrollbar) {
    height: auto !important;
    max-height: none !important;
    overflow: visible !important;
}

.competition-table :deep(.el-table__fixed-body-wrapper) {
    overflow: visible !important;
    height: auto !important;
    max-height: none !important;
}

.competition-table :deep(.el-table__fixed-right-patch) {
    background-color: #f8f9fa !important;
}

/* 下拉菜单动画 */
.dropdown-enter-active,
.dropdown-leave-active {
    transition: all 0.3s cubic-bezier(0.5, 0, 0.3, 1.2);
    transform-origin: top center;
}

.dropdown-enter-from {
    opacity: 0;
    transform: translateY(-10px) scaleY(0.95);
}

.dropdown-enter-to {
    opacity: 1;
    transform: translateY(0) scaleY(1);
}

.dropdown-leave-from {
    opacity: 1;
    transform: translateY(0) scaleY(1);
}

.dropdown-leave-to {
    opacity: 0;
    transform: translateY(-10px) scaleY(0.95);
}

/* 为内容添加延迟子元素动画 */
.advanced-search-content {
    will-change: transform, opacity;
}

.dropdown-enter-active .advanced-search-content,
.dropdown-leave-active .advanced-search-content {
    transition: all 0.3s ease 0.1s;
}

.dropdown-enter-from .advanced-search-content {
    opacity: 0;
    transform: translateY(10px);
}

.dropdown-enter-to .advanced-search-content {
    opacity: 1;
    transform: translateY(0);
}

.dropdown-leave-from .advanced-search-content {
    opacity: 1;
    transform: translateY(0);
}

.dropdown-leave-to .advanced-search-content {
    opacity: 0;
    transform: translateY(10px);
}
</style>