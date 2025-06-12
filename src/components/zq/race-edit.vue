<template>
  <div>
    <!-- 编辑竞赛表单弹窗 -->
    <el-dialog
      style="margin-top: 100px;"
      v-model="dialogVisible"
      title="编辑竞赛"
      width="600px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      class="race-edit-dialog"
    >
      <div v-loading="loading" class="loading-container">
        <el-form 
          v-show="!loading"
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
          
          <el-form-item label="竞赛状态" prop="status">
            <el-select v-model="competition.status" placeholder="请选择竞赛状态">
              <el-option label="报名中" value="upcoming"></el-option>
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
              @visible-change="handleSelectOpen"
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
              
              <!-- 加载更多提示 -->
              <div 
                v-if="currentPage < totalPages && !isLoadingMore" 
                class="load-more-item"
                @click.stop="loadMoreQuestions"
              >
                <span>点击加载更多题目</span>
              </div>
              <div v-if="isLoadingMore" class="loading-more-item">
                <span>正在加载更多...</span>
              </div>
            </el-select>
            <div class="tip-text">* 可以输入题目ID或标题进行搜索</div>
          </el-form-item>

          <el-form-item label="参赛用户列表" prop="user_list">
            <div class="user-input-section">
              <el-input
                v-model="newUserId"
                placeholder="输入用户ID并按回车添加"
                @keyup.enter="addUser"
                :disabled="updating"
              >
                <template #append>
                  <el-button @click="addUser" :disabled="!newUserId || updating">
                    添加
                  </el-button>
                </template>
              </el-input>
            </div>
            
            <div class="user-list">
              <el-tag
                v-for="uid in competition.user_list"
                :key="uid"
                closable
                @close="removeUser(uid)"
                class="user-tag"
              >
                {{ userMap.get(uid) || `用户${uid}` }}
              </el-tag>
            </div>
          </el-form-item>
        </el-form>
      </div>
      
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
import { ArrowDown, Loading } from '@element-plus/icons-vue';
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

// 定义比赛数据接口
interface CompetitionData {
  uid?: number;
  title: string;
  logos: string[];
  start_time: string;
  end_time: string;
  status: string;
  problems_list: number[];
  user_list: number[];
  tags: string[];
  tagTypes: string[];
}

// 添加用户信息接口
interface UserInfo {
  uid: number;
  username: string;
}

// 题目信息缓存
interface QuestionInfo {
  id: number;
  title: string;
  topic?: string;
  submitNum?: number;
  solveNum?: number;
}

// API响应数据接口
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
    examples?: any[];
  };
  topic?: string;
}

// 表单和对话框状态
const dialogVisible = ref(false);
const competitionFormRef = ref<FormInstance | null>(null);
const updating = ref(false);

// 添加加载状态
const loading = ref(false);

// 自定义标签相关
const showCustomTagInput = ref(false);
const customTagName = ref('');

// 自定义比赛类型相关
const showCustomTagTypeInput = ref(false);
const customTagTypeName = ref('');
const customTagTypeValue = ref('');

// 比赛类型选项
const tagTypeOptions = ref([
  { name: '个人赛', type: 'individual' },
  { name: '团队赛', type: 'team' },
  { name: '限时赛', type: 'timed' },
  { name: '公开赛', type: 'public' }
]);

// 题目数据
const problemsInfo = ref<QuestionInfo[]>([]);
const filteredProblems = ref<QuestionInfo[]>([]);
const problemsLoading = ref(false);
const allProblems = ref<QuestionInfo[]>([]);

// 添加分页相关状态
const currentPage = ref(1);
const totalPages = ref(1);
const totalQuestions = ref(0);
const searchQuery = ref('');
const searchTopic = ref('');
const isLoadingMore = ref(false);

// 添加用户名映射
const userMap = ref(new Map<number, string>());

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

// 表单状态
const competition = reactive<CompetitionData>({
  title: '',
  logos: [],
  start_time: '',
  end_time: '',
  status: 'pending',
  problems_list: [],
  user_list: [],
  tags: [],
  tagTypes: []
});

const newUserId = ref('');

// 搜索题目
const searchProblems = async (query: string): Promise<void> => {
  problemsLoading.value = true;
  searchQuery.value = query;
  currentPage.value = 1; // 重置为第一页
  
  try {
    await fetchQuestionsByPage(1, query);
  } catch (error: any) {
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

// 添加分页加载函数
const fetchQuestionsByPage = async (page: number, query: string = searchQuery.value, topic: string = searchTopic.value): Promise<void> => {
  isLoadingMore.value = true;
  
  try {
    console.log(`正在获取第${page}页题目，查询条件: ${query}, 标签: ${topic}`);
    
    // 使用正确的API接口，这里可能需要根据实际接口调整
    const response = await axios.post("/api/admin-get-questions", {
      page,
      topic,
      input: query
    });
    
    console.log('API返回数据:', response.data);
    
    if (response.data && response.data.success && Array.isArray(response.data.questions)) {
      // 处理返回的题目数据
      const questions = response.data.questions.map((item: any) => ({
        id: item.uid,
        title: item.question?.title || `题目 ${item.uid}`,
        topic: item.topic || '',
        submitNum: item.submit_num || 0,
        solveNum: item.solve_num || 0
      }));
      
      if (page === 1) {
        // 如果是第一页，替换现有数据
        filteredProblems.value = questions;
      } else {
        // 否则追加数据
        filteredProblems.value = [...filteredProblems.value, ...questions];
      }
      
      // 更新分页信息
      totalPages.value = response.data.total_page || 1;
      totalQuestions.value = response.data.total_count || 0;
      currentPage.value = page;
      
      console.log(`加载了${questions.length}个题目，当前页${page}，总页数${totalPages.value}`);
      
      // 如果是初次加载，也更新allProblems
      if (allProblems.value.length === 0 && page === 1 && !query && !topic) {
        allProblems.value = [...questions];
      }
    } else {
      console.warn('API返回数据格式不正确或没有题目数据');
      if (page === 1) {
        filteredProblems.value = [];
      }
    }
  } catch (error) {
    console.error(`获取第${page}页题目失败:`, error);
    
    // 如果API不可用，可以尝试使用备用API
    try {
      console.log('尝试使用备用API获取题目');
      const fallbackResponse = await axios.get("/api/admin-question");
      if (fallbackResponse.data && Array.isArray(fallbackResponse.data)) {
        const questions = fallbackResponse.data.map((item: any) => ({
          id: item.uid || 0,
          title: item.question?.title || `题目 ${item.uid || 0}`
        }));
        filteredProblems.value = questions;
        console.log('使用备用API获取题目成功:', questions.length);
      }
    } catch (fallbackError) {
      console.error('备用API也失败:', fallbackError);
      if (page === 1) {
        filteredProblems.value = [];
      }
    }
  } finally {
    isLoadingMore.value = false;
  }
};

// 加载更多题目
const loadMoreQuestions = async (): Promise<void> => {
  if (currentPage.value < totalPages.value && !isLoadingMore.value) {
    console.log(`加载更多题目，当前页 ${currentPage.value}，总页数 ${totalPages.value}`);
    await fetchQuestionsByPage(currentPage.value + 1);
  }
};

// 获取题目标题信息 - 修改为使用分页API
const fetchQuestionsInfo = async (problemIds: number[] = []): Promise<void> => {
  problemsLoading.value = true;
  
  try {
    // 先获取第一页数据
    await fetchQuestionsByPage(1);
    
    // 如果有特定的problemIds，确保它们被加载
    if (problemIds.length > 0) {
      console.log('需要加载特定题目IDs:', problemIds);
      const missingIds = problemIds.filter(id => 
        !filteredProblems.value.some((p: QuestionInfo) => p.id === id)
      );
      
      if (missingIds.length > 0) {
        console.log('尝试单独加载缺失的题目:', missingIds);
        // 尝试单独获取这些题目信息
        await Promise.all(missingIds.map(id => fetchSingleProblemTitle(id)));
      }
    }
  } catch (error: any) {
    console.error('获取题目信息失败:', error);
  } finally {
    problemsLoading.value = false;
  }
};

// 获取单个题目的标题
const fetchSingleProblemTitle = async (problemId: number): Promise<void> => {
  try {
    console.log(`正在获取题目${problemId}的详细信息`);
    const response = await axios.post("/api/question-detail", {
      uid: problemId
    });
    
    if (response.data && response.data.success && response.data.question_detail) {
      const title = response.data.question_detail.title || `题目 ${problemId}`;
      // 创建新的题目对象
      const newProblem = {
        id: problemId,
        title: title,
        topic: response.data.topic || '',
        submitNum: response.data.submit_num || 0,
        solveNum: response.data.solve_num || 0
      };
      
      // 更新到缓存
      const index = filteredProblems.value.findIndex((p: QuestionInfo) => p.id === problemId);
      if (index >= 0) {
        filteredProblems.value[index] = newProblem;
      } else {
        // 添加新题目
        filteredProblems.value.push(newProblem);
      }
      
      // 也更新到allProblems中
      const allIndex = allProblems.value.findIndex((p: QuestionInfo) => p.id === problemId);
      if (allIndex >= 0) {
        allProblems.value[allIndex] = newProblem;
      } else {
        allProblems.value.push(newProblem);
      }
      
      console.log(`题目${problemId}信息已更新:`, newProblem);
    } else {
      console.warn(`获取题目${problemId}的详细信息失败，API返回:`, response.data);
    }
  } catch (error) {
    console.error(`获取题目 ${problemId} 标题失败:`, error);
  }
};

// 修改预加载已选题目的逻辑
const preloadSelectedProblems = async (problemIds: number[]): Promise<QuestionInfo[]> => {
  return await Promise.all(
    problemIds.map(async (id: number) => {
      try {
        const response = await axios.post("/api/question-detail", { uid: id });
        if (response.data && response.data.success && response.data.question_detail) {
          return {
            id: id,
            title: response.data.question_detail.title || `题目 ${id}`,
            topic: response.data.topic || '',
            submitNum: response.data.submit_num || 0,
            solveNum: response.data.solve_num || 0
          };
        }
        return { id: id, title: `题目 ${id}` };
      } catch (error) {
        console.error(`获取题目 ${id} 信息失败:`, error);
        return { id: id, title: `题目 ${id}` };
      }
    })
  );
};

// 打开编辑竞赛对话框
const openEditDialog = async (competitionData: CompetitionData): Promise<void> => {
  // 立即显示对话框和加载动画
  dialogVisible.value = true;
  loading.value = true;

  try {
    // 重置表单
    if (competitionFormRef.value) {
      competitionFormRef.value.resetFields();
    }
    
    // 重置分页状态
    currentPage.value = 1;
    totalPages.value = 1;
    searchQuery.value = '';
    searchTopic.value = '';
    
    // 清空之前的数据
    Object.assign(competition, {
      title: '',
      logos: [],
      start_time: '',
      end_time: '',
      status: 'upcoming', // 修改默认状态
      problems_list: [],
      user_list: [],
      tags: [],
      tagTypes: []
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
    
    // 确保tags和tagTypes是数组
    if (!Array.isArray(competition.tags)) {
      competition.tags = [];
    }
    
    if (!Array.isArray(competition.tagTypes)) {
      competition.tagTypes = [];
    }
    
    console.log('打开编辑对话框,当前竞赛数据:', JSON.stringify(competition));
    
    // 修改预加载已选题目的逻辑
    if (competition.problems_list && competition.problems_list.length > 0) {
      console.log('正在预加载已选择的题目信息:', competition.problems_list);
      // 使用新的预加载函数
      const selectedProblems = await preloadSelectedProblems(competition.problems_list);
      
      // 更新到缓存
      filteredProblems.value = selectedProblems;
      allProblems.value = [...selectedProblems];
      console.log('已选题目预加载完成:', selectedProblems);
      
      // 然后再获取第一页题目，补充更多题目
      setTimeout(() => {
        fetchQuestionsByPage(1).catch(error => {
          console.error('获取题目列表失败:', error);
        });
      }, 500);
    } else {
      // 如果没有已选题目，直接获取第一页
      await fetchQuestionsInfo();
    }

    // 获取所有用户的用户名
    userMap.value.clear();
    if (competition.user_list && competition.user_list.length > 0) {
      try {
        const promises = competition.user_list.map((uid: number) => 
          axios.get(`/api/get-username/${uid}`)
        );
        const responses = await Promise.all(promises);
        responses.forEach((response, index) => {
          if (response.data.success) {
            userMap.value.set(competition.user_list[index], response.data.message);
          }
        });
      } catch (error) {
        console.error('获取用户名列表失败:', error);
      }
    }
  } catch (error) {
    console.error('初始化竞赛数据失败:', error);
    if (props.alertBoxRef) {
      props.alertBoxRef.show('加载竞赛数据失败', 1);
    } else {
      ElMessage.error('加载竞赛数据失败');
    }
  } finally {
    // 如果数据已经准备好，立即关闭加载动画
    if (competition.title && competition.problems_list) {
      loading.value = false;
    } else {
      // 否则给一个很短的延迟以确保平滑过渡
      setTimeout(() => {
        loading.value = false;
      }, 100);
    }
  }
};

// 提交更新的竞赛信息
const updateCompetition = async (): Promise<void> => {
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
    
    // 确保tags和tagTypes是数组
    if (!Array.isArray(submissionData.tags)) {
      submissionData.tags = [];
    }
    
    if (!Array.isArray(submissionData.tagTypes)) {
      submissionData.tagTypes = [];
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
      url: `/api/races/${submissionData.uid}`,
      method: 'put',
      data: submissionData
    });
    
    console.log('更新竞赛响应:', response);
    
    // 更新成功
    if (props.alertBoxRef) {
      props.alertBoxRef.show('竞赛更新成功', 0);
    } else {
      ElMessage.success('竞赛更新成功');
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
const fetchRaceDetails = async (uid: number): Promise<void> => {
  try {
    console.log(`正在获取竞赛详情，ID: ${uid}`);
    
    const response = await axios({
      url: `/api/races/${uid}`,
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
      user_list: [],
      tags: [],
      tagTypes: []
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
      user_list: Array.isArray(raceData.user_list) ? raceData.user_list : [],
      tags: Array.isArray(raceData.tags) ? raceData.tags : [],
      tagTypes: Array.isArray(raceData.tagTypes) ? raceData.tagTypes : []
    });
    
    console.log('处理后的竞赛数据:', JSON.stringify(competition));
    
    // 优先加载已选题目信息
    if (competition.problems_list && competition.problems_list.length > 0) {
      console.log('正在预加载已选择的题目信息:', competition.problems_list);
      // 先单独获取已选题目信息
      const selectedProblems = await Promise.all(
        competition.problems_list.map(async (id: number) => {
          try {
            const response = await axios.get(`/api/get-question/${id}`);
            if (response.data && response.data.question) {
              return {
                id: id,
                title: response.data.question?.title || `题目 ${id}`,
                topic: response.data.topic || '',
                submitNum: response.data.submit_num || 0,
                solveNum: response.data.solve_num || 0
              };
            }
            return { id: id, title: `题目 ${id}` };
          } catch (error) {
            console.error(`获取题目 ${id} 信息失败:`, error);
            return { id: id, title: `题目 ${id}` };
          }
        })
      );
      
      // 更新到缓存
      filteredProblems.value = selectedProblems;
      allProblems.value = [...selectedProblems];
      console.log('已选题目预加载完成:', selectedProblems);
      
      // 然后再获取第一页题目，补充更多题目
      setTimeout(() => {
        fetchQuestionsByPage(1).catch(error => {
          console.error('获取题目列表失败:', error);
        });
      }, 500);
    }

    // 获取所有用户的用户名
    userMap.value.clear();
    if (competition.user_list && competition.user_list.length > 0) {
      try {
        const promises = competition.user_list.map((uid: number) => 
          axios.get(`/api/get-username/${uid}`)
        );
        const responses = await Promise.all(promises);
        responses.forEach((response, index) => {
          if (response.data.success) {
            userMap.value.set(competition.user_list[index], response.data.message);
          }
        });
      } catch (error) {
        console.error('获取用户名列表失败:', error);
      }
    }
  } catch (error) {
    console.error('获取竞赛详情失败:', error);
    if (props.alertBoxRef) {
      props.alertBoxRef.show('获取竞赛详情失败，请稍后重试', 1);
    } else {
      ElMessage.error('获取竞赛详情失败，请稍后重试');
    }
  }
};

// 添加自定义标签
const addCustomTag = (): void => {
  if (customTagName.value.trim() !== '') {
    if (!competition.logos.includes(customTagName.value)) {
      competition.logos.push(customTagName.value);
    }
    customTagName.value = '';
    showCustomTagInput.value = false;
  }
};

// 添加自定义比赛类型
const addCustomTagType = (): void => {
  if (customTagTypeName.value.trim() !== '' && customTagTypeValue.value.trim() !== '') {
    if (!competition.tagTypes.includes(customTagTypeValue.value)) {
      competition.tagTypes.push(customTagTypeValue.value);
      // 添加到选项中，如果需要的话
      tagTypeOptions.value.push({
        name: customTagTypeName.value,
        type: customTagTypeValue.value
      });
    }
    customTagTypeName.value = '';
    customTagTypeValue.value = '';
    showCustomTagTypeInput.value = false;
  }
};

// 添加用户
const addUser = async (): Promise<void> => {
  if (!newUserId.value) return;
  
  try {
    const uid = parseInt(newUserId.value);
    if (isNaN(uid)) {
      if (props.alertBoxRef) {
        props.alertBoxRef.show('请输入有效的用户ID', 1);
      } else {
        ElMessage.error('请输入有效的用户ID');
      }
      return;
    }

    const response = await axios.get(`/api/get-username/${uid}`);
    
    if (response.data.success) {
      const username = response.data.message;
      
      // 检查是否已存在
      if (!competition.user_list.includes(uid)) {
        competition.user_list.push(uid);
        userMap.value.set(uid, username);
        if (props.alertBoxRef) {
          props.alertBoxRef.show(`成功添加用户: ${username}`, 0);
        } else {
          ElMessage.success(`成功添加用户: ${username}`);
        }
      } else {
        if (props.alertBoxRef) {
          props.alertBoxRef.show('该用户已在列表中', 2);
        } else {
          ElMessage.warning('该用户已在列表中', 2);
        }
      }
    } else {
      if (props.alertBoxRef) {
        props.alertBoxRef.show(response.data.message, 2);
      } else {
        ElMessage.error(response.data.message, 2);
      }
    }
  } catch (error) {
    console.error('获取用户名失败:', error);
    if (props.alertBoxRef) {
      const errorMessage = (error as any)?.response?.data?.message || '未知错误';
      props.alertBoxRef.show(errorMessage, 2);
    } else {
      ElMessage.error('获取用户名失败', 2);
    }
  }
  
  newUserId.value = ''; // 清空输入框
};

// 移除用户
const removeUser = (uid: number): void => {
  competition.user_list = competition.user_list.filter((id: number) => id !== uid);
};

// 获取当前竞赛数据
const getCompetition = (): CompetitionData => {
  return { ...competition };
};

// 处理下拉菜单打开事件
const handleSelectOpen = (visible: boolean): void => {
  if (visible) {
    console.log('题目选择下拉框已打开，正在加载题目');
    if (filteredProblems.value.length === 0) {
      // 如果没有题目数据，获取第一页
      fetchQuestionsByPage(1);
    }
  }
};

// 暴露方法给父组件
defineExpose({
  openEditDialog,
  fetchRaceDetails,
  getCompetition
});
</script>

<style scoped>
/* 修改对话框样式 */
:deep(.race-edit-dialog .el-dialog__body) {
  height: 60vh;
  overflow-y: auto;
  padding: 20px;
}

/* 自定义滚动条样式 */
:deep(.race-edit-dialog .el-dialog__body::-webkit-scrollbar) {
  width: 6px;
}

:deep(.race-edit-dialog .el-dialog__body::-webkit-scrollbar-thumb) {
  background: #dcdfe6;
  border-radius: 3px;
}

:deep(.race-edit-dialog .el-dialog__body::-webkit-scrollbar-track) {
  background: #f5f7fa;
  border-radius: 3px;
}

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
  padding: 2px 0;
}

.problem-id {
  font-size: 12px;
  color: #999;
  margin-right: 10px;
}

.problem-title {
  font-size: 14px;
  font-weight: bold;
}

.user-input-section {
  margin-bottom: 10px;
}

.user-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.user-tag {
  margin-right: 8px;
  margin-bottom: 8px;
}

.loading-container {
  height: 60vh;
  position: relative;
}

:deep(.el-loading-mask) {
  background-color: rgba(255, 255, 255, 0.1) !important;
}

:deep(.el-loading-spinner .circular) {
  width: 42px;
  height: 42px;
}

:deep(.el-loading-spinner .el-loading-text) {
  color: var(--el-color-primary);
  margin: 3px 0;
  font-size: 14px;
}

/* 自定义加载更多样式 */
.load-more-item, .loading-more-item {
  text-align: center;
  padding: 8px;
  color: var(--el-color-primary);
  cursor: pointer;
  font-size: 14px;
  border-top: 1px solid #ebeef5;
  margin-top: 8px;
}

.load-more-item:hover {
  background-color: #f5f7fa;
}

.loading-more-item {
  color: #909399;
}

/* 修复下拉菜单样式 */
:deep(.el-select-dropdown__wrap) {
  max-height: 300px;
}

:deep(.el-select__popper) {
  max-height: 350px !important;
}
</style>

