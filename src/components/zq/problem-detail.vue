<template>
    <div>
        <!-- 查看题目详情弹窗 -->
        <el-dialog v-model="dialogVisible" title="题目详情" width="680px" :close-on-click-modal="false" class="problem-detail-dialog" style="margin-top: 70px;">
            <div class="problem-detail-scroll-wrapper">
                <div class="problem-detail-container" v-loading="loading">
                    <div class="problem-header">
                        <h2 class="problem-title">{{ problemData.title }}</h2>
                        <div class="problem-meta">
                            <el-tag :type="getDifficultyType(problemData.difficulty)" class="meta-tag">
                                {{ problemData.difficulty }}
                            </el-tag>
                            <el-tag type="info" class="meta-tag">
                                {{ problemData.category }}
                            </el-tag>
                            <span class="id-label">ID: {{ problemData.id }}</span>
                        </div>
                    </div>

                    <el-divider></el-divider>

                    <div class="problem-info">
                        <div class="info-item">
                            <span class="label">时间限制:</span>
                            <span class="value">{{ problemData.time_limit }} ms</span>
                        </div>
                        <div class="info-item">
                            <span class="label">内存限制:</span>
                            <span class="value">{{ problemData.memory_limit }} MB</span>
                        </div>
                        <div class="info-item">
                            <span class="label">通过率:</span>
                            <span class="value">{{ problemData.passRate }}%</span>
                        </div>
                        <div class="info-item">
                            <span class="label">提交次数:</span>
                            <span class="value">{{ problemData.submissionCount }} 次</span>
                        </div>
                    </div>

                    <el-divider></el-divider>

                    <div class="problem-description" v-if="problemData.description">
                        <h3>题目描述</h3>
                        <p>{{ problemData.description }}</p>
                    </div>

                    <el-divider></el-divider>

                    <div class="problem-section">
                        <h3>输入格式</h3>
                        <p>{{ problemData.input_format || '暂无输入格式说明' }}</p>
                    </div>

                    <el-divider></el-divider>

                    <div class="problem-section">
                        <h3>输出格式</h3>
                        <p>{{ problemData.output_format || '暂无输出格式说明' }}</p>
                    </div>

                    <el-divider></el-divider>

                    <div class="problem-section">
                        <h3>约束条件</h3>
                        <ul v-if="problemData.constraints && problemData.constraints.length">
                            <li v-for="(constraint, index) in problemData.constraints" :key="index">
                                {{ constraint }}
                            </li>
                        </ul>
                        <p v-else>暂无约束条件</p>
                    </div>

                    <el-divider></el-divider>

                    <div class="problem-section">
                        <h3>示例</h3>
                        <div v-if="problemData.examples && problemData.examples.length">
                            <div class="example-box" v-for="(example, index) in problemData.examples" :key="index">
                                <div class="example-header">示例 {{ index + 1 }}</div>
                                <div class="example-content">
                                    <div class="example-input">
                                        <div class="example-label">输入:</div>
                                        <pre class="example-code">{{ example.input }}</pre>
                                    </div>
                                    <div class="example-output">
                                        <div class="example-label">输出:</div>
                                        <pre class="example-code">{{ example.output }}</pre>
                                    </div>
                                    <div class="example-explanation" v-if="example.explanation">
                                        <div class="example-label">解释:</div>
                                        <pre class="example-code">{{ example.explanation }}</pre>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <p v-else>暂无示例</p>
                    </div>
                </div>
            </div>

            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="dialogVisible = false">关闭</el-button>
                    <el-button type="primary" @click="handleEdit">编辑题目</el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, defineProps, defineEmits, defineExpose } from 'vue';
import { ElMessage } from 'element-plus';
import axios from 'axios';

// 定义组件的props和emits
const props = defineProps({
    alertBoxRef: {
        type: Object,
        default: null
    }
});

const emits = defineEmits(['refreshData', 'editProblem']);

// 定义题目示例类型
interface Example {
    input: string;
    output: string;
    explanation: string;
}

// 定义题目数据结构
interface ProblemData {
    id: string;
    title: string;
    description: string;
    difficulty: string;
    category: string;
    time_limit: number;
    memory_limit: number;
    input_format: string;
    output_format: string;
    constraints: string[];
    examples: Example[];
    passRate: number;
    submissionCount: number;
    createTime: string;
}

// 定义API返回的题目结构
interface QuestionData {
    title?: string;
    description?: string;
    time_limit?: number;
    memory_limit?: number;
    input_format?: string;
    output_format?: string;
    constraints?: string[];
    examples?: Example[];
}

// 弹窗状态
const dialogVisible = ref(false);
const loading = ref(false);

// 题目数据
const problemData = reactive<ProblemData>({
    id: '',
    title: '',
    description: '',
    difficulty: '',
    category: '',
    time_limit: 1000,
    memory_limit: 128,
    input_format: '',
    output_format: '',
    constraints: [],
    examples: [],
    passRate: 0,
    submissionCount: 0,
    createTime: ''
});

// 打开题目详情对话框
const openDetailDialog = async (problemId: string) => {
    dialogVisible.value = true;
    loading.value = true;
    await fetchProblemDetails(problemId);
    loading.value = false;
};

// 获取题目详情
const fetchProblemDetails = async (problemId: string) => {
    try {
        // P1XXX格式，需要提取出XXX部分对应的数字
        const matches = problemId.match(/P1(\d+)/);
        const numericId = matches ? parseInt(matches[1], 10) : 0;

        console.log(`正在获取题目详情，原始ID: ${problemId}, 实际ID: ${numericId}`);

        const response = await axios({
            url: `http://localhost:5000/api/${numericId}`,
            method: 'get'
        });

        const apiData = response.data;

        // 填充题目数据
        problemData.id = problemId;
        problemData.title = apiData.question.title || '未命名题目';
        problemData.description = apiData.question.description || '';
        problemData.time_limit = apiData.question.time_limit || 1000;
        problemData.memory_limit = apiData.question.memory_limit || 128;
        problemData.input_format = apiData.question.input_format || '';
        problemData.output_format = apiData.question.output_format || '';
        problemData.constraints = apiData.question.constraints || [];
        problemData.examples = apiData.question.examples || [];
        problemData.category = apiData.topic || '未分类';

        // 随机生成通过率和提交次数（实际应用中应从API获取）
        problemData.passRate = Math.floor(Math.random() * 100);
        problemData.submissionCount = Math.floor(Math.random() * 10000) + 100;

        // 设置创建时间
        problemData.createTime = new Date().toISOString().split('T')[0];

        // 根据题目复杂度设置难度
        problemData.difficulty = getDifficultyByComplexity(apiData.question);

        console.log('获取到题目详情:', apiData);
    } catch (error) {
        console.error('获取题目详情失败:', error);
        if (props.alertBoxRef) {
            props.alertBoxRef.show('获取题目详情失败，请稍后重试', 1);
        } else {
            ElMessage.error('获取题目详情失败，请稍后重试');
        }
    }
};

// 获取难度标签类型
const getDifficultyType = (difficulty: string): string => {
    switch (difficulty) {
        case '入门': return 'success';
        case '普及': return 'info';
        case '提高': return 'warning';
        case '省选': return 'danger';
        case 'NOI': return 'danger';
        case 'CTSC': return 'danger';
        default: return 'info';
    }
};

// 根据题目复杂度推断难度
const getDifficultyByComplexity = (question: QuestionData): string => {
    // 基于题目的约束条件、时间和内存限制等推断难度
    const constraints = question.constraints || [];
    const timeLimit = question.time_limit || 1000;
    const memoryLimit = question.memory_limit || 128;

    // 简单的难度判断逻辑
    if (timeLimit <= 500 && memoryLimit <= 64) {
        return '入门';
    } else if (timeLimit <= 1000 && memoryLimit <= 128) {
        return '普及';
    } else if (timeLimit <= 2000 && memoryLimit <= 256) {
        return '提高';
    } else if (timeLimit <= 5000 && memoryLimit <= 512) {
        return '省选';
    } else if (timeLimit <= 10000 && memoryLimit <= 1024) {
        return 'NOI';
    } else {
        return 'CTSC';
    }
};

// 处理编辑按钮点击事件
const handleEdit = () => {
    dialogVisible.value = false;
    emits('editProblem', { ...problemData });
};

// 暴露方法给父组件
defineExpose({
    openDetailDialog
});
</script>

<style scoped>
.problem-detail-dialog :deep(.el-dialog__body) {
  padding: 0;
  max-height: calc(80vh - 120px);
  overflow: hidden;
}

.problem-detail-scroll-wrapper {
  max-height: calc(80vh - 120px);
  overflow-y: auto;
  padding: 20px;
  box-sizing: border-box;
}

.problem-detail-scroll-wrapper::-webkit-scrollbar {
  width: 6px;
}

.problem-detail-scroll-wrapper::-webkit-scrollbar-thumb {
  background-color: #dcdfe6;
  border-radius: 3px;
}

.problem-detail-scroll-wrapper::-webkit-scrollbar-track {
  background-color: #f5f7fa;
}

.dialog-footer {
  padding: 10px 20px;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  border-top: 1px solid #ebeef5;
  background-color: #fff;
}

.problem-detail-container {
    padding: 0 12px;
}

.problem-header {
    text-align: center;
    margin-bottom: 16px;
}

.problem-title {
    font-size: 1.8rem;
    color: #303133;
    margin-bottom: 12px;
    font-weight: 600;
}

.problem-meta {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 8px;
    margin-bottom: 12px;
}

.meta-tag {
    margin: 0;
}

.id-label {
    color: #909399;
    font-size: 14px;
    margin-left: 8px;
}

.problem-info {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
    margin: 20px 0;
}

.info-item {
    display: flex;
    align-items: center;
}

.label {
    font-weight: 500;
    color: #606266;
    margin-right: 8px;
    white-space: nowrap;
}

.value {
    color: #303133;
}

.problem-section {
    margin: 20px 0;
}

.problem-section h3 {
    font-size: 1.2rem;
    color: #303133;
    margin-bottom: 12px;
    font-weight: 600;
}

.problem-section p,
.problem-description p {
    line-height: 1.6;
    color: #606266;
}

.problem-section ul {
    padding-left: 20px;
    color: #606266;
}

.problem-section li {
    margin-bottom: 8px;
    line-height: 1.6;
}

.example-box {
    border: 1px solid #ebeef5;
    border-radius: 4px;
    margin-bottom: 16px;
    overflow: hidden;
}

.example-header {
    background-color: #f5f7fa;
    padding: 8px 12px;
    color: #606266;
    font-weight: 500;
    border-bottom: 1px solid #ebeef5;
}

.example-content {
    padding: 12px;
}

.example-input,
.example-output,
.example-explanation {
    margin-bottom: 12px;
}

.example-label {
    font-weight: 500;
    color: #606266;
    margin-bottom: 4px;
}

.example-code {
    background-color: #f5f7fa;
    padding: 12px;
    border-radius: 4px;
    font-family: monospace;
    white-space: pre-wrap;
    margin: 0;
    overflow-x: auto;
}
</style>
