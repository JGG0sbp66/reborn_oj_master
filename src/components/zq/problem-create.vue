<template>
  <div>
    <!-- 创建题目表单弹窗 -->
    <el-dialog
      v-model="dialogVisible"
      title="创建新题目"
      width="600px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      class="problem-create-dialog" style="margin-top: 100px;"
    >
      <div class="dialog-content-wrapper">
        <el-form 
          ref="problemFormRef" 
          :model="problem" 
          :rules="problemRules" 
          label-width="100px"
          label-position="top"
          class="scrollable-form"
        >
          <el-form-item label="题目名称" prop="title">
            <el-input v-model="problem.title" placeholder="请输入题目名称"></el-input>
          </el-form-item>
          
          <el-form-item label="题目分类" prop="topic">
            <el-select v-model="problem.topic" placeholder="请选择题目分类">
              <el-option label="入门" value="入门"></el-option>
              <el-option label="普及" value="普及"></el-option>
              <el-option label="提高" value="提高"></el-option>
              <el-option label="省选" value="省选"></el-option>
              <el-option label="NOI" value="NOI"></el-option>
              <el-option label="CTSC" value="CTSC"></el-option>
            </el-select>
          </el-form-item>
          
          <div class="form-row">
            <el-form-item label="时间限制(ms)" prop="time_limit">
              <el-input-number v-model="problem.time_limit" :min="100" :max="10000" :step="100"></el-input-number>
            </el-form-item>
            
            <el-form-item label="内存限制(MB)" prop="memory_limit">
              <el-input-number v-model="problem.memory_limit" :min="16" :max="1024" :step="16"></el-input-number>
            </el-form-item>
          </div>
          
          <el-form-item label="题目描述" prop="description">
            <el-input 
              v-model="problem.description" 
              type="textarea" 
              :rows="5" 
              placeholder="请输入题目描述"
            ></el-input>
          </el-form-item>
          
          <el-form-item label="输入格式" prop="input_format">
            <el-input 
              v-model="problem.input_format" 
              type="textarea" 
              :rows="3" 
              placeholder="请描述输入格式"
            ></el-input>
          </el-form-item>
          
          <el-form-item label="输出格式" prop="output_format">
            <el-input 
              v-model="problem.output_format" 
              type="textarea" 
              :rows="3" 
              placeholder="请描述输出格式"
            ></el-input>
          </el-form-item>
          
          <el-form-item label="约束条件">
            <div class="constraints-section">
              <div class="constraint-input-group">
                <el-input 
                  v-model="constraint" 
                  placeholder="请输入约束条件"
                  @keyup.enter="addConstraint"
                ></el-input>
                <el-button @click="addConstraint" :disabled="!constraint">添加</el-button>
              </div>
              <div class="constraints-list" v-if="problem.constraints.length > 0">
                <div 
                  v-for="(item, index) in problem.constraints" 
                  :key="index"
                  class="constraint-item"
                >
                  <span>{{ item }}</span>
                  <el-icon @click="removeConstraint(index)" class="delete-icon"><Delete /></el-icon>
                </div>
              </div>
              <el-empty v-else description="暂无约束条件" :image-size="80"></el-empty>
            </div>
          </el-form-item>
          
          <el-form-item label="示例">
            <div class="examples-section">
              <div class="example-inputs">
                <el-input 
                  v-model="currentExample.input" 
                  type="textarea" 
                  :rows="2" 
                  placeholder="示例输入"
                ></el-input>
                <el-input 
                  v-model="currentExample.output" 
                  type="textarea" 
                  :rows="2" 
                  placeholder="示例输出"
                ></el-input>
                <el-input 
                  v-model="currentExample.explanation" 
                  type="textarea" 
                  :rows="2" 
                  placeholder="示例解释 (可选)"
                ></el-input>
              </div>
              <el-button @click="addExample" :disabled="!currentExample.input || !currentExample.output">
                添加示例
              </el-button>
              
              <div class="examples-list" v-if="problem.examples.length > 0">
                <div 
                  v-for="(example, index) in problem.examples" 
                  :key="index"
                  class="example-item"
                >
                  <div class="example-content">
                    <div><strong>输入:</strong> {{ example.input }}</div>
                    <div><strong>输出:</strong> {{ example.output }}</div>
                    <div v-if="example.explanation"><strong>解释:</strong> {{ example.explanation }}</div>
                  </div>
                  <el-icon @click="removeExample(index)" class="delete-icon"><Delete /></el-icon>
                </div>
              </div>
              <el-empty v-else description="暂无示例" :image-size="80"></el-empty>
            </div>
          </el-form-item>
        </el-form>
      </div>
      
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitProblem" :loading="creating">创建</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, defineProps, defineEmits, defineExpose } from 'vue';
import { ElMessage } from 'element-plus';
import type { FormInstance, FormRules } from 'element-plus';
import { Plus, Delete } from '@element-plus/icons-vue';
import axios from 'axios';

// 定义组件的props和emits
const props = defineProps({
  alertBoxRef: {
    type: Object,
    default: null
  }
});

const emits = defineEmits(['refreshData']);

// 定义题目示例类型
interface Example {
  input: string;
  output: string;
  explanation: string;
}

// 定义新建题目数据结构
interface ProblemData {
  title: string;
  description: string;
  topic: string;
  time_limit: number;
  memory_limit: number;
  input_format: string;
  output_format: string;
  constraints: string[];
  examples: Example[];
}

// 表单和对话框状态
const dialogVisible = ref(false);
const problemFormRef = ref<FormInstance | null>(null);
const creating = ref(false);

// 新题目数据
const problem = reactive<ProblemData>({
  title: '',
  description: '',
  topic: '入门',
  time_limit: 1000,
  memory_limit: 128,
  input_format: '',
  output_format: '',
  constraints: [],
  examples: []
});

// 表单验证规则
const problemRules = reactive<FormRules>({
  'title': [
    { required: true, message: '请输入题目名称', trigger: 'blur' },
    { min: 3, max: 50, message: '长度在 3 到 50 个字符', trigger: 'blur' }
  ],
  'description': [
    { required: true, message: '请输入题目描述', trigger: 'blur' }
  ],
  'topic': [
    { required: true, message: '请选择题目分类', trigger: 'change' }
  ],
  'input_format': [
    { required: true, message: '请输入输入格式', trigger: 'blur' }
  ],
  'output_format': [
    { required: true, message: '请输入输出格式', trigger: 'blur' }
  ]
});

// 当前正在编辑的约束条件和示例
const constraint = ref('');
const currentExample = reactive<Example>({
  input: '',
  output: '',
  explanation: ''
});

// 打开创建题目对话框
const openCreateDialog = () => {
  // 重置表单
  resetForm();
  
  // 显示对话框
  dialogVisible.value = true;
};

// 重置表单
const resetForm = () => {
  // 重置题目数据
  Object.assign(problem, {
    title: '',
    description: '',
    topic: '入门',
    time_limit: 1000,
    memory_limit: 128,
    input_format: '',
    output_format: '',
    constraints: [],
    examples: []
  });
  
  // 重置其他表单状态
  constraint.value = '';
  Object.assign(currentExample, {
    input: '',
    output: '',
    explanation: ''
  });
  
  // 重置表单验证
  if (problemFormRef.value) {
    problemFormRef.value.resetFields();
  }
};

// 添加约束条件
const addConstraint = () => {
  if (constraint.value.trim() === '') {
    ElMessage.warning('约束条件不能为空');
    return;
  }
  
  problem.constraints.push(constraint.value.trim());
  constraint.value = '';
};

// 删除约束条件
const removeConstraint = (index: number) => {
  problem.constraints.splice(index, 1);
};

// 添加示例
const addExample = () => {
  if (currentExample.input.trim() === '' || currentExample.output.trim() === '') {
    ElMessage.warning('示例输入和输出不能为空');
    return;
  }
  
  problem.examples.push({
    input: currentExample.input.trim(),
    output: currentExample.output.trim(),
    explanation: currentExample.explanation.trim()
  });
  
  // 重置当前示例
  currentExample.input = '';
  currentExample.output = '';
  currentExample.explanation = '';
};

// 删除示例
const removeExample = (index: number) => {
  problem.examples.splice(index, 1);
};

// 提交创建题目表单
const submitProblem = async () => {
  if (!problemFormRef.value) return;
  
  try {
    // 表单验证
    await problemFormRef.value.validate();
    
    creating.value = true;
    
    // 验证topic是否符合要求
    const validTopics = ['入门', '普及', '提高', '省选', 'NOI', 'CTSC'];
    if (!validTopics.includes(problem.topic)) {
      ElMessage.error('题目分类必须是：入门, 普及, 提高, 省选, NOI, CTSC 之一');
      creating.value = false;
      return;
    }
    
    // 准备提交数据
    const submitData = {
      question: {
        title: problem.title,
        description: problem.description,
        time_limit: problem.time_limit,
        memory_limit: problem.memory_limit,
        input_format: problem.input_format,
        output_format: problem.output_format,
        constraints: problem.constraints,
        examples: problem.examples
      },
      topic: problem.topic
    };
    
    console.log('提交题目数据:', JSON.stringify(submitData));
    
    try {
      // 发送创建题目请求
      const response = await axios({
        url: '/api/admin-question',
        method: 'post',
        data: submitData
      });
      
      // 记录返回的数据，便于调试
      console.log('题目创建成功，服务器返回:', response.data);
      
      // 创建成功
      if (props.alertBoxRef) {
        props.alertBoxRef.show(`题目"${problem.title}"创建成功! ID: ${response.data.uid || '未知'}`, 0);
      } else {
        ElMessage.success(`题目"${problem.title}"创建成功!`);
      }
      
      dialogVisible.value = false;
      
      // 通知父组件刷新数据
      emits('refreshData');
    } catch (apiError: any) {
      console.error('API请求失败:', apiError);
      let errorMessage = '未知错误';
      
      if (apiError.response) {
        // 服务器响应了错误状态码
        const status = apiError.response.status;
        if (status === 400) {
          errorMessage = '请求数据格式错误 (400)';
          if (apiError.response.data && apiError.response.data.message) {
            errorMessage = apiError.response.data.message;
          }
        } else if (status === 401) {
          errorMessage = '未授权，请先登录 (401)';
        } else if (status === 404) {
          errorMessage = 'API地址未找到 (404)';
        } else if (status === 500) {
          errorMessage = '服务器内部错误 (500)';
        } else {
          errorMessage = `服务器错误 (${status})`;
        }
        
        // 如果服务器返回了详细错误信息
        if (apiError.response.data && apiError.response.data.message) {
          errorMessage += `: ${apiError.response.data.message}`;
        }
      } else if (apiError.request) {
        // 请求已发送但没有收到响应
        errorMessage = '服务器没有响应，请检查网络连接';
      } else {
        // 请求配置出错
        errorMessage = apiError.message || '请求发送失败';
      }
      
      // 显示错误信息
      if (props.alertBoxRef) {
        props.alertBoxRef.show(`创建题目失败: ${errorMessage}`, 1);
      } else {
        ElMessage.error(`创建题目失败: ${errorMessage}`);
      }
    }
    
  } catch (error: any) {
    if (error.message?.includes('validate')) {
      ElMessage.error('请填写所有必填字段');
    } else {
      console.error('创建题目表单验证失败:', error);
      if (props.alertBoxRef) {
        props.alertBoxRef.show(`表单验证失败: ${error.message || '未知错误'}`, 1);
      } else {
        ElMessage.error(`表单验证失败: ${error.message || '未知错误'}`);
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
.problem-create-dialog :deep(.el-dialog__body) {
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
  gap: 20px;
}

.form-row .el-form-item {
  flex: 1;
}

.constraints-section,
.examples-section {
  margin-bottom: 16px;
}

.constraint-input-group {
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
}

.constraint-input-group .el-input {
  flex: 1;
}

.constraints-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 12px;
}

.constraint-item {
  background-color: #f5f7fa;
  padding: 8px 12px;
  border-radius: 4px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.delete-icon {
  cursor: pointer;
  color: #f56c6c;
}

.example-inputs {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 10px;
}

.examples-list {
  margin-top: 15px;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.example-item {
  background-color: #f5f7fa;
  padding: 12px;
  border-radius: 4px;
  display: flex;
  justify-content: space-between;
}

.example-content {
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
}
</style>
