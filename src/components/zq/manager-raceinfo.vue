<template>
    <div class="table-section recent-competitions">
        <div class="table-header">
            <h3 class="table-title">最近竞赛</h3>
            <router-link to="/user/mrace" class="view-all">查看全部</router-link>
        </div>
        <div class="table-content">
            <el-table :data="recentCompetitions" stripe style="width: 100%" size="small">
                <el-table-column prop="id" label="竞赛ID" width="100" />
                <el-table-column prop="title" label="竞赛名称" min-width="180" />
                <el-table-column prop="status" label="状态" width="100">
                    <template #default="scope">
                        <el-tag :type="getStatusType(scope.row.status)" size="small">
                            {{ scope.row.status }}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="startTime" label="开始时间" min-width="160">
                    <template #default="scope">
                        {{ new Date(scope.row.startTime).toLocaleDateString() }}
                    </template>
                </el-table-column>
                <el-table-column prop="endTime" label="结束时间" min-width="160">
                    <template #default="scope">
                        {{ new Date(scope.row.endTime).toLocaleDateString() }}
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

// 竞赛条目接口定义
interface Competition {
    id: number | string;
    title: string;
    status: string;
    startTime: string;
    endTime: string;
    logos?: string[];
    tags?: Array<{ name: string; type: string }>;
    duration?: string;
}

// API返回数据接口
interface RaceApiData {
    id?: number;
    title?: string;
    [key: string]: any;
}

const router = useRouter();

// 定义组件Props
const props = defineProps({
    limit: { type: Number, default: 5 }
});

// 定义组件Emits
const emit = defineEmits(['view-more']);

// 最近竞赛数据
const recentCompetitions = ref<Competition[]>([]);

const statusMap: Record<string, string> = {
    ended: '已结束',
    running: '进行中',
    upcoming: '报名中'
};

// 获取状态标签类型
const getStatusType = (status: string): string => {
    switch (status) {
        case '进行中': return 'success';
        case '报名中': return 'info';
        case '已结束': return 'danger';
        default: return 'info';
    }
};

// 跳转到竞赛列表页面
const viewMoreCompetitions = (): void => {
    emit('view-more');
    router.push('/user/competition');
};

// 获取最近竞赛数据
const fetchRecentCompetitions = async (): Promise<void> => {
    try {
        const response = await axios.get('/api/race-list');
        let allRaces = response.data.race_info || [];
        // 按照 startTime 字段降序排列（时间最新的在前）
        allRaces = allRaces.sort((a: any, b: any) => {
            // 字符串转时间戳比较
            return new Date(b.startTime).getTime() - new Date(a.startTime).getTime();
        });
        // 只取前 limit 个，并做字段映射
        recentCompetitions.value = allRaces.slice(0, props.limit).map((item: any) => ({
            id: item.race_uid,
            title: item.title,
            status: statusMap[item.status] || item.status,
            startTime: item.startTime,
            endTime: item.endTime,
            logos: item.logos,
            tags: item.tags,
            duration: item.duration
        }));
    } catch (error) {
        console.error('获取最近竞赛失败:', error);
    }
};

// 组件加载时获取数据
onMounted(() => {
    fetchRecentCompetitions();
});
</script>

<style scoped>
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
