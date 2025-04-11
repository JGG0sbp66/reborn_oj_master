<template>
  <div class="manager-sidebar" :class="{ 'collapsed': collapsed }">
    <div class="sidebar-header">
      <div class="collapse-btn" @click="toggleCollapse">
        <el-icon class="collapse-icon">{{ collapsed ? 'CaretRight' : 'CaretLeft' }}</el-icon>
      </div>
    </div>
    
    <div class="sidebar-menu">
      <div 
        v-for="(item, index) in menuItems" 
        :key="index" 
        class="menu-item"
        :class="{ 'active': item.active, 'has-submenu': item.children && item.children.length }"
      >
        <div class="menu-title" @click="toggleMenuItem(index)">
          <div class="item-icon" :class="item.iconClass">
            <component :is="item.icon" v-if="item.icon" />
            <i v-else class="default-icon"></i>
          </div>
          <div class="item-text" v-show="!collapsed">{{ item.title }}</div>
          <div class="arrow" v-if="item.children && item.children.length && !collapsed">
            <i :class="[item.expanded ? 'arrow-down' : 'arrow-right']"></i>
          </div>
        </div>
        
        <transition name="submenu">
          <div class="submenu" v-if="item.children && item.children.length && item.expanded && !collapsed">
            <router-link 
              v-for="(subItem, subIndex) in item.children" 
              :key="subIndex" 
              :to="subItem.route" 
              class="submenu-item"
              :class="{ 'active': subItem.active }"
            >
              <div class="submenu-dot"></div>
              <div class="submenu-text">{{ subItem.title }}</div>
            </router-link>
          </div>
        </transition>
      </div>
    </div>
    
    <div class="sidebar-footer">
      <div class="copyright" v-show="!collapsed">
        Copyright © 2025 <span class="highlight">所谓混学</span> All rights reserved.
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { Setting, Document, CaretLeft, CaretRight } from '@element-plus/icons-vue';

// 控制侧边栏折叠状态
const collapsed = ref(false);

// 菜单数据
const menuItems = reactive([
  {
    title: '首页',
    icon: Document,
    iconClass: 'home-icon',
    route: '/',
    active: true,
    expanded: false,
    children: []
  },
  {
    title: '系统管理',
    icon: Setting,
    iconClass: 'setting-icon',
    route: '',
    active: false,
    expanded: false,
    children: [
      { title: '题库管理', route: '/system/questions', active: false },
      { title: '竞赛管理', route: '/system/competitions', active: false },
    ]
  }
]);

// 切换侧边栏折叠状态
const toggleCollapse = () => {
  collapsed.value = !collapsed.value;
};

// 切换菜单项展开状态
const toggleMenuItem = (index: number) => {
  if (collapsed.value) return;
  if (menuItems[index].children && menuItems[index].children.length) {
    menuItems[index].expanded = !menuItems[index].expanded;
  }
};

// 提供给模板使用的变量和方法
defineExpose({
  collapsed,
  menuItems,
  toggleCollapse,
  toggleMenuItem
});
</script>

<style scoped>
.manager-sidebar {
  width: 220px;
  height: calc(100vh - 80px); /* 减去头部高度 */
  background-color: #fff;
  display: flex;
  flex-direction: column;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  position: fixed; /* 改为固定定位 */
  left: 0;
  top: 80px; /* 设置顶部距离为头部组件高度 */
  overflow: hidden;
  z-index: 999; /* 确保在大多数内容之上，但在头部之下 */
}

.manager-sidebar.collapsed {
  width: 60px;
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
  cursor: pointer;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(66, 185, 131, 0.1), rgba(0, 196, 255, 0.1));
  border: 1px solid rgba(66, 185, 131, 0.2);
  transition: all 0.3s cubic-bezier(0.23, 1, 0.32, 1);
  position: absolute;
  right: -16px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
}

.collapse-btn:hover {
  background: linear-gradient(135deg, rgba(66, 185, 131, 0.15), rgba(0, 196, 255, 0.15));
  transform: scale(1.05);
  box-shadow: 0 3px 8px rgba(66, 185, 131, 0.25);
}

.collapse-icon {
  color: #42b983;
  font-size: 16px;
  transition: all 0.3s ease;
}

.sidebar-menu {
  flex: 1;
  overflow-y: auto;
  padding: 16px 0;
}

.menu-item {
  position: relative;
  transition: all 0.3s ease;
}

.menu-title {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.menu-title:hover {
  background-color: rgba(66, 185, 131, 0.05);
}

.item-icon {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #64748b;
  margin-right: 12px;
  transition: all 0.3s ease;
}

.item-text {
  flex: 1;
  color: #333;
  font-size: 14px;
  font-weight: 500;
  white-space: nowrap;
  transition: all 0.3s ease;
}

.arrow {
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.arrow-right:after {
  content: '→';
  font-size: 12px;
  color: #64748b;
}

.arrow-down:after {
  content: '↓';
  font-size: 12px;
  color: #64748b;
}

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
  color: #42b983;
}

.submenu-dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background-color: #cbd5e1;
  margin-right: 8px;
  transition: all 0.2s ease;
}

.submenu-text {
  flex: 1;
  white-space: nowrap;
}

.submenu-item:hover .submenu-dot {
  background-color: #42b983;
}

.submenu-item.active {
  color: #42b983;
}

.submenu-item.active .submenu-dot {
  background-color: #42b983;
}

.menu-item.active > .menu-title {
  background-color: rgba(66, 185, 131, 0.1);
}

.menu-item.active > .menu-title .item-icon {
  color: #42b983;
}

.menu-item.active > .menu-title .item-text {
  color: #42b983;
  font-weight: 600;
}

/* 图标样式 */
.home-icon,
.setting-icon,
.monitor-icon,
.tools-icon,
.network-icon,
.logs-icon,
.example-icon {
  color: #64748b;
}

.menu-item.active .home-icon,
.menu-item.active .setting-icon,
.menu-item.active .monitor-icon,
.menu-item.active .tools-icon,
.menu-item.active .network-icon,
.menu-item.active .logs-icon,
.menu-item.active .example-icon {
  color: #42b983;
}

.default-icon:before {
  content: '•';
  font-size: 24px;
}

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
  font-weight: 500;
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
    left: -60px;
  }
}
</style>
