<template>
    <div class="competition-info">
        <div class="info-card">
            <div class="info-item">
                <div class="info-item__header">
                    <span class="info-item__icon">
                        <el-icon><Trophy /></el-icon>
                    </span>
                    <span class="info-item__label">比赛类型</span>
                </div>
                <div class="info-item__content competition-tags">
                    <div 
                        v-for="(tag, index) in props.raceInfo?.value?.race_info.tags" 
                        :key="index" 
                        class="tag-item"
                        :class="[`tag-item--${tag.type}`, tag.type]"
                    >
                        <el-icon class="tag-item__icon" :size="12">
                            <User v-if="tag.type === 'individual'" />
                            <Monitor v-else-if="['oi', 'acm', 'ioi'].includes(tag.type)" />
                            <Trophy v-else-if="tag.type === 'team'" />
                            <Clock v-else-if="tag.type === 'innovation'" />
                            <DataAnalysis v-else-if="tag.type === 'ai'" />
                            <Operation v-else-if="tag.type === 'algorithm'" />
                            <Connection v-else-if="tag.type === 'iot'" />
                            <Timer v-else />
                        </el-icon>
                        <span class="tag-item__text" v-if="!['pending', 'started', 'ended', 'registration', 'ongoing'].includes(tag.type)">{{ tag.name }}</span>
                        <span class="tag-item__text" v-else>
                            <template v-if="tag.type === 'started'">已开始</template>
                            <template v-else-if="tag.type === 'ended'">已结束</template>
                            <template v-else-if="tag.type === 'registration'">报名中</template>
                            <template v-else-if="tag.type === 'ongoing'">进行中</template>
                            <template v-else-if="tag.type === 'pending'">未开始</template>
                            <template v-else>{{ tag.name }}</template>
                        </span>
                    </div>
                </div>
            </div>

            <div class="info-divider"></div>

            <div class="info-item">
                <div class="info-item__header">
                    <span class="info-item__icon">
                        <el-icon><User /></el-icon>
                    </span>
                    <span class="info-item__label">参赛人数</span>
                </div>
                <div class="info-item__content">
                    <div class="participants-count">
                        <span class="participants-count__number">{{ props.raceInfo?.value?.race_info.user_num }}</span>
                        <span class="participants-count__unit">人</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import type { Ref } from 'vue';
import { Trophy, User, Clock, Monitor, DataAnalysis, Operation, Timer, Connection } from '@element-plus/icons-vue';
import axios from 'axios';

interface Tag {
    name: string;
    type: string;
}

interface RaceInfo {
    value?: {
        race_info: {
            title: string;
            start_time: string;
            end_time: string;
            tags: Tag[];
            user_num: number;
            user_status: string[];
            problems: any[];
        }
    }
}

interface TagStyleMap {
    [key: string]: {
        bg: string;
        text: string;
    }
}

const props = defineProps({
    raceInfo: {
        type: Object as () => RaceInfo,
        required: true
    }
});

// 预定义的颜色 - 移除灰色系
const backgrounds = [
    '#e9d5ff', '#bfdbfe', '#bbf7d0', '#fef08a', 
    '#fed7aa', '#fecaca', '#f0fdfa', '#fce7f3',
    '#dbeafe', '#e0f2fe', '#ede9fe', '#ffedd5',
    '#dcfce7', '#d8b4fe', '#c7d2fe', '#fef3c7'
];

const textColors = [
    '#9333ea', '#3b82f6', '#22c55e', '#eab308', 
    '#f97316', '#ef4444', '#14b8a6', '#ec4899',
    '#2563eb', '#0ea5e9', '#8b5cf6', '#f97316',
    '#16a34a', '#9333ea', '#4f46e5', '#ca8a04'
];

// 已知标签类型列表
const knownTypes = [
    'pending', 'individual', 'oi', 'acm', 'ioi', 
    'team', 'innovation', 'ai', 'algorithm', 
    'started', 'ended', 'registration', 'ongoing'
];

// 从本地存储获取已保存的样式
const getSavedStyles = (): TagStyleMap => {
    const savedStyles = localStorage.getItem('tag-styles');
    return savedStyles ? JSON.parse(savedStyles) : {};
};

// 保存样式到本地存储
const saveStyles = (styles: TagStyleMap): void => {
    localStorage.setItem('tag-styles', JSON.stringify(styles));
};

// 随机获取索引
const getRandomIndex = (): number => Math.floor(Math.random() * backgrounds.length);

// 生成随机样式
const generateRandomStyle = (tagType: string, savedStyles: TagStyleMap): string => {
    // 如果已经存在样式，则使用保存的样式
    if (savedStyles[tagType]) {
        const style = savedStyles[tagType];
        return `
            .tag-item--${tagType} {
                background-color: ${style.bg};
                color: ${style.text};
            }
        `;
    }
    
    // 否则生成新样式并保存
    const index = getRandomIndex();
    const newStyle = {
        bg: backgrounds[index],
        text: textColors[index]
    };
    
    savedStyles[tagType] = newStyle;
    saveStyles(savedStyles);
    
    return `
        .tag-item--${tagType} {
            background-color: ${newStyle.bg};
            color: ${newStyle.text};
        }
    `;
};

// 生成自定义标签样式并添加到DOM
const generateTagStyles = () => {
    if (!props.raceInfo?.value?.race_info?.tags) return;
    
    let styleEl = document.getElementById('dynamic-tag-styles');
    if (!styleEl) {
        styleEl = document.createElement('style');
        styleEl.setAttribute('id', 'dynamic-tag-styles');
        document.head.appendChild(styleEl);
    }
    
    let cssText = '';
    const savedStyles = getSavedStyles();
    
    // 添加'iot'类型的预设样式
    if (!savedStyles['iot']) {
        savedStyles['iot'] = {
            bg: '#d1fae5',
            text: '#059669'
        };
        saveStyles(savedStyles);
    }
    
    // 添加'tourism'(旅游)类型的预设样式
    if (!savedStyles['tourism']) {
        savedStyles['tourism'] = {
            bg: '#dbeafe',
            text: '#3b82f6'
        };
        saveStyles(savedStyles);
    }
    
    // 清除本地存储中可能存在的灰色样式
    Object.keys(savedStyles).forEach(key => {
        const style = savedStyles[key];
        // 检测灰色相关色值并替换
        if (style.bg === '#d1d5db' || style.bg === '#f3f4f6' || style.bg === '#f1f5f9' || 
            style.text === '#4b5563' || style.text === '#6b7280' || style.text === '#64748b') {
            // 替换为蓝色系
            savedStyles[key] = {
                bg: '#dbeafe',
                text: '#3b82f6'
            };
        }
    });
    saveStyles(savedStyles);
    
    // 为每个标签生成样式
    props.raceInfo.value.race_info.tags.forEach((tag: Tag) => {
        if (tag && tag.type && tag.type.trim() !== '') {
            // 如果不是已知类型或还没有样式，生成一个新样式
            if (!knownTypes.includes(tag.type)) {
                cssText += generateRandomStyle(tag.type, savedStyles);
            }
        }
    });
    
    // 最后应用所有样式
    styleEl.textContent = cssText;
};

// 在组件挂载时生成样式
onMounted(() => {
    generateTagStyles();
});

// 监听props变化，当标签数据更新时重新生成样式
watch(
    () => props.raceInfo?.value?.race_info?.tags,
    (newVal: Tag[] | undefined) => {
        if (newVal) {
            setTimeout(() => {
                generateTagStyles();
            }, 0);
        }
    },
    { deep: true }
);
</script>

<style>
/* 全局样式确保被正确应用 */
.tag-item {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 6px 10px;
    border-radius: 6px;
    font-size: 13px;
    font-weight: 500;
    transition: all 0.2s ease;
}

/* 确保所有标签类型都有默认样式 - 不使用灰色 */
[class^="tag-item--"] {
    background-color: #e0f2fe;
    color: #0ea5e9;
}
</style>

<style scoped>
.competition-info {
    width: 100%;
    padding: 0 16px 16px 16px;
}

.info-card {
    background: #ffffff;
    border-radius: 12px;
    box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
    padding: 20px;
    display: flex;
    gap: 20px;
    transition: all 0.3s ease;
}

.info-card:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(66, 185, 131, 0.15);
}

.info-item {
    flex: 1;
}

.info-item__header {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 12px;
}

.info-item__icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    border-radius: 8px;
    background: linear-gradient(135deg, #ecfdf5 0%, #eff6ff 100%);
    color: #42b983;
}

.info-item__label {
    font-size: 14px;
    font-weight: 500;
    color: #374151;
}

.info-divider {
    width: 1px;
    background: linear-gradient(to bottom, transparent, #e5e7eb, transparent);
}

.competition-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
}

.tag-item:hover {
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(66, 185, 131, 0.15);
}

.tag-item__icon {
    opacity: 0.7;
}

.tag-item--pending {
    background-color: #c7d2fe;
    color: #4f46e5;
}

.tag-item--individual {
    background-color: #ecfdf5;
    color: #10b981;
}

.tag-item--oi {
    background-color: #eff6ff;
    color: #3b82f6;
}

.tag-item--acm {
    background-color: #eef2ff;
    color: #6366f1;
}

.tag-item--ioi {
    background-color: #f0fdfa;
    color: #14b8a6;
}

.tag-item--team {
    background-color: #fef3c7;
    color: #f59e0b;
}

.tag-item--innovation {
    background-color: #f3e8ff;
    color: #9333ea;
}

.tag-item--ai {
    background-color: #e0f2fe;
    color: #0ea5e9;
}

.tag-item--algorithm {
    background-color: #fce7f3;
    color: #ec4899;
}

/* 状态标签样式 */
.tag-item--started {
    background-color: #dcfce7;
    color: #22c55e;
}

.tag-item--ended {
    background-color: #fef3c7;
    color: #ca8a04;
}

.tag-item--registration {
    background-color: #ffedd5;
    color: #f97316;
}

.tag-item--ongoing {
    background-color: #dbeafe;
    color: #3b82f6;
}

.participants-count {
    display: inline-flex;
    align-items: baseline;
    padding: 8px 16px;
    background: linear-gradient(135deg, #ecfdf5 0%, #eff6ff 100%);
    border-radius: 8px;
    transition: all 0.3s ease;
}

.participants-count:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(66, 185, 131, 0.15);
}

.participants-count__number {
    font-size: 24px;
    font-weight: 600;
    background: linear-gradient(135deg, #42b983 0%, #3b82f6 100%);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    margin-right: 4px;
}

.participants-count__unit {
    font-size: 14px;
    color: #6b7280;
}

@media (max-width: 768px) {
    .info-card {
        flex-direction: column;
        gap: 16px;
        padding: 16px;
    }

    .info-divider {
        width: 100%;
        height: 1px;
    }

    .participants-count__number {
        font-size: 20px;
    }

    .participants-count__unit {
        font-size: 12px;
    }

    .tag-item {
        padding: 4px 8px;
        font-size: 12px;
    }
}

@media (max-width: 480px) {
    .competition-info {
        padding: 12px;
    }

    .info-card {
        padding: 12px;
    }
}

/* 添加旅游数据标签样式 */
.tag-item--tourism {
    background-color: #dbeafe;
    color: #3b82f6;
}
</style>