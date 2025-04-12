<template>
  <transition name="alert-fade">
    <div
      id="alertBox"
      v-if="showAlert"
      @click="closeAlert"
      :class="['alert', alertType]"
    >
      <div id="alertContent">
        <svg
          v-if="alertType === 'error'"
          class="alert-icon"
          viewBox="0 0 48 48"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
        >
          <!-- 错误图标 -->
          <g
            stroke="none"
            stroke-width="1"
            fill-rule="evenodd"
          >
            <g fill-rule="nonzero">
              <path
                fill="#d03050"
                d="M24,4 C35.045695,4 44,12.954305 44,24 C44,35.045695 35.045695,44 24,44 C12.954305,44 4,35.045695 4,24 C4,12.954305 12.954305,4 24,4 Z M17.8838835,16.1161165 L17.7823881,16.0249942 C17.3266086,15.6583353 16.6733914,15.6583353 16.2176119,16.0249942 L16.1161165,16.1161165 L16.0249942,16.2176119 C15.6583353,16.6733914 15.6583353,17.3266086 16.0249942,17.7823881 L16.1161165,17.8838835 L22.233,24 L16.1161165,30.1161165 L16.0249942,30.2176119 C15.6583353,30.6733914 15.6583353,31.3266086 16.0249942,31.7823881 L16.1161165,31.8838835 L16.2176119,31.9750058 C16.6733914,32.3416647 17.3266086,32.3416647 17.7823881,31.9750058 L17.8838835,31.8838835 L24,25.767 L30.1161165,31.8838835 L30.2176119,31.9750058 C30.6733914,32.3416647 31.3266086,32.3416647 31.7823881,31.9750058 L31.8838835,31.8838835 L31.9750058,31.7823881 C32.3416647,31.3266086 32.3416647,30.6733914 31.9750058,30.2176119 L31.8838835,30.1161165 L25.767,24 L31.8838835,17.8838835 L31.9750058,17.7823881 C32.3416647,17.3266086 32.3416647,16.6733914 31.9750058,16.2176119 L31.8838835,16.1161165 L31.7823881,16.0249942 C31.3266086,15.6583353 30.6733914,15.6583353 30.2176119,16.0249942 L30.1161165,16.1161165 L24,22.233 L17.8838835,16.1161165 L17.7823881,16.0249942 L17.8838835,16.1161165 Z"
              >
              </path>
            </g>
          </g>
        </svg>

        <svg
          v-else-if="alertType === 'success'"
          class="alert-icon"
          viewBox="0 0 48 48"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
        >
          <!-- 成功图标 -->
          <g
            stroke="none"
            stroke-width="1"
            fill-rule="evenodd"
          >
            <g fill-rule="nonzero">
              <path
                fill="#18a058"
                d="M24,4 C35.045695,4 44,12.954305 44,24 C44,35.045695 35.045695,44 24,44 C12.954305,44 4,35.045695 4,24 C4,12.954305 12.954305,4 24,4 Z M32.6338835,17.6161165 C32.1782718,17.1605048 31.4584514,17.1301307 30.9676119,17.5249942 L30.8661165,17.6161165 L20.75,27.732233 L17.1338835,24.1161165 C16.6457281,23.6279612 15.8542719,23.6279612 15.3661165,24.1161165 C14.9105048,24.5717282 14.8801307,25.2915486 15.2749942,25.7823881 L15.3661165,25.8838835 L19.8661165,30.3838835 C20.3217282,30.8394952 21.0415486,30.8698693 21.5323881,30.4750058 L21.6338835,30.3838835 L32.6338835,19.3838835 C33.1220388,18.8957281 33.1220388,18.1042719 32.6338835,17.6161165 Z"
              >
              </path>
            </g>
          </g>
        </svg>

        <svg
          v-else
          class="alert-icon"
          viewBox="0 0 48 48"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
        >
          <!-- 信息图标 -->
          <g
            stroke="none"
            stroke-width="1"
            fill-rule="evenodd"
          >
            <g fill-rule="nonzero">
              <path
                fill="#2080f0"
                d="M24,4 C35.045695,4 44,12.954305 44,24 C44,35.045695 35.045695,44 24,44 C12.954305,44 4,35.045695 4,24 C4,12.954305 12.954305,4 24,4 Z M24,34 C25.1045695,34 26,33.1045695 26,32 L26,24 C26,22.8954305 25.1045695,22 24,22 C22.8954305,22 22,22.8954305 22,24 L22,32 C22,33.1045695 22.8954305,34 24,34 Z M24,18 C25.1045695,18 26,17.1045695 26,16 C26,14.8954305 25.1045695,14 24,14 C22.8954305,14 22,14.8954305 22,16 C22,17.1045695 22.8954305,18 24,18 Z"
              >
              </path>
            </g>
          </g>
        </svg>
        <span id="alertMessage">{{ alertMessage }}</span>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  props: {
    showAlert: {
      type: Boolean,
      default: false,
    },
    alertType: {
      type: String,
      default: "error",
      validator: (value) => ["error", "success", "info"].includes(value),
    },
    alertMessage: {
      type: String,
      default: "",
    },
  },
  methods: {
    closeAlert() {
      this.$emit("update:showAlert", false);
    },
  },
};
</script>

<style scoped>
/* 过渡动画 */
.alert-fade-enter-active,
.alert-fade-leave-active {
  transition: all 0.3s ease;
}

.alert-fade-enter-from,
.alert-fade-leave-to {
  opacity: 0;
  transform: translateY(-20px) translateX(-50%);
}

/* 基础样式 */
.alert {
  position: fixed;
  top: 90px;
  left: 50%;
  transform: translateX(-50%);
  padding: 12px 18px;
  border-radius: 8px;
  background-color: #ffffff;
  color: #1f2225;
  font-size: 14px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  display: inline-flex;
  align-items: center;
  z-index: 9999;
  max-width: 80%;
}

.alert:hover {
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
}

#alertContent {
  display: flex;
  align-items: center;
}

.alert-icon {
  height: 20px;
  width: 20px;
  margin-right: 12px;
  flex-shrink: 0;
}

#alertMessage {
  line-height: 1.5;
  white-space: normal;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .alert {
    width: auto;
    max-width: 90%;
    padding: 12px 16px;
  }
}
</style>