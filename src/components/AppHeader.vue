<template>
  <v-app-bar app color="blue accent-4">
    <v-toolbar-title className="white--text">회사명/로고</v-toolbar-title>

    <v-spacer></v-spacer>

    <v-btn text to="/find-hospital" color="white" className="mx-2">병원찾기</v-btn>
    <v-btn text to="/realtime-consult" color="white" className="mx-2">실시간 상담</v-btn>
    <v-btn text to="/community" color="white" className="mx-2">커뮤니티</v-btn>
    <v-btn text to="/pet-service" color="white" className="mx-2">애견 서비스</v-btn>
    <v-btn text v-if="!isLoggedIn" to="/login" color="white" class="mx-2">로그인</v-btn>
    <v-btn text v-if="isLoggedIn" to="/mypage" color="white" className="mx-2">마이페이지</v-btn>
  </v-app-bar>
</template>

<script>
export default {
  data() {
    return {
      isLoggedIn: false,
    };
  },
};
</script>

<style scoped>
.v-btn:hover {
  background-color: rgba(255, 255, 255, 0.1) !important;
}
</style>
