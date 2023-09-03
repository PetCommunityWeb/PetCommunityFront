<template>
  <v-form>
    <v-container class="tip-detail-container">
      <v-row>
        <h2>{{ title }}</h2>
      </v-row>
      <v-row>
        작성자: {{ author }}
      </v-row>
      <v-row>
        {{ content }}
      </v-row>
      <v-row>
        <v-img v-if="imageUrl" :src="imageUrl" width="300"></v-img>
      </v-row>
      <v-row>
        <v-btn outlined color="blue" @click="listClick">목록</v-btn>
        <v-btn outlined color="red" @click="tipPostLike">{{ liked ? '좋아요 취소' : '좋아요' }}</v-btn>
        <span>좋아요 수: {{ likeCount }}</span>
        <v-btn outlined color="green" @click="editClick">수정</v-btn>
        <v-btn outlined color="red" @click="deleteClick">삭제</v-btn>
      </v-row>
    </v-container>
  </v-form>
</template>

<script>
import axios from "@/axios/axios-instance";
import {eventBus} from '@/main'; // 이벤트 버스 가져오기

export default {
  name: 'TipDetail',
  data() {
    return {
      title: "",
      author: "",
      content: "",
      likeCount: 0,
      liked: false,
      imageUrl: "", // 이미지 URL을 저장할 변수 추가
      id: null,

    };
  },
  created() {
    this.fetchTipDetail();
  },
  methods: {
    async fetchTipDetail() {
      try {
        const id = this.$route.params.id;
        this.id = id; // 컴포넌트 데이터에 id를 저장
        const response = await axios.get(`/tips/${id}`);
        this.title = response.data.title;
        this.author = response.data.user ? response.data.user.username : 'Unknown';
        this.content = response.data.content;
        this.likeCount = response.data.likeCount;
        this.liked = response.data.liked;
        this.imageUrl = response.data.imageUrl; // 이미지 URL을 받아옴

      } catch (error) {
        console.error("Error fetching tip detail:", error);
      }
    },

    async tipPostLike() {
      try {
        const id = this.$route.params.id;
        const response = await axios.post(`/tips/${id}/likes`);
        if (response.data.msg === "성공") {
          this.$set(this, "liked", true); // liked 속성 업데이트
          this.$set(this, "likeCount", this.likeCount + 1); // likeCount 속성 업데이트
        } else if (response.data.msg === "취소") {
          this.$set(this, "liked", false);
          this.$set(this, "likeCount", this.likeCount - 1);
        } else {
          alert(response.data.msg);
        }
      } catch (error) {
        alert('좋아요 중 오류가 발생했습니다. 다시 시도해 주세요.');
      }
    },


    async editClick() {
      const id = this.$route.params.id;
      await this.$router.push(`/community/tip/edit/${this.$route.params.id}`);
    },

    // 수정 페이지에서 저장 버튼을 눌렀을 때 호출되는 함수
    async saveEdit() {
      try {
        const id = this.$route.params.id;
        const data = {
          title: this.title,
          content: this.content,
        };

        // 서버에 수정된 내용을 PUT 요청으로 보냅니다.
        const response = await axios.put(`/tips/${id}`, data);

        if (response.data.statusCode === 200) {
          // 서버에서 응답으로 수정된 데이터를 받으면 화면을 업데이트합니다.
          this.title = response.data.title;
          this.content = response.data.content;
          alert('글이 수정되었습니다.');
        } else {
          alert(response.data.msg);
        }
      } catch (error) {
        alert('글 수정 중 오류가 발생했습니다. 다시 시도해 주세요.');
      }
    },



    async deleteClick() {
      const confirmDelete = confirm('정말로 글을 삭제하시겠습니까?');
      if (confirmDelete) {
        try {
          const id = this.$route.params.id;
          const response = await axios.delete(`/tips/${id}`);
          if (response.data.statusCode === 200) {
            alert('글이 삭제되었습니다.');
            await this.$router.push('/community/tip');
          } else {
            alert(response.data.msg);
          }
        } catch (error) {
          alert('글 삭제 중 오류가 발생했습니다. 다시 시도해 주세요.');
        }
      }
    },

    listClick() {
      this.$router.push('/community/tip');
    },

    handleLikeUpdated({id, liked, likeCount}) {
      // 이벤트를 통해 업데이트된 좋아요 상태를 처리
      if (id === this.id) {
        this.$set(this, "liked", liked);
        this.$set(this, "likeCount", likeCount);
      }
    },

  },
}
</script>

<style scoped>
.tip-detail-container {
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: #f9f9f9;
}

.tip-detail-container h2 {
  font-size: 24px;
  margin-bottom: 10px;
}

.tip-detail-container v-btn {
  margin-top: 20px;
  margin-right: 10px;
}
</style>
