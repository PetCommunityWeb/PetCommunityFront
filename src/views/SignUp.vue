<template>
  <v-container fluid fill-height class="grey lighten-3"> <!-- 배경색 추가 -->
    <v-row justify="center" align="center">
      <v-col cols="12" md="6">
        <v-card class="elevation-12"> <!-- 카드 그림자 추가 -->
          <v-card-title class="blue--text text--darken-3">회원가입</v-card-title> <!-- 제목의 배경색 및 글자색 변경 -->
          <v-card-text>
            <v-form>
              <v-text-field
                  label="Username"
                  required
                  v-model="username"
              ></v-text-field>

              <v-text-field
                  label="Password"
                  type="password"
                  required
                  v-model="password"
              ></v-text-field>

              <v-text-field
                  label="Nickname"
                  required
                  v-model="nickname"
              ></v-text-field>

              <v-text-field
                  label="Email"
                  required
                  v-model="email"
              ></v-text-field>
              <v-radio-group v-model="isOwner">
                <v-radio label="OWNER" value="true"></v-radio>
                <v-radio label="USER" value="false"></v-radio>
              </v-radio-group>
              <v-btn color="blue darken-1" dark @click="submitForm">회원가입</v-btn> <!-- 버튼 색상 변경 -->
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from "@/axios/axios-instance";

export default {
  name: "SignUp",
  data() {
    return {
      username: "",
      password: "",
      nickname: "",
      email: "",
      isOwner: "false" // Default to 'false' or 'Not OWNER'
    };
  },
  methods: {
    submitForm() {
      const userInfo = {
        username: this.username,
        password: this.password,
        nickname: this.nickname,
        email: this.email,
        role: this.isOwner === "true" ? "OWNER" : "USER"
      }
      axios.post("/users/signup", userInfo)
          .then(response => {
            console.log(response);
            alert('회원가입 성공')
            this.$router.push('/login')
          })
          .catch(error => {
            console.log(error);
            alert(error.response.data)
          })
      // TODO: 회원가입 로직 구현
      console.log("Form Submitted:", {
        username: this.username,
        password: this.password,
        nickname: this.nickname,
        email: this.email
      });
    }
  }
};
</script>

<style scoped>

</style>