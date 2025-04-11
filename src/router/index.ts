import { createRouter, createWebHistory } from "vue-router";

// 定义路由规则
const routes = [
    {
        path: "/nav/home",
        name: "home",
        component: () => import("@/views/nav/home.vue"),
        alias: "/"
    },{
        path: "/nav/competition",
        name: "competition",
        component: () => import("@/views/nav/competition.vue"),
    },{
        path: "/nav/question",
        name: "question",
        component: () => import("@/views/nav/question.vue"),
    },{
        path: "/nav/questions_detail",
        name: "questions_detail",
        component: () => import("@/views/nav/questions_detail.vue"),
    },{
        path: "/account/login",
        name: "login",
        component: () => import("@/views/account/login.vue"),
    },{
        path: "/account/register",
        name: "register",
        component: () => import("@/views/account/register.vue"),
    },{
        path: "/contest/problems",
        name: "problems",
        component: () => import("@/views/contest/problems.vue"),
    },{
        path: "/contest/ranks",
        name: "ranks",
        component: () => import("@/views/contest/ranks.vue"),
    },{
        path: "/user/profile",
        name: "profile",
        component: () => import("@/views/user/profile.vue"),
        meta: { requiresAuth: true }
    },{
        path: "/user/manager",
        name: "manager",
        component: () => import("@/views/user/manager.vue"),
    },{
        path: "/user/mproblem",
        name: "mproblem",
        component: () => import("@/views/user/mproblem.vue"),
    },{
        path: "/user/mrace",
        name: "mrace",
        component: () => import("@/views/user/mrace.vue"),
    }
];

// 创建路由实例
const router = createRouter({
    history: createWebHistory(), // 使用 HTML5 模式（无 # 号）
    routes, // 传入路由规则
});

// 导出路由
export default router;

// 路由守卫
import { checkAuth } from '@/utils/auth';

router.beforeEach(async (to) => {
    if (to.meta.requiresAuth) {
      const { authenticated } = await checkAuth();
      if (!authenticated) {
        return {
          path: '/account/login',
          query: { redirect: to.fullPath }
        };
      }
    }
});