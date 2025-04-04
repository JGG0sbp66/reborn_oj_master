<template>
    <div class="validated-input-container">
        <div class="input-wrapper" :class="{ 'has-error': showError, 'focus': isFocused }">
            <slot name="icon"></slot>
            <input v-model="inputValue" @blur="handleBlur" @focus="handleFocus" :type="showPassword ? 'text' : type"
                :placeholder="placeholder">
            <!-- 美化后的密码切换按钮 -->
            <button v-if="type === 'password'" class="password-toggle" @click.prevent="togglePasswordVisibility"
                :aria-label="showPassword ? '隐藏密码' : '显示密码'">
                <transition name="fade" mode="out-in">
                    <EyeIcon v-if="showPassword" key="visible" />
                    <EyeSlashIcon v-else key="hidden" />
                </transition>
            </button>
        </div>
        <div class="error-message" :class="{ 'error-exit': isErrorExiting }">
            {{ errorMessage }}
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { EyeIcon, EyeSlashIcon } from '@heroicons/vue/24/outline'

const props = defineProps({
    modelValue: String,
    type: {
        type: String,
        default: 'text',
        validator: (value: string) => ['text', 'password', 'email', 'number'].includes(value)
    },
    placeholder: String,
    rules: {
        type: Array as () => {
            pattern: RegExp;
            message: string
        }[],
        default: () => []
    },
    immediateValidate: {
        type: Boolean,
        default: false
    }
})

const emit = defineEmits(['update:modelValue'])

const inputValue = computed({
    get: () => props.modelValue,
    set: (value) => emit('update:modelValue', value)
})

const isFocused = ref(false)
const isDirty = ref(false)
const errorMessage = ref('')
const showPassword = ref(false) // 控制密码是否显示

const showError = computed(() => {
    return !!errorMessage.value && (isDirty.value || props.immediateValidate)
})

const togglePasswordVisibility = () => {
    showPassword.value = !showPassword.value
}

const handleBlur = () => {
    isFocused.value = false
    isDirty.value = true
    validate()
}

watch(inputValue, () => {
    if (isDirty.value || props.immediateValidate) {
        validate()
    }
})

const isErrorExiting = ref(false)

const handleFocus = () => {
    isFocused.value = true
    isErrorExiting.value = false
}

const validate = (): boolean => {
    if (!props.rules.length) return true

    const prevHasError = !!errorMessage.value
    let isValid = true

    for (const rule of props.rules) {
        if (!rule.pattern.test(inputValue.value || '')) {
            errorMessage.value = rule.message
            isValid = false
            break
        }
    }

    if (isValid) {
        if (prevHasError) {
            isErrorExiting.value = true
            setTimeout(() => {
                errorMessage.value = ''
                isErrorExiting.value = false
            }, 300)
        } else {
            errorMessage.value = ''
        }
    }

    return isValid
}

defineExpose({
    validate
})
</script>

<style scoped>
/* 隐藏所有浏览器的默认密码图标 */
input[type="password"]::-webkit-password-toggle-button,
input[type="password"]::-ms-reveal {
    display: none;
}

/* 美化自定义切换按钮 */
.password-toggle {
    position: absolute;
    right: 8px;
    background: none;
    border: none;
    padding: 4px;
    cursor: pointer;
    color: #666;
    transition: all 0.3s;
    border-radius: 50%;
    width: 28px;
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.password-toggle:hover {
    background: rgba(0, 0, 0, 0.05);
    color: #18a058;
}

.password-toggle:active {
    transform: scale(0.9);
}

/* 图标过渡动画 */
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.2s;
}

.fade-enter,
.fade-leave-to {
    opacity: 0;
}

.validated-input-container input {
    border: none;
    outline: none;
    padding: 8px 12px;
    width: 240px;
    font-size: 14px;
}

.input-wrapper {
    display: flex;
    height: 34px;
    width: 300px;
    align-items: center;
    border: 1px solid #e8e8e8;
    border-radius: 10px;
    transition:
        border-color 0.3s ease-out,
        box-shadow 0.3s ease-out;
    position: relative;
}

.input-wrapper.has-error {
    border-color: #f5222d;
    box-shadow: 0 0 0 2px rgba(245, 34, 45, 0.1);
}

.input-wrapper.focus:not(.has-error) {
    border-color: #18a058;
    box-shadow: 0 0 0 2px rgba(24, 160, 88, 0.1);
}

.error-message {
    color: #f5222d;
    font-size: 12px;
    padding: 2px 12px 0;
    height: 20px;
    line-height: 16px;
    opacity: 0;
    transform: translateY(-5px);
    transition:
        opacity 0.3s ease-out,
        transform 0.3s ease-out;
}

.input-wrapper.has-error:not(.error-exit)+.error-message:not(.error-exit),
.input-wrapper.has-error+.error-message:not(.error-exit) {
    opacity: 1;
    transform: translateY(0);
}

.error-message.error-exit {
    opacity: 0 !important;
    transform: translateY(-5px) !important;
}

.password-toggle {
    cursor: pointer;
    margin-right: 8px;
    display: flex;
    align-items: center;
    color: #666;
}
</style>