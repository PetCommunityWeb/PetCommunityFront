<template>
    <div align="center">
        <h1>탈퇴 회원 복구 서비스 입니다.</h1>
        <h2>이메일 인증이 완료되면 해당 데이터가 복구됩니다.</h2><br>
        <div class="information">
            <P>도움말</P>
            <P>1. 탈퇴한 회원에 한하여 회원 정보 복구가 가능합니다.</P>
            <P>2. 가입 시 입력한 이메일 주소를 입력해주세요.</P>
            <P>3. 메일로 온 코드 인증 후 복구가 진행됩니다.</P>
        </div>
        <div class="input-section">
            <input v-model="email" style="border: black solid" placeholder="이메일 주소"/><br>
            <button class="second-button" @click="requestVerification">메일 전송 요청</button>
            <div v-if="isEmailSent" style="padding: 5px">메일 전송이 완료되었습니다.</div>
            <br><br>
            <input v-model="verificationCode" style="border: black solid" placeholder="인증 코드"/> <br>
            <button class="second-button" @click="verifyEmail">이메일 인증하기</button>
            <div v-if="isEmailVerified" style="padding: 15px">이메일 인증이 완료되었습니다.</div>
        </div>
        <div v-if="isEmailVerified">
            <div style="padding: 15px">내 데이터를 복구 할 수 있습니다.</div>
            <button class="second-button" @click="restoreData(email)">데이터 복구</button>
        </div>
    </div>
</template>

<script>
import axios from '@/axios/axios-instance'; // 필요하다면 경로를 수정하세요

export default {
    data() {
        return {
            email: "",
            verificationCode: "",
            isEmailSent: false, // 이메일 전송 확인
            isEmailVerified: false, // 이메일 인증 확인
        };
    },
    methods: {
        async requestVerification() {
            // 이메일 인증 요청 처리 로직 구현
            try {
                const response = await axios.post("/email/send-verification?email=" + this.email);

                if (response.status == 200) {
                    this.isEmailSent = true; // 성공적으로 이메일 요청을 보냈을 때
                } else {
                    // 실패시 처리
                    console.error("이메일 인증 요청 실패");
                }
            } catch (error) {
                //오류 처리
                console.error("이메일 인증 요청 오류:", error);
                alert("이메일 전송에 실패했습니다. 메일주소를 확인하고 다시 시도해주세요.");
            }
        },

        async verifyEmail() {
            try {
                // 이메일 인증 코드 확인 요청 보내고 성공 여부를 확인
                const response = await axios.post("/email/email-check", {
                    email: this.email,
                    verificationCode: this.verificationCode,
                });

                if (response.status === 200) {

                    this.isEmailVerified = true;
                } else {
                    console.error("이메일 인증 실패");
                }
            } catch (error) {
                console.error("이메일 인증 오류:", error);
                alert("이메일 인증에 실패했습니다. 인증번호를 확인해주세요");
            }
        },
        async restoreData(email) {

            try {
                const formData = new FormData();
                formData.append('email',email)

                const response = await axios.post(`/users/profile/restore`, formData, {
                    headers: {
                        'Content-Type' : 'application/x-www-form-urlencoded'
                    }
                });

                if (response.status === 200) {
                    console.log("데이터 복구 성공");
                    alert("회원 데이터가 복구되었습니다. 로그인 해주세요.");
                    // 성공 시 사용자에게 알림 또는 리디렉션 등을 수행할 수 있음
                } else {
                    console.error("데이터 복구 실패");
                }
            } catch (error) {
                console.error("데이터 복구 오류:", error);
            }
        },

        async getUserIdByEmail(email) {
            try {
                const response = await axios.get(`/getUserIdByEmail?email=${email}`);
                if (response.status === 200) {
                    return response.data;
                } else {
                    console.error("사용자 ID 조회 실패");
                    return null;
                }
            } catch (error) {
                console.error("사용자 ID 조회 오류:", error);
                return null;
            }
        }

    }
}
</script>
<style scoped>
.information {
    padding: 10px;
    border: black solid;
    width: 400px;
    margin-bottom: 15px;

}

.input-section {
    padding: 20px;
    border: black solid;
    width: 400px;
}

.second-button {
    color: black;
    font-stretch: condensed;
    font-weight: bold; /* 글자 두께 설정 */
    padding: 10px;
    background-color: darkseagreen;
    margin: 10px 0 0 0;
    border-radius: 5px;


}
</style>