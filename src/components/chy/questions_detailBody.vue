<template>
  <main class="questions">
    <!-- 题目详情页面介绍 -->
    <questions_dBodyIntroduce></questions_dBodyIntroduce>

    <!-- 题目详情页编码区 -->
    <qustions_dBodyCode
      @show-alert="handleCodeAlert"
      @submit-code="handleCodeSubmit"
    ></qustions_dBodyCode>

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
export default {
  components: {
    questions_dBodyIntroduce,
    qustions_dBodyCode,
    questions_detailCue,
  },
  data() {
    return {
      submissions: [], // 存储所有提交记录
      showAlert: false,
      alertMessage: "",
      alertType: "",
      activeTab: "description",
    };
  },
  methods: {
    switchTab(tab) {
      this.activeTab = tab;
    },
    handleCodeAlert(payload) {
      // 显示错误提示
      this.showAlertMessage("error", payload.message || "提交的代码不能为空");
    },
    handleCodeSubmit(submission) {
      // 添加新的提交记录
      this.submissions.unshift(submission);

      // 显示成功提示
      this.showAlertMessage("success", "提交成功,等待测评");
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
  },
};
</script>

<style scoped>
.questions {
  display: flex;
  padding: 8px;
  margin: 10px 0px;
  min-height: 892px;
}
</style>