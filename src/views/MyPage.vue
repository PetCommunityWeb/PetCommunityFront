<template>
    <div>
        <v-tabs v-model="selectedTab" grow class="my-4" style="width: 50%; margin: 0 auto;">
            <v-tab key="reservations" class="py-1 px-2">예약 내역</v-tab>
            <v-tab key="notifications" class="py-1 px-2">알림</v-tab>
            <v-tab key="profile" class="py-1 px-2">내 정보</v-tab>

            <v-tab-item key="reservations">
                <v-list>
                    <v-list-item-group v-for="reservation in reservations" :key="reservation.reservationNum">
                        <v-list-item>
                            <v-list-item-content>
                                <v-list-item-title class="mb-1">{{ reservation.date }} {{ reservation.startTime }},
                                    {{ reservation.hospitalName }}
                                </v-list-item-title>
                                <v-list-item-subtitle>{{ reservation.status }}</v-list-item-subtitle>
                            </v-list-item-content>
                            <!-- 예약 취소 버튼 -->
                            <v-list-item-action
                                    v-if="reservation.status === '예약완료' && isPastReservation(reservation.date, reservation.startTime)">
                                <!-- 리뷰가 없는 경우 -->
                                <v-btn v-if="!reservation.review" small color="blue"
                                       @click="writeReview(reservation.reservationNum)">리뷰쓰기
                                </v-btn>
                                <!-- 리뷰가 있는 경우 -->
                                <v-btn v-if="reservation.review" small color="green" @click="updateReview(reservation)">
                                    리뷰수정
                                </v-btn>
                                <v-btn v-if="reservation.review" small color="red"
                                       @click="deleteReview(reservation.review.id)">리뷰삭제
                                </v-btn>
                            </v-list-item-action>

                            <v-list-item-action
                                    v-if="isBeforeTomorrow(reservation.date) && reservation.status !== '예약취소'">
                                <v-btn small color="red" @click="cancelReservation(reservation.reservationNum)">예약 취소
                                </v-btn>
                            </v-list-item-action>
                        </v-list-item>
                        <v-divider></v-divider>
                    </v-list-item-group>
                </v-list>
            </v-tab-item>

            <v-tab-item key="notifications">
                <v-list>
                    <v-list-item-group v-for="notification in notifications" :key="notification.id">
                        <v-list-item>
                            <v-list-item-content>
                                <v-list-item-title class="mb-1">{{ notification.content }}</v-list-item-title>
                            </v-list-item-content>
                        </v-list-item>
                        <v-divider></v-divider>
                    </v-list-item-group>
                </v-list>
            </v-tab-item>


            <!-- 나의 프로필-->
            <v-tab-item key="profile">
                <v-list>
                    <!--프로필 수정 방식으로 만들어보기-->
                    <div id=profile>
                        <h1>내 정보
                            <v-btn @click="openDialog">내 정보 수정하기</v-btn>
                        </h1>
                        <p>이름: {{ user.nickname }}</p>
                        <p>이메일: {{ user.email }}</p>
                        <p>내 사진</p>
                        <!-- 이미지 표시 -->
                        <v-img :src="user.imageUrl" alt="유저 이미지" height="200" width="300"></v-img>
                        <p>내 소개: {{ user.introduction }}</p>
                    </div>


                    <div id=document>
                        <p>내가 좋아요 한 피드</p>
                        <p>내가 단 댓글</p>
                    </div>
                </v-list>

                <!--내 정보 수정 다이얼로그-->
                <v-dialog v-model="dialog" max-width="500px">
                    <v-card>
                        <v-card-title>내 정보 수정</v-card-title>
                        <v-card-text>
                            <v-text-field v-model="editedUser.nickname" label="이름"></v-text-field>
                            <v-text-field v-model="editedUser.email" label="이메일"></v-text-field>
                            <v-textarea v-model="editedUser.introduction" label="소개"></v-textarea>
                        </v-card-text>
                        <v-card-actions>
                            <v-btn color="primary" @click="saveChanges">저장</v-btn>
                            <v-btn @click="closeDialog">취소</v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>

                <!--                <v-dialog v-model="upload" max-width="600px">-->
                <!--                    <v-card>-->
                <!--                        <v-card-text>-->
                <!--                            &lt;!&ndash; 사진 선택 &ndash;&gt;-->
                <!--                            <v-file-input label="사진 등록" accept="image/*" v-model="selectedImage"></v-file-input>-->
                <!--                        </v-card-text>-->
                <!--                        <v-card-actions>-->
                <!--                            <v-btn text @click="dialog = false">취소</v-btn>-->
                <!--                            <v-btn text color="primary" @click="uploadImage">업로드</v-btn>-->
                <!--                        </v-card-actions>-->
                <!--                    </v-card>-->
                <!--                </v-dialog>-->

            </v-tab-item>
        </v-tabs>
        <!-- 리뷰 다이얼로그 -->
        <v-dialog v-model="reviewDialog" max-width="500px">
            <v-card>
                <v-card-title>
                    <span v-if="editingReview">리뷰 수정</span>
                    <span v-else>리뷰 작성</span>
                </v-card-title>

                <v-card-text>
                    <v-text-field v-model="reviewData.title" label="제목"></v-text-field>
                    <v-textarea v-model="reviewData.content" label="내용"></v-textarea>
                    <v-rating
                            v-model="reviewData.rate"
                            length="5"
                            background-color="grey lighten-3"
                            color="yellow"
                            dense
                    ></v-rating>
                    <!-- 이미지 업로드 등 추가 필요 -->
                </v-card-text>

                <v-card-actions>
                    <v-btn text @click="reviewDialog = false">취소</v-btn>
                    <v-btn color="blue" text @click="saveReview">저장</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>


<script>
import axios from '@/axios/axios-instance'; // 필요하다면 경로를 수정하세요
import {mapState} from 'vuex';

import AWS from "aws-sdk";

export default {
    name: "MyPage",
    data() {
        return {
            selectedTab: 'reservations',
            reservations: [],
            notifications: [
                {id: 1, content: "새로운 메시지가 도착했습니다."},
                {id: 2, content: "예약이 변경되었습니다."}
            ],
            reviewDialog: false,
            reviewData: {
                title: '',
                content: '',
                rate: 5,
                reservationNum: null, // 예약 번호
                reviewId: null // 리뷰의 ID
                // 추가 필드 (예: imageUrl)
            },
            editingReview: false,
            currentReservationNum: null,

            user: {
                nickname: '',     // 사용자 닉네임
                email: '',        // 사용자 이메일
                imageUrl: '',     // 사용자 이미지 URL
                introduction: '', // 사용자 소개
            },
            editedUser: {
                nickname: '',
                email: '',
                introduction: ''
            },
            dialog: false

        }

    },
    computed: {
        ...mapState(['username', 'nickname', 'email', 'imageUrl', 'role']),

    },
    methods: {
        fetchReservations() {
            axios.get("/reservations")
                .then(response => {
                    this.reservations = response.data;
                })
                .catch(error => {
                    console.error("예약을 가져오는 데 실패했습니다:", error);
                });
        },
        isBeforeTomorrow(reservationDate) {
            const today = new Date().toISOString().slice(0, 10);
            const tomorrow = new Date(today);
            tomorrow.setDate(tomorrow.getDate() + 1);
            return reservationDate >= tomorrow.toISOString().slice(0, 10);
        },
        cancelReservation(reservationNum) {
            axios.delete(`/reservations/${reservationNum}`)
                .then(response => {
                    alert(response.data)  // 예약 취소가 완료되었습니다. 라는 메시지를 보여줌. toast plugin을 사용하는 경우.

                    // 취소된 예약을 목록에서 제거 (optional)
                    this.reservations = this.reservations.filter(reservation => reservation.reservationNum !== reservationNum);
                })
                .catch(error => {
                    console.error("예약 취소 에러:", error);
                });
        },
        isPastReservation(reservationDate, startTime) {
            const reservationDateTime = new Date(`${reservationDate}T${startTime}`);
            return new Date() > reservationDateTime;
        },
        resetReviewData() {
            this.reviewData.title = '';
            this.reviewData.content = '';
            this.reviewData.rate = 5;
            this.reviewData.reservationNum = null; // 이 부분 수정
            this.reviewData.reviewId = null;
        },
        saveReview() {
            if (this.editingReview) {
                axios.put(`/reviews/${this.reviewData.reviewId}`, this.reviewData)
                    .then(() => {
                        alert('리뷰 수정이 완료되었습니다.');
                        this.fetchReservations();
                        this.resetReviewData();
                    })
                    .catch(error => {
                        console.error("리뷰 수정 에러:", error);
                    });
            } else {
                axios.post('/reviews', this.reviewData)
                    .then(() => {
                        alert('리뷰 작성이 완료되었습니다.');
                        this.fetchReservations();
                    })
                    .catch(error => {
                        console.error("리뷰 작성 에러:", error);
                    });
            }
            this.reviewDialog = false;
        },
        writeReview(reservationNum) {
            this.editingReview = false;
            this.currentReservationNum = reservationNum;
            this.reviewData.reservationNum = reservationNum; // 여기서 먼저 설정
            this.reviewDialog = true;
        },
        updateReview(reservation) {
            this.editingReview = true;
            this.currentReservationNum = reservation.reservationNum;
            this.reviewData.reservationNum = reservation.reservationNum;
            this.reviewData.reviewId = reservation.review.id;
            this.reviewData.title = reservation.review.title;
            this.reviewData.content = reservation.review.content;
            this.reviewData.rate = reservation.review.rate;
            // 추가 필드를 채워주세요 (예: imageUrl)
            this.reviewDialog = true;
        },
        deleteReview(reviewId) { // 매개변수 reviewId 추가
            if (confirm('정말로 리뷰를 삭제하시겠습니까?')) {
                axios.delete(`/reviews/${reviewId}`) // reviewId 사용
                    .then(() => {
                        alert('리뷰가 삭제되었습니다.');
                        this.fetchReservations();
                    })
                    .catch(error => {
                        console.error("리뷰 삭제 에러:", error);
                    });
            }
        },

        // 프로필 수정 관련 스크립트
        openDialog() {
            this.editedUser = { ...this.user };
            this.dialog = true;
        },
        closeDialog() {
            this.dialog = false;
        },
        saveChanges() {
            // 수정된 사용자 데이터 저장
            this.user = { ...this.editedUser };

            // 서버로 수정된 데이터 전송
            axios.put('/users/profile', this.editedUser) // 백엔드 API 엔드포인트에 맞게 수정
                .then(response => {
                    console.log('User data updated:', response.data);
                })
                .catch(error => {
                    console.error('Error updating user data:', error);
                });

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
        // S3에 올린 사진의 주소를 반환

    },
    mounted() {
        this.fetchReservations();

        // 나의 프로필 데이터 가져옴
        axios.get('/users/my-profile') // 백엔드 API 엔드포인트에 맞게 수정
            .then(response => {
                this.user = response.data; // API 응답으로부터 데이터를 user에 저장
            })
            .catch(error => {
                console.error('Error fetching user data:', error);
            });
    }


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
