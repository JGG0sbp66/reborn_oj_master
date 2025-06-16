<template>
  <div>
    <div class="custom-cursor"></div>
    <div class="cursor-follower"></div>
    <div class="focus-effect"></div>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue';

onMounted(() => {
  // 获取光标元素
  const cursor = document.querySelector('.custom-cursor');
  const cursorFollower = document.querySelector('.cursor-follower');
  const focusEffect = document.querySelector('.focus-effect');

  let mouseX = 0;
  let mouseY = 0;
  let followerX = 0;
  let followerY = 0;

  // 使用requestAnimationFrame进行平滑更新
  const updateCursor = () => {
    // 使用缓动效果使follower平滑跟随
    followerX += (mouseX - followerX) * 0.1;
    followerY += (mouseY - followerY) * 0.1;

    // 应用位置
    cursor.style.left = `${mouseX}px`;
    cursor.style.top = `${mouseY}px`;

    cursorFollower.style.left = `${followerX}px`;
    cursorFollower.style.top = `${followerY}px`;

    focusEffect.style.left = `${mouseX}px`;
    focusEffect.style.top = `${mouseY}px`;

    // 继续动画循环
    cursorAnimationFrame = requestAnimationFrame(updateCursor);
  };

  // 鼠标移动时更新位置
  const handleMouseMove = (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  };

  // 点击效果
  const handleMouseDown = () => {
    cursor.classList.add('active');
    cursorFollower.classList.add('active');
  };

  const handleMouseUp = () => {
    cursor.classList.remove('active');
    cursorFollower.classList.remove('active');
  };

  // 对可点击元素增加悬停效果
  const handleElementMouseEnter = () => {
    // 只有在不是输入框元素时才应用点击效果
    cursor.classList.add('active');
    cursor.classList.add('clickable');
    cursorFollower.classList.add('active');
    cursorFollower.classList.add('clickable');
    focusEffect.classList.add('active');
  };

  const handleElementMouseLeave = () => {
    cursor.classList.remove('active');
    cursor.classList.remove('clickable');
    cursorFollower.classList.remove('active');
    cursorFollower.classList.remove('clickable');
    focusEffect.classList.remove('active');
  };

  // 对输入框元素增加特殊悬停效果
  const handleInputMouseEnter = (e) => {
    // 标记当前元素为输入框
    e.target.dataset.isInput = 'true';
    
    // 添加输入模式样式类，但不移除其他样式类
    cursor.classList.add('input-mode');
    cursorFollower.classList.add('input-mode');
  };

  const handleInputMouseLeave = (e) => {
    // 移除标记
    delete e.target.dataset.isInput;
    
    // 移除输入模式样式类
    cursor.classList.remove('input-mode');
    cursorFollower.classList.remove('input-mode');
  };

  // 确保鼠标在离开窗口后重新进入时能正确显示
  const handleMouseEnter = () => {
    cursor.style.opacity = '1';
    cursorFollower.style.opacity = '1';
  };

  const handleMouseLeave = () => {
    cursor.style.opacity = '0';
    cursorFollower.style.opacity = '0';
  };

  // 添加事件监听
  document.addEventListener('mousemove', handleMouseMove);
  document.addEventListener('mousedown', handleMouseDown);
  document.addEventListener('mouseup', handleMouseUp);
  document.addEventListener('mouseenter', handleMouseEnter);
  document.addEventListener('mouseleave', handleMouseLeave);

  // 为可点击元素添加交互效果
  const clickableElements = document.querySelectorAll('a, button, .el-button, input, textarea, select, [role="button"], .link, .nav-item, .logo, img, .project-card, .tech-tag');
  
  clickableElements.forEach(element => {
    element.addEventListener('mouseenter', handleElementMouseEnter);
    element.addEventListener('mouseleave', handleElementMouseLeave);
  });

  // 为输入框元素添加特殊交互效果 - 使用更精确的选择器
  const inputElements = document.querySelectorAll(`
    input[type="text"], 
    input[type="password"], 
    input[type="email"], 
    input[type="number"],
    textarea, 
    [contenteditable="true"], 
    .el-input__inner, 
    .el-textarea__inner, 
    .validated-input-container input, 
    .register-card-form input, 
    .login-form input,
    .password-reset-form input
  `);
  
  inputElements.forEach(element => {
    element.addEventListener('mouseenter', handleInputMouseEnter);
    element.addEventListener('mouseleave', handleInputMouseLeave);
  });

  // 监听整个文档的mousemove事件，处理光标样式优先级
  document.addEventListener('mousemove', (e) => {
    // 检查当前hover的元素是否是输入框
    let element = document.elementFromPoint(e.clientX, e.clientY);
    let isInputElement = false;
    let isClickableElement = false;
    
    // 检查元素或其父元素是否是输入框或可点击元素
    while (element && !(isInputElement && isClickableElement)) {
      // 检查是否是输入框
      if (!isInputElement && (
          element.tagName === 'INPUT' || 
          element.tagName === 'TEXTAREA' || 
          element.getAttribute('contenteditable') === 'true' ||
          element.dataset.isInput === 'true')) {
        isInputElement = true;
      }
      
      // 检查是否是可点击元素
      if (!isClickableElement && (
          element.tagName === 'A' ||
          element.tagName === 'BUTTON' ||
          element.classList.contains('el-button') ||
          element.classList.contains('link') ||
          element.classList.contains('nav-item') ||
          element.classList.contains('logo') ||
          element.tagName === 'IMG' ||
          element.classList.contains('project-card') ||
          element.classList.contains('tech-tag') ||
          element.hasAttribute('role') && element.getAttribute('role') === 'button')) {
        isClickableElement = true;
      }
      
      element = element.parentElement;
    }
    
    // 根据元素类型设置光标样式，优先级：输入框 > 可点击元素 > 默认
    if (isInputElement) {
      cursor.classList.add('input-mode');
      cursorFollower.classList.add('input-mode');
      
      // 确保输入模式下的光标样式不会被其他样式覆盖
      cursor.classList.remove('clickable');
      cursorFollower.classList.remove('clickable');
    } else if (isClickableElement) {
      cursor.classList.remove('input-mode');
      cursorFollower.classList.remove('input-mode');
      
      // 恢复菱形光标样式
      cursor.classList.add('clickable');
      cursorFollower.classList.add('clickable');
    } else {
      // 重置为默认光标
      cursor.classList.remove('input-mode', 'clickable');
      cursorFollower.classList.remove('input-mode', 'clickable');
    }
  });

  // 启动光标动画
  let cursorAnimationFrame = requestAnimationFrame(updateCursor);

  // 在组件卸载时清理事件监听和动画帧
  onUnmounted(() => {
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mousedown', handleMouseDown);
    document.removeEventListener('mouseup', handleMouseUp);
    document.removeEventListener('mouseenter', handleMouseEnter);
    document.removeEventListener('mouseleave', handleMouseLeave);

    clickableElements.forEach(element => {
      element.removeEventListener('mouseenter', handleElementMouseEnter);
      element.removeEventListener('mouseleave', handleElementMouseLeave);
    });

    inputElements.forEach(element => {
      element.removeEventListener('mouseenter', handleInputMouseEnter);
      element.removeEventListener('mouseleave', handleInputMouseLeave);
    });

    cancelAnimationFrame(cursorAnimationFrame);
  });
});
</script>

<style>
/* 使用高优先级选择器彻底隐藏原生光标 */
html, body, *:not(#exclude-cursor) {
  cursor: none !important;
  -webkit-cursor: none !important;
  -moz-cursor: none !important;
  -ms-cursor: none !important;
}

/* 再次强制针对特定元素的光标设置 */
html, body, 
a, a *, 
button, button *, 
.el-button, .el-button *, 
input, input *, 
textarea, textarea *, 
select, select *, 
[role="button"], [role="button"] *,
.link, .link *, 
.nav-item, .nav-item *, 
.logo, .logo *, 
img,
.el-select, .el-select *,
.el-dropdown, .el-dropdown *,
.el-radio, .el-radio *,
.el-checkbox, .el-checkbox *,
.el-menu-item, .el-menu-item *,
.el-submenu, .el-submenu *,
.el-tabs, .el-tabs *,
.el-pagination, .el-pagination *,
.el-dialog__wrapper, .el-dialog__wrapper *,
.el-date-editor, .el-date-editor *,
.el-time-panel, .el-time-panel *,
.el-tree-node, .el-tree-node *,
.el-cascader, .el-cascader *,
.el-transfer, .el-transfer *,
.el-switch, .el-switch *,
.el-slider, .el-slider *,
.el-popover, .el-popover *,
.el-tooltip, .el-tooltip *,
.project-card, .project-card *,
.tech-tag, .tech-tag *,
li, li *,
tr, tr *,
td, td *,
.problems-list *, /* 题目列表 */
.problem-row, .problem-row *, /* 题目行 */
.problem-link, .problem-link *, /* 题目链接 */
.problem-name, .problem-name *, /* 题目名称 */
.problem-card, .problem-card *, /* 题目卡片 */
.question-item, .question-item *, /* 问题项 */
.question-title, .question-title *, /* 问题标题 */
.question-link, .question-link *, /* 问题链接 */
.question-card, .question-card *, /* 问题卡片 */
th, th *, /* 表头 */
tbody tr, tbody tr *, /* 表格行 */
.el-table *, /* Element UI表格 */
table, table *, /* 所有表格 */
div[onclick], div[onclick] *,
[class*="btn"], [class*="btn"] *,
[class*="button"], [class*="button"] *,
[class*="clickable"], [class*="clickable"] *,
[class*="selectable"], [class*="selectable"] *,
[class*="problem"], [class*="problem"] *, /* 含有problem的所有类 */
[class*="question"], [class*="question"] *, /* 含有question的所有类 */
[tabindex], [tabindex] * {
  cursor: none !important;
  -webkit-cursor: none !important;
  -moz-cursor: none !important;
  -ms-cursor: none !important;
}

/* 确保动态添加的元素也遵循光标隐藏规则 */
*[onclick], *[onclick] * {
  cursor: none !important;
}

/* 题目列表特定选择器 */
.problems-head *, .problems-body *, .problem-row *, .column-title *, .column-status *, .column-first *, .column-submit *, .column-rate * {
  cursor: none !important;
}

/* 使用:not选择器，确保在整个文档上应用 */
*:not(.cursor-exempt), *:not(.cursor-exempt) * {
  cursor: none !important;
}

/* 确保iOS设备上的链接和可点击元素也遵循规则 */
@supports (-webkit-touch-callout: none) {
  a, button, input, textarea, select, [role="button"], .link, .nav-item, .logo, img, [class*="btn"], [class*="button"] {
    cursor: none !important;
  }
}

/* 自定义光标样式 */
.custom-cursor {
  position: fixed;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: rgba(66, 185, 131, 0.4);
  pointer-events: none;
  mix-blend-mode: difference;
  z-index: 999999;
  transition: transform 0.2s cubic-bezier(0.215, 0.61, 0.355, 1), 
              background 0.2s ease,
              width 0.2s ease,
              height 0.2s ease,
              border-radius 0.2s ease;
  transform: translate(-50%, -50%);
  box-shadow: 0 0 10px rgba(66, 185, 131, 0.2), 0 0 2px rgba(255, 255, 255, 0.6);
  will-change: transform, left, top, width, height, border-radius;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
}

.cursor-follower {
  position: fixed;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(66, 185, 131, 0.15);
  pointer-events: none;
  z-index: 999998;
  transition: transform 0.3s cubic-bezier(0.215, 0.61, 0.355, 1), 
              background 0.3s ease,
              width 0.3s ease,
              height 0.3s ease,
              border-radius 0.3s ease;
  transform: translate(-50%, -50%);
  will-change: transform, left, top, width, height, border-radius;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
}

/* 点击效果 */
.custom-cursor.active {
  transform: translate(-50%, -50%) scale(0.7);
  background: rgba(66, 185, 131, 0.7);
  /* 点击时变成加号形状 */
  width: 10px;
  height: 10px;
  box-shadow: 
    0 0 0 2px rgba(66, 185, 131, 0.7),
    0 0 0 5px rgba(255, 255, 255, 0.3);
}

/* 悬停可点击元素效果 - 视觉上变成"可点击"箭头（菱形） */
.custom-cursor.clickable {
  width: 16px !important;
  height: 16px !important;
  background: rgba(66, 185, 131, 0.6) !important;
  border-radius: 4px !important;
  transform: translate(-50%, -50%) rotate(45deg) !important;
}

.cursor-follower.clickable {
  width: 32px !important;
  height: 32px !important;
  border-radius: 8px !important;
  transform: translate(-50%, -50%) rotate(45deg) scale(1.2) !important;
  background: rgba(66, 185, 131, 0.2) !important;
}

/* 点击时的动画效果增强 */
.cursor-follower.active {
  transform: translate(-50%, -50%) scale(1.2);
  opacity: 0.6;
}

/* 点击可点击元素时的效果 */
.custom-cursor.active.clickable {
  width: 8px !important;
  height: 8px !important;
  border-radius: 2px !important;
  transform: translate(-50%, -50%) rotate(45deg) scale(0.8) !important;
  background: rgba(66, 185, 131, 0.9) !important;
}

.cursor-follower.active.clickable {
  width: 24px !important;
  height: 24px !important;
  border-radius: 4px !important;
  transform: translate(-50%, -50%) rotate(45deg) scale(1.5) !important;
}

/* 聚焦效果 */
.focus-effect {
  position: fixed;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  pointer-events: none;
  z-index: -1;
  background: radial-gradient(circle at center,
      rgba(66, 185, 131, 0.15),
      rgba(66, 185, 131, 0) 70%);
  transition: opacity 0.3s ease, border-radius 0.3s ease, width 0.3s ease, height 0.3s ease;
  transform: translate(-50%, -50%);
  opacity: 0;
}

.focus-effect.active {
  opacity: 1;
  border-radius: 16px;
}

/* 光标样式 - 当鼠标在输入框内时 */
.custom-cursor.input-mode {
  width: 2px !important;
  height: 24px !important;
  background: rgba(66, 185, 131, 0.8) !important;
  border-radius: 1px !important;
  transform: translate(-50%, -50%) !important;
  box-shadow: 0 0 5px rgba(66, 185, 131, 0.4) !important;
}

.cursor-follower.input-mode {
  width: 6px !important;
  height: 30px !important;
  border-radius: 3px !important;
  background: rgba(66, 185, 131, 0.2) !important;
  transform: translate(-50%, -50%) !important;
}

/* 确保输入模式优先级高于其他状态 */
.custom-cursor.clickable.input-mode {
  width: 2px;
  height: 24px;
  background: rgba(66, 185, 131, 0.8);
  border-radius: 1px;
  transform: translate(-50%, -50%);
  box-shadow: 0 0 5px rgba(66, 185, 131, 0.4);
}

.cursor-follower.clickable.input-mode {
  width: 6px;
  height: 30px;
  border-radius: 3px;
  background: rgba(66, 185, 131, 0.2);
  transform: translate(-50%, -50%);
}

/* 在移动设备上不显示自定义鼠标并恢复默认光标 */
@media (max-width: 768px) {
  .custom-cursor,
  .cursor-follower,
  .focus-effect {
    display: none;
  }

  html, body, 
  a, a *, 
  button, button *, 
  .el-button, .el-button *, 
  input, input *, 
  textarea, textarea *, 
  select, select *, 
  [role="button"], [role="button"] *,
  .link, .link *, 
  .nav-item, .nav-item *, 
  .logo, .logo *, 
  img,
  .project-card, .project-card *,
  .tech-tag, .tech-tag *,
  [class*="btn"], [class*="btn"] *,
  [class*="button"], [class*="button"] * {
    cursor: auto !important; /* 在移动设备上恢复默认光标 */
  }
}
</style> 