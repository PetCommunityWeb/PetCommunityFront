import axios from 'axios';
import Cookies from 'js-cookie';
import { mapActions } from 'vuex';
import store from '@/store';

const instance = axios.create({
    baseURL:`${process.env.VUE_APP_SERVER_URL}`, // baseURL 설정
    // 기타 필요한 설정 추가
});

instance.interceptors.request.use(
    async (config) => {
        let accessToken = window.localStorage.getItem('accessToken');
        const refreshToken = Cookies.get('refreshToken');

        if (accessToken) {
            config.headers['Authorization'] = accessToken;
        }

        if (refreshToken) {
            config.headers['RefreshToken'] = refreshToken;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

instance.interceptors.response.use(
    (response) => {
        if (response.data.msg === "refreshToken이 만료되었습니다.") {
            // alert(response.data.msg); 사용자가 refresh Token 관련 msg를 알 필요가 없다
            store.dispatch('logout'); // 로그아웃 액션 호출
        }
        const newAccessToken = response.headers['authorization'];
        if (newAccessToken) {
            window.localStorage.setItem('accessToken', newAccessToken);
        }
        return response;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default instance;