# 竞赛卡片组件 (CompetitionCard) 使用指南

## 基本用法

```vue
<template>
  <CompetitionCard :competition="competitionData" />
</template>

<script setup>
import CompetitionCard from '@/components/yao/CompetitionCard.vue';

const competitionData = {
  title: '全国大学生程序设计竞赛',
  logos: ['ICPC', 'ACM'],
  startTime: '2023-10-01 09:00',
  endTime: '2023-10-01 14:00',
  duration: '5小时',
  tags: [
    { name: '进行中', type: 'running' },
    { name: '个人赛', type: 'individual' }
  ]
};
</script>
```

## 自定义内容

通过使用插槽可以自定义卡片的各个部分：

```vue
<template>
  <CompetitionCard 
    :competition="competitionData"
    action-link="/special-contest"
    action-text="立即报名"
    :appear="true"
    :index="0"
    header-class="special-header"
  >
    <!-- 自定义标题 -->
    <template #title>
      <div class="custom-title">
        <i class="icon-trophy"></i>
        {{ competitionData.title }}
      </div>
    </template>
    
    <!-- 自定义标签 -->
    <template #tags>
      <div class="custom-tags">
        <el-tag v-for="tag in competitionData.tags" :key="tag.name" 
                :type="tag.type === 'running' ? 'success' : 'info'">
          {{ tag.name }}
        </el-tag>
      </div>
    </template>
    
    <!-- 自定义按钮 -->
    <template #button>
      <el-button type="primary" size="large" icon="el-icon-right">
        开始比赛
      </el-button>
    </template>
    
    <!-- 添加脚注 -->
    <template #footer>
      <div class="card-footer">
        <p>主办方：{{ competitionData.organizer }}</p>
        <p>报名截止：{{ competitionData.deadline }}</p>
      </div>
    </template>
  </CompetitionCard>
</template>
```

## 自定义时间信息

```vue
<template>
  <CompetitionCard 
    :competition="competitionData"
    :custom-time-info="customTimeInfo"
  />
</template>

<script setup>
import CompetitionCard from '@/components/yao/CompetitionCard.vue';

const competitionData = {
  title: '算法挑战赛',
  logos: ['ALGO'],
  startTime: '2023-11-15 10:00',
  endTime: '2023-11-15 16:00',
  duration: '6小时',
  registrationDeadline: '2023-11-10 23:59',
  participantsCount: '256人',
  tags: [
    { name: '即将开始', type: 'running' },
    { name: '团队赛', type: 'individual' }
  ]
};

// 自定义时间信息字段
const customTimeInfo = [
  { label: '比赛开始', key: 'startTime' },
  { label: '比赛结束', key: 'endTime' },
  { label: '报名截止', key: 'registrationDeadline' },
  { label: '参赛人数', key: 'participantsCount' }
];
</script>
```

## 完全自定义布局

```vue
<template>
  <CompetitionCard :competition="competitionData">
    <!-- 完全自定义内容区域 -->
    <template #time-info>
      <div class="custom-info-section">
        <div class="countdown">
          <div class="countdown-title">距离开始还有</div>
          <div class="countdown-timer">{{ countdownTime }}</div>
        </div>
        
        <el-progress :percentage="registrationProgress" />
        
        <div class="stats">
          <div class="stat-item">
            <div class="stat-value">{{ competitionData.participantsCount }}</div>
            <div class="stat-label">已报名</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">{{ competitionData.maxParticipants }}</div>
            <div class="stat-label">名额总数</div>
          </div>
        </div>
      </div>
    </template>
    
    <!-- 添加额外的头部内容 -->
    <template #header-extra>
      <div class="competition-description">
        {{ competitionData.description }}
      </div>
    </template>
  </CompetitionCard>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import CompetitionCard from '@/components/yao/CompetitionCard.vue';

const competitionData = {
  // ... 基本数据
  description: '这是一个高难度的算法挑战赛，专为有经验的参赛者设计。',
  participantsCount: 180,
  maxParticipants: 200
};

// 计算报名进度
const registrationProgress = computed(() => {
  return (competitionData.participantsCount / competitionData.maxParticipants) * 100;
});

// 倒计时逻辑
const countdownTime = ref('00:00:00');
let timer = null;

const updateCountdown = () => {
  const now = new Date();
  const startTime = new Date(competitionData.startTime);
  const diff = startTime - now;
  
  if (diff <= 0) {
    countdownTime.value = '已开始';
    clearInterval(timer);
    return;
  }
  
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);
  
  countdownTime.value = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

onMounted(() => {
  updateCountdown();
  timer = setInterval(updateCountdown, 1000);
});

onUnmounted(() => {
  clearInterval(timer);
});
</script>

<style scoped>
.custom-info-section {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.countdown {
  text-align: center;
}

.countdown-title {
  font-size: 14px;
  color: #666;
  margin-bottom: 5px;
}

.countdown-timer {
  font-size: 24px;
  font-weight: bold;
  color: #42b983;
}

.stats {
  display: flex;
  justify-content: space-around;
  margin-top: 10px;
}

.stat-item {
  text-align: center;
}

.stat-value {
  font-size: 18px;
  font-weight: bold;
  color: #333;
}

.stat-label {
  font-size: 12px;
  color: #666;
}

.competition-description {
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px dashed #eee;
  font-size: 14px;
  color: #666;
  line-height: 1.5;
}
</style>
```

## 可用的插槽

组件提供以下插槽用于自定义内容：

| 插槽名 | 描述 |
|--------|------|
| `title` | 自定义卡片标题 |
| `logos` | 自定义Logo区域 |
| `header-extra` | 标题下方的额外内容 |
| `time-info` | 自定义时间信息区域 |
| `tags` | 自定义标签区域 |
| `left-extra` | 左侧区域底部的额外内容 |
| `action` | 整个右侧动作区域 |
| `button` | 仅自定义按钮部分 |
| `footer` | 卡片底部额外内容 |

## 可配置的Props

| Prop名 | 类型 | 默认值 | 描述 |
|--------|------|--------|------|
| `competition` | `Object` | 必填 | 竞赛数据对象 |
| `actionLink` | `String` | `/contest/problems` | 按钮链接地址 |
| `actionText` | `String` | `Let's go` | 按钮文本 |
| `appear` | `Boolean` | `false` | 是否启用出现动画 |
| `index` | `Number` | - | 用于计算动画延迟的索引 |
| `headerClass` | `String` | - | 应用于标题区域的额外CSS类 |
| `customTimeInfo` | `Array` | - | 自定义时间信息配置 | 