<template>
    <div class="time">
        <div style="display: flex;flex-direction: column;align-items: center;margin-top: 3px;">
            <div class="cir not-start-border"></div>
            <div class="line"></div>
        </div>
        <div style="display: flex;flex-direction: column;margin-left: 10px;">
            <div>比赛开始时间</div>
            <div class="start_time" style="font-size: 12px;color: #767c82;margin-top: 5px;"></div>
        </div>

    </div>
    <div class="time" style="margin-top: -3px;margin-bottom: 15px;">
        <div style="display: flex;flex-direction: column;align-items: center;margin-top: 3px;">
            <div class="cir finished-border"></div>
        </div>
        <div style="display: flex;flex-direction: column;margin-left: 10px;">
            <div>比赛结束时间</div>
            <div class="end_time" style="font-size: 12px;color: #767c82;margin-top: 5px;"></div>
        </div>

    </div>
</template>

<script lang="ts" setup>

</script>

<style scoped>
.cir {
    height: 10px;
    width: 10px;
    border-radius: 50%;
}
.not-start{
    color: #18a058;
}
.finished{
    color: #d03050;
}
.not-start-border{
    border: 2px solid #18a058;
}

.finished-border{
    border: 2px solid #d03050;
}
.time{
    width: 296px;
    margin-top: 20px;
    display: flex;
}

.line{
    height: 44.5px;
    width: 2px;
    background-color: #dbdbdf;
}
</style>
