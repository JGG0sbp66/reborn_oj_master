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
import { defineProps, defineEmits, ref, computed, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
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

// 监听props变化更新本地状态
onMounted(() => {
  updateLocalData();
});

const updateLocalData = () => {
  username.value = props.userProfile.username || '';
  email.value = props.userProfile.email || '';
  bio.value = props.userProfile.bio || '';
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
    
    // 创建更新后的用户数据
    const updatedProfile: UserProfileData = {
      username: username.value,
      email: email.value,
      bio: bio.value
    };

    // 这里应该发送请求到后端保存用户信息
    // const response = await axios.post('/api/user/profile', updatedProfile);
    
    // 通知父组件数据已更新
    emit('profile-updated', updatedProfile);
    
    // 更新本地存储中的用户名
    localStorage.setItem('username', username.value);
    
    // 模拟成功响应
    setTimeout(() => {
      ElMessage({
        message: '个人资料已更新',
        type: 'success'
      });
    }, 500);
  } catch (error) {
    console.error('保存用户资料失败:', error);
    ElMessage({
      message: '保存失败，请稍后重试',
      type: 'error'
    });
  }
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

.profile-form {
  max-width: 600px;
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