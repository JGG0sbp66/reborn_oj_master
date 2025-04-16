<template>
  <div class="describe-container">
    <div class="describe">
      <div class="headerDescribe">
        <div
          class="headerSpan"
          :class="{ active: activeTab === 'description' }"
          @click="switchTab('description')"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            style="width: 18px; height: 18px;"
          >
            <defs>
              <linearGradient
                id="descriptionGradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="0%"
              >
                <stop
                  offset="0%"
                  stop-color="var(--gradient-start, #64748b)"
                />
                <stop
                  offset="100%"
                  stop-color="var(--gradient-end, #64748b)"
                />
              </linearGradient>
            </defs>
            <path
              fill="url(#descriptionGradient)"
              d="M14 4.5A2.5 2.5 0 0 0 11.5 2h-7A2.5 2.5 0 0 0 2 4.5v7A2.5 2.5 0 0 0 4.5 14h1.757a5.507 5.507 0 0 1-.657-1H4.5A1.5 1.5 0 0 1 3 11.5V6h4.337c.895-.63 1.986-1 3.163-1c1.33 0 2.55.472 3.5 1.257V4.5zm-3.5.5H3v-.5A1.5 1.5 0 0 1 4.5 3h7A1.5 1.5 0 0 1 13 4.5V5h-2.5zm-.625 3.5a.625.625 0 1 1 1.25 0a.625.625 0 0 1-1.25 0zm1.125 4a.5.5 0 0 1-1 0v-2a.5.5 0 0 1 1 0v2zm-5-2a4.5 4.5 0 1 1 9 0a4.5 4.5 0 0 1-9 0zm1 0a3.5 3.5 0 1 0 7 0a3.5 3.5 0 0 0-7 0z"
            />
          </svg>
          <span>题目描述</span>
        </div>
        <div
          class="headerSpan"
          :class="{ active: activeTab === 'submissions' }"
          @click="switchTab('submissions')"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            style="width: 18px; height: 18px;"
          >
            <defs>
              <linearGradient
                id="submissionsGradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="0%"
              >
                <stop
                  offset="0%"
                  stop-color="var(--gradient-start, #64748b)"
                />
                <stop
                  offset="100%"
                  stop-color="var(--gradient-end, #64748b)"
                />
              </linearGradient>
            </defs>
            <path
              fill="url(#submissionsGradient)"
              d="M15.986 4a2.25 2.25 0 0 0-2.236-2h-3.5a2.25 2.25 0 0 0-2.236 2H6.25A2.25 2.25 0 0 0 4 6.25v13.5A2.25 2.25 0 0 0 6.25 22h11.5A2.25 2.25 0 0 0 20 19.75V6.25A2.25 2.25 0 0 0 17.75 4h-1.764zm.009.096L16 4.25c0-.052-.002-.103-.005-.154zM10.25 6.5h3.5c.78 0 1.467-.397 1.871-1h2.129a.75.75 0 0 1 .75.75v13.5a.75.75 0 0 1-.75.75H6.25a.75.75 0 0 1-.75-.75V6.25a.75.75 0 0 1 .75-.75h2.129c.404.603 1.091 1 1.871 1zm0-3h3.5a.75.75 0 0 1 0 1.5h-3.5a.75.75 0 0 1 0-1.5zm6.25 10.75a.75.75 0 0 0-1.5 0v3a.75.75 0 0 0 1.5 0v-3zM12 11a.75.75 0 0 1 .75.75v5.5a.75.75 0 0 1-1.5 0v-5.5A.75.75 0 0 1 12 11zM9 9.75a.75.75 0 0 0-1.5 0v7.5a.75.75 0 0 0 1.5 0v-7.5z"
            />
          </svg>
          <span>我的提交</span>
        </div>
      </div>
      <div
        v-if="questionDetail"
        class="content-container"
        v-show="activeTab === 'description'"
      >
        <div class="bodyDescribe1">
          <h2>{{this.questionDetail?.title}}</h2>
          <div class="bodyDescribe1Second">
            <div class="bodyDescribeSpan">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                style="width: 14px; height: 14px;"
              >
                <g fill="none">
                  <path
                    d="M21 6.25A3.25 3.25 0 0 0 17.75 3H6.25A3.25 3.25 0 0 0 3 6.25v11.5A3.25 3.25 0 0 0 6.25 21h5.772a6.471 6.471 0 0 1-.709-1.5H6.25a1.75 1.75 0 0 1-1.75-1.75V8.5h15v2.813a6.471 6.471 0 0 1 1.5.709V6.25zM6.25 4.5h11.5c.966 0 1.75.784 1.75 1.75V7h-15v-.75c0-.966.784-1.75 1.75-1.75zM23 17.5a5.5 5.5 0 1 0-11 0a5.5 5.5 0 0 0 11 0zm-5.5 0h2a.5.5 0 0 1 0 1H17a.5.5 0 0 1-.5-.491v-3.01a.5.5 0 0 1 1 0V17.5z"
                    fill="currentColor"
                  ></path>
                </g>
              </svg>
              <span>时间限制:{{this.questionDetail?.tle}}ms</span>
            </div>
            <div class="bodyDescribeSpan">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                style="width: 14px; height: 14px;"
              >
                <path
                  d="M15 9H9v6h6V9zm-2 4h-2v-2h2v2zm8-2V9h-2V7c0-1.1-.9-2-2-2h-2V3h-2v2h-2V3H9v2H7c-1.1 0-2 .9-2 2v2H3v2h2v2H3v2h2v2c0 1.1.9 2 2 2h2v2h2v-2h2v2h2v-2h2c1.1 0 2-.9 2-2v-2h2v-2h-2v-2h2zm-4 6H7V7h10v10z"
                  fill="currentColor"
                ></path>
              </svg>
              <span>空间限制:{{this.questionDetail?.mle}}MB</span>
            </div>
          </div>
          <h3>题目描述</h3>
          <p>{{this.questionDetail?.description}}</p>
          <h3>输入格式</h3>
          <p>{{this.questionDetail?.pattern_text}}</p>
          <h3>输出格式</h3>
          <p>{{this.questionDetail?.print_text}}</p>
          <template
            v-for="(example, index) in questionDetail?.examples"
            :key="index"
          >
            <h3>测试样例{{index+1}}</h3>
            <div class="Testinput">
              <div class="TestinputB">
                <div>
                  <span>输入数据</span>
                </div>
                <div @click="copyToClipboard(example.input)">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    style="width: 14px; height: 14px; position: relative; top:2px;"
                  >
                    <path
                      d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"
                      fill="currentColor"
                    ></path>
                  </svg>
                  <span>复制</span>
                </div>
              </div>
              <div
                class="Testinputc"
                style="padding: 5px 16px 12px; font-size: 14px; font-weight: 300;"
              >{{ example?.input }}</div>
            </div>
            <div class="Testout">
              <div class="TestinputB">
                <div>
                  <span>输出数据</span>
                </div>
                <div @click="copyToClipboard(example.output)">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    style="width: 14px; height: 14px; position: relative; top:2px;"
                  >
                    <path
                      d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"
                      fill="currentColor"
                    ></path>
                  </svg>
                  <span>复制</span>
                </div>
              </div>
              <div
                class="Testinputc"
                style="padding: 5px 16px 12px; font-size: 14px; font-weight: 300;"
              >{{ example?.output }}</div>
            </div>
            <template v-if="example.explanation && example.explanation.trim() !== ''">
              <h3>解释{{index+1}}</h3>
              <div class="Testinput">
                <div class="TestinputB">
                  <div>
                    <span>题目描述</span>
                  </div>
                  <div @click="copyToClipboard(example.explanation)">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      style="width: 14px; height: 14px; position: relative; top:2px;"
                    >
                      <path
                        d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"
                        fill="currentColor"
                      ></path>
                    </svg>
                    <span>复制</span>
                  </div>
                </div>
                <div
                  class="Testinputc"
                  style="padding: 5px 16px 12px; font-size: 14px; font-weight: 300;"
                >{{example?.explanation}}</div>
              </div>
            </template>
          </template>
        </div>
      </div>
      <div
        v-else
        class="skeleton-container"
      >
        <!-- 骨架屏内容 -->
        <div class="skeleton-title"></div>
        <div class="skeleton-meta">
          <div class="skeleton-meta-item"></div>
          <div class="skeleton-meta-item"></div>
        </div>
        <div class="skeleton-content"></div>
        <div class="skeleton-content"></div>
        <div class="skeleton-content"></div>
      </div>
      <div
        class="content-container"
        v-show="activeTab === 'submissions'"
      >
        <div class="bodyDescribe2">
          <table class="tableBox">
            <thead>
              <tr>
                <th>状态</th>
                <th>语言</th>
                <th>运行时间</th>
                <th>使用内存</th>
                <th>提交时间</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="submission in submissions"
                :key="submission.index"
                :class="{ 'pending-row': submission.isPending }"
              >
                <td v-html="submission.status"></td>
                <td>{{ submission.language }}</td>
                <td v-html="submission.runTime"></td>
                <td v-html="submission.memoryUsage"></td>
                <td>{{ submission.submitTime }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>
  
<script>
// 1. 在顶部引入 axios
import axios from "axios";

export default {
  name: "DescribeComponent",
  props: ["submissions", "activeTab"],
  data() {
    return {
      id: "",
      questionDetail: null,
      isLoading: false,
      error: null,
    };
  },
  created() {
    this.questionId =
      this.$route.params.id ||
      this.$store.getters.currentQuestionId ||
      localStorage.getItem("currentQuestionId");

    if (this.questionId) {
      // 同步到所有存储位置
      this.$store.commit("setCurrentQuestionId", this.questionId);
      localStorage.setItem("currentQuestionId", this.questionId);
      this.fetchQuestionDetail();
    }
  },
  methods: {
    switchTab(tab) {
      this.$emit("switch-tab", tab);
    },
    async fetchQuestionDetail() {
      this.isLoading = true;
      this.error = null;
      try {
        const questionId = localStorage.getItem("currentQuestionId");
        console.log("Fetching question detail for ID:", questionId);
        localStorage.setItem("currentQuestionId", questionId);

        const { data: response } = await axios({
          url: "http://localhost:5000/api/question-detail",
          method: "post",
          data: {
            uid: questionId,
          },
        });

        console.log("Fetched question detail:", response); // 调试日志
        console.log("Question ID:", this.questionId); // 调试日志
        this.questionDetail = response.question_detail;

        // 触发事件将数据传递给父组件
        this.$emit("question-loaded", this.questionDetail);
        this.$emit("question-id", this.questionId);
      } catch (error) {
        this.error = "获取题目详情失败，请稍后重试";
        console.error("Failed to fetch data:", error);
      } finally {
        this.isLoading = false;
      }
    },
    async copyToClipboard(text) {
      try {
        await navigator.clipboard.writeText(text);
        // 可以添加一些视觉反馈，比如显示一个短暂的通知
        this.$notify({
          title: "复制成功",
          message: "内容已复制到剪贴板",
          type: "success",
          duration: 2000,
        });
      } catch (err) {
        console.error("复制失败:", err);
        // 回退方案
        this.fallbackCopyToClipboard(text);
      }
    },

    // 兼容性回退方案
    fallbackCopyToClipboard(text) {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.style.position = "fixed"; // 防止页面滚动
      document.body.appendChild(textarea);
      textarea.select();

      try {
        const successful = document.execCommand("copy");
        if (successful) {
          this.$notify({
            title: "复制成功",
            message: "内容已复制到剪贴板",
            type: "success",
            duration: 2000,
          });
        } else {
          throw new Error("复制命令执行失败");
        }
      } catch (err) {
        console.error("回退复制方法失败:", err);
        this.$notify.error({
          title: "复制失败",
          message: "请手动选择文本并复制",
          duration: 2000,
        });
      } finally {
        document.body.removeChild(textarea);
      }
    },
  },
  watch: {
    "$route.params.id"(newId) {
      if (newId) {
        this.questionId = newId;
        this.$store.commit("setCurrentQuestionId", newId);
        localStorage.setItem("currentQuestionId", newId);
        this.fetchQuestionDetail();
      }
    },
    submissions: {
      deep: true,
      handler(newVal) {
        console.log("Submissions updated:", newVal);
      },
    },
  },
};
</script>

<style scoped>
skeleton-container {
  padding: 16px;
}

.skeleton-title {
  height: 28px;
  width: 60%;
  background: #f1f5f9;
  border-radius: 4px;
  margin-bottom: 20px;
}

.skeleton-meta {
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
}

.skeleton-meta-item {
  height: 32px;
  width: 120px;
  background: #f1f5f9;
  border-radius: 16px;
}

.skeleton-content {
  height: 16px;
  width: 100%;
  background: #f1f5f9;
  border-radius: 4px;
  margin-bottom: 12px;
}

.skeleton-content:nth-child(2) {
  width: 90%;
}

.skeleton-content:nth-child(3) {
  width: 80%;
}

.describe-container {
  width: 100%;
  height: 100%;
  margin: 0px;
}

.describe {
  width: 100%;
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  font-family: "Inter", -apple-system, BlinkMacSystemFont, sans-serif;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.describe:hover {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.headerDescribe {
  width: 100%;
  padding: 0 16px;
  display: flex;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  background-color: #f8fafc;
  flex-wrap: wrap;
}

.headerSpan {
  padding: 12px 0;
  margin-right: 24px;
  position: relative;
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  color: #64748b;
  font-weight: 500;
  font-size: 15px;
  --gradient-start: #64748b;
  --gradient-end: #64748b;
}

.headerSpan:hover {
  color: #334155;
}

.headerSpan svg {
  margin-right: 8px;
  width: 18px;
  height: 18px;
  transition: all 0.2s ease;
  color: inherit;
}

.headerSpan.active span {
  background: linear-gradient(
    90deg,
    var(--gradient-start),
    var(--gradient-end)
  );
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.headerSpan.active {
  --gradient-start: #42b983;
  --gradient-end: #42b983;
  font-weight: 600;
}

.headerSpan.active::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(
    90deg,
    var(--gradient-start),
    var(--gradient-end)
  );
  border-radius: 3px 3px 0 0;
  animation: fadeIn 0.3s ease-out;
}

.content-container {
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  height: 100%; /* 确保父容器有明确高度 */
}

.bodyDescribe1 {
  padding: 0 16px;
  flex: 1;
  overflow-y: auto; /* 只保留垂直滚动 */
  overflow-x: hidden; /* 隐藏水平滚动 */
  scrollbar-width: thin;
  scrollbar-color: #cbd5e1 transparent;
  max-height: calc(100vh - 10px); /* 根据实际情况调整 */
}

.bodyDescribe1::-webkit-scrollbar {
  width: 6px;
}

.bodyDescribe1::-webkit-scrollbar-track {
  background: transparent;
}

.bodyDescribe1::-webkit-scrollbar-thumb {
  background-color: #cbd5e1;
  border-radius: 3px;
}

.bodyDescribe1::-webkit-scrollbar-thumb:hover {
  background-color: #94a3b8;
}

.bodyDescribe1Second {
  display: flex;
  margin: 16px 0;
  gap: 8px;
  flex-wrap: wrap;
}

.bodyDescribe1 h2 {
  font-size: 20px;
  color: #1e293b;
  margin: 20px 0 16px;
  font-weight: 700;
  line-height: 1.3;
}

.bodyDescribeSpan {
  display: inline-flex;
  align-items: center;
  height: 32px;
  background-color: #f1f5f9;
  padding: 0 12px;
  border-radius: 16px;
  font-size: 13px;
  color: #475569;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.bodyDescribeSpan:hover {
  background-color: #e2e8f0;
}

.bodyDescribeSpan svg {
  margin-right: 6px;
  width: 14px;
  height: 14px;
  color: #64748b;
}

h3 {
  font-size: 16px;
  font-weight: 600;
  margin: 20px 0 12px;
  color: #1e293b;
  position: relative;
  padding-left: 10px;
}

h3::before {
  content: "";
  position: absolute;
  left: 0;
  top: 4px;
  bottom: 4px;
  width: 3px;
  background: linear-gradient(90deg, #3aa876, #00b3e6);
  border-radius: 2px;
}

p {
  padding: 0;
  color: #475569;
  margin: 0 0 16px;
  line-height: 1.6;
  font-size: 14px;
}

.Testinput,
.Testout {
  width: 100%;
  background-color: #f8fafc;
  border-radius: 8px;
  margin-bottom: 20px;
  border: 1px solid #e2e8f0;
  overflow: hidden;
  transition: all 0.3s ease;
}

.Testinput:hover,
.Testout:hover {
  border-color: #cbd5e1;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.TestinputB {
  display: flex;
  justify-content: space-between;
  padding: 12px 16px;
  background-color: #f1f5f9;
  border-bottom: 1px solid #e2e8f0;
}

.TestinputB span {
  font-size: 13px;
  font-weight: 500;
  color: #475569;
}

.TestinputB div {
  cursor: pointer;
  color: #64748b;
  transition: all 0.2s ease;
}

.TestinputB div:hover {
  color: #3b82f6;
}

.TestinputB svg {
  margin-right: 6px;
  transition: color 0.2s ease;
}

.Testinputc {
  padding: 12px 16px;
  font-size: 14px;
  font-family: "SF Mono", "Roboto Mono", monospace;
  color: #334155;
  background-color: #ffffff;
  white-space: pre-wrap;
  line-height: 1.5;
}

.bodyDescribe2 {
  width: 100%;
  height: 100%;
  overflow-y: auto; /* 只保留垂直滚动 */
  overflow-x: hidden; /* 隐藏水平滚动 */
  scrollbar-width: thin;
  scrollbar-color: #cbd5e1 transparent;
}

.bodyDescribe2::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

.bodyDescribe2::-webkit-scrollbar-thumb {
  background-color: #cbd5e1;
  border-radius: 3px;
}

.tableBox {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  font-size: 14px;
  min-width: auto;
  table-layout: fixed; /* 固定表格布局 */
}

thead {
  background-color: #f8fafc;
  position: sticky;
  top: 0;
  z-index: 1;
}

th {
  padding: 12px 16px;
  font-weight: 600;
  color: #475569;
  background-color: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
  white-space: nowrap;
}

td {
  padding: 12px 16px;
  border-bottom: 1px solid #f1f5f9;
  color: #334155;
  transition: background-color 0.2s ease;
  white-space: nowrap;
  text-align: center;
}

tr:hover td {
  background-color: #f8fafc;
}

td:first-child {
  font-weight: 500;
}

td:first-child svg {
  margin-right: 6px;
}

.loading-spinner {
  display: inline-block;
  width: 18px;
  height: 18px;
  border: 2px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  border-top-color: #18a058;
  animation: spin 1s ease-in-out infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* 调整表格行的最小高度，确保加载动画有足够空间 */
.tableBox tbody tr td {
  min-height: 40px;
  vertical-align: middle;
}

/* 动画效果 */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-5px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 响应式调整 */
@media (max-width: 768px) {
  .describe {
    border-radius: 0;
  }

  .headerDescribe {
    padding: 0 12px;
  }

  .headerSpan {
    padding: 10px 0;
    margin-right: 16px;
    font-size: 14px;
  }

  .bodyDescribe1 {
    padding: 0 12px;
  }

  .bodyDescribe1 h2 {
    font-size: 18px;
    margin: 16px 0 12px;
  }

  .bodyDescribeSpan {
    padding: 0 10px;
    font-size: 12px;
  }

  h3 {
    font-size: 15px;
    margin: 16px 0 10px;
  }

  p {
    font-size: 13px;
    margin-bottom: 12px;
  }

  .TestinputB {
    padding: 10px 12px;
  }

  .Testinputc {
    padding: 10px 12px;
    font-size: 13px;
  }

  th,
  td {
    padding: 10px 12px;
    font-size: 13px;
  }
}

@media (max-width: 480px) {
  .headerDescribe {
    flex-direction: column;
    align-items: flex-start;
  }

  .headerSpan {
    width: 100%;
    margin-right: 0;
    margin-bottom: 4px;
    padding: 8px 0;
  }

  .headerSpan.active::after {
    height: 2px;
  }

  .bodyDescribe1Second {
    gap: 6px;
  }

  .bodyDescribeSpan {
    height: 28px;
    padding: 0 8px;
  }

  .TestinputB span {
    font-size: 12px;
  }

  .TestinputB svg {
    width: 12px;
    height: 12px;
  }
}
</style>