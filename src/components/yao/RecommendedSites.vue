<template>
  <div class="recommended-sites" :class="{ appear }">
    <h3 class="recommended-title">{{ title }}</h3>
    <div class="tag-list">
      <a 
        v-for="(site, index) in sites" 
        :key="index" 
        :href="site.url" 
        class="site-tag"
        :style="{ 
          animationDelay: `${0.08 * index}s`
        }"
        @mouseenter="handleMouseEnter"
        @mouseleave="handleMouseLeave"
      >
        {{ site.name }}
        <span class="site-tag-hover-effect"></span>
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

interface Site {
  name: string;
  url: string;
}

defineProps({
  title: {
    type: String,
    default: '推荐题库'
  },
  sites: {
    type: Array as () => Site[],
    required: true
  },
  appear: {
    type: Boolean,
    default: true
  }
});

// 添加鼠标悬停效果的音效
const handleMouseEnter = (event: MouseEvent) => {
  const target = event.currentTarget as HTMLElement;
  target.classList.add('hover-active');
};

const handleMouseLeave = (event: MouseEvent) => {
  const target = event.currentTarget as HTMLElement;
  target.classList.remove('hover-active');
};
</script>

<style scoped>
.recommended-sites {
  background-color: #ffffff;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  transition: all 0.5s cubic-bezier(0.25, 1, 0.5, 1);
  opacity: 0;
  transform: translateY(20px);
  will-change: opacity, transform;
  overflow: hidden;
  position: relative;
}

.recommended-sites::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 4px;
  background: linear-gradient(90deg, #42b983, #3eaf7c, #64c8a3);
  transform: translateX(-100%);
  transition: transform 1.2s cubic-bezier(0.19, 1, 0.22, 1);
}

.recommended-sites.appear {
  opacity: 1;
  transform: translateY(0);
}

.recommended-sites.appear::before {
  transform: translateX(0);
}

.recommended-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0 0 20px 0;
  position: relative;
  display: inline-block;
}

.recommended-title::after {
  content: '';
  position: absolute;
  bottom: -6px;
  left: 0;
  width: 40px;
  height: 3px;
  background: linear-gradient(90deg, #42b983, #64c8a3);
  border-radius: 3px;
  transition: width 0.4s ease;
}

.recommended-sites:hover .recommended-title::after {
  width: 100%;
}

.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  perspective: 1000px;
}

.site-tag {
  padding: 10px 18px;
  background-color: #f5f7fa;
  border-radius: 24px;
  color: #555;
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 0.3px;
  transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
  border: 1px solid transparent;
  animation: tagAppear 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
  opacity: 0;
  transform: translateY(15px) scale(0.95);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.02);
  position: relative;
  overflow: hidden;
  z-index: 1;
  backface-visibility: hidden;
}

.site-tag-hover-effect {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  background: radial-gradient(circle, rgba(66, 185, 131, 0.15), transparent 70%);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  transition: width 0.6s cubic-bezier(0.165, 0.84, 0.44, 1), 
              height 0.6s cubic-bezier(0.165, 0.84, 0.44, 1);
  z-index: -1;
}

.site-tag.hover-active {
  color: #42b983;
  transform: translateY(-4px) scale(1.05);
  border-color: rgba(66, 185, 131, 0.2);
  box-shadow: 0 8px 20px rgba(66, 185, 131, 0.15);
}

.site-tag.hover-active .site-tag-hover-effect {
  width: 300%;
  height: 300%;
}

@keyframes tagAppear {
  0% {
    opacity: 0;
    transform: translateY(15px) scale(0.95);
  }
  60% {
    opacity: 1;
    transform: translateY(-5px) scale(1.02);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@media (max-width: 480px) {
  .tag-list {
    justify-content: center;
  }
  
  .site-tag {
    padding: 8px 16px;
    font-size: 13px;
  }
  
  .recommended-sites {
    padding: 20px;
  }
}

/* 当屏幕宽度很小时的响应式调整 */
@media (max-width: 350px) {
  .tag-list {
    gap: 8px;
  }
  
  .site-tag {
    padding: 6px 12px;
    font-size: 12px;
  }
}
</style> 