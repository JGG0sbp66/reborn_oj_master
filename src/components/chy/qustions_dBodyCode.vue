<template>
  <div class="code">
    <div class="headerBox">
      <div
        class="language-selector"
        tabindex="0"
        @click="toggleLanguageSelection"
        @blur="closeLanguageSelection"
      >
        <span class="selected-language">{{ selectedLanguage }}</span>
        <svg
          class="dropdown-icon"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          :class="{ 'rotate-icon': showLanguageSelection }"
        >
          <path
            d="M6 9l6 6 6-6"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </div>
      <div
        class="selection"
        v-show="showLanguageSelection"
      >
        <div class="selectionB">
          <div
            class="selectionE"
            :class="{ yeah: selectedLanguage === 'C' }"
            @click="selectLanguage('C')"
          >
            <div>C</div>
            <div v-if="selectedLanguage === 'C'">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                style="width: 20px;height: 20px; position: relative; top: 2px;"
              >
                <path
                  d="M5 12l5 5L20 7"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </div>
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
                viewBox="0 0 24 24"
                style="width: 20px;height: 20px; position: relative; top: 2px;"
              >
                <path
                  d="M5 12l5 5L20 7"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </div>
          </div>
          <div
            class="selectionE"
            :class="{ yeah: selectedLanguage === 'Java' }"
            @click="selectLanguage('Java')"
          >
            <div>Java</div>
            <div v-if="selectedLanguage === 'Java'">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                style="width: 20px;height: 20px; position: relative; top: 2px;"
              >
                <path
                  d="M5 12l5 5L20 7"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </div>
          </div>
          <div
            class="selectionE"
            :class="{ yeah: selectedLanguage === 'Python' }"
            @click="selectLanguage('Python')"
          >
            <div>Python</div>
            <div v-if="selectedLanguage === 'Python'">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                style="width: 20px;height: 20px; position: relative; top: 2px;"
              >
                <path
                  d="M5 12l5 5L20 7"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </div>
          </div>
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
          <div class="code-input-wrapper">
            <input
              type="text"
              v-model="codeLines[index]"
              @keydown="handleKeyDown($event, index)"
              @keyup.enter="addNewLine(index)"
              @keyup.delete="removeLineIfEmpty(index)"
              :ref="'input_' + index"
              @input="handleInput(index)"
            />
            <pre
              class="highlighted-code"
              v-html="highlightedLines[index]"
            ></pre>
          </div>
        </div>
      </div>
    </div>
    <div class="codefooter"><button @click="submitCode">提交</button></div>
  </div>
</template>
  
<script>
import hljs from "highlight.js";
import "highlight.js/styles/github-dark.css";

export default {
  name: "CodeComponent",
  data() {
    return {
      selectedLanguage: "C++",
      showLanguageSelection: false,
      codeLines: [""],
      isEnterKeyDown: false,
      isBackspaceKeyDown: false,
      enterKeyInterval: null,
      backspaceKeyInterval: null,
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
      highlightedLines: [""], // 存储高亮后的代码行
    };
  },
  watch: {
    selectedLanguage(newLang) {
      this.highlightAllLines();
    },
    codeLines: {
      deep: true,
      handler() {
        this.highlightAllLines();
      },
    },
  },
  methods: {
    toggleLanguageSelection() {
      this.showLanguageSelection = !this.showLanguageSelection;
    },
    closeLanguageSelection() {
      setTimeout(() => {
        // 检查鼠标是否在下拉框上
        const isHovering = this.$el.querySelector(".selection:hover");
        if (!isHovering) {
          this.showLanguageSelection = false;
        }
      }, 200);
    },
    selectLanguage(language) {
      this.selectedLanguage = language;
      this.showLanguageSelection = false;
    },

    addNewLine(index) {
      const inputElement = this.$refs[`input_${index}`][0];
      const cursorPosition = inputElement.selectionStart;
      const currentLine = this.codeLines[index];

      // 如果光标在行末或者行是空的
      if (cursorPosition === currentLine.length || currentLine.trim() === "") {
        this.insertNewLineAfter(index);

        // 设置长按标志
        if (!this.enterKeyInterval) {
          this.enterKeyInterval = setInterval(() => {
            const lastIndex = this.codeLines.length - 1;
            this.insertNewLineAfter(lastIndex);
          }, 100); // 每100ms添加一行
        }
      } else {
        this.splitLineAtCursor(index, cursorPosition);
      }
    },

    // 在指定行后插入新行
    insertNewLineAfter(index) {
      this.codeLines.splice(index + 1, 0, "");
      this.$nextTick(() => {
        const newIndex = index + 1;
        const inputRef = this.$refs[`input_${newIndex}`];
        if (inputRef && inputRef[0]) {
          inputRef[0].focus();
        }
      });
    },

    // 在光标位置分割当前行
    splitLineAtCursor(index, cursorPosition) {
      const currentLine = this.codeLines[index];
      const beforeCursor = currentLine.substring(0, cursorPosition);
      const afterCursor = currentLine.substring(cursorPosition);

      this.codeLines[index] = beforeCursor;
      this.codeLines.splice(index + 1, 0, afterCursor);

      this.$nextTick(() => {
        const newIndex = index + 1;
        const inputRef = this.$refs[`input_${newIndex}`];
        if (inputRef && inputRef[0]) {
          inputRef[0].focus();
          // 将光标设置在新行的开头
          inputRef[0].setSelectionRange(0, 0);
        }
      });
    },

    removeLineIfEmpty(index) {
      if (this.codeLines[index] === "" && index > 0) {
        this.codeLines.splice(index, 1);
        // 等待Vue完成DOM更新后聚焦上一行
        this.$nextTick(() => {
          const prevIndex = index - 1;
          const inputRef = this.$refs[`input_${prevIndex}`];
          if (inputRef && inputRef[0]) {
            inputRef[0].focus();

            // 如果上一行也是空的，设置长按删除
            if (
              this.codeLines[prevIndex] === "" &&
              !this.backspaceKeyInterval
            ) {
              this.backspaceKeyInterval = setInterval(() => {
                if (prevIndex > 0 && this.codeLines[prevIndex] === "") {
                  this.codeLines.splice(prevIndex, 1);
                  this.$nextTick(() => {
                    const newPrevIndex = prevIndex - 1;
                    const newInputRef = this.$refs[`input_${newPrevIndex}`];
                    if (newInputRef && newInputRef[0]) {
                      newInputRef[0].focus();
                    }
                  });
                } else {
                  clearInterval(this.backspaceKeyInterval);
                  this.backspaceKeyInterval = null;
                }
              }, 100); // 每100ms删除一行
            }
          }
        });
      } else if (this.codeLines[index] === "" && index === 0) {
        // 已经是第一行且为空，不做任何操作
        return;
      }
    },
    // 添加keydown和keyup事件处理
    handleKeyDown(event, index) {
      if (event.key === "Enter") {
        event.preventDefault(); // 阻止默认的换行行为
        this.isEnterKeyDown = true;
        this.addNewLine(index);
      } else if (event.key === "Backspace") {
        this.isBackspaceKeyDown = true;
        this.removeLineIfEmpty(index);
      }
    },

    handleKeyUp(event) {
      if (event.key === "Enter") {
        this.isEnterKeyDown = false;
        clearInterval(this.enterKeyInterval);
      } else if (event.key === "Backspace") {
        this.isBackspaceKeyDown = false;
        clearInterval(this.backspaceKeyInterval);
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

      // 随机选择一个状态
      const randomState =
        this.stateOptions[Math.floor(Math.random() * this.stateOptions.length)];

      const submission = {
        status: randomState.status,
        language: this.selectedLanguage,
        runTime: this.getRunTime(),
        memoryUsage: this.getMemoryUsage(),
        submitTime: this.getSubmitTime(),
      };

      this.$emit("submit-code", submission);

      // 清空代码输入
      this.codeLines = [""];
    },
    getLanguageMode() {
      // 将选中的语言映射到 highlight.js 的语言模式
      const langMap = {
        C: "c",
        "C++": "cpp",
        Java: "java",
        Python: "python",
      };
      return langMap[this.selectedLanguage] || "plaintext";
    },
    highlightLine(line) {
      try {
        const result = hljs.highlight(line, {
          language: this.getLanguageMode(),
          ignoreIllegals: true,
        });
        return result.value || line;
      } catch (e) {
        return line;
      }
    },
    highlightAllLines() {
      this.highlightedLines = this.codeLines.map((line) =>
        this.highlightLine(line)
      );
    },
    handleInput(index) {
      this.$nextTick(() => {
        this.highlightedLines[index] = this.highlightLine(
          this.codeLines[index]
        );
      });
    },
  },
  mounted() {
    this.highlightAllLines();
    document.addEventListener("keyup", this.handleKeyUp);
  },
  beforeDestroy() {
    clearInterval(this.enterKeyInterval);
    clearInterval(this.backspaceKeyInterval);
    this.enterKeyInterval = null;
    this.backspaceKeyInterval = null;
    document.removeEventListener("keyup", this.handleKeyUp);
  },
};
</script>
  
<style scoped>
* {
  box-sizing: border-box;
}
.code {
  width: 100%;
  height: 100%;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.headerBox {
  padding: 12px 16px;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  align-items: center;
  background-color: #f9f9f9;
  position: relative;
}

.language-selector {
  display: inline-flex;
  align-items: center;
  justify-content: space-between;
  width: 150px;
  height: 36px;
  padding: 0 12px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  background-color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  user-select: none;
}

.language-selector:hover {
  border-color: #c0c4cc;
}

.language-selector:focus {
  outline: none;
  border-color: #18a058;
  box-shadow: 0 0 0 2px rgba(24, 160, 88, 0.2);
}

.selected-language {
  font-size: 14px;
  color: #606266;
}

.dropdown-icon {
  width: 16px;
  height: 16px;
  color: #c0c4cc;
  transition: transform 0.3s ease;
}

.rotate-icon {
  transform: rotate(180deg);
}

.hS1 {
  color: #767c82;
  transition: transform 0.2s ease;
}

.headerSpan1:hover .hS1 {
  color: #18a058;
}

.showLanguageSelection .hS1 {
  transform: rotate(0deg);
}

.selection {
  position: absolute;
  top: calc(70% + 8px);
  left: 3px;
  width: 180px;
  background-color: white;
  margin-top: 8px;
  margin-left: 10px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 10;
  transform-origin: top;
  animation: fadeIn 0.15s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.selection::before {
  content: "";
  position: absolute;
  top: -6px;
  left: 20px;
  width: 12px;
  height: 12px;
  background-color: white;
  transform: rotate(45deg);
  box-shadow: -1px -1px 2px rgba(0, 0, 0, 0.1);
  z-index: -1;
}

.selectionB {
  padding: 8px 0;
}

.selectionE {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 16px;
  font-size: 14px;
  color: #333;
  transition: all 0.2s ease;
}

.selectionE:hover {
  background-color: #f5f5f5;
  cursor: pointer;
}

.selectionE.yeah {
  color: #18a058;
  font-weight: 500;
  background-color: #f0f9eb;
}

.codeBody {
  background-color: #f6f8fa; /* 改为浅色背景 */
  flex-grow: 1;
  overflow: hidden;
  position: relative;
  height: 770px;
  border-radius: 0 0 8px 8px;
  box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.1); /* 更柔和的阴影 */
  overflow-x: hidden;
}

.Aline {
  height: 100%; /* 继承父容器高度 */
  overflow-y: auto; /* 垂直滚动 */
  overflow-x: hidden;
  scrollbar-width: thin;
  scrollbar-color: #d1d5da #f6f8fa; /* 浅色滚动条 */
  /* 添加以下样式以改善滚动条外观 */
  scrollbar-gutter: stable;
  padding-right: 4px; /* 为滚动条留出空间 */
  background: #ffffff; /* 纯白背景 */
}

.Aline::-webkit-scrollbar {
  width: 10px;
}

.Aline::-webkit-scrollbar-track {
  background: #f6f8fa;
  border-radius: 5px;
}

.Aline::-webkit-scrollbar-thumb {
  background-color: #d1d5da;
  border-radius: 5px;
  border: 2px solid #f6f8fa;
}

.Aline::-webkit-scrollbar-thumb:hover {
  background-color: #666;
}
/* 添加行高亮效果 */
.AlineDiv:hover {
  background-color: rgba(3, 102, 214, 0.05); /* 浅蓝色悬停背景 */
}

/* 当前行高亮 */
.AlineDiv:focus-within {
  background-color: rgba(3, 102, 214, 0.08);
}
.AlineDiv {
  display: flex;
  min-height: 22px;
  /* 添加悬停效果 */
  transition: background-color 0.2s ease;
}

.lineNumber {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 54px;
  min-width: 54px;
  height: 22px;
  color: #959da5;
  font-size: 13px;
  font-family: monospace;
  user-select: none;
  background-color: #f6f8fa; /* 行号背景与编辑器背景区分 */
  position: sticky;
  left: 0;
  /* 添加边框效果 */
  border-right: 1px solid #e1e4e8; /* 更细的边框 */
}

.Aline input {
  flex-grow: 1;
  outline: none;
  border: none;
  background: transparent;
  caret-color: #c6c6c6;
  color: #e0e0e0;
  font-family: monospace;
  font-size: 14px;
  padding: 0 8px;
  line-height: 22px;
}

.code-input-wrapper {
  position: relative;
  flex-grow: 1;
  /* 添加动画效果 */
  transition: all 0.2s ease;
}

.code-input-wrapper input {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: transparent;
  color: transparent;
  caret-color: #0366d6;
  z-index: 2;
  padding: 0 12px;
  font-family: "Fira Code", "Consolas", monospace;
  font-size: 14px;
  line-height: 22px;
  /* 添加光标动画 */
  animation: blink 1s step-end infinite;
}

@keyframes blink {
  from,
  to {
    border-right-color: transparent;
  }
  50% {
    border-right-color: #569cd6;
  }
}

.highlighted-code {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0 12px;
  font-family: "Fira Code", "Consolas", monospace;
  font-size: 14px;
  line-height: 22px;
  white-space: pre;
  overflow: hidden;
  z-index: 1;
  pointer-events: none;
  background-color: transparent;
  /* 增强文本渲染 */
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
}

/* 为不同语言添加特定的高亮样式 */
/* 更新高亮颜色以适应浅色背景 */
.highlighted-code .hljs-keyword {
  color: #d73a49; /* 红色关键字 */
}

.highlighted-code .hljs-built_in {
  color: #6f42c1; /* 紫色内置函数 */
}

.highlighted-code .hljs-string {
  color: #032f62; /* 深蓝色字符串 */
}

.highlighted-code .hljs-number {
  color: #005cc5; /* 蓝色数字 */
}

.highlighted-code .hljs-comment {
  color: #6a737d; /* 灰色注释 */
}

.highlighted-code .hljs-function {
  color: #6f42c1; /* 紫色函数名 */
}

.highlighted-code .hljs-params {
  color: #24292e; /* 黑色参数 */
}

.highlighted-code .hljs-title {
  color: #22863a; /* 绿色标题 */
}

.highlighted-code .hljs-meta {
  color: #735c0f; /* 棕色元数据 */
}

.highlighted-code .hljs-literal {
  color: #d73a49; /* 红色字面量 */
}

.codefooter {
  display: flex;
  justify-content: flex-end;
  padding: 12px 16px;
  border-top: 1px solid #f0f0f0;
  background-color: #f9f9f9;
}

.codefooter button {
  width: 80px;
  height: 34px;
  font-size: 14px;
  font-weight: 500;
  background: linear-gradient(90deg, #42b983, #00c4ff);
  border: none;
  border-radius: 6px;
  color: white;
  cursor: pointer;
  transition: all 0.2s ease;
}

.codefooter button:hover {
  transform: translateY(-2px);
  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.5);
}

.codefooter button:active {
  box-shadow: 0 4px 12px rgba(66, 185, 131, 0.3);
  transform: translateY(0px);
}
</style>