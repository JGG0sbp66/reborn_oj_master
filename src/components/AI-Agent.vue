<template>
  <link
    rel="stylesheet"
    href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css"
  >
  <div>
    <!-- 聊天按钮 -->
    <button
      @click="toggleChat"
      class="chatbot-toggle"
    >
      <transition
        name="fade"
        mode="out-in"
      >
        <img
          v-if="!isChatOpen"
          :src="bacAvatar"
          class="chatbot-icon"
          alt="AI背景图标"
        >
        <i
          v-else
          class="fas fa-chevron-down chatbot-icon"
          style="height: 30px;"
        ></i>
      </transition>
    </button>

    <!-- 聊天窗口 -->
    <transition name="slide-fade">
      <div
        v-if="isChatOpen"
        class="chatbot-container"
      >
        <div class="chat-header">
          {{ title }}
          <button
            @click="toggleChat"
            class="close-chat"
          >×</button>
        </div>

        <div
          ref="messages"
          class="chat-messages"
        >
          <div
            v-for="(msg, index) in messages"
            :key="index"
            :class="['message-wrapper', msg.sender]"
          >

            <!-- AI消息带头像 -->
            <div
              v-if="msg.sender === 'bot'"
              class="ai-message-container"
            >
              <img
                :src="aiAvatar"
                class="ai-avatar"
                alt="AI头像"
              >
              <div
                class="message bot"
                v-html="msg.isMarkdown ? renderMarkdown(msg.text) : msg.text"
              ></div>
            </div>

            <!-- 用户消息 -->
            <div
              v-else
              class="message user"
              v-html="formatUserMessage(msg.text)"
            ></div>
          </div>
        </div>

        <!-- 快捷提示按钮 -->
        <div class="quick-tips">
          <button
            v-for="(tip, index) in quickTips"
            :key="index"
            @click="sendQuickTip(tip)"
            class="tip-button"
          >
            {{ tip }}
          </button>
        </div>
        <div class="chat-input">
          <textarea
            v-model="userInput"
            @keydown.enter.exact.prevent="handleEnter"
            @keydown.shift.enter.exact.prevent="handleShiftEnter"
            placeholder="输入你的问题..."
            class="input-field"
            rows="1"
            ref="textInput"
            @input="handleInput"
          ></textarea>
          <button
            @click="sendMessage"
            class="send-button"
          >
            <i class="fas fa-paper-plane"></i>
          </button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import axios from "axios";
import defaultaiAvatar from "@/assets/icons/ai-avatar.png"; // 默认AI头像路径
import defaultbacAvatar from "@/assets/icons/bak.png"; // 默认AI背景图标路径
import MarkdownIt from "markdown-it";

export default {
  name: "ChatbotWidget",
  props: {
    title: {
      type: String,
      default: "OJ_MASTER_AI",
    },
    apiEndpoint: {
      type: String,
      default: "http://localhost:5000/api/askAi-msg",
    },
    initialGreeting: {
      type: String,
      default:
        "吾乃『黄金判官·葛孚雷』！ 凡踏入此界者，无论汝是深陷『Bug泥沼』，还是遭『需求变更之兽』追猎——报上汝之苦难！",
    },
    aiAvatar: {
      type: String,
      default: defaultaiAvatar, // 使用导入的默认头像
    },
    bacAvatar: {
      type: String,
      default: defaultbacAvatar, // 使用导入的ai背景图标
    },
  },
  data() {
    return {
      isChatOpen: false,
      userInput: "",
      messages: [{ sender: "bot", text: this.initialGreeting }],
      quickTips: ["这是什么？", "怎么使用？", "有哪些功能？", "能帮我做什么？"],
      md: new MarkdownIt(), // 初始化 markdown-it 实例
      lineHeight: 40, // 默认值，会在 mounted 中更新
    };
  },
  methods: {
    formatUserMessage(text) {
      // 将换行符转换为 <br>，同时转义 HTML 防止 XSS
      const md = this.md;
      return md.renderInline(text.replace(/\n/g, "\n"));
    },
    sendQuickTip(tip) {
      this.userInput = tip;
      this.sendMessage();
    },
    toggleChat() {
      this.isChatOpen = !this.isChatOpen;
      if (this.isChatOpen) {
        this.$nextTick(() => {
          this.scrollToBottom();
        });
      }
    },
    sendMessage() {
      const message = this.userInput.trim();
      if (message) {
        this.messages.push({ sender: "user", text: message });
        this.userInput = "";

        // 重置文本框高度
        if (this.$refs.textInput) {
          this.$refs.textInput.style.height = "auto";
        }

        const thinkingIndex = this.messages.length;
        this.messages.push({
          sender: "bot",
          text: "思考中...",
          isMarkdown: false, // 标记这不是 markdown
        });

        this.$nextTick(() => {
          this.scrollToBottom();
        });

        this.fetchAIResponse(message, thinkingIndex);
      }
    },
    async fetchAIResponse(message, thinkingIndex) {
      try {
        this.messages[thinkingIndex].text = "思考中...";
        this.$nextTick(() => this.scrollToBottom());

        const response = await axios.post(
          this.apiEndpoint,
          { prompt: message },
          {
            headers: { "Content-Type": "application/json" },
            responseType: "text",
          }
        );

        this.messages[thinkingIndex].text = "";
        this.messages[thinkingIndex].isMarkdown = true; // 标记这是 markdown

        const lines = response.data.split("\n").filter((line) => line.trim());
        let fullText = "";

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            try {
              const data = JSON.parse(line.substring(6));
              if (data.text) {
                await this.typeWriterEffect(data.text, thinkingIndex);
                fullText += data.text;
              }
            } catch (e) {
              console.warn("解析JSON失败:", line);
            }
          }
        }
      } catch (error) {
        this.messages[thinkingIndex].text =
          "出错: " + (error.message || "未知错误");
        this.messages[thinkingIndex].isMarkdown = false;
        this.$nextTick(() => this.scrollToBottom());
      }
    },
    typeWriterEffect(text, messageIndex, speed = 30) {
      return new Promise((resolve) => {
        let i = 0;
        const timer = setInterval(() => {
          if (i < text.length) {
            this.messages[messageIndex].text += text.charAt(i);
            i++;
            this.$nextTick(() => this.scrollToBottom());
          } else {
            clearInterval(timer);
            resolve();
          }
        }, speed);
      });
    },
    scrollToBottom() {
      const messagesContainer = this.$refs.messages;
      if (messagesContainer) {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
      }
    },
    // 添加 markdown 渲染方法
    renderMarkdown(text) {
      return this.md.render(text);
    },
    handleEnter() {
      if (this.userInput.trim()) {
        this.sendMessage();
      }
    },
    handleInput() {
      // 只有当检测到换行符时才调整高度
      if (this.userInput.includes("\n")) {
        this.$nextTick(() => {
          this.adjustTextareaHeight();
        });
      }
    },
    handleShiftEnter() {
      // 在光标位置插入换行符
      const textarea = this.$refs.textInput;
      const startPos = textarea.selectionStart;
      const endPos = textarea.selectionEnd;

      this.userInput =
        this.userInput.substring(0, startPos) +
        "\n" +
        this.userInput.substring(endPos);

      // 调整光标位置并确保高度调整
      this.$nextTick(() => {
        textarea.selectionStart = startPos + 1;
        textarea.selectionEnd = startPos + 1;
        this.adjustTextareaHeight();
      });
    },
    // 自动调整文本框高度
    adjustTextareaHeight() {
      const textarea = this.$refs.textInput;
      // 保存当前光标位置
      const selectionStart = textarea.selectionStart;
      const selectionEnd = textarea.selectionEnd;

      // 先重置为最小高度
      textarea.style.height = "auto";

      // 计算单行高度
      const singleLineHeight = parseInt(getComputedStyle(textarea).lineHeight);

      // 只有当内容确实需要多行时才扩展高度
      if (textarea.scrollHeight > singleLineHeight * 1.5) {
        // 1.5倍行高作为阈值
        textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
      } else {
        // 保持单行高度
        textarea.style.height = `${singleLineHeight}px`;
      }

      // 恢复光标位置
      textarea.selectionStart = selectionStart;
      textarea.selectionEnd = selectionEnd;
    },
  },
  mounted() {
    // 初始化时计算单行高度
    this.$nextTick(() => {
      if (this.$refs.textInput) {
        const style = getComputedStyle(this.$refs.textInput);
        this.lineHeight = parseInt(style.lineHeight);
        // 设置初始高度
        this.$refs.textInput.style.height = `${this.lineHeight}px`;
      }
    });
  },
};
</script>

<style scoped>
.chatbot-icon {
  width: 60px; /* 设置图片宽度 */
  height: 60px; /* 设置图片高度 */
  object-fit: cover; /* 确保图片比例正确 */
  border-radius: 50%; /* 如果需要圆形 */
}
/* 更新样式部分 */
.chatbot-toggle {
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  color: white;
  border: none;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  z-index: 999;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  background: linear-gradient(135deg, #42b983 0%, #00c4ff 100%);
}

.chatbot-toggle:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.25);
}

.chatbot-icon {
  font-size: 24px;
  transition: all 0.3s ease;
}

/* 聊天窗口动画 */
.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateY(20px);
  opacity: 0;
}

/* 图标切换动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* 其余样式保持不变 */
.chatbot-container {
  position: fixed;
  bottom: 90px;
  right: 20px;
  width: 500px;
  max-width: calc(100% - 40px);
  height: 650px;
  max-height: calc(100vh - 110px);
  border: 1px solid #ddd;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  background: white;
  z-index: 1000;
  display: flex;
  flex-direction: column;
}

.chat-header {
  height: 40px;
  background: linear-gradient(
      0deg,
      rgba(0, 0, 0, 0.02) 0.44%,
      rgba(0, 0, 0, 0) 49.5%
    ),
    #ffffff;
  color: black;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  padding: 10px;
  font-weight: bold;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.close-chat {
  background: none;
  border: none;
  color: black;
  cursor: pointer;
  font-size: 20px;
  line-height: 1;
  margin-left: 30px;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 15px; /* 增大内边距 */
  min-height: 300px; /* 确保最小高度 */
}

.message {
  padding: 12px 25px;
  border-radius: 18px;
  word-wrap: break-word;
  line-height: 1.5;
  font-size: 14px;
  max-width: 100%;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

/* 消息容器 */
.message-wrapper {
  display: flex;
  flex-direction: column;
  margin: 8px 0;
  max-width: 100%;
}

.message.user {
  background-color: rgb(59, 129, 246);
  color: white;
  border-bottom-right-radius: 4px;
  margin-left: auto;
  max-width: 85%; /* 限制最大宽度 */
  margin-right: 0; /* 移除右边距 */
  white-space: pre-wrap; /* 保留换行符和空格 */
}

.message.bot {
  background-color: #f1f1f1;
  border-bottom-left-radius: 4px;
  margin-right: auto;
  max-width: 85%; /* 限制最大宽度 */
  margin-left: 0; /* 移除左边距 */
}

.chat-input {
  padding: 15px;
  border-top: 1px solid #ddd;
  display: flex;
  align-items: center;
}

/* AI头像 */
.ai-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
}

.ai-message-container {
  display: flex;
  align-items: flex-end; /* 改为顶部对齐更自然 */
  gap: 12px; /* 增大间距 */
  margin-bottom: 12px; /* 增大间距 */
  max-width: 90%; /* 限制最大宽度 */
}

.input-field {
  flex: 1;
  padding: 5px 10px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.3s ease;
  outline: none;
  min-height: 40px; /* 与 lineHeight 保持一致 */
  max-height: 120px;
  resize: none; /* 禁止手动调整大小 */
  overflow-y: auto; /* 内容超出时显示滚动条 */
  line-height: 1.5; /* 行高 */
  white-space: pre-wrap; /* 保留换行符 */
}

.input-field:focus {
  border-color: #42b983;
  box-shadow: 0 0 0 2px rgba(66, 185, 131, 0.2),
    0 2px 8px rgba(0, 196, 255, 0.1);
  background-color: #f8fcfb;
}

/* 快捷提示按钮 */
.quick-tips {
  display: flex;
  flex-wrap: wrap;
  gap: 10px; /* 增大按钮间距 */
  padding: 15px; /* 增大内边距 */
  border-top: 1px solid #eee;
  background: #f9f9f9;
}

.tip-button {
  padding: 6px 12px;
  background: #e9f5f1;
  color: #42b983;
  border: 1px solid #d1e7dd;
  border-radius: 16px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;
}

.tip-button:hover {
  background: #d1e7dd;
  transform: translateY(-1px);
}

.send-button {
  padding: 8px 12px; /* 调整内边距 */
  color: blackrgb(63 63 70 / var(--tw-text-opacity));
  border: none;
  border-radius: 50%; /* 改为圆形 */
  cursor: pointer;
  width: 40px; /* 固定宽度 */
  height: 40px; /* 固定高度 */
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.send-button:hover {
  transform: scale(1.1); /* 悬停时放大效果 */
}

.send-button i {
  font-size: 16px; /* 图标大小 */
}

/* 调整输入框与按钮的间距 */
.input-field {
  margin-right: 12px; /* 增大间距 */
}

/* 响应式设计 */
@media (max-width: 480px) {
  .chatbot-container {
    width: calc(100% - 40px); /* 手机端占满宽度 */
    height: 70vh; /* 使用视口高度 */
  }
  .message {
    padding: 10px 14px;
    font-size: 13px;
  }

  .ai-avatar {
    width: 28px;
    height: 28px;
  }

  .quick-tips {
    padding: 8px;
  }

  .tip-button {
    padding: 4px 8px;
    font-size: 11px;
  }
}
</style>