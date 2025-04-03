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
      >
        <span class="link-title">{{ project.title }}</span>
        <span v-if="project.description" class="link-desc">{{ project.description }}</span>
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
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
</script>

<style scoped>
.project-links {
  background-color: #ffffff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;
  opacity: 0;
  transform: translateY(15px);
  will-change: opacity, transform;
}

.project-links.appear {
  opacity: 1;
  transform: translateY(0);
}

.project-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0 0 16px 0;
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
  transition: all 0.2s ease;
  display: flex;
  flex-direction: column;
  padding: 8px 10px;
  border-radius: 6px;
  border-left: 2px solid transparent;
  animation: fadeIn 0.4s ease forwards;
  opacity: 0;
}

.project-link:hover {
  color: #42b983;
  background-color: #f5f5f5;
  border-left-color: #42b983;
  padding-left: 12px;
}

.link-title {
  font-weight: 500;
}

.link-desc {
  font-size: 12px;
  color: #888;
  margin-top: 4px;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(5px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style> 