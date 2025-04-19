<template>
  <transition
    name="fade"
    appear
  >
    <div>
      <alertbox ref="alertboxRef" />
      <main>
        <div class="register-card">
          <div class="register-card-title">
            <div class="text-container">
              <div class="typing-text">
                <template v-for="(char, index) in processedTitle" :key="index">
                  <span 
                    class="title-char"
                    :class="{ 'visible': index < visibleChars }"
                  >{{ char === ' ' ? '\u00A0' : char }}</span>
                </template>
                <span class="cursor" :style="{ left: cursorPosition + 'px' }">|</span>
              </div>
            </div>
          </div>
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

            <!-- 邮箱输入 -->
            <betInput
              ref="emailInput"
              v-model="form.email"
              placeholder="请输入邮箱"
              type="text"
              :rules="emailRules"
            >
              <template #icon>
                <svg
                  style="height: 18px;width: 18px;margin-left: 10px;"
                  xmlns="http://www.w3.org/2000/svg"
                  xmlns:xlink="http://www.w3.org/1999/xlink"
                  viewBox="0 0 32 32"
                >
                  <path
                    d="M28 6H4a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h24a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2zm-2.2 2L16 14.78L6.2 8zM4 24V8.91l11.43 7.91a1 1 0 0 0 1.14 0L28 8.91V24z"
                    fill="currentColor"
                  ></path>
                </svg>
              </template>
            </betInput>

            <!-- 邮箱验证码输入 -->
            <div style="display: flex;justify-content: space-around; gap: 10px;">
              <betInput
                ref="codeInput"
                v-model="form.code"
                placeholder="请输入验证码"
                type="code"
                :rules="codeRules"
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
              <button
                class="verification-btn"
                @click.prevent="sendVerificationCode"
                :disabled="isSendingCode"
                :class="{ 'disabled': isSendingCode }"
              >
                {{ isSendingCode ? (countdown === 60 ? '发送中...' : `${countdown}s后重试`) : '获取验证码' }}
              </button>
            </div>

            <!-- 密码输入 -->
            <betInput
              ref="passwordInput"
              v-model="form.password"
              placeholder="请输入新的密码"
              type="password"
              :rules="passwordRules"
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
              >
                {{ isSubmitting ? '重置密码中...' : '重置密码' }}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
import cfCAPTCHA from "@/components/JGG/cfCAPTCHA.vue";
import alertbox from "@/components/JGG/alertbox.vue";
import betInput from "./betInput.vue";
import { onUnmounted } from "vue";

const usernameRules = [
  {
    pattern: /.{1,}/,
    message: "请输入用户名",
  },
];

const passwordRules = [
  {
    pattern: /^[a-zA-Z0-9]{6,18}$/,
    message: "密码需为6-18位字母或数字",
  },
];

const emailRules = [
  {
    pattern: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
    message: "邮箱格式有误",
  },
];

const codeRules = [
  {
    pattern: /^[0-9]{6}$/,
    message: "验证码有误",
  },
];

const usernameInput = ref<InstanceType<typeof betInput>>();
const emailInput = ref<InstanceType<typeof betInput>>();
const codeInput = ref<InstanceType<typeof betInput>>();
const passwordInput = ref<InstanceType<typeof betInput>>();

// 获取路由实例
const router = useRouter();

// 表单数据
const form = ref({
  username: "",
  email: "",
  code: "",
  password: "",
});

const isSendingCode = ref(false);
const countdown = ref(60);
let countdownTimer: number | null = null;

const sendVerificationCode = async () => {
  const isEmailValid = emailInput.value?.validate();
  if (!isEmailValid) {
    alertboxRef.value?.show("请先输入有效的邮箱地址", 2);
    return;
  }

  try {
    isSendingCode.value = true;
    countdown.value = 60;

    await axios({
      url: "http://localhost:5000/api/send-email-code",
      method: "post",
      data: {
        email: form.value.email,
      },
    });

    countdownTimer = setInterval(() => {
      countdown.value--;
      if (countdown.value <= 0) {
        if (countdownTimer) clearInterval(countdownTimer);
        isSendingCode.value = false;
      }
    }, 1000);

    alertboxRef.value?.show("验证码已发送到您的邮箱", 0);
  } catch (error) {
    isSendingCode.value = false;
    countdown.value = 60;
    if ((error as any).response) {
      alertboxRef.value?.show(
        "发送失败: " + (error as any).response.data.message,
        2
      );
    } else {
      alertboxRef.value?.show("发送验证码失败", 2);
    }
  }
};

onUnmounted(() => {
  if (countdownTimer) clearInterval(countdownTimer);
});

const isSubmitting = ref(false);
const alertboxRef = ref<InstanceType<typeof alertbox>>();

const handleSubmit = async () => {
  try {
    isSubmitting.value = true;
    // 前端校验
    const isUsernameValid = usernameInput.value?.validate();
    const isEmailValid = emailInput.value?.validate();
    const isCodeValid = codeInput.value?.validate();
    const isPasswordValid = passwordInput.value?.validate();
    if (!isUsernameValid || !isEmailValid || !isCodeValid || !isPasswordValid) {
      alertboxRef.value?.show("注册失败，输入内容有误", 2);
      return;
    }
    // 验证账号密码是否正确
    const { data: userData } = await axios({
      url: "http://localhost:5000/api/repassword",
      method: "post",
      data: {
        username: form.value.username,
        email: form.value.email,
        email_code: form.value.code,
        password: form.value.password,
      },
    });

    if (userData.success) {
      alertboxRef.value?.show("重置密码成功！", 0);
      setTimeout(() => {
        router.push("/account/login");
      }, 1000);
    }
  } catch (error) {
    if ((error as any).response) {
      alertboxRef.value?.show(
        "修改密码失败，" + (error as any).response.data.message,
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

// 打字效果相关
const title = "OJ Master";
const processedTitle = computed(() => title.split(''));
const visibleChars = ref(0);
const typingSpeed = 200; // 每个字符显示间隔(毫秒)
const cursorPosition = ref(0);

// 监视可见字符数的变化，更新光标位置
watch(visibleChars, (newVal) => {
  updateCursorPosition();
});

// 更新光标位置
const updateCursorPosition = () => {
  // 在下一个微任务中执行，确保DOM已更新
  setTimeout(() => {
    const visibleSpans = document.querySelectorAll('.title-char.visible');
    if (visibleSpans.length > 0) {
      const lastVisibleSpan = visibleSpans[visibleSpans.length - 1];
      const rect = lastVisibleSpan.getBoundingClientRect();
      const containerRect = document.querySelector('.typing-text')?.getBoundingClientRect();
      
      if (containerRect) {
        // 计算相对于容器的位置
        cursorPosition.value = rect.right - containerRect.left;
      }
    } else {
      cursorPosition.value = 0;
    }
  }, 0);
};

onMounted(() => {
  // 启动打字效果
  startTypingEffect();
});

const startTypingEffect = () => {
  // 重置
  visibleChars.value = 0;
  cursorPosition.value = 0;
  
  // 打字效果计时器
  const typingTimer = setInterval(() => {
    if (visibleChars.value < processedTitle.value.length) {
      visibleChars.value++;
    } else {
      clearInterval(typingTimer);
    }
  }, typingSpeed);
};
</script>

<style scoped>
.verification-btn {
  min-width: 110px;
  height: 34px;
  border: none;
  border-radius: 8px;
  background: linear-gradient(135deg, #18a058, #0d8a4d);
  color: white;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
  padding: 0 16px;
  box-shadow: 0 2px 6px rgba(24, 160, 88, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
}

.verification-btn:hover:not(.disabled) {
  background: linear-gradient(135deg, #0d8a4d, #18a058);
  box-shadow: 0 4px 8px rgba(24, 160, 88, 0.3);
  transform: translateY(-1px);
}

.verification-btn:active:not(.disabled) {
  transform: translateY(0);
  box-shadow: 0 2px 4px rgba(24, 160, 88, 0.2);
}

.verification-btn.disabled {
  background: #e0e0e0;
  color: #a0a0a0;
  cursor: not-allowed;
  box-shadow: none;
  transform: none;
}

.register-card {
  height: 500px;
  /* 增加高度以容纳验证码 */
  width: 420px;
  background-color: #ffffff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1), 0 4px 8px rgba(0, 0, 0, 0.1);
  margin: 0 auto;
  margin-top: 0; /* 从200px改为0，让表单在容器中居中 */
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
  display: flex;
  align-items: center;
  justify-content: center;
}

.register-card-form {
  width: 300px;
  height: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
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

.CAPTCHA {
  display: flex;
  width: 100%;
  justify-content: space-between;
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

.register-card-form-item button {
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

/* Turnstile验证码容器样式 */
.cf-turnstile {
  width: 100%;
  display: flex;
  justify-content: center;
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

main {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 重新设计打字效果样式 */
.text-container {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.typing-text {
  position: relative;
  display: inline-block;
  white-space: nowrap;
}

.title-char {
  display: inline-block;
  font-weight: 700;
  color: #18a058;
  opacity: 0;
  transition: opacity 0.1s ease;
  text-shadow: 0 0 5px rgba(24, 160, 88, 0.3);
}

.title-char.visible {
  opacity: 1;
}

.cursor {
  position: absolute;
  top: 0;
  color: #18a058;
  font-weight: 700;
  animation: blink 0.7s infinite;
  transition: left 0.1s ease;
  text-shadow: 0 0 6px rgba(24, 160, 88, 0.4), 0 0 12px rgba(24, 160, 88, 0.2);
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}
</style>