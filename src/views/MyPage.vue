<template>
    <v-container fluid fill-height class="white lighten-3"> <!-- 배경색 추가 -->

        <!--프로필 수정 방식으로 만들어보기-->

        <div>

            <h1>내 정보
                <v-btn @click="dialog = true">내 정보 수정하기</v-btn>
            </h1>
            <p>이름: {{ nickname }}</p>
            <p>이메일: {{ email }}</p>
            <p>내 사진: {{ imageUrl }}</p>

            <p>내 소개: {{ introduction }}</p>
            <p>내가 좋아요 한 피드</p>
            <p>내가 단 댓글</p>

            <v-dialog v-model="dialog" max-width="500px">
                <v-card>
                    <v-card-title>내 정보 수정</v-card-title>
                    <v-card-text>
                        <v-text-field v-model="editedNickname" label="이름"></v-text-field>
                        <v-text-field v-model="editedEmail" label="이메일"></v-text-field>
                        <v-text-field v-model="editedImageUrl" label="사진 URL"></v-text-field>
                        <v-textarea v-model="editedIntroduction" label="소개"></v-textarea>
                    </v-card-text>
                    <v-card-actions>
                        <v-btn color="primary" @click="saveChanges">저장</v-btn>
                        <v-btn @click="closeDialog">취소</v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>


        </div>
    </v-container>
</template>

<script>
import {mapState} from 'vuex';
import axios from "@/axios/axios-instance";
import AWS from 'aws-sdk';

export default {
    data() {
        return {
            dialog: false,
            editedNickname: '',
            editedEmail: '',
            editedImageUrl: '',
            editedIntroduction: ''
        };
    },
    computed: {
        nickname() {
            return this.editedNickname || '기본 이름';
        },
        email() {
            return this.editedEmail || '기본 이메일';
        },
        imageUrl() {
            return this.editedImageUrl || '기본 이미지 URL';
        },
        introduction() {
            return this.editedIntroduction || '기본 소개';
        }
    },
    methods: {
        openDialog() {
            this.editedNickname = '';
            this.editedEmail = '';
            this.editedImageUrl = '';
            this.editedIntroduction = '';
            this.dialog = true;
        },
        closeDialog() {
            this.dialog = false;
        },
        saveChanges() {
            // 여기에서 정보 저장 로직을 구현
            this.editedNickname = this.editedNickname.trim();
            this.editedEmail = this.editedEmail.trim();
            this.editedImageUrl = this.editedImageUrl.trim();
            this.editedIntroduction = this.editedIntroduction.trim();
            this.dialog = false;
        }
    }
};
</script>

<style scoped>
/* 스타일 추가 */
</style>
