import Vue from 'vue';
import Router from 'vue-router';

import FindHospital from '@/views/FindHospital.vue';
import RealtimeConsult from '@/views/RealtimeConsult.vue';
import Community from '@/views/Community.vue';
import FeedBoard from '@/components/FeedBoard.vue'
import TipBoard from '@/components/TipBoard.vue'
import PetService from '@/views/PetService.vue';
import LoginView from '@/views/LoginView.vue';  // 이미 있을 것으로 추정
import MyPage from '@/views/MyPage.vue';
import SignUp from "@/views/SignUp";

Vue.use(Router);

export default new Router({
    mode: 'history',
    routes: [
        {
            path: '/find-hospital',
            name: 'FindHospital',
            component: FindHospital
        },
        {
            path: '/realtime-consult',
            name: 'RealtimeConsult',
            component: RealtimeConsult
        },
        {
            path: '/community',
            name: 'Community',
            component: Community,
            children: [
                {
                    path: 'feed',
                    component: FeedBoard
                },
                {
                    path: 'tip',
                    component: TipBoard
                }
            ]
        },
        {
            path: '/pet-service',
            name: 'PetService',
            component: PetService,
        },
        {
            path: '/login',
            name: 'LoginView',
            component: LoginView
        },
        {
            path: '/signup',
            name: 'SignUp',
            component: SignUp
        },
        {
            path: '/mypage',
            name: 'MyPage',
            component: MyPage
        },
        {
            path: '*',  // 기본 경로 설정
            redirect: '/find-hospital'
        }
    ]
});
