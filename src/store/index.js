import Vue from 'vue';
import Vuex from 'vuex';
import Cookies from "js-cookie";
import router from "@/router";  // 경로는 실제 라우터 파일의 위치에 따라 다를 수 있습니다.

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        id: null,
        username: null,
        user: null,
        role: null,
        nickname: null,
        email: null,
        imageUrl: null,
        likeCount: 0,
        liked: false,
        likes: {}, // 좋아요 상태를 객체로 저장
        // currentUserId: null, // 현재 사용자의 ID를 저장할 상태 속성


    },
    mutations: {
        setId(state, id) {
            state.id = id;
        },
        setUsername(state, username) {
            state.username = username;
        },
        setUser(state, user) {
            state.user = user;
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
            state.id = null;
            state.username = null;
            state.role = null;
            state.nickname = null;
            state.email = null;
            state.imageUrl = null;
        },
        setLike(state, { postId, liked }) {
            // 좋아요 상태 업데이트
            Vue.set(state.likes, postId, liked);
        },
        updateLike(state, { postId, liked }) {
            Vue.set(state.likes, postId, liked);
        },
    },
    actions: {
        logout({ commit }) {
            commit('logout');
            localStorage.removeItem('accessToken');
            console.log(localStorage.getItem('accessToken'))
            Cookies.remove('refreshToken');
            router.push('/').catch(err => {
                if (err.name !== 'NavigationDuplicated') {
                    throw err;
                }
            });
        }
    }
});