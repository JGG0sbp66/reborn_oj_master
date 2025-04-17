<template>
  <div>
    <!-- 编辑题目表单弹窗 -->
    <el-dialog
      v-model="dialogVisible"
      title="编辑题目"
      width="600px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-form 
        ref="problemFormRef" 
        :model="problem" 
        :rules="problemRules" 
        label-width="120px"
        label-position="top"
      >
        <el-form-item label="题目名称" prop="title">
          <el-input v-model="problem.title" placeholder="请输入题目名称"></el-input>
        </el-form-item>
        
        <el-form-item label="题目难度" prop="topic">
          <el-select v-model="problem.topic" placeholder="请选择题目难度" style="width: 100%">
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
      
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="updateProblem" :loading="updating">保存</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { ElMessage } from 'element-plus';
import type { FormInstance, FormRules } from 'element-plus';
import { Delete } from '@element-plus/icons-vue';
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

// 定义题目数据结构
interface ProblemData {
  id: string;
  title: string;
  description: string;
  topic: string;
  time_limit: number;
  memory_limit: number;
  input_format: string;
  output_format: string;
  constraints: string[];
  examples: Example[];
  passRate?: number;
  submissionCount?: number;
  createTime?: string;
}

// 表单和对话框状态
const dialogVisible = ref(false);
const problemFormRef = ref<FormInstance | null>(null);
const updating = ref(false);

// 题目数据
const problem = reactive<ProblemData>({
  id: '',
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

// 打开编辑题目对话框
const openEditDialog = async (problemData: ProblemData) => {
  console.log('打开编辑题目对话框，接收数据:', JSON.stringify(problemData));
  
  // 重置表单
  if (problemFormRef.value) {
    problemFormRef.value.resetFields();
  }
  
  // 确保problemData不为空并且包含必要的字段
  if (!problemData || !problemData.id) {
    ElMessage.error('题目数据无效，无法编辑');
    return;
  }
  
  // 填充题目数据
  Object.assign(problem, {
    id: problemData.id || '',
    title: problemData.title || '',
    description: problemData.description || '',
    topic: problemData.topic || '入门',
    time_limit: problemData.time_limit || 1000,
    memory_limit: problemData.memory_limit || 128,
    input_format: problemData.input_format || '',
    output_format: problemData.output_format || '',
    constraints: Array.isArray(problemData.constraints) ? [...problemData.constraints] : [],
    examples: Array.isArray(problemData.examples) ? [...problemData.examples] : []
  });
  
  console.log('题目数据已填充:', JSON.stringify(problem));
  
  // 显示对话框
  dialogVisible.value = true;
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

// 提交更新题目表单
const updateProblem = async () => {
  if (!problemFormRef.value) return;
  
  try {
    // 表单验证
    await problemFormRef.value.validate();
    
    updating.value = true;
    
    // 提取题目ID号
    const problemId = problem.id.replace('P', '');
    
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
    
    console.log('提交题目更新数据:', JSON.stringify(submitData));
    
    // 修正正则表达式，提取ID中的数字部分
    const matches = problem.id.match(/P1(\d+)/);
    const numericId = matches ? parseInt(matches[1], 10) : 0;
    
    console.log(`正在更新题目，原始ID: ${problem.id}, 实际ID: ${numericId}`);
    
    // 发送更新题目请求
    const response = await axios({
      url: `http://localhost:5000/api/${numericId}`,
      method: 'put',
      data: submitData
    });
    
    // 更新成功
    if (props.alertBoxRef) {
      props.alertBoxRef.show('题目更新成功!', 0);
    } else {
      ElMessage.success('题目更新成功!');
    }
    
    dialogVisible.value = false;
    
    // 通知父组件刷新数据
    emits('refreshData');
    
  } catch (error: any) {
    if (error.message?.includes('validate')) {
      ElMessage.error('请填写所有必填字段');
    } else {
      console.error('更新题目失败:', error);
      if (props.alertBoxRef) {
        props.alertBoxRef.show(`更新题目失败: ${error.response?.data?.message || error.message || '未知错误'}`, 1);
      } else {
        ElMessage.error(`更新题目失败: ${error.response?.data?.message || error.message || '未知错误'}`);
      }
    }
  } finally {
    updating.value = false;
  }
};

// 暴露方法给父组件
defineExpose({
  openEditDialog
});
</script>

<style scoped>
.form-row {
  display: flex;
  gap: 24px;
}

.form-row .el-form-item {
  flex: 1;
}

.constraints-section, .examples-section {
  width: 100%;
}

.constraint-input-group {
  display: flex;
  gap: 10px;
  margin-bottom: 16px;
}

.constraint-input-group .el-input {
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

.example-item {
  padding: 12px;
}

.delete-icon {
  cursor: pointer;
  color: #909399;
}

.delete-icon:hover {
  color: #f56c6c;
}

.example-inputs {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 16px;
}

.example-content {
  font-size: 13px;
  color: #606266;
  flex: 1;
}

.example-content div {
  margin-bottom: 4px;
}

.tip-text {
  font-size: 12px;
  color: #909399;
  margin-top: 6px;
}

/* Responsive styles */
@media (max-width: 768px) {
  .form-row {
    flex-direction: column;
    gap: 0;
  }
  
  .form-row .el-form-item {
    width: 100%;
  }
}
</style>
