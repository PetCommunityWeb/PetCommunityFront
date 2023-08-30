import Vue from 'vue';
import Vuex from 'vuex';
import Cookies from "js-cookie";
import router from "@/router";  // 경로는 실제 라우터 파일의 위치에 따라 다를 수 있습니다.

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        id: null,
        username: null,
        role: null,
        nickname: null,
        email: null,
        imageUrl: null
    },
    mutations: {
        setId(state, id) {
          state.id = id;
        },
        setUsername(state, username){
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
            state.id = null;
            state.username = null;
            state.role = null;
            state.nickname = null;
            state.email = null;
            state.imageUrl = null;
        }
    },
    actions: {
        logout({ commit }) {
            commit('logout');
            localStorage.removeItem('accessToken');
            console.log(localStorage.getItem('accessToken'))
            Cookies.remove('refreshToken');
            // 루트('/') 경로로 이동
            router.push('/');
        }
    }
});