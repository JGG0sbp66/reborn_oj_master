<template>
  <div class="service-links" :class="{ appear }">
    <h3 class="service-title">{{ title }}</h3>
    <div class="link-list">
      <a 
        v-for="(service, index) in services" 
        :key="index" 
        :href="service.url" 
        class="service-link"
        :style="{ animationDelay: `${0.05 * index}s` }"
      >
        <span class="link-title">{{ service.title }}</span>
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Service {
  title: string;
  url: string;
}

defineProps({
  title: {
    type: String,
    default: '在线服务'
  },
  services: {
    type: Array as () => Service[],
    required: true
  },
  appear: {
    type: Boolean,
    default: true
  }
});
</script>

<style scoped>
.service-links {
  background-color: #ffffff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;
  opacity: 0;
  transform: translateY(15px);
  will-change: opacity, transform;
}

.service-links.appear {
  opacity: 1;
  transform: translateY(0);
}

.service-title {
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

.service-link {
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

.service-link:hover {
  color: #42b983;
  background-color: #f5f5f5;
  border-left-color: #42b983;
  padding-left: 12px;
}

.link-title {
  font-weight: 500;
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