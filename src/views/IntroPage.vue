<template>

    <div class="intro">
        <!-- IntroPage 내용 -->
        <div class="intro-content">
            <h1 class='text-center'>나의 반려동물을 위한 Pet 병 </h1>
            <p></p>
            <p class='text-center' style="font">동물 병원 예약, 반려동물 관련 팁, 내 반려동물 자랑 등 다양한 활동을 해보세요!</p>
        </div>
        <div class="text-center">
            <router-link to="/hospitals" class="btn btn-primary">
                <v-icon left>mdi-map-search</v-icon>
                병원 찾기
            </router-link>
            <router-link to="/community" class="btn btn-primary">
                <v-icon left>mdi-forum</v-icon>
                커뮤니티
            </router-link>
        </div>

        <div class="image-slider-container">
            <image-slider class="image-slider"></image-slider>
        </div>


        <!-- 페이지 정보 영역 (footer) -->
        <footer>
            <div class="footer-content">
                <p>&copy; 2023 Pet병 커뮤니티</p>
                <p>made by. 이삭 종우 혁진 은영</p>
                <p>GitHub: <a href="https://github.com/PetCommunityWeb" target="_blank"> github.com/PetCommunityWeb</a>
                </p>
                <!-- 다른 정보 추가 -->
            </div>
        </footer>
    </div>


</template>

<script>

import ImageSlider from "@/components/ImageSlider"; // 이미지 슬라이더 컴포넌트 임포트

export default {
    name: 'HomePage',
    components: {
        ImageSlider, // 이미지 슬라이더 컴포넌트 등록
    },
}

</script>

<style scoped>
/* 대문 페이지의 스타일을 디자인합니다. */
.intro {
    /*display: flex;*/
    flex-direction: column;
    min-height: 100vh; /* 최소 높이를 화면 높이로 설정 */
    align-items: center; /* 요소들을 수직 가운데 정렬 */
    justify-content: center; /* 요소들을 수평 가운데 정렬 */
}

.intro-content {
    height: 130px;
    padding: 10px;
}

h1 {
    font-size: 2em;
}

footer {
    height: 110px;
    background-color: beige;
    color: black;
    text-align: center;
    padding: 10px 0;
}

footer {
    position: absolute; /* 절대적인 위치 지정 */
    bottom: 0; /* 아래에 고정 */
    width: 100%; /* 전체 너비 사용 */
    background-color: #f8f8f8; /* footer 배경색 설정 */
    padding: 10px; /* padding 추가 */
}

.footer-content {
    max-width: 1200px;
    margin: 0 auto;
}

.text-center {
    text-align: center;
}

.btn {
    padding: 10px 20px; /* 버튼의 패딩 조절 */
    background-color: #F8F8F8FF; /* 버튼의 배경색 조절 */
    color: black; /* 버튼의 글자색 조절 */
    text-decoration: none; /* 밑줄 제거 */
    border: none; /* 테두리 제거 */
    cursor: pointer; /* 커서를 포인터로 변경하여 버튼임을 나타냄 */
    font-size: 16px; /* 버튼의 글자 크기 조절 */
    margin: 10px; /* 버튼 간격 조절 */
    border-radius: 5px; /* 버튼의 모서리를 둥글게 만듦 */
}

.btn:hover {
    background-color: #D0D0D0FF; /* 마우스 호버 시 배경색 변경 */
}

@keyframes moveImages {
    0% {
        transform: translateY(0); /* 초기 위치 */
    }
    100% {
        transform: translateY(100px); /* 움직일 거리 설정 */
    }
}

.image-slider-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 400px; /* 슬라이더의 높이에 맞게 조절하세요 */
}

/* 이미지 슬라이더 스타일 */
.image-slider {
    width: 100%; /* 슬라이더의 너비를 조절하세요 */
    max-width: 800px; /* 슬라이더의 최대 너비를 설정하세요 */
}

</style>
