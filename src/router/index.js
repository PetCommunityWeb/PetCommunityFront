import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

const routes = [
    // {
    //     path: '/find-hospital',
    //     name: 'FindHospital',
    //     component: () => import('@/views/FindHospital.vue')
    // },
    // {
    //     path: '/realtime-consult',
    //     name: 'RealtimeConsult',
    //     component: () => import('@/views/RealtimeConsult.vue')
    // },
    // {
    //     path: '/community',
    //     name: 'Community',
    //     component: () => import('@/views/Community.vue')
    // },
    // {
    //     path: '/pet-service',
    //     name: 'PetService',
    //     component: () => import('@/views/PetService.vue')
    // },
    {
        path: '/login',
        name: 'Login',
        component: () => import('../views/LoginView.vue')
    },
    // {
    //     path: '/mypage',
    //     name: 'MyPage',
    //     component: () => import('@/views/MyPage.vue')
    // },
    // {
    //     path: '*',
    //     redirect: '/find-hospital'  // 기본 경로 설정
    // }
];

export default new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
});
