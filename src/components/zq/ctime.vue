<template>
    <div class="competition-time">
        <div class="time-card">
            <div class="time-line">
                <div class="time-point">
                    <div class="time-point__icon time-point__icon--start">
                        <el-icon><Timer /></el-icon>
                    </div>
                </div>
                <div class="time-content">
                    <div class="time-content__label">比赛开始时间</div>
                    <div class="time-content__value">{{ raceinfoData.start_time }}</div>
                </div>
            </div>

            <div class="time-line">
                <div class="time-point">
                    <div class="time-point__icon time-point__icon--end">
                        <el-icon><CircleClose /></el-icon>
                    </div>
                </div>
                <div class="time-content">
                    <div class="time-content__label">比赛结束时间</div>
                    <div class="time-content__value">{{ raceinfoData.end_time }}</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { Timer, CircleClose } from '@element-plus/icons-vue';
import axios from 'axios';


const defaultUid = 1;
const raceinfoData = ref<RaceInfo>({
    title: '',
    start_time: '',
    end_time: '',
    tags: [],
    problems: [],
    user_status: [],
    user_num: 0
});

onMounted(async () => {
    try {
        const response = await axios({
            url: 'http://127.0.0.1:5000/api/race-info',
            method: 'post',
            data: { uid: defaultUid }
        });

        console.log(response.data);

        const raceInfo = response.data.race_info;
        raceinfoData.value = {
            title: raceInfo.title,
            start_time: raceInfo.start_time,
            end_time: raceInfo.end_time,
            tags: raceInfo.tags,
            problems: raceInfo.problems,
            user_num: raceInfo.user_num,
            user_status: raceInfo.user_status
        };
        console.log('比赛信息已更新:', raceinfoData.value);
    } catch (error) {
        console.error('请求失败:', error);
    }
});

</script>

<style scoped>
.competition-time {
    width: 100%;
    padding: 16px;
}

.time-card {
    background: #ffffff;
    border-radius: 12px;
    box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
    padding: 20px;
    transition: all 0.3s ease;
}

.time-card:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(66, 185, 131, 0.15);
}

.time-line {
    display: flex;
    align-items: flex-start;
    gap: 16px;
    position: relative;
    padding: 16px 0;
}

.time-line:first-child {
    padding-top: 8px;
}

.time-line:last-child {
    padding-bottom: 8px;
}

.time-point {
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    z-index: 2;
}

.time-point__icon {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    transition: all 0.3s ease;
    font-size: 18px;
}

.time-point__icon--start {
    background: linear-gradient(135deg, #42b983 0%, #36ad6a 100%);
    box-shadow: 0 4px 12px rgba(66, 185, 131, 0.25);
}

.time-point__icon--start:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(66, 185, 131, 0.35);
}

.time-point__icon--end {
    background: linear-gradient(135deg, #f43f5e 0%, #e11d48 100%);
    box-shadow: 0 4px 12px rgba(244, 63, 94, 0.25);
}

.time-point__icon--end:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(244, 63, 94, 0.35);
}

.time-line:first-child::after {
    content: '';
    position: absolute;
    left: 33px;
    top: 60px;
    width: 2px;
    height: calc(100% - 60px);
    background: linear-gradient(to bottom, #42b983 0%, #f43f5e 100%);
    opacity: 0.2;
    z-index: 1;
}

.time-content {
    flex: 1;
    padding-top: 6px;
}

.time-content__label {
    font-size: 14px;
    font-weight: 500;
    color: #374151;
    margin-bottom: 8px;
}

.time-content__value {
    font-size: 16px;
    font-weight: 600;
    letter-spacing: 0.5px;
    background: linear-gradient(135deg, #42b983 0%, #36ad6a 100%);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
}

.time-line:last-child .time-content__value {
    background: linear-gradient(135deg, #f43f5e 0%, #e11d48 100%);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
}

@media (max-width: 768px) {
    .time-line {
        padding: 12px 0;
        gap: 12px;
    }

    .time-point__icon {
        width: 32px;
        height: 32px;
        font-size: 16px;
    }

    .time-line:first-child::after {
        left: 31px;
        top: 52px;
    }

    .time-content__label {
        font-size: 13px;
        margin-bottom: 6px;
    }

    .time-content__value {
        font-size: 15px;
    }
}

@media (max-width: 480px) {
    .time-line {
        padding: 10px 0;
        gap: 10px;
    }

    .time-point__icon {
        width: 28px;
        height: 28px;
        font-size: 14px;
    }

    .time-line:first-child::after {
        left: 29px;
        top: 46px;
    }
}
</style>
