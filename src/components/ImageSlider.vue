<template>
    <div class="image-slider">
        <div v-if="images.length > 0">
            <img :src="currentImage" :alt="currentImageAlt" />
        </div>
        <div v-else>
            <p>No images to display.</p>
        </div>
        <div class="controls">
            <button @click="prevImage">Previous</button>
            <button @click="nextImage">Next</button>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            images: [
                require("@/assets/baby/11.jpg"),
                require("@/assets/baby/12.jpg"),
                require("@/assets/baby/14.jpg"),

                // 여기에 다른 이미지 경로 추가
            ],
            currentImageIndex: 0,
            autoSlideInterval: 2000, // 이미지 전환 간격 (밀리초)
        };
    },
    computed: {
        currentImage() {
            return this.images[this.currentImageIndex] || "";
        },
        currentImageAlt() {
            return `Image ${this.currentImageIndex + 1}`;
        },
    },
    methods: {
        prevImage() {
            this.currentImageIndex = (this.currentImageIndex - 1 + this.images.length) % this.images.length;
        },
        nextImage() {
            this.currentImageIndex = (this.currentImageIndex + 1) % this.images.length;
        },
        startAutoSlide() {
            this.autoSlideTimer = setInterval(() => {
                this.nextImage();
            }, this.autoSlideInterval);
        },
        stopAutoSlide() {
            if (this.autoSlideTimer) {
                clearInterval(this.autoSlideTimer);
                this.autoSlideTimer = null;
            }
        },
    },
    mounted() {
        this.startAutoSlide();
    },
};
</script>

<style scoped>
/* 슬라이더 스타일링 규칙을 디자인합니다. */
.image-slider {
    text-align: center;
}

img {
    max-width: 100%;
    max-height: 300px;
    margin: 0 auto;
}

.controls {
    margin-top: 10px;
}
</style>
