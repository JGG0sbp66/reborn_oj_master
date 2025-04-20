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
    id: string;
    title: string;
    status: string;
    startTime: string;
    endTime: string;
    participantCount?: number;
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
const recentCompetitions = ref<Competition[]>([
    { id: 'C-256', title: '周末算法挑战赛', status: '进行中', startTime: '2023-12-02 09:00:00', endTime: '2023-12-03 09:00:00' },
    { id: 'C-257', title: '高校编程大赛预选赛', status: '已结束', startTime: '2023-11-25 13:30:00', endTime: '2023-11-26 13:30:00' },
    { id: 'C-258', title: '新手入门编程竞赛', status: '报名中', startTime: '2023-12-10 10:00:00', endTime: '2023-12-11 10:00:00' },
    { id: 'C-259', title: '冬季算法竞赛', status: '未开始', startTime: '2023-12-15 09:30:00', endTime: '2023-12-16 09:30:00' },
    { id: 'C-260', title: '企业编程挑战赛', status: '已结束', startTime: '2023-11-18 14:00:00', endTime: '2023-11-19 14:00:00' }
]);

// 获取状态标签类型
const getStatusType = (status: string): string => {
    switch (status) {
        case '进行中': return 'success';
        case '未开始': return 'info';
        case '已结束': return 'danger';
        case '报名中': return 'warning';
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
        // 获取所有竞赛
        const response = await axios.get('http://localhost:5000/api/races');
        const allCompetitions = response.data;
        
        // 处理数据
        const processedCompetitions = allCompetitions.map((item: RaceApiData) => {
            // 开始时间随机
            const randomDays = Math.floor(Math.random() * 15) - 7; // -7到7天之间
            const startDate = new Date();
            startDate.setDate(startDate.getDate() + randomDays);
            
            // 结束时间在开始时间基础上加1-3天
            const endDate = new Date(startDate);
            endDate.setDate(endDate.getDate() + Math.floor(Math.random() * 3) + 1);
            
            // 根据开始时间和当前时间确定状态
            let status = '未开始';
            const now = new Date();
            if (now > endDate) {
                status = '已结束';
            } else if (now >= startDate && now <= endDate) {
                status = '进行中';
            }
            
            return {
                id: `C${2001 + (item.id || Math.floor(Math.random() * 1000))}`,
                title: item.title || `竞赛 ${item.id || Math.floor(Math.random() * 100) + 1}`,
                startTime: startDate.toISOString(),
                endTime: endDate.toISOString(),
                status: status,
                participantCount: Math.floor(Math.random() * 500) + 50 // 随机参与人数
            } as Competition;
        });
        
        // 按开始时间排序（最近的在前）
        processedCompetitions.sort((a: Competition, b: Competition) => {
            return Math.abs(new Date(a.startTime).getTime() - new Date().getTime()) - 
                   Math.abs(new Date(b.startTime).getTime() - new Date().getTime());
        });
        
        // 取前n个
        recentCompetitions.value = processedCompetitions.slice(0, props.limit);
        console.log('获取到最近竞赛:', recentCompetitions.value);
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
