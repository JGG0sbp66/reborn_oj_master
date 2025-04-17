<template>
    <div class="competition-info">
        <ctypecnum :raceInfo="props.raceInfo" />
        <cisbegin :raceInfo="props.raceInfo" :uid="props.uid" />
        <ctime :raceInfo="props.raceInfo" />
    </div>
</template>

<script lang="ts" setup>
import { ref, reactive } from "vue";
import cisbegin from "@/components/zq/cisbegin.vue";
import ctypecnum from "@/components/zq/ctypecnum.vue";
import ctime from "@/components/zq/ctime.vue";

interface RaceInfo {
    value?: {
        race_info: {
            title: string;
            start_time: string;
            end_time: string;
            tags: Array<{ name: string; type: string }>;
            problems: any[];
            user_num: number;
            user_status: string[];
        }
    }
}

const props = defineProps({
    raceInfo: {
        type: Object,
        required: true
    },
    uid: {
        type: String,
        required: true
    }
});
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