<template>

    <div class="intro">
        <!-- IntroPage 내용 -->
        <div class="intro-content">
            <h1>나의 반려동물을 위한 Pet 병<span>
                Pet병 커뮤니티에 오신 것을 환영합니다.
                </span></h1>
        </div>

        <div class="header">
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

        <!--    구분선   -->
        <hr class="hr-15">
        <!--        사진-->

        <!--        <p class="slide-upper-text-title">반려 동물 커뮤니티</p>-->
        <!--        <p class="slide-upper-text">나의 반려 동물을 자랑해보세요!</p>-->
        <img src="@/assets/images/vet.png" class="pets-1" alt="">
        <hr class="hr-15">
        <img src="@/assets/images/pets2.png" class="pets-2" alt="">

        <div align="center" class="content-image">
            <!--            <v-img :src="'@/assets/images/dog1.png'"></v-img>-->

            설명하는 사진

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
@font-face {
    font-family: 'a옛날사진관3'; /* 원하는 폰트 이름 */
    src: url('./fonts/a옛날사진관3.ttf') format('truetype'); /* 폰트 파일 경로 및 포맷 */
    /* 다른 포맷에 따라 format 속성 변경 가능 */
    font-weight: 400; /* 폰트 두께 설정 */
    font-style: normal; /* 폰트 스타일 설정 (normal, italic 등) */
}

@font-face {
    font-family: 'a옛날사진관5'; /* 원하는 폰트 이름 */
    src: url('./fonts/a옛날사진관5.ttf') format('truetype'); /* 폰트 파일 경로 및 포맷 */
    /* 다른 포맷에 따라 format 속성 변경 가능 */
    font-weight: 400; /* 폰트 두께 설정 */
    font-style: normal; /* 폰트 스타일 설정 (normal, italic 등) */
}

/* 대문 페이지의 스타일을 디자인합니다. */
.intro {
    /*display: flex;*/
    flex-direction: column;
    min-height: 100vh; /* 최소 높이를 화면 높이로 설정 */
    align-items: center; /* 요소들을 수직 가운데 정렬 */
    justify-content: center; /* 요소들을 수평 가운데 정렬 */
}

.intro-content h1 {
    text-align: center;
    font-size: 30px;
    text-transform: uppercase;
    color: #222;
    letter-spacing: 1px;
    font-family: "a타이틀고딕2", serif;
    font-weight: 400;
}

.intro-content h1 span {
    margin-top: 5px;
    font-size: 20px;
    color: #444;
    word-spacing: 1px;
    letter-spacing: 2px;
    text-transform: uppercase;
    font-family: "a타이틀고딕2", sans-serif;
    font-weight: 500;

    display: grid;
    grid-template-columns: 1fr max-content 1fr;
    grid-template-rows: 27px 0;
    grid-gap: 20px;
    align-items: center;
}

.intro-content h1 span:after, .intro-content h1 span:before {
    content: " ";
    display: block;
    border-bottom: 1px solid #ccc;
    border-top: 1px solid #ccc;
    height: 5px;
    background-color: #f8f8f8;
}

.intro-content {
    height: 130px;
    padding: 10px;
}

/*.slide-upper-text {*/
/*    text-align: center;*/
/*    margin-top: 20px;*/
/*    margin-bottom: -20px;*/
/*    padding: 20px;*/
/*    font-family: "a옛날사진관3", serif;*/
/*    font-size: 30px;*/

/*}.slide-upper-text-title {*/
/*    text-align: center;*/
/*    margin-top: 20px;*/
/*    margin-bottom: -0px;*/
/*    padding: 20px;*/
/*    font-family: "a옛날사진관5", serif;*/
/*    font-size: 40px;*/
/*}*/

h1 {
    font-size: 2em;
}

.header {
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


hr.hr-15 {
    width: 80%;
    margin: 0 auto;
    border: 0;
    border-top: 4px double #8c8c8c;
    text-align: center;
}

hr.hr-15:after {
    content: '\2665';
    display: inline-block;
    position: relative;
    top: -15px;
    padding: 0 10px;
    background: #fff;
    color: #8c8c8c;
    font-size: 18px;
}

.pets-1 {
    max-width: 1200px;

    margin: 10px auto 10px;
    display: flex;
}.pets-2 {
    max-width: 1200px;
    margin: 40px auto 50px;
    display: flex;
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
    font-family: a타이틀고딕3, serif;
}

.footer-content {
    max-width: 1200px;
    margin: 0 auto;
}
</style>
