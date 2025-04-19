<template>
  <managerhead />
  <div class="manager-container">
    <managerslider @sidebar-state-change="handleSidebarStateChange" />
    <div
      class="content-container"
      :class="{ 'collapsed-content': isCollapsed }"
    >
      <managerrace />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import managerslider from "@/components/zq/manager-sidebar.vue";
import managerhead from "@/components/zq/manager-head.vue";
import managerrace from "@/components/zq/manager-race.vue";

// 获取侧边栏折叠状态
const isCollapsed = ref<boolean>(true);

// 监听managerslider组件的折叠状态
const handleSidebarStateChange = (collapsed: boolean) => {
  isCollapsed.value = collapsed;
};

onMounted(() => {
  // 初始设置为收缩状态
  isCollapsed.value = true;
});
</script>

<style scoped>
.manager-container {
  display: flex;
  min-height: calc(100vh - 80px);
  margin-top: 80px;
}

.content-container {
  flex: 1;
  padding: 24px;
  margin-left: 220px; /* 展开时的宽度 */
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  max-width: calc(100vw - 220px); /* 设置最大宽度为视窗宽度减去侧边栏宽度 */
  overflow-x: hidden; /* 防止水平滚动 */
  margin-right: auto;
}

.collapsed-content {
  margin-left: 80px; /* 折叠时的宽度 */
  max-width: calc(100vw - 80px); /* 折叠时调整最大宽度 */
}
</style>