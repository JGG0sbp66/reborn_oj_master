<template>
  <div class="competition-item" :class="[{ appear }, getStatusClass()]" :style="animationStyle">
    <div class="competition-header" :class="headerClass">
      <div class="title-line">
        <!-- 标题插槽 -->
        <slot name="title">
          <div class="competition-title" v-if="mergedCompetition">{{ mergedCompetition.title }}</div>
        </slot>
        <!-- Logo插槽 -->
        <slot name="logos">
          <div class="competition-logos" v-if="mergedCompetition">
            <div class="logo-placeholder" v-for="(logo, i) in mergedCompetition.logos" :key="i">{{ logo }}</div>
          </div>
        </slot>
      </div>
      <!-- 标题下方的额外内容插槽 -->
      <slot name="header-extra"></slot>
    </div>
    <div class="competition-content">
      <div class="left-section">
        <!-- 时间信息插槽 -->
        <slot name="time-info">
          <div class="time-info">
            <div class="time-row" v-for="(item, index) in timeInfoItems" :key="index">
              <div class="time-label">{{ item.label }}:</div>
              <div class="time-value">{{ getTimeValue(item.key) }}</div>
            </div>
          </div>
        </slot>
        <!-- 标签插槽 -->
        <slot name="tags">
          <div class="competition-tags" v-if="mergedCompetition">
            <span 
              v-for="(tag, i) in mergedCompetition.tags" 
              :key="i" 
              class="tag" 
              :class="getTagClass(tag.type)"
              :style="getTagStyle(tag)"
            >{{ tag.name }}</span>
          </div>
        </slot>
        <!-- 左侧区域额外内容插槽 -->
        <slot name="left-extra"></slot>
      </div>
      <!-- 右侧动作区域插槽 -->
      <slot name="action">
        <div class="action-section">
          <router-link :to="actionLink" class="router-link-no-underline" target="_blank">
            <slot name="button">
              <button class="lets-go-btn">
                <span>{{ actionText }}</span>
                <i class="btn-arrow">→</i>
              </button>
            </slot>
          </router-link>
        </div>
      </slot>
    </div>
    <!-- 卡片底部额外内容插槽 -->
    <slot name="footer"></slot>
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps, onMounted, computed, watch } from 'vue';
import axios from 'axios';

// 定义竞赛对象类型
interface Tag {
  name: string;
  type: string;
}

interface Competition {
  title: string;
  logos: string[];
  startTime: string;
  endTime: string;
  duration: string;
  tags: Tag[];
  status?: string; // 新增：竞赛状态
  [key: string]: any; // 允许添加任意其他属性
}

// 组件属性
const props = defineProps<{
  competition?: Competition;
  actionLink?: string;
  actionText?: string;
  appear?: boolean;
  index?: number;
  headerClass?: string;
  customTimeInfo?: Array<{label: string, key: string}>;
  competitionId?: number; // 新增：接收竞赛ID属性
  useRemoteData?: boolean; // 新增：是否使用远程数据
}>();

// 提供默认值
const actionText = props.actionText || "Let's go";

// 存储从服务器获取的竞赛数据
const competitionData = ref<Competition | null>(null);

// 合并的竞赛数据(本地props或远程获取)
const mergedCompetition = computed(() => {
  if (props.useRemoteData && competitionData.value) {
    return competitionData.value;
  }
  return props.competition;
});

// 修改：将actionLink从默认值变为计算属性
const actionLink = computed(() => {
  if (props.actionLink) {
    return props.actionLink;
  }
  // 如果存在race_uid或uid，则使用它构建链接
  const uid = mergedCompetition.value?.race_uid || mergedCompetition.value?.uid;
  return uid ? `/contest/problems?uid=${uid}` : '/contest/problems';
});

// 时间信息项目配置
const defaultTimeInfoItems = [
  { label: '开始时间', key: 'startTime' },
  { label: '结束时间', key: 'endTime' },
  { label: '比赛时长', key: 'duration' }
];

const timeInfoItems = computed(() => props.customTimeInfo || defaultTimeInfoItems);

// 获取时间值的函数
const getTimeValue = (key: string) => {
  if (!mergedCompetition.value) return '';
  return mergedCompetition.value[key] || '';
};

// 处理标签类型的函数
const getTagClass = (type: string) => {
  // 定义所有已知的标签类型
  const validTypes = ['running', 'individual', 'oi', 'regional'];
  
  // 如果是已知类型，返回该类型名称作为类名
  // 如果是未知类型，返回'unknown'类名，会使用默认样式
  return validTypes.includes(type) ? type : 'unknown';
};

// 生成标签的动态样式 - 基于标签名称生成一致的颜色
const getTagStyle = (tag: Tag) => {
  // 如果是已知类型，不需要特殊样式
  if (['running', 'individual', 'oi', 'regional'].includes(tag.type)) {
    return {};
  }
  
  // 基于标签名称生成哈希值作为颜色基础
  const nameHash = tag.name.split('').reduce((acc, char) => {
    return acc + char.charCodeAt(0);
  }, 0);
  
  // 选择预定义的柔和颜色方案
  const colorSchemes = [
    { bg: '#E8F4F8', text: '#2980b9' }, // 蓝色系
    { bg: '#F8F4E8', text: '#E67E22' }, // 橙色系
    { bg: '#F4E8F8', text: '#8E44AD' }, // 紫色系
    { bg: '#E8F8F4', text: '#27AE60' }, // 绿色系
    { bg: '#F8E8E8', text: '#C0392B' }, // 红色系
    { bg: '#F4F8E8', text: '#16A085' }  // 青绿色系
  ];
  
  // 使用哈希值选择颜色方案，确保同名标签颜色一致
  const colorIndex = nameHash % colorSchemes.length;
  const colors = colorSchemes[colorIndex];
  
  return {
    backgroundColor: colors.bg,
    color: colors.text,
    borderColor: colors.text + '33' // 添加透明度33 (20%)
  };
};

// 计算动画样式，基于索引添加延迟
const animationStyle = computed(() => {
  if (props.index !== undefined) {
    return {
      transitionDelay: `${Math.min(0.05 * props.index, 0.25)}s`
    };
  }
  return {};
});

// 获取单个竞赛数据的函数
const fetchCompetitionData = async () => {
  if (!props.competitionId || !props.useRemoteData) return;
  
  try {
    const { data } = await axios({
      url: 'http://localhost:5000/api/competition',
      method: 'post',
      data: { 
        id: props.competitionId 
      }
    });
    competitionData.value = data.competition;
    console.log('获取到竞赛数据:', data.competition);
  } catch (error) {
    console.error('获取竞赛数据失败:', error);
  }
};

// 监听竞赛ID变化，重新获取数据
watch(() => props.competitionId, (newId) => {
  if (newId && props.useRemoteData) {
    fetchCompetitionData();
  }
});

// 组件挂载时，如果提供了竞赛ID，则获取数据
onMounted(() => {
  if (props.competitionId && props.useRemoteData) {
    fetchCompetitionData();
  }
});

// 获取竞赛状态对应的类名
const getStatusClass = () => {
  if (!mergedCompetition.value || !mergedCompetition.value.status) return '';
  
  switch(mergedCompetition.value.status) {
    case 'upcoming':
      return 'status-upcoming';
    case 'running':
      return 'status-running';
    case 'ended':
      return 'status-ended';
    default:
      return '';
  }
};
</script>

<style scoped>
.competition-item {
  background: white;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  border: 1px solid rgba(235, 240, 245, 0.8);
  transition: all 0.3s cubic-bezier(0.215, 0.61, 0.355, 1);
  opacity: 0;
  transform: translateY(15px);
  will-change: opacity, transform;
  position: relative;
  max-width: 100%;
}

.competition-item::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.1);
  opacity: 0;
  transition: opacity 0.4s ease;
  pointer-events: none;
  z-index: -1;
  border-radius: 16px;
}

.competition-item:hover {
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.08);
  transform: translateY(-5px) !important;
  border-color: rgba(66, 185, 131, 0.15);
}

.competition-item:hover::after {
  opacity: 1;
}

.competition-item.appear {
  opacity: 1;
  transform: translateY(0);
}

.competition-header {
  padding: 22px 25px;
  position: relative;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  background: linear-gradient(to right, #f9fafb, #f5f7fa);
}

.title-line {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 15px;
}

.competition-title {
  font-size: 20px;
  font-weight: 600;
  color: #333;
  position: relative;
  padding-left: 14px;
}

.competition-title::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 4px;
  height: 100%;
  background: linear-gradient(to bottom, #42b983, #33c6aa);
  border-radius: 2px;
}

.competition-content {
  display: flex;
  padding: 24px 25px;
  gap: 30px;
  justify-content: space-between;
}

.left-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.time-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.time-row {
  display: flex;
  align-items: center;
}

.time-label {
  color: #666;
  font-size: 14px;
  width: 80px;
  flex-shrink: 0;
}

.time-value {
  color: #333;
  font-weight: 500;
  font-size: 14px;
}

.competition-logos {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  align-items: center;
}

.logo-placeholder {
  height: 36px;
  min-width: 70px; /* 设置最小宽度 */
  max-width: 120px; /* 设置最大宽度 */
  width: auto; /* 宽度自适应 */
  background-color: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  font-weight: bold;
  color: #666;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  transition: all 0.2s ease;
  font-size: 13px;
  padding: 0 10px; /* 添加水平内边距 */
  white-space: nowrap; /* 防止文字换行 */
  overflow: hidden; /* 超出部分隐藏 */
  text-overflow: ellipsis; /* 超出显示省略号 */
}

.competition-item:hover .logo-placeholder {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.08);
  background-color: #e8f5f0;
  color: #42b983;
}

.action-section {
  display: flex;
  align-items: flex-end;
}

.lets-go-btn {
  background: linear-gradient(135deg, #42b983, #33c6aa);
  color: white;
  border: none;
  padding: 12px 28px;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.215, 0.61, 0.355, 1);
  box-shadow: 0 6px 15px rgba(66, 185, 131, 0.25);
  position: relative;
  overflow: hidden;
  font-size: 15px;
  display: flex;
  align-items: center;
  gap: 8px;
  text-decoration: none;
}

.lets-go-btn::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, #33c6aa, #42b983);
  z-index: 0;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.lets-go-btn span {
  position: relative;
  z-index: 1;
  text-decoration: none;
}

.btn-arrow {
  position: relative;
  z-index: 1;
  font-style: normal;
  transition: transform 0.3s ease;
}

.lets-go-btn:hover {
  box-shadow: 0 8px 20px rgba(66, 185, 131, 0.35);
  transform: translateY(-2px);
}

.lets-go-btn:hover .btn-arrow {
  transform: translateX(4px);
}

.lets-go-btn:hover::after {
  opacity: 1;
}

.competition-tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.tag {
  padding: 5px 14px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  /* 移除默认样式，现在由动态样式控制 */
}

.tag:hover {
  transform: translateY(-1px);
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.08);
}

/* 移除unknown类，现在使用动态样式 */

.tag.running {
  background-color: #e6f7f0;
  color: #42b983;
}

.tag.individual {
  background-color: #e6f1ff;
  color: #3399ff;
}

.tag.oi {
  background-color: #fff8e6;
  color: #ffaa00;
}

.tag.regional {
  background-color: #f2e6ff;
  color: #9966cc;
}

@media (max-width: 640px) {
  .competition-content {
    flex-direction: column;
    gap: 20px;
  }
  
  .action-section {
    align-items: flex-start;
  }
  
  .competition-title {
    font-size: 18px;
  }
  
  .lets-go-btn {
    width: 100%;
    justify-content: center;
  }
}

.router-link-no-underline {
  text-decoration: none;
}

/* 添加状态相关的样式 */
.competition-item.status-upcoming .competition-header {
  background: linear-gradient(to right, #f9f9f9, #f2f2f2);
}

.competition-item.status-upcoming .lets-go-btn {
  background: linear-gradient(135deg, #ffaa00, #ffc107);
  box-shadow: 0 6px 15px rgba(255, 170, 0, 0.25);
}

.competition-item.status-upcoming .lets-go-btn::after {
  background: linear-gradient(90deg, #ffc107, #ffaa00);
}

.competition-item.status-upcoming .competition-title::before {
  background: linear-gradient(to bottom, #ffaa00, #ffc107);
}

.competition-item.status-running .competition-header {
  background: linear-gradient(to right, #f9fafb, #f5f7fa);
}

.competition-item.status-running .competition-title::before {
  background: linear-gradient(to bottom, #42b983, #33c6aa);
}

.competition-item.status-ended .competition-header {
  background: linear-gradient(to right, #f9f9f9, #f2f2f2);
}

.competition-item.status-ended .lets-go-btn {
  background: linear-gradient(135deg, #a3a3a3, #888888);
  box-shadow: 0 6px 15px rgba(100, 100, 100, 0.2);
}

.competition-item.status-ended .lets-go-btn::after {
  background: linear-gradient(90deg, #888888, #a3a3a3);
}

.competition-item.status-ended .competition-title {
  color: #777;
}

.competition-item.status-ended .competition-title::before {
  background: linear-gradient(to bottom, #bbbbbb, #999999);
}

.competition-item.status-ended:hover .logo-placeholder {
  background-color: #f0f0f0;
  color: #888888;
}

.competition-item.status-upcoming:hover .logo-placeholder {
  background-color: #fff8e0;
  color: #ffaa00;
}

.competition-item.status-running:hover .logo-placeholder {
  background-color: #e8f7f1;
  color: #42b983;
}
</style>