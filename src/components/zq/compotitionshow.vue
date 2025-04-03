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

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'

const props = defineProps({
  raceinfoData: {
    type: Object,
    required: true
  }
});

console.log(props.raceinfoData);


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
    display: flex;
    align-items: center;
    justify-content: flex-start;
}

.status {
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 500;
}

.status-accepted {
    background-color: #ecfdf5;
    color: #10b981;
}

.status-wrong {
    background-color: #fef2f2;
    color: #ef4444;
}

.status-pending {
    background-color: #f3f4f6;
    color: #6b7280;
}

.status-default {
    background-color: #f3f4f6;
    color: #6b7280;
}

.problem-link {
    color: #1f2937;
    text-decoration: none;
    transition: color 0.2s ease;
}

.problem-link:hover {
    color: #10b981;
}
</style>
