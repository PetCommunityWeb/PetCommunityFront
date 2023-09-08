<template>
    <div>
        <h1 style="margin:27px 0 15px 0;" align="center">반려동물 서비스</h1>
        <div id="kakao-map"></div>

        <!--        장소 리스트 출력-->
        <ul v-if="paginatedPlacesInfo.length" class="place-list">
            <li v-for="place in paginatedPlacesInfo" :key="place.id" class="place-item">
                <strong class="place-title">
                    <v-icon left large style="margin-bottom: 5px;">mdi-dog</v-icon>
                    {{ place.place_name }}
                </strong>
                <p class="place-details">
                    카테고리: <span class="place-category">{{ place.category_name }}</span><br>
                    연락처: <span class="place-phone">{{ place.phone ? place.phone : '없음' }}</span><br>
                    주소: <span class="place-address">{{ place.address_name }}</span><br>
                    거리: <span class="place-distance">{{ formatDistance(place) }}</span><br>
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
            infoWindow: new window.kakao.maps.InfoWindow({zIndex: 1}), // kakao를 직접적으로 사용하는 대신 window.kakao를 사용하여 명시적으로 전역 객체임을 나타내기
            isInfoWindowOpen: false,  // infoWindow 상태를 추적하기 위한 변수
            currentMarker: null,      // 현재 infoWindow가 연결된 마커를 추적
            placesInfo: [],
            itemsPerPage: 4,  // 페이지당 표시할 항목의 수
            currentPage: 1,    // 현재 페이지 번호
            currentUserLocation: null,  // 사용자의 현재 위치를 저장하기 위한 변수
            markers: []  // 모든 마커를 추적하는 배열을 추가
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
                    this.currentUserLocation = new window.kakao.maps.LatLng(lat, lon);  // 사용자의 위치 업데이트
                    this.map.setCenter(this.currentUserLocation);

                    // 사용자의 현재 위치를 기준으로 애견샵 검색
                    this.searchPlaces(this.currentUserLocation);
                }, () => {
                    console.error("Geolocation access denied.");
                    this.searchPlaces(new window.kakao.maps.LatLng(37.5665, 126.9780));
                });
            } else {
                console.error("This browser does not support Geolocation.");
                this.searchPlaces(new window.kakao.maps.LatLng(37.5665, 126.9780));  // Geolocation을 지원하지 않는 브라우저의 경우 기본 좌표를 사용
            }
        },
        searchPlaces(location) {
            const places = new window.kakao.maps.services.Places();

            // 이전 마커를 모두 제거하는 코드를 추가합니다.
            for (let i = 0; i < this.markers.length; i++) {
                this.markers[i].setMap(null);
            }
            this.markers = [];

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

            // 새 마커를 추적 배열에 추가합니다.
            this.markers.push(marker);

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

        // kakao.maps.geometry 안되서 계산 따로
        getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
            const R = 6371; // 지구의 반경 (킬로미터)
            const dLat = this.deg2rad(lat2 - lat1);
            const dLon = this.deg2rad(lon2 - lon1);
            const a =
                Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
                Math.sin(dLon / 2) * Math.sin(dLon / 2)
            ;
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            const distance = R * c; // 거리 (킬로미터)
            return distance;
        },

        deg2rad(deg) {
            return deg * (Math.PI / 180);
        },

        formatDistance(placeLocation) {
            if (!this.currentUserLocation || !placeLocation || !placeLocation.y || !placeLocation.x) return '알 수 없음';

            const distance = this.getDistanceFromLatLonInKm(
                this.currentUserLocation.getLat(),
                this.currentUserLocation.getLng(),
                placeLocation.y,
                placeLocation.x
            );

            return `${distance.toFixed(2)} km`; // 소수점 둘째자리까지 반올림
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
    height: 550px;
    margin: 15px auto 0 auto; /* 상단에 50px 여백을 추가하고 가운데 정렬 */
}

.place-list {
    margin-top: 15px;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0 20px;
    list-style-type: none; /* 리스트 앞의 점 제거 */

}

.place-item {
    width: 1000px;
    background-color: #f8f8f8; /* 배경색상 설정 */
    margin-bottom: 10px; /* 항목 간 간격 설정 */
    padding: 10px; /* 항목 내 여백 설정 */
    border: 1px solid #ddd; /* 테두리 설정 */
}

.place-title {
    font-size: 25px; /* 제목 폰트 크기 설정 */
    margin-bottom: 5px; /* 제목과 내용 간 간격 설정 */
}

.place-title v-icon {
    margin-right: 10px;
}

.place-details {
    font-size: 14px; /* 내용 폰트 크기 설정 */
    color: #333; /* 내용 텍스트 색상 설정 */
}

.place-category, .place-phone, .place-address, .place-distance {
    color: #555;
}

.place-link {
    display: inline-block;
    margin-top: 10px;
    padding: 5px 10px;
    background-color: mediumseagreen;
    color: white;
    text-decoration: none;
    border-radius: 3px;
}

.place-separator {
    border: 1px solid #ddd;
    margin-top: 10px; /* 구분선과 항목 간 간격 설정 */
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
