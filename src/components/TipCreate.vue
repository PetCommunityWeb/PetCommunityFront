<template>
  <v-form>
    <v-container>
      <v-row>
        제목
      </v-row>
      <v-row>
        <v-text-field
            :counter="100"
            label="제목"
            name="title"
            required
            v-model="title"
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
            v-model="content"
            :counter="10000"
            maxlength="10000"
        ></v-textarea>
      </v-row>
      <v-row>
        <v-btn block outlined color="blue" @click="writeClick"> 등록 </v-btn>
      </v-row>
      <v-row>
        사진
      </v-row>
      <v-row>
        <input type="file" accept="image/*" @change="handleFileChange" />
      </v-row>
    </v-container>
  </v-form>
</template>

<script>
import axios from "@/axios/axios-instance";
import AWS from 'aws-sdk';

export default {
  name: 'TipCreate',
  methods: {
    async writeClick() {
      if (this.selectedImage) {
        try {
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
          const response = await axios.post('/tips/create', postData);
          console.log(response);
          await this.$router.push('/create');
        } catch (error) {
          console.log(error);
          alert('이미지 업로드 중 오류가 발생했습니다.');
        }
      } else {
        if (this.$route.params.seq) {
          axios.put('/tips/create', this.$data)
              .then((response) => {
                console.log(response)
                this.$router.push('/create')
              })
              .catch((error) => {
                console.log(error)
              })
        } else {
          // this.$data.regDt = this.getNowDate()
          // this.$data.uptDt = this.getNowDate()
          axios.post('/tips/create', this.$data)
              .then((response) => {
                console.log(response)
                this.$router.push('/create')
              })
              .catch((error) => {
                console.log(error)
              })
        }
      }
    },
    handleFileChange(event) {
      this.selectedImage = event.target.files[0];
    },
  },
    // getNowDate() {
      // var nowDate = new Date()
      // var year = nowDate.getFullYear().toString()
      // var month = (nowDate.getMonth() + 1).toString()
      // var day = nowDate.getDate().toString()
      //
      // return year + "-" + (month[1] ? month : "0" + month[0]) + "-" + (day[1] ? day : "0" + day[0])
    // }
  data () {
    return {
      title : '',
      content: '',
      // uptDt: '',
      // regDt: ''
      selectedImage: null,

    }
  }
}
</script>
