import { createApp } from 'vue';
import App from './App.vue';
import router from './router';  // 导入路由配置
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import store from './utils/store'  // 导入 Vuex store

const app = createApp(App)
app.use(router)  // 使用路由
app.use(ElementPlus)  // 使用 Element Plus
app.use(store)
app.mount('#app')