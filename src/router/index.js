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
import TipDetail from "@/components/TipDetail.vue";
import TipCreate from "@/components/TipCreate.vue";
import TipEdit from "@/components/TipEdit.vue";

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
        path: '/community/tip/create',
        name: 'TipCreate',
        component: TipCreate,
    },
    {
        path: '/community/tip/:id',
        name: 'TipDetail',
        component: TipDetail
    },
    {
        path: '/community/tip/edit/:id',
        name: 'TipEdit',
        component: TipEdit
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
},
    {
        path: '/community/tip/edit/:id',
        name: 'TipEdit',
        component: () => import('@/components/TipEdit.vue'),
    },
);

router.beforeEach((to, from, next) => {
    // 백엔드에 요청을 보냅니다.
    axios.get('/users/my-profile')
        .then(response => {
            const user = response.data;
            console.log(user)
            store.commit('setId', user.id)
            store.commit('setUsername', user.username)
            store.commit('setUserRole', user.role);
            store.commit('setNickname', user.nickname);
            store.commit('setImageUrl', user.imageUrl);
            store.commit('setEmail', user.email);
            next(); // 요청이 성공하면 다음 라우터로 이동합니다.
        })
        .catch(error => {
            console.error("Error checking user:", error);
            // 사용자 확인이 실패하면 로그인 페이지로 리다이렉트 할 수 있습니다.
            // next('/login');
            next(); // 혹은 그냥 다음 라우터로 이동합니다.
        });
});

export default router;
