<template>
  <div>
    <div id="kakao-map" style="width:1000px;height:400px;"></div>
    <ul v-if="placesInfo.length" class="place-list">
      <li v-for="place in placesInfo" :key="place.id" class="place-item">
        <strong class="place-title">{{ place.place_name }}</strong>
        <p class="place-details">
          카테고리: <span class="place-category">{{ place.category_name }}</span><br>
          연락처: <span class="place-phone">{{ place.phone ? place.phone : '없음' }}</span><br>
          주소: <span class="place-address">{{ place.address_name }}</span><br>
          거리: <span class="place-distance">{{ formatDistance(place.distance) }}</span><br>
        </p>
        <a :href="place.place_url" target="_blank" class="place-link">자세히 보기</a>
        <hr class="place-separator">
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "PetService",
  data() {
    return {
      map: null,
      infoWindow: new kakao.maps.InfoWindow({ zIndex:1 }),
      isInfoWindowOpen: false,  // infoWindow 상태를 추적하기 위한 변수
      currentMarker: null,      // 현재 infoWindow가 연결된 마커를 추적
      placesInfo: []
    };
  },
  mounted() {
    this.initMap();
  },
  methods: {
    initMap() {
      const container = document.getElementById('kakao-map');
      const options = {
        center: new kakao.maps.LatLng(37.5665, 126.9780),
        level: 3
      };

      this.map = new kakao.maps.Map(container, options);

      // 사용자의 위치 정보를 요청합니다.
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          const locPosition = new kakao.maps.LatLng(lat, lon);
          this.map.setCenter(locPosition);

          // 사용자의 현재 위치를 기준으로 애견샵 검색
          this.searchPlaces(locPosition);
        }, () => {
          console.error("Geolocation access denied.");
          this.searchPlaces(new kakao.maps.LatLng(37.5665, 126.9780));  // 만약 위치 접근에 실패하면 기본 좌표를 사용
        });
      } else {
        console.error("This browser does not support Geolocation.");
        this.searchPlaces(new kakao.maps.LatLng(37.5665, 126.9780));  // Geolocation을 지원하지 않는 브라우저의 경우 기본 좌표를 사용
      }
    },
    searchPlaces(location) {
      const places = new kakao.maps.services.Places();

      places.keywordSearch("애견샵", (result, status) => {
        if (status === kakao.maps.services.Status.OK) {
          this.placesInfo = result; // 검색된 결과를 placesInfo에 저장
          for (let i = 0; i < result.length; i++) {
            this.displayMarker(result[i]);
          }
        } else {
          console.error("Failed to fetch places");
        }
      }, {
        location: location
      });
    },
    displayMarker(place) {
      const marker = new kakao.maps.Marker({
        map: this.map,
        position: new kakao.maps.LatLng(place.y, place.x)
      });

      kakao.maps.event.addListener(marker, 'click', () => {
        if (this.isInfoWindowOpen && this.currentMarker === marker) {  // 이미 infoWindow가 열려있고, 현재 마커가 같다면
          this.infoWindow.close();  // infoWindow를 닫습니다.
          this.isInfoWindowOpen = false;
        } else {
          this.displayInfoWindow(marker, place);
        }
      });
    },
    displayInfoWindow(marker, place) {
      console.log(place);
      const content = `
        <div style="padding:10px; border: 1px solid #ddd; border-radius: 5px; background-color: #f9f9f9; width: 200px;">
          <strong style="font-size: 16px; color: #333;">${place.place_name}</strong>
          <p style="margin-top: 8px; font-size: 14px; color: #777;">
            <strong>카테고리:</strong> ${place.category_name}<br>
            <strong>연락처:</strong> ${place.phone ? place.phone : '없음'}<br>
            <strong>주소:</strong> ${place.address_name}<br>
          </p>
          <a href="${place.place_url}" target="_blank" style="display: inline-block; margin-top: 10px; padding: 5px 10px; border-radius: 3px; background-color: #007BFF; color: #fff; text-decoration: none;">자세히 보기</a>
        </div>
      `;

      this.infoWindow.setContent(content);
      this.infoWindow.open(this.map, marker);
      this.isInfoWindowOpen = true;  // infoWindow가 열렸음을 상태에 반영합니다.
      this.currentMarker = marker;   // 현재 마커를 상태에 저장합니다.
    },

    formatDistance(distance) {
      if (!distance) return '알 수 없음';
      const kmDistance = distance / 1000; // m를 km로 변환
      return `${kmDistance.toFixed(2)} km`; // 소수점 둘째자리까지 반올림
    },
  }
}
</script>

<style scoped>

#kakao-map {
  width: 1000px;
  height: 400px;
  margin: 50px auto 0 auto;  /* 상단에 50px 여백을 추가하고 가운데 정렬 */
}

.place-list {
  margin-top: 30px;
  list-style-type: none; /* 글뭉단 기호 제거 */
  padding-left: 0; /* 기본 패딩 제거 */
}

.place-item {
  padding: 15px;
  background-color: #f5f5f5;
  border-radius: 5px;
  margin-bottom: 20px;
}

.place-title {
  font-size: 18px;
  color: #333;
  margin-bottom: 10px;
  display: block;
}

.place-details {
  font-size: 14px;
}

.place-category, .place-phone, .place-address, .place-distance {
  color: #555;
}

.place-link {
  display: inline-block;
  margin-top: 10px;
  padding: 5px 10px;
  background-color: #007BFF;
  color: #fff;
  text-decoration: none;
  border-radius: 3px;
}

.place-separator {
  margin-top: 20px;
  border: none;
  border-top: 1px solid #ddd;
}

</style>
