<template>
  <div class="map-container">
    <h1>병원찾기</h1>
    <div class="content-wrapper">
      <div id="kakao-map"></div>
      <div class="hospital-list">
        <div class="hospital" v-for="hospital in hospitals" :key="hospital.id">
          <h3>{{ hospital.name }}</h3>
          <p>주소: {{ hospital.address }}</p>
          <!-- 병원에 대한 추가 정보를 여기에 표시하실 수 있습니다. -->
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import axios from "@/axios/axios-instance";

export default {
  name: "FindHospital",
  data() {
    return {
      hospitals: [],
      map: null  // 맵 객체를 저장할 변수
    };
  },
  mounted() {
    this.fetchHospitalData();
    this.initMap();
  },
  methods: {
    fetchHospitalData() {
      axios.get("/hospitals")
          .then(response => {
            this.hospitals = response.data;
            this.addMarkers();
          })
          .catch(error => {
            console.error("Failed to fetch hospital data:", error);
          });
    },
    initMap() {
      const container = document.getElementById('kakao-map');
      const options = {
        center: new window.kakao.maps.LatLng(37.5665, 126.9780),  // 일단 기본 위치로 설정
        level: 3
      };
      this.map = new window.kakao.maps.Map(container, options);

      // 사용자의 현재 위치를 받아오기
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          const locPosition = new window.kakao.maps.LatLng(lat, lng);
          this.map.setCenter(locPosition);  // 사용자의 현재 위치를 지도의 중심으로 설정
        }, () => {
          console.error("Geolocation access denied.");  // 위치 정보를 받아오는데 실패한 경우
        });
      } else {
        console.error("Geolocation not supported in this browser.");  // 지원하지 않는 브라우저의 경우
      }
    },
    addMarkers() {
      this.hospitals.forEach(hospital => {
        const markerPosition = new window.kakao.maps.LatLng(hospital.latitude, hospital.longitude);
        const marker = new window.kakao.maps.Marker({
          position: markerPosition
        });
        marker.setMap(this.map);
      });
    }
  }
}
</script>

<style scoped>
.map-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100vh;
}

.content-wrapper {
  display: flex;
}

#kakao-map {
  width: 1000px;
  height: 1000px;
}

.hospital-list {
  width: 300px;  /* 원하는 너비로 조정하세요. */
  height: 1000px;
  overflow-y: auto;
  border-left: 1px solid #ccc;
  padding-left: 20px;
}

.hospital {
  margin-bottom: 20px;
}
</style>