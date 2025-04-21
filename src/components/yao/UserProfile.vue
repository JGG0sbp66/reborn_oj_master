<template>
  <div class="profile-section">
    <h3 class="section-title">基本资料</h3>
    <div class="profile-form">
      <el-form label-position="top">
        <el-form-item label="用户名">
          <el-input 
            v-model="username" 
            placeholder="请输入用户名"
            class="username-input"
          />
        </el-form-item>
        <el-form-item label="电子邮箱">
          <el-input v-model="email" placeholder="请输入电子邮箱" />
        </el-form-item>
        <el-form-item label="验证码">
          <div class="verification-code-container">
            <el-input 
              v-model="verificationCode" 
              placeholder="请输入验证码" 
              class="verification-input"
            />
            <el-button 
              type="primary" 
              class="verification-btn"
              :disabled="cooldown > 0"
              @click="getVerificationCode"
            >
              {{ cooldown > 0 ? `${cooldown}秒后重试` : '获取验证码' }}
            </el-button>
          </div>
        </el-form-item>
        <el-form-item label="个人简介">
          <el-input v-model="bio" type="textarea" :rows="4" placeholder="介绍一下自己吧..." />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="save-btn" @click="saveProfile">保存更改</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, ref, computed, onMounted, watch } from 'vue';
import { ElMessage, ElLoading } from 'element-plus';
import axios from 'axios';

interface UserProfileData {
  username: string;
  email: string;
  bio: string;
}

const props = defineProps<{
  userProfile: UserProfileData;
}>();

const emit = defineEmits<{
  (e: 'profile-updated', profile: UserProfileData): void;
}>();

// 本地状态
const username = ref(props.userProfile.username || '');
const email = ref(props.userProfile.email || '');
const bio = ref(props.userProfile.bio || '');
const verificationCode = ref('');
const cooldown = ref(0);

// 监听props变化更新本地状态
onMounted(() => {
  updateLocalData();
});

// 添加watch监听器，当props变化时更新本地数据
watch(() => props.userProfile, (newUserProfile) => {
  updateLocalData();
}, { deep: true });

const updateLocalData = () => {
  username.value = props.userProfile.username || '';
  email.value = props.userProfile.email || '';
  bio.value = props.userProfile.bio || '';
};

// 获取验证码
const getVerificationCode = async () => {
  // 验证邮箱格式
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email.value || !emailRegex.test(email.value)) {
    ElMessage({
      message: '请输入有效的电子邮箱',
      type: 'warning'
    });
    return;
  }

  try {
    // 显示加载指示器
    const loadingInstance = ElLoading.service({
      lock: true,
      text: '发送验证码中...',
      background: 'rgba(0, 0, 0, 0.7)'
    });

    // 发送获取验证码请求
    const response = await axios.post('/api/send-email-code', {
      email: email.value
    }, {
      withCredentials: true
    });

    // 关闭加载指示器
    loadingInstance.close();

    if (response.data && response.data.success) {
      ElMessage({
        message: response.data.message || '验证码已发送，请查收邮箱',
        type: 'success'
      });

      // 设置冷却时间（60秒）
      cooldown.value = 60;
      const timer = setInterval(() => {
        cooldown.value--;
        if (cooldown.value <= 0) {
          clearInterval(timer);
        }
      }, 1000);
    } else {
      throw new Error(response.data?.message || '发送验证码失败');
    }
  } catch (error: any) {
    console.error('发送验证码失败:', error);
    ElMessage({
      message: error.response?.data?.message || error.message || '发送验证码失败，请稍后重试',
      type: 'error'
    });
  }
};

// 保存用户资料
const saveProfile = async (): Promise<void> => {
  try {
    // 验证用户名
    if (!username.value.trim()) {
      ElMessage({
        message: '用户名不能为空',
        type: 'warning'
      });
      return;
    }
    
    // 处理邮箱变更 - 如果邮箱有变更且提供了验证码
    if (email.value !== props.userProfile.email) {
      if (!verificationCode.value.trim()) {
        ElMessage({
          message: '更改邮箱需要验证码',
          type: 'warning'
        });
        return;
      }
      
      // 处理邮箱变更
      try {
        // 显示加载指示器
        const loadingInstance = ElLoading.service({
          lock: true,
          text: '修改邮箱中...',
          background: 'rgba(0, 0, 0, 0.7)'
        });
        
        // 发送修改邮箱请求
        const emailResponse = await axios.post('/api/user-change-email', {
          new_email: email.value,
          new_email_code: verificationCode.value
        }, {
          withCredentials: true
        });
        
        // 关闭加载指示器
        loadingInstance.close();
        
        if (!emailResponse.data || !emailResponse.data.success) {
          // 邮箱修改失败，显示错误信息
          ElMessage({
            message: emailResponse.data?.message || '邮箱修改失败',
            type: 'error'
          });
          return; // 终止后续操作
        }
        
        // 邮箱修改成功
        ElMessage({
          message: emailResponse.data.message || '邮箱修改成功',
          type: 'success'
        });
        
        // 更新本地存储中的邮箱
        localStorage.setItem('email', email.value);
        
        // 清空验证码
        verificationCode.value = '';
      } catch (emailError: any) {
        console.error('修改邮箱失败:', emailError);
        ElMessage({
          message: emailError.response?.data?.message || '修改邮箱失败，请稍后重试',
          type: 'error'
        });
        return; // 终止后续操作
      }
    }
    
    // 检查用户名是否变更
    const isUsernameChanged = username.value !== props.userProfile.username;
    
    // 如果用户名变更，修改用户名
    if (isUsernameChanged) {
      try {
        // 显示加载指示器
        const loadingInstance = ElLoading.service({
          lock: true,
          text: '修改用户名中...',
          background: 'rgba(0, 0, 0, 0.7)'
        });
        
        // 发送修改用户名请求
        const usernameResponse = await axios.post('/api/user-change-username', {
          new_username: username.value,
        }, {
          withCredentials: true
        });
        
        // 关闭加载指示器
        loadingInstance.close();
        
        if (!usernameResponse.data || !usernameResponse.data.success) {
          // 用户名修改失败，显示错误信息
          ElMessage({
            message: usernameResponse.data?.message || '用户名修改失败',
            type: 'error'
          });
          return; // 终止后续操作
        }
        
        // 用户名修改成功
        ElMessage({
          message: usernameResponse.data.message || '用户名修改成功',
          type: 'success'
        });
        
        // 更新本地存储中的用户名
        localStorage.setItem('username', username.value);
      } catch (usernameError: any) {
        console.error('修改用户名失败:', usernameError);
        ElMessage({
          message: usernameError.response?.data?.message || '修改用户名失败，请稍后重试',
          type: 'error'
        });
        return; // 终止后续操作
      }
    }
    
    // 如果只修改个人简介，不修改用户名和邮箱
    if (!isUsernameChanged && email.value === props.userProfile.email && bio.value !== props.userProfile.bio) {
      // 发送请求到后端保存个人简介
      const loadingInstance = ElLoading.service({
        lock: true,
        text: '保存个人简介...',
        background: 'rgba(0, 0, 0, 0.7)'
      });
      
      try {
        const response = await axios.post('/api/update-user-info', {
          bio: bio.value
        }, {
          withCredentials: true
        });
        
        // 关闭加载指示器
        loadingInstance.close();
        
        if (!response.data || !response.data.success) {
          throw new Error(response.data?.message || '保存个人简介失败');
        }
        
        ElMessage({
          message: response.data.message || '个人简介已更新',
          type: 'success'
        });
      } catch (error: any) {
        // 关闭加载指示器
        loadingInstance.close();
        
        console.error('保存个人简介失败:', error);
        ElMessage({
          message: error.message || '保存个人简介失败，请稍后重试',
          type: 'error'
        });
        return;
      }
    }
    
    // 创建更新后的用户数据并通知父组件
    const updatedProfile: UserProfileData = {
      username: username.value,
      email: email.value,
      bio: bio.value
    };
    
    // 通知父组件数据已更新
    emit('profile-updated', updatedProfile);
    
  } catch (error: any) {
    console.error('保存用户资料失败:', error);
    ElMessage({
      message: error.message || '保存失败，请稍后重试',
      type: 'error'
    });
  }
};
</script>

<style scoped>
* {
  font-family: 'Microsoft YaHei', sans-serif;
}
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

.profile-form {
  max-width: 600px;
}

/* 验证码输入框容器 */
.verification-code-container {
  display: flex;
  gap: 10px;
}

.verification-input {
  flex: 1;
}

.verification-btn {
  width: 120px;
  background-color: #42b983;
  border-color: #42b983;
  transition: all 0.3s ease;
}

.verification-btn:hover {
  background-color: #33a06f;
  border-color: #33a06f;
  transform: translateY(-2px);
}

.verification-btn:disabled {
  background-color: #a0d6be;
  border-color: #a0d6be;
  color: white;
  cursor: not-allowed;
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

.el-form-item .el-button {
  border-radius: 8px;
  font-weight: 500;
  letter-spacing: 0.5px;
}

.input-tip {
  font-size: 12px;
  color: #999;
  margin-top: 5px;
  margin-left: 2px;
}

.username-input :deep(.el-input__inner) {
  background-color: transparent;
  cursor: text;
}
</style> 