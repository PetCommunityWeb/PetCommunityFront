<template>
    <v-container class="tip-detail-container">
        <v-row>
            <v-col cols="12">
                <h2 class="text-h5">{{ title }}</h2>
                <p class="mb-2">{{ username }}</p>
                <div class="content">{{ content }}</div>
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="12">
                <v-img v-if="imageUrl" :src="imageUrl" class="detail-image mb-4"></v-img>
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="12">
                <v-btn outlined color="blue" @click="listClick">목록</v-btn>
                <v-btn outlined color="red" @click="tipPostLike">
                    <v-icon v-if="liked">mdi-heart</v-icon>
                    <v-icon v-else>mdi-heart-outline</v-icon>
                    {{ liked ? '좋아요 취소' : '좋아요' }}
                </v-btn>
                <span class="ml-2">{{ likeCount }} {{ likeCount === 1 ? '좋아요' : '좋아요' }}</span>
                <v-btn outlined color="green" @click="editClick">수정</v-btn>
                <v-btn outlined color="red" @click="deleteClick">삭제</v-btn>
            </v-col>
        </v-row>
    </v-container>
</template>


<script>
import axios from "@/axios/axios-instance";
import {mapState, mapMutations, mapGetters, mapActions} from 'vuex';
// import currentUser from "@/store/modules/currentUser";
import {checkAuthAndAlert} from "@/methods/authChecker";

export default {
    name: 'TipDetail',
    data() {
        return {
            title: "",
            username: "",
            user: "",
            content: "",
            likeCount: 0,
            liked: false,
            imageUrl: "", // 이미지 URL을 저장할 변수 추가
            id: null,
        };
    },
    computed: {
        ...mapState('currentUser', ['currentUserId']),
        ...mapGetters('currentUser', ['getCurrentUserId']), // 현재 사용자 ID 가져오기
        // currentUserId() {
        //   return this.$store.getters['currentUser/getCurrentUserId']; // getters를 사용하여 값 가져오기
    },
// Vuex 상태를 컴포넌트 데이터로 매핑


    methods: {
        ...mapMutations('currentUser', ['setCurrentUserId']), // Vuex mutations를 컴포넌트 메서드로 매핑
        ...mapActions('currentUser', ['login']), // 모듈명과 액션명을 함께 지정


        async fetchTipDetail() {

            try {
                const id = this.$route.params.id;
                this.id = id; // 컴포넌트 데이터에 id를 저장
                const response = await axios.get(`/tips/${id}`);
                this.title = response.data.title;
                this.username = response.data.username;
                this.user = response.data.user;
                this.content = response.data.content;
                this.likeCount = response.data.likeCount;
                this.liked = response.data.liked;
                this.imageUrl = response.data.imageUrl; // 이미지 URL을 받아옴
            } catch (error) {
                console.error("Error fetching tip detail:", error);
            }
        },

        // 글 좋아요 상태 변경 시 호출되는 메서드
        async tipPostLike() {
            if (!checkAuthAndAlert()) {
                return;
            }
            try {
                console.log("좋아요")
                const id = this.$route.params.id;
                const response = await axios.post(`/tips/${id}/likes`);
                this.setLike({postId: id, liked: !this.likes[id]});
                // 상태 업데이트가 완료되면 좋아요 수와 버튼 텍스트를 업데이트
                this.likeCount = response.data.likeCount;
                this.liked = !this.liked;
                // eslint-disable-next-line no-empty
            } catch (error) {
            }
            await this.fetchTipDetail();
        },

        // 글 수정 기능을 작성하는 예

        async editClick() {
            const id = this.$route.params.id;
            try {
                const response = await axios.get(`/tips/${id}`);
                const username = response.data.username ? response.data.username : null;
                // 현재 사용자의 ID를 가져와서 작성자와 비교
                if (this.$store.state.username === username) {
                  // 현재 사용자가 작성자인 경우에만 수정 페이지로 이동
                  await this.$router.push(`/community/tip/edit/${id}`);
                } else {
                    alert('작성자만 수정할 수 있습니다.');
                }
                // eslint-disable-next-line no-empty
            } catch (error) {
            }
        },


        async deleteClick() {
            if (!checkAuthAndAlert()) {
                return;
            }
            const confirmDelete = confirm('정말로 글을 삭제하시겠습니까?');
            if (confirmDelete) {
                try {
                    const id = this.$route.params.id;
                    const response = await axios.delete(`/tips/${id}`);
                    if (response.data.statusCode === 200) {
                        alert('글이 삭제되었습니다.');
                        await this.$router.push(`/community/tip`);
                    } else {
                        alert(response.data.msg);
                    }
                    // eslint-disable-next-line no-empty
                } catch (error) {
                }
            }
        },

        listClick() {
            this.$router.push(`/community/tip`);
        },
    },

    async created() {
        // 로그인 상태를 확인하고, 필요하다면 로그인을 시도

        await this.fetchTipDetail();
    },

};
</script>

<style scoped>
.tip-detail-container {
    padding: 20px;
    border: 1px solid #ddd;
    border-radius: 5px;
    background-color: #fff;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    margin-bottom: 20px;
}

.text-h5 {
    font-size: 1.25rem;
    margin-bottom: 10px;
}

.content {
    white-space: pre-line;
    font-size: 1rem;
    line-height: 1.5;
    padding: 10px;
}

.v-btn {
    text-transform: none;
}

.v-btn + .v-btn {
    margin-left: 8px;
}

.ml-2 {
    margin-left: 8px;
}

.v-icon {
    margin-right: 4px;
}

.detail-image {
    width: 300px;
    height: 300px;
    object-fit: cover; /* 이미지 비율을 유지하면서 지정된 크기에 맞추기 위해 */
    margin: 0 auto; /* 이미지를 중앙에 배치하기 위해 */
}
</style>