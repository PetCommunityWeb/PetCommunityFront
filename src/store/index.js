import Vue from 'vue';
import Vuex from 'vuex';
// import Cookies from "js-cookie";
// import {eventBus} from "@/main";
// import axios from "axios"; // user 모듈 임포트
// import currentUser from "@/store/modules/currentUser"; // 모듈 파일 경로



Vue.use(Vuex);

// const currentUser = {
//     state: {
//         currentUserId: null, // 초기에는 로그인되지 않은 상태로 설정
//     },
//     mutations: {
//         setCurrentUserId(state, userId) {
//             state.currentUserId = userId; // currentUserId를 설정하는 mutation
//         },
//     },
//     getters: {
//         getCurrentUserId: state => state.currentUserId,
//         // ...
//     },
// }



export default new Vuex.Store({
    modules: {
        // currentUser,

    },
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
            state.role = null;
        },
        setLike(state, { postId, liked }) {
            // 좋아요 상태 업데이트
            Vue.set(state.likes, postId, liked);
        },
        updateLike(state, { postId, liked }) {
            Vue.set(state.likes, postId, liked);
        },
        // setCurrentUserId(state, userId) {
        //     state.currentUserId = userId;
        // },

    },
    getters: {
        // getCurrentUserId: (state) => state.currentUserId,
    },
    actions: {
        // logout({commit}) {
        //     commit('logout');
        //     localStorage.removeItem('accessToken');
        //     console.log(localStorage.getItem('accessToken'))
        //     Cookies.remove('refreshToken');
        //     // 루트('/') 경로로 이동
        //     this.$router.push('/');
        // },
        // async login({ commit }, credentials) {
        //     try {
        //         const response = await axios.post("/users/login", credentials);
        //         commit("setUser", response.data.user); // 사용자 정보 설정
        //         commit("setCurrentUserId", response.data.user.id); // 현재 사용자 ID 설정
        //     } catch (error) {
        //         console.error("Login error:", error);
        //         throw error;
        //     }
        // },
        // async updateLike({ commit }, { liked, likeCount }) {
        //     try {
        //         const id = this.$route.params.id;
        //         const response = await axios.post(`/tips/${id}/likes`);
        //         if (response.data.msg === '성공') {
        //             liked = !liked; // 상태 토글
        //             likeCount = liked ? likeCount + 1 : likeCount - 1;
        //             commit('updateLike', { postId: id, liked });
        //             eventBus.$emit('like-updated', { id, liked, likeCount });
        //         } else if (response.data.msg === '취소') {
        //             // ...
        //         } else {
        //             alert(response.data.msg);
        //         }
        //     } catch (error) {
        //         alert('좋아요 중 오류가 발생했습니다. 다시 시도해 주세요.');
        //     }
        // }
    },

});


