<template>
  <div>
    <v-app>
      <v-container>
        <v-row justify="center" class="text-center mt-3"> <!-- mt-3 추가 -->
          <v-col cols="12" class="mb-0">
            <h1>커뮤니티</h1>
          </v-col>
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

<style>
/* 필요한 스타일 추가 */
</style>
