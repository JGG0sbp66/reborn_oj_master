<template>
    <div class="chart-container">
        <div class="chart-header">
            <h3 class="chart-title">用户活跃度统计</h3>
            <div class="chart-actions">
                <el-select v-model="selectedRange" placeholder="时间范围" size="small" @change="handleRangeChange">
                    <el-option label="最近7天" value="7days" />
                    <el-option label="最近30天" value="30days" />
                    <el-option label="最近90天" value="90days" />
                </el-select>
            </div>
        </div>
        <div class="chart-content">
            <div class="chart-placeholder">
                <div class="chart-bars">
                    <div v-for="(item, index) in currentActivityData" :key="index" class="chart-bar-item">
                        <div class="chart-bar" :style="{ height: `${item.value}%` }">
                            <div class="chart-bar-value">{{ item.value }}%</div>
                        </div>
                        <div class="chart-bar-label">{{ item.day }}</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

// 选中的时间范围
const selectedRange = ref('7days');

// 7天数据
const sevenDaysData = [
    { day: '周一', value: 65 },
    { day: '周二', value: 59 },
    { day: '周三', value: 80 },
    { day: '周四', value: 81 },
    { day: '周五', value: 56 },
    { day: '周六', value: 55 },
    { day: '周日', value: 40 }
];

// 30天数据
const thirtyDaysData = [
    { day: '第1周', value: 75 },
    { day: '第2周', value: 62 },
    { day: '第3周', value: 85 },
    { day: '第4周', value: 70 },
    { day: '第5周', value: 58 }
];

// 90天数据
const ninetyDaysData = [
    { day: '1月', value: 68 },
    { day: '2月', value: 72 },
    { day: '3月', value: 85 }
];

// 根据选择的时间范围返回对应的数据
const currentActivityData = computed(() => {
    switch (selectedRange.value) {
        case '30days':
            return thirtyDaysData;
        case '90days':
            return ninetyDaysData;
        default:
            return sevenDaysData;
    }
});

// 处理时间范围变化
const handleRangeChange = (value: string) => {
    selectedRange.value = value;
};
</script>

<style scoped>
.chart-container {
    background: white;
    border-radius: 12px;
    padding: 20px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
}

.chart-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
}

.chart-title {
    font-size: 16px;
    font-weight: 600;
    color: #2c3e50;
    margin: 0;
}

.chart-content {
    height: 300px;
}

.chart-placeholder {
    height: 100%;
    display: flex;
    align-items: flex-end;
    padding-top: 20px;
}

.chart-bars {
    display: flex;
    width: 100%;
    height: 100%;
    align-items: flex-end;
    justify-content: space-around;
    padding: 0 20px;
}

.chart-bar-item {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 100%;
    margin: 0 10px;
}

.chart-bar {
    width: 40px;
    background: linear-gradient(to top, #42b983, #33c6aa);
    border-radius: 4px 4px 0 0;
    transition: all 0.5s ease;
    position: relative;
    display: flex;
    justify-content: center;
}

.chart-bar-value {
    position: absolute;
    top: -25px;
    font-size: 12px;
    color: #606266;
}

.chart-bar-label {
    margin-top: 8px;
    font-size: 12px;
    color: #5c6c7c;
}

.chart-bar:hover {
    filter: brightness(1.1);
    transform: scaleY(1.02);
}
</style>
