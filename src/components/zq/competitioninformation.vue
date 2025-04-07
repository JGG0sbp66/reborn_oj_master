<template>
    <div class="competition-info">
        <ctypecnum />
        <cisbegin />
        <ctime />
    </div>
</template>

<script lang="ts" setup>
import { ref, reactive } from "vue";
import cisbegin from "@/components/zq/cisbegin.vue";
import ctypecnum from "@/components/zq/ctypecnum.vue";
import ctime from "@/components/zq/ctime.vue";
</script>

<style scoped>
.competition-info {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.firpanel {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 15px 0;
}
</style>