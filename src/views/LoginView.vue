<template>
  <v-container fluid class="fill-height">
    <v-row justify="center" align="center" class="fill-height">
      <v-col cols="12" sm="8" md="4">
        <v-card class="pa-5" elevation="12">
          <v-card-title class="blue--text text--darken-3">로그인</v-card-title>
          <v-text-field
              v-model="username"
              label="Username"
              required
              color="blue"
          ></v-text-field>
          <v-text-field
              v-model="password"
              label="Password"
              type="password"
              required
              color="blue"
          ></v-text-field>
          <v-card-actions>
            <v-btn color="blue darken-1" dark @click="login">로그인</v-btn>
            <v-btn text color="green" @click="goToSignUp">회원 가입</v-btn>
            <v-btn text color="red"  @click="goToRecovery"> 탈퇴 회원 복구</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>


<script>
import axios from "@/axios/axios-instance";
import Cookies from 'js-cookie';
import store from "@/store"; // Vuex 스토어를 임포트합니다.

export default {
  name: "LoginView",
  data() {
    return {
      username: "",
      password: "",
    };
  },
  methods: {
    async login() {
      const data = {
        username: this.username,
        password: this.password,
      };
      try {
        const response = await axios.post("/users/login", data);
        const accessToken = response.headers['authorization'];
        const refreshToken = response.headers.get('refreshToken')
        if (accessToken && refreshToken) {
          console.log("성공")
          window.localStorage.setItem('accessToken', accessToken);
          Cookies.set("refreshToken", refreshToken);
          await this.$router.push("/");
        }
      } catch (error) {
        alert(error.response.data.msg);
      }
    },
    goToSignUp() {
      this.$router.push("/signup");  // 회원가입 라우트로 이동합니다. 경로는 필요에 따라 변경해주세요.
    },
    goToRecovery() {
        this.$router.push("/restoreProfile")

    }
  }
};
</script>

<style scoped>
/* 필요한 경우 스타일을 추가하세요. */
</style>
