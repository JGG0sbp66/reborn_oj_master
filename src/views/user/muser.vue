<template>
  <managerhead />
  <div class="manager-container">
    <managerslider @sidebar-state-change="handleSidebarStateChange" />
    <div class="content-container" :class="{ 'collapsed-content': isCollapsed }">
      <manageruser />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import managerslider from '@/components/zq/manager-sidebar.vue';
import managerhead from '@/components/zq/manager-head.vue';
import manageruser from '@/components/zq/manager-user.vue';
import { useRouter, useRoute } from 'vue-router';
import { checkAuth } from '@/utils/auth';

const router = useRouter();
const route = useRoute();

const verifyAuth = async () => {
    const { authenticated } = await checkAuth();
    if (!authenticated) {
        router.push({
            path: '/account/login',
            query: { redirect: route.fullPath }
        });
    }
};
verifyAuth();
// 获取侧边栏折叠状态
let isCollapsed = ref(true);
defineExpose({ isCollapsed });
const handleSidebarStateChange = (collapsed: boolean) => {
    isCollapsed.value = collapsed;
};
onMounted(() => {
    isCollapsed.value = true;
});

const handleCurrentChange = async (page: number) => {
  // 只允许合法页码
  if (typeof page !== 'number' || page < 1 || page > totalPages.value || page === currentPage.value) {
    return;
  }
  currentPage.value = page;
  // ...后续逻辑不变
  // 优先从缓存取
  if (pageDataCache.value[page]) {
    competitions.value = pageDataCache.value[page];
    // 预取下一页
    const nextPage = page + 1;
    if (!pageDataCache.value[nextPage]) {
      loading.value = true;
      try {
        const nextRes = await fetchUsers(nextPage);
        const nextUsers = nextRes?.users || nextRes?.data?.users || [];
        const nextFormatted = formatUserData(nextUsers);
        nextPageCache.value = nextFormatted;
        pageDataCache.value[nextPage] = nextFormatted;
      } catch (e) {
        nextPageCache.value = [];
      } finally {
        loading.value = false;
      }
    } else {
      nextPageCache.value = pageDataCache.value[nextPage];
    }
  } else {
    // 其他页正常请求
    await fetchData(page === 1); // 如果是第一页，预取第二页
  }
};
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
}
</style>
