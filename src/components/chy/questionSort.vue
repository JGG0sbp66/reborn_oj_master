<template>
  <main
    class="Box"
    @click.self="closeAllDropdowns"
  >
    <div class="headerBox">
      <span
        class="headerSpan1"
        tabindex="0"
        :style="statusButtonStyle"
        @mouseover="hoverStatus = true"
        @mouseout="hoverStatus = false"
        @click="toggleStatusDropdown"
      >作答状况</span>
      <svg
        class="hS1"
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        viewBox="0 0 24 24"
        style="width: 16px; height: 16px; position: relative; left: -25px; top: 3px; color: #767c82;margin-left: -20px;transform: rotate(180deg);"
      >
        <path
          d="M6 15l6-6l6 6"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        ></path>
      </svg>
      <span
        class="headerSpan2"
        tabindex="0"
        :style="tagButtonStyle"
        @mouseover="hoverTag = true"
        @mouseout="hoverTag = false"
        @click="toggleTagDropdown"
      >标签</span>
      <svg
        class="hS2"
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        viewBox="0 0 24 24"
        style="width: 16px; height: 16px; position: relative; left: -25px; top: 3px; color: #767c82;margin-left: -20px;transform: rotate(180deg);"
      >
        <path
          d="M6 15l6-6l6 6"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        ></path>
      </svg>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        viewBox="0 0 1024 1024"
        style="width: 16px; height: 16px; margin-left: -20px; position: relative; left: 28px; top: 3px; color: #767c82;"
      >
        <path
          d="M909.6 854.5L649.9 594.8C690.2 542.7 712 479 712 412c0-80.2-31.3-155.4-87.9-212.1c-56.6-56.7-132-87.9-212.1-87.9s-155.5 31.3-212.1 87.9C143.2 256.5 112 331.8 112 412c0 80.1 31.3 155.5 87.9 212.1C256.5 680.8 331.8 712 412 712c67 0 130.6-21.8 182.7-62l259.7 259.6a8.2 8.2 0 0 0 11.6 0l43.6-43.5a8.2 8.2 0 0 0 0-11.6zM570.4 570.4C528 612.7 471.8 636 412 636s-116-23.3-158.4-65.6C211.3 528 188 471.8 188 412s23.3-116.1 65.6-158.4C296 211.3 352.2 188 412 188s116.1 23.2 158.4 65.6S636 352.2 636 412s-23.3 116.1-65.6 158.4z"
          fill="currentColor"
        ></path>
      </svg>
      <input
        class="headerInput"
        type="search"
        placeholder="搜索题号、题目"
      >
    </div>
    <div
      class="selection"
      v-show="showStatusDropdown"
    >
      <div style="width: 12px; height: 12px; background-color: white; position: absolute; left: 56px; top:-6px; transform: rotate(45deg); box-shadow: -1px -1px 1px rgba(0, 0, 0, 0.2); z-index: 0;">
      </div>
    </div>
    <div
      class="selection"
      v-show="showStatusDropdown"
    >
      <div class="selectionB">
        <div
          class="selectionE"
          id="1"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink"
            viewBox="0 0 24 24"
            style="width: 16px; height: 16px;  position:absolute; left: 15px; top: 15px;color: gray;"
          >
            <path
              d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10s10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8s8 3.59 8 8s-3.59 8-8 8zm-5-9h10v2H7z"
              fill="currentColor"
            ></path>
          </svg>
          <span>未尝试</span>
        </div>
        <div
          class="selectionE"
          id="2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink"
            viewBox="0 0 24 24"
            style="width: 16px; height: 16px;  position:absolute; left: 15px; top: 49px; color: green;"
          >
            <path
              d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10s10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8s8 3.59 8 8s-3.59 8-8 8zm4.59-12.42L10 14.17l-2.59-2.58L6 13l4 4l8-8z"
              fill="currentColor"
            ></path>
          </svg>
          <span>已通过</span>
        </div>
        <div
          class="selectionE"
          id="3"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink"
            viewBox="0 0 512 512"
            style="width: 16px; height: 16px;  position:absolute; left: 15px; top: 83px; color: red;"
          >
            <path
              d="M448 256c0-106-86-192-192-192S64 150 64 256s86 192 192 192s192-86 192-192z"
              fill="none"
              stroke="currentColor"
              stroke-miterlimit="10"
              stroke-width="32"
            ></path>
            <path
              fill="none"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="32"
              d="M320 320L192 192"
            ></path>
            <path
              fill="none"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="32"
              d="M192 320l128-128"
            ></path>
          </svg>
          <span>未通过</span>
        </div>
      </div>
    </div>
    <div
      class="selection2"
      v-show="showTagDropdown"
    >
      <div style="width: 12px; height: 12px; background-color: white; position: absolute; left: 56px; top:-6px; transform: rotate(45deg); box-shadow: -1px -1px 1px rgba(0, 0, 0, 0.2); z-index: 0;">
      </div>
    </div>
    <div
      class="selection2"
      v-show="showTagDropdown"
    >
      <div class="selectionB">
        <div class="selectionE selectionE-1">
          <span>入门</span>
        </div>
        <div class="selectionE selectionE-2">
          <span>普及</span>
        </div>
        <div class="selectionE selectionE-3">
          <span>提高</span>
        </div>
        <div class="selectionE selectionE-4">
          <span>省选</span>
        </div>
        <div class="selectionE selectionE-5">
          <span>NOI</span>
        </div>
        <div class="selectionE selectionE-6">
          <span>CTSC</span>
        </div>
      </div>
    </div>
  </main>

</template>

<script>
export default {
  data() {
    return {
      showStatusDropdown: false, // 控制"作答状况"下拉框显示
      showTagDropdown: false, // 控制"标签"下拉框显示
      hoverStatus: false, // 鼠标悬停"作答状况"
      hoverTag: false, // 鼠标悬停"标签"
    };
  },
  methods: {
    // 切换下拉箭头方向
    toggleArrow(element, show) {
      element.style.transform = show ? "rotate(0deg)" : "rotate(180deg)";
      element.style.transition = "transform 0.5s ease";
    },
    // 切换作答状况下拉框
    toggleStatusDropdown() {
      this.showStatusDropdown = !this.showStatusDropdown;
      const arrow = document.querySelector(".hS1");
      this.toggleArrow(arrow, this.showStatusDropdown);
    },
    // 切换标签下拉框
    toggleTagDropdown() {
      console.log("标签下拉框被点击了");
      this.showTagDropdown = !this.showTagDropdown;
      const arrow = document.querySelector(".hS2");
      this.toggleArrow(arrow, this.showTagDropdown);
      console.log(this.showTagDropdown);
    },
    // 关闭所有下拉框
    closeAllDropdowns() {
      if (this.showStatusDropdown) {
        this.showStatusDropdown = false;
        const arrow = document.querySelector(".hS1");
        this.toggleArrow(arrow, false);
      }
      if (this.showTagDropdown) {
        this.showTagDropdown = false;
        const arrow = document.querySelector(".hS2");
        this.toggleArrow(arrow, false);
      }
    },
  },
  computed: {
    // 计算"作答状况"按钮样式
    statusButtonStyle() {
      return {
        backgroundColor: this.hoverStatus ? "#d1e8fc" : "#2E33380D",
        cursor: "pointer",
      };
    },
    // 计算"标签"按钮样式
    tagButtonStyle() {
      return {
        backgroundColor: this.hoverTag ? "#d1e8fc" : "#2E33380D",
        cursor: "pointer",
      };
    },
  },
};
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.Box {
  display: flex;
  flex-direction: column;
  width: 1200px;
  background-color: white;
  border: 1px solid gainsboro;
  border-radius: 15px;
  margin: 16px auto;
  padding: 16px;
  position: relative;
}

.headerBox {
  padding: 0 8px;
  margin-bottom: 8px;
}

.headerSpan1 {
  color: #767c82;
  display: inline-block;
  width: 126px;
  height: 34px;
  background-color: #2e33380d;
  border: 0px;
  padding: 0 14px;
  margin-right: 10px;
  border-radius: 8px;
  line-height: 34px;
  font-size: 14px;
}

.headerSpan2 {
  color: #767c82;
  display: inline-block;
  width: 100px;
  height: 34px;
  background-color: #2e33380d;
  padding: 0 14px;
  margin-right: 10px;
  border-radius: 8px;
  line-height: 34px;
  font-size: 14px;
}

.headerInput {
  width: 230px;
  height: 34px;
  border: 0px;
  background-color: #2e33380d;
  margin-left: 4px;
  border-radius: 8px;
  padding-left: 30px;
  color: #767c82;
  outline: none;
}

.headerInput:hover {
  border: 1px solid green;
}

.headerInput:focus-within {
  border: 2px solid green;
}

.selection {
  position: absolute;
  width: 126px;
  height: 110px;
  background-color: white;
  text-align: center;
  margin-top: 1px;
  margin-left: 8px;
  border-radius: 8px;
  box-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2);
  z-index: 1;
  top: 60px;
}

.selection2 {
  position: absolute;
  width: 126px;
  height: 220px;
  background-color: white;
  text-align: center;
  margin-top: 1px;
  margin-left: 8px;
  border-radius: 8px;
  box-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2);
  z-index: 1;
  top: 60px;
  left: 140px;
}

.selectionB {
  padding: 4px;
}

.selectionE {
  border-bottom: 1px solid #2e33380d;
  font-size: 14px;
  line-height: 34px;
}

.selectionE:hover {
  cursor: pointer;
  background-color: #e7e7e7;
  border-radius: 8px;
}

.selectionE-1:hover {
  background-color: rgb(254, 76, 97);
  border-radius: 8px;
  color: white;
}

.selectionE-2:hover {
  background-color: rgb(243, 156, 17);
  border-radius: 8px;
  color: white;
}

.selectionE-3:hover {
  background-color: rgb(255, 193, 22);
  border-radius: 8px;
  color: white;
}

.selectionE-4:hover {
  background-color: rgb(82, 196, 26);
  border-radius: 8px;
  color: white;
}

.selectionE-5:hover {
  background-color: rgb(157, 61, 207);
  border-radius: 8px;
  color: white;
}

.selectionE-6:hover {
  background-color: rgb(14, 29, 105);
  border-radius: 8px;
  color: white;
}
</style>