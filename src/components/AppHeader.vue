<template>
    <v-app-bar app color="beige">
        <v-toolbar-title className="white--text">
            <router-link to="/" class="toolbar-title-link">
                <v-img src="/paw.png" class="mr-2"></v-img>
            </router-link>
        </v-toolbar-title>
        <NotificationIcon v-if="isLoggedIn" class="ml-16"></NotificationIcon>

        <v-spacer></v-spacer>
        <div class="menu-button">
            <v-btn text to="/find-hospital" class="custom-button">
                <v-icon left>mdi-map-search</v-icon>
                병원 찾기
            </v-btn>

            <v-btn text to="/realtime-consult" class="custom-button">
                <v-icon left>mdi-chat</v-icon> 실시간 상담
            </v-btn>
            <v-btn text to="/community" class="custom-button">
                <v-icon left>mdi-forum</v-icon> 커뮤니티
            </v-btn>
            <v-btn text to="/pet-service" class="custom-button">
                <v-icon left>mdi-dog</v-icon> 반려동물 서비스
            </v-btn>
            <v-btn text v-if="isLoggedIn && role === 'OWNER'" to="/management" class="custom-button">
                <v-icon left>mdi-hospital-building</v-icon> 병원 관리
            </v-btn>
            <v-btn text v-if="!isLoggedIn" to="/login" class="custom-button">
                <v-icon left>mdi-login</v-icon> 로그인
            </v-btn>
            <v-btn text v-if="isLoggedIn" to="/mypage" class="custom-button">
                <v-icon left>mdi-account-circle</v-icon> 마이 페이지
            </v-btn>
            <v-btn text v-if="isLoggedIn" @click="logout" class="custom-button">
                <v-icon left>mdi-logout</v-icon> 로그아웃
            </v-btn>
        </div>
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
@font-face {
    font-family: '버튼글꼴'; /* 원하는 폰트 이름 */
    src: url('/src/views/fonts/a옛날사진관3.ttf') format('truetype'); /* 폰트 파일 경로 및 포맷 */
    /* 다른 포맷에 따라 format 속성 변경 가능 */
    font-weight: 400; /* 폰트 두께 설정 */
    font-style: normal; /* 폰트 스타일 설정 (normal, italic 등) */
}
.menu-button{
    font-family: "버튼글꼴";
}
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
/*------------홈버튼*/
.mr-2 {
    width: 80px;
    height: 80px;
}

.mr-2 {
    -webkit-filter: grayscale(0) blur(0);
    filter: grayscale(0) blur(0);
    -webkit-transition: .3s ease-in-out;
    transition: .3s ease-in-out;
}
.mr-2:hover {
    -webkit-filter: grayscale(100%) blur(3px);
    filter: grayscale(100%) blur(3px);
}
/*----------------*/
.custom-button {
    color: black;
    font-stretch: condensed;
    font-weight: bold; /* 글자 두께 설정 */
    margin: 0 5px; /* 원하는 간격 설정 */
}
</style>
