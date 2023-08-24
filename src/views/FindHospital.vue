<template>
  <div>
    <div id="kakao-map" style="width: 100%; height: 400px;"></div>
  </div>
</template>

<script>
export default {
  name: "FindHospital",
  mounted() {
    this.initMap();
  },
  methods: {
    initMap() {
      // 카카오맵 생성
      const container = document.getElementById('kakao-map');
      const options = {
        center: new window.kakao.maps.LatLng(37.5665, 126.9780),  // 서울시청을 중심으로 지도를 표시
        level: 3  // 지도 확대 레벨
      };

      const map = new window.kakao.maps.Map(container, options);
    }
  }
}
</script>

<style scoped>
/* 필요한 스타일을 추가합니다. */
</style>
