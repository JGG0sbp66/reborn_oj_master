<template>
  <div>
    <!-- 编辑竞赛表单弹窗 -->
    <el-dialog
      v-model="dialogVisible"
      title="编辑竞赛"
      width="600px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-form 
        ref="competitionFormRef" 
        :model="competition" 
        :rules="competitionRules" 
        label-width="120px"
        label-position="top"
      >
        <el-form-item label="竞赛名称" prop="title">
          <el-input v-model="competition.title" placeholder="请输入竞赛名称"></el-input>
        </el-form-item>
        
        <el-form-item label="竞赛标签" prop="logos">
          <el-select v-model="competition.logos" multiple placeholder="请选择竞赛标签">
            <el-option label="ACM" value="ACM"></el-option>
            <el-option label="ICPC" value="ICPC"></el-option>
            <el-option label="蓝桥杯" value="蓝桥杯"></el-option>
            <el-option label="NOI" value="NOI"></el-option>
          </el-select>
        </el-form-item>
        
        <div class="form-row">
          <el-form-item label="开始时间" prop="start_time">
            <el-date-picker
              v-model="competition.start_time"
              type="datetime"
              placeholder="选择开始时间"
              format="YYYY-MM-DD HH:mm:ss"
              value-format="YYYY-MM-DD HH:mm:ss"
            ></el-date-picker>
          </el-form-item>
          
          <el-form-item label="结束时间" prop="end_time">
            <el-date-picker
              v-model="competition.end_time"
              type="datetime"
              placeholder="选择结束时间"
              format="YYYY-MM-DD HH:mm:ss"
              value-format="YYYY-MM-DD HH:mm:ss"
            ></el-date-picker>
          </el-form-item>
        </div>
        
        <el-form-item label="竞赛状态" prop="tags">
          <el-tag v-for="(tag, index) in competition.tags" :key="index" 
                  :type="getTagType(tag.type)" class="competition-tag" closable
                  @close="removeTag(index)">
            {{ tag.name }}
          </el-tag>
          <el-button size="small" @click="showTagInput = true" v-if="!showTagInput">
            + 添加标签
          </el-button>
          <div v-else class="tag-input">
            <el-select v-model="newTag.type" placeholder="标签类型">
              <el-option label="未开始" value="pending"></el-option>
              <el-option label="进行中" value="ongoing"></el-option>
              <el-option label="报名中" value="registration"></el-option>
              <el-option label="已结束" value="ended"></el-option>
              <el-option label="个人赛" value="individual"></el-option>
              <el-option label="团队赛" value="team"></el-option>
            </el-select>
            <el-input v-model="newTag.name" placeholder="标签名称"></el-input>
            <el-button @click="addTag">添加</el-button>
            <el-button @click="showTagInput = false">取消</el-button>
          </div>
        </el-form-item>
        
        <el-form-item label="题目列表" prop="problems_list">
          <el-select 
            v-model="competition.problems_list" 
            multiple 
            filterable 
            remote 
            :remote-method="searchProblems"
            :loading="problemsLoading"
            placeholder="选择或搜索题目"
            style="width: 100%"
          >
            <el-option 
              v-for="problem in filteredProblems" 
              :key="problem.id" 
              :label="problem.title" 
              :value="problem.id"
            >
              <div class="problem-option">
                <span class="problem-id">题目 {{ problem.id }}</span>
                <span class="problem-title">{{ problem.title }}</span>
              </div>
            </el-option>
          </el-select>
          <div class="tip-text">* 可以输入题目ID或标题进行搜索</div>
        </el-form-item>

        <el-form-item label="参赛用户列表" prop="user_list">
          <el-select v-model="competition.user_list" multiple placeholder="选择参赛用户">
            <el-option v-for="id in availableUsers" :key="id" :label="`用户 ${id}`" :value="id"></el-option>
          </el-select>
        </el-form-item>
        
        <el-form-item label="竞赛描述" prop="description">
          <el-input 
            v-model="competition.description" 
            type="textarea" 
            :rows="3" 
            placeholder="请输入竞赛描述"
          ></el-input>
        </el-form-item>
      </el-form>
      
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="updateCompetition" :loading="updating">保存</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, defineExpose, reactive, defineProps, defineEmits } from 'vue';
import { ElMessage } from 'element-plus';
import type { FormInstance, FormRules } from 'element-plus';
import axios from 'axios';

// 定义组件的props和emits
const props = defineProps({
  alertBoxRef: {
    type: Object,
    default: null
  },
  raceId: {
    type: [Number, String],
    default: null
  }
});

const emits = defineEmits(['refreshData']);

// 定义竞赛标签类型
interface CompetitionTag {
  name: string;
  type: string;
}

// 定义竞赛数据结构
interface CompetitionData {
  title: string;
  logos: string[];
  start_time: string;
  end_time: string;
  tags: CompetitionTag[];
  problems_list: number[];
  user_list: number[];
  status?: string;
  description?: string;
  uid?: number;
}

// 题目信息缓存
interface QuestionInfo {
  id: number;
  title: string;
}

// 表单和对话框状态
const dialogVisible = ref(false);
const competitionFormRef = ref<FormInstance | null>(null);
const updating = ref(false);

// 创建标签相关
const showTagInput = ref(false);
const newTag = ref({
  name: '',
  type: 'pending'
});

// 题目数据
const problemsInfo = ref<QuestionInfo[]>([]);
const filteredProblems = ref<QuestionInfo[]>([]);
const problemsLoading = ref(false);
const allProblems = ref<QuestionInfo[]>([]);

// 可选题目和用户列表（示例数据，实际应该从API获取）
const availableProblems = ref([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
const availableUsers = ref([101, 102, 103, 104, 105, 106, 107, 108, 109, 110]);

// 表单验证规则
const competitionRules = reactive({
  'title': [
    { required: true, message: '请输入竞赛名称', trigger: 'blur' },
    { min: 3, max: 50, message: '长度在 3 到 50 个字符', trigger: 'blur' }
  ],
  'start_time': [
    { required: true, message: '请设置开始时间', trigger: 'blur' }
  ],
  'end_time': [
    { required: true, message: '请设置结束时间', trigger: 'blur' }
  ]
}) as FormRules;

// 竞赛数据
const competition = reactive<CompetitionData>({
  title: '',
  logos: [],
  start_time: '',
  end_time: '',
  tags: [
    {
      name: '未开始',
      type: 'pending'
    }
  ],
  problems_list: [],
  user_list: [],
  status: 'upcoming',
  description: ''
});

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

// 添加标签
const addTag = () => {
  if (newTag.value.name.trim() === '') {
    ElMessage.warning('标签名称不能为空');
    return;
  }
  
  competition.tags.push({
    name: newTag.value.name,
    type: newTag.value.type
  });
  
  // 重置并隐藏标签输入
  newTag.value.name = '';
  newTag.value.type = 'pending';
  showTagInput.value = false;
};

// 移除标签
const removeTag = (index: number) => {
  competition.tags.splice(index, 1);
};

// 搜索题目
const searchProblems = (query: string) => {
  if (query === '') {
    filteredProblems.value = allProblems.value;
    return;
  }
  
  // 搜索逻辑：匹配ID或标题
  const searchText = query.toLowerCase();
  filteredProblems.value = allProblems.value.filter(problem => {
    const idMatch = problem.id.toString().includes(searchText);
    const titleMatch = problem.title.toLowerCase().includes(searchText);
    return idMatch || titleMatch;
  });
};

// 获取题目标题信息
const fetchQuestionsInfo = async (problemIds: number[] = []) => {
  problemsLoading.value = true;
  
  try {
    // 如果已有所有题目数据，不再重复获取
    if (allProblems.value.length > 0) {
      problemsLoading.value = false;
      filteredProblems.value = allProblems.value;
      return;
    }
    
    // 获取所有可用题目
    const response = await axios.get("http://localhost:5000/api/");
    const apiData = response.data;
    
    // 处理API返回的数据
    const results = apiData.map((item, index) => ({
      id: index + 1,
      title: item.question?.title || `题目 ${index + 1}`
    }));
    
    allProblems.value = results;
    filteredProblems.value = results;
    problemsInfo.value = results;
    
  } catch (error) {
    console.error('获取题目信息失败:', error);
  } finally {
    problemsLoading.value = false;
  }
};

// 打开编辑竞赛对话框
const openEditDialog = async (competitionData: CompetitionData) => {
  // 重置表单
  if (competitionFormRef.value) {
    competitionFormRef.value.resetFields();
  }
  
  // 填充竞赛数据
  Object.assign(competition, competitionData);
  
  // 获取题目详细信息
  if (competition.problems_list && competition.problems_list.length > 0) {
    await fetchQuestionsInfo(competition.problems_list);
  }
  
  // 打开对话框
  dialogVisible.value = true;
};

// 提交更新的竞赛信息
const updateCompetition = async () => {
  if (!competitionFormRef.value) return;
  
  try {
    // 表单验证
    await competitionFormRef.value.validate();
    
    updating.value = true;
    
    // 确保开始时间和结束时间是合法格式
    if (typeof competition.start_time !== 'string' || competition.start_time === '') {
      competition.start_time = new Date().toISOString();
    }
    
    if (typeof competition.end_time !== 'string' || competition.end_time === '') {
      // 默认设置为开始时间后24小时
      const endDate = new Date(competition.start_time);
      endDate.setHours(endDate.getHours() + 24);
      competition.end_time = endDate.toISOString();
    }
    
    console.log('提交竞赛更新数据:', JSON.stringify(competition));
    
    // 发送更新竞赛请求
    const response = await axios({
      url: `http://localhost:5000/api/races/${competition.uid}`,
      method: 'put',
      data: competition
    });
    
    // 更新成功
    if (props.alertBoxRef) {
      props.alertBoxRef.show('竞赛更新成功!', 0);
    } else {
      ElMessage.success('竞赛更新成功!');
    }
    
    dialogVisible.value = false;
    
    // 通知父组件刷新数据
    emits('refreshData');
    
  } catch (error: any) {
    if (error.message?.includes('validate')) {
      ElMessage.error('请填写所有必填字段');
    } else {
      console.error('更新竞赛失败:', error);
      if (props.alertBoxRef) {
        props.alertBoxRef.show(`更新竞赛失败: ${error.response?.data?.message || error.message || '未知错误'}`, 1);
      } else {
        ElMessage.error(`更新竞赛失败: ${error.response?.data?.message || error.message || '未知错误'}`);
      }
    }
  } finally {
    updating.value = false;
  }
};

// 获取特定竞赛的详细信息
const fetchRaceDetails = async (uid: number) => {
  try {
    const response = await axios({
      url: `http://localhost:5000/api/races/${uid}`,
      method: 'get'
    });
    
    // 填充竞赛数据
    Object.assign(competition, response.data);
    
    return response.data;
  } catch (error) {
    console.error('获取竞赛详情失败:', error);
    if (props.alertBoxRef) {
      props.alertBoxRef.show('获取竞赛详情失败，请稍后重试', 1);
    } else {
      ElMessage.error('获取竞赛详情失败，请稍后重试');
    }
    return null;
  }
};

// 暴露方法给父组件
defineExpose({
  openEditDialog,
  fetchRaceDetails
});
</script>

<style scoped>
.form-row {
  display: flex;
  gap: 24px;
}

.competition-tag {
  margin-right: 8px;
  margin-bottom: 8px;
}

.tag-input {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 8px;
}

.tip-text {
  font-size: 12px;
  color: #999;
  margin-top: 4px;
}

.problem-option {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.problem-id {
  font-size: 12px;
  color: #999;
}

.problem-title {
  font-size: 14px;
  font-weight: bold;
}
</style>
