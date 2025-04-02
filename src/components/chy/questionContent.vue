<template>
  <main>
    <div class="table-container">
      <table class="question-table">
        <thead>
          <tr>
            <th class="status-column">答题状态</th>
            <th class="title-column">题目名称</th>
            <th class="tag-column">
              题目标签
            </th>
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
            >
              <td class="status-cell">
                <span :class="'state-' + question.state">{{ question.state }}</span>
              </td>
              <td class="title-cell">
                <router-link
                  class="question-link"
                  :to="{ name: 'questions_detail', params: { id: question.u_id } }"
                >
                  {{ question.title }}
                </router-link>
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
              <td class="rate-cell">{{ question.pass_rate }}%</td>
            </tr>
          </template>
          <template v-else>
            <tr class="empty-row">
              <td colspan="5">
                <div class="empty-message">
                  <svg class="empty-icon" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" fill="currentColor"/>
                  </svg>
                  <span>没有找到符合筛选条件的题目</span>
                </div>
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>
  </main>
</template>

<script>
import axios from "axios";
export default {
  props: {
    questions: {
      type: Array,
      required: true,
      default: () => []
    }
  },
  data() {
    return {
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
      handler(newValue) {
        console.log('Questions updated:', newValue);
      },
      immediate: true
    }
  },
  methods:{}
};
</script>

<style scoped>
.table-container {
  width: 100%;
  overflow-x: auto;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.question-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  background-color: #fff;
  border-radius: 8px;
  overflow: hidden;
}

.question-table thead {
  background-color: #f8f9fa;
}

.question-table th {
  padding: 16px 12px;
  text-align: left; /* 默认左对齐 */
  font-weight: 500;
  color: #495057;
  font-size: 14px;
  border-bottom: 1px solid #e9ecef;
}

.tag-column {
  width: 15%;
  text-align: center;
}

.question-table td {
  padding: 14px 12px;
  border-bottom: 1px solid #e9ecef;
  font-size: 14px;
  color: #212529;
  vertical-align: middle;
}

.question-row:hover {
  background-color: #f8f9fa;
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
  text-align: center; /* 单独设置题目标签列居中 */
}


.stats-column, .rate-column {
  width: 12.5%;
  text-align: center;
}

/* 单元格特定样式 */
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

.title-cell {
  font-weight: 500;
}

.question-link {
  color: #212529;
  text-decoration: none;
  transition: color 0.2s;
}

.question-link:hover {
  color: #007bff;
  text-decoration: none;
}

.tag-cell {
  text-align: center;
  display: flex;
  justify-content: start;
  align-items: center;
}

.difficulty-tag {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 5px;
  font-size: 12px;
  font-weight: 500;
  color: white;
  min-width: 50px;
  text-align: center;
}

/* 难度标签颜色 */
.easy {
  background-color: #fe4c61;
}

.popularize {
  background-color: #f39c11;
}

.improve {
  background-color: #ffc116;
}

.provincial-election {
  background-color: #52c41a;
}

.noi {
  background-color: #9d3dcf;
}

.ctsc {
  background-color: #0e1d69;
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