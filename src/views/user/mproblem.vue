<template>
    <managerhead />
    <div class="manager-container">
        <managerslider />
        <div class="content-container">
            <managerproblem />
        </div>
    </div>
</template>

<script setup lang="ts">
import managerhead from '@/components/zq/manager-head.vue';
import managerslider from '@/components/zq/manager-sidebar.vue';
import managerproblem from '@/components/zq/manager-problem.vue';
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
    margin-left: 220px;
    transition: all 0.3s;
}
</style>