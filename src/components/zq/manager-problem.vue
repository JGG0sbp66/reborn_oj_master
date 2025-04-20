<template>
    <div class="page-header">
        <div class="header-left">
            <h2 class="page-title">题库管理</h2>
            <p class="page-description">管理所有编程题目，包括创建、编辑和删除题目</p>
        </div>
        <div class="header-right">
            <el-button type="primary" class="create-button" @click="openCreateDialog">
                <el-icon class="button-icon">
                    <Plus />
                </el-icon>
                <span>创建题目</span>
            </el-button>
        </div>
    </div>

    <AlertBox ref="alertBox" />
    <ProblemCreate ref="problemCreateRef" :alertBoxRef="alertBox" @refreshData="fetchData" />
    <ProblemEdit ref="problemEditRef" :alertBoxRef="alertBox" :defaultExamples="defaultExamples"
        @refreshData="fetchData" />
    <ProblemDetail ref="problemDetailRef" :alertBoxRef="alertBox" @editProblem="handleEditFromDetail" />

    <div class="filter-bar">
        <div class="filter-left">
            <el-input placeholder="搜索题目名称或ID" prefix-icon="Search" v-model="searchQuery" clearable class="search-input"
                @input="handleSearch">
                <template #append>
                    <el-button @click="handleSearch"
                        style="background-color: #18a058; border-color: #18a058; color: white;">搜索</el-button>
                </template>
            </el-input>
            <el-button type="primary" plain @click="showAdvancedSearch = !showAdvancedSearch"
                style="background-color: rgba(24, 160, 88, 0.05); border-color: #18a05880; color: #18a058;">
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
                    <el-icon>
                        <Refresh />
                    </el-icon> 重置筛选
                </el-button>
            </div>
            <div class="advanced-search-content">
                <div class="search-row">
                    <div class="search-item">
                        <span class="search-label">题目标签:</span>
                        <el-select v-model="difficultyFilter" placeholder="题目标签" clearable @change="handleSearch"
                            class="tag-select">
                            <el-option label="全部" value="">
                                <div style="margin-left: -5px;" class="difficulty-option">
                                    <span>全部</span>
                                </div>
                            </el-option>
                            <el-option label="入门" value="入门">
                                <div class="difficulty-option">
                                    <div class="difficulty-indicator easy"></div>
                                    <span>入门</span>
                                </div>
                            </el-option>
                            <el-option label="普及" value="普及">
                                <div class="difficulty-option">
                                    <div class="difficulty-indicator popularize"></div>
                                    <span>普及</span>
                                </div>
                            </el-option>
                            <el-option label="提高" value="提高">
                                <div class="difficulty-option">
                                    <div class="difficulty-indicator improve"></div>
                                    <span>提高</span>
                                </div>
                            </el-option>
                            <el-option label="省选" value="省选">
                                <div class="difficulty-option">
                                    <div class="difficulty-indicator provincial"></div>
                                    <span>省选</span>
                                </div>
                            </el-option>
                            <el-option label="NOI" value="NOI">
                                <div class="difficulty-option">
                                    <div class="difficulty-indicator noi"></div>
                                    <span>NOI</span>
                                </div>
                            </el-option>
                            <el-option label="CTSC" value="CTSC">
                                <div class="difficulty-option">
                                    <div class="difficulty-indicator ctsc"></div>
                                    <span>CTSC</span>
                                </div>
                            </el-option>
                        </el-select>
                    </div>
                </div>
                <div class="search-item full-width">
                    <span class="search-label">通过率范围:</span>
                    <el-slider v-model="passRateRange" range :min="0" :max="100"
                        :marks="{ 0: '0%', 25: '25%', 50: '50%', 75: '75%', 100: '100%' }" @change="handleSearch"
                        style="flex: 1;" />
                </div>
                <div class="search-row">
                    <div class="search-item">
                        <span class="search-label">提交次数:</span>
                        <el-select v-model="submissionCountFilter" placeholder="提交次数" clearable @change="handleSearch"
                            class="submission-select">
                            <el-option label="全部" value="" />
                            <el-option label="1000以下" value="<1000" />
                            <el-option label="1000-5000" value="1000-5000" />
                            <el-option label="5000-10000" value="5000-10000" />
                            <el-option label="10000以上" value=">10000" />
                        </el-select>
                    </div>
                    <div class="search-item">
                        <span class="search-label">创建时间:</span>
                        <el-date-picker v-model="createTimeRange" type="daterange" range-separator="至"
                            start-placeholder="开始日期" end-placeholder="结束日期" format="YYYY-MM-DD" @change="handleSearch"
                            style="flex: 1;" />
                    </div>
                </div>
            </div>
            <div class="advanced-search-footer">
                <div class="search-result-info">已筛选出 {{ totalProblems }} 道题目</div>
                <div class="search-actions">
                    <el-button type="primary" @click="applyAdvancedSearch">应用</el-button>
                </div>
            </div>
        </div>
    </transition>

    <div class="batch-operations" v-if="selectedProblems.length > 0">
        <div class="selected-count">已选择 {{ selectedProblems.length }} 题</div>
        <!-- <div class="batch-actions">
            <el-button type="primary" plain size="small" @click="batchExport">批量导出</el-button>
            <el-button type="warning" plain size="small" @click="batchChangeCategory">修改分类</el-button>
            <el-button type="danger" plain size="small" @click="batchDelete">批量删除</el-button>
        </div> -->
    </div>

    <div class="problem-table">
        <el-table :data="filteredProblems" style="width: 100%" :row-class-name="tableRowClassName" v-loading="loading"
            @selection-change="handleSelectionChange" :border="false" stripe
            :cell-style="{ textAlign: 'center', padding: '12px 0' }"
            :header-cell-style="{ backgroundColor: '#f8f9fa', color: '#2c3e50', fontWeight: '600' }"
            :show-overflow-tooltip="false" :max-height="'none'" :height="'auto'">
            <el-table-column type="selection" width="50" align="center" />
            <el-table-column prop="id" label="ID" width="90" align="center" />
            <el-table-column prop="title" label="题目名称" min-width="220" align="left">
                <template #default="scope">
                    <div class="problem-title">
                        <span>{{ scope.row.title }}</span>
                        <div class="problem-meta" v-if="scope.row.description">
                            <span class="meta-item">
                                <el-icon>
                                    <Timer />
                                </el-icon>
                                {{ scope.row.time_limit || 1000 }}ms
                            </span>
                            <span class="meta-item">
                                <el-icon>
                                    <Collection />
                                </el-icon>
                                {{ scope.row.memory_limit || 128 }}MB
                            </span>
                        </div>
                    </div>
                </template>
            </el-table-column>
            <el-table-column prop="topic" label="标签" width="120" align="center">
                <template #default="scope">
                    <el-tag size="small" :type="getTagType(scope.row.topic)">{{ scope.row.topic }}</el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="passRate" label="通过率" width="100" align="center">
                <template #default="scope">
                    <div class="pass-rate">
                        {{ scope.row.passRate }}%
                        <div class="progress-bar">
                            <div class="progress"
                                :style="{ width: scope.row.passRate + '%', backgroundColor: getPassRateColor(scope.row.passRate) }">
                            </div>
                        </div>
                    </div>
                </template>
            </el-table-column>
            <el-table-column prop="submissionCount" label="提交次数" width="120" align="center" />
            <el-table-column prop="createTime" label="创建时间" width="170" align="center" />
            <el-table-column label="操作" width="180" fixed="right" align="center">
                <template #default="scope">
                    <div class="action-buttons">
                        <el-button type="primary" size="small" text @click="viewProblemDetails(scope.row.id)">
                            查看
                        </el-button>
                        <el-button type="primary" size="small" text @click="editProblem(scope.row.id)">
                            编辑
                        </el-button>
                        <el-button type="danger" size="small" text @click="deleteProblem(scope.row.id)">
                            删除
                        </el-button>
                    </div>
                </template>
            </el-table-column>
        </el-table>
    </div>

    <div class="pagination-container">
        <div class="pagination">
            <button class="page-btn prev-btn" :disabled="currentPage === 1"
                @click="handleCurrentChange(currentPage - 1)">
                <span class="chevron-left"></span>
            </button>
            <div class="page-numbers">
                <!-- 始终显示第一页 -->
                <button class="page-number" :class="{ active: currentPage === 1 }" @click="handleCurrentChange(1)">
                    1
                </button>
                
                <!-- 如果当前页前面有很多页，显示省略号 -->
                <span class="page-ellipsis" v-if="currentPage > 4">...</span>
                
                <!-- 显示当前页附近的页码 -->
                <button v-for="num in displayedMiddlePages" :key="num" class="page-number"
                    :class="{ active: currentPage === num }" @click="handleCurrentChange(num)">
                    {{ num }}
                </button>
                
                <!-- 如果当前页后面有很多页，显示省略号 -->
                <span class="page-ellipsis" v-if="currentPage < totalPages - 3">...</span>
                
                <!-- 始终显示最后一页，除非总页数为1 -->
                <button v-if="totalPages > 1" class="page-number" :class="{ active: currentPage === totalPages }" 
                    @click="handleCurrentChange(totalPages)">
                    {{ totalPages }}
                </button>
            </div>
            <button class="page-btn next-btn" :disabled="currentPage === totalPages"
                @click="handleCurrentChange(currentPage + 1)">
                <span class="chevron-right"></span>
            </button>
        </div>
    </div>

</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Plus, Search, ArrowUp, ArrowDown, Refresh, Timer, Collection } from '@element-plus/icons-vue';
import AlertBox from '../JGG/alertbox.vue';
import axios from 'axios';
import ProblemCreate from './problem-create.vue';
import ProblemEdit from './problem-edit.vue';
import ProblemDetail from './problem-detail.vue';

/* eslint-disable */

// 定义题目类型接口
interface Example {
    input: string;
    output: string;
    explanation: string;
}

// 定义题目数据结构
interface QuestionData {
    id: number;
    title: string;
    description: string;
    time_limit: number;
    memory_limit: number;
    input_format: string;
    output_format: string;
    constraints: string[];
    examples: Example[];
}

interface ApiProblem {
    id: number;
    question: QuestionData;
    topic: string;
}

// AlertBox引用
const alertBox = ref(null);

// 在script setup部分添加组件引用
const problemCreateRef = ref(null);
const problemEditRef = ref(null);
const problemDetailRef = ref(null);

// 页面状态
const loading = ref(false);
const searchQuery = ref('');
const difficultyFilter = ref('');
const categoryFilter = ref('');
const currentPage = ref(1);
const pageSize = ref(8);
const totalProblems = ref(120);
const showAdvancedSearch = ref(false);
const passRateRange = ref([0, 100]);
const submissionCountFilter = ref('');
const createTimeRange = ref([]);
const selectedProblems = ref([]);
const searchTimeout = ref(null);

// 模拟题目数据
const problems = ref([]);
const get_problem_info = async (): Promise<ApiProblem[]> => {
    const { data: userData } = await axios({
        url: "http://localhost:5000/api/admin-question",
        method: "get",
    });
    return userData;
};

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
const handleSelectionChange = (selection: any[]) => {
    selectedProblems.value = selection;
};

// 批量操作方法
const batchExport = () => {
    const ids = selectedProblems.value.map((problem: any) => problem.id).join(', ');
    alertBox.value.show(`已导出题目: ${ids}`, 0);
};

const batchChangeCategory = () => {
    ElMessageBox.prompt('请输入新的分类名称', '批量修改分类', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
    }).then(({ value }) => {
        const ids = selectedProblems.value.map((problem: any) => problem.id).join(', ');
        alertBox.value.show(`已将题目 ${ids} 的分类修改为 ${value}`, 0);
    }).catch(() => {
        alertBox.value.show('已取消操作', 1);
    });
};

// 监听筛选条件变化，重置分页
watch([searchQuery, difficultyFilter, categoryFilter, passRateRange, submissionCountFilter, createTimeRange], () => {
    currentPage.value = 1;
});

// 获取题目数据
const fetchData = async () => {
    loading.value = true;
    try {
        // 从API获取数据
        const apiData = await get_problem_info();
        
        // 打印原始数据，便于调试
        console.log('API返回的原始数据:', JSON.stringify(apiData, null, 2));

        // 处理API返回的数据，转换为组件需要的格式
        const formattedProblems = apiData.map((item, index) => {
            // 生成一个随机的通过率和提交次数（实际应用中这些应该从API获取）
            const passRate = Math.floor(Math.random() * 100);
            const submissionCount = Math.floor(Math.random() * 10000) + 1000;

            // 从API返回数据中获取ID，根据截图显示的真实数据格式
            // 优先使用item本身的id，如果不存在则使用索引+1001作为备选
            const problemId = item.id || (1001 + index);
            
            // 记录每个题目处理的详细信息
            console.log(`处理题目 ${index}:`, {
                原始ID: item.id,
                使用的ID: problemId,
                题目名称: item.question.title
            });
            
            return {
                id: `P${problemId}`, // 使用带前缀的ID格式
                title: item.question.title,
                topic: item.topic || '未分类',
                difficulty: getDifficultyByComplexity(item.question), // 根据题目复杂度推断难度
                passRate: passRate,
                submissionCount: submissionCount,
                createTime: new Date().toISOString().split('T')[0], // 使用当前日期
                question: item.question
            };
        });

        // 对题目按ID排序
        formattedProblems.sort((a, b) => {
            const numA = parseInt(a.id.replace('P', ''));
            const numB = parseInt(b.id.replace('P', ''));
            return numA - numB;
        });

        // 打印处理后的数据
        console.log('处理后的题目数据:', formattedProblems);

        problems.value = formattedProblems;

        // 显示提示信息
        if (formattedProblems.length > 0) {
            console.log(`成功加载了 ${formattedProblems.length} 个题目`);
        } else {
            console.log('没有找到任何题目');
        }

    } catch (error) {
        console.error('获取题目数据失败:', error);
        // 发生错误时显示提示
        alertBox.value?.show('获取题目数据失败，请稍后重试', 1);

        // 如果API调用失败，使用空数组
        problems.value = [];
    } finally {
        // 延迟关闭loading，提升用户体验
        setTimeout(() => {
            loading.value = false;
        }, 500);
    }
};

// 根据题目复杂度推断难度
const getDifficultyByComplexity = (question: QuestionData): string => {
    // 基于题目的约束条件、时间和内存限制等推断难度
    const constraints = question.constraints || [];
    const timeLimit = question.time_limit || 1000;
    const memoryLimit = question.memory_limit || 128;

    // 简单的难度判断逻辑（实际应用中可能需要更复杂的判断）
    if (timeLimit <= 500 && memoryLimit <= 64) {
        return '入门';
    } else if (timeLimit <= 1000 && memoryLimit <= 128) {
        return '普及';
    } else if (timeLimit <= 2000 && memoryLimit <= 256) {
        return '提高';
    } else if (timeLimit <= 5000 && memoryLimit <= 512) {
        return '省选';
    } else {
        return 'NOI';
    }
};

// 页面加载时获取数据
onMounted(fetchData);

// 排序相关变量
const sortBy = ref('id');
const sortOrder = ref('ascending');

// 切换排序
const toggleSort = (column: string) => {
    if (sortBy.value === column) {
        // 如果已经按这个列排序，则切换排序方向
        sortOrder.value = sortOrder.value === 'ascending' ? 'descending' : 'ascending';
    } else {
        // 否则，设置新的排序列并默认使用降序
        sortBy.value = column;
        sortOrder.value = 'ascending';
    }
};

// 过滤后的题目数据
const filteredProblems = computed(() => {
    // 先应用所有过滤条件
    const filtered = problems.value.filter((problem: any) => {
        // 搜索过滤
        const matchesSearch = searchQuery.value ?
            problem.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
            problem.id.toLowerCase().includes(searchQuery.value.toLowerCase()) :
            true;

        // 难度过滤 - 修改这里使用topic而不是difficulty
        const matchesDifficulty = difficultyFilter.value ?
            problem.topic === difficultyFilter.value :
            true;

        // 分类过滤
        const matchesCategory = categoryFilter.value ?
            problem.topic === categoryFilter.value :
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

    // 更新总题目数量，用于计算分页
    totalProblems.value = filtered.length;

    // 对过滤后的数据进行排序
    const sorted = [...filtered].sort((a, b) => {
        // 特殊处理ID排序
        if (sortBy.value === 'id') {
            const numA = parseInt(a.id.replace('P', ''));
            const numB = parseInt(b.id.replace('P', ''));
            return sortOrder.value === 'ascending' ? numA - numB : numB - numA;
        }

        let aValue = a[sortBy.value];
        let bValue = b[sortBy.value];

        // 特殊处理日期类型
        if (sortBy.value === 'createTime') {
            aValue = new Date(aValue).getTime();
            bValue = new Date(bValue).getTime();
        }

        // 根据排序方向返回比较结果
        if (sortOrder.value === 'ascending') {
            return aValue > bValue ? 1 : -1;
        } else {
            return aValue < bValue ? 1 : -1;
        }
    });

    // 应用分页，只返回当前页的数据
    const startIndex = (currentPage.value - 1) * pageSize.value;
    const endIndex = startIndex + pageSize.value;
    return sorted.slice(startIndex, endIndex);
});

// 表格行样式
const tableRowClassName = () => {
    return '';
};

// 获取难度标签类型
const getDifficultyType = (difficulty: string) => {
    switch (difficulty) {
        case '入门': return 'success';
        case '普及': return 'success';
        case '提高': return 'warning';
        case '省选': return 'warning';
        case 'NOI': return 'danger';
        case 'CTSC': return 'danger';
        default: return 'info';
    }
};

// 获取标签类型
const getTagType = (tag: string) => {
  switch (tag) {
    case '入门': return 'success';  // 对应 :deep(.el-tag--success)
    case '普及': return 'warning';  // 对应 :deep(.el-tag--warning)
    case '提高': return 'info';     // 对应 :deep(.el-tag--info)
    case '省选': return 'primary';  // 对应 :deep(.el-tag--primary)
    case 'NOI': return 'danger';    // 对应 :deep(.el-tag--danger)
    case 'CTSC': return 'ctsc';     // 对应 :deep(.el-tag--ctsc)
    default: return 'info';
  }
};

// 获取通过率颜色
const getPassRateColor = (rate: number) => {
    if (rate >= 70) return '#18a058';  // 蓝绿色
    if (rate >= 40) return '#18a05880'; // 半透明蓝绿色
    return '#F56C6C';
};

// 分页处理
const handleCurrentChange = (page: number) => {
    currentPage.value = page;
    // 这里应该重新加载数据
};

// 操作方法
const viewProblemDetails = (id: string) => {
    // 打开题目详情对话框
    if (problemDetailRef.value) {
        const problem = problems.value.find((p: any) => p.id === id);
        if (problem) {
            problemDetailRef.value.openDetailDialog(id);
        }
    }
};

const editProblem = (id: string) => {
    // 打开编辑题目对话框
    if (problemEditRef.value) {
        const problem = problems.value.find((p: any) => p.id === id);
        if (problem) {
            // 转换数据格式以匹配problem-edit.vue期望的格式
            const editData = {
                id: problem.id,
                title: problem.question.title || problem.title,
                description: problem.question.description || '',
                topic: problem.topic || '入门',
                time_limit: problem.question.time_limit || 1000,
                memory_limit: problem.question.memory_limit || 128,
                input_format: problem.question.input_format || '',
                output_format: problem.question.output_format || '',
                constraints: problem.question.constraints || [],
                examples: problem.question.examples || [],
                passRate: problem.passRate,
                submissionCount: problem.submissionCount,
                createTime: problem.createTime
            };

            console.log('准备编辑题目数据:', JSON.stringify(editData));
            problemEditRef.value.openEditDialog(editData);
        }
    }
};

// 从详情页面打开编辑对话框
const handleEditFromDetail = (problemData: any) => {
    if (problemEditRef.value) {
        // 转换数据格式以匹配problem-edit.vue期望的格式
        const editData = {
            id: problemData.uid,
            title: problemData.title || '',
            description: problemData.description || '',
            topic: problemData.topic || '入门',
            time_limit: problemData.time_limit || 1000,
            memory_limit: problemData.memory_limit || 128,
            input_format: problemData.input_format || '',
            output_format: problemData.output_format || '',
            constraints: problemData.constraints || [],
            examples: problemData.examples || [],
            passRate: problemData.passRate,
            submissionCount: problemData.submissionCount,
            createTime: problemData.createTime
        };

        console.log('从详情页准备编辑题目数据:', JSON.stringify(editData));
        problemEditRef.value.openEditDialog(editData);
    }
};

// 打开创建题目对话框
const openCreateDialog = () => {
    if (problemCreateRef.value) {
        problemCreateRef.value.openCreateDialog();
    }
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
        .then(async () => {
            try {
                // 从ID中提取实际数字部分
                // P1XXX格式，需要提取出XXX部分对应的数字
                const matches = id.match(/P1(\d+)/);
                const numericId = matches ? parseInt(matches[1], 10) : 0;

                console.log(`正在删除题目，原始ID: ${id}, 实际ID: ${numericId}`);

                // 使用实际ID调用接口
                const response = await axios({
                    url: `http://localhost:5000/api/admin-question/${numericId}`,
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                // 成功删除
                console.log('删除响应:', response);

                // 从本地数据中移除已删除的题目
                problems.value = problems.value.filter((p: any) => p.id !== id);
                totalProblems.value -= 1;

                // 显示成功消息
                alertBox.value.show(`题目 ${id} 已成功删除`, 0);

                // 如果当前页没有数据了且不是第一页，则跳转到前一页
                if (filteredProblems.value.length === 0 && currentPage.value > 1) {
                    currentPage.value -= 1;
                }

                // 重新加载数据
                fetchData();
            } catch (error: any) {
                console.error('删除题目失败:', error);
                alertBox.value.show(`删除题目失败: ${error.response?.data?.message || error.message || '未知错误'}`, 2);
            }
        })
        .catch(() => {
            alertBox.value.show('已取消删除', 1);
        });
};

// 计算总页数
const totalPages = computed(() => {
    return Math.ceil(totalProblems.value / pageSize.value);
});

// 计算要显示的中间页码
const displayedMiddlePages = computed(() => {
    const total = totalPages.value;
    const current = currentPage.value;
    
    // 如果总页数很少，不需要处理
    if (total <= 7) {
        // 排除第一页和最后一页，因为它们会单独显示
        return Array.from({ length: total - 2 }, (_, i) => i + 2).filter(page => page > 0 && page < total);
    }
    
    // 处理中间页码逻辑
    let startPage, endPage;
    
    if (current <= 4) {
        // 靠近开始的页面，显示2~5
        startPage = 2;
        endPage = 5;
    } else if (current >= total - 3) {
        // 靠近结束的页面，显示倒数4个页面中的中间2个
        startPage = total - 4;
        endPage = total - 1;
    } else {
        // 在中间，显示当前页和它的前后页
        startPage = current - 1;
        endPage = current + 1;
    }
    
    // 确保在有效范围内
    startPage = Math.max(2, startPage);
    endPage = Math.min(total - 1, endPage);
    
    return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
});

// 重置筛选条件
const resetAdvancedSearch = () => {
    searchQuery.value = '';
    difficultyFilter.value = '';
    categoryFilter.value = '';
    passRateRange.value = [0, 100];
    submissionCountFilter.value = '';
    createTimeRange.value = [];
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

.reset-btn {
    color: #18a058;
    font-size: 14px;
    padding: 0;
    display: flex;
    align-items: center;
    gap: 4px;
}

.reset-btn:hover {
    color: #35b371;
}

.advanced-search-content {
    display: flex;
    flex-direction: column;
    gap: 16px;
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

.search-item.full-width {
    width: 100%;
}

.search-label {
    font-size: 14px;
    color: #606266;
    white-space: nowrap;
    min-width: 80px;
}

/* 重新设计的难度选择器样式 */
.tag-select {
    width: 200px !important;
}

.difficulty-option {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 8px 12px;
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    border-radius: 4px;
    cursor: pointer;
    margin-left: -20px; /* 向左对齐 */
    width: calc(100% + 24px); /* 确保宽度填满 */
}

.difficulty-option:hover {
    transform: translateY(-2px);
    background-color: rgba(24, 160, 88, 0.08);
}

.difficulty-indicator {
    width: 4px;
    height: 20px;
    border-radius: 2px;
    transition: all 0.3s ease;
    flex-shrink: 0; /* 防止压缩 */
}

/* 让选项文本垂直居中 */
.difficulty-option span {
    display: flex;
    align-items: center;
    height: 20px;
}

.difficulty-indicator.easy { background-color: #fe4c61; }
.difficulty-indicator.popularize { background-color: #f39c11; }
.difficulty-indicator.improve { background-color: #ffc116; }
.difficulty-indicator.provincial { background-color: #52c41a; }
.difficulty-indicator.noi { background-color: #9d3dcf; }
.difficulty-indicator.ctsc { background-color: #0e1d69; }

/* 下拉选项悬停效果 */
:deep(.el-select-dropdown__item:hover) .difficulty-option {
    background-color: rgba(0, 0, 0, 0.04);
}

:deep(.el-select-dropdown__item.selected) .difficulty-option {
    background-color: rgba(0, 0, 0, 0.08);
}

/* 为每个难度级别设置不同的悬停背景色 */
:deep(.el-select-dropdown__item:hover) .difficulty-option:has(.easy) {
    background-color: rgba(254, 76, 97, 0.1);
}

:deep(.el-select-dropdown__item:hover) .difficulty-option:has(.popularize) {
    background-color: rgba(243, 156, 17, 0.1);
}

:deep(.el-select-dropdown__item:hover) .difficulty-option:has(.improve) {
    background-color: rgba(255, 193, 22, 0.1);
}

:deep(.el-select-dropdown__item:hover) .difficulty-option:has(.provincial) {
    background-color: rgba(82, 196, 26, 0.1);
}

:deep(.el-select-dropdown__item:hover) .difficulty-option:has(.noi) {
    background-color: rgba(157, 61, 207, 0.1);
}

:deep(.el-select-dropdown__item:hover) .difficulty-option:has(.ctsc) {
    background-color: rgba(14, 29, 105, 0.1);
}

/* 选中状态的样式 */
:deep(.el-select-dropdown__item.selected) .difficulty-option {
    font-weight: 600;
}

:deep(.el-select-dropdown__item.selected) .difficulty-indicator {
    height: 24px;
}

/* 下拉框样式优化 */
:deep(.el-select-dropdown) {
    border-radius: 8px;
    padding: 4px;
}

:deep(.el-select-dropdown__item) {
    height: auto;
    padding: 0;
}

.submission-select {
    width: 200px !important;
}

.tag-option {
    display: flex;
    align-items: center;
    padding: 6px 0;
    width: 100%;
}

.difficulty-tag {
    display: inline-block;
    padding: 6px 12px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 600;
    color: white;
    min-width: 60px;
    text-align: center;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    width: 100%;
}

/* 难度标签颜色 */
.difficulty-tag.easy {
    background-color: #fe4c61;
}

.difficulty-tag.popularize {
    background-color: #f39c11;
}

.difficulty-tag.improve {
    background-color: #ffc116;
}

.difficulty-tag.provincial-election {
    background-color: #52c41a;
}

.difficulty-tag.noi {
    background-color: #9d3dcf;
}

.difficulty-tag.ctsc {
    background-color: #0e1d69;
}

/* 下拉选项hover效果优化 */
:deep(.el-select-dropdown__item:hover) {
    background-color: rgba(0, 0, 0, 0.04);
}

:deep(.el-select-dropdown__item.selected) {
    background-color: rgba(0, 0, 0, 0.08);
    font-weight: bold;
}

/* 选择框样式优化 */
:deep(.el-select .el-input__wrapper) {
    border-radius: 8px;
}

:deep(.el-select-dropdown) {
    border-radius: 8px;
    padding: 8px 0;
}

:deep(.el-select-dropdown__item) {
    height: 40px;
    line-height: 40px;
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
    color: #909399;
}

.search-actions {
    display: flex;
    gap: 8px;
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

.problem-table {
    background: white;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
    margin-bottom: 24px;
    border: none;
}

.problem-table :deep(.el-table__inner-wrapper) {
    border: none;
}

.problem-table :deep(.el-scrollbar__bar.is-horizontal) {
    display: none;
}

.problem-table :deep(.el-scrollbar__bar.is-vertical) {
    display: none;
}

.problem-table :deep(.el-table__border-left),
.problem-table :deep(.el-table__border-right),
.problem-table :deep(.el-table__border-top),
.problem-table :deep(.el-table__border-bottom) {
    display: none;
}

.problem-table :deep(.el-table__row) {
    border-bottom: 1px solid #f0f0f0;
}

.problem-table :deep(.el-table__row:last-child) {
    border-bottom: none;
}

.problem-table :deep(.el-table__header) {
    border-bottom: 1px solid #ebeef5;
}

.problem-table :deep(.el-table__cell) {
    border: none;
}

.problem-table :deep(.el-table--stripe .el-table__body tr.el-table__row--striped) {
    background: rgba(24, 160, 88, 0.02);
}

.problem-table :deep(.el-table__fixed-right),
.problem-table :deep(.el-table__fixed) {
    box-shadow: none;
    border-right: none;
    border-left: none;
}

/* 为表格添加行高和单元格内边距控制 */
.problem-table :deep(.el-table__row) {
    height: 70px;
    /* 增加行高 */
}

.problem-table :deep(.el-table__cell) {
    padding: 10px 0;
    /* 增加单元格内边距 */
    vertical-align: middle;
}

/* 统一表头样式 */
.problem-table :deep(.el-table__header-row) {
    height: 60px;
    /* 增加表头行高 */
}

.problem-table :deep(.el-table__header-cell) {
    background-color: #f8f9fa;
    font-weight: 600;
    color: #2c3e50;
}

.problem-title {
    display: flex;
    align-items: flex-start;
    flex-direction: column;
    gap: 6px;
}

.problem-meta {
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

/* 表格行样式 */
:deep(.featured-row) {
    background-color: rgba(24, 160, 88, 0.05);
    /* 更浅的蓝绿色 */
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

/* 修改Element Plus主题色 */
:deep(.el-select-dropdown__item.selected) {
    color: #18a058 !important;
}

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

.table-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    cursor: pointer;
    transition: all 0.3s ease;
}

.table-header:hover {
    color: #18a058;
}

.sort-icon {
    display: inline-flex;
    margin-left: 4px;
    color: #18a058;
}

/* 标签样式增强 */
.el-tag {
    font-weight: 500;
    border-radius: 12px;
    padding: 0 10px;
    height: 24px;
    line-height: 24px;
    transition: all 0.3s;
}

.el-tag:hover {
    transform: translateY(-1px);
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

/* 修改标签颜色以匹配难度指示器 */
:deep(.el-tag--success) {
    background-color: rgba(254, 76, 97, 0.1);  /* 入门 */
    color: #fe4c61;
    border-color: rgba(254, 76, 97, 0.2);
}

:deep(.el-tag--warning) {
    background-color: rgba(243, 156, 17, 0.1);  /* 普及 */
    color: #f39c11;
    border-color: rgba(243, 156, 17, 0.2);
}

:deep(.el-tag--info) {
    background-color: rgba(255, 193, 22, 0.1);  /* 提高 */
    color: #ffc116;
    border-color: rgba(255, 193, 22, 0.2);
}

:deep(.el-tag--primary) {
    background-color: rgba(82, 196, 26, 0.1);  /* 省选 */
    color: #52c41a;
    border-color: rgba(82, 196, 26, 0.2);
}

:deep(.el-tag--danger) {
    background-color: rgba(157, 61, 207, 0.1);  /* NOI */
    color: #9d3dcf;
    border-color: rgba(157, 61, 207, 0.2);
}

/* 添加 CTSC 深蓝色样式 */
:deep(.el-tag--ctsc) {
    background-color: rgba(14, 29, 105, 0.1);
    color: #0e1d69;
    border-color: rgba(14, 29, 105, 0.2);
}

/* 下拉选项中的标签样式 */
.el-select-dropdown__item .el-tag {
    width: 100%;
    text-align: center;
}

/* 下拉菜单动画 */
.dropdown-enter-active,
.dropdown-leave-active {
    transition: all 0.4s cubic-bezier(0.5, 0, 0.3, 1.2);
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

/* 下方内容动画 */
.content-move-enter-active,
.content-move-leave-active {
    transition: all 0.4s cubic-bezier(0.5, 0, 0.3, 1.2);
}

.content-move-enter-from,
.content-move-leave-to {
    transform: translateY(-20px);
    opacity: 0.9;
}

.content-move-enter-to,
.content-move-leave-from {
    transform: translateY(0);
    opacity: 1;
}

/* 调整间距，确保动画流畅 */
.batch-operations {
    margin-top: 16px;
    transition: margin-top 0.3s ease;
}

.advanced-search~div .batch-operations {
    margin-top: 24px;
}

.page-ellipsis {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    color: #909399;
    font-size: 20px;
    font-weight: bold;
    line-height: 10px;
    margin: 0 4px;
}
</style>
