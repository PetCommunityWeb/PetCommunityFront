<!--<template>-->
<!--    <div>-->
<!--        <h2>{{ feed.title }}</h2>-->
<!--        <p>{{ feed.content }}</p>-->
<!--        &lt;!&ndash; 여기에 더 많은 피드 내용을 표시하는 코드 작성 &ndash;&gt;-->
<!--    </div>-->
<!--</template>-->

<!--<script>-->
<!--import axios from '@/axios/axios-instance'; // 필요하다면 경로를 수정하세요-->

<!--export default {-->
<!--    name: 'FeedDetail',-->
<!--    props: ['id'],-->
<!--    data() {-->
<!--        return {-->
<!--            feed: {} // 피드 데이터를 저장할 객체-->
<!--        };-->
<!--    },-->
<!--    mounted() {-->
<!--        // 피드 상세 정보를 가져오는 API 호출-->
<!--        axios.get(`/feeds/${this.id}`) // API 엔드포인트에 맞게 수정-->
<!--            .then(response => {-->
<!--                this.feed = response.data;-->
<!--            })-->
<!--            .catch(error => {-->
<!--                console.error('Error fetching feed detail:', error);-->
<!--            });-->
<!--    }-->
<!--};-->
<!--</script>-->
