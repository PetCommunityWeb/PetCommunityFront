<template>
  <v-form>
    <v-container>
      <v-row>
        <v-col cols="12">
          <v-text-field
              :counter="100"
              label="제목"
              name="title"
              required
              v-model="title"
              maxlength="100"
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <v-textarea
              filled
              name="content"
              label="내용"
              hint="내용을 입력해주세요."
              v-model="content"
              :counter="10000"
              maxlength="10000"
          ></v-textarea>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
<!--          <v-file-input-->
<!--              accept="image/*"-->
<!--              @change="handleFileChange"-->
<!--              label="이미지 선택"-->
<!--              show-size-->
<!--              prepend-icon="mdi-camera"-->
<!--              outlined-->
<!--          ></v-file-input>-->
          <v-label class="mb-2"><v-icon left>mdi-camera</v-icon></v-label>
          <input type="file" accept="image/*" @change="handleFileChange" />
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <v-btn block outlined color="blue" @click="writeClick"> 등록 </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>

<script>
import axios from "@/axios/axios-instance";
import AWS from 'aws-sdk';

export default {
  name: 'TipCreate',
  data() {
    return {
      title: '',   // 데이터 속성 추가
      content: '', // 데이터 속성 추가
      selectedImage: null,
    };
  },
  methods: {
    async writeClick() {
      try {
        let response;

        if (this.selectedImage) {
          const s3 = new AWS.S3({
            accessKeyId: process.env.VUE_APP_AWS_ACCESS_KEY,
            secretAccessKey: process.env.VUE_APP_AWS_SECRET_KEY,
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

          // S3에 이미지 업로드
          const uploadResponse = await s3.upload(s3Params).promise();
          const imageUrl = uploadResponse.Location;

          // Tip 생성 데이터에 이미지 URL 추가
          const postData = {
            title: this.title,
            content: this.content,
            imageUrl: imageUrl,
          };

          // Tip 생성 요청 보내기
          response = await axios.post('/tips/create', postData);
        } else {
          // 이미지가 없는 경우
          const postData = {
            title: this.title,
            content: this.content,
            imageUrl: null,
          };

          // Tip 생성 요청 보내기
          response = await axios.post('/tips/create', postData);
        }

        console.log(response); // 성공 시 응답 확인

        // 글 작성 완료 후 사용자를 작성된 글 페이지로 리디렉션
        if (response.status === 200) {
          await this.$router.push(`/community/tip/${response.data.id}`); // 작성된 글 페이지로 이동
        } else {
          alert('글 작성 중 오류가 발생했습니다.');
        }
      } catch (error) {
        console.error(error);
        alert('글 작성 중 오류가 발생했습니다.');
      }
    },
    handleFileChange(event) {
      this.selectedImage = event.target.files[0];
    },
  },
};
</script>