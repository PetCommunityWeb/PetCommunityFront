<template>
    <v-container fluid fill-height class="white lighten-3"> <!-- 배경색 추가 -->

        <!--프로필 수정 방식으로 만들어보기-->
        <div>
            <div id=profile>
                <h1>내 정보
                    <v-btn @click="openDialog">내 정보 수정하기</v-btn>
                </h1>
                <p>이름: {{ nickname }}</p>
                <p>이메일: {{ email }}</p>
                <p>내 사진</p>
                <!-- 이미지 표시 -->
                <v-img :src="imageUrl" alt="유저 이미지" height="200" width="300"></v-img>
                <p>내 소개: {{ introduction }}</p>
            </div>
            <div id=document>
                <p>내가 좋아요 한 피드</p>
                <p>내가 단 댓글</p>
            </div>
        </div>


        <!--        내 정보 수정하기 버튼을 눌렀을때 나오는 창 -->

        <v-dialog v-model="dialog" max-width="500px">
            <v-card>
                <v-card-title>내 정보 수정</v-card-title>
                <v-card-text>
                    <v-text-field v-model="editedNickname" label="이름"></v-text-field>
                    <v-text-field v-model="editedEmail" label="이메일"></v-text-field>
                    <v-textarea v-model="editedIntroduction" label="소개"></v-textarea>
                </v-card-text>

                <v-card-actions>
                    <v-btn @click="upload = true">사진 업로드</v-btn>
                    <v-btn color="primary" @click="saveChanges">저장</v-btn>
                    <v-btn @click="closeDialog">취소</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-dialog v-model="upload" max-width="600px">
            <v-card>
                <v-card-text>
                    <!-- 사진 선택 -->
                    <v-file-input label="사진 등록" accept="image/*" v-model="selectedImage"></v-file-input>
                </v-card-text>
                <v-card-actions>
                    <v-btn text @click="dialog = false">취소</v-btn>
                    <v-btn text color="primary" @click="uploadImage">업로드</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-container>
</template>

<script>

import AWS from "aws-sdk";
import axios from "@/axios/axios-instance";
import {mapState} from "vuex";

export default {

    data() {
        return {
            upload: false,
            dialog: false,

            editedNickname: '',
            editedEmail: '',
            editedIntroduction: '',

            initNickname: '',
            initEmail: '',
            initIntroduction: '',

            uploadedImageUrl: null,
            selectedImage: null
        };
    },
    computed: {
        ...mapState(['imageUrl']),
        nickname() {
            return this.editedNickname;
        },
        email() {
            return this.editedEmail;
        },

        introduction() {
            return this.editedIntroduction;
        }
    },

    methods: {
        openDialog() {
            this.editedNickname = '';
            this.editedEmail = '';
            this.editedIntroduction = '';
            this.dialog = true;
        },
        closeDialog() {
            this.editedNickname = this.initNickname
            this.editedEmail = this.initEmail;
            this.editedIntroduction = this.initIntroduction;
            this.dialog = false;

        },
        saveChanges() {
            // 여기에서 정보 저장 로직을 구현
            this.editedNickname = this.editedNickname.trim();
            this.editedEmail = this.editedEmail.trim();
            this.editedIntroduction = this.editedIntroduction.trim();
            this.dialog = false;
        },

        // S3에 사진 업로드
        async uploadImageToS3(file) {
            AWS.config.update({
                accessKeyId: process.env.VUE_APP_AWS_ACCESS_KEY,
                secretAccessKey: process.env.VUE_APP_AWS_SECRET_KEY,
                region: process.env.VUE_APP_AWS_REGION,
            });
            const s3 = new AWS.S3();
            const params = {
                Bucket: process.env.VUE_APP_AWS_BUCKET,
                Key: file.name, // 파일 이름
                Body: file, // 실제 파일 객체
                ACL: 'public-read' // 파일이 공개적으로 읽을 수 있도록 설정
            };

            try {
                const result = await s3.upload(params).promise();
                return result.Location; // 업로드된 이미지의 URL 반환
            } catch (error) {
                console.error("S3 Upload Error:", error);
            }
        },
        // S3에 올린 사진의 주소를 반환해야한다..

        async uploadImage() {
            if (this.selectedImage) {
                const imageUrl = await this.uploadImageToS3(this.selectedImage);
                const data = {

                    imageUrl: imageUrl // S3에서 반환한 URL
                };
                try {
                    const response = await axios.post("/users/profile", data);
                    // 서버에서 반환된 새로운 피드 데이터를 클라이언트의 상태에 추가
                    this.feeds.push(response.data);
                    this.dialog = false;
                } catch (error) {
                    alert(error.response.data);
                }
            }
        }
    },


}

</script>

<style scoped>
#profile {
    border: 2px solid blue;
}

#document {
    border: 1px solid red;
}

</style>
