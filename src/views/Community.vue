<template>
  <div>
    <h1>커뮤니티</h1>
    <router-link to="/community/feed">Feed 게시판</router-link>
    <router-link to="/community/tip">Tip 게시판</router-link>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: "Community"
}
</script>

<style scoped>
/* 필요한 스타일을 여기에 추가 */
</style>