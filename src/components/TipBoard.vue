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
    </v-data-table>
    <v-row>
      <v-btn outlined color="blue" @click="writeClick" > 글쓰기 </v-btn>
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
        // this.requestBody = {
        //   title: this.title,
        //   username: this.username,
        //   likeCount: this.likeCount,
        //   page: this.page
        // };

        const response = await axios.get("/tips");
        console.log(response)
        this.tips = response.data.map(item => ({ ...item, username: item.username }));
      } catch (error) {
        console.error("Error fetching tips:", error);
      }
    },
    writeClick() {
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
        { text: 'Title', value: 'title' },
        { text: 'Username', value: 'username' },
        { text: 'Like', value: 'likeCount'}
        // { text: 'Reg Date', value: 'regDt' }
      ],
      tips: [],
    };
  }
};
</script>
