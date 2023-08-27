import axios from "@/axios/axios-instance";
import AWS from "aws-sdk";

export default {
    methods: {
        async fetchMyHospitals() {
            try {
                const response = await axios.get("/hospitals/my-hospitals");
                this.myHospitals = response.data;  // 응답 데이터를 myHospitals에 저장
            } catch (error) {
                console.error("Failed to fetch my hospitals:", error);
            }
        },
        handleFileChange(file) {
            if (file) {
                // 이미지 파일 객체를 저장
                this.hospital.imageFile = file;
                // 이미지 파일을 URL로 변환하여 미리보기를 생성
                const reader = new FileReader();
                reader.onload = (e) => {
                    this.hospital.imageUrl = e.target.result;
                };
                reader.readAsDataURL(file);
            }
        },
        async uploadImageToS3(file) {
            AWS.config.update({
                accessKeyId: process.env.VUE_APP_AWS_ACCESS_KEY,
                secretAccessKey: process.env.VUE_APP_AWS_SECRET_KEY,
                region: process.env.VUE_APP_AWS_REGION,
            });
            const s3 = new AWS.S3();
            const params = {
                Bucket: process.env.VUE_APP_AWS_BUCKET,
                Key: file.name, // 파일 이름
                Body: file, // 실제 파일 객체
                ACL: 'public-read' // 파일이 공개적으로 읽을 수 있도록 설정
            };

            try {
                const result = await s3.upload(params).promise();
                return result.Location; // 업로드된 이미지의 URL 반환
            } catch (error) {
                alert("이미지 등록에 실패했습니다.")
                console.error("S3 Upload Error:", error);
            }
        },
        async registerHospital() {
            if (this.hospital.imageFile) {
                const uploadedImageUrl = await this.uploadImageToS3(this.hospital.imageFile);
                if (uploadedImageUrl) {
                    this.hospital.imageUrl = uploadedImageUrl;
                }
            }
            // 병원 등록 로직
            console.log('병원 등록:', this.hospital);
            try {
                await axios.post("/hospitals", this.hospital)
            } catch (error) {
                console.log(error)
            }
            this.dialog = false;
        },
        async convertAddressToCoordinates() {
            try {
                const coordinates = await this.fetchCoordinatesFromAPI(this.hospital.address);

                // 얻어진 위도와 경도를 데이터에 저장
                this.hospital.latitude = coordinates.latitude;
                this.hospital.longitude = coordinates.longitude;
            } catch (error) {
                console.error('Failed to convert address to coordinates:', error);
            }
        },
        async fetchCoordinatesFromAPI(address) {
            const apiKey = "db7e050b5a3baac2d26ab388e0b912c5";  // 여기에 실제 API 키를 넣어주세요.
            const apiUrl = `https://dapi.kakao.com/v2/local/search/address.json?query=${encodeURIComponent(address)}`;

            const response = await fetch(apiUrl, {
                headers: {
                    'Authorization': `KakaoAK ${apiKey}`,
                }
            });
            const data = await response.json();
            // 성공적인 응답인지 체크
            if (response.status !== 200) {
                throw new Error(data.message);
            }
            if (data.documents && data.documents.length > 0) {
                return {
                    latitude: data.documents[0].y,
                    longitude: data.documents[0].x
                };
            } else {
                throw new Error('No coordinates found for the given address.');
            }
        },
        openKakaoAddressSearch() {
            new window.daum.Postcode({
                oncomplete: async data => {
                    this.hospital.address = data.address; // 지번 주소
                    await this.convertAddressToCoordinates();
                }
            }).open();
        }
    },
};