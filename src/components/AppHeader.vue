<template>
  <v-app-bar app color="blue accent-4">
    <v-toolbar-title className="white--text">
      <router-link to="/" class="toolbar-title-link">
        Pet병
      </router-link>
    </v-toolbar-title>
    <NotificationIcon v-if="isLoggedIn"></NotificationIcon>

    <v-spacer></v-spacer>

    <v-btn text to="/find-hospital" color="white" className="mx-2">병원찾기</v-btn>
    <v-btn text to="/realtime-consult" color="white" className="mx-2">실시간 상담</v-btn>
    <v-btn text to="/community" color="white" className="mx-2">커뮤니티</v-btn>
    <v-btn text to="/pet-service" color="white" className="mx-2">애견 서비스</v-btn>
    <v-btn text v-if="isLoggedIn && role === 'OWNER'" to="/management" color="white" className="mx-2">병원관리</v-btn>
    <v-btn text v-if="!isLoggedIn" to="/login" color="white" class="mx-2">로그인</v-btn>
    <v-btn text v-if="isLoggedIn" to="/mypage" color="white" className="mx-2">마이페이지</v-btn>
    <v-btn text v-if="isLoggedIn" @click="logout" color="white" className="mx-2">로그아웃</v-btn> <!-- 로그아웃 버튼 추가 -->

  </v-app-bar>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import NotificationIcon from '@/components/NotificationIcon.vue'; // 경로에 따라 경로를 조정해야 합니다.

export default {
  components: {
    NotificationIcon
  },
  computed: {
    ...mapState({
      isLoggedIn: state => !!state.role,
      role: state => state.role
    })
  },
  methods: {
    ...mapActions(['logout']),
  }
};
</script>
<style scoped>
.toolbar-title-link {
  text-decoration: none; /* 밑줄 제거 */
  color: white; /* 텍스트 색상 */
  font-weight: bold; /* 글씨 두께 */
  font-size: 1.5rem; /* 글씨 크기 */
  transition: color 0.3s ease; /* 색상 전환 효과 */
}

.toolbar-title-link:hover {
  color: rgba(255, 255, 255, 0.7); /* 마우스 오버 시 색상 */
}
</style>
