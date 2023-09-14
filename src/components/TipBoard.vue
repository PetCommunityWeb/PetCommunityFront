<template>
  <v-container>
    <v-data-table
        :key="tips"
        :headers="headers"
        :items="tips"
        :items-per-page="10"
        class="elevation-1"
        @click:row="rowClick"
    >
      <template v-slot:tip="{ tip }">
        {{ tip.user ? tip.user.username : 'Unknown' }}
      </template>
    </v-data-table>
    <v-row>
      <v-btn outlined color="blue" @click="writeClick" > 글쓰기 </v-btn>
    </v-row>
    <v-row :style="{marginTop: '50px'}">
      <v-col cols="12" md="2" />
      <v-col cols="12" md="2">
        <v-select
            :items="searchoption"
            v-model="searchoptionselected"
            :style="{width:'90px', marginLeft:'90px'}" />
      </v-col>
      <v-col cols="12" md="4">
        <v-text-field v-model="searchkeyword" dense outlined label="검색키워드"
                      full-width :style="{marginTop:'10px'}"/>
      </v-col>
      <v-col cols="12" md="1">
        <v-btn @click="searchstart" :style="{marginTop:'10px'}">검색</v-btn>
      </v-col>
      <v-col cols="12" md="3" />
    </v-row>
    <v-row v-if="searchfinish===true" :style="{marginTop:'0px'}">
      <v-col cols="12" md="5"/>
      <v-col cols="12" md="2">
        <div style="font-size: x-large">검색결과 : {{searchcnt}} 개</div>
      </v-col>
      <v-col cols="12" md="5"/>
    </v-row>
    <!-- 여기서부터는 게시판 페이지와 거의 일치, 검색완료시에만 표가 나타나게 했고, 게시판 번호 표시 -->
    <v-row v-if="searchfinish===true">
      <v-simple-table style="width: 100%;">
        <thead>
        <tr style="font-weight: bolder;">
          <td style="width:20%; font-size: x-large;">작성자</td>
          <td style="width:50%; font-size: x-large;">제목</td>
          <td style="width:20%; font-size: x-large;">작성일</td>
        </tr>
        </thead>
        <tbody>
        <tr v-for="item in contentlist" :key="item.id" @click="movetocontent(item.boardnum, item.id)">
          <td>{{item.username}}</td>
          <td>{{item.title}}</td>
          <td>{{item.createdAt.split('T')[0]}}</td>
        </tr>
        </tbody>
      </v-simple-table>
    </v-row>
  </v-container>

</template>

<script>
import axios from "@/axios/axios-instance";
// import AWS from 'aws-sdk';
import {mapState} from "vuex";

export default {
  name:'TipBoard',
  created() {
    this.fetchTips();
  },
  computed: {
    ...mapState('user', ['username']), // 사용자 이름 가져오기
  },
  methods: {
    async fetchTips() {
      try {
        this.requestBody = {
          title: this.title,
          username: this.username,
          likeCount: this.likeCount,
          createdAt: this.createdAt,
          modifiedAt: this.modifiedAt,
          customLocalDateTimeFormat: this.customLocalDateTimeFormat,
          page: this.page
        };
        const response = await axios.get("/tips", {
          params: this.requestBody
        });

        // this.tips = response.data;
        this.tips = response.data.map(item => ({ ...item, username: item.username }));
      } catch (error) {
        console.error("Error fetching tips:", error);
      }
    },
    writeClick() {
      if (!this.$store.state.id) {
        alert('로그인이 필요합니다.');
        return;
      }
      this.$router.push('/community/tip/create');
    },
    rowClick(tip) {
      this.$router.push('/community/tip/' + tip.id);
    },
    // method 속성 추가 코드
    movetocontent(tip) {    // 검색된 게시글 클릭시 해당 게시글로 이동
      this.$router.push('/community/tip/' + tip.id);
    },
    searchstart(){            // 검색버튼 눌렀을때 실행
      if(this.searchkeyword === '') {
        alert('키워드가 없습니다!');
      } else {
        axios({
          url: "http://localhost:8080/api/tips/search",
          method: "GET",
          data: {        // 선택된 검색옵션과 검색키워드 넘겨줌
            searchoption: this.searchoptionselected,
            searchkeyword: this.searchkeyword,
          },
        }).then(res => {
          this.contentlist = res.data;
          this.searchcnt = this.contentlist[Object.keys(this.contentlist).length-1].cnt;
          this.contentlist.pop();
          alert('검색완료!');
          this.searchfinish = true;
          this.searchkeyword = '';
        }).catch(err => {
          alert(err);
        });
      }
    },
  },
  data() {
    return {
      searchkeyword: '',        // 검색키워드
      searchfinish: false,        // 검색완료시 true로 바뀌고, 이때부터 표 생성
      searchoption: ['제목','작성자'],    // 검색옵션
      searchoptionselected: '제목',    // 검색옵션값 받아오기, 기본값은 제목으로 지정
      searchcnt: 0,            // 검색된 게시글 갯수
      contentlist: [],            // 게시글 리스트
      requestBody: {},
      headers: [
        { text: 'Title', value: 'title' },
        { text: 'Username', value: 'username' },
        { text: 'Like', value: 'likeCount'},
        { text: 'Date', value: 'customLocalDateTimeFormat'},

      ],
      tips: [],
    };
  }
};
</script>
