<template>
  <div>
    <div id="kakao-map" style="width:2000px;height:800px;"></div>
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
      currentMarker: null      // 현재 infoWindow가 연결된 마커를 추적
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

      // "애견샵" 키워드로 주변의 장소를 검색
      places.keywordSearch("애견샵", (result, status) => {
        if (status === kakao.maps.services.Status.OK) {
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
  }
}
</script>

<style scoped>

</style>
