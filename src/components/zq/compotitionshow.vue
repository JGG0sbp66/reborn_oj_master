<template>
    <table class="problems-list">
        <thead class="problems-head">
            <tr>
                <th style="width: 100px;">状态</th>
                <th style="width: 225px;text-align: left;">题目</th>
                <th style="width: 250px;">一血</th>
                <th style="width: 120px;text-align: left;">提交/解决</th>
                <th style="width: 120px;text-align: left;">通过率</th>
            </tr>
        </thead>
        <tbody class="problems-body">

        </tbody>
    </table>
</template>

<script lang="ts" setup>
import { ref, reactive } from "vue";
import axios from 'axios';


</script>

<style scoped>
.left-main {
    max-width: 860px;
}

.problems-list {
    width: 100%;
    border-collapse: collapse;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    border-radius: 15px;
    overflow: hidden;
}

.problems-list tr {
    height: 61px;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    border-bottom: 1px solid rgb(239, 239, 245);
}

.problems-head {
    font-size: 14px;
    background-color: #fafafc;
}

.problems-head th {
    font-weight: normal;
    margin-top: 8px;
    margin-bottom: 8px;
}

.problems-body {
    background-color: white;
}

.problems-body td {
    font-size: 14px;
    font-weight: normal;
    margin-top: 10px;
    margin-bottom: 10px;
}
</style>
