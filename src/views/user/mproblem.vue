<template>
    <managerhead />
    <div class="manager-container">
        <managerslider />
        <div class="content-container">
            <div class="page-header">
                <div class="header-left">
                    <h2 class="page-title">题库管理</h2>
                    <p class="page-description">管理所有编程题目，包括创建、编辑和删除题目</p>
                </div>
                <div class="header-right">
                    <el-button type="primary" class="create-button">
                        <el-icon class="button-icon"><Plus /></el-icon>
                        <span>创建题目</span>
                    </el-button>
                </div>
            </div>

            <div class="filter-bar">
                <div class="filter-left">
                    <el-input
                        placeholder="搜索题目名称或ID"
                        prefix-icon="Search"
                        v-model="searchQuery"
                        clearable
                        class="search-input"
                        @input="handleSearch"
                    >
                        <template #append>
                            <el-button @click="handleSearch">搜索</el-button>
                        </template>
                    </el-input>
                    <el-button type="primary" plain @click="showAdvancedSearch = !showAdvancedSearch">
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
                        <span class="search-label">难度等级:</span>
                        <el-select v-model="difficultyFilter" placeholder="难度等级" clearable @change="handleSearch">
                            <el-option label="全部" value="" />
                            <el-option label="入门" value="入门" />
                            <el-option label="中等" value="中等" />
                            <el-option label="困难" value="困难" />
                        </el-select>
                    </div>
                    <div class="search-item">
                        <span class="search-label">题目分类:</span>
                        <el-select v-model="categoryFilter" placeholder="题目分类" clearable @change="handleSearch">
                            <el-option label="全部" value="" />
                            <el-option label="算法" value="算法" />
                            <el-option label="数据结构" value="数据结构" />
                            <el-option label="数学" value="数学" />
                            <el-option label="字符串" value="字符串" />
                            <el-option label="动态规划" value="动态规划" />
                        </el-select>
                    </div>
                    <div class="search-item">
                        <span class="search-label">通过率范围:</span>
                        <el-slider
                            v-model="passRateRange"
                            range
                            :min="0"
                            :max="100"
                            :marks="{0: '0%', 25: '25%', 50: '50%', 75: '75%', 100: '100%'}"
                            @change="handleSearch"
                        />
                    </div>
                    <div class="search-item">
                        <span class="search-label">提交次数:</span>
                        <el-select v-model="submissionCountFilter" placeholder="提交次数" clearable @change="handleSearch">
                            <el-option label="全部" value="" />
                            <el-option label="1000以下" value="<1000" />
                            <el-option label="1000-5000" value="1000-5000" />
                            <el-option label="5000-10000" value="5000-10000" />
                            <el-option label="10000以上" value=">10000" />
                        </el-select>
                    </div>
                    <div class="search-item">
                        <span class="search-label">创建时间:</span>
                        <el-date-picker
                            v-model="createTimeRange"
                            type="daterange"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            @change="handleSearch"
                        />
                    </div>
                </div>
            </div>

            <div class="batch-operations" v-if="selectedProblems.length > 0">
                <div class="selected-count">已选择 {{ selectedProblems.length }} 题</div>
                <div class="batch-actions">
                    <el-button type="primary" plain size="small" @click="batchExport">批量导出</el-button>
                    <el-button type="warning" plain size="small" @click="batchChangeCategory">修改分类</el-button>
                    <el-button type="danger" plain size="small" @click="batchDelete">批量删除</el-button>
                </div>
            </div>

            <div class="problem-table">
                <el-table
                    :data="filteredProblems"
                    style="width: 100%"
                    :row-class-name="tableRowClassName"
                    v-loading="loading"
                    @selection-change="handleSelectionChange"
                >
                    <el-table-column type="selection" width="55" />
                    <el-table-column prop="id" label="ID" width="80" />
                    <el-table-column prop="title" label="题目名称" min-width="200">
                        <template #default="scope">
                            <div class="problem-title">
                                <span>{{ scope.row.title }}</span>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="category" label="分类" width="120" />
                    <el-table-column prop="difficulty" label="难度" width="100">
                        <template #default="scope">
                            <el-tag :type="getDifficultyType(scope.row.difficulty)" size="small">
                                {{ scope.row.difficulty }}
                            </el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column prop="passRate" label="通过率" width="100">
                        <template #default="scope">
                            <div class="pass-rate">
                                {{ scope.row.passRate }}%
                                <div class="progress-bar">
                                    <div class="progress" :style="{ width: scope.row.passRate + '%', backgroundColor: getPassRateColor(scope.row.passRate) }"></div>
                                </div>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="submissionCount" label="提交次数" width="120" />
                    <el-table-column prop="createTime" label="创建时间" width="180" />
                    <el-table-column label="操作" width="200" fixed="right">
                        <template #default="scope">
                            <div class="action-buttons">
                                <el-button 
                                    type="primary" 
                                    size="small" 
                                    text
                                    @click="viewProblemDetails(scope.row.id)"
                                >
                                    查看
                                </el-button>
                                <el-button 
                                    type="primary" 
                                    size="small" 
                                    text
                                    @click="editProblem(scope.row.id)"
                                >
                                    编辑
                                </el-button>
                                <el-button 
                                    type="danger" 
                                    size="small" 
                                    text
                                    @click="deleteProblem(scope.row.id)"
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
                    :total="totalProblems"
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
const difficultyFilter = ref('');
const categoryFilter = ref('');
const currentPage = ref(1);
const pageSize = ref(10);
const totalProblems = ref(120);
const showAdvancedSearch = ref(false);
const passRateRange = ref([0, 100]);
const submissionCountFilter = ref('');
const createTimeRange = ref([]);
const selectedProblems = ref([]);
const searchTimeout = ref(null);

// 模拟题目数据
const problems = ref([
    { 
        id: 'P-101', 
        title: '两数之和', 
        category: '算法', 
        difficulty: '简单',
        passRate: 75,
        submissionCount: 12543,
        createTime: '2023-01-10 10:20:30'
    },
    { 
        id: 'P-102', 
        title: '三数之和', 
        category: '算法', 
        difficulty: '中等',
        passRate: 45,
        submissionCount: 8765,
        createTime: '2023-02-15 14:30:00'
    },
    { 
        id: 'P-103', 
        title: '最长回文子串', 
        category: '字符串', 
        difficulty: '中等',
        passRate: 38,
        submissionCount: 7651,
        createTime: '2023-03-05 09:15:45'
    },
    { 
        id: 'P-104', 
        title: '接雨水', 
        category: '动态规划', 
        difficulty: '困难',
        passRate: 22,
        submissionCount: 4532,
        createTime: '2023-04-12 16:40:20'
    },
    { 
        id: 'P-105', 
        title: '二叉树的最大深度', 
        category: '数据结构', 
        difficulty: '简单',
        passRate: 82,
        submissionCount: 9876,
        createTime: '2023-05-20 11:25:00'
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
            difficulty: difficultyFilter.value,
            category: categoryFilter.value,
            passRateRange: passRateRange.value,
            submissionCount: submissionCountFilter.value,
            createTimeRange: createTimeRange.value
        });
        
        // 触发过滤计算
        // 如果是API请求，这里不需要手动触发，因为计算属性会自动重新计算
    }, 300);
};

// 处理表格选择变更
const handleSelectionChange = (selection) => {
    selectedProblems.value = selection;
};

// 批量操作方法
const batchExport = () => {
    const ids = selectedProblems.value.map(problem => problem.id).join(', ');
    ElMessage.success(`已导出题目: ${ids}`);
};

const batchChangeCategory = () => {
    ElMessageBox.prompt('请输入新的分类名称', '批量修改分类', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
    }).then(({ value }) => {
        const ids = selectedProblems.value.map(problem => problem.id).join(', ');
        ElMessage.success(`已将题目 ${ids} 的分类修改为 ${value}`);
    }).catch(() => {
        ElMessage.info('已取消操作');
    });
};

const batchDelete = () => {
    const ids = selectedProblems.value.map(problem => problem.id).join(', ');
    ElMessageBox.confirm(
        `确定要删除这 ${selectedProblems.value.length} 个题目吗？此操作不可逆。`,
        '批量删除确认',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
        }
    )
    .then(() => {
        ElMessage.success(`已删除题目: ${ids}`);
        selectedProblems.value = [];
    })
    .catch(() => {
        ElMessage.info('已取消删除');
    });
};

// 监听筛选条件变化，重置分页
watch([searchQuery, difficultyFilter, categoryFilter, passRateRange, submissionCountFilter, createTimeRange], () => {
    currentPage.value = 1;
});

// 过滤后的题目数据
const filteredProblems = computed(() => {
    return problems.value.filter(problem => {
        // 搜索过滤
        const matchesSearch = searchQuery.value ? 
            problem.title.toLowerCase().includes(searchQuery.value.toLowerCase()) || 
            problem.id.toLowerCase().includes(searchQuery.value.toLowerCase()) : 
            true;
        
        // 难度过滤
        const matchesDifficulty = difficultyFilter.value ? 
            problem.difficulty === difficultyFilter.value : 
            true;
            
        // 分类过滤
        const matchesCategory = categoryFilter.value ? 
            problem.category === categoryFilter.value : 
            true;
            
        // 通过率范围过滤
        const matchesPassRate = problem.passRate >= passRateRange.value[0] && 
                                problem.passRate <= passRateRange.value[1];
                                
        // 提交次数过滤
        let matchesSubmissionCount = true;
        if (submissionCountFilter.value) {
            const count = problem.submissionCount;
            switch (submissionCountFilter.value) {
                case '<1000':
                    matchesSubmissionCount = count < 1000;
                    break;
                case '1000-5000':
                    matchesSubmissionCount = count >= 1000 && count <= 5000;
                    break;
                case '5000-10000':
                    matchesSubmissionCount = count > 5000 && count <= 10000;
                    break;
                case '>10000':
                    matchesSubmissionCount = count > 10000;
                    break;
            }
        }
        
        // 创建时间范围过滤
        let matchesCreateTime = true;
        if (createTimeRange.value && createTimeRange.value.length === 2) {
            const createDate = new Date(problem.createTime);
            const startDate = new Date(createTimeRange.value[0]);
            const endDate = new Date(createTimeRange.value[1]);
            
            // 设置结束日期为当天最后一刻，以包含整个选择的日期
            endDate.setHours(23, 59, 59, 999);
            
            matchesCreateTime = createDate >= startDate && createDate <= endDate;
        }
        
        return matchesSearch && matchesDifficulty && matchesCategory && 
               matchesPassRate && matchesSubmissionCount && matchesCreateTime;
    });
});

// 表格行样式
const tableRowClassName = () => {
    return '';
};

// 获取难度标签类型
const getDifficultyType = (difficulty: string) => {
    switch (difficulty) {
        case '简单': return 'success';
        case '中等': return 'warning';
        case '困难': return 'danger';
        default: return 'info';
    }
};

// 获取通过率颜色
const getPassRateColor = (rate: number) => {
    if (rate >= 70) return '#67C23A';
    if (rate >= 40) return '#E6A23C';
    return '#F56C6C';
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
const viewProblemDetails = (id: string) => {
    ElMessage.success(`查看题目ID: ${id}`);
    // 实际应用中跳转到题目详情页
};

const editProblem = (id: string) => {
    ElMessage.info(`编辑题目ID: ${id}`);
    // 实际应用中跳转到题目编辑页
};

const deleteProblem = (id: string) => {
    ElMessageBox.confirm(
        '确定要删除这个题目吗？此操作不可逆。',
        '删除确认',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
        }
    )
    .then(() => {
        // 实际应用中发送删除请求
        ElMessage.success(`题目 ${id} 已成功删除`);
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
}

.selected-count {
    font-size: 14px;
    color: #909399;
}

.batch-actions {
    display: flex;
    gap: 8px;
}

.problem-table {
    background: white;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
    margin-bottom: 24px;
}

.problem-title {
    display: flex;
    align-items: center;
    gap: 8px;
}

.pass-rate {
    display: flex;
    flex-direction: column;
    font-size: 14px;
}

.progress-bar {
    width: 100%;
    height: 4px;
    background-color: #f0f0f0;
    border-radius: 2px;
    margin-top: 4px;
    overflow: hidden;
}

.progress {
    height: 100%;
    border-radius: 2px;
    transition: width 0.3s ease;
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
:deep(.featured-row) {
    background-color: transparent;
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
}

.button-icon {
    margin-right: 4px;
    display: flex;
}
</style>