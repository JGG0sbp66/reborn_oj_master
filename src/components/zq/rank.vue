<template>
    <div class="left-main">
        <table class="problems-list">
            <thead class="problems-head">
                <tr>
                    <th style="width: 120px;">排名</th>
                    <th style="width: 200px;">选手</th>
                    <th style="width: 120px;">解题数</th>
                    <th style="width: 120px;">总用时</th>
                </tr>
            </thead>
            <tbody class="problems-body">

            </tbody>
        </table>
    </div>
</template>
<script lang="ts" setup>

</script>
<style scoped>
.problems-list {
    width: 100%;
    border-collapse: collapse;
    border-spacing: 0;
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
    padding-left: 2px;
    font-size: 14px;
    font-weight: normal;
    margin-top: 10px;
    margin-bottom: 10px;
}
</style>
