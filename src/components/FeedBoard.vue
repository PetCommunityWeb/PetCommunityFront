<template>
  <div>
    <v-btn @click="dialog = true">사진 올리기</v-btn>

    <!-- 피드 목록 표시 -->
    <v-row class="feed-list">
      <v-col v-for="feed in feeds" :key="feed.id" cols="12" md="4" class="feed-item">
        <v-card>
          <v-card-title>
            <v-icon left>mdi-account</v-icon> {{ feed.username }}
          </v-card-title>

          <!-- feed의 이미지를 클릭하면 상세 모달 열기 -->
          <v-img
              :src="feed.imageUrl"
              max-height="300px"
              class="my-3"
              @click="openFeedDetailModal(feed.id)"
          ></v-img>

          <v-card-subtitle>{{ feed.title }}</v-card-subtitle>
          <v-card-text>{{ feed.content }}</v-card-text>

          <v-card-actions>
            <v-btn>
              <v-icon left color = "red">mdi-heart</v-icon> {{ feed.likeCount }}
            </v-btn>
            <v-btn>
              <v-icon left color = "grey">mdi-comment-outline</v-icon> {{ feed.commentCount }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>


    <!-- Vuetify의 v-dialog를 사용한 모달 -->
    <v-dialog v-model="dialog" max-width="600px">
      <v-card>
        <v-card-title>사진 업로드</v-card-title>
        <v-card-text>
          <!-- 제목 입력 -->
          <v-text-field
              label="제목을 입력하세요"
              v-model="title"
          ></v-text-field>

          <!-- 설명 입력 -->
          <v-textarea
              label="내용을 입력하세요"
              v-model="content"
              rows="3"
              auto-grow
          ></v-textarea>

          <!-- 사진 선택 -->
          <v-file-input label="사진 등록" accept="image/*" v-model="selectedImage"></v-file-input>
        </v-card-text>
        <v-card-actions>
          <v-btn text @click="dialog = false">취소</v-btn>
          <v-btn text color="primary" @click="uploadImage">업로드</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import axios from "@/axios/axios-instance";
import AWS from 'aws-sdk';

export default {
  name: "FeedBoard",
  data() {
    return {
      dialog: false,
      feedDetailDialog: false,
      title: '',
      content: '',
      selectedImage: null,
      feeds: [],  // 피드 목록 저장용
      feedDetail: {}  // 선택된 피드의 상세 정보
    };
  },
  methods: {
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
    async uploadImage() {
      if (this.selectedImage) {
        const imageUrl = await this.uploadImageToS3(this.selectedImage);
        const data = {
          title: this.title,
          content: this.content,
          imageUrl: imageUrl // S3에서 반환한 URL
        };
        try {
          await axios.post("/feeds", data)
              .then(response => {
                this.dialog = false;
              });
        } catch (error) {
          alert(error.response.data);
          console.log(error.response.data);
        }
      }
    },

    // 전체 피드 불러오기
    async fetchFeeds() {
      try {
        const response = await axios.get("/feeds");
        this.feeds = response.data;
      } catch (error) {
        console.error("Error fetching feeds:", error);
      }
    },

    // 상세 피드 불러오기
    async showFeedDetail(id) {
      try {
        const response = await axios.get(`/feeds/${id}`);
        this.feedDetail = response.data;
        this.feedDetailDialog = true; // 모달 열기
      } catch (error) {
        console.error("Error fetching feed detail:", error);
      }
    }
  },
  created() {
    this.fetchFeeds(); // 컴포넌트가 생성될 때 피드를 로드
  }
}
</script>

<style scoped>
.feed-list {
  margin: 20px 0;
}

.feed-item {
  margin-bottom: 20px;
  padding: 10px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  transition: all 0.3s ease;
}

.feed-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 12px rgba(0,0,0,0.15);
}
</style>
