import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  // 新增 server 配置
  server: {
    proxy: {
      // 代理所有以 /api 开头的请求
      '/api': {
        target: 'http://localhost:5000', // Flask 后端地址
        changeOrigin: true, // 允许跨域
      },
      // 后端 Swagger 文档（flask-restx），页脚「API接口」链接使用
      '/oj-master': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
});
