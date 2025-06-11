import { createApp } from 'vue';
import App from './App.vue';
import router from './router';  // 导入路由配置
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
// 引入自定义全局样式（放在Element Plus样式之后以便覆盖）
import './assets/styles.css'
import store from './utils/store'  // 导入 Vuex store
import backgroundState from './utils/backgroundState'; // 导入背景状态管理

// 禁用右键菜单
document.addEventListener('contextmenu', (event) => {
  event.preventDefault();
  return false;
}, { capture: true });

const app = createApp(App)
app.use(router)  // 使用路由
app.use(ElementPlus)  // 使用 Element Plus
app.use(store)
app.mount('#app')

// 在窗口卸载前清理资源
window.addEventListener('beforeunload', () => {
  backgroundState.cleanup();
});