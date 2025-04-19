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
          <div class="custom-tag-input" v-if="showCustomTagInput">
            <el-input 
              v-model="customTagName" 
              placeholder="输入自定义标签名称" 
              @keyup.enter="addCustomTag"
            ></el-input>
            <el-button @click="addCustomTag" :disabled="!customTagName.trim()">添加</el-button>
            <el-button @click="showCustomTagInput = false">取消</el-button>
          </div>
          <el-button size="small" @click="showCustomTagInput = true" v-if="!showCustomTagInput" class="mt-2">
            + 添加自定义标签
          </el-button>
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
        
        <el-form-item label="竞赛状态" prop="status">
          <el-select v-model="competition.status" placeholder="请选择竞赛状态">
            <el-option label="未开始" value="upcoming"></el-option>
            <el-option label="进行中" value="running"></el-option>
            <el-option label="已结束" value="ended"></el-option>
          </el-select>
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

// 定义竞赛数据结构
interface CompetitionData {
  title: string;
  logos: string[];
  start_time: string;
  end_time: string;
  status: string;
  problems_list: number[];
  user_list: number[];
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

// 自定义标签相关
const showCustomTagInput = ref(false);
const customTagName = ref('');

// 题目数据
const problemsInfo = ref<QuestionInfo[]>([]);
const filteredProblems = ref<QuestionInfo[]>([]);
const problemsLoading = ref(false);
const allProblems = ref<QuestionInfo[]>([]);

// 可选题目和用户列表（示例数据，实际应该从API获取）
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
  ],
  'status': [
    { required: true, message: '请选择竞赛状态', trigger: 'change' }
  ]
}) as FormRules;

// 竞赛数据
const competition = reactive<CompetitionData>({
  title: '',
  logos: [],
  start_time: '',
  end_time: '',
  status: 'upcoming', // 修改默认状态
  problems_list: [],
  user_list: []
});

// 搜索题目
const searchProblems = async (query: string): Promise<void> => {
  problemsLoading.value = true;
  try {
    // 如果查询为空，显示所有题目
    if (!query) {
      filteredProblems.value = allProblems.value;
      return;
    }
    
    // 本地搜索已加载的题目
    filteredProblems.value = allProblems.value.filter(problem => 
      problem.title.toLowerCase().includes(query.toLowerCase()) || 
      problem.id.toString().includes(query)
    );
    
    // 如果没有本地匹配结果，可以考虑从API获取更多题目
    if (filteredProblems.value.length === 0 && allProblems.value.length > 0) {
      try {
        const response = await axios.get("http://localhost:5000/api/problems", {
          params: { query }
        });
        
        if (response.data && Array.isArray(response.data)) {
          const newProblems = response.data.map((item: any, index: number) => ({
            id: item.id || index + 1,
            title: item.title || `题目 ${index + 1}`
          }));
          
          // 合并新的题目并去重
          const combinedProblems = [...allProblems.value, ...newProblems];
          allProblems.value = Array.from(new Map(combinedProblems.map(item => [item.id, item])).values());
          
          // 重新过滤
          filteredProblems.value = allProblems.value.filter(problem => 
            problem.title.toLowerCase().includes(query.toLowerCase()) || 
            problem.id.toString().includes(query)
          );
        }
      } catch (error) {
        console.error('API搜索题目失败:', error);
      }
    }
  } catch (error) {
    console.error('搜索题目时出错:', error);
    if (props.alertBoxRef) {
      props.alertBoxRef.show('搜索题目时出错', 1);
    } else {
      ElMessage.error('搜索题目时出错');
    }
  } finally {
    problemsLoading.value = false;
  }
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
  
  // 清空之前的数据
  Object.assign(competition, {
    title: '',
    logos: [],
    start_time: '',
    end_time: '',
    status: 'upcoming', // 修改默认状态
    problems_list: [],
    user_list: []
  });
  
  // 填充竞赛数据
  Object.assign(competition, competitionData);
  
  // 如果logos不是数组，初始化为空数组
  if (!Array.isArray(competition.logos)) {
    competition.logos = [];
  }
  
  // 确保problems_list和user_list是数组
  if (!Array.isArray(competition.problems_list)) {
    competition.problems_list = [];
  }
  
  if (!Array.isArray(competition.user_list)) {
    competition.user_list = [];
  }
  
  console.log('打开编辑对话框,当前竞赛数据:', JSON.stringify(competition));
  
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
    
    // 准备要提交的数据
    const submissionData = { ...competition };
    
    // 确保开始时间和结束时间是合法格式
    if (typeof submissionData.start_time !== 'string' || submissionData.start_time === '') {
      submissionData.start_time = new Date().toISOString();
    }
    
    if (typeof submissionData.end_time !== 'string' || submissionData.end_time === '') {
      // 默认设置为开始时间后24小时
      const endDate = new Date(submissionData.start_time);
      endDate.setHours(endDate.getHours() + 24);
      submissionData.end_time = endDate.toISOString();
    }
    
    // 确保problems_list和user_list是数组
    if (!Array.isArray(submissionData.problems_list)) {
      submissionData.problems_list = [];
    }
    
    if (!Array.isArray(submissionData.user_list)) {
      submissionData.user_list = [];
    }
    
    // 转换日期格式为ISO字符串（如果需要）
    if (submissionData.start_time && typeof submissionData.start_time === 'object') {
      submissionData.start_time = new Date(submissionData.start_time).toISOString();
    }
    
    if (submissionData.end_time && typeof submissionData.end_time === 'object') {
      submissionData.end_time = new Date(submissionData.end_time).toISOString();
    }
    
    // 如果uid不存在，给出提示并返回
    if (!submissionData.uid) {
      if (props.alertBoxRef) {
        props.alertBoxRef.show('竞赛ID不存在，无法更新', 1);
      } else {
        ElMessage.error('竞赛ID不存在，无法更新');
      }
      updating.value = false;
      return;
    }
    
    console.log('准备提交竞赛更新数据:', JSON.stringify(submissionData));
    
    // 发送更新竞赛请求
    const response = await axios({
      url: `http://localhost:5000/api/races/${submissionData.uid}`,
      method: 'put',
      data: submissionData
    });
    
    console.log('更新竞赛响应:', response);
    
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
    console.log(`正在获取竞赛详情，ID: ${uid}`);
    
    const response = await axios({
      url: `http://localhost:5000/api/races/${uid}`,
      method: 'get'
    });
    
    console.log('获取到的竞赛详情:', response.data);
    
    // 清空当前竞赛数据
    Object.assign(competition, {
      title: '',
      logos: [],
      start_time: '',
      end_time: '',
      status: 'pending',
      problems_list: [],
      user_list: []
    });
    
    // 填充竞赛数据
    const raceData = response.data;
    
    // 确保数据的完整性
    Object.assign(competition, {
      uid: raceData.uid || uid,
      title: raceData.title || '',
      logos: Array.isArray(raceData.logos) ? raceData.logos : [],
      start_time: raceData.start_time || new Date().toISOString(),
      end_time: raceData.end_time || new Date().toISOString(),
      status: raceData.status || 'pending',
      problems_list: Array.isArray(raceData.problems_list) ? raceData.problems_list : [],
      user_list: Array.isArray(raceData.user_list) ? raceData.user_list : []
    });
    
    console.log('处理后的竞赛数据:', JSON.stringify(competition));
    
    // 获取题目详细信息
    if (competition.problems_list && competition.problems_list.length > 0) {
      await fetchQuestionsInfo(competition.problems_list);
    }
    
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

// 添加自定义标签
const addCustomTag = () => {
  const tagName = customTagName.value.trim();
  if (!tagName) {
    if (props.alertBoxRef) {
      props.alertBoxRef.show('标签名称不能为空', 1);
    } else {
      ElMessage.warning('标签名称不能为空');
    }
    return;
  }
  
  // 检查是否已有相同名称的标签
  if (competition.logos.includes(tagName)) {
    if (props.alertBoxRef) {
      props.alertBoxRef.show(`标签 "${tagName}" 已存在`, 1);
    } else {
      ElMessage.warning(`标签 "${tagName}" 已存在`);
    }
    return;
  }
  
  // 添加自定义标签
  competition.logos.push(tagName);
  if (props.alertBoxRef) {
    props.alertBoxRef.show(`添加了自定义标签 "${tagName}"`, 0);
  } else {
    ElMessage.success(`添加了自定义标签 "${tagName}"`);
  }
  
  // 重置表单
  customTagName.value = '';
  showCustomTagInput.value = false;
};

// 获取当前竞赛数据
const getCompetition = (): CompetitionData => {
  return { ...competition };
};

// 暴露方法给父组件
defineExpose({
  openEditDialog,
  fetchRaceDetails,
  getCompetition
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
