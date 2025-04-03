<template>
  <div class="banner-container">
    <div class="banner-image">
      <div v-for="(slide, index) in slides" 
           :key="index" 
           class="banner-slide" 
           :class="{ active: currentSlide === index }">
        <div class="banner-placeholder" :style="{ background: slide.gradient }">
          <div class="banner-content">
            <h3 class="fade-in-up" :style="{ animationDelay: '0.1s' }">{{ slide.title }}</h3>
            <p class="fade-in-up" :style="{ animationDelay: '0.3s' }">{{ slide.subtitle }}</p>
            <button class="banner-btn fade-in-up" :style="{ animationDelay: '0.5s' }">
              {{ buttonText }}
              <span class="btn-icon">→</span>
            </button>
          </div>
        </div>
      </div>
      
      <!-- 左右切换按钮 -->
      <button class="banner-nav-btn prev" @click="prevSlide">
        <span class="nav-icon">←</span>
      </button>
      <button class="banner-nav-btn next" @click="nextSlide">
        <span class="nav-icon">→</span>
      </button>

      <div class="banner-controls">
        <div class="banner-dots">
          <span v-for="(slide, index) in slides" 
                :key="index" 
                class="dot" 
                :class="{ active: currentSlide === index }"
                @click="setSlide(index)"></span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, defineProps } from 'vue';

interface Slide {
  title: string;
  subtitle: string;
  gradient: string;
}

const props = defineProps({
  slides: {
    type: Array as () => Slide[],
    required: true
  },
  buttonText: {
    type: String,
    default: '立即探索'
  },
  interval: {
    type: Number,
    default: 5000
  }
});

const currentSlide = ref(0);
let slideInterval: number | undefined;
let isTransitioning = false;

const nextSlide = () => {
  if (isTransitioning) return;
  isTransitioning = true;
  currentSlide.value = (currentSlide.value + 1) % props.slides.length;
  setTimeout(() => isTransitioning = false, 1500);
};

const prevSlide = () => {
  if (isTransitioning) return;
  isTransitioning = true;
  currentSlide.value = (currentSlide.value - 1 + props.slides.length) % props.slides.length;
  setTimeout(() => isTransitioning = false, 1500);
};

const setSlide = (index: number) => {
  if (isTransitioning || currentSlide.value === index) return;
  isTransitioning = true;
  currentSlide.value = index;
  setTimeout(() => isTransitioning = false, 1500);
  startSlideshow();
};

const startSlideshow = () => {
  stopSlideshow();
  slideInterval = window.setInterval(() => {
    nextSlide();
  }, props.interval);
};

const stopSlideshow = () => {
  if (slideInterval) {
    clearInterval(slideInterval);
    slideInterval = undefined;
  }
};

onMounted(() => {
  startSlideshow();
});

onBeforeUnmount(() => {
  stopSlideshow();
});
</script>

<style scoped>
.banner-container {
  width: 100%;
  max-width: 1200px;
  margin: 20px auto;
  padding: 0 20px;
}

.banner-image {
  position: relative;
  width: 100%;
  height: 350px;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 10px 35px rgba(66, 185, 131, 0.15), 0 5px 25px rgba(41, 121, 255, 0.1);
  color: white;
  transform: translateZ(0);
  backface-visibility: hidden;
}

.banner-slide {
  position: absolute;
  width: 100%;
  height: 100%;
  opacity: 0;
  transition: all 1.5s cubic-bezier(0.215, 0.61, 0.355, 1);
  transform: scale(1.05) translateX(0);
  z-index: 1;
  will-change: opacity, transform;
}

.banner-slide.active {
  opacity: 1;
  transform: scale(1) translateX(0);
  z-index: 2;
}

.banner-placeholder {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  text-align: center;
  padding: 20px;
  background-size: 200% 200% !important;
  animation: gradientBG 15s ease infinite;
  position: relative;
}

@keyframes gradientBG {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

.banner-placeholder::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle at center, transparent 0%, rgba(0, 0, 0, 0.3) 100%);
  opacity: 0.7;
  z-index: 0;
}

.banner-content {
  max-width: 650px;
  padding: 20px;
  margin-top: -50px;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  z-index: 1;
}

.banner-placeholder h3 {
  font-size: 36px;
  margin-bottom: 16px;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.25);
  font-weight: 700;
  letter-spacing: 0.5px;
  background: linear-gradient(45deg, #fff, #f0f0f0);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.banner-placeholder p {
  font-size: 20px;
  opacity: 0.9;
  margin-bottom: 30px;
  max-width: 580px;
  text-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
  line-height: 1.6;
}

.banner-btn {
  background-color: white;
  color: #42b983;
  border: none;
  padding: 12px 30px;
  border-radius: 30px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.215, 0.61, 0.355, 1);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  margin-top: 5px;
  overflow: hidden;
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  gap: 8px;
}

.btn-icon {
  transition: transform 0.3s ease;
}

.banner-btn:hover .btn-icon {
  transform: translateX(4px);
}

.banner-btn::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, rgba(66, 185, 131, 0.1), rgba(0, 196, 255, 0.1));
  z-index: -1;
  transform: scaleX(0);
  transform-origin: right;
  transition: transform 0.5s cubic-bezier(0.215, 0.61, 0.355, 1);
}

.banner-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  background-color: #f8f8f8;
  color: #33a06f;
}

.banner-btn:hover::after {
  transform: scaleX(1);
  transform-origin: left;
}

/* 导航按钮样式 */
.banner-nav-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  z-index: 3;
  backdrop-filter: blur(4px);
}

.banner-nav-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-50%) scale(1.1);
}

.banner-nav-btn.prev {
  left: 20px;
}

.banner-nav-btn.next {
  right: 20px;
}

.nav-icon {
  font-size: 20px;
  font-weight: bold;
}

.banner-controls {
  position: absolute;
  bottom: 15px;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 3;
}

.banner-dots {
  display: flex;
  gap: 12px;
  align-items: center;
  padding: 8px 16px;
  border-radius: 20px;
  backdrop-filter: blur(4px);
  background: rgba(0, 0, 0, 0.2);
}

.dot {
  width: 20px;
  height: 4px;
  border-radius: 2px;
  background-color: rgba(255, 255, 255, 0.5);
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.215, 0.61, 0.355, 1);
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.15);
}

.dot:hover {
  background-color: rgba(255, 255, 255, 0.8);
  transform: scaleY(1.2);
}

.dot.active {
  width: 30px;
  height: 4px;
  border-radius: 2px;
  background-color: white;
  box-shadow: 0 0 8px rgba(255, 255, 255, 0.5);
  transform: scaleY(1.2);
}

.fade-in-up {
  animation: fadeInUp 0.6s ease forwards;
  opacity: 0;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .banner-image {
    height: 300px;
  }

  .banner-placeholder h3 {
    font-size: 28px;
  }

  .banner-placeholder p {
    font-size: 16px;
  }

  .banner-nav-btn {
    width: 32px;
    height: 32px;
  }

  .nav-icon {
    font-size: 16px;
  }
}
</style> 