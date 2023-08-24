<template>
  <div>
    <h1>내 정보</h1>
    <p>이름: {{ userInfo.name }}</p>
    <p>이메일: {{ userInfo.email }}</p>
    <!-- 추가 정보 필드는 여기에 추가하세요 -->
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: "MyPage",
  computed: {
    ...mapState(['userInfo'])
  }
}
</script>

<style scoped>
/* 스타일 추가 */
</style>
