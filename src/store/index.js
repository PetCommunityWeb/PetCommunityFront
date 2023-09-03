import Vue from 'vue';
import Vuex from 'vuex';
import Cookies from "js-cookie";
import user from './modules/user';
import {eventBus} from "@/main";
import axios from "axios"; // user 모듈 임포트

Vue.use(Vuex);

export default new Vuex.Store({
    modules: {
        user,
    },
    state: {
        id: null,
        username: null,
        role: null,
        nickname: null,
        email: null,
        imageUrl: null,
        likeCount: 0,
        liked: false
    },
    mutations: {
        setId(state, id) {
            state.id = id;
        },
        setUsername(state, username) {
            state.username = username;
        },
        setUserRole(state, role) {
            state.role = role;
        },
        setNickname(state, nickname) {
            state.nickname = nickname;
        },
        setEmail(state, email) {
            state.email = email;
        },
        setImageUrl(state, imageUrl) {
            state.imageUrl = imageUrl;
        },
        logout(state) {
            state.role = null;
        },
        updateLike(state, {liked, likeCount}) {
            state.liked = liked;
            state.likeCount = likeCount;
        },
    },
    actions: {
        logout({commit}) {
            commit('logout');
            localStorage.removeItem('accessToken');
            console.log(localStorage.getItem('accessToken'))
            Cookies.remove('refreshToken');
            // 루트('/') 경로로 이동
            this.$router.push('/');
        },
        async updateLike({commit}, {liked, likeCount}) {
            try {
                const id = this.$route.params.id; // 이 위치에서 id를 추출
                const response = await axios.post(`/tips/${id}/likes`);
                if (response.data.msg === '성공') {
                    liked = !liked; // 상태 토글
                    likeCount = liked ? likeCount + 1 : likeCount - 1;
                    commit('updateLike', {liked, likeCount});
                    eventBus.$emit('like-updated', {id, liked, likeCount});
                } else if (response.data.msg === '취소') {
                    // ...
                } else {
                    alert(response.data.msg);
                }
            } catch (error) {
                alert('좋아요 중 오류가 발생했습니다. 다시 시도해 주세요.');
            }
        }
    }
})
;