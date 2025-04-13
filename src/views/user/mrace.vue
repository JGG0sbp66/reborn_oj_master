<template>
    <managerhead />
    <div class="manager-container">
        <managerslider />
        <div class="content-container">
            <managerrace />
        </div>
    </div>
</template>

<script setup lang="ts">

import managerslider from '@/components/zq/manager-slider.vue';
import managerhead from '@/components/zq/manager-head.vue';
import managerrace from '@/components/zq/manager-race.vue';



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
