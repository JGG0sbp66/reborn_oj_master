<template>
    <div class="right-main">
        <div class="firpanel">
            <ctypecnum />
        </div>
        <div id="panel-state" class="firpanel">
            <cisbegin />
        </div>
        <div class="firpanel">
            <ctime />
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref, reactive } from "vue";
import cisbegin from "@/components/zq/cisbegin.vue";
import ctypecnum from "@/components/zq/ctypecnum.vue";
import ctime from "@/components/zq/ctime.vue";
</script>

<style scoped>
.right-main {
    max-width: 328px;
    margin-left: 10px;
    font-size: 14px;
}

.firpanel {
    background-color: #fff;
    border-radius: 15px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    width: 328px;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 10px;
}
</style>