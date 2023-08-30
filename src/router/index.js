import Vue from 'vue';
import Vuex from 'vuex'
import Router from 'vue-router';
import axios from "@/axios/axios-instance";
import store from '@/store';  // 스토어 임포트

import FindHospital from '@/views/FindHospital.vue';
import RealtimeConsult from '@/views/RealtimeConsult.vue';
import ChatRoom from "@/views/ChatRoom";
import Community from '@/views/Community.vue';
import FeedBoard from '@/components/FeedBoard.vue';
import TipBoard from '@/components/TipBoard.vue';
import PetService from '@/views/PetService.vue';
import LoginView from '@/views/LoginView.vue';
import MyPage from '@/views/MyPage.vue';
import SignUp from "@/views/SignUp";
import HospitalManagement from "@/views/HospitalManagement";
import HospitalDetail from "@/views/HospitalDetail";

Vue.use(Router);
Vue.use(Vuex)
const routes = [
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
        path: '/chatroom',
        name: 'ChatRoom',
        component: ChatRoom
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
      path: '/management',
      name: 'Management',
      component: HospitalManagement
    },
    {
        path: '/hospital/:id',
        name: 'HospitalDetail',
        component: HospitalDetail
    },
    {
        path: '*',  // 기본 경로 설정
        redirect: '/find-hospital'
    }
];

const router = new Router({
    mode: 'history',
    routes
});

export default router;
