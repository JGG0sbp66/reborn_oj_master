<template>
    <managerhead />
    <div class="manager-container">
        <managerslider />
        <div class="content-container">
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
                <div class="advanced-search-content">
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
                    <div class="search-item">
                        <span class="search-label">参与人数范围:</span>
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
                <el-pagination
                    background
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="totalCompetitions"
                    :page-size="pageSize"
                    :current-page="currentPage"
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import managerslider from '@/components/zq/manager-slider.vue';
import managerhead from '@/components/zq/manager-head.vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Plus, Search, ArrowUp, ArrowDown } from '@element-plus/icons-vue';

// 页面状态
const loading = ref(false);
const searchQuery = ref('');
const statusFilter = ref('');
const dateRange = ref([]);
const currentPage = ref(1);
const pageSize = ref(10);
const totalCompetitions = ref(100);
const showAdvancedSearch = ref(false);
const participantsRange = ref([0, 200]);
const durationFilter = ref('');
const selectedCompetitions = ref([]);
const searchTimeout = ref(null);

// 模拟竞赛数据
const competitions = ref([
    { 
        id: 'C-256', 
        title: '周末算法挑战赛', 
        participantsCount: 128, 
        startTime: '2023-12-02 09:00:00', 
        endTime: '2023-12-03 18:00:00',
        status: '进行中'
    },
    { 
        id: 'C-257', 
        title: '高校编程大赛预选赛', 
        participantsCount: 256, 
        startTime: '2023-11-25 13:30:00', 
        endTime: '2023-11-26 13:30:00',
        status: '已结束'
    },
    { 
        id: 'C-258', 
        title: '新手入门编程竞赛', 
        participantsCount: 85, 
        startTime: '2023-12-10 10:00:00', 
        endTime: '2023-12-10 18:00:00',
        status: '报名中'
    },
    { 
        id: 'C-259', 
        title: '冬季算法竞赛', 
        participantsCount: 0, 
        startTime: '2023-12-15 09:30:00', 
        endTime: '2023-12-17 18:00:00',
        status: '未开始'
    },
    { 
        id: 'C-260', 
        title: '企业编程挑战赛', 
        participantsCount: 156, 
        startTime: '2023-11-18 14:00:00', 
        endTime: '2023-11-19 14:00:00',
        status: '已结束'
    }
]);

// 处理延迟搜索，避免频繁过滤
const handleSearch = () => {
    if (searchTimeout.value) {
        clearTimeout(searchTimeout.value);
    }
    
    searchTimeout.value = setTimeout(() => {
        // 在实际应用中，这里可能会发送API请求
        console.log('搜索条件:', {
            searchQuery: searchQuery.value,
            status: statusFilter.value,
            dateRange: dateRange.value,
            participantsRange: participantsRange.value,
            durationFilter: durationFilter.value
        });
        
        // 触发过滤计算
        // 如果是API请求，这里不需要手动触发，因为计算属性会自动重新计算
    }, 300);
};

// 处理表格选择变更
const handleSelectionChange = (selection) => {
    selectedCompetitions.value = selection;
};

// 批量操作方法
const batchExport = () => {
    const ids = selectedCompetitions.value.map(competition => competition.id).join(', ');
    ElMessage.success(`已导出竞赛: ${ids}`);
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
        const ids = selectedCompetitions.value.map(competition => competition.id).join(', ');
        ElMessage.success(`已将竞赛 ${ids} 的状态修改为 ${value}`);
    }).catch(() => {
        ElMessage.info('已取消操作');
    });
};

const batchDelete = () => {
    const ids = selectedCompetitions.value.map(competition => competition.id).join(', ');
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
        ElMessage.success(`已删除竞赛: ${ids}`);
        selectedCompetitions.value = [];
    })
    .catch(() => {
        ElMessage.info('已取消删除');
    });
};

// 监听筛选条件变化，重置分页
watch([searchQuery, statusFilter, dateRange, participantsRange, durationFilter], () => {
    currentPage.value = 1;
});

// 过滤后的竞赛数据
const filteredCompetitions = computed(() => {
    return competitions.value.filter(competition => {
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
        
        return matchesSearch && matchesStatus && matchesDate && 
               matchesParticipants && matchesDuration;
    });
});

// 表格行样式
const tableRowClassName = ({ row }) => {
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
        case '已结束': return 'info';
        case '报名中': return 'success';
        default: return 'info';
    }
};

// 分页处理
const handleSizeChange = (size: number) => {
    pageSize.value = size;
    // 这里应该重新加载数据
};

const handleCurrentChange = (page: number) => {
    currentPage.value = page;
    // 这里应该重新加载数据
};

// 操作方法
const viewCompetitionDetails = (id: string) => {
    ElMessage.success(`查看竞赛ID: ${id}`);
    // 实际应用中跳转到竞赛详情页
};

const editCompetition = (id: string) => {
    ElMessage.info(`编辑竞赛ID: ${id}`);
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
    .then(() => {
        // 实际应用中发送删除请求
        ElMessage.success(`竞赛 ${id} 已成功删除`);
    })
    .catch(() => {
        ElMessage.info('已取消删除');
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
</script>

<style scoped>
.manager-container {
    display: flex;
    min-height: calc(100vh - 80px);
    margin-top: 80px;
}

.content-container {
    flex: 1;
    padding: 24px;
    margin-left: 220px;
    transition: all 0.3s;
}

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
    border-radius: 8px;
    padding: 16px;
    margin-bottom: 24px;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
    border-left: 3px solid rgba(24, 160, 88, 0.3);
}

.advanced-search-content {
    display: flex;
    flex-wrap: wrap;
    gap: 24px;
}

.search-item {
    display: flex;
    align-items: center;
    gap: 12px;
    min-width: 300px;
}

.search-item :deep(.el-slider) {
    width: 100%;
    margin-left: 0;
}

.search-item :deep(.el-slider__runway) {
    margin: 16px 0;
}

.search-label {
    font-size: 14px;
    color: #606266;
    white-space: nowrap;
    min-width: 80px;
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

.competition-title {
    display: flex;
    align-items: center;
    gap: 8px;
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

.search-input :deep(.el-input__wrapper.is-focus) {
    box-shadow: 0 0 0 1px #18a058 inset;
}

.search-input :deep(.el-input__wrapper:hover) {
    box-shadow: 0 0 0 1px #18a058 inset;
}

.search-item :deep(.el-select .el-input__wrapper.is-focus) {
    box-shadow: 0 0 0 1px #18a058 inset;
}

.search-item :deep(.el-select .el-input__wrapper:hover) {
    box-shadow: 0 0 0 1px #18a058 inset;
}

.search-item :deep(.el-select-dropdown__item.selected) {
    color: #18a058;
}

.search-item :deep(.el-slider__runway.show-input) {
    margin-right: 160px;
}

.search-item :deep(.el-slider__bar) {
    background-color: #18a058;
}

.search-item :deep(.el-slider__button) {
    border-color: #18a058;
}

.search-item :deep(.el-date-editor .el-input__wrapper.is-focus) {
    box-shadow: 0 0 0 1px #18a058 inset;
}

.search-item :deep(.el-date-editor .el-input__wrapper:hover) {
    box-shadow: 0 0 0 1px #18a058 inset;
}
</style>
