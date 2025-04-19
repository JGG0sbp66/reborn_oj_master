<template>
  <transition
    name="fade"
    appear
  >
    <div>
      <alertbox ref="alertboxRef" />
      <main>
        <div class="register-card">
          <div class="register-card-title">OJ Master</div>
          <form
            @submit.prevent="handleSubmit"
            class="register-card-form"
          >
            <!-- 用户名输入 -->
            <betInput
              ref="usernameInput"
              v-model="form.username"
              placeholder="请输入用户名"
              :rules="usernameRules"
              @keydown.enter.prevent="handleEnterKey"
            >
              <template #icon>
                <svg
                  style="height: 18px;width: 18px;margin-left: 10px;"
                  xmlns="http://www.w3.org/2000/svg"
                  xmlns:xlink="http://www.w3.org/1999/xlink"
                  viewBox="0 0 1024 1024"
                >
                  <path
                    d="M858.5 763.6a374 374 0 0 0-80.6-119.5a375.63 375.63 0 0 0-119.5-80.6c-.4-.2-.8-.3-1.2-.5C719.5 518 760 444.7 760 362c0-137-111-248-248-248S264 225 264 362c0 82.7 40.5 156 102.8 201.1c-.4.2-.8.3-1.2.5c-44.8 18.9-85 46-119.5 80.6a375.63 375.63 0 0 0-80.6 119.5A371.7 371.7 0 0 0 136 901.8a8 8 0 0 0 8 8.2h60c4.4 0 7.9-3.5 8-7.8c2-77.2 33-149.5 87.8-204.3c56.7-56.7 132-87.9 212.2-87.9s155.5 31.2 212.2 87.9C779 752.7 810 825 812 902.2c.1 4.4 3.6 7.8 8 7.8h60a8 8 0 0 0 8-8.2c-1-47.8-10.9-94.3-29.5-138.2zM512 534c-45.9 0-89.1-17.9-121.6-50.4S340 407.9 340 362c0-45.9 17.9-89.1 50.4-121.6S466.1 190 512 190s89.1 17.9 121.6 50.4S684 316.1 684 362c0 45.9-17.9 89.1-50.4 121.6S557.9 534 512 534z"
                    fill="currentColor"
                  ></path>
                </svg>
              </template>
            </betInput>

            <!-- 密码输入 -->
            <betInput
              ref="passwordInput"
              v-model="form.password"
              placeholder="请输入密码"
              type="password"
              :rules="passwordRules"
              @keydown.enter.prevent="handleEnterKey"
            >
              <template #icon>
                <svg
                  style="height: 18px;width: 18px;margin-left: 10px;"
                  xmlns="http://www.w3.org/2000/svg"
                  xmlns:xlink="http://www.w3.org/1999/xlink"
                  viewBox="0 0 1024 1024"
                >
                  <path
                    d="M512 64L128 192v384c0 212.1 171.9 384 384 384s384-171.9 384-384V192L512 64zm312 512c0 172.3-139.7 312-312 312S200 748.3 200 576V246l312-110l312 110v330z"
                    fill="currentColor"
                  ></path>
                  <path
                    d="M378.4 475.1a35.91 35.91 0 0 0-50.9 0a35.91 35.91 0 0 0 0 50.9l129.4 129.4l2.1 2.1a33.98 33.98 0 0 0 48.1 0L730.6 434a33.98 33.98 0 0 0 0-48.1l-2.8-2.8a33.98 33.98 0 0 0-48.1 0L483 579.7L378.4 475.1z"
                    fill="currentColor"
                  ></path>
                </svg>
              </template>
            </betInput>

            <!-- 提交按钮 -->
            <div class="register-card-form-item">
              <button
                type="submit"
                :disabled="isSubmitting"
                ref="submitButton"
              >
                {{ isSubmitting ? '登录中...' : '登录' }}
              </button>
            </div>
          </form>
          <div class="link-to-register">
            <router-link :to="{ name: 'repassword' }">忘记密码？点击重置</router-link>
            <router-link :to="{ name: 'register' }">没有账号？点击注册</router-link>
          </div>
        </div>
      </main>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
import alertbox from "@/components/JGG/alertbox.vue";
import betInput from "./betInput.vue";
import { checkAuth } from "@/utils/auth";

// 定义登录成功事件
const emit = defineEmits(["login-success"]);

const usernameRules = [
  {
    pattern: /.{1,}/,
    message: "请输入用户名",
  },
];

const passwordRules = [
  {
    pattern: /.{1,}/,
    message: "请输入密码",
  },
];

const usernameInput = ref<InstanceType<typeof betInput>>();
const passwordInput = ref<InstanceType<typeof betInput>>();
const submitButton = ref<HTMLButtonElement>();

// 获取路由实例
const router = useRouter();

// 表单数据
const form = ref({
  username: "",
  password: "",
  cfToken: "",
});

const isSubmitting = ref(false);
const alertboxRef = ref<InstanceType<typeof alertbox>>();

const handleEnterKey = () => {
  if (!isSubmitting.value) {
    handleSubmit();
  }
};

const handleSubmit = async () => {
  try {
    isSubmitting.value = true;
    // 前端校验
    const isUsernameValid = usernameInput.value?.validate();
    const isPasswordValid = passwordInput.value?.validate();
    if (!isUsernameValid || !isPasswordValid) {
      alertboxRef.value?.show("登录失败，账号或密码不能为空", 2);
      return;
    }
    
    // 登录前立即清除所有头像相关数据
    localStorage.removeItem('avatarBase64');
    localStorage.removeItem('avatar_timestamp');
    localStorage.removeItem('avatarUrl');
    localStorage.removeItem('avatar_user_id');
    
    // 验证账号密码是否正确
    const { data: userData } = await axios({
      url: "http://localhost:5000/api/login",
      method: "post",
      data: {
        username: form.value.username,
        password: form.value.password,
      },
    });

    if (userData.success) {
      alertboxRef.value?.show("登录成功！", 0);

      // 更新登录状态并存储在localStorage
      localStorage.setItem("isLoggedIn", "true");

      // 获取并存储用户信息
      const { authenticated, user } = await checkAuth();
      if (authenticated && user) {
        localStorage.setItem("username", user.uid);
        localStorage.setItem("userRole", user.role);
        
        // 如果有用户ID，尝试获取新用户的头像
        if (user.uid) {
          try {
            // 向服务器请求用户头像
            const avatarResponse = await axios.get(`http://localhost:5000/api/user-avatar/${user.uid}`, {
              responseType: 'blob',
              withCredentials: true
            });
            
            if (avatarResponse.status === 200 && avatarResponse.data) {
              // 创建blob URL用于显示
              const blob = new Blob([avatarResponse.data], { type: 'image/jpeg' });
              
              // 将blob转换为Base64，用于持久化存储
              const reader = new FileReader();
              reader.onloadend = () => {
                if (reader.result) {
                  // 保存Base64格式的图片到localStorage
                  localStorage.setItem('avatarBase64', reader.result.toString());
                  // 更新时间戳
                  localStorage.setItem('avatar_timestamp', Date.now().toString());
                  // 保存当前用户ID与头像的关联
                  localStorage.setItem('avatar_user_id', user.uid);
                }
              };
              reader.readAsDataURL(blob);
            }
          } catch (avatarError) {
            console.error('获取用户头像失败:', avatarError);
            // 头像获取失败不会阻止登录流程
          }
        }
      }

      // 触发登录成功事件，通知父组件
      emit("login-success");

      // 登录成功后跳转到首页
      setTimeout(() => {
        router.push("/nav/home");
      }, 1000);
    }
  } catch (error) {
    if ((error as any).response) {
      alertboxRef.value?.show(
        "登录失败，" + (error as any).response.data.message,
        2
      );
    } else {
      alertboxRef.value?.show(
        "发生未知错误，请联系管理员，错误原因：" + String(error),
        2
      );
    }
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<style scoped>
.register-card {
  height: 400px;
  width: 420px;
  background-color: #ffffff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1), 0 4px 8px rgba(0, 0, 0, 0.1);
  margin: 0 auto;
  margin-top: 200px;
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
}

.register-card-title {
  font-size: 24px;
  font-weight: bolder;
  color: #1f2225;
  margin-top: 20px;
}

.register-card-form {
  width: 300px;
  height: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20px;
}

.register-card-form-item {
  display: flex;
  height: 34px;
  width: 300px;
  align-items: center;
  border: 1px solid #e8e8e8;
  border-radius: 10px;
  transition: all 0.3s;
  margin-top: 15px;
}

.captcha-image {
  height: 34px;
  cursor: pointer;
  border-radius: 10px;
}

.register-card-form-item:hover,
.register-card-form-item:focus-within {
  border-color: #18a058;
  box-shadow: 0 0 0 2px #18a05711;
}

.register-card-form button {
  width: 300px;
  height: 34px;
  border: none;
  outline: none;
  background-color: #18a058;
  color: white;
  border-radius: 10px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s;
}

.register-card-form button:hover {
  background-color: #18a058;
}

.register-card-form button:active {
  background-color: #18a058;
}

.register-card-form button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.link-to-register {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 34px;
  width: 350px;
}

.link-to-register a {
  float: right;
  color: #18a058;
  text-decoration: none;
  font-size: 14px;
}
/* 添加动画样式 */
.fade-enter-active,
.fade-leave-active {
  transition: all 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
</style>