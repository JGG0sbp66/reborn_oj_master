<template>
    <div class="table-section recent-problems">
        <div class="table-header">
            <h3 class="table-title">最新题目</h3>
            <router-link to="/nav/question" class="view-all">查看全部</router-link>
        </div>
        <div class="table-content">
            <el-table :data="recentQuestions" stripe style="width: 100%" size="small">
                <el-table-column prop="id" label="ID" width="80" />
                <el-table-column prop="title" label="标题" min-width="180" />
                <el-table-column prop="difficulty" label="难度" width="100">
                    <template #default="scope">
                        <el-tag :type="getDifficultyType(scope.row.difficulty)" size="small">
                            {{ scope.row.difficulty }}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="createTime" label="创建时间" width="180">
                    <template #default="scope">
                        {{ new Date(scope.row.createTime).toLocaleDateString() }}
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axios from 'axios';

// 定义题目接口
interface Question {
    id: string;
    title: string;
    difficulty: string;
    createTime: string;
    category?: string;
    passRate?: number;
}

// 最近题目数据
const recentQuestions = ref<Question[]>([
    { id: 'Q-1024', title: '两数之和的高效算法', difficulty: '入门', createTime: '2023-12-01T10:30:45' },
    { id: 'Q-1025', title: '二叉树的中序遍历', difficulty: '普及', createTime: '2023-12-02T14:22:10' },
    { id: 'Q-1026', title: '最长回文子串', difficulty: '提高', createTime: '2023-12-03T09:15:33' },
    { id: 'Q-1027', title: '高级动态规划问题', difficulty: '省选', createTime: '2023-12-04T16:40:27' },
    { id: 'Q-1028', title: '字符串匹配算法', difficulty: 'NOI', createTime: '2023-12-05T11:05:19' }
]);

// 获取难度标签类型
const getDifficultyType = (difficulty: string): string => {
    switch (difficulty) {
        case '入门': return 'success';
        case '普及': return 'warning';
        case '提高': return 'danger';
        case '省选': return 'primary';
        case 'NOI': return 'danger';
        case 'CTSC': return 'danger';
        default: return 'info';
    }
};

// 根据题目复杂度推断难度
const getDifficultyByComplexity = (question: any): string => {
    // 基于题目的约束条件、时间和内存限制等推断难度
    const constraints = question?.constraints || [];
    const timeLimit = question?.time_limit || 1000;
    const memoryLimit = question?.memory_limit || 128;

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

// 获取最近题目数据
const fetchRecentQuestions = async (): Promise<void> => {
    try {
        // 获取所有题目
        const response = await axios.get('http://localhost:5000/api/');
        const allQuestions = response.data;
        
        // 处理数据，添加创建时间和难度
        const processedQuestions = allQuestions.map((item: any, index: number) => {
            // 创建时间是随机的过去日期
            const randomDays = Math.floor(Math.random() * 30); // 30天内
            const createDate = new Date();
            createDate.setDate(createDate.getDate() - randomDays);
            
            return {
                id: `P${1001 + index}`,
                title: item.question?.title || `题目 ${index + 1}`,
                difficulty: getDifficultyByComplexity(item.question),
                category: item.topic || '未分类',
                createTime: createDate.toISOString(),
                passRate: Math.floor(Math.random() * 100) // 随机通过率
            } as Question;
        });
        
        // 按创建时间排序（最新的在前）
        processedQuestions.sort((a: Question, b: Question) => {
            return new Date(b.createTime).getTime() - new Date(a.createTime).getTime();
        });
        
        // 取前5个
        recentQuestions.value = processedQuestions.slice(0, 5);
        console.log('获取到最近题目:', recentQuestions.value);
    } catch (error) {
        console.error('获取最近题目失败:', error);
    }
};

// 组件加载时获取数据
onMounted(() => {
    fetchRecentQuestions();
});
</script>

<style scoped>
.tables-container {
    display: flex;
    flex-direction: column;
    gap: 24px;
}

.table-section {
    background: white;
    border-radius: 12px;
    padding: 20px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
}

.table-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
}

.table-title {
    font-size: 16px;
    font-weight: 600;
    color: #2c3e50;
    margin: 0;
}
.view-all {
    font-size: 14px;
    color: #42b983;
    text-decoration: none;
}

.view-all:hover {
    text-decoration: underline;
}
</style>
