<template>
  <div
    class="manager-sidebar"
    :class="{ 'collapsed': collapsed }"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
  >
    <div class="sidebar-header">
      <div class="collapse-btn">
        <el-icon class="collapse-icon">{{'manager'}}</el-icon>
      </div>
    </div>

    <div class="sidebar-menu navbar">
      <ul class="navbar__menu">
        <li
          v-for="(item, index) in menuItems"
          :key="index"
          class="navbar__item"
          :class="{ 'active': isActive(item) }"
        >
          <router-link
            v-if="!item.children || !item.children.length"
            :to="item.route"
            class="navbar__link"
            active-class="active"
          >
            <div
              class="item-icon"
              :class="[item.iconClass, { 'active': isActive(item) }]"
            >
              <component
                :is="item.icon"
                v-if="item.icon"
              />
              <i
                v-else
                class="default-icon"
              ></i>
            </div>
            <span
              class="menu-text"
              :class="{ 'collapsed': collapsed }"
            >{{ item.title }}</span>
          </router-link>

          <div
            v-else
            class="navbar__link"
            :class="{ 'active': isActive(item) }"
            @click="toggleMenuItem(index)"
          >
            <div
              class="item-icon"
              :class="[item.iconClass, { 'active': isActive(item) }]"
            >
              <component
                :is="item.icon"
                v-if="item.icon"
              />
              <i
                v-else
                class="default-icon"
              ></i>
            </div>
            <span
              class="menu-text"
              :class="{ 'collapsed': collapsed }"
            >{{ item.title }}</span>
          </div>

          <transition name="submenu">
            <div
              class="submenu"
              v-if="item.children && item.children.length && (item.expanded || isAnyChildActive(item)) && !collapsed"
            >
              <router-link
                v-for="(subItem, subIndex) in item.children"
                :key="subIndex"
                :to="subItem.route"
                class="submenu-item"
                active-class="active"
              >
                <div class="submenu-dot"></div>
                <div class="submenu-text">{{ subItem.title }}</div>
              </router-link>
            </div>
          </transition>
        </li>
      </ul>
    </div>

    <div class="sidebar-footer">
      <div
        class="copyright"
        v-show="!collapsed"
      >
        Copyright © 2025 <span class="highlight">所谓混学</span> All rights reserved.
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import {
  Setting,
  Document,
  CaretLeft,
  CaretRight,
  House,
} from "@element-plus/icons-vue";

// 获取路由实例
const router = useRouter();
const route = useRoute();

// 控制侧边栏折叠状态
const collapsed = ref(true);
const hoverMode = ref(true); // 控制是否启用悬浮模式

const emit = defineEmits(["sidebar-state-change"]);

// 菜单数据
const menuItems = reactive([
  {
    title: "首页",
    icon: House,
    iconClass: "home-icon",
    route: "/user/manager",
    active: false,
    expanded: false,
    children: [],
  },
  {
    title: "系统管理",
    icon: Setting,
    iconClass: "setting-icon",
    route: "",
    active: false,
    expanded: false,
    children: [
      { title: "题库管理", route: "/user/mproblem", active: false },
      { title: "竞赛管理", route: "/user/mrace", active: false },
    ],
  },
]);

// 根据当前路由更新菜单项的活动状态
const updateActiveState = () => {
  const currentPath = route.path;

  menuItems.forEach((item) => {
    // 直接检查主菜单项是否匹配
    if (item.route === currentPath) {
      item.active = true;
    } else {
      item.active = false;
    }

    // 检查子菜单项
    if (item.children && item.children.length) {
      let hasActiveChild = false;

      item.children.forEach((child) => {
        if (child.route === currentPath) {
          child.active = true;
          hasActiveChild = true;
          item.expanded = true; // 自动展开包含当前页面的菜单
        } else {
          child.active = false;
        }
      });

      // 如果有活跃的子菜单，也将父菜单标记为活跃
      if (hasActiveChild) {
        item.active = true;
      }
    }
  });
};

// 检查菜单项是否处于活动状态
const isActive = (item) => {
  if (item.active) return true;

  if (item.children && item.children.length) {
    return item.children.some((child) => child.active);
  }

  return false;
};

// 检查菜单项的任何子项是否活动
const isAnyChildActive = (item) => {
  if (!item.children || !item.children.length) return false;
  return item.children.some((child) => child.active);
};

// 鼠标悬浮处理
const handleMouseEnter = () => {
  if (hoverMode.value) {
    collapsed.value = false;
    emit("sidebar-state-change", false);
  }
};

const handleMouseLeave = () => {
  if (hoverMode.value) {
    collapsed.value = true;
    emit("sidebar-state-change", true);
  }
};

// 切换侧边栏折叠状态
const toggleCollapse = () => {
  collapsed.value = !collapsed.value;
  hoverMode.value = false; // 手动点击后禁用悬浮模式
  emit("sidebar-state-change", collapsed.value);
};

// 切换菜单项展开状态
const toggleMenuItem = (index) => {
  if (collapsed.value) return;

  // 如果菜单项没有子菜单或子菜单为空，则直接导航到对应路由
  if (!menuItems[index].children || menuItems[index].children.length === 0) {
    if (menuItems[index].route) {
      navigateTo(menuItems[index].route);
    }
    return;
  }

  menuItems[index].expanded = !menuItems[index].expanded;
};

// 导航到指定路由
const navigateTo = (route) => {
  router.push(route);
};

// 监听路由变化
watch(
  () => route.path,
  () => {
    updateActiveState();
  }
);

// 组件挂载时更新活动状态
onMounted(() => {
  updateActiveState();
  // 不需要在这里设置初始折叠状态，因为已经通过 ref 的初始值设置了
  emit("sidebar-state-change", collapsed.value);
});

// 提供给模板使用的变量和方法
defineExpose({
  collapsed,
  menuItems,
  toggleCollapse,
  toggleMenuItem,
  isActive,
  isAnyChildActive,
});
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Open+Sans:wght@600&display=swap");

/* 变量定义 */
:root {
  --border-radius: 10px;
  --spacer: 1rem;
  --primary: #2b9166; /* 加深的绿色 */
  --primary-hover: #217a54;
  --primary-gradient: linear-gradient(135deg, #42b983, #33c6aa);
  --text: #6a778e;
  --link-height: calc(var(--spacer) * 3.5);
  --timing: 250ms;
  --transition: var(--timing) ease all;
}

/* Gooey Effect Keyframes */
@keyframes gooeyEffect-1 {
  0% {
    transform: scale(1, 1);
  }
  50% {
    transform: scale(0.5, 1.5);
  }
  100% {
    transform: scale(1, 1);
  }
}

@keyframes gooeyEffect-2 {
  0% {
    transform: scale(1, 1);
  }
  50% {
    transform: scale(0.5, 1.5);
  }
  100% {
    transform: scale(1, 1);
  }
}

.manager-sidebar {
  width: 220px;
  height: calc(100vh - 80px); /* 减去头部高度 */
  background-color: #fff;
  display: flex;
  flex-direction: column;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1) 0.1s;
  position: fixed; /* 改为固定定位 */
  left: 0;
  top: 80px; /* 设置顶部距离为头部组件高度 */
  overflow: hidden;
  z-index: 999; /* 确保在大多数内容之上，但在头部之下 */
  border-radius: var(--border-radius);
  /* font-family: 'Open Sans', sans-serif; */
  will-change: width;
}

.manager-sidebar.collapsed {
  width: 80px;
  /* 添加初始状态类 */
  transition: none;
}

/* 添加初始状态类，用于页面加载时避免动画 */
.manager-sidebar:not(.initial-load) {
  transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.sidebar-header {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 0 16px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  position: relative;
}

.collapse-btn {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: default;
  border-radius: 50%;
  background: linear-gradient(
    135deg,
    rgba(66, 185, 131, 0.1),
    rgba(0, 196, 255, 0.1)
  );
  border: 1px solid rgba(66, 185, 131, 0.2);
  transition: all 0.3s cubic-bezier(0.23, 1, 0.32, 1);
  position: absolute;
  left: -16px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
}

.collapse-btn:hover {
  background: linear-gradient(
    135deg,
    rgba(66, 185, 131, 0.15),
    rgba(0, 196, 255, 0.15)
  );
  transform: scale(1.05);
  box-shadow: 0 3px 8px rgba(66, 185, 131, 0.25);
}

.collapse-icon {
  position: absolute;
  right: -25px;
  color: #42b983;
  font-size: 14px;
  transition: all 0.3s ease;
}

/* 侧边栏菜单 - 应用新样式 */
.sidebar-menu {
  flex: 1;
  overflow-y: auto;
  position: relative;
  padding: var(--spacer) 0;
}

.navbar__menu {
  position: relative;
  list-style: none;
  padding: 0;
  margin: 0;
}

.navbar__item {
  position: relative;
}

.navbar__item:last-child:before {
  content: "";
  position: absolute;
  opacity: 0;
  z-index: -1;
  top: 0;
  left: var(--spacer);
  width: var(--link-height);
  height: var(--link-height);
  background: var(--primary-gradient);
  border-radius: calc(var(--border-radius) * 1.75);
  transition: var(--timing) cubic-bezier(1, 0.2, 0.1, 1.2) all;
  box-shadow: 0 2px 8px rgba(66, 185, 131, 0.3);
}

.navbar__item:hover ~ .navbar__item:last-child:before,
.navbar__item:last-child:hover:before {
  opacity: 1;
}

.navbar__item:first-child:hover ~ .navbar__item:last-child:before {
  top: 0;
  animation: gooeyEffect-1 var(--timing) 1;
}

.navbar__item:nth-child(2):hover ~ .navbar__item:last-child:before {
  top: 50%;
  animation: gooeyEffect-2 var(--timing) 1;
}

.navbar__item:last-child:hover:before {
  top: 100%;
  animation: gooeyEffect-2 var(--timing) 1;
}

/* 删除重复的悬停样式，统一处理所有导航链接 */
.navbar__link {
  position: relative;
  display: flex;
  align-items: center;
  padding: 12px 16px;
  height: var(--link-height);
  color: var(--text);
  transition: var(--transition);
  cursor: pointer;
  text-decoration: none;
  overflow: visible;
}

/* 统一的悬停效果，同时作用于router-link和div */
.navbar__link:hover,
.navbar__link:hover .item-icon,
.navbar__link:hover .menu-text {
  color: var(--primary);
}

.navbar__link:hover {
  background-color: rgba(66, 185, 131, 0.12);
  border-radius: var(--border-radius);
}

.navbar__link:hover .item-icon {
  transform: scale(1.1);
}

.navbar__link:hover .menu-text {
  font-weight: 600;
  transform: translateX(2px);
}

/* 修改菜单文字样式 */
.menu-text {
  margin-left: 12px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) 0.1s;
  color: #333;
  font-size: 14px;
  font-weight: 500;
  white-space: nowrap;
  opacity: 1;
  position: absolute;
  left: 48px; /* 图标宽度(24px) + 左内边距(16px) + 间距(8px) */
  transform: translateX(0);
  pointer-events: auto;
}

.menu-text.collapsed {
  opacity: 0;
  transform: translateX(-20px);
  pointer-events: none;
}

.navbar__link:hover {
  color: var(--primary);
  background-color: rgba(66, 185, 131, 0.12);
  border-radius: var(--border-radius);
}

.navbar__link:hover span {
  color: var(--primary);
  font-weight: 600;
  transform: translateX(2px);
}

/* 修改导航链接悬停样式 */
.navbar__link:hover {
  color: #2b9166;
  background-color: rgba(66, 185, 131, 0.12);
  border-radius: var(--border-radius);
}

.navbar__link:hover .item-icon {
  color: #2b9166;
  transform: scale(1.1);
}

.navbar__link:hover .menu-text {
  color: #4c5a6d;
  font-weight: 600;
  transform: translateX(2px);
}

/* 图标容器样式 */
.item-icon {
  position: relative;
  z-index: 2; /* 确保图标始终在文字上层 */
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #64748b;
  transition: all 0.3s ease;
  flex-shrink: 0;
  will-change: transform;
}

.item-icon.active {
  color: var(--primary);
  transform: scale(1.1);
  filter: drop-shadow(0 0 2px rgba(66, 185, 131, 0.3));
}

.default-icon:before {
  content: "•";
  font-size: 24px;
}

/* 子菜单样式 */
.submenu {
  padding: 5px 0 5px 44px;
  background-color: rgba(248, 250, 252, 0.8);
}

.submenu-item {
  display: flex;
  align-items: center;
  padding: 10px 16px 10px 0;
  color: #64748b;
  text-decoration: none;
  font-size: 13px;
  transition: all 0.2s ease;
}

.submenu-item:hover {
  color: #2b9166;
}

.submenu-dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background-color: #a9b0b8;
  margin-right: 10px;
  margin-top: 2px;
  transition: all 0.2s ease;
}

.submenu-text {
  flex: 1;
  white-space: nowrap;
}

.submenu-item:hover .submenu-dot {
  background-color: #2b9166;;
}

.submenu-item.active {
  color: var(--primary);
  font-weight: 100;
}

.submenu-item.active .submenu-dot {
  background-color: var(--primary);
  transform: scale(1.4);
  box-shadow: 0 0 3px rgba(0, 255, 140, 0.5);
}

/* 图标激活样式 */
.home-icon,
.setting-icon {
  color: #64748b;
}

.navbar__item:hover .home-icon,
.navbar__item:hover .setting-icon {
  color: var(--primary);
}

/* 页脚样式 */
.sidebar-footer {
  padding: 16px;
  border-top: 1px solid rgba(0, 0, 0, 0.05);
  text-align: center;
}

.copyright {
  font-size: 12px;
  color: #94a3b8;
}

.highlight {
  color: #42b983;
  font-weight: 600;
  text-shadow: 0 0 1px rgba(66, 185, 131, 0.3);
}

/* 子菜单动画 */
.submenu-enter-active,
.submenu-leave-active {
  transition: all 0.3s ease;
  max-height: 300px;
  overflow: hidden;
}

.submenu-enter-from,
.submenu-leave-to {
  max-height: 0;
  opacity: 0;
}

/* 滚动条样式 */
.sidebar-menu::-webkit-scrollbar {
  width: 4px;
}

.sidebar-menu::-webkit-scrollbar-track {
  background: transparent;
}

.sidebar-menu::-webkit-scrollbar-thumb {
  background-color: #e2e8f0;
  border-radius: 4px;
}

.sidebar-menu::-webkit-scrollbar-thumb:hover {
  background-color: #cbd5e1;
}

/* 响应式处理 */
@media (max-width: 768px) {
  .manager-sidebar {
    position: fixed;
    z-index: 999;
    left: 0;
    top: 64px; /* 移动端头部高度通常较小 */
    height: calc(100vh - 64px);
  }

  .manager-sidebar.collapsed {
    left: -80px;
  }
}

.chart-bar {
  width: 40px;
  background: var(--primary-gradient);
  border-radius: 4px 4px 0 0;
  transition: all 0.5s ease;
  position: relative;
  display: flex;
  justify-content: center;
}

/* 修改导航链接激活状态样式 */
.navbar__link.active,
.navbar__item .navbar__link:active {
  color: var(--primary);
  background-color: rgba(66, 185, 131, 0.12);
  border-radius: var(--border-radius);
}

.navbar__link.router-link-active {
  color: var(--primary);
  background-color: rgba(66, 185, 131, 0.12);
  border-radius: var(--border-radius);
}

/* 统一悬停和激活状态的背景色 */
.navbar__link:hover {
  background: linear-gradient(145deg, rgba(226, 232, 240, 0.6), rgba(203, 213, 225, 0.7));
  color: #475569 !important;
  border-radius: var(--border-radius);
  box-shadow: inset 0 0 0 1px rgba(148, 163, 184, 0.1);
  transform: translateY(-1px);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.navbar__link.active,
.navbar__link:active {
  background: linear-gradient(145deg, rgba(72, 187, 120, 0.08), rgba(56, 161, 105, 0.12));
  color: #38a169 !important;
  border-radius: var(--border-radius);
  box-shadow: inset 0 0 0 1px rgba(72, 187, 120, 0.1),
              0 2px 4px rgba(72, 187, 120, 0.06);
  transform: translateY(0);
}

/* 修改导航链接激活状态样式 */
.navbar__link.active {
  color: var(--primary);
}

.navbar__link.active .menu-text {
  color: var(--primary);
  font-weight: 600;
}

/* 修改图标激活状态样式 */
.navbar__link.active .item-icon {
  color: var(--primary);
  transform: scale(1.1);
}

/* 确保子菜单项激活状态样式 */
.submenu-item.active {
  color: var(--primary);
  font-weight: 600;
}

.submenu-item.active .submenu-dot {
  background-color: var(--primary);
  transform: scale(1.4);
  box-shadow: 0 0 3px rgba(66, 185, 131, 0.5);
}
</style>
