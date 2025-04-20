<template>
  <div class="table-container">
    <template v-if="loading">
      <!-- 加载状态 -->
      <div class="loading-container">
        <svg
          class="loading-spinner"
          viewBox="0 0 50 50"
        >
          <circle
            class="path"
            cx="25"
            cy="25"
            r="20"
            fill="none"
            stroke-width="5"
          ></circle>
        </svg>
        <span>正在加载题目...</span>
      </div>
    </template>
    <template v-else>
      <table class="question-table">
        <thead>
          <tr>
            <th class="status-column">答题状态</th>
            <th class="title-column">题目名称</th>
            <th class="tag-column">题目标签</th>
            <th class="stats-column">提交/解决数</th>
            <th class="rate-column">通过率</th>
          </tr>
        </thead>
        <tbody>
          <template v-if="questions.length > 0">
            <tr
              v-for="(question, index) in questions"
              :key="index"
              class="question-row"
              @click="goToQuestionDetail(question.uid)"
            >
              <td class="status-cell">
                <span :class="'state-' + question.state">{{ question.state }}</span>
              </td>
              <td class="title-cell">
                <span class="title-text">{{ question.title }}</span>
                <span class="hover-effect"></span>
              </td>
              <td class="tag-cell">
                <div
                  class="difficulty-tag"
                  :class="difficultyClasses[question.topic]"
                >
                  {{ question.topic }}
                </div>
              </td>
              <td class="stats-cell">{{ question.submit_num }}/{{ question.solve_num }}</td>
              <td class="rate-cell">{{ calculateRate(question.submit_num, question.solve_num) }}</td>
            </tr>
          </template>
          <template v-else>
            <tr class="empty-row">
              <td colspan="5">
                <div class="empty-message">
                  <svg
                    class="empty-icon"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"
                      fill="currentColor"
                    />
                  </svg>
                  <span>没有找到符合筛选条件的题目</span>
                </div>
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </template>
  </div>
</template>

<script>
export default {
  props: {
    questions: {
      type: Array,
      required: true,
      default: () => [],
    },
  },
  data() {
    return {
      loading: true,
      difficultyClasses: {
        入门: "easy",
        普及: "popularize",
        提高: "improve",
        省选: "provincial-election",
        NOI: "noi",
        CTSC: "ctsc",
      },
    };
  },
  watch: {
    questions: {
      immediate: true,
      handler(newVal) {
        if (newVal && newVal.length > 0) {
          this.loading = false;
        }
      },
    },
  },
  methods: {
    goToQuestionDetail(id) {
      this.$store.dispatch("setCurrentQuestionId", id);
      this.$router.push({ name: "questions_detail", params: { id } });
      console.log(id);
    },
    calculateRate(submitNum, solveNum) {
    if (submitNum === 0) {
      return `${(0).toFixed(2)}%`;
    }
    return `${((solveNum / submitNum) * 100).toFixed(2)}%`;
  },
  },
};
</script>

<style scoped>
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  color: #666;
}

.loading-spinner {
  width: 50px;
  height: 50px;
  animation: rotate 2s linear infinite;
  margin-bottom: 16px;
}

.loading-spinner .path {
  stroke: #1890ff;
  stroke-linecap: round;
  animation: dash 1.5s ease-in-out infinite;
}

@keyframes rotate {
  100% {
    transform: rotate(360deg);
  }
}

@keyframes dash {
  0% {
    stroke-dasharray: 1, 150;
    stroke-dashoffset: 0;
  }
  50% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -35;
  }
  100% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -124;
  }
}

.table-container {
  width: 100%;
  overflow-x: auto;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.question-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0 8px;
  background-color: #fff;
  border-radius: 12px;
  overflow: hidden;
}

.question-table thead {
  background-color: #f8f9fa;
}

.question-table th {
  padding: 18px 16px;
  text-align: left;
  font-weight: 600;
  color: #495057;
  font-size: 14px;
  border-bottom: none;
}

.question-table td {
  padding: 16px;
  font-size: 14px;
  color: #212529;
  vertical-align: middle;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  position: relative;
  border: none;
}

.question-row {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  margin-bottom: 8px;
  cursor: pointer;
}

.question-row:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
  background-color: #f1f5f9;
  z-index: 1;
}

/* 题目名称样式 */
.title-cell {
  position: relative;
}

.title-text {
  position: relative;
  z-index: 2;
}

.hover-effect {
  position: absolute;
  bottom: 0;
  left: 50%; /* 从左侧50%开始 */
  transform: translateX(-50%); /* 居中显示 */
  width: 0;
  height: 2px;
  background: linear-gradient(90deg, #4facfe 0%, #00f2fe 100%);
  transition: width 0.5s ease, opacity 0.5s ease;
  opacity: 0;
  z-index: 1;
}

.question-row:hover .hover-effect {
  width: 80%; /* 调整为80%宽度 */
  opacity: 1;
}

.question-row:hover .title-text {
  color: #4facfe;
}

/* 状态标签样式 */
.status-cell {
  font-size: 13px;
}

.state-已通过 {
  color: #28a745;
  font-weight: 500;
}

.state-未通过 {
  color: #dc3545;
  font-weight: 500;
}

.state-未尝试 {
  color: #6c757d;
}

.difficulty-tag {
  display: inline-block;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  color: white;
  min-width: 60px;
  text-align: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* 难度标签颜色 */
.easy {
  background-color: rgba(254, 76, 97, 0.1);
  color: #fe4c61;
  border: 1px solid rgba(254, 76, 97, 0.2);
}

.popularize {
  background-color: rgba(243, 156, 17, 0.1);
  color: #f39c11;
  border: 1px solid rgba(243, 156, 17, 0.2);
}

.improve {
  background-color: rgba(255, 193, 22, 0.1);
  color: #ffc116;
  border: 1px solid rgba(255, 193, 22, 0.2);
}

.provincial-election {
  background-color: rgba(82, 196, 26, 0.1);
  color: #52c41a;
  border: 1px solid rgba(82, 196, 26, 0.2);
}

.noi {
  background-color: rgba(157, 61, 207, 0.1);
  color: #9d3dcf;
  border: 1px solid rgba(157, 61, 207, 0.2);
}

.ctsc {
  background-color: rgba(14, 29, 105, 0.1);
  color: #0e1d69;
  border: 1px solid rgba(14, 29, 105, 0.2);
}

/* 难度标签悬浮效果 */
.difficulty-tag:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

/* 列宽设置 */
.status-column {
  width: 12%;
  min-width: 100px;
}

.title-column {
  width: 48%;
}

.tag-column {
  width: 15%;
}

.stats-column,
.rate-column {
  width: 12.5%;
  text-align: center;
}

/* 空状态样式 */
.empty-row td {
  padding: 40px 0;
  text-align: center;
  color: #6c757d;
}

.empty-message {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.empty-icon {
  width: 48px;
  height: 48px;
  color: #adb5bd;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .question-table {
    min-width: 600px;
  }

  .table-container {
    border-radius: 0;
    box-shadow: none;
    border: 1px solid #e9ecef;
  }
}
</style>
