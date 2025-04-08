<template>
  <transition name="alert-fade">
    <div
      id="alertBox"
      v-if="showAlert"
      @click="closeAlert"
    >
      <div id="alertContent">
        <svg
          v-if="alertType === 'error'"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 512 512"
          style="width: 20px; height: 20px; color: red;"
        >
          <circle
            cx="256"
            cy="256"
            r="200"
            fill="none"
            stroke="currentColor"
            stroke-width="16"
          />
          <path
            fill="none"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-width="16"
            d="M320 320L192 192"
          />
          <path
            fill="none"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-width="16"
            d="M192 320l128-128"
          />
          <text
            x="256"
            y="256"
            font-size="48"
            text-anchor="middle"
            fill="currentColor"
          >!</text>
        </svg>

        <svg
          v-else
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 48 48"
          version="1.1"
          style="width: 20px; height: 20px; color: green;"
        >
          <path
            d="M24,4 C35.045695,4 44,12.954305 44,24 C44,35.045695 35.045695,44 24,44 C12.954305,44 4,35.045695 4,24 C4,12.954305 12.954305,4 24,4 Z M32.6338835,17.6161165 C32.1782718,17.1605048 31.4584514,17.1301307 30.9676119,17.5249942 L30.8661165,17.6161165 L20.75,27.732233 L17.1338835,24.1161165 C16.6457281,23.6279612 15.8542719,23.6279612 15.3661165,24.1161165 C14.9105048,24.5717282 14.8801307,25.2915486 15.2749942,25.7823881 L15.3661165,25.8838835 L19.8661165,30.3838835 C20.3217282,30.8394952 21.0415486,30.8698693 21.5323881,30.4750058 L21.6338835,30.3838835 L32.6338835,19.3838835 C33.1220388,18.8957281 33.1220388,18.1042719 32.6338835,17.6161165 Z"
            fill="none"
            stroke="currentColor"
            stroke-width="4"
          />
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
#alertBox {
  position: fixed;
  left: 50%;
  top: 5%;
  background-color: white;
  padding: 10px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: center;
  z-index: 1000;
  transform: translate(-50%, 0%);
}

#alertContent {
  display: flex;
  align-items: center;
}

#alertContent svg {
  width: 30px;
  height: 30px;
  margin-right: 8px;
}

#alertMessage {
  font-size: 14px;
}

/* 过渡效果 */
.alert-fade-enter-active,
.alert-fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.alert-fade-enter-from,
.alert-fade-leave-to {
  opacity: 0;
  transform: translate(-50%, -20px);
}

.alert-fade-enter-to,
.alert-fade-leave-from {
  opacity: 1;
  transform: translate(-50%, 0);
}
</style>