<template>
  <main class="questions">
    <!-- 题目详情页面介绍 -->
    <div
      class="left-panel"
      :style="{ width: leftWidth + 'px' }"
    >
      <questions_dBodyIntroduce
        :submissions="submissions"
        :activeTab="activeTab"
        @switch-tab="switchTab"
        @question-loaded="handleQuestionLoaded"
        @question-id="handleQuestionId"
      ></questions_dBodyIntroduce>
    </div>

    <!-- 分隔条 -->
    <questions_detailResizeBar @start-drag="initDrag"></questions_detailResizeBar>

    <!-- 题目详情页编码区 -->
    <div class="right-panel">
      <qustions_dBodyCode
        :questionDetail="questionDetail"
        :id="id"
        @show-alert="handleCodeAlert"
        @submit-code="handleCodeSubmit"
      ></qustions_dBodyCode>
    </div>

    <!-- 提示框组件 -->
    <questions_detailCue
      :showAlert="showAlert"
      :alertType="alertType"
      :alertMessage="alertMessage"
      @update:showAlert="showAlert = $event"
    ></questions_detailCue>
  </main>
</template>

<script>
import questions_dBodyIntroduce from "./questions_dBodyIntroduce.vue";
import qustions_dBodyCode from "./qustions_dBodyCode.vue";
import questions_detailCue from "./questions_detailCue.vue";
import questions_detailResizeBar from "./questions_detailResizeBar.vue";
export default {
  components: {
    questions_dBodyIntroduce,
    qustions_dBodyCode,
    questions_detailCue,
    questions_detailResizeBar,
  },
  data() {
    return {
      submissions: [], // 存储所有提交记录
      showAlert: false,
      alertMessage: "",
      alertType: "",
      activeTab: "description",
      leftWidth: 800, // 初始左侧宽度
      isDragging: false,
      startX: 0,
      startWidth: 0,
      questionDetail: null, // 存储题目详情
      id: null, // 存储题目ID
    };
  },
  mounted() {
    window.addEventListener("mousemove", this.handleDrag);
    window.addEventListener("mouseup", this.stopDrag);
  },
  beforeDestroy() {
    window.removeEventListener("mousemove", this.handleDrag);
    window.removeEventListener("mouseup", this.stopDrag);
  },
  methods: {
    initDrag(e) {
      this.isDragging = true;
      this.startX = e.clientX;
      this.startWidth = this.leftWidth;
      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";
    },
    handleDrag(e) {
      if (!this.isDragging) return;

      const dx = e.clientX - this.startX;
      const newWidth = this.startWidth + dx;

      // 限制最小和最大宽度
      const minWidth = 300;
      const maxWidth = 1500;

      this.leftWidth = Math.max(minWidth, Math.min(maxWidth, newWidth));
    },
    stopDrag() {
      if (!this.isDragging) return;

      this.isDragging = false;
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    },
    switchTab(tab) {
      this.activeTab = tab;
    },
    handleCodeAlert(payload) {
      // 显示错误提示
      this.showAlertMessage(payload.type, payload.message || "提交的代码不能为空");
    },
    showAlertMessage(type, message) {
      this.alertType = type;
      this.alertMessage = message;
      this.showAlert = true;

      setTimeout(() => {
        this.closeAlert();
      }, 3000);
    },
    closeAlert() {
      this.showAlert = false;
    },
    handleQuestionLoaded(detail) {
      this.questionDetail = detail;
    },
    handleQuestionId(detail) {
      this.id = detail;
    },
    // 修改提交处理逻辑
    async handleCodeSubmit(submission) {
      try {
        // 显示提交中状态
        this.showAlertMessage("success", "代码测评完成");

        // 添加提交记录
        this.submissions.unshift(submission);

        // 切换到提交记录标签页
        this.activeTab = "submissions";
      } catch (error) {
        console.error("提交失败:", error);
      }
    },
  },
};
</script>

<style scoped>
.questions {
  display: flex;
  padding: 8px;
  margin: 50px 0px;
  min-height: 892px;
  position: relative;
  height: calc(100vh - 20px); /* 确保有明确高度 */
}
.left-panel {
  flex: 0 0 auto;
  overflow: hidden;
  transition: width 0.1s ease;
  height: 100%; /* 添加高度 */
}

.right-panel {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  height: 100%; /* 添加高度 */
}
</style>