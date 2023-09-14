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
              class="my-3 image-hover"
              @click="showFeedDetail(feed.id)"
          ></v-img>

          <v-card-subtitle>{{ feed.title }}</v-card-subtitle>
          <v-card-text>{{ feed.content }}</v-card-text>

          <div class="icon-container">
            <v-icon left color="red">mdi-heart</v-icon>
            <span class="icon-text">{{ feed.likeCount }}</span>
            <v-icon left color="grey">mdi-comment-outline</v-icon>
            <span class="icon-text">{{ feed.commentCount }}</span>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <!-- 피드 상세 정보를 보여주는 모달 -->
    <v-dialog v-model="feedDetailDialog" max-width="900px">
      <v-card>
        <v-row>
          <!-- Left side: Feed Detail -->
          <v-col cols="6">
            <v-card-title>
              {{ feedDetail.username }}
              <v-card-actions class="d-flex justify-end">
                <!-- 피드 수정 -->
                <v-btn icon @click="openEditFeedModal">
                  <v-icon>mdi-pencil</v-icon>
                </v-btn>
                <!-- 피드 삭제 -->
                <v-btn icon @click="deleteFeed(feedDetail.id)">
                  <v-icon color="red">mdi-delete</v-icon>
                </v-btn>
              </v-card-actions>
            </v-card-title>
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
                    <v-btn icon small @click="startEditingComment(comment.id, comment.content)">
                      <v-icon>mdi-pencil-circle</v-icon>
                    </v-btn>
                    <v-btn icon small class="ml-auto" @click="deleteComment(comment.id)">
                      <v-icon color="red">mdi-close</v-icon>
                    </v-btn>
                  </v-list-item-title>
                  <v-list-item-subtitle>{{ comment.content }}</v-list-item-subtitle>
                </v-list-item-content>
                <v-divider></v-divider>
              </v-list-item-group>
            </v-list>

            <v-textarea
                v-if="editingCommentId"
                label="댓글을 편집해 주세요"
                v-model="newCommentContent"
                class="mt-3"
                rows="2"
            ></v-textarea>
            <v-btn v-if="editingCommentId" text color="primary" @click="editComment">저장</v-btn>

            <v-textarea
                v-else
                label="댓글을 작성해 주세요"
                v-model="newCommentContent"
                class="mt-3"
                rows="2"
            ></v-textarea>
            <v-btn text color="primary" @click="postComment(feedDetail.id)">확인</v-btn>
          </v-col>
        </v-row>

        <!-- 피드 수정을 위한 모달 -->
        <v-dialog v-model="editFeedDialog" max-width="600px">
          <v-card>
            <v-card-title>피드 수정</v-card-title>
            <v-card-text>
              <v-text-field
                  label="제목을 수정하세요"
                  v-model="editTitle"
              ></v-text-field>

              <v-textarea
                  label="내용을 수정하세요"
                  v-model="editContent"
                  rows="3"
                  auto-grow
              ></v-textarea>

              <v-file-input label="사진 변경" accept="image/*" v-model="editSelectedImage"></v-file-input>
            </v-card-text>
            <v-card-actions>
              <v-btn text @click="editFeedDialog = false">취소</v-btn>
              <v-btn text color="primary" @click="editFeed">수정</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <!-- Close Button -->
        <v-card-actions>
          <v-btn text @click="feedDetailDialog = false">닫기</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- Vuetify의 v-dialog를 사용한 모달 -->
    <v-dialog v-model="dialog" max-width="600px">
      <v-card v-if="isUserLoggedIn">
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
      <v-card v-else>
        <p>로그인이 필요합니다. 로그인 페이지로 이동하려면 아래 버튼을 클릭하세요.</p>
        <v-btn text @click="goToLoginPage">로그인 페이지로 이동</v-btn>
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
      newCommentContent: '', // 사용자가 작성할 댓글 내용
      editingCommentId: null, // 현재 수정 중인 댓글의 ID
      editFeedDialog: false,
      editTitle: '',
      editContent: '',
      editSelectedImage: null,
    };
  },
  computed: {
    isUserLoggedIn() {
      // 로그인 상태 여부를 확인하는 computed property
      if (!this.$store.state.id) {
        alert('로그인이 필요합니다.');
        return false; // 로그인되지 않은 상태임을 나타내기 위해 false를 반환합니다.
      } else {
        return true; // 로그인된 상태임을 나타내기 위해 true를 반환합니다.
      }
    },
  },

  methods: {
    goToLoginPage() {
      this.$router.push("/login"); // 로그인 페이지로 이동하는 라우터 경로를 지정해주세요
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
        this.fetchFeeds(); // 컴포넌트가 생성될 때 피드를 로드
      } catch (error) {
        console.error("Error posting comment:", error);
        alert('댓글 작성 중 오류가 발생했습니다. 다시 시도해 주세요.');
      }
    },

    // feed 좋아요
    async postLike(feedId) {
      if (!this.$store.state.id) {
        alert('로그인이 필요합니다.');
        return;
      }
      try {
        const response = await axios.post(`/feeds/${feedId}/likes`);
        // 직접 likeCount 증가 or 감소
        if (response.data.msg === "성공") {
          this.feedDetail.likeCount += 1;
          this.fetchFeeds(); // 컴포넌트가 생성될 때 피드를 로드
        }
        else if (response.data.msg === "취소") {
          this.feedDetail.likeCount -= 1;
          this.fetchFeeds(); // 컴포넌트가 생성될 때 피드를 로드
        }
        else {
          alert(response.data.msg);
        }
        // this.showFeedDetail(feedId);  // 좋아요 후 피드 상세 정보 다시 로드
      } catch (error) {
        alert('좋아요 중 오류가 발생했습니다. 다시 시도해 주세요.');
      }
    },

    // 피드 수정 모달 열기
    openEditFeedModal() {
      this.editFeedDialog = true;
      this.editTitle = this.feedDetail.title;
      this.editContent = this.feedDetail.content;
    },

    // 피드 수정 로직
    async editFeed() {
      if (this.editSelectedImage) {
        const imageUrl = await this.uploadImageToS3(this.editSelectedImage);
        const data = {
          title: this.editTitle,
          content: this.editContent,
          imageUrl: imageUrl
        };
        try {
          const response = await axios.put(`/feeds/${this.feedDetail.id}`, data);
          if (response.data.statusCode === 200) {
            this.feedDetail = response.data;
            this.fetchFeeds(); // 피드 목록 갱신
            this.editFeedDialog = false;
            this.feedDetailDialog = false; // 모달 열기
          }
          else {
            alert(response.data.msg);
          }
        } catch (error) {
          alert('피드 수정 중 오류가 발생했습니다. 다시 시도해 주세요.');
        }
      }
    },

    // feed 삭제
    async deleteFeed(feedId) {
      try {
        const response = await axios.delete(`/feeds/${feedId}`);
        if (response.data.statusCode === 200) {
          this.feedDetailDialog = false;
          this.feeds = this.feeds.filter(feed => feed.id !== feedId); // 목록에서 해당 피드 제거
        }
        else {
          alert(response.data.msg);
          this.feedDetailDialog = false;
        }
      } catch (error) {
        alert('피드 삭제 중 오류가 발생했습니다. 다시 시도해 주세요.');
      }
    },

    // 댓글 삭제
    async deleteComment(commentId) {
      try {
        const response = await axios.delete(`/comments/${commentId}`);
        if (response.data.statusCode === 200) {
          this.feedDetail.comments = this.feedDetail.comments.filter(comment => comment.id !== commentId);
        }
        else {
          alert(response.data.msg);
        }
      } catch (error) {
        alert('댓글 삭제 중 오류가 발생했습니다. 다시 시도해 주세요.');
      }
    },

    // 댓글 수정 모드 시작
    startEditingComment(id, content) {
      this.editingCommentId = id;
      this.newCommentContent = content;
    },

    // 댓글 수정 완료 및 서버에 전송
    async editComment() {
      if (!this.newCommentContent.trim()) {
        alert('댓글 내용을 입력해주세요.');
        return;
      }

      const data = {
        content: this.newCommentContent,
      };

      try {
        const response = await axios.put(`/comments/${this.editingCommentId}`, data);
        if (response.data.statusCode === 200) {
          const comment = this.feedDetail.comments.find(comment => comment.id === this.editingCommentId);
          if (comment) {
            // 찾은 댓글의 content 값을 수정하여 업데이트
            comment.content = this.newCommentContent;
          }
        }
        else {
          alert(response.data.msg);
        }
        this.editingCommentId = null; // 수정 모드 종료
        this.newCommentContent = ''; // 댓글 입력 초기화
      } catch (error) {
        console.error("Error editing comment:", error);
        alert('댓글 수정 중 오류가 발생했습니다. 다시 시도해 주세요.');
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

.icon-container {
  display: flex; /* 아이콘과 텍스트를 가로로 나란히 정렬 */
  align-items: center; /* 수직 가운데 정렬 */
}

.icon-text {
  margin-right: 10px; /* 원하는 여백 크기 설정 */
}

.image-hover:hover {
  /* 원하는 hover 스타일을 여기에 추가 */
  opacity: 0.8; /* 예시: 투명도를 낮추는 효과 */
  cursor: pointer; /* 예시: 커서 모양을 포인터로 변경 */
}
</style>
