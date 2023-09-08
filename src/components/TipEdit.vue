<template>
  <v-form v-if="editedTitle !== '' && editedContent !== ''">
    <v-container class="tip-edit-container">
      <v-row>
        <h2>글 수정</h2>
      </v-row>
      <v-row>
        제목
      </v-row>
      <v-row>
        <v-text-field
            :counter="100"
            label="제목"
            name="title"
            required
            v-model="editedTitle"
            maxlength="100"
        ></v-text-field>
      </v-row>
      <v-row>
        내용
      </v-row>
      <v-row>
        <v-textarea
            filled
            name="content"
            hint="내용을 입력해주세요."
            v-model="editedContent"
            :counter="10000"
            maxlength="10000"
        ></v-textarea>
      </v-row>
      <v-row>
        <v-btn outlined color="green" @click="editImage">이미지 수정</v-btn>
      </v-row>
      <v-row>
        <input type="file" accept="image/*" ref="imageInput" style="display: none;" @change="handleFileChange"/>
      </v-row>
      <!-- 업로드된 이미지 표시 -->
      <v-row v-if="editedImage">
        <v-img :src="editedImage" width="200" height="auto"></v-img>
      </v-row>
      <v-row>
        <v-btn outlined color="blue" @click="cancelEdit">취소</v-btn>
        <v-btn outlined color="green" @click="saveEdit">수정</v-btn>
      </v-row>
    </v-container>
  </v-form>
</template>

<script>
import axios from "@/axios/axios-instance";
import AWS from 'aws-sdk';

export default {
  name: 'TipEdit',
  data() {
    return {
      editedTitle: '',
      editedContent: '',
      selectedImage: null,
      editedImage: null,
    };
  },
  async created() {
    // 데이터를 가져오는 로직을 created 훅에서 실행
    await this.fetchTipDetail();
  },
  methods: {
    async editClick() {
      await this.fetchTipDetail();
      // 글 수정이 완료되면 TipDetail.vue 파일 화면으로 이동
      await this.$router.push(`/community/tip/edit/${this.$route.params.id}`);
    },

    editImage() {
      // 파일 입력 필드 클릭
      this.$refs.imageInput.click();
    },
    async handleFileChange(event) {
      this.selectedImage = event.target.files[0];
      // 이미지를 선택하면 미리보기로 표시
      if (this.selectedImage) {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.editedImage = e.target.result;
        };
        reader.readAsDataURL(this.selectedImage);
      }
    },
    cancelEdit() {
      const id = this.$route.params.id;
      this.$router.push(`/community/tip/${id}`);
    },

    async fetchTipDetail() {
      try {
        const id = this.$route.params.id;
        const response = await axios.get(`/tips/${id}`);

        this.editedTitle = response.data.title;
        this.editedContent = response.data.content;
      } catch (error) {
        console.error("Error fetching tip detail:", error);
      }
    },

    async saveEdit() {
      try {
        const id = this.$route.params.id;
        const data = {
          title: this.editedTitle,
          content: this.editedContent,
        };

        AWS.config.credentials = new AWS.Credentials({
          accessKeyId: process.env.VUE_APP_AWS_ACCESS_KEY,
          secretAccessKey: process.env.VUE_APP_AWS_SECRET_KEY,
        });

        if (this.selectedImage) {
          const s3 = new AWS.S3({
            accessKeyId: process.env.VUE_APP_AWS_ACCESS_KEY,
            secretAccessKey: process.env.VUE_APP_AWS_SECRET_ACCESS_KEY,
            region: process.env.VUE_APP_AWS_REGION,
          });

          const timestamp = Date.now();
          const fileName = `image_${timestamp}_${this.selectedImage.name}`;
          const s3Params = {
            Bucket: process.env.VUE_APP_AWS_BUCKET,
            Key: fileName,
            Body: this.selectedImage,
            ACL: 'public-read',
          };

          try {
            const uploadResponse = await s3.upload(s3Params).promise();
            const imageUrl = uploadResponse.Location;

            data.imageUrl = imageUrl;

            this.editedImage = imageUrl;

            // 이미지 업로드 성공 시 메시지 표시
            alert('이미지가 성공적으로 업로드되었습니다.');

          } catch (uploadError) {
            console.error('Error uploading image to S3:', uploadError);

            // 이미지 업로드 오류 시 메시지 표시
            alert('이미지 업로드 중 오류가 발생했습니다. 다시 시도해 주세요.');
            return; // 업로드 오류 시 함수 종료
          }
        }

        const updateResponse = await axios.put(`/tips/${id}`, data);

        if (updateResponse.data.statusCode === 200) {
          alert('글이 수정되었습니다');

          // 라우트를 변경하기 전에 현재 컴포넌트를 다시 그림
          await this.fetchTipDetail(); // 데이터 다시 가져오기
          await this.$router.push(`/community/tip/${id}`);
        } else {
          alert(updateResponse.data.msg);
          window.location.reload();
        }
      } catch (error) {
        console.error('글 수정 중 오류가 발생했습니다:', error);
        alert('글 수정 중 오류가 발생했습니다. 다시 시도해 주세요.');
      }
    },

    beforeRouteUpdate(to, from, next) {
      if (!this.editedTitle || !this.editedContent) {
        this.fetchTipDetail().then(() => {
          next();
        });
      } else {
        next();
      }
    }
  }
};
</script>

<style scoped>
.tip-edit-container {
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: #f9f9f9;
}

.tip-edit-container h2 {
  font-size: 24px;
  margin-bottom: 10px;
}

.tip-edit-container v-btn {
  margin-top: 20px;
  margin-right: 10px;
}
</style>