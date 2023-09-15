<template>
  <v-container>
    <v-data-table
        :headers="headers"
        :items="tips"
        :items-per-page="10"
        class="elevation-1"
        @click:row="rowClick"
    >
      <template v-slot:tip="{ tip }">
        {{ tip.user ? tip.user.username : 'Unknown' }}
      </template>

      <template v-slot:item.title="{ item }">
        <div class="d-flex align-center">
          <v-img v-if="item.thumbnailImage" :src="item.thumbnailImage" class="thumbnail-image"></v-img>
          {{ item.title }}
        </div>
      </template>
    </v-data-table>

    <v-row class="mt-5 pa-3 elevation-1 rounded">
      <v-col cols="2">
        <v-combobox
            v-model="searchType"
            :items="['제목', '내용']"
            dense
        ></v-combobox>
      </v-col>
      <v-col cols="4">
        <v-text-field
            v-model="searchKeyword"
            outlined
            dense
            prepend-inner-icon="mdi-magnify"
            @input="searchTips"
        ></v-text-field>
      </v-col>
<!--      <v-col cols="2">-->
<!--        <v-btn class="large-btn search-btn" @click="searchTips" color="blue" outlined large left  tile>검색</v-btn>-->
<!--      </v-col>-->
      <v-col cols="4" class="text-right">
        <v-btn class="large-btn" outlined color="blue" large @click="writeClick" tile> 글쓰기 </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from "@/axios/axios-instance";
import {mapState} from "vuex";
import {checkAuthAndAlert} from "@/methods/authChecker";
import debounce from 'lodash/debounce';

export default {
  name:'TipBoard',
  created() {
    this.fetchTips();
    // debounce 적용
    this.searchTips = debounce(this.searchTips, 100); // 300ms 디바운스
  },
  computed: {
    ...mapState('user', ['username']), // 사용자 이름 가져오기
  },
  methods: {
    async fetchTips() {
      try {
        const response = await axios.get("/tips");
        // this.tips = response.data.map(item => ({ ...item, username: item.username }));
        this.tips = response.data.map(item => {
          const imgRegex = /<img[^>]+src="([^">]+)"/;
          const matches = item.content.match(imgRegex);
          const thumbnail = matches ? matches[1] : null;
          return { ...item, username: item.username, thumbnailImage: thumbnail };
        });
      } catch (error) {
        console.error("Error fetching tips:", error);
      }
    },
    async searchTips() {
      if (!this.searchKeyword.trim()) {
        this.fetchTips();
        return;
      }

      if (this.searchType === '제목' && this.searchKeyword) {
        try {
          const response = await axios.get("/tips/title", {
            params: {
              keyword: this.searchKeyword
            }
          });
          this.tips = response.data.map(item => ({ ...item, username: item.username }));
          // eslint-disable-next-line no-empty
        } catch (error) {
        }
      }
      else if (this.searchType === '내용' && this.searchKeyword) {
        try {
          const response = await axios.get("/tips/content", {
            params: {
              keyword: this.searchKeyword
            }
          });
          this.tips = response.data.map(item => ({ ...item, username: item.username }));
        } catch (error) {
          console.error("Error searching by content:", error);
        }
      }
    },
    writeClick() {
      if (!checkAuthAndAlert()) {
        return;
      }
      this.$router.push('/community/tip/create');
    },
    rowClick(tip) {
      this.$router.push('/community/tip/' + tip.id);
    }
  },
  data() {
    return {
      requestBody: {},
      headers: [
        { text: '제목', value: 'title' },
        { text: '작성자', value: 'username' },
        { text: 'Like', value: 'likeCount'}
        // { text: 'Reg Date', value: 'regDt' }
      ],
      tips: [],
      searchType: '제목', // 초기 검색 조건을 '제목'으로 설정
      searchKeyword: ''    // 검색 키워드 저장
    };
  }
};
</script>

<style scoped>
.large-btn {
  padding: 10px 16px !important;
  border-radius: 25px !important;
}
.large-btn.search-btn {
  margin-left: 0px !important;  /* 검색버튼을 왼쪽으로 30px 옮기는 부분 */
}
.thumbnail-image {
  max-width: 50px;
  max-height: 50px;
  margin-right: 25px; /* 이 값을 조정하여 원하는 간격으로 설정 */
}
</style>
