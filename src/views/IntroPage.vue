<template>

    <div class="intro" style="background-color: #dddddd">
        <!-- IntroPage 내용 -->
        <div class="intro-content" style="background-color: white">
            <h1 class='text-center'>나의 반려동물을 위한 Pet 병 </h1>
            <p class='text-center'>동물 병원 예약, 반려동물 관련 팁, 내 반려동물 자랑 등 다양한 활동을 해보세요!</p>
        </div>
        <div class="text-center">
            <router-link to="/hospitals" class="btn btn-primary">병원 찾기</router-link>
            <router-link to="/community" class="btn btn-primary">커뮤니티</router-link>
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



export default {
    name: 'HomePage',

    mounted() {
        // HTML 문서가 로드될 때 실행
        // 이미지 컨테이너 엘리먼트 가져오기
        const container = document.querySelector('.animal-images-container');

        // 애니메이션 시작
        container.style.animationPlayState = 'running';
    }
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

h1 {
    font-size: 2em;
}

footer {
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
    background-color: #007bff; /* 버튼의 배경색 조절 */
    color: #fff; /* 버튼의 글자색 조절 */
    text-decoration: none; /* 밑줄 제거 */
    border: none; /* 테두리 제거 */
    cursor: pointer; /* 커서를 포인터로 변경하여 버튼임을 나타냄 */
    font-size: 16px; /* 버튼의 글자 크기 조절 */
    margin: 30px 10px; /* 버튼 간격 조절 */
    border-radius: 5px; /* 버튼의 모서리를 둥글게 만듦 */
}

.btn:hover {
    background-color: #0056b3; /* 마우스 호버 시 배경색 변경 */
}

.animal-images-container {
    position: absolute;
    bottom: -100px; /* 초기 위치를 버튼 아래로 설정 */
    width: 100%;
    text-align: center;
    animation: moveImages 10s linear infinite; /* 애니메이션 적용 */
}

@keyframes moveImages {
    0% {
        transform: translateY(0); /* 초기 위치 */
    }
    100% {
        transform: translateY(100px); /* 움직일 거리 설정 */
    }
}

.animal-images-container img {
    width: 100px; /* 이미지 너비 조절 */
    height: auto;
    margin: 0 10px; /* 이미지 사이 여백 조절 */
}

</style>
