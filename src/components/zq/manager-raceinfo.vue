<template>
    <div class="table-section recent-competitions">
        <div class="table-header">
            <h3 class="table-title">最新竞赛</h3>
            <router-link to="/system/competitions" class="view-all">查看全部</router-link>
        </div>
        <div class="table-content">
            <el-table :data="recentCompetitions" stripe style="width: 100%">
                <el-table-column prop="id" label="ID" width="70" />
                <el-table-column prop="title" label="竞赛名称" />
                <el-table-column prop="status" label="状态" width="100">
                    <template #default="scope">
                        <el-tag :type="getStatusType(scope.row.status)">
                            {{ scope.row.status }}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="startTime" label="开始时间" width="180" />
            </el-table>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { ElTable, ElTableColumn, ElTag } from 'element-plus';

const recentCompetitions = ref([
    { id: 'C-256', title: '周末算法挑战赛', status: '进行中', startTime: '2023-12-02 09:00:00' },
    { id: 'C-257', title: '高校编程大赛预选赛', status: '已结束', startTime: '2023-11-25 13:30:00' },
    { id: 'C-258', title: '新手入门编程竞赛', status: '报名中', startTime: '2023-12-10 10:00:00' },
    { id: 'C-259', title: '冬季算法竞赛', status: '未开始', startTime: '2023-12-15 09:30:00' },
    { id: 'C-260', title: '企业编程挑战赛', status: '已结束', startTime: '2023-11-18 14:00:00' }
]);

const getStatusType = (status: string) => {
    switch (status) {
        case '进行中': return 'success';
        case '未开始': return 'info';
        case '已结束': return 'danger';
        case '报名中': return 'warning';
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
