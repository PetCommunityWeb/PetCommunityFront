<template>
  <div>
    <v-app>
      <v-container>
          <h1 align="center" style="margin:15px 0 15px 0;">커뮤니티</h1>
        <v-row justify="center" class="header mt-3"> <!-- mt-3 추가 -->

          <v-col cols="auto" class="mb-0">
            <router-link to="/community/feed">
              <v-btn color="primary" dark>Feed</v-btn>
            </router-link>
          </v-col>
          <v-col cols="auto" class="mb-1">
            <router-link to="/community/tip">
              <v-btn color="error" dark>Tip</v-btn>
            </router-link>
          </v-col>
          <v-col cols="12">
            <router-view></router-view>
          </v-col>
        </v-row>
      </v-container>
    </v-app>
  </div>
</template>





<script>
export default {
  name: 'CommunityPage'
}
</script>


<style scoped>
.mt-n2 {
  margin-top: -16px; /* 예시로 작성한 값입니다. 필요에 따라 조정하세요. */
}
</style>
