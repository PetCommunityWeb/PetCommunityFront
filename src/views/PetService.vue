<template>
  <div>
    <div id="kakao-map" style="width:1000px;height:400px;"></div>
    <ul v-if="paginatedPlacesInfo.length" class="place-list">
      <li v-for="place in paginatedPlacesInfo" :key="place.id" class="place-item">
        <strong class="place-title">
          <v-icon left small>mdi-dog</v-icon>
          {{ place.place_name }}
        </strong>
        <p class="place-details">`
          카테고리: <span class="place-category">{{ place.category_name }}</span><br>
          연락처: <span class="place-phone">{{ place.phone ? place.phone : '없음' }}</span><br>
          주소: <span class="place-address">{{ place.address_name }}</span><br>
          거리: <span class="place-distance">{{ formatDistance(place.distance) }}</span><br>
        </p>
        <a :href="place.place_url" target="_blank" class="place-link">자세히 보기</a>
        <hr class="place-separator">
      </li>
    </ul>
    <div class="pagination">
      <button v-for="page in totalPageCount" :key="page" @click="changePage(page)">
        {{ page }}
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: "PetService",
  data() {
    return {
      map: null,
      infoWindow: new window.kakao.maps.InfoWindow({ zIndex:1 }), // kakao를 직접적으로 사용하는 대신 window.kakao를 사용하여 명시적으로 전역 객체임을 나타내기
      isInfoWindowOpen: false,  // infoWindow 상태를 추적하기 위한 변수
      currentMarker: null,      // 현재 infoWindow가 연결된 마커를 추적
      placesInfo: [],
      itemsPerPage: 4,  // 페이지당 표시할 항목의 수
      currentPage: 1    // 현재 페이지 번호
    };
  },
  // 샵 페이지 계산
  computed: {
    paginatedPlacesInfo() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.placesInfo.slice(start, end);
    },
    totalPageCount() {
      return Math.ceil(this.placesInfo.length / this.itemsPerPage);
    }
  },
  mounted() {
    this.initMap();
  },
  methods: {
    initMap() {
      const container = document.getElementById('kakao-map');
      const options = {
        center: new window.kakao.maps.LatLng(37.5665, 126.9780),
        level: 3 // 지도 확대 수준
      };

      this.map = new window.kakao.maps.Map(container, options);

      // dragend 이벤트를 추가하여 지도의 중심이 변경되면 애견샵을 다시 검색합니다.
      window.kakao.maps.event.addListener(this.map, 'dragend', () => {
        const center = this.map.getCenter();
        this.searchPlaces(center);
      });

      // 사용자의 위치 정보를 요청합니다.
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          const locPosition = new window.kakao.maps.LatLng(lat, lon);
          this.map.setCenter(locPosition);

          // 사용자의 현재 위치를 기준으로 애견샵 검색
          this.searchPlaces(locPosition);
        }, () => {
          console.error("Geolocation access denied.");
          this.searchPlaces(new window.kakao.maps.LatLng(37.5665, 126.9780));  // 만약 위치 접근에 실패하면 기본 좌표를 사용
        });
      } else {
        console.error("This browser does not support Geolocation.");
        this.searchPlaces(new window.kakao.maps.LatLng(37.5665, 126.9780));  // Geolocation을 지원하지 않는 브라우저의 경우 기본 좌표를 사용
      }
    },
    searchPlaces(location) {
      const places = new window.kakao.maps.services.Places();

      places.keywordSearch("애견샵", (result, status) => {
        if (status === window.kakao.maps.services.Status.OK) {
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
      const marker = new window.kakao.maps.Marker({
        map: this.map,
        position: new window.kakao.maps.LatLng(place.y, place.x)
      });

      window.kakao.maps.event.addListener(marker, 'click', () => {
        if (this.isInfoWindowOpen && this.currentMarker === marker) {  // 이미 infoWindow가 열려있고, 현재 마커가 같다면
          this.infoWindow.close();  // infoWindow를 닫습니다.
          this.isInfoWindowOpen = false;
        } else {
          this.displayInfoWindow(marker, place);
        }
      });
    },
    displayInfoWindow(marker, place) {
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
    changePage(page) {
      this.currentPage = page;
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
  display: flex;
  align-items: center;
}
.place-title v-icon {
  margin-right: 10px;
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

.pagination {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.pagination button {
  padding: 5px 10px;
  margin: 0 5px;
  background-color: #f5f5f5;
  border: 1px solid #ddd;
  cursor: pointer;
}

.pagination button:hover {
  background-color: #007BFF;
  color: #fff;
}
</style>
