<template>
    <v-container fluid fill-height class="grey lighten-3"> <!-- 배경색 추가 -->
        <v-row justify="center" align="center">
            <v-col cols="12" md="6">
                <v-card class="elevation-12"> <!-- 카드 그림자 추가 -->
                    <v-card-title class="blue--text text--darken-3">
                        회원가입 <span class="subtitle">(필수 입력 정보입니다.)</span>
                    </v-card-title>
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
            if (!this.username || !this.password || !this.nickname || !this.email) {
                alert('모든 필수 입력 필드를 채워주세요.');
                return; // 필수 입력 필드가 누락되면 함수를 종료
            }
            const userInfo = {
                username: this.username,
                password: this.password,
                nickname: this.nickname,
                email: this.email,
                role: this.isOwner === "true" ? "OWNER" : "USER"
            }
            axios.post("/users/signup", userInfo)
                .then(response => {
                    if (response.status === 201) {
                        alert('회원가입 성공'); // 서버 응답이 성공인 경우에만 출력
                        this.$router.push('/login');
                    } else {
                        alert('회원가입 실패, 입력값을 확인하세요'); // 서버 응답이 실패인 경우에만 출력
                    }
                })
                .catch(error => {
                    console.log(error.response.msg);
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
.blue--text {
    padding: 15px;
    height: 50px;
}

.subtitle {
    font-size: 10px;
    margin-left: 10px;
    height: 35px;
    color: red;
}
</style>