<template>
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
          style="width: 30px; height: 30px; color: red;"
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
          viewBox="0 0 24 24"
          style="width: 30px; height: 30px; color: green;"
        >
          <path
            d="M5 12l5 5L20 7"
            fill="none"
            stroke="currentColor"
            stroke-width="4"
          />
        </svg>
        <span id="alertMessage">{{ alertMessage }}</span>
      </div>
    </div>
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
  </style>