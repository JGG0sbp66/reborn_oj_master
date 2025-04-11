<template>
    <div class="table-section recent-questions">
        <div class="table-header">
            <h3 class="table-title">最新题目</h3>
            <router-link to="/system/questions" class="view-all">查看全部</router-link>
        </div>
        <div class="table-content">
            <el-table :data="recentQuestions" stripe style="width: 100%">
                <el-table-column prop="id" label="ID" width="70" />
                <el-table-column prop="title" label="题目名称" />
                <el-table-column prop="difficulty" label="难度" width="100">
                    <template #default="scope">
                        <el-tag :type="getDifficultyType(scope.row.difficulty)">
                            {{ scope.row.difficulty }}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="createdAt" label="创建时间" width="180" />
            </el-table>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { ElTable, ElTableColumn, ElTag } from 'element-plus';

const recentQuestions = ref([
    { id: 'Q-1024', title: '两数之和的高效算法', difficulty: '简单', createdAt: '2023-12-01 10:30:45' },
    { id: 'Q-1025', title: '二叉树的中序遍历', difficulty: '中等', createdAt: '2023-12-02 14:22:10' },
    { id: 'Q-1026', title: '最长回文子串', difficulty: '中等', createdAt: '2023-12-03 09:15:33' },
    { id: 'Q-1027', title: '高级动态规划问题', difficulty: '困难', createdAt: '2023-12-04 16:40:27' },
    { id: 'Q-1028', title: '字符串匹配算法', difficulty: '简单', createdAt: '2023-12-05 11:05:19' }
]);

const getDifficultyType = (difficulty: string) => {
    switch (difficulty) {
        case '简单': return 'success';
        case '中等': return 'warning';
        case '困难': return 'danger';
        default: return 'info';
    }
};
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
