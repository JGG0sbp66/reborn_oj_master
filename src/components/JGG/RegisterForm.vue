<template>
    <alertbox ref="alertboxRef" />
    <main>
        <div class="register-card">
            <div class="register-card-title">OJ Master</div>
            <form @submit.prevent="handleSubmit" class="register-card-form">
                <!-- 用户名输入 -->
                <betInput ref="usernameInput" v-model="form.username" placeholder="请输入用户名" :rules="usernameRules">
                    <template #icon>
                        <svg style="height: 18px;width: 18px;margin-left: 10px;" xmlns="http://www.w3.org/2000/svg"
                            xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 1024 1024">
                            <path
                                d="M858.5 763.6a374 374 0 0 0-80.6-119.5a375.63 375.63 0 0 0-119.5-80.6c-.4-.2-.8-.3-1.2-.5C719.5 518 760 444.7 760 362c0-137-111-248-248-248S264 225 264 362c0 82.7 40.5 156 102.8 201.1c-.4.2-.8.3-1.2.5c-44.8 18.9-85 46-119.5 80.6a375.63 375.63 0 0 0-80.6 119.5A371.7 371.7 0 0 0 136 901.8a8 8 0 0 0 8 8.2h60c4.4 0 7.9-3.5 8-7.8c2-77.2 33-149.5 87.8-204.3c56.7-56.7 132-87.9 212.2-87.9s155.5 31.2 212.2 87.9C779 752.7 810 825 812 902.2c.1 4.4 3.6 7.8 8 7.8h60a8 8 0 0 0 8-8.2c-1-47.8-10.9-94.3-29.5-138.2zM512 534c-45.9 0-89.1-17.9-121.6-50.4S340 407.9 340 362c0-45.9 17.9-89.1 50.4-121.6S466.1 190 512 190s89.1 17.9 121.6 50.4S684 316.1 684 362c0 45.9-17.9 89.1-50.4 121.6S557.9 534 512 534z"
                                fill="currentColor"></path>
                        </svg>
                    </template>
                </betInput>

                <!-- 密码输入 -->
                <betInput ref="passwordInput" v-model="form.password" placeholder="请输入密码" :rules="passwordRules">
                    <template #icon>
                        <svg style="height: 18px;width: 18px;margin-left: 10px;" xmlns="http://www.w3.org/2000/svg"
                            xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 1024 1024">
                            <path
                                d="M512 64L128 192v384c0 212.1 171.9 384 384 384s384-171.9 384-384V192L512 64zm312 512c0 172.3-139.7 312-312 312S200 748.3 200 576V246l312-110l312 110v330z"
                                fill="currentColor"></path>
                            <path
                                d="M378.4 475.1a35.91 35.91 0 0 0-50.9 0a35.91 35.91 0 0 0 0 50.9l129.4 129.4l2.1 2.1a33.98 33.98 0 0 0 48.1 0L730.6 434a33.98 33.98 0 0 0 0-48.1l-2.8-2.8a33.98 33.98 0 0 0-48.1 0L483 579.7L378.4 475.1z"
                                fill="currentColor"></path>
                        </svg>
                    </template>
                </betInput>

                <cfCAPTCHA ref="turnstileWidget" @verified="(token) => form.cfToken = token" class="cf-turnstile"
                    sitekey="0x4AAAAAABC_ObuVF8KoPAhe" />

                <!-- 提交按钮 -->
                <div class="register-card-form-item">
                    <button type="submit" :disabled="isSubmitting">
                        {{ isSubmitting ? '注册中...' : '注册' }}
                    </button>
                </div>
            </form>
        </div>
    </main>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios'
import cfCAPTCHA from "@/components/JGG/cfCAPTCHA.vue";
import alertbox from "@/components/JGG/alertbox.vue";
import betInput from './betInput.vue';

const usernameRules = [
    {
        pattern: /^[a-zA-Z0-9]{5,12}$/,
        message: '用户名需为5-12位字母或数字'
    }
]

const passwordRules = [
    {
        pattern: /^[a-zA-Z0-9]{6,18}$/,
        message: '密码需为6-18位字母或数字'
    }
]

const usernameInput = ref<InstanceType<typeof betInput>>()
const passwordInput = ref<InstanceType<typeof betInput>>()

// 获取路由实例
const router = useRouter();

// 表单数据
const form = ref({
    username: '',
    password: '',
    cfToken: ''
});

const isSubmitting = ref(false);
const alertboxRef = ref<InstanceType<typeof alertbox>>();

const handleSubmit = async () => {
    try {
        isSubmitting.value = true;
        // 前端校验
        const isUsernameValid = usernameInput.value?.validate()
        const isPasswordValid = passwordInput.value?.validate()
        if (!isUsernameValid || !isPasswordValid) {
            alertboxRef.value?.show('注册失败，账号或密码输入有误', 2);
            return;
        }
        // 验证账号密码是否正确
        const { data: userData } = await axios({
            url: 'http://localhost:5000/api/register',
            method: 'post',
            data: {
                username: form.value.username,
                password: form.value.password,
                cfToken: form.value.cfToken
            }
        })

        if (!userData.success) {
            alertboxRef.value?.show('注册失败，' + userData.message, 2);
            return;
        } else {
            alertboxRef.value?.show('注册成功！', 0);
            // 注册成功后跳转到登录页面
            setTimeout(() => {
                router.push('/account/login');
            }, 1000);
        }
    } catch (error) {
        alertboxRef.value?.show('发生未知错误，请联系管理员，错误原因：' + error, 2);
    } finally {
        isSubmitting.value = false;
    }
}

</script>

<style scoped>
.register-card {
    height: 400px;
    /* 增加高度以容纳验证码 */
    width: 420px;
    background-color: #ffffff;
    box-shadow:
        0 2px 4px rgba(0, 0, 0, 0.1),
        0 4px 8px rgba(0, 0, 0, 0.1);
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
    height: 250px;
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

/* Turnstile验证码容器样式 */
.cf-turnstile {
    width: 100%;
    display: flex;
    justify-content: center;
}
</style>