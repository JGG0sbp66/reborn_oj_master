<template>
  <div class="code">
    <div class="headerBox">
      <div class="header-left">
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

        <button
          class="format-button"
          @click="formatCode"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <polyline points="16 3 21 3 21 8"></polyline>
            <line
              x1="4"
              y1="20"
              x2="21"
              y2="3"
            ></line>
            <polyline points="21 16 21 21 16 21"></polyline>
            <line
              x1="15"
              y1="15"
              x2="21"
              y2="21"
            ></line>
            <line
              x1="4"
              y1="4"
              x2="9"
              y2="9"
            ></line>
          </svg>
          格式化
        </button>
      </div>

      <button
        class="submit-button"
        @click="submitCode"
      >提交</button>
    </div>
    <div class="codeBody">
      <div class="Aline">
        <div
          class="AlineDiv"
          v-for="(line, index) in codeLines"
          :key="index"
          :class="{ 'selected-line': isAllSelected || (index >= Math.min(startSelectionIndex, endSelectionIndex) && index <= Math.max(startSelectionIndex, endSelectionIndex)) }"
          @mousedown="handleMouseDown(index)"
          @mouseenter="handleMouseMove(index)"
          @mouseup="handleMouseUp"
        >
          <span class="lineNumber">{{ index + 1 }}</span>
          <div class="code-input-wrapper">
            <input
              type="text"
              v-model="codeLines[index]"
              @keydown="handleKeyDown($event, index)"
              @keyup="handleKeyUp($event)"
              @paste="handlePaste($event, index)"
              :ref="'input_' + index"
              @input="handleInput(index)"
              @focus="currentFocusIndex = index"
            />
            <pre
              class="highlighted-code"
              v-html="highlightedLines[index]"
            ></pre>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
  
<script>
import hljs from "highlight.js";
import "highlight.js/styles/github-dark.css";
import axios from "axios";
import { checkAuth } from "@/utils/auth";

export default {
  name: "CodeComponent",
  props: ["questionDetail", "id", "race_uid"],
  data() {
    return {
      selectedLanguage: "C++",
      showLanguageSelection: false,
      codeLines: [""],
      isEnterKeyDown: false,
      isBackspaceKeyDown: false,
      enterKeyInterval: null,
      backspaceKeyInterval: null,
      currentFocusIndex: 0,
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
      history: [[]], // 存储代码历史记录
      historyIndex: 0, // 当前历史记录索引
      maxHistoryLength: 1000, // 最大历史记录长度
      isUndoRedoInProgress: false, // 标记是否正在执行撤销/重做
      saveHistoryTimeout: null, // 防抖定时器
      isAllSelected: false,
      shouldClearOnNextAction: false, // 新增，用于标记是否需要在下一次操作时清空代码
      isCtrlKeyDown: false, // 跟踪Ctrl键是否按下
      isShiftKeyDown: false, // 跟踪Shift键是否按下
      isMetaKeyDown: false, // 跟踪Meta键是否按下（Mac的Command键）
      pendingClearAction: false, // 标记是否有待处理的清空操作
      enterKeyPressStartTime: 0, // 记录Enter键按下的开始时间
      isMouseDown: false, // 是否按下鼠标左键
      startSelectionIndex: -1, // 选择起始行索引
      endSelectionIndex: -1, // 选择结束行索引
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
    toggleLanguageSelection(e) {
      e.stopPropagation(); // 阻止事件冒泡
      this.showLanguageSelection = !this.showLanguageSelection;
    },
    // 添加保存历史记录的方法
    // 修改saveHistory方法
    saveHistory() {
      // 如果正在执行撤销/重做，不保存历史
      if (this.isUndoRedoInProgress) return;

      // 使用防抖
      clearTimeout(this.saveHistoryTimeout);
      // 如果当前索引不是最新的，截断后面的历史
      if (this.historyIndex < this.history.length - 1) {
        this.history = this.history.slice(0, this.historyIndex + 1);
      }

      // 确保至少有一个空行
      const currentCode =
        this.codeLines.length === 0 ? [""] : [...this.codeLines];

      // 只有当当前代码与最新历史记录不同时才保存
      if (!this.isEqual(currentCode, this.history[this.history.length - 1])) {
        this.history.push(currentCode);
        this.historyIndex++;
      }

      // 限制历史记录长度
      if (this.history.length > this.maxHistoryLength) {
        this.history.shift();
        this.historyIndex--;
      }
    },

    // 添加辅助方法比较代码是否相同
    isEqual(a, b) {
      if (a.length !== b.length) return false;
      for (let i = 0; i < a.length; i++) {
        if (a[i] !== b[i]) return false;
      }
      return true;
    },

    // 添加撤销方法
    undo() {
      if (this.historyIndex > 0) {
        this.isUndoRedoInProgress = true;

        this.historyIndex--;
        const prevHistory = this.history[this.historyIndex];

        // 确保至少保留一个空行
        this.codeLines = prevHistory.length === 0 ? [""] : [...prevHistory];

        this.highlightAllLines();

        // 延迟设置焦点，确保撤销完成
        this.$nextTick(() => {
          const lastIndex = this.codeLines.length - 1;
          const inputRef = this.$refs[`input_${lastIndex}`];
          if (inputRef && inputRef[0]) {
            inputRef[0].focus();
          }
          this.isUndoRedoInProgress = false;
        });
      }
    },

    // 添加重做方法
    // 修改redo方法
    redo() {
      if (this.historyIndex < this.history.length - 1) {
        this.isUndoRedoInProgress = true;

        this.historyIndex++;
        const nextHistory = this.history[this.historyIndex];

        // 确保至少保留一个空行
        this.codeLines = nextHistory.length === 0 ? [""] : [...nextHistory];

        this.highlightAllLines();

        // 延迟设置焦点，确保重做完成
        this.$nextTick(() => {
          const lastIndex = this.codeLines.length - 1;
          const inputRef = this.$refs[`input_${lastIndex}`];
          if (inputRef && inputRef[0]) {
            inputRef[0].focus();
          }
          this.isUndoRedoInProgress = false;
        });
      }
    },
    checkAndClearSelection() {
      if (this.shouldClearOnNextAction && this.pendingClearAction) {
        // 如果是Ctrl+V组合键，执行清空
        if (
          (this.isCtrlKeyDown || this.isMetaKeyDown) &&
          event.key.toLowerCase() === "v"
        ) {
          this.codeLines = [""]; // 清空代码，只保留一个空行
          this.highlightAllLines();
          this.isAllSelected = false;
          this.pendingClearAction = false;

          // 将焦点设置在第一行
          this.$nextTick(() => {
            const inputRef = this.$refs["input_0"];
            if (inputRef && inputRef[0]) {
              inputRef[0].focus();
            }
          });
          return true;
        }
        // 如果是其他非修饰键操作，执行清空
        else if (
          !this.isCtrlKeyDown &&
          !this.isMetaKeyDown &&
          !this.isShiftKeyDown
        ) {
          this.codeLines = [""];
          this.highlightAllLines();
          this.isAllSelected = false;
          this.pendingClearAction = false;

          // 将焦点设置在第一行
          this.$nextTick(() => {
            const inputRef = this.$refs["input_0"];
            if (inputRef && inputRef[0]) {
              inputRef[0].focus();
            }
          });
          return true;
        }
      }
      return false;
    },
    // 全选代码
    selectAllCode() {
      // 先清除可能存在的旧监听器
      document.removeEventListener("click", this.handleGlobalClick);
      this.$el
        .querySelector(".codeBody")
        .removeEventListener("click", this.handleCodeAreaClick);

      // 设置全选状态
      this.isAllSelected = true;
      this.shouldClearOnNextAction = true;
      this.pendingClearAction = true;

      // 高亮显示所有行
      this.$el.querySelectorAll(".AlineDiv").forEach((div) => {
        div.style.backgroundColor = "rgba(3, 102, 214, 0.1)";
      });

      // 添加全局点击事件监听器
      document.addEventListener("click", this.handleGlobalClick);
      // 添加代码区域点击监听器
      this.$el
        .querySelector(".codeBody")
        .addEventListener("click", this.handleCodeAreaClick);

      // 将焦点设置在第一行输入框
      this.$nextTick(() => {
        const firstInput = this.$refs["input_0"];
        if (firstInput && firstInput[0]) {
          firstInput[0].focus();
        }
      });
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

      if (cursorPosition === currentLine.length || currentLine.trim() === "") {
        this.insertNewLineAfter(index);
      } else {
        this.splitLineAtCursor(index, cursorPosition);
      }
      this.saveHistory(); // 添加历史保存
    },

    // 在指定行后插入新行
    insertNewLineAfter(index) {
      const currentLine = this.codeLines[index];
      const indent = this.getCurrentIndent(currentLine); // 获取当前缩进
      this.codeLines.splice(index + 1, 0, indent); // 新行继承缩进
      this.$nextTick(() => {
        const newIndex = index + 1;
        const inputRef = this.$refs[`input_${newIndex}`];
        if (inputRef && inputRef[0]) {
          inputRef[0].focus();
          // 将光标定位在新行的缩进末尾
          inputRef[0].setSelectionRange(indent.length, indent.length);
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
      this.highlightAllLines(); // 立即更新高亮

      this.$nextTick(() => {
        const newIndex = index + 1;
        const inputRef = this.$refs[`input_${newIndex}`];
        if (inputRef && inputRef[0]) {
          inputRef[0].focus();
          inputRef[0].setSelectionRange(0, 0);
        }
      });
    },

    removeLineIfEmpty(index) {
      if (this.codeLines[index] === "" && index > 0) {
        this.codeLines.splice(index, 1);
        this.$nextTick(() => {
          const prevIndex = index - 1;
          this.currentFocusIndex = prevIndex; // 更新当前焦点索引
          const inputRef = this.$refs[`input_${prevIndex}`];
          if (inputRef && inputRef[0]) {
            inputRef[0].focus();
            // 立即更新高亮显示
            this.highlightAllLines();
          }
        });
      }
      this.saveHistory(); // 添加历史保存
    },
    handleCodeAreaClick(e) {
      // 检查点击是否在输入框上
      const isClickOnInput = e.target.tagName === "INPUT";

      // 如果点击的不是输入框，就取消全选状态
      if (!isClickOnInput) {
        this.clearSelection();
      }
    },
    // 处理粘贴事件
    handlePaste(event, index) {
      // 检查是否需要清空选择
      if (this.checkAndClearSelection()) {
        index = 0; // 重置索引到第一行
      }
      event.preventDefault();
      const clipboardData = event.clipboardData || window.clipboardData;
      const pastedText = clipboardData.getData("text");

      if (pastedText.includes("\n")) {
        // 处理多行粘贴
        const lines = pastedText.split("\n");
        const currentLine = this.codeLines[index];
        const inputElement = this.$refs[`input_${index}`][0];
        const cursorPosition = inputElement.selectionStart;

        // 分割当前行为光标前后两部分
        const beforeCursor = currentLine.substring(0, cursorPosition);
        const afterCursor = currentLine.substring(cursorPosition);

        // 构建新的行数组
        const newLines = [];
        newLines.push(beforeCursor + lines[0]); // 第一行

        // 中间行
        for (let i = 1; i < lines.length - 1; i++) {
          newLines.push(lines[i]);
        }

        // 最后一行
        newLines.push(lines[lines.length - 1] + afterCursor);

        // 替换当前行并插入新行
        this.codeLines.splice(index, 1, ...newLines);

        this.$nextTick(() => {
          // 将焦点设置在新插入的最后一行
          const newIndex = index + newLines.length - 1;
          const inputRef = this.$refs[`input_${newIndex}`];
          if (inputRef && inputRef[0]) {
            inputRef[0].focus();
            // 将光标设置在最后一行文本的末尾
            const cursorPos = lines[lines.length - 1].length;
            inputRef[0].setSelectionRange(cursorPos, cursorPos);
          }
        });
      } else {
        // 单行文本，正常插入
        const currentLine = this.codeLines[index];
        const inputElement = this.$refs[`input_${index}`][0];
        const cursorPosition = inputElement.selectionStart;

        this.codeLines[index] =
          currentLine.substring(0, cursorPosition) +
          pastedText +
          currentLine.substring(cursorPosition);

        this.$nextTick(() => {
          inputElement.setSelectionRange(
            cursorPosition + pastedText.length,
            cursorPosition + pastedText.length
          );
        });
      }
      this.highlightAllLines(); // 立即更新高亮
      this.saveHistory(); // 添加历史保存
      this.pendingClearAction = false; // 粘贴完成后重置状态
    },

    // 添加垂直移动光标的方法
    moveCursorVertically(currentIndex, direction) {
      const targetIndex = currentIndex + direction;

      if (targetIndex < 0 || targetIndex >= this.codeLines.length) {
        return;
      }

      const currentInput = this.$refs[`input_${currentIndex}`][0];
      const cursorPosition = currentInput.selectionStart;
      const targetLineLength = this.codeLines[targetIndex].length;
      const targetCursorPosition = Math.min(cursorPosition, targetLineLength);

      this.currentFocusIndex = targetIndex;

      this.$nextTick(() => {
        const targetInput = this.$refs[`input_${targetIndex}`][0];
        if (targetInput) {
          targetInput.focus();
          targetInput.setSelectionRange(
            targetCursorPosition,
            targetCursorPosition
          );
        }
      });
    },
    // 添加水平移动光标的方法
    moveCursorHorizontally(index, direction) {
      const input = this.$refs[`input_${index}`][0];
      if (!input) return;

      const currentPosition = input.selectionStart;
      const newPosition = currentPosition + direction;

      // 检查是否移动到行首/行尾需要换行
      if (newPosition < 0 && index > 0) {
        // 移动到上一行末尾
        this.moveCursorVertically(index, -1);
        this.$nextTick(() => {
          const prevInput = this.$refs[`input_${index - 1}`][0];
          if (prevInput) {
            prevInput.setSelectionRange(
              prevInput.value.length,
              prevInput.value.length
            );
          }
        });
      } else if (
        newPosition > input.value.length &&
        index < this.codeLines.length - 1
      ) {
        // 移动到下一行开头
        this.moveCursorVertically(index, 1);
        this.$nextTick(() => {
          const nextInput = this.$refs[`input_${index + 1}`][0];
          if (nextInput) {
            nextInput.setSelectionRange(0, 0);
          }
        });
      } else {
        // 正常移动光标
        input.setSelectionRange(newPosition, newPosition);
      }
    },

    // 添加keydown和keyup事件处理
    handleKeyDown(event, index) {
      // 跟踪修饰键状态
      if (event.ctrlKey) this.isCtrlKeyDown = true;
      if (event.shiftKey) this.isShiftKeyDown = true;
      if (event.metaKey) this.isMetaKeyDown = true;

      // 检查是否需要清空选择（仅在不是修饰键组合时）
      if (this.shouldClearOnNextAction && !this.isModifierKey(event.key)) {
        if (this.checkAndClearSelection()) {
          index = 0; // 重置索引到第一行
        }
      }
      this.currentFocusIndex = index;

      // 检查是否是IME输入过程
      if (event.isComposing || event.keyCode === 229) {
        return; // 如果是IME输入，不处理
      }

      // 在 handleKeyDown 方法中添加以下 case
      switch (event.key) {
        case "ArrowUp":
          event.preventDefault();
          this.moveCursorVertically(index, -1); // 上移
          break;
        case "ArrowDown":
          event.preventDefault();
          this.moveCursorVertically(index, 1); // 下移
          break;
        case "ArrowLeft":
          event.preventDefault();
          this.moveCursorHorizontally(index, -1);
          break;
          break;
        case "ArrowRight":
          event.preventDefault();
          this.moveCursorHorizontally(index, 1);
          break;
      }

      // 在开头添加：处理括号自动补全
      if (
        ["{", "("].includes(event.key) &&
        !(event.ctrlKey || event.metaKey || event.altKey)
      ) {
        if (this.handleBracketCompletion(index, event.key)) {
          event.preventDefault(); // 阻止默认行为
          return; // 如果已处理，就不再执行后面的逻辑
        }
      }

      // 添加 Ctrl+C 处理 - 复制选中内容
      if (event.key === "c" && (event.ctrlKey || event.metaKey)) {
        event.preventDefault();

        // 获取选中的行范围
        const start = Math.min(
          this.startSelectionIndex,
          this.endSelectionIndex
        );
        const end = Math.max(this.startSelectionIndex, this.endSelectionIndex);

        let textToCopy = "";

        if (this.isAllSelected) {
          // 全选状态下复制所有代码
          textToCopy = this.codeLines.join("\n");
        } else if (start !== -1 && end !== -1 && start !== end) {
          // 复制鼠标选择的区域
          textToCopy = this.codeLines.slice(start, end + 1).join("\n");
        } else {
          // 默认复制当前行
          textToCopy = this.codeLines[this.currentFocusIndex];
        }

        if (textToCopy.trim() !== "") {
          navigator.clipboard
            .writeText(textToCopy)
            .then(() => {
              // 高亮显示被复制的行
              if (this.isAllSelected) {
                this.$el.querySelectorAll(".AlineDiv").forEach((div) => {
                  div.style.backgroundColor = "rgba(3, 102, 214, 0.1)";
                });
              } else if (start !== -1 && end !== -1) {
                // 高亮显示鼠标选择的区域
                for (let i = start; i <= end; i++) {
                  const lineDiv = this.$el.querySelectorAll(".AlineDiv")[i];
                  if (lineDiv) {
                    lineDiv.style.backgroundColor = "rgba(3, 102, 214, 0.1)";
                    setTimeout(() => {
                      lineDiv.style.backgroundColor = "";
                    }, 500);
                  }
                }
              } else {
                // 高亮显示当前行
                const lineDiv =
                  this.$el.querySelectorAll(".AlineDiv")[
                    this.currentFocusIndex
                  ];
                if (lineDiv) {
                  lineDiv.style.backgroundColor = "rgba(3, 102, 214, 0.1)";
                  setTimeout(() => {
                    lineDiv.style.backgroundColor = "";
                  }, 500);
                }
              }
            })
            .catch((err) => {
              console.error("复制失败:", err);
            });
        }
        return;
      }

      // 修改后的Ctrl+V处理逻辑
      // 修改 handleKeyDown 方法中的 Ctrl+V 部分
      if (event.key === "v" && (event.ctrlKey || event.metaKey)) {
        event.preventDefault();

        // 如果是全选状态，先清空代码
        if (this.isAllSelected) {
          this.codeLines = [""];
          this.isAllSelected = false;
          this.highlightAllLines();
        }

        // 直接使用剪贴板 API
        navigator.clipboard
          .readText()
          .then((text) => {
            if (text) {
              this.handlePasteContent(text, this.currentFocusIndex);
            }
          })
          .catch((err) => {
            console.error("读取剪贴板失败:", err);
            // 回退到原始粘贴方式
            const pasteEvent = new Event("paste", {
              clipboardData: new DataTransfer(),
              bubbles: true,
            });
            pasteEvent.clipboardData.setData("text/plain", "");
            this.$refs[`input_${this.currentFocusIndex}`][0].dispatchEvent(
              pasteEvent
            );
          });
        return;
      }

      // 添加 Ctrl+Z 处理 - 撤销
      if (event.key === "z" && (event.ctrlKey || event.metaKey)) {
        event.preventDefault();
        if (!event.shiftKey) {
          this.undo();
        } else {
          // Ctrl+Shift+Z 重做
          this.redo();
        }
        return;
      }

      // 添加 Ctrl+Y 处理 - 重做
      if (event.key === "y" && (event.ctrlKey || event.metaKey)) {
        event.preventDefault();
        this.redo();
        return;
      }
      // 添加 Ctrl+A 处理
      if (event.key === "a" && (event.ctrlKey || event.metaKey)) {
        event.preventDefault();
        this.selectAllCode();
        return;
      }
      if (event.key === "Enter") {
        event.preventDefault();

        // 记录按键开始时间
        this.enterKeyPressStartTime = Date.now();

        // 先检查是否在括号内按回车
        if (this.handleEnterInsideBrackets(index)) {
          return; // 如果已处理括号内回车，就不再执行普通回车逻辑
        }
        if (!this.isEnterKeyDown) {
          this.isEnterKeyDown = true;
          this.addNewLine(index);
          // 设置一个延迟，只有按住超过300ms才启动连续创建
          this.enterKeyInterval = setTimeout(() => {
            if (Date.now() - this.enterKeyPressStartTime >= 300) {
              // 启动连续创建新行的定时器
              this.enterKeyInterval = setInterval(() => {
                const lastIndex = this.codeLines.length - 1;
                this.insertNewLineAfter(lastIndex);
              }, 100);
            }
          }, 300);
        }
      } else if (event.key === "Backspace") {
        const inputElement = this.$refs[`input_${index}`][0];
        const cursorPosition = inputElement.selectionStart;
        const selectionEnd = inputElement.selectionEnd;

        if (selectionEnd !== cursorPosition) {
          return;
        }

        if (cursorPosition === 0 && index > 0) {
          event.preventDefault();
          const currentLine = this.codeLines[index];
          const prevLine = this.codeLines[index - 1];

          // 合并两行
          this.codeLines[index - 1] = prevLine + currentLine;
          this.codeLines.splice(index, 1);

          // 立即更新高亮
          this.highlightAllLines();

          this.$nextTick(() => {
            const prevInput = this.$refs[`input_${index - 1}`][0];
            if (prevInput) {
              prevInput.focus();
              // 设置光标位置到合并后的位置（前一行末尾）
              prevInput.setSelectionRange(prevLine.length, prevLine.length);
              // 更新当前焦点索引
              this.currentFocusIndex = index - 1;
            }
          });
          return;
        }

        if (!this.isBackspaceKeyDown) {
          this.isBackspaceKeyDown = true;
          this.removeLineIfEmpty(index);

          // 启动长按删除定时器
          this.backspaceKeyInterval = setInterval(() => {
            const currentIndex = this.codeLines.findIndex(
              (line, i) => i === this.currentFocusIndex
            );
            if (currentIndex > 0 && this.codeLines[currentIndex] === "") {
              this.removeLineIfEmpty(currentIndex);
            } else {
              clearInterval(this.backspaceKeyInterval);
              this.backspaceKeyInterval = null;
              this.isBackspaceKeyDown = false;
            }
          }, 100);
        }
      } else if (event.key === "Tab") {
        event.preventDefault(); // 阻止默认的Tab行为
        const inputElement = this.$refs[`input_${index}`][0];
        const cursorPosition = inputElement.selectionStart;
        const currentLine = this.codeLines[index];

        // 插入两个空格作为缩进
        const newLine =
          currentLine.substring(0, cursorPosition) +
          "  " + // 两个空格缩进
          currentLine.substring(cursorPosition);

        this.codeLines[index] = newLine;

        this.$nextTick(() => {
          inputElement.setSelectionRange(
            cursorPosition + 2,
            cursorPosition + 2
          );
        });
      }
    },
    // 添加辅助方法判断是否是修饰键
    isModifierKey(key) {
      return ["Control", "Shift", "Alt", "Meta", "Ctrl"].includes(key);
    },
    // 修改handleKeyUp方法
    handleKeyUp(event) {
      // 更新修饰键状态
      if (event.key === "Control") this.isCtrlKeyDown = false;
      if (event.key === "Shift") this.isShiftKeyDown = false;
      if (event.key === "Meta") this.isMetaKeyDown = false;

      // 处理其他键的keyup
      if (event.key === "Enter") {
        // 如果按键时间小于300ms，清除延迟定时器
        if (Date.now() - this.enterKeyPressStartTime < 300) {
          clearTimeout(this.enterKeyInterval);
        }
        this.isEnterKeyDown = false;
        clearInterval(this.enterKeyInterval);
        this.enterKeyInterval = null;
      } else if (event.key === "Backspace") {
        this.isBackspaceKeyDown = false;
        clearInterval(this.backspaceKeyInterval);
        this.backspaceKeyInterval = null;
      }
    },
    handleGlobalClick(e) {
      // 检查点击是否在输入框上
      const isClickOnInput = e.target.tagName === "INPUT";

      // 如果点击的不是输入框，就取消选择状态
      if (!isClickOnInput) {
        this.clearSelection();
      }

      // 移除事件监听器（确保只执行一次）
      document.removeEventListener("click", this.handleGlobalClick);
    },
    handlePasteContent(text, index) {
      if (text.includes("\n")) {
        // 处理多行粘贴
        const lines = text.split("\n");
        const currentLine = this.codeLines[index];
        const inputElement = this.$refs[`input_${index}`][0];
        const cursorPosition = inputElement.selectionStart;

        const beforeCursor = currentLine.substring(0, cursorPosition);
        const afterCursor = currentLine.substring(cursorPosition);

        const newLines = [];
        newLines.push(beforeCursor + lines[0]);

        for (let i = 1; i < lines.length - 1; i++) {
          newLines.push(lines[i]);
        }

        newLines.push(lines[lines.length - 1] + afterCursor);

        this.codeLines.splice(index, 1, ...newLines);

        this.$nextTick(() => {
          const newIndex = index + newLines.length - 1;
          const inputRef = this.$refs[`input_${newIndex}`];
          if (inputRef && inputRef[0]) {
            inputRef[0].focus();
            const cursorPos = lines[lines.length - 1].length;
            inputRef[0].setSelectionRange(cursorPos, cursorPos);
          }
        });
      } else {
        // 单行文本
        const currentLine = this.codeLines[index];
        const inputElement = this.$refs[`input_${index}`][0];
        const cursorPosition = inputElement.selectionStart;

        this.codeLines[index] =
          currentLine.substring(0, cursorPosition) +
          text +
          currentLine.substring(cursorPosition);

        this.$nextTick(() => {
          inputElement.setSelectionRange(
            cursorPosition + text.length,
            cursorPosition + text.length
          );
        });
      }

      this.highlightAllLines();
      this.saveHistory();
    },

    // 处理鼠标按下事件
    handleMouseDown(index) {
      this.isMouseDown = true;
      this.startSelectionIndex = index;
      this.endSelectionIndex = index;
      this.isAllSelected = false; // 确保全选状态被清除
      this.updateSelection();
    },

    // 处理鼠标移动事件
    handleMouseMove(index) {
      if (this.isMouseDown) {
        this.endSelectionIndex = index;
        this.updateSelection();
      }
    },

    // 处理鼠标释放事件
    handleMouseUp() {
      this.isMouseDown = false;
      // 如果只选择了一行，则取消选择
      if (this.startSelectionIndex !== this.endSelectionIndex) {
        this.shouldClearOnNextAction = true;
      }
    },

    // 更新选择区域
    updateSelection() {
      // 清除之前的选择
      this.$el.querySelectorAll(".AlineDiv").forEach((div) => {
        div.classList.remove("selected-line");
      });

      const start = Math.min(this.startSelectionIndex, this.endSelectionIndex);
      const end = Math.max(this.startSelectionIndex, this.endSelectionIndex);

      // 应用选择样式
      for (let i = start; i <= end; i++) {
        const lineDiv = this.$el.querySelectorAll(".AlineDiv")[i];
        if (lineDiv) {
          lineDiv.classList.add("selected-line");
        }
      }
    },
    clearSelection() {
      this.isAllSelected = false;
      this.shouldClearOnNextAction = false;
      this.pendingClearAction = false; // 新增
      this.startSelectionIndex = -1;
      this.endSelectionIndex = -1;
      this.$el.querySelectorAll(".AlineDiv").forEach((div) => {
        div.classList.remove("selected-line");
        div.style.backgroundColor = ""; // 清除背景颜色
      });
    },

    // 格式化代码
    formatCode() {
      // 获取当前代码
      const code = this.codeLines.join("\n");

      // 根据语言应用不同的格式化规则
      switch (this.selectedLanguage) {
        case "C":
        case "C++":
        case "Java":
          // 简单的C风格格式化 - 在实际应用中可以使用更复杂的格式化库
          let formatted = [];
          let indentLevel = 0;
          const lines = code.split("\n");

          lines.forEach((line) => {
            const trimmed = line.trim();

            // 减少缩进级别的行
            if (trimmed.endsWith("}") || trimmed.startsWith("}")) {
              indentLevel = Math.max(0, indentLevel - 1);
            }

            // 添加缩进
            formatted.push("  ".repeat(indentLevel) + trimmed);

            // 增加缩进级别的行
            if (trimmed.endsWith("{") || trimmed.startsWith("{")) {
              indentLevel += 1;
            }
          });

          this.codeLines = formatted;
          break;

        case "Python":
          // Python格式化 - 在实际应用中可以使用更复杂的格式化库
          let pyFormatted = [];
          let pyIndent = 0;
          const pyLines = code.split("\n");

          pyLines.forEach((line) => {
            const trimmed = line.trim();

            // 减少缩进
            if (
              trimmed.startsWith("elif ") ||
              trimmed.startsWith("else:") ||
              trimmed.startsWith("except ") ||
              trimmed.startsWith("finally:")
            ) {
              pyIndent = Math.max(0, pyIndent - 1);
            }

            pyFormatted.push("    ".repeat(pyIndent) + trimmed);

            // 增加缩进
            if (trimmed.endsWith(":") && !trimmed.startsWith("#")) {
              pyIndent += 1;
            }
          });

          this.codeLines = pyFormatted;
          break;

        default:
          // 默认情况下只去除前后空白行
          this.codeLines = code.trim().split("\n");
      }

      // 确保至少有一行
      if (this.codeLines.length === 0) {
        this.codeLines = [""];
      }
      this.saveHistory(); // 添加历史保存
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
    async checkUserAuth() {
      try {
        const { authenticated } = await checkAuth();
        console.log("用户认证状态:", authenticated);
        this.$emit("update-auth", authenticated);
      } catch (error) {
        console.error("检查认证状态失败:", error);
        return;
      }
    },
    async submitCode() {
      const nonEmptyLines = this.codeLines.filter((line) => line.trim() !== "");
      if (nonEmptyLines.length === 0) {
        this.$emit("show-alert", {
          type: "error",
          message: "提交的代码不能为空",
        });
        return;
      }
      try {
        const { authenticated } = await checkAuth();
        if (!authenticated) {
          throw new Error("用户未登录");
        }

        // 显示提交成功的提示
        this.$emit("show-alert", {
          type: "success",
          message: "提交成功",
        });

        // 创建唯一的提交标识
        const submissionId = Date.now();

        const pendingSubmission = {
          status: `
            <div style="display: inline-flex; align-items: center;">
              <span>评测中</span>
              <div class="spinner" style="
                width: 12px;
                height: 12px;
                border: 2px solid #ccc;
                border-top-color: #18a058;
                border-radius: 50%;
                margin-left: 5px;
                margin-top: 3px;
                animation: spin 1s linear infinite;
              "></div>
            </div>
          `,
          language: this.selectedLanguage,
          runTime: "-",
          memoryUsage: "-",
          submitTime: this.getSubmitTime(),
          isPending: true,
          index: submissionId,
        };

        this.$emit("add-pending-submission", pendingSubmission);

        const formData = new FormData();
        formData.append("question_uid", this.id);
        formData.append("question", JSON.stringify(this.questionDetail));
        formData.append("prompt", this.codeLines.join("\n"));
        formData.append("race_uid", this.race_uid);

        const { data: response } = await axios({
          url: "http://localhost:5000/api/askAi-question",
          method: "post",
          data: formData,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        const aiResponse = response.message;
        let statusOption = this.stateOptions.find((option) =>
          option.status.includes(this.getStatusFromAiResponse(aiResponse))
        );

        if (!statusOption) {
          statusOption = this.stateOptions[0];
        }

        const submission = {
          status: statusOption.status,
          language: this.selectedLanguage,
          runTime: this.getRunTime(),
          memoryUsage: this.getMemoryUsage(),
          submitTime: this.getSubmitTime(),
          aiFeedback: aiResponse,
          isPending: false,
          index: submissionId, // 保持相同的唯一标识
        };

        this.$emit("update-submission", {
          index: submissionId,
          submission: submission,
        });

        this.codeLines = [""];

      } catch (error) {
        console.error("提交失败:", error);

        // 如果是未登录错误，直接显示提示，不添加任何提交记录
        if (error.message === "用户未登录") {
          this.$emit("show-alert", {
            type: "error",
            message: "请先登录后再提交代码",
          });
          return;
        }

        // 如果已经开始评测但失败了，更新为错误状态
        if (this.submissions.some((s) => s.isPending)) {
          const errorSubmission = {
            status: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" style="width: 18px; height: 18px; position: relative; top: 4px; color: #F53F3F;">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" fill="currentColor"/>
        </svg>
        <span style="margin-left: 5px;color: #F53F3F;">提交失败</span>`,
            language: this.selectedLanguage,
            runTime: "-",
            memoryUsage: "-",
            submitTime: this.getSubmitTime(),
            isPending: false,
            index: Date.now(),
          };

          this.$emit("update-submission", {
            index: errorSubmission.index,
            submission: errorSubmission,
          });
        }
      }
    },
    // 辅助方法：从AI响应中提取状态
    getStatusFromAiResponse(response) {
      response = response.toLowerCase();
      if (response.includes("答案正确")) return "答案正确";
      if (response.includes("答案错误")) return "答案错误";
      if (response.includes("编译错误")) return "编译错误";
      if (response.includes("内存超限")) return "内存超限";
      if (response.includes("运行超时")) return "运行超时";
      if (response.includes("运行错误")) return "运行错误";
      return "编译错误"; // 默认返回编译错误
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
      // 使用requestAnimationFrame确保DOM更新后执行
      requestAnimationFrame(() => {
        this.highlightedLines = this.codeLines.map((line) => {
          try {
            const result = hljs.highlight(line, {
              language: this.getLanguageMode(),
              ignoreIllegals: true,
            });
            return result.value || line;
          } catch (e) {
            return line;
          }
        });

        // 强制Vue更新DOM
        this.$forceUpdate();
      });
    },
    // 修改 handleInput 方法，在输入时保存历史
    handleInput(index) {
      // 确保输入框内容同步
      const input = this.$refs[`input_${index}`]?.[0];
      if (input) {
        this.codeLines[index] = input.value; // 直接使用input.value
        this.highlightedLines[index] = this.highlightLine(input.value);
      }
      this.saveHistory();
    },
    // 处理大括号和圆括号的自动补全
    handleBracketCompletion(index, key) {
      const input = this.$refs[`input_${index}`][0];
      const cursorPos = input.selectionStart;
      const line = this.codeLines[index];

      // 处理 { 补全
      if (key === "{") {
        const newLine =
          line.substring(0, cursorPos) + "{}" + line.substring(cursorPos);
        this.codeLines[index] = newLine;
        this.$nextTick(() => {
          input.setSelectionRange(cursorPos + 1, cursorPos + 1); // 将光标定位在 {} 中间
        });
        return true; // 表示已处理
      }

      // 处理 ( 补全
      if (key === "(") {
        const newLine =
          line.substring(0, cursorPos) + "()" + line.substring(cursorPos);
        this.codeLines[index] = newLine;
        this.$nextTick(() => {
          input.setSelectionRange(cursorPos + 1, cursorPos + 1); // 将光标定位在 () 中间
        });
        return true; // 表示已处理
      }

      return false; // 未处理
    },

    // 处理在括号内按回车的情况
    handleEnterInsideBrackets(index) {
      const input = this.$refs[`input_${index}`][0];
      const cursorPos = input.selectionStart;
      const line = this.codeLines[index];

      // 获取光标前后的内容
      const beforeCursor = line.substring(0, cursorPos);
      const afterCursor = line.substring(cursorPos);

      // 检查是否在 {} 中间
      if (beforeCursor.includes("{") && afterCursor.includes("}")) {
        const indent = this.getCurrentIndent(line); // 获取当前缩进
        const newLines = [
          line.substring(0, cursorPos), // { 之前的部分
          indent + "  ", // 新行（增加缩进）
          indent + line.substring(cursorPos), // } 之后的部分
        ];

        // 替换当前行为三行
        this.codeLines.splice(index, 1, ...newLines);

        this.$nextTick(() => {
          // 将焦点设置在新插入的行
          const newInput = this.$refs[`input_${index + 1}`][0];
          if (newInput) {
            newInput.focus();
            // 将光标定位在新行的缩进之后
            newInput.setSelectionRange(indent.length + 2, indent.length + 2);
          }
        });
        return true; // 表示已处理
      }

      // 检查是否在 () 中间（逻辑同上）
      if (beforeCursor.includes("(") && afterCursor.includes(")")) {
        const indent = this.getCurrentIndent(line);
        const newLines = [
          line.substring(0, cursorPos),
          indent + "  ",
          indent + line.substring(cursorPos),
        ];

        this.codeLines.splice(index, 1, ...newLines);
        this.$nextTick(() => {
          const newInput = this.$refs[`input_${index + 1}`][0];
          if (newInput) {
            newInput.focus();
            newInput.setSelectionRange(indent.length + 2, indent.length + 2);
          }
        });
        return true;
      }

      return false; // 未处理
    },

    // 获取当前行的缩进（行首的空格）
    getCurrentIndent(line) {
      const match = line.match(/^\s*/);
      return match ? match[0] : "";
    },
  },
  created() {
    // 页面加载时立即检查用户认证状态
    this.checkUserAuth();
  },
  mounted() {
    // 请求剪贴板权限
    if (navigator.permissions) {
      navigator.permissions.query({ name: "clipboard-read" }).then((result) => {
        if (result.state === "denied") {
          console.warn("剪贴板权限被拒绝");
        }
      });
    }
    this.highlightAllLines();
    document.addEventListener("keyup", this.handleKeyUp);
    document.addEventListener("click", this.handleGlobalClick);
    this.saveHistory(); // 保存初始状态
    this.$el.addEventListener("compositionstart", () => {
      this.isComposing = true;
    });
    this.$el.addEventListener("compositionend", () => {
      this.isComposing = false;
    });
  },
  beforeDestroy() {
    clearInterval(this.enterKeyInterval);
    clearInterval(this.backspaceKeyInterval);
    this.enterKeyInterval = null;
    this.backspaceKeyInterval = null;
    document.removeEventListener("keyup", this.handleKeyUp);
    document.removeEventListener("click", this.handleGlobalClick);
    this.$el
      .querySelector(".codeBody")
      ?.removeEventListener("click", this.handleCodeAreaClick);
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
  justify-content: space-between;
  background-color: #f9f9f9;
  position: relative;
  margin-bottom: 8px;
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
  top: 87%; /* 改为从底部开始 */
  left: 1%;
  width: 180px;
  background-color: white;
  margin-top: 8px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 1000; /* 提高z-index */
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

/* 添加全选高亮样式 */
.AlineDiv.selected {
  background-color: rgba(3, 102, 214, 0.1) !important;
}

/* 添加选中行的边框效果 */
.selected-line::after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
}

/* 增强选中效果 */
.AlineDiv.selected-line:hover {
  background-color: rgba(3, 102, 214, 0.25) !important;
}

/* 添加边框效果 */
.AlineDiv.selected-line {
  background-color: rgba(3, 102, 214, 0.2) !important;
  transition: background-color 0.3s ease;
  box-shadow: inset 0 0 0 1px rgba(3, 102, 214, 0.3);
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
  color: transparent !important; /* 保持文本透明 */
  caret-color: #0366d6;
  z-index: 2;
  padding: 0 12px;
  font-family: "Fira Code", "Consolas", monospace;
  font-size: 14px;
  line-height: 22px;
  /* 添加光标动画 */
  animation: blink 1s step-end infinite;
  opacity: 1 !important; /* 确保输入框不透明 */
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

/* 添加新的样式 */
.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

/* 修改格式化按钮样式 */
.format-button {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 6px 12px;
  background-color: #f0f0f0;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  font-size: 13px;
  color: #333;
  cursor: pointer;
  transition: all 0.2s;
  height: 36px; /* 匹配语言选择器的高度 */
}

/* 提交按钮样式(原格式化按钮的样式) */
.submit-button {
  width: 80px;
  height: 34px;
  font-size: 14px;
  font-weight: 500;
  background: #42b983;
  border: none;
  border-radius: 6px;
  color: white;
  cursor: pointer;
  transition: all 0.2s ease;
}

.submit-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.5);
}

.submit-button:active {
  box-shadow: 0 4px 12px rgba(66, 185, 131, 0.3);
  transform: translateY(0px);
}

/* 删除原来的 codefooter 相关样式 */
.codefooter {
  display: none;
}

.spinner {
  animation: spin 1s linear infinite;
}
</style>

<style>
/* 非 scoped 样式 */
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>