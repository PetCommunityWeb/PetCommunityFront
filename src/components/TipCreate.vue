<template>
  <div class="editor-page">
    <v-text-field
        label="제목"
        v-model="title"
        outlined
        class="mb-4"
    ></v-text-field>

    <div class="content-section mb-4">
      <label for="summernote">내용</label>
      <div id="summernote"></div>
    </div>

    <v-btn color="primary" @click="writeClick">등록</v-btn>
  </div>
</template>
<script>
import axios from "@/axios/axios-instance";
import AWS from 'aws-sdk';

export default {
  mounted() {
    $('#summernote').summernote({
      height: 400,
      minHeight: null,
      maxHeight: null,
      focus: true,
      toolbar: [
        ['style', ['bold', 'italic', 'underline']],
        ['fontsize', ['fontsize']],
        ['color', ['color']],
        ['para', ['paragraph']],
        ['height', ['height']],
        ['Insert', ['picture']],
        ['Mics',['codeview']]
      ]
    });
  },
  name: 'TipCreate',
  data() {
    return {
      title: '',   // 데이터 속성 추가
      content: '', // 데이터 속성 추가
    };
  },
  methods: {
    async writeClick() {
      // Summernote 에디터에서 내용 가져오기
      this.content = $('#summernote').summernote('code');

      // 데이터 준비
      const postData = {
        title: this.title,
        content: this.content,
      };

      try {
        const response = await axios.post('/tips/create', postData);
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
  },
};
</script>

<style scoped>
/* 필요한 스타일링은 이곳에 추가하세요 */
.content-section label {
  display: block;
  margin-bottom: 10px;
}
</style>