<template>
    <managerhead />
    <div class="manager-container">
        <managerslider />
    </div>
</template>

<script setup lang="ts">
import managerslider from '@/components/zq/manager-slider.vue';
import managerhead from '@/components/zq/manager-head.vue';
</script>

<style scoped>
.manager-container {
    display: flex;
    min-height: calc(100vh - 80px);
    margin-top: 80px;
}
</style>
