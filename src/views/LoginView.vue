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
            <v-btn text color="green" @click="goToSignUp">회원가입</v-btn>
          </v-card-actions>
          <div class="form-group d-flex justify-content-center">
            <a href="http://localhost:8080/oauth2/authorize/google?redirect_uri=http://localhost:8080/login/oauth2/code/google">
              <img class="bi me2" width="55" height="55" src="../assets/google.png" />
            </a>
            <a href="http://localhost:8080/oauth2/authorize/naver?redirect_uri=http://localhost:8080/login/ouath2/code/naver">
              <img class="bi me2" width="55" height="55" src="../assets/naver.png" />
            </a>
            <a href="http://localhost:8080/oauth2/authorize/kakao?redirect_uri=http://localhost:8080/login/oauth2/code/kakao">
              <img class="bi me2" width="55" height="55" src="../assets/kakao.png" />
            </a>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>


<script>
import axios from "@/axios/axios-instance";

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
        await axios.post("/users/login", data)
            .then(response => {
                  console.log(response.headers)
                  const accessToken = response.headers.get("authorization")
                  window.localStorage.setItem('accessToken', accessToken)

                  // const refreshToken = response.headers.get("RefreshToken");
                  // if (accessToken !== undefined && refreshToken !== undefined) {
                  //   window.localStorage.setItem('accessToken', accessToken)
                  //   Cookies.set("refreshToken", refreshToken)
                  //   window.location.href = '/home'
                  // }
                  this.$router.push("/");
                }
            )
      } catch (error) {
        alert(error.response.data)
        console.log(error.response.data);
      }
    },
    goToSignUp() {
      this.$router.push("/signup");  // 회원가입 라우트로 이동합니다. 경로는 필요에 따라 변경해주세요.
    }
  }
};
</script>

<style scoped>
/* 필요한 경우 스타일을 추가하세요. */
</style>
