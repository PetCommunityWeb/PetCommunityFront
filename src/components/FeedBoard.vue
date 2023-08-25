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
              @click="showFeedDetail(feed.id)"
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

    <!-- 피드 상세 정보를 보여주는 모달 -->
    <v-dialog v-model="feedDetailDialog" max-width="900px">
      <v-card>
        <v-row>
          <!-- Left side: Feed Detail -->
          <v-col cols="6">
            <v-card-title>{{ feedDetail.username }}</v-card-title>
            <v-img :src="feedDetail.imageUrl" max-height="300px" class="my-3 detailed-image"></v-img>
            <v-card-subtitle>{{ feedDetail.title }}</v-card-subtitle>
            <v-card-text>{{ feedDetail.content }}</v-card-text>
            <!-- 좋아요 버튼 -->
            <v-btn color="primary" class="mt-3" @click="postLike(feedDetail.id)">
              <v-icon left>mdi-heart</v-icon> 좋아요 {{ feedDetail.likeCount }}
            </v-btn>
          </v-col>

          <!-- Right side: Comments Section -->
          <v-col cols="6">
            <v-divider></v-divider>
            <v-list dense>
              <v-list-item-group v-for="comment in feedDetail.comments" :key="comment.id">
                <v-list-item-content class="comment-item">
                  <v-list-item-title>
                    <v-icon small left>mdi-account-outline</v-icon>
                    {{ comment.username }}
                  </v-list-item-title>
                  <v-list-item-subtitle>{{ comment.content }}</v-list-item-subtitle>
                </v-list-item-content>
                <v-divider></v-divider>
              </v-list-item-group>
            </v-list>
            <v-textarea
                label="댓글을 작성해 주세요"
                v-model="newCommentContent"
                class="mt-3"
                rows="2"
            ></v-textarea>
            <v-btn text color="primary" @click="postComment(feedDetail.id)">확인</v-btn>
          </v-col>
        </v-row>

        <!-- Close Button -->
        <v-card-actions>
          <v-btn text @click="feedDetailDialog = false">닫기</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

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
      feedDetail: {},  // 선택된 피드의 상세 정보
      newCommentContent: '' // 사용자가 작성할 댓글 내용
    };
  },
  methods: {
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

    // feed 생성 및 백에 request 전달
    async uploadImage() {
      if (this.selectedImage) {
        const imageUrl = await this.uploadImageToS3(this.selectedImage);
        const data = {
          title: this.title,
          content: this.content,
          imageUrl: imageUrl // S3에서 반환한 URL
        };
        try {
          const response = await axios.post("/feeds", data);
          // 서버에서 반환된 새로운 피드 데이터를 클라이언트의 상태에 추가
          this.feeds.push(response.data);
          this.dialog = false;
        } catch (error) {
          alert(error.response.data);
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
    },

    // 댓글 작성
    async postComment(feedId) {
      // 댓글 내용이 없는 경우
      if (!this.newCommentContent.trim()) {
        alert('댓글 내용을 입력해주세요.');
        return;
      }

      const data = {
        content: this.newCommentContent,
      };

      try {
        const response = await axios.post(`/comments/${feedId}`, data);
        const newComment = {
          content: this.newCommentContent,
          username: response.data.username
        };
        this.feedDetail.comments.push(newComment);
        this.newCommentContent = ''; // 댓글 입력 초기화
        // this.showFeedDetail(feedId); // 댓글 작성 후 피드 상세 정보 다시 로드
      } catch (error) {
        console.error("Error posting comment:", error);
        alert('댓글 작성 중 오류가 발생했습니다. 다시 시도해 주세요.');
      }
    },

    // feed 좋아요
    async postLike(feedId) {
      try {
        const response = await axios.post(`/feeds/${feedId}/likes`);
        // 직접 likeCount 증가 or 감소
        if (response.data.msg === "성공") {
          this.feedDetail.likeCount += 1;
        }
        else if (response.data.msg === "취소") {
          this.feedDetail.likeCount -= 1;
        }
        else {
          console.log(response.data)
          alert(response.data.msg)
        }
        // this.showFeedDetail(feedId);  // 좋아요 후 피드 상세 정보 다시 로드
      } catch (error) {
        console.error("Error posting like:", error);
        alert('좋아요 중 오류가 발생했습니다. 다시 시도해 주세요.');
      }
    },

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

.detailed-image {
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

.comment-item {
  padding: 10px 0;
}

.comment-item > .v-list-item__title > .v-icon {
  color: #777;
}
</style>
