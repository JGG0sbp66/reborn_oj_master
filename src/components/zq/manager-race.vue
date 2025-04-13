<template>
    <div class="page-header">
                <div class="header-left">
                    <h2 class="page-title">竞赛管理</h2>
                    <p class="page-description">管理所有编程竞赛，包括创建、编辑和删除竞赛</p>
                </div>
                <div class="header-right">
                    <el-button type="primary" class="create-button">
                        <el-icon class="button-icon"><Plus /></el-icon>
                        <span>创建竞赛</span>
                    </el-button>
                </div>
            </div>

            <AlertBox ref="alertBox" />

            <div class="filter-bar">
                <div class="filter-left">
                    <el-input
                        placeholder="搜索竞赛名称或ID"
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
                            <span class="search-label">竞赛状态:</span>
                            <el-select v-model="statusFilter" placeholder="竞赛状态" clearable @change="handleSearch" style="flex: 1;">
                                <el-option label="全部" value="" />
                                <el-option label="进行中" value="进行中" />
                                <el-option label="报名中" value="报名中" />
                                <el-option label="未开始" value="未开始" />
                                <el-option label="已结束" value="已结束" />
                            </el-select>
                        </div>
                        <div class="search-item">
                            <span class="search-label">竞赛时长:</span>
                            <el-select v-model="durationFilter" placeholder="竞赛时长" clearable @change="handleSearch" style="flex: 1;">
                                <el-option label="全部" value="" />
                                <el-option label="1天以内" value="<1" />
                                <el-option label="1-3天" value="1-3" />
                                <el-option label="3天以上" value=">3" />
                            </el-select>
                        </div>
                    </div>
                    <div class="search-row">
                        <div class="search-item">
                            <span class="search-label">竞赛类型:</span>
                            <el-select v-model="competitionTypeFilter" placeholder="竞赛类型" clearable @change="handleSearch" style="flex: 1;">
                                <el-option label="全部" value="" />
                                <el-option label="个人赛" value="individual" />
                                <el-option label="团队赛" value="team" />
                            </el-select>
                        </div>
                        <div class="search-item">
                            <span class="search-label">赛制类型:</span>
                            <el-select v-model="competitionModeFilter" placeholder="赛制类型" clearable @change="handleSearch" style="flex: 1;">
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
                            style="flex: 1;"
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
                    <div class="search-result-info">已筛选出 {{ totalCompetitions }} 场竞赛</div>
                    <div class="search-actions">
                        <el-button type="primary" @click="applyAdvancedSearch">应用</el-button>
                    </div>
                </div>
            </div>

            <div class="batch-operations" v-if="selectedCompetitions.length > 0">
                <div class="selected-count">已选择 {{ selectedCompetitions.length }} 场竞赛</div>
                <div class="batch-actions">
                    <el-button type="primary" plain size="small" @click="batchExport">批量导出</el-button>
                    <el-button type="warning" plain size="small" @click="batchChangeStatus">修改状态</el-button>
                    <el-button type="danger" plain size="small" @click="batchDelete">批量删除</el-button>
                </div>
            </div>

            <div class="competition-table">
                <el-table
                    :data="filteredCompetitions"
                    style="width: 100%"
                    :row-class-name="tableRowClassName"
                    v-loading="loading"
                    @selection-change="handleSelectionChange"
                >
                    <el-table-column type="selection" width="55" />
                    <el-table-column prop="id" label="ID" width="80" />
                    <el-table-column prop="title" label="竞赛名称" min-width="200">
                        <template #default="scope">
                            <div class="competition-title">
                                <span>{{ scope.row.title }}</span>
                                <div class="competition-tags" v-if="scope.row.raw && scope.row.raw.tags">
                                    <el-tag 
                                        v-for="(tag, index) in scope.row.raw.tags" 
                                        :key="index"
                                        :type="getTagType(tag.type)"
                                        size="small"
                                        class="competition-tag"
                                    >
                                        {{ tag.name }}
                                    </el-tag>
                                </div>
                                <div class="competition-meta" v-if="scope.row.raw">
                                    <span class="meta-item" v-if="scope.row.raw.duration">
                                        <el-icon><Timer /></el-icon> 
                                        {{ scope.row.raw.duration }}
                                    </span>
                                    <span class="meta-item" v-if="scope.row.raw.problems_list">
                                        <el-icon><Collection /></el-icon> 
                                        {{ scope.row.raw.problems_list.length }}题
                                    </span>
                                </div>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="participantsCount" label="参与人数" width="120" />
                    <el-table-column prop="startTime" label="开始时间" width="180" />
                    <el-table-column prop="endTime" label="结束时间" width="180" />
                    <el-table-column prop="status" label="状态" width="100">
                        <template #default="scope">
                            <el-tag :type="getStatusType(scope.row.status)">
                                {{ scope.row.status }}
                            </el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" width="200" fixed="right">
                        <template #default="scope">
                            <div class="action-buttons">
                                <el-button 
                                    type="primary" 
                                    size="small" 
                                    text
                                    @click="viewCompetitionDetails(scope.row.id)"
                                >
                                    查看
                                </el-button>
                                <el-button 
                                    type="primary" 
                                    size="small" 
                                    text
                                    @click="editCompetition(scope.row.id)"
                                >
                                    编辑
                                </el-button>
                                <el-button 
                                    type="danger" 
                                    size="small" 
                                    text
                                    @click="deleteCompetition(scope.row.id)"
                                >
                                    删除
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
import type { FormInstance, FormRules } from 'element-plus';
import { Plus, Search, ArrowUp, ArrowDown, Timer, Collection, Refresh } from '@element-plus/icons-vue';
import AlertBox from '../JGG/alertbox.vue';
import axios from 'axios';

// 定义竞赛标签类型
interface CompetitionTag {
  name: string;
  type: string;
}

// 定义API返回的竞赛数据类型
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
}

// 定义新建竞赛对象类型
interface NewCompetition {
  title: string;
  start_time: string;
  end_time: string;
  logos: string[];
  problems_list: number[];
}

// 定义表格显示的竞赛数据类型
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

// 页面状态
const loading = ref(false);
const searchQuery = ref('');
const statusFilter = ref('');
const dateRange = ref([]);
const currentPage = ref(1);
const pageSize = ref(5);
const totalCompetitions = ref(100);
const showAdvancedSearch = ref(false);
const participantsRange = ref([0, 200]);
const durationFilter = ref('');
const selectedCompetitions = ref<FormattedCompetition[]>([]);
const searchTimeout = ref<number | null>(null);
const competitionTypeFilter = ref('');
const competitionModeFilter = ref('');

// 创建竞赛相关
const createDialogVisible = ref(false);
const competitionForm = ref<FormInstance | null>(null);
const creating = ref(false);
const selectedStatus = ref('upcoming');
const competitionType = ref('');
const competitionMode = ref('');

// 表单验证规则
const competitionRules = ref<FormRules>({
  title: [
    { required: true, message: '请输入竞赛名称', trigger: 'blur' },
    { min: 3, max: 50, message: '长度在 3 到 50 个字符', trigger: 'blur' }
  ],
  start_time: [
    { required: true, message: '请选择开始时间', trigger: 'change' }
  ],
  end_time: [
    { required: true, message: '请选择结束时间', trigger: 'change' }
  ],
  problems_list: [
    { required: true, message: '请至少选择一道题目', trigger: 'change' }
  ]
});

// 新竞赛默认值
const newCompetition = ref<NewCompetition>({
    title: '',
    start_time: '',
    end_time: '',
    logos: [],
    problems_list: [],
});

// 竞赛数据
const competitions = ref<FormattedCompetition[]>([]);

const get_race_info = async (): Promise<ApiCompetition[]> => {
  const { data: userData } = await axios({
    url: "http://localhost:5000/api/races",
    method: "get",
  });
  return userData;
};

const formatCompetitionData = (data: ApiCompetition[]): FormattedCompetition[] => {
  return data.map(item => {
    // 处理状态映射
    let status = '未开始';
    if (item.status === 'upcoming') {
      // 如果状态是未开始，但有团队赛标签，则显示为报名中
      if (item.tags && item.tags.some(tag => tag.type === 'team')) {
        status = '报名中';
      } else {
        status = '未开始';
      }
    } else if (item.status === 'in_progress') {
      status = '进行中';
    } else if (item.status === 'registration') {
      status = '报名中';
    } else if (item.status === 'ended') {
      status = '已结束';
    }
    
    // 计算参与人数
    const participantsCount = item.user_list ? item.user_list.length : 0;
    
    // 格式化时间
    const startTime = new Date(item.start_time).toLocaleString('zh-CN');
    const endTime = new Date(item.end_time).toLocaleString('zh-CN');
    
    // 复制原始数据以便修改
    const rawCopy = {...item};
    
    // 确保标签和状态一致 - 如果有ended标签但状态不是已结束，则过滤掉该标签
    if (rawCopy.tags && status !== '已结束') {
      rawCopy.tags = rawCopy.tags.filter(tag => tag.type !== 'ended');
    }
    
    return {
      id: `C-${item.uid}`,
      title: item.title,
      participantsCount: participantsCount,
      startTime: startTime,
      endTime: endTime,
      status: status,
      // 保留修改后的原始数据
      raw: rawCopy
    };
  });
};

const fetchData = async () => {
  loading.value = true;
  try {
    const race_info_data = await get_race_info();
    // 转换数据格式
    competitions.value = formatCompetitionData(race_info_data);
  } catch (error) {
    console.error('获取竞赛数据失败:', error);
    // 发生错误时显示提示
    alertBox.value?.show('获取竞赛数据失败，请稍后重试', 1);
  } finally {
    loading.value = false;
  }
};

onMounted(fetchData);
console.log(competitions.value);

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
    alertBox.value.show(`已导出竞赛: ${ids}`, 0);
};

const batchChangeStatus = () => {
    ElMessageBox.prompt('请选择新的竞赛状态', '批量修改状态', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputType: 'select',
        inputValue: '进行中',
        inputPlaceholder: '请选择状态',
        inputOptions: [
            { value: '进行中', label: '进行中' },
            { value: '报名中', label: '报名中' },
            { value: '未开始', label: '未开始' },
            { value: '已结束', label: '已结束' }
        ]
    }).then(({ value }) => {
        const ids = selectedCompetitions.value.map((competition: any) => competition.id).join(', ');
        alertBox.value.show(`已将竞赛 ${ids} 的状态修改为 ${value}`, 0);
    }).catch(() => {
        alertBox.value.show('已取消操作', 1);
    });
};

const batchDelete = () => {
    const ids = selectedCompetitions.value.map((competition: any) => competition.id).join(', ');
    ElMessageBox.confirm(
        `确定要删除这 ${selectedCompetitions.value.length} 场竞赛吗？此操作不可逆。`,
        '批量删除确认',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
        }
    )
    .then(() => {
        alertBox.value.show(`已删除竞赛: ${ids}`, 0);
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

// 过滤后的竞赛数据
const filteredCompetitions = computed(() => {
    // 首先应用所有过滤条件
    const filtered = competitions.value.filter((competition: any) => {
        // 搜索过滤
        const matchesSearch = searchQuery.value ? 
            competition.title.toLowerCase().includes(searchQuery.value.toLowerCase()) || 
            competition.id.toLowerCase().includes(searchQuery.value.toLowerCase()) : 
            true;
        
        // 状态过滤
        const matchesStatus = statusFilter.value ? 
            competition.status === statusFilter.value : 
            true;
            
        // 日期过滤
        let matchesDate = true;
        if (dateRange.value && dateRange.value.length === 2) {
            const startDate = new Date(dateRange.value[0]);
            const endDate = new Date(dateRange.value[1]);
            const competitionStart = new Date(competition.startTime);
            
            // 设置结束日期为当天最后一刻，以包含整个选择的日期
            endDate.setHours(23, 59, 59, 999);
            
            matchesDate = competitionStart >= startDate && competitionStart <= endDate;
        }
        
        // 参与人数范围过滤
        const matchesParticipants = competition.participantsCount >= participantsRange.value[0] && 
                                competition.participantsCount <= participantsRange.value[1];
        
        // 竞赛时长过滤
        let matchesDuration = true;
        if (durationFilter.value) {
            const startTime = new Date(competition.startTime);
            const endTime = new Date(competition.endTime);
            const durationInDays = (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60 * 24);
            
            switch (durationFilter.value) {
                case '<1':
                    matchesDuration = durationInDays < 1;
                    break;
                case '1-3':
                    matchesDuration = durationInDays >= 1 && durationInDays <= 3;
                    break;
                case '>3':
                    matchesDuration = durationInDays > 3;
                    break;
            }
        }
        
        // 竞赛类型过滤
        const matchesType = competitionTypeFilter.value ? 
            competition.raw?.tags?.some((tag: CompetitionTag) => tag.type === competitionTypeFilter.value) : 
            true;
        
        // 赛制类型过滤
        const matchesMode = competitionModeFilter.value ? 
            competition.raw?.tags?.some((tag: CompetitionTag) => tag.type === competitionModeFilter.value) : 
            true;
        
        return matchesSearch && matchesStatus && matchesDate && 
               matchesParticipants && matchesDuration && matchesType && matchesMode;
    });
    
    // 更新总竞赛数量，用于计算分页
    totalCompetitions.value = filtered.length;
    
    // 应用分页，只返回当前页的数据
    const startIndex = (currentPage.value - 1) * pageSize.value;
    const endIndex = startIndex + pageSize.value;
    return filtered.slice(startIndex, endIndex);
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
        case '未开始': return 'info';
        case '已结束': return 'danger';
        case '报名中': return 'warning';
        default: return 'info';
    }
};

// 分页处理
const handleCurrentChange = (page: number) => {
    currentPage.value = page;
    // 这里应该重新加载数据
};

// 操作方法
const viewCompetitionDetails = (id: string) => {
    alertBox.value.show(`查看竞赛ID: ${id}`, 0);
    // 实际应用中跳转到竞赛详情页
};

const editCompetition = (id: string) => {
    alertBox.value.show(`编辑竞赛ID: ${id}`, 1);
    // 实际应用中跳转到竞赛编辑页
};

const deleteCompetition = (id: string) => {
    ElMessageBox.confirm(
        '确定要删除这个竞赛吗？此操作不可逆。',
        '删除确认',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
        }
    )
    .then(async () => {
        try {
            loading.value = true;
            
            // 从id中提取uid (格式为 "C-123" -> 提取 123)
            const uid = parseInt(id.replace('C-', ''));
            console.log('准备删除竞赛，ID:', id, '提取的UID:', uid);
            
            // 发送删除请求到后端，使用正确的DELETE方法和路径
            const response = await axios({
                url: `http://localhost:5000/api/races/${uid}`,
                method: "delete",
            });
            
            console.log('删除竞赛响应:', response);
            
            // 删除成功，从本地数据中移除该竞赛
            competitions.value = competitions.value.filter(comp => comp.id !== id);
            
            // 显示成功提示
            alertBox.value.show(`竞赛 ${id} 已成功删除`, 0);
            
            // 重新加载数据
            await fetchData();
        } catch (error: any) {
            console.error('删除竞赛失败:', error);
            console.error('错误详情:', error.response?.data || error.message || '未知错误');
            alertBox.value.show(`删除竞赛失败: ${error.response?.data?.message || error.message || '服务器错误'}`, 1);
        } finally {
            loading.value = false;
        }
    })
    .catch(() => {
        alertBox.value.show('已取消删除', 1);
    });
};

// 页面加载时模拟获取数据
onMounted(() => {
    loading.value = true;
    // 模拟异步加载
    setTimeout(() => {
        loading.value = false;
    }, 500);
});

// 计算总页数
const totalPages = computed(() => {
    return Math.ceil(totalCompetitions.value / pageSize.value);
});

// 计算要显示的页码（最多显示5个页码）
const displayedPages = computed(() => {
    const total = totalPages.value;
    const current = currentPage.value;
    const delta = 2; // 当前页前后最多显示的页数
    
    if (total <= 5) {
        // 如果总页数小于等于5，则全部显示
        return Array.from({ length: total }, (_, i) => i + 1);
    }
    
    // 确保current前后都有delta个页码（如果可能）
    let start = Math.max(1, current - delta);
    let end = Math.min(total, current + delta);
    
    // 如果不够5个页码，则调整start或end
    if (end - start + 1 < 5) {
        if (start === 1) {
            end = Math.min(5, total);
        } else if (end === total) {
            start = Math.max(1, total - 4);
        }
    }
    
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
});

// 获取标签类型
const getTagType = (type: string) => {
    switch (type) {
        case 'pending': return 'info';       // 未开始
        case 'registration': return 'info';  // 报名中
        case 'ongoing': return 'success';    // 进行中
        case 'ended': return 'warning';      // 已结束
        case 'individual': return 'success'; // 个人赛
        case 'team': return 'success';       // 团队赛
        case 'oi': return 'primary';         // OI赛制
        case 'acm': return 'primary';        // ACM赛制
        case 'difficulty': return 'danger';  // 难度相关
        case 'category': return 'warning';   // 分类相关
        default: return 'info';
    }
};

// 重置筛选条件
const resetAdvancedSearch = () => {
    searchQuery.value = '';
    statusFilter.value = '';
    dateRange.value = [];
    participantsRange.value = [0, 200];
    durationFilter.value = '';
    competitionTypeFilter.value = '';
    competitionModeFilter.value = '';
    // 立即应用重置的筛选条件
    handleSearch();
};

const applyAdvancedSearch = () => {
    // 应用高级筛选条件
    handleSearch();
    showAdvancedSearch.value = false;
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
    border: 1px solid rgba(24, 160, 88, 0.1);
}

/* 为表格添加行高和单元格内边距控制 */
.competition-table :deep(.el-table__row) {
    height: 60px; /* 统一行高 */
}

.competition-table :deep(.el-table__cell) {
    padding: 8px 0; /* 统一单元格内边距 */
}

/* 统一表头样式 */
.competition-table :deep(.el-table__header-row) {
    height: 56px; /* 表头行高 */
}

.competition-table :deep(.el-table__header-cell) {
    background-color: #f8f9fa;
    font-weight: 600;
    color: #2c3e50;
}

/* 表格中的操作列样式 */
.competition-table :deep(.el-button.el-button--text) {
    padding: 6px 8px;
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
    gap: 8px;
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
</style>

