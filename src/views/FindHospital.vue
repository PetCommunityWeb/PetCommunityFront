<template>
    <div class="map-container">
        <h1 style="margin:15px 0 15px 0;">병원 찾기</h1>
        <div class="filter-container">
            <v-select v-model="selectedSubject" :items="subjectEnums" label="진료 과목"></v-select>
            <v-select v-model="selectedSpecies" :items="speciesEnums" label="동물 종류"></v-select>
            <v-select v-model="selectedDay" :items="days" item-text="label" item-value="value" label="진료 요일"></v-select>
            <v-btn @click="fetchHospitalData">조회하기</v-btn>
        </div>
        <div class="content-wrapper">
            <div id="kakao-map"></div>
            <div class="hospital-list">
                <v-card v-for="hospital in visibleHospitals" :key="hospital.id" class="mb-5">
                    <img :src="hospital.imageUrl || require('@/assets/logo.png')" alt="병원 이미지" class="hospital-image">
                    <v-card-title>{{ hospital.name }}</v-card-title>
                    <v-card-subtitle>{{ hospital.address }}</v-card-subtitle>
                    <div class="rating-container">
                        <v-icon color="yellow" v-for="n in parseInt(averageRating(hospital))"
                                :key="`full-${hospital.id}-${n}`">mdi-star
                        </v-icon>
                        <v-icon color="yellow" v-if="averageRating(hospital) % 1 >= 0.5" :key="`half-${hospital.id}`">
                            mdi-star-half
                        </v-icon>
                    </div>
                    <v-card-text>
                        전화번호: {{ hospital.phoneNumber }}<br>
                        진료과목: {{ hospital.subjectEnums.join(', ') }}<br>
                        진료동물: {{ hospital.speciesEnums.join(', ') }}<br>
                        운영 요일: {{ formatOperatingDays(hospital.operatingDays) }}<br>
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
            speciesEnums: ["없음","강아지", "고양이", "기타"], // 예시
            subjectEnums: ["없음","내과", "외과", "정형외과"],   // 예시
            days: [
                { label: "없음", value: null },
                { label: "월요일", value: "MONDAY" },
                { label: "화요일", value: "TUESDAY" },
                { label: "수요일", value: "WEDNESDAY" },
                { label: "목요일", value: "THURSDAY" },
                { label: "금요일", value: "FRIDAY" },
                { label: "토요일", value: "SATURDAY" },
                { label: "일요일", value: "SUNDAY" },
            ],
            selectedSpecies: null,
            selectedSubject: null,
            selectedDay: null,
            hospitals: [],
            visibleHospitals: [],  // 화면에 표시될 병원들의 배열
            map: null,
            markers: [],  // 이 배열은 지도에 추가된 모든 마커를 추적합니다.
        };
    },
    mounted() {
        this.fetchHospitalData();
        this.initMap();
        window.kakao.maps.event.addListener(this.map, 'bounds_changed', this.updateVisibleHospitals);
        document.addEventListener('routeToHospital', this.handleRouteEvent);
    },
    beforeDestroy() {
        // 이벤트 리스너 제거
        document.removeEventListener('routeToHospital', this.handleRouteEvent);
    },
    methods: {
        formatOperatingDays(days) {
            const koreanDays = {
                MONDAY: '월요일',
                TUESDAY: '화요일',
                WEDNESDAY: '수요일',
                THURSDAY: '목요일',
                FRIDAY: '금요일',
                SATURDAY: '토요일',
                SUNDAY: '일요일'
            };
            return days.map(day => koreanDays[day]).join(', ');
        },
        averageRating(hospital) {
            if (hospital.reviews && hospital.reviews.length > 0) {
                const totalRating = hospital.reviews.reduce((sum, review) => sum + review.rate, 0);
                return parseFloat((totalRating / hospital.reviews.length).toFixed(1));
            }
            return 0;
        },
        handleRouteEvent(event) {
            const hospitalId = event.detail.hospitalId;
            this.$router.push({path: `/hospital/${hospitalId}`});
        },
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
            const params = {};

            // 선택된 필터에 따라 쿼리 파라미터 설정
            if (this.selectedSpecies && this.selectedSpecies !== "없음") {
                params.species = this.selectedSpecies;
            }
            if (this.selectedSubject && this.selectedSubject !== "없음") {
                params.subject = this.selectedSubject;
            }
            if (this.selectedDay && this.selectedDay !== "없음") {
                params.operatingDay = this.selectedDay;
            }

            console.log(params)
            axios.get("/hospitals", {params: params})
                .then(response => {
                    this.hospitals = response.data;
                    console.log(this.hospitals)
                    this.addMarkers();
                    this.updateVisibleHospitals();
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
            this.markers.forEach(marker => {
                marker.setMap(null);
            });
            this.markers = [];  // 마커 배열을 초기화합니다.
            this.hospitals.forEach(hospital => {
                const markerPosition = new window.kakao.maps.LatLng(hospital.latitude, hospital.longitude);
                const marker = new window.kakao.maps.Marker({
                    position: markerPosition
                });
                marker.setMap(this.map);
                this.markers.push(marker);
                // CustomOverlay에 표시될 내용을 설정합니다.
                const overlayContent = `
              <div class="custom-overlay">
                  <strong>${hospital.name}</strong><br>
                  주소: ${hospital.address}<br>
                  전화번호: ${hospital.phoneNumber}<br>
                  <button data-id="${hospital.id}" onclick="routeToHospitalDetail(event)">자세히</button>
              </div>`;

                const overlay = new window.kakao.maps.CustomOverlay({
                    content: overlayContent,
                    position: markerPosition,
                    yAnchor: 1.5  // Marker의 위에 위치하도록 조절합니다.
                });

                window.kakao.maps.event.addListener(marker, 'click', () => {
                    // 기존에 표시된 overlay를 제거합니다.
                    overlay.setMap(overlay.getMap() ? null : this.map);
                });
            });
        },
    },
}
window.routeToHospitalDetail = function (event) {
    const hospitalId = event.target.getAttribute('data-id');
    const routeEvent = new CustomEvent('routeToHospital', {
        detail: {
            hospitalId: hospitalId
        }
    });
    document.dispatchEvent(routeEvent);
};
</script>

<style>
.rating-container {
    display: flex;
    align-items: center;
    justify-content: center; /* 별점을 중앙에 위치시킵니다. */
}

.custom-overlay {
    max-width: 300px;
    padding: 10px;
    background-color: #fff; /* 흰색 배경 */
    border: 1px solid #333;
    border-radius: 5px;
    font-size: 12px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* 그림자 효과 추가 */
}

.map-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 100vh;
    padding: 12px;
}

.content-wrapper {
    display: flex;
}

#kakao-map {
    margin-left: auto;
    width: 800px;
    height: 600px;
}

.hospital-list {
    width: 300px; /* 원하는 너비로 조정하세요. */
    height: 600px;
    overflow-y: auto;
    /*border-left: 1px solid #ccc;*/
    padding: 20px;
}

.hospital-image {
    width: 100%;
    height: auto;
    max-height: 100px; /* 원하는 높이로 설정할 수 있습니다. */
    object-fit: cover; /* 이미지가 카드 크기에 맞게 조절됩니다. */
}

.filter-container {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 20px;
}
</style>