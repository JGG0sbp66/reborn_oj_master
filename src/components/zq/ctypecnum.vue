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
                        :title="getTagDescription(tag.type)"
                    >
                        <el-icon class="tag-item__icon" :size="12">
                            <User v-if="tag.type === 'individual'" />
                            <Monitor v-else-if="tag.type === 'oi'" />
                        </el-icon>
                        <span class="tag-item__text" v-if="tag.type!='pending'">{{ tag.name }}</span>
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
import { ref, onMounted } from 'vue';
import type { Ref } from 'vue';
import { Trophy, User, Clock, Monitor } from '@element-plus/icons-vue';
import axios from 'axios';

interface Tag {
    name: string;
    type: 'pending' | 'individual' | 'oi';
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

// 获取标签描述
const getTagDescription = (type: Tag['type']): string => {
    const descriptions: Record<Tag['type'], string> = {
        pending: '比赛未开始',
        individual: '个人赛',
        oi: 'OI赛制'
    };
    return descriptions[type];
};

const props = defineProps({
    raceInfo: {
        type: Object as () => RaceInfo,
        required: true
    }
});
</script>

<style scoped>
.competition-info {
    width: 100%;
    padding: 16px;
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

.tag-item:hover {
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(66, 185, 131, 0.15);
}

.tag-item__icon {
    opacity: 0.7;
}

.tag-item--pending {
    display: none;
}

.tag-item--individual {
    background-color: #ecfdf5;
    color: #10b981;
}

.tag-item--oi {
    background-color: #eff6ff;
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
</style>