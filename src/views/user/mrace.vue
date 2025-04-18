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
import { useRouter, useRoute } from 'vue-router';
import managerslider from '@/components/zq/manager-sidebar.vue';
import managerhead from '@/components/zq/manager-head.vue';
import managerrace from '@/components/zq/manager-race.vue';
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
