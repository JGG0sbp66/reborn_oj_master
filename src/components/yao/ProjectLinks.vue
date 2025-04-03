<template>
  <div class="project-links" :class="{ appear }">
    <h3 class="project-title">{{ title }}</h3>
    <div class="link-list">
      <a 
        v-for="(project, index) in projects" 
        :key="index" 
        :href="project.url" 
        class="project-link"
        :style="{ animationDelay: `${0.05 * index}s` }"
        @mouseenter="handleMouseEnter"
        @mouseleave="handleMouseLeave"
      >
        <span class="link-title">{{ project.title }}</span>
        <span v-if="project.description" class="link-desc">{{ project.description }}</span>
        <span class="project-link-hover-effect"></span>
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

interface Project {
  title: string;
  description?: string;
  url: string;
}

defineProps({
  title: {
    type: String,
    default: '开源项目'
  },
  projects: {
    type: Array as () => Project[],
    required: true
  },
  appear: {
    type: Boolean,
    default: true
  }
});

// 添加鼠标悬停效果
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
.project-links {
  background-color: #ffffff;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  transition: all 0.3s cubic-bezier(0.25, 1, 0.5, 1);
  opacity: 0;
  transform: translateY(15px);
  will-change: opacity, transform;
  position: relative;
  overflow: hidden;
}

.project-links::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 3px;
  background: linear-gradient(90deg, #42b983, #3eaf7c, #64c8a3);
  transform: translateX(-100%);
  transition: transform 1s cubic-bezier(0.19, 1, 0.22, 1);
}

.project-links.appear {
  opacity: 1;
  transform: translateY(0);
}

.project-links.appear::before {
  transform: translateX(0);
}

.project-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0 0 16px 0;
  position: relative;
  display: inline-block;
}

.project-title::after {
  content: '';
  position: absolute;
  bottom: -6px;
  left: 0;
  width: 36px;
  height: 2px;
  background: linear-gradient(90deg, #42b983, #64c8a3);
  border-radius: 2px;
  transition: width 0.4s ease;
}

.project-links:hover .project-title::after {
  width: 100%;
}

.link-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.project-link {
  color: #666;
  text-decoration: none;
  font-size: 14px;
  transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
  display: flex;
  flex-direction: column;
  padding: 12px 14px;
  border-radius: 8px;
  background-color: #f9fafc;
  border: 1px solid transparent;
  animation: fadeIn 0.5s ease forwards;
  opacity: 0;
  position: relative;
  overflow: hidden;
  z-index: 1;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.02);
}

.project-link-hover-effect {
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

.project-link.hover-active {
  color: #42b983;
  transform: translateY(-4px);
  border-color: rgba(66, 185, 131, 0.2);
  box-shadow: 0 6px 16px rgba(66, 185, 131, 0.12);
}

.project-link.hover-active .link-desc {
  color: #42b983;
  opacity: 0.8;
}

.project-link.hover-active .project-link-hover-effect {
  width: 250%;
  height: 250%;
}

.link-title {
  font-weight: 500;
  transition: all 0.3s ease;
  position: relative;
}

.link-desc {
  font-size: 12px;
  color: #888;
  margin-top: 6px;
  transition: all 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 480px) {
  .project-link {
    padding: 10px 12px;
  }
}
</style> 