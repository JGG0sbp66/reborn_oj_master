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
                <div class="pagination">
                    <button class="page-btn prev-btn" :disabled="currentPage === 1" @click="handleCurrentChange(currentPage - 1)">
                        <span class="chevron-left"></span>
                    </button>
                    <div class="page-numbers">
                        <button 
                            v-for="num in totalPages" 
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
import { Plus, Search, ArrowUp, ArrowDown } from '@element-plus/icons-vue';
import AlertBox from '../JGG/alertbox.vue';

// AlertBox引用
const alertBox = ref(null);

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
const handleSelectionChange = (selection: any[]) => {
    selectedCompetitions.value = selection;
};

// 批量操作方法
const batchExport = () => {
    const ids = selectedCompetitions.value.map((competition: any) => competition.id).join(', ');
    // ElMessage.success(`已导出竞赛: ${ids}`);
    alertBox.value.show(`已导出竞赛: ${ids}`, 0);
};

const batchChangeStatus = () => {
    // 由于 ElMessageBox.prompt 的类型问题暂不好修复，可以使用 @ts-ignore 暂时忽略
    // @ts-ignore - Element Plus type definition issue
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
watch([searchQuery, statusFilter, dateRange, participantsRange, durationFilter], () => {
    currentPage.value = 1;
});

// 过滤后的竞赛数据
const filteredCompetitions = computed(() => {
    return competitions.value.filter((competition: any) => {
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
        case '已结束': return 'info';
        case '报名中': return 'success';
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
    .then(() => {
        alertBox.value.show(`竞赛 ${id} 已成功删除`, 0);
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

