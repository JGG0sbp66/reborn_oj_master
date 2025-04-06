<template>
  <div class="code">
    <div class="headerBox">
      <span
        class="headerSpan1"
        tabindex="0"
        @click="toggleLanguageSelection"
        @blur="closeLanguageSelection"
      >
        {{ selectedLanguage }}
      </span>
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
    </div>
    <div
      class="selection"
      v-show="showLanguageSelection"
    >
      <div style="width: 12px; height: 12px; background-color: white; position: absolute; left: 80px; top:-6px; transform: rotate(45deg); box-shadow: -1px -1px 1px rgba(0, 0, 0, 0.2); z-index: 0;">
      </div>
    </div>
    <div
      class="selection"
      v-show="showLanguageSelection"
    >
      <div class="selectionB">
        <div
          class="selectionE"
          @click="selectLanguage('C')"
        >
          <div>C</div>
        </div>
        <div
          class="selectionE"
          :class="{ yeah: selectedLanguage === 'C++' }"
          @click="selectLanguage('C++')"
        >
          <div>C++</div>
          <div v-if="selectedLanguage === 'C++'">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              xmlns:xlink="http://www.w3.org/1999/xlink"
              viewBox="0 0 24 24"
              style="width: 20px;height: 20px; position: relative; top: 5px;"
            >
              <path
                d="M5 12l5 5L20 7"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              ></path>
            </svg>
          </div>
        </div>
        <div
          class="selectionE"
          @click="selectLanguage('Java')"
        >
          <div>Java</div>
        </div>
        <div
          class="selectionE"
          @click="selectLanguage('Python')"
        >
          <div>Python</div>
        </div>
      </div>
    </div>
    <div class="codeBody">
      <div class="Aline">
        <div
          class="AlineDiv"
          v-for="(line, index) in codeLines"
          :key="index"
        >
          <span class="lineNumber">{{ index + 1 }}</span>
          <input
            type="text"
            v-model="codeLines[index]"
            @keyup.enter="addNewLine(index)"
            @keyup.delete="removeLineIfEmpty(index)"
          />
        </div>
      </div>
    </div>
    <div class="codefooter"><button @click="submitCode">提交</button></div>
  </div>
</template>
  
  <script>
export default {
  name: "CodeComponent",
  data() {
    return {
      selectedLanguage: "C++",
      showLanguageSelection: false,
      codeLines: [""],
      stateOptions: [
        {
          status: `<svg xmlns="http://www.w3.org/2000/svg"
              xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24"
              style="width: 18px; height: 18px; position: relative; top: 4px; color: #7C7E83;">
              <g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                stroke-linejoin="round">
                <path d="M3 3l18 18"></path>
                <path
                  d="M8.585 4.581c3.225-1.181 7.032-.616 9.66 1.626c2.983 2.543 3.602 6.525 1.634 9.662m-1.908 2.108C15.185 20.167 11.081 20.642 7.7 19L3 20l1.3-3.9C2.063 12.792 2.811 8.56 6.014 6.016">
                </path>
              </g>
            </svg><span style="margin-left: 5px; color:#7C7E83;">编译错误</span>`,
          color: "#7C7E83",
        },
        {
          status: `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24" style="width: 18px; height: 18px; position: relative; top: 4px; color: #00B42A;">
            <path d="M5 12l5 5L20 7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            </path>
            </svg>
            <span style="margin-left: 5px;color: #00B42A;">答案正确</span>`,
          color: "#00B42A",
        },
        {
          status: `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 512 512"style="width: 18px; height: 18px; position: relative; top: 4px; color: #F53F3F;"><path d="M289.94 256l95-95A24 24 0 0 0 351 127l-95 95l-95-95a24 24 0 0 0-34 34l95 95l-95 95a24 24 0 1 0 34 34l95-95l95 95a24 24 0 0 0 34-34z" fill="currentColor"></path></svg>
            <span style="margin-left: 5px;color: #F53F3F;">答案错误</span>`,
          color: "#F53F3F",
        },
        {
          status: `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24" style="width: 18px; height: 18px; position: relative; top: 4px; color: #F4A460;"><g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 9V8a3 3 0 0 1 6 0v1"></path><path d="M8 9h8a6 6 0 0 1 1 3v3a5 5 0 0 1-10 0v-3a6 6 0 0 1 1-3"></path><path d="M3 13h4"></path><path d="M17 13h4"></path><path d="M12 20v-6"></path><path d="M4 19l3.35-2"></path><path d="M20 19l-3.35-2"></path><path d="M4 7l3.75 2.4"></path><path d="M20 7l-3.75 2.4"></path></g></svg>
            <span style="margin-left: 5px;color: #F4A460;">内存超限</span>`,
          color: "#F4A460",
        },
        {
          status: `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 1024 1024" style="width: 18px; height: 18px; position: relative; top: 4px; color: #F4A460;"><path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448s448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372s372 166.6 372 372s-166.6 372-372 372z" fill="currentColor"></path><path d="M686.7 638.6L544.1 535.5V288c0-4.4-3.6-8-8-8H488c-4.4 0-8 3.6-8 8v275.4c0 2.6 1.2 5 3.3 6.5l165.4 120.6c3.6 2.6 8.6 1.8 11.2-1.7l28.6-39c2.6-3.7 1.8-8.7-1.8-11.2z" fill="currentColor"></path></svg>
            <span style="margin-left: 5px; color: #F4A460;">运行超时</span>`,
          color: "#F4A460",
        },
        {
          status: `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 1024 1024" style="width: 18px; height: 18px; position: relative; top: 4px; color: #9932CC;"><path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448s448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372s372 166.6 372 372s-166.6 372-372 372z" fill="currentColor"></path><path d="M464 688a48 48 0 1 0 96 0a48 48 0 1 0-96 0zm24-112h48c4.4 0 8-3.6 8-8V296c0-4.4-3.6-8-8-8h-48c-4.4 0-8 3.6-8 8v272c0 4.4 3.6 8 8 8z" fill="currentColor"></path></svg>
            <span style="margin-left: 5px;color: #9932CC;">运行错误</span>`,
          color: "#9932CC",
        },
      ],
    };
  },
  methods: {
    toggleLanguageSelection() {
      this.showLanguageSelection = !this.showLanguageSelection;
    },
    closeLanguageSelection() {
      setTimeout(() => {
        this.showLanguageSelection = false;
      }, 200);
    },
    selectLanguage(language) {
      this.selectedLanguage = language;
      this.showLanguageSelection = false;
    },
    addNewLine(index) {
      if (index === this.codeLines.length - 1) {
        this.codeLines.push("");
      }
    },
    removeLineIfEmpty(index) {
      if (this.codeLines[index] === "" && index > 0) {
        this.codeLines.splice(index, 1);
      }
    },
    getRunTime() {
      const time = Math.floor(Math.random() * 100) + 1;
      return `
        <svg xmlns="http://www.w3.org/2000/svg"
          xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 1024 1024"
          style="width: 14px; height: 14px; position: relative; top: 2px;">
          <path
            d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448s448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372s372 166.6 372 372s-166.6 372-372 372z"
            fill="currentColor"></path>
          <path
            d="M686.7 638.6L544.1 535.5V288c0-4.4-3.6-8-8-8H488c-4.4 0-8 3.6-8 8v275.4c0 2.6 1.2 5 3.3 6.5l165.4 120.6c3.6 2.6 8.6 1.8 11.2-1.7l28.6-39c2.6-3.7 1.8-8.7-1.8-11.2z"
            fill="currentColor"></path>
        </svg>
        <span style="margin-left: 4px; font-size: 14px;">${time}ms</span>
        `;
    },
    getMemoryUsage() {
      const size = Math.floor(Math.random() * 10) + 1;
      return `
        <svg xmlns="http://www.w3.org/2000/svg"
          xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24"
          style="width: 14px; height: 14px; position: relative; top: 2px;">
          <path
            d="M15 9H9v6h6V9zm-2 4h-2v-2h2v2zm8-2V9h-2V7c0-1.1-.9-2-2-2h-2V3h-2v2h-2V3H9v2H7c-1.1 0-2 .9-2 2v2H3v2h2v2H3v2h2v2c0 1.1.9 2 2 2h2v2h2v-2h2v2h2v-2h2c1.1 0 2-.9 2-2v-2h2v-2h-2v-2h2zm-4 6H7V7h10v10z"
            fill="currentColor"></path>
        </svg>
        <span style="margin-left: 4px; font-size: 14px;">${size}MB</span>
        `;
    },
    getSubmitTime() {
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, "0");
      const day = String(now.getDate()).padStart(2, "0");
      const hours = String(now.getHours()).padStart(2, "0");
      const minutes = String(now.getMinutes()).padStart(2, "0");
      const seconds = String(now.getSeconds()).padStart(2, "0");
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    },
    submitCode() {
      const nonEmptyLines = this.codeLines.filter((line) => line.trim() !== "");
      if (nonEmptyLines.length === 0) {
        this.$emit("show-alert", {
          type: "error",
          message: "提交的代码不能为空",
        });
        return;
      }

      this.$emit("show-alert", {
        type: "success",
        message: "提交成功,等待测评",
      });


      // Generate random submission data
      const randomState =
        this.stateOptions[Math.floor(Math.random() * this.stateOptions.length)];
      const submission = {
        status: randomState.status,
        language: this.selectedLanguage,
        runTime: this.getRunTime(),
        memoryUsage: this.getMemoryUsage(),
        submitTime: this.getSubmitTime(),
      };

      // 修复这里：使用 submission 而不是未定义的 submissionData
      this.$emit('submit-code', submission);
    },
  },
};
</script>
  
  <style scoped>
.code {
  width: 50%;
  background-color: white;
  border-radius: 8px;
  box-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2);
}

.headerBox {
  padding: 10px;
}

.headerSpan1 {
  display: inline-block;
  width: 180px;
  height: 34px;
  border: 1px solid lightgray;
  padding: 0 14px;
  margin: 10px;
  border-radius: 8px;
  line-height: 34px;
  font-size: 14px;
}

.headerSpan1:hover {
  border: 1px solid green;
}

.headerSpan1:focus-within {
  border: 2px solid green;
}

.selection {
  position: absolute;
  background-color: white;
  width: 180px;
  height: 147px;
  margin-top: -1px;
  margin-left: 10px;
  border-radius: 8px;
  box-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2);
  z-index: 1;
}

.selectionB {
  padding: 4px;
}

.selectionE {
  border-bottom: 1px solid #2e33380d;
  font-size: 14px;
  line-height: 34px;
  padding-left: 8px;
}

.selectionE:hover {
  cursor: pointer;
  background-color: #e7e7e7;
  border-radius: 8px;
}

.codeBody {
  background-color: #1f2225;
  min-height: 770px;
}

.lineNumber {
  display: inline-block;
  width: 54px;
  height: 22px;
  color: #c6c6c6;
  text-align: end;
  padding-right: 5px;
  padding-top: 1px;
  border-right: 2px solid #282828;
  border-bottom: 2px solid #282828;
  font-size: 14px;
}

.Aline {
  height: 770px;
  overflow-x: hidden;
  overflow-y: auto;
}

.Aline::-webkit-scrollbar {
  display: none;
}

.AlineDiv {
  display: flex;
}

.Aline input {
  width: 100%;
  outline: none;
  background: none;
  border-right: 2px solid #282828;
  border-bottom: 2px solid #282828;
  caret-color: #c6c6c6;
  color: #c6c6c6;
}

.yeah {
  color: green;
  display: flex;
  justify-content: space-between;
}

.codefooter {
  display: flex;
  justify-content: end;
  padding: 8px;
}

.codefooter button {
  width: 80px;
  height: 34px;
  font-size: 14px;
  background-color: #18a058;
  border: 0px;
  border-radius: 8px;
  color: white;
}

.codefooter button:hover {
  cursor: pointer;
}

.codefooter button:active {
  background-color: #128444;
}
</style>