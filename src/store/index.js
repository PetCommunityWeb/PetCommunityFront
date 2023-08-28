import Vue from 'vue';
import Vuex from 'vuex';
import Cookies from "js-cookie";

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        id: null,
        role: null,
        nickname: null,
        email: null,
        imageUrl: null
    },
    mutations: {
        setId(state, id) {
          state.id = id;
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
        }
    },
    actions: {
        logout({ commit }) {
            commit('logout');
            localStorage.removeItem('accessToken');
            console.log(localStorage.getItem('accessToken'))
            Cookies.remove('refreshToken');
            // 루트('/') 경로로 이동
            this.$router.push('/');
        }
    }
});