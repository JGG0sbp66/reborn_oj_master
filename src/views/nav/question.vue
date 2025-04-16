<template>
  <div>
    <!-- 导航栏组件 -->
    <headerheader />
    <!-- 题库组件 -->
    <div class="content">
      <Transition name="fade">
        <questiobSum v-if="showComponent"></questiobSum>
      </Transition>
    </div>
    <!-- 页尾组件 -->
    <foot />
    <AIAgent
      title="「黄金判官·葛孚雷」"
      buttonColor="#3b82f6"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import showtitle from "@/components/test/showtitle.vue";
import navlinks from "@/components/test/navlinks.vue";
import questiobSum from "@/components/chy/questionSum.vue";
import foot from "@/components/foot.vue";
import headerheader from "@/components/headerheader.vue";
import AIAgent from "@/components/AI-Agent.vue";
import { questionData, loadQuestionData } from "@/utils/dataStore";

const showComponent = ref(false);

onMounted(() => {
  // 检查数据是否已预加载，如果没有，立即开始加载
  if (!questionData.isLoaded && !questionData.isLoading) {
    loadQuestionData();
  }
  
  // 组件挂载后显示，触发进入动画
  showComponent.value = true;
});
</script>

<style scoped>
.content {
  min-height: calc(100vh - 100px); /* 确保内容区域高度减去 footer 的高度 */
  padding-bottom: 30px; /* 给 footer 留出空间 */
  padding-top: 50px; /* 给 headerheader 留出空间 */
}

/* 渐入渐出动画 */
.fade-enter-active,
.fade-leave-active {
  transition: all 0.5s ease;
}

.fade-enter-from {
  opacity: 0;
  transform: scale(0.9);
}

.fade-leave-to {
  opacity: 0;
  transform: scale(1.1);
}
</style>