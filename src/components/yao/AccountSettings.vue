<template>
  <div class="profile-section">
    <h3 class="section-title">账户设置</h3>
    <div class="settings-container">
      <div class="profile-form">
        <el-form label-position="top">
          <el-form-item label="修改密码">
            <el-input type="password" v-model="oldPassword" placeholder="当前密码" />
          </el-form-item>
          <el-form-item>
            <el-input type="password" v-model="newPassword" placeholder="新密码" />
          </el-form-item>
          <el-form-item>
            <el-input type="password" v-model="confirmPassword" placeholder="确认新密码" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" class="save-btn" @click="changePassword">修改密码</el-button>
          </el-form-item>
        </el-form>
      </div>
      
      <div class="settings-section">
        <h4 class="settings-subtitle">账户安全</h4>
        <div class="settings-option">
          <div class="option-label">两步验证</div>
          <el-switch v-model="twoFactorEnabled" @change="handleSecurityOptionChange" />
        </div>
        <div class="settings-option">
          <div class="option-label">登录通知</div>
          <el-switch v-model="loginNotificationsEnabled" @change="handleSecurityOptionChange" />
        </div>
      </div>
      
      <div class="settings-section">
        <h4 class="settings-subtitle">隐私设置</h4>
        <div class="settings-option">
          <div class="option-label">公开我的解题记录</div>
          <el-switch v-model="publicSolvedProblems" @change="handlePrivacyOptionChange" />
        </div>
        <div class="settings-option">
          <div class="option-label">公开我的排名</div>
          <el-switch v-model="publicRanking" @change="handlePrivacyOptionChange" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, ref } from 'vue';
import { ElMessage, ElLoading } from 'element-plus';
import axios from 'axios';

interface SecuritySettings {
  twoFactorEnabled: boolean;
  loginNotificationsEnabled: boolean;
}

interface PrivacySettings {
  publicSolvedProblems: boolean;
  publicRanking: boolean;
}

const props = defineProps<{
  securitySettings?: SecuritySettings;
  privacySettings?: PrivacySettings;
}>();

const emit = defineEmits<{
  (e: 'security-settings-updated', settings: SecuritySettings): void;
  (e: 'privacy-settings-updated', settings: PrivacySettings): void;
  (e: 'password-changed'): void;
}>();

// 修改密码相关
const oldPassword = ref('');
const newPassword = ref('');
const confirmPassword = ref('');

// 账户安全设置
const twoFactorEnabled = ref(props.securitySettings?.twoFactorEnabled ?? false);
const loginNotificationsEnabled = ref(props.securitySettings?.loginNotificationsEnabled ?? true);

// 隐私设置
const publicSolvedProblems = ref(props.privacySettings?.publicSolvedProblems ?? true);
const publicRanking = ref(props.privacySettings?.publicRanking ?? true);

// 修改密码
const changePassword = async (): Promise<void> => {
  if (!oldPassword.value || !newPassword.value || !confirmPassword.value) {
    ElMessage({
      message: '请填写所有密码字段',
      type: 'warning'
    });
    return;
  }
  
  if (newPassword.value !== confirmPassword.value) {
    ElMessage({
      message: '两次输入的新密码不一致',
      type: 'error'
    });
    return;
  }
  
  try {
    // 显示加载中
    const loadingInstance = ElLoading.service({
      lock: true,
      text: '正在修改密码...',
      background: 'rgba(0, 0, 0, 0.7)'
    });
    
    // 发送请求到后端修改密码
    const response = await axios.post('http://localhost:5000/api/user-change-password', {
      old_password: oldPassword.value,
      new_password: newPassword.value,
      re_new_password: confirmPassword.value
    }, {
      withCredentials: true
    });
    
    // 关闭加载提示
    loadingInstance.close();
    
    // 处理响应
    if (response.data && response.data.success) {
      ElMessage({
        message: response.data.message || '密码已成功修改',
        type: 'success'
      });
      
      // 清空表单
      oldPassword.value = '';
      newPassword.value = '';
      confirmPassword.value = '';
      
      // 通知父组件密码已修改
      emit('password-changed');
    } else {
      // 后端返回失败信息
      ElMessage({
        message: response.data?.message || '修改密码失败',
        type: 'error'
      });
    }
  } catch (error: any) {
    console.error('修改密码失败:', error);
    
    // 提供更详细的错误信息
    let errorMessage = '修改密码失败，请稍后重试';
    if (error.response) {
      // 服务器响应了，但状态码不是2xx
      errorMessage = error.response.data?.message || `修改密码失败 (${error.response.status})`;
    } else if (error.request) {
      // 请求发送了但没有收到响应
      errorMessage = '服务器未响应，请检查网络连接';
    }
    
    ElMessage({
      message: errorMessage,
      type: 'error'
    });
  }
};

// 处理安全设置变更
const handleSecurityOptionChange = () => {
  const securitySettings: SecuritySettings = {
    twoFactorEnabled: twoFactorEnabled.value,
    loginNotificationsEnabled: loginNotificationsEnabled.value
  };
  
  // 模拟保存到后端
  // axios.post('/api/user/security-settings', securitySettings);
  
  // 通知父组件设置已更新
  emit('security-settings-updated', securitySettings);
};

// 处理隐私设置变更
const handlePrivacyOptionChange = () => {
  const privacySettings: PrivacySettings = {
    publicSolvedProblems: publicSolvedProblems.value,
    publicRanking: publicRanking.value
  };
  
  // 模拟保存到后端
  // axios.post('/api/user/privacy-settings', privacySettings);
  
  // 通知父组件设置已更新
  emit('privacy-settings-updated', privacySettings);
};
</script>

<style scoped>
.profile-section {
  background-color: white;
  border-radius: 12px;
  padding: 25px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.06);
  position: relative;
  transition: all 0.3s ease;
  overflow: hidden;
}

.profile-section:hover {
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0 0 25px;
  padding-bottom: 15px;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  align-items: center;
  position: relative;
}

.section-title::before {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 0;
  width: 50px;
  height: 3px;
  background: linear-gradient(90deg, #42b983, #33c6aa);
  border-radius: 3px;
}

.settings-container {
  display: flex;
  flex-direction: column;
  gap: 25px;
}

.profile-form {
  max-width: 600px;
}

/* Enhance the settings sections */
.settings-section {
  border-top: 1px solid #f0f0f0;
  padding-top: 25px;
  margin-top: 5px;
  position: relative;
}

.settings-section::before {
  content: '';
  position: absolute;
  top: -1px;
  left: 0;
  width: 40px;
  height: 3px;
  background: linear-gradient(90deg, #f0f0f0, transparent);
  border-radius: 3px;
}

.settings-subtitle {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 0 0 20px;
  position: relative;
  display: inline-block;
}

.settings-subtitle::after {
  content: '';
  position: absolute;
  bottom: -5px;
  left: 0;
  width: 100%;
  height: 1px;
  background-color: rgba(66, 185, 131, 0.2);
}

.settings-option {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px dashed rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.settings-option:last-child {
  border-bottom: none;
}

.settings-option:hover {
  background-color: rgba(66, 185, 131, 0.02);
  padding-left: 5px;
}

.option-label {
  font-size: 14px;
  color: #555;
  transition: all 0.3s ease;
}

.settings-option:hover .option-label {
  color: #42b983;
}

.save-btn {
  width: 100%;
  padding: 12px;
  font-size: 16px;
  background-color: #42b983;
  border-color: #42b983;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  z-index: 1;
}

.save-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, rgba(255,255,255,0.2), rgba(255,255,255,0));
  transition: 0.6s;
  z-index: -1;
}

.save-btn:hover::before {
  left: 100%;
}

.save-btn:hover {
  background-color: #33a06f;
  border-color: #33a06f;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(66, 185, 131, 0.2);
}

.el-form-item .el-button {
  border-radius: 8px;
  font-weight: 500;
  letter-spacing: 0.5px;
}

/* 添加一些波纹效果的按钮 */
.el-button {
  position: relative;
  overflow: hidden;
}

.el-button:after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 5px;
  height: 5px;
  background: rgba(255, 255, 255, 0.5);
  opacity: 0;
  border-radius: 100%;
  transform: scale(1, 1) translate(-50%);
  transform-origin: 50% 50%;
}

.el-button:focus:not(:active)::after {
  animation: ripple 1s ease-out;
}

@keyframes ripple {
  0% {
    transform: scale(0, 0);
    opacity: 0.5;
  }
  20% {
    transform: scale(25, 25);
    opacity: 0.5;
  }
  100% {
    opacity: 0;
    transform: scale(40, 40);
  }
}

/* 美化输入框 */
.el-input__inner {
  transition: all 0.3s ease;
}

.el-input__inner:focus {
  border-color: #42b983 !important;
  box-shadow: 0 0 0 2px rgba(66, 185, 131, 0.2);
}

.el-textarea__inner:focus {
  border-color: #42b983 !important;
  box-shadow: 0 0 0 2px rgba(66, 185, 131, 0.2);
}

/* Switch styling */
:deep(.el-switch) {
  --el-switch-on-color: #42b983;
}

:deep(.el-switch.is-checked .el-switch__core) {
  border-color: #42b983;
  background-color: #42b983;
}
</style> 