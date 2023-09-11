<template>
    <h2>로그인중...</h2>
</template>

<script>
import Cookies from 'js-cookie';

export default {
    name: "OAuth2.vue",
    mounted() {
        // URL에서 토큰 값을 추출합니다.
        const urlParams = new URLSearchParams(window.location.search);
        const accessToken = urlParams.get('accessToken');
        const refreshToken = urlParams.get('refreshToken');
        console.log("AccessToken:", accessToken);
        console.log("RefreshToken:", refreshToken);
        // 해당 값이 존재하면 localStorage에 저장합니다.
        if (accessToken) {
            localStorage.setItem('accessToken', accessToken);
        }
        if (refreshToken) {
            Cookies.set("refreshToken", refreshToken, {expires: 7}); // expires: 유지 시간 (일 단위)
        }
        // 토큰을 저장한 후 메인 페이지로 리다이렉트합니다.
        window.location.href = '/';
    }
}
</script>

<style scoped>
/* 스타일을 여기에 작성하세요 */
</style>