import axios from 'axios';
import Cookies from 'js-cookie';
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
        const newAccessToken = response.headers['authorization'];
        if (newAccessToken) {
            window.localStorage.setItem('accessToken', newAccessToken);
        }
        return response;
    },
    (error) => {
        alert(error.response.data.msg)
        if (error.response.data === "refreshToken is expired") {
            store.dispatch('logout'); // 로그아웃 액션 호출
        }
        return Promise.reject(error);
    }
);

export default instance;