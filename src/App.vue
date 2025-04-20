<template>
    <!-- 通过路由来渲染所有的页面组件 -->
    <router-view />
    <!-- 自定义光标组件 -->
    <CustomCursor />
</template>

<script setup lang="ts">
import CustomCursor from './components/common/CustomCursor.vue';
</script>

<style>
/* 全局滚动条样式 */
::-webkit-scrollbar {
  width: 0;  /* 滚动条宽度 */
  height: 0; /* 横向滚动条高度 */
  display: none; /* 完全隐藏滚动条 */
}

/* 兼容Firefox */
* {
  scrollbar-width: none;
}

/* 兼容IE */
* {
  -ms-overflow-style: none;
}

* {
  font-family: 'Microsoft YaHei', sans-serif;
}
</style>