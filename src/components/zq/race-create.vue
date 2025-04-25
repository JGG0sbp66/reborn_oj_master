<template>
  <div>
    <!-- 创建竞赛表单弹窗 -->
    <el-dialog
      v-model="dialogVisible"
      title="创建新竞赛"
      width="600px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      class="race-create-dialog"
    >
      <div class="dialog-content-wrapper">
        <el-form 
          ref="competitionFormRef" 
          :model="competition" 
          :rules="competitionRules" 
          label-width="120px"
          label-position="top"
          class="scrollable-form"
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
          
          <el-form-item label="比赛类型" prop="tags">
            <el-select 
              v-model="competition.tags" 
              multiple 
              placeholder="请选择比赛类型" 
              value-key="type"
              :popper-append-to-body="false"
            >
              <el-option 
                v-for="option in tagTypeOptions" 
                :key="option.type" 
                :label="option.name" 
                :value="option"
              ></el-option>
            </el-select>
            <div class="custom-tag-type-input" v-if="showCustomTagTypeInput">
              <el-input 
                v-model="customTagTypeName" 
                placeholder="输入自定义比赛类型名称" 
                @keyup.enter="addCustomTagType"
              ></el-input>
              <el-button @click="addCustomTagType" :disabled="!customTagTypeName.trim()">添加</el-button>
              <el-button @click="showCustomTagTypeInput = false">取消</el-button>
            </div>
            <el-button size="small" @click="showCustomTagTypeInput = true" v-if="!showCustomTagTypeInput" class="mt-2">
              + 添加自定义比赛类型
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
        </el-form>
      </div>
      
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitCompetition" :loading="creating">创建</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, watch } from 'vue';
import { ElMessage } from 'element-plus';
import type { FormInstance, FormRules } from 'element-plus';
import { Plus, Delete } from '@element-plus/icons-vue';
import axios from 'axios';

// 定义新建竞赛中示例类型
interface ExampleItem {
  input: string;
  output: string;
  explanation: string;
}

// 定义新建竞赛数据结构
interface CreateCompetitionData {
  title: string;
  logos: string[];
  start_time: string;
  end_time: string;
  problems_list: number[];
  topic?: string;
  tags?: Array<{name: string, type: string}>;
}

// 题目信息缓存
interface QuestionInfo {
  id: number;
  title: string;
}

// API响应数据结构
interface ApiProblemItem {
  uid: number;
  id?: number;
  question: {
    title: string;
    description?: string;
    time_limit?: number;
    memory_limit?: number;
    input_format?: string;
    output_format?: string;
    constraints?: string[];
    examples?: ExampleItem[];
  };
  topic?: string;
}

// 当前示例类型
interface CurrentExample {
  input: string;
  output: string;
  explanation: string;
}

// 定义组件的props和emits
const props = defineProps<{
  alertBoxRef?: {
    show: (message: string, type: number) => void;
  } | null;
}>();

const emits = defineEmits<{
  (e: 'refreshData'): void;
}>();

// 表单和对话框状态
const dialogVisible = ref(false);
const competitionFormRef = ref<FormInstance | null>(null);
const creating = ref(false);

// 新竞赛数据
const competition = reactive<CreateCompetitionData>({
  title: '',
  logos: [],
  start_time: '',
  end_time: '',
  problems_list: [],
  description: '',
  time_limit: 1000,
  memory_limit: 128,
  input_format: '',
  output_format: '',
  constraints: [],
  examples: [],
  topic: '入门',
  tags: [{name: '个人赛', type: 'individual'}] // 默认选择个人赛
});

// 表单验证规则
const competitionRules = reactive<FormRules>({
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
});

// 当前正在编辑的约束条件和示例
const constraint = ref('');
const currentExample = reactive<CurrentExample>({
  input: '',
  output: '',
  explanation: ''
});

// 自定义标签相关
const showCustomTagInput = ref(false);
const customTagName = ref('');

// 自定义比赛类型相关
const showCustomTagTypeInput = ref(false);
const customTagTypeName = ref('');
const customTagTypeValue = ref('');

// 题目数据
const problemsInfo = ref<QuestionInfo[]>([]);
const filteredProblems = ref<QuestionInfo[]>([]);
const problemsLoading = ref(false);
const allProblems = ref<QuestionInfo[]>([]);

// 比赛类型选项
const tagTypeOptions = [
  {name: '个人赛', type: 'individual'},
  {name: '团队赛', type: 'team'},
  {name: 'OI赛制', type: 'oi'},
  {name: 'ACM赛制', type: 'acm'}
];

// 搜索题目
const searchProblems = (query: string): void => {
  if (query === '') {
    filteredProblems.value = allProblems.value;
    return;
  }
  
  // 搜索逻辑：匹配ID或标题
  const searchText = query.toLowerCase();
  filteredProblems.value = allProblems.value.filter((problem: QuestionInfo) => {
    const idMatch = problem.id.toString().includes(searchText);
    const titleMatch = problem.title.toLowerCase().includes(searchText);
    return idMatch || titleMatch;
  });
};

// 获取题目标题信息
const fetchQuestionsInfo = async (problemIds: number[] = []): Promise<void> => {
  problemsLoading.value = true;
  
  try {
    // 如果已有所有题目数据，不再重复获取
    if (allProblems.value.length > 0) {
      problemsLoading.value = false;
      filteredProblems.value = allProblems.value;
      return;
    }
    
    // 获取所有可用题目
    const response = await axios.get("/api/admin-question");
    const apiData = response.data as ApiProblemItem[];
    
    // 处理API返回的数据
    const results = apiData.map((item: ApiProblemItem) => ({
      id: item.uid || apiData.indexOf(item) + 1,
      title: item.question?.title || ''
    }));
    
    // 过滤掉没有标题的题目
    const validResults = results.filter(item => item.title);
    
    // 如果有标题为空的题目，尝试单独获取它们的标题
    const emptyTitleItems = results.filter(item => !item.title);
    if (emptyTitleItems.length > 0) {
      await Promise.all(emptyTitleItems.map(item => fetchSingleProblemTitle(item.id)));
    }
    
    allProblems.value = results;
    filteredProblems.value = results;
    problemsInfo.value = results;
    
  } catch (error) {
    console.error('获取题目信息失败:', error);
  } finally {
    problemsLoading.value = false;
  }
};

// 获取单个题目的标题
const fetchSingleProblemTitle = async (problemId: number): Promise<void> => {
  try {
    const response = await axios.get(`/api/${problemId}`);
    const title = response.data.question?.title || '';
    if (title) {
      // 更新到缓存
      const index = allProblems.value.findIndex(p => p.id === problemId);
      if (index >= 0) {
        allProblems.value[index].title = title;
        const filterIndex = filteredProblems.value.findIndex(p => p.id === problemId);
        if (filterIndex >= 0) {
          filteredProblems.value[filterIndex].title = title;
        }
      }
    }
  } catch (error) {
    console.error(`获取题目 ${problemId} 标题失败:`, error);
  }
};

// 添加自定义标签
const addCustomTag = (): void => {
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

// 添加自定义比赛类型
const addCustomTagType = (): void => {
  const tagName = customTagTypeName.value.trim();
  
  if (!tagName) {
    if (props.alertBoxRef) {
      props.alertBoxRef.show('比赛类型名称不能为空', 1);
    } else {
      ElMessage.warning('比赛类型名称不能为空');
    }
    return;
  }
  
  // 检查是否已有相同名称的类型
  if (competition.tags.some(tag => tag.name === tagName)) {
    if (props.alertBoxRef) {
      props.alertBoxRef.show(`比赛类型 "${tagName}" 已存在`, 1);
    } else {
      ElMessage.warning(`比赛类型 "${tagName}" 已存在`);
    }
    return;
  }
  
  // 添加自定义类型
  const customType = 'custom_' + tagName.toLowerCase().replace(/\s+/g, '_');
  competition.tags.push({name: tagName, type: customType});
  
  if (props.alertBoxRef) {
    props.alertBoxRef.show(`添加了自定义比赛类型 "${tagName}"`, 0);
  } else {
    ElMessage.success(`添加了自定义比赛类型 "${tagName}"`);
  }
  
  // 重置表单
  customTagTypeName.value = '';
  showCustomTagTypeInput.value = false;
};

// 打开创建竞赛对话框
const openCreateDialog = async (): Promise<void> => {
  console.log('openCreateDialog被调用，正在打开创建竞赛对话框');
  // 重置表单
  Object.assign(competition, {
    title: '',
    logos: [],
    start_time: '',
    end_time: '',
    problems_list: [],
    tags: [{name: '个人赛', type: 'individual'}]
  });
  
  // 获取题目数据
  await fetchQuestionsInfo();
  
  // 显示对话框
  dialogVisible.value = true;
  
  // 重置其他表单状态
  constraint.value = '';
  Object.assign(currentExample, {
    input: '',
    output: '',
    explanation: ''
  });
  
  // 重置自定义标签表单
  customTagName.value = '';
  showCustomTagInput.value = false;
  
  // 重置自定义比赛类型表单
  customTagTypeName.value = '';
  customTagTypeValue.value = '';
  showCustomTagTypeInput.value = false;
};

// 提交创建竞赛表单
const submitCompetition = async (): Promise<void> => {
  if (!competitionFormRef.value) return;
  
  try {
    // 表单验证
    await competitionFormRef.value.validate();
    
    creating.value = true;
    
    // 确保开始时间和结束时间是ISO格式
    if (typeof competition.start_time !== 'string' || competition.start_time === '') {
      competition.start_time = new Date().toISOString();
    }
    
    if (typeof competition.end_time !== 'string' || competition.end_time === '') {
      // 默认设置为开始时间后24小时
      const endDate = new Date(competition.start_time);
      endDate.setHours(endDate.getHours() + 24);
      competition.end_time = endDate.toISOString();
    }
    
    console.log('提交竞赛数据:', JSON.stringify(competition));
    
    // 发送创建竞赛请求
    const response = await axios({
      url: '/api/races',
      method: 'post',
      data: competition
    });
    
    // 创建成功
    if (props.alertBoxRef) {
      props.alertBoxRef.show('竞赛创建成功!', 0);
    } else {
      ElMessage.success('竞赛创建成功!');
    }
    
    dialogVisible.value = false;
    
    // 通知父组件刷新数据
    emits('refreshData');
    
  } catch (error: any) {
    if (error.message?.includes('validate')) {
      if (props.alertBoxRef) {
        props.alertBoxRef.show('请填写所有必填字段', 1);
      } else {
        ElMessage.error('请填写所有必填字段');
      }
    } else {
      console.error('创建竞赛失败:', error);
      if (props.alertBoxRef) {
        props.alertBoxRef.show(`创建竞赛失败: ${error.response?.data?.message || error.message || '未知错误'}`, 1);
      } else {
        ElMessage.error(`创建竞赛失败: ${error.response?.data?.message || error.message || '未知错误'}`);
      }
    }
  } finally {
    creating.value = false;
  }
};

// 暴露方法给父组件
defineExpose({
  openCreateDialog
});
</script>

<style scoped>
.race-create-dialog :deep(.el-dialog__body) {
  padding: 0;
  max-height: calc(80vh - 120px);
  overflow: hidden;
}

.dialog-content-wrapper {
  padding: 20px;
  max-height: calc(80vh - 120px);
  overflow: hidden;
}

.scrollable-form {
  height: 100%;
  max-height: calc(80vh - 160px);
  overflow-y: auto;
  padding-right: 10px;
}

.scrollable-form::-webkit-scrollbar {
  width: 6px;
}

.scrollable-form::-webkit-scrollbar-thumb {
  background-color: #dcdfe6;
  border-radius: 3px;
}

.scrollable-form::-webkit-scrollbar-track {
  background-color: #f5f7fa;
}

.dialog-footer {
  padding: 10px 20px;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.form-row {
  display: flex;
  gap: 24px;
}

.form-row .el-form-item {
  flex: 1;
}

.constraints-list, .examples-list {
  margin-top: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.constraint-item, .example-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  background-color: #f8f9fa;
  border-radius: 6px;
  font-size: 14px;
}

.constraint-item .el-icon, .example-item .el-icon {
  cursor: pointer;
  color: #909399;
}

.constraint-item .el-icon:hover, .example-item .el-icon:hover {
  color: #f56c6c;
}

.example-inputs {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 16px;
}

.example-content {
  font-size: 13px;
  color: #606266;
  margin: 4px 0;
  flex: 1;
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

.competition-tag {
  margin-right: 8px;
  margin-bottom: 8px;
}

.tag-input {
  margin-top: 8px;
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.tag-input .el-select {
  width: 120px;
}

.tag-input .el-input {
  width: 150px;
}

.custom-tag-input {
  margin-top: 10px;
  display: flex;
  gap: 10px;
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

.tip-text {
  font-size: 12px;
  color: #999;
  margin-top: 4px;
}

.mt-2 {
  margin-top: 8px;
}
</style>
