import { createApp } from 'vue';
import App from './App.vue';
import router from './router';  // 导入路由配置
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
// 引入自定义全局样式（放在Element Plus样式之后以便覆盖）
import './assets/styles.css'
import store from './utils/store'  // 导入 Vuex store
import backgroundState from './utils/backgroundState'; // 导入背景状态管理
import axios from 'axios';

const app = createApp(App)
app.use(router)  // 使用路由
app.use(ElementPlus)  // 使用 Element Plus
app.use(store)
app.mount('#app')

// 在窗口卸载前清理资源
window.addEventListener('beforeunload', () => {
  backgroundState.cleanup();
});

// 心跳检测函数
function startHeartbeat() {
  // 立即发送一次
  axios.post('/api/heartbeat').then(res => {
    // 可选：处理返回
    console.log('心跳包:', res.data);
  }).catch(err => {
    // 可选：处理错误
    // console.error('心跳包发送失败:', err);
  });

  // 每60秒发送一次
  setInterval(() => {
    axios.post('/api/heartbeat').then(res => {
      // 可选：处理返回
      // console.log('心跳包:', res.data);
    }).catch(err => {
      // 可选：处理错误
      // console.error('心跳包发送失败:', err);
    });
  }, 60000);
}
startHeartbeat();