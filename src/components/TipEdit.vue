<template>
  <v-form>
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
        <input type="file" accept="image/*" @change="handleFileChange"/>
      </v-row>
      <v-row>
        <v-btn outlined color="blue" @click="cancelEdit">취소</v-btn>
        <v-btn outlined color="green" @click="saveEdit">저장</v-btn>
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
      selectedImage: null, // 추가된 부분: 수정할 이미지 선택

    };
  },
  created() {
    this.fetchTipDetail();
  },
  methods: {
    async editClick() {
      await this.fetchTipDetail();
      await this.$router.push(`/community/tip/edit/${this.$route.params.id}`);
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

        if (this.selectedImage) {
          const s3 = new AWS.S3({
            accessKeyId: process.env.VUE_APP_AWS_ACCESS_KEY_ID,
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

          const uploadResponse = await s3.upload(s3Params).promise();
          const imageUrl = uploadResponse.Location;

          data.imageUrl = imageUrl;
        }

        // 수정된 내용과 이미지 URL을 저장
        const updateResponse = await axios.put(`/tips/${id}`, data);

        if (updateResponse.data.statusCode === 200) {
          await this.$router.push('/community/tip/' + id); // 수정된 글 페이지로 이동
          alert('글이 수정되었습니다');
        } else {
          alert(updateResponse.data.msg);
        }
      } catch (error) {
        alert('글 수정 중 오류가 발생했습니다. 다시 시도해 주세요.');
      }
    },
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
