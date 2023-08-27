<template>
  <div class="map-container">
    <h1>병원찾기</h1>
    <div class="content-wrapper">
      <div id="kakao-map"></div>
      <div class="hospital-list">
        <v-card v-for="hospital in visibleHospitals" :key="hospital.id" class="mb-5">
          <v-card-title>{{ hospital.name }}</v-card-title>
          <v-card-subtitle>{{ hospital.address }}</v-card-subtitle>
          <v-card-text>
            전화번호: {{ hospital.phoneNumber }}<br>
            진료과목: {{ hospital.subjectEnums.join(', ') }}<br>
            진료동물: {{ hospital.speciesEnums.join(', ') }}
          </v-card-text>
          <v-card-actions>
            <v-btn color="primary" text :to="`/hospital/${hospital.id}`">자세히</v-btn>
          </v-card-actions>
        </v-card>
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
      visibleHospitals: [],  // 화면에 표시될 병원들의 배열
      map: null
    };
  },
  mounted() {
    this.fetchHospitalData();
    this.initMap();
    window.kakao.maps.event.addListener(this.map, 'bounds_changed', this.updateVisibleHospitals);
  },
  methods: {
    updateVisibleHospitals() {
      const bounds = this.map.getBounds();
      const swLatLng = bounds.getSouthWest(); // 남서쪽 좌표
      const neLatLng = bounds.getNorthEast(); // 북동쪽 좌표

      this.visibleHospitals = this.hospitals.filter(hospital => {
        return (
            hospital.latitude >= swLatLng.getLat() &&
            hospital.latitude <= neLatLng.getLat() &&
            hospital.longitude >= swLatLng.getLng() &&
            hospital.longitude <= neLatLng.getLng()
        );
      });
    },
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

        // InfoWindow의 내용을 설정합니다.
        const iwContent = `
          <div style="max-width: 300px; word-wrap: break-word; font-size: 12px;">
            <strong>${hospital.name}</strong><br>
            주소: ${hospital.address}<br>
            전화번호: ${hospital.phoneNumber}<br>
            <button onclick="window.location='/hospital/${hospital.id}'">자세히</button>
          </div>`;

        const infowindow = new window.kakao.maps.InfoWindow({
          content: iwContent
        });

        window.kakao.maps.event.addListener(marker, 'click', () => {
          infowindow.open(this.map, marker);
        });
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