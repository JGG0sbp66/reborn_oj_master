<template>
    <div class="firpanel-item">
        <div>比赛类型</div>
        <div class="competition-item-topic" style="margin-right: 0px;">

        </div>
    </div>
    <div class="firpanel-item">
        <div>参赛人数</div>
        <div class="join_people" style="margin-left: auto;"></div>
    </div>
</template>
<script lang="ts" setup>
</script>

<style scoped>
.firpanel{
    background-color: #fff;
    border-radius: 15px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    width: 328px;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 10px;
}

.firpanel-item{
    width: 296px;
    display: flex;
    margin-top: 10px;
    margin-bottom: 10px;
}

.firpanel-title{
    margin-top: 20px;
    margin-bottom: 20px;
    font-size: 18px;
}
.competition-item-topic{
    display: flex;
    margin-left: auto;
    margin-right: 15px;
}
</style>