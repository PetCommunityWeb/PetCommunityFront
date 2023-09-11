<template>
  <h2>로그인중...</h2>
</template>

<script>
import Cookies from 'js-cookie';

export default {
  name: "OAuth2.vue",
  mounted() {
    // 쿠키에서 Authorization 값을 읽습니다.
    const authorizationToken = Cookies.get('Authorization');
    console.log(authorizationToken)
    // 해당 값이 존재하면 localStorage에 저장합니다.
    if (authorizationToken) {
      localStorage.setItem('accessToken', authorizationToken);
      Cookies.remove('Authorization')
      window.location.href = '/'
    }
  }
}
</script>

<style scoped>
/* 스타일을 여기에 작성하세요 */
</style>
