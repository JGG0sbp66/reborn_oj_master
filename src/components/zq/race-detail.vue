<template>
  <div>
    <!-- 查看竞赛详情弹窗 -->
    <el-dialog
      v-model="dialogVisible"
      title="竞赛详情"
      width="680px"
      :close-on-click-modal="false"
    >
      <div class="race-detail-container" v-loading="loading">
        <div class="race-header">
          <h2 class="race-title">{{ raceData.title }}</h2>
          <div class="race-tags">
            <el-tag 
              v-for="(tag, index) in raceData.tags" 
              :key="index"
              :type="getTagType(tag.type)"
              class="race-tag"
            >
              {{ tag.name }}
            </el-tag>
          </div>
          <div class="race-logos">
            <el-tag 
              v-for="(logo, index) in raceData.logos" 
              :key="index"
              type="primary"
              effect="plain"
              class="race-logo"
            >
              {{ logo }}
            </el-tag>
          </div>
        </div>
        
        <el-divider></el-divider>
        
        <div class="race-info">
          <div class="info-item">
            <span class="label">开始时间:</span>
            <span class="value">{{ formatDateTime(raceData.start_time) }}</span>
          </div>
          <div class="info-item">
            <span class="label">结束时间:</span>
            <span class="value">{{ formatDateTime(raceData.end_time) }}</span>
          </div>
          <div class="info-item">
            <span class="label">竞赛状态:</span>
            <el-tag :type="getStatusType(raceData.status)" size="small">
              {{ getStatusText(raceData.status) }}
            </el-tag>
          </div>
          <div class="info-item">
            <span class="label">参赛人数:</span>
            <span class="value">{{ raceData.user_list ? raceData.user_list.length : 0 }}人</span>
          </div>
        </div>
        
        <!-- <el-divider></el-divider>
        
        <div class="race-description" v-if="raceData.description">
          <h3>竞赛描述</h3>
          <p>{{ raceData.description }}</p>
        </div> -->
        
        <el-divider></el-divider>
        
        <div class="race-problems">
          <h3>题目列表 ({{ raceData.problems_list ? raceData.problems_list.length : 0 }}题)</h3>
          <div class="problem-list" v-if="raceData.problems_list && raceData.problems_list.length > 0">
            <el-tag
              v-for="problemId in raceData.problems_list"
              :key="problemId"
              effect="plain"
              class="problem-tag"
            >
              {{ getProblemTitle(problemId) }}
            </el-tag>
          </div>
          <el-empty v-else description="暂无题目" :image-size="80"></el-empty>
        </div>
        
        <el-divider></el-divider>
        
        <div class="race-users">
          <h3>参赛用户 ({{ raceData.user_list ? raceData.user_list.length : 0 }}人)</h3>
          <div class="user-list" v-if="raceData.user_list && raceData.user_list.length > 0">
            <el-tag
              v-for="userId in raceData.user_list"
              :key="userId"
              effect="plain"
              class="user-tag"
            >
               {{ userId }}
            </el-tag>
          </div>
          <el-empty v-else description="暂无参赛用户" :image-size="80"></el-empty>
        </div>
      </div>
      
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">关闭</el-button>
          <el-button type="primary" @click="handleEdit">编辑竞赛</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, defineProps, defineEmits, defineExpose } from 'vue';
import { ElMessage } from 'element-plus';
import axios from 'axios';
import { nextTick } from 'vue';

// 定义组件的props和emits
const props = defineProps({
  alertBoxRef: {
    type: Object,
    default: null
  }
});

const emits = defineEmits(['refreshData', 'editRace']);

// 定义竞赛标签类型
interface CompetitionTag {
  name: string;
  type: string;
}

// 定义竞赛数据结构
interface RaceData {
  uid?: number;
  title: string;
  logos: string[];
  start_time: string;
  end_time: string;
  tags: CompetitionTag[];
  problems_list: number[];
  user_list: number[];
  status: string;
  description?: string;
  user_uid_list?: number[]; // 添加这个字段
}

// 弹窗状态
const dialogVisible = ref(false);
const loading = ref(false);

// 竞赛数据
const raceData = reactive<RaceData>({
  title: '',
  logos: [],
  start_time: '',
  end_time: '',
  tags: [],
  problems_list: [],
  user_list: [],
  status: ''
});

// 题目信息缓存
interface QuestionInfo {
  id: number;
  title: string;
}

const problemsInfo = ref<QuestionInfo[]>([]);

// 格式化日期时间
const formatDateTime = (dateString: string): string => {
  if (!dateString) return '';
  
  try {
    const date = new Date(dateString);
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
  } catch (e) {
    return dateString;
  }
};

// 获取标签类型
const getTagType = (type: string): string => {
  switch (type) {
    case 'pending': return 'info';       // 未开始
    case 'registration': return 'info';  // 报名中
    case 'ongoing': return 'success';    // 进行中
    case 'ended': return 'warning';      // 已结束
    case 'individual': return 'success'; // 个人赛
    case 'team': return 'success';       // 团队赛
    default: return 'info';
  }
};

// 获取状态文本
const getStatusText = (status: string): string => {
  switch (status) {
    case 'upcoming': return '未开始';
    case 'registration': return '报名中';
    case 'in_progress': return '进行中';
    case 'ended': return '已结束';
    default: return status;
  }
};

// 获取状态标签类型
const getStatusType = (status: string): string => {
  switch (status) {
    case 'in_progress': return 'success';
    case 'upcoming': return 'info';
    case 'ended': return 'danger';
    case 'registration': return 'warning';
    default: return 'info';
  }
};

// 获取题目标题信息
const fetchQuestionsInfo = async (problemIds: number[]) => {
  if (!problemIds || problemIds.length === 0) return;
  
  try {
    const promises = problemIds.map(id => 
      axios.get(`/api/admin-question/${id}`)
        .then(response => ({
          id,
          title: response.data.question?.title || ''
        }))
        .catch(() => ({
          id,
          title: ''
        }))
    );
    
    const results = await Promise.all(promises);
    problemsInfo.value = results;
    
  } catch (error) {
    console.error('获取题目信息失败:', error);
  }
};

// 根据ID获取题目标题
const getProblemTitle = (problemId: number): string => {
  const problem = problemsInfo.value.find(p => p.id === problemId);
  if (problem && problem.title) {
    return problem.title;
  }
  
  // 如果找不到题目或标题为空，尝试单独获取题目
  fetchSingleProblem(problemId);
  return '加载中...';
};

// 获取单个题目信息
const fetchSingleProblem = async (problemId: number) => {
  try {
    const response = await axios.get(`/api/admin-question/${problemId}`);
    const title = response.data.question?.title || '';
    if (title) {
      // 更新到缓存
      const existingIndex = problemsInfo.value.findIndex(p => p.id === problemId);
      if (existingIndex >= 0) {
        problemsInfo.value[existingIndex].title = title;
      } else {
        problemsInfo.value.push({ id: problemId, title });
      }
    }
  } catch (error) {
    console.error(`获取题目 ${problemId} 信息失败:`, error);
  }
};

// 打开竞赛详情对话框
const openDetailDialog = async (raceId: number) => {
  dialogVisible.value = true;
  await fetchRaceDetails(raceId);
};

// 获取竞赛详情
const fetchRaceDetails = async (raceId: number) => {
  loading.value = true;
  
  try {
    const response = await axios({
      url: `/api/races/${raceId}`,
      method: 'get'
    });
    
    // 使用 Object.assign 一次性更新响应式数据
    Object.assign(raceData, response.data);
    
    // 并行获取题目信息和用户信息
    await Promise.all([
      raceData.problems_list?.length ? fetchQuestionsInfo(raceData.problems_list) : Promise.resolve(),
      // 可以添加其他需要并行获取的数据
    ]);
    
  } catch (error) {
    console.error('获取竞赛详情失败:', error);
    props.alertBoxRef?.show('获取竞赛详情失败，请稍后重试', 1);
  } finally {
    await nextTick();
    loading.value = false;
  }
};

// 处理编辑按钮点击事件
const handleEdit = () => {
  dialogVisible.value = false;
  const raceDataToEdit = { ...raceData };
  // 使用 user_uid_list 替换 user_list
  if (raceDataToEdit.user_uid_list) {
    raceDataToEdit.user_list = raceDataToEdit.user_uid_list;
  }
  emits('editRace', raceDataToEdit);
};

// 暴露方法给父组件
defineExpose({
  openDetailDialog
});
</script>

<style scoped>
.race-detail-container {
  padding: 0 12px;
}

.race-header {
  text-align: center;
  margin-bottom: 16px;
}

.race-title {
  font-size: 1.8rem;
  color: #303133;
  margin-bottom: 12px;
  font-weight: 600;
}

.race-tags {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 8px;
  margin-bottom: 12px;
}

.race-logos {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 8px;
}

.race-tag, .race-logo {
  margin: 0;
}

.race-info {
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

.race-description h3,
.race-problems h3,
.race-users h3 {
  font-size: 1.1rem;
  color: #303133;
  margin-bottom: 12px;
  font-weight: 500;
}

.race-description p {
  color: #606266;
  line-height: 1.6;
  white-space: pre-line;
}

.problem-list, .user-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 12px;
}

.problem-tag, .user-tag {
  margin: 0;
}

:deep(.el-divider) {
  margin: 16px 0;
}

:deep(.el-dialog__header) {
  padding-bottom: 16px;
  margin-bottom: 0;
  border-bottom: 1px solid #ebeef5;
}

:deep(.el-dialog__body) {
  padding: 20px;
}

:deep(.el-dialog__footer) {
  padding-top: 16px;
  border-top: 1px solid #ebeef5;
}
</style>
