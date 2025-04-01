<template>
    <div class="validated-input-container">
        <div class="input-wrapper" :class="{
            'has-error': showError,
            'focus': isFocused,
            'error-exit': isErrorExiting
        }">
            <slot name="icon"></slot>
            <input v-model="inputValue" @blur="handleBlur" @focus="handleFocus" :type="type" :placeholder="placeholder">
        </div>
        <div class="error-message" :class="{ 'error-exit': isErrorExiting }">
            {{ errorMessage }}
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'

const props = defineProps({
    modelValue: String,
    type: {
        type: String,
        default: 'text'
    },
    placeholder: String,
    // 传入正则表达式和错误信息
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

const showError = computed(() => {
    return !!errorMessage.value && (isDirty.value || props.immediateValidate)
})

const handleBlur = () => {
    isFocused.value = false
    isDirty.value = true
    validate()
}

// 值变化时实时验证（可选）
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
            }, 300) // 匹配动画时长
        } else {
            errorMessage.value = ''
        }
    }

    return isValid
}

// 暴露方法
defineExpose({
    validate
})
</script>

<style scoped>
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
</style>