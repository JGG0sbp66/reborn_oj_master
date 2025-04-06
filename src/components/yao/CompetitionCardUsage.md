# 竞赛卡片组件使用说明

竞赛卡片组件提供了在OJ平台上展示竞赛信息的标准化方式，支持本地数据展示和从服务器获取数据。本文档将介绍如何使用这些组件。

## 目录

1. [组件介绍](#组件介绍)
2. [基本用法](#基本用法)
3. [从数据库加载数据](#从数据库加载数据)
4. [自定义样式](#自定义样式)
5. [API参考](#api参考)

## 组件介绍

竞赛卡片系统包含两个主要组件：

- **CompetitionCard.vue**: 单个竞赛卡片组件，用于显示一个竞赛的详细信息
- **CompetitionCardLoader.vue**: 竞赛卡片列表加载器，可从服务器获取多个竞赛数据并显示

## 基本用法

### 使用本地数据的单卡片

```vue
<template>
  <CompetitionCard
    :competition="localCompetition"
    :appear="true"
    :index="0"
  />
</template>

<script setup>
import { ref } from 'vue';
import CompetitionCard from '@/components/yao/CompetitionCard.vue';

const localCompetition = {
  title: "全国高校编程马拉松",
  logos: ["ACM", "ICPC"],
  startTime: "2024-05-10 09:00:00",
  endTime: "2024-05-10 15:00:00",
  duration: "6小时",
  tags: [
    { name: "未开始", type: "running" },
    { name: "个人赛", type: "individual" },
    { name: "OI赛制", type: "oi" }
  ]
};
</script>
```

### 显示多个竞赛卡片

```vue
<template>
  <div class="competition-list">
    <CompetitionCard
      v-for="(item, index) in competitions"
      :key="index"
      :competition="item"
      :appear="true"
      :index="index"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import CompetitionCard from '@/components/yao/CompetitionCard.vue';

const competitions = [
  {
    title: "全国高校编程马拉松",
    logos: ["ACM", "ICPC"],
    startTime: "2024-05-10 09:00:00",
    endTime: "2024-05-10 15:00:00",
    duration: "6小时",
    tags: [
      { name: "未开始", type: "running" },
      { name: "个人赛", type: "individual" }
    ]
  },
  {
    title: "第五届青少年编程大赛",
    logos: ["CCF"],
    startTime: "2024-06-15 08:00:00",
    endTime: "2024-06-15 12:00:00",
    duration: "4小时",
    tags: [
      { name: "未开始", type: "running" },
      { name: "团队赛", type: "team" }
    ]
  }
];
</script>
```

## 从数据库加载数据

### 使用CompetitionCardLoader组件加载列表

```vue
<template>
  <CompetitionCardLoader
    apiUrl="http://localhost:5000/api/competitions"
    :limit="5"
    actionText="参加比赛"
    :filterOptions="{ status: 'upcoming' }"
  />
</template>

<script setup>
import CompetitionCardLoader from '@/components/yao/CompetitionCardLoader.vue';
</script>
```

### 使用CompetitionCard加载单个竞赛

```vue
<template>
  <CompetitionCard
    :competitionId="123"
    :useRemoteData="true"
    actionText="查看详情"
  />
</template>

<script setup>
import CompetitionCard from '@/components/yao/CompetitionCard.vue';
</script>
```

## 自定义样式

竞赛卡片支持通过属性自定义样式和行为：

```vue
<template>
  <CompetitionCard
    :competition="competition"
    headerClass="custom-header"
    actionText="开始挑战"
    actionLink="/contest/problems/123"
    :customTimeInfo="customTimeFormat"
  />
</template>

<script setup>
import { ref } from 'vue';
import CompetitionCard from '@/components/yao/CompetitionCard.vue';

const competition = {/* 竞赛数据 */};

const customTimeFormat = [
  { label: '开赛', key: 'startTime' },
  { label: '结束', key: 'endTime' },
  { label: '时长', key: 'duration' }
];
</script>

<style>
.custom-header {
  background: linear-gradient(to right, #3494e6, #ec6ead);
  color: white;
}
</style>
```

## API参考

### CompetitionCard 属性

| 属性 | 类型 | 默认值 | 说明 |
|------|------|------|------|
| competition | Object | - | 竞赛对象数据 |
| actionLink | String | '/contest/problems' | 卡片按钮链接 |
| actionText | String | "Let's go" | 卡片按钮文本 |
| appear | Boolean | false | 是否应用出现动画 |
| index | Number | - | 在列表中的索引，用于计算动画延迟 |
| headerClass | String | - | 卡片头部的自定义样式类 |
| customTimeInfo | Array | - | 自定义时间信息显示格式 |
| competitionId | Number | - | 从服务器获取数据时的竞赛ID |
| useRemoteData | Boolean | false | 是否使用远程数据 |

### CompetitionCardLoader 属性

| 属性 | 类型 | 默认值 | 说明 |
|------|------|------|------|
| apiUrl | String | 'http://localhost:5000/api/competitions' | API端点URL |
| limit | Number | 10 | 要获取的竞赛数量 |
| actionText | String | "Let's go" | 卡片按钮文本 |
| customActionLink | String/Function | - | 自定义按钮链接或生成链接的函数 |
| filterOptions | Object | {} | 发送到API的过滤条件 |

### 竞赛数据格式

```javascript
{
  id: 123,                          // 竞赛ID (可选)
  title: "竞赛标题",                // 标题
  logos: ["Logo1", "Logo2"],        // 标志文本数组
  startTime: "2024-05-10 09:00:00", // 开始时间
  endTime: "2024-05-10 15:00:00",   // 结束时间
  duration: "6小时",                // 比赛时长
  tags: [                           // 标签数组
    { 
      name: "标签名称",            // 标签显示名称
      type: "标签类型"             // 标签类型，影响样式
    }
  ]
}
```

### 后端API接口格式

1. 获取竞赛列表接口 (POST /api/competitions)

   **请求参数:**
   ```javascript
   {
     "limit": 10,           // 获取数量
     "page": 1,             // 页码
     "status": "upcoming",  // 状态过滤
     // 其他过滤参数...
   }
   ```

   **响应格式:**
   ```javascript
   {
     "success": true,
     "competitions": [
       // 竞赛对象数组
     ],
     "total": 100,        // 总数
     "totalPages": 10     // 总页数
   }
   ```

2. 获取单个竞赛接口 (POST /api/competition)

   **请求参数:**
   ```javascript
   {
     "id": 123            // 竞赛ID
   }
   ```

   **响应格式:**
   ```javascript
   {
     "success": true,
     "competition": {
       // 竞赛对象
     }
   }
   ```

## 示例场景

1. 首页显示最新竞赛
2. 竞赛页展示所有竞赛并支持筛选
3. 用户个人中心显示已参与的竞赛

通过灵活组合这些组件，可以实现各种竞赛展示需求。 