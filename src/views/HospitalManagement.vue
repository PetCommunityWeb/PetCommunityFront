<template>
  <v-container class="hospital-management-container">
    <h1>병원 관리</h1>
    <v-btn @click="dialog = true">병원 등록하기</v-btn>

    <v-dialog v-model="dialog" max-width="500px">
      <v-card>
        <v-card-title>
          <span class="headline">병원 등록</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field v-model="hospital.name" label="병원 이름"></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field v-model="hospital.introduction" label="소개"></v-text-field>
              </v-col>
              <v-col cols="12">
                <!-- 이미지 선택 기능 추가 -->
                <v-file-input label="이미지 선택" @change="handleFileChange" accept="image/*"></v-file-input>
                <!-- 선택한 이미지의 URL 또는 미리보기를 보여줄 수 있습니다. -->
                <img :src="hospital.imageUrl" v-if="hospital.imageUrl" alt="Selected Image" width="100%" />
              </v-col>
              <v-col cols="12">
                <v-text-field type="text" v-model="hospital.address" label="주소를 검색해주세요" readonly />
                <button @click="openKakaoAddressSearch" style="border: 1px solid gray;">주소 검색</button>
              </v-col>
              <v-col cols="12">
                <v-text-field v-model="hospital.phoneNumber" label="전화번호"></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-select
                    v-model="hospital.speciesEnums"
                    :items="speciesEnums"
                    label="동물 종류"
                    multiple
                ></v-select>
              </v-col>
              <v-col cols="12">
                <v-select
                    v-model="hospital.subjectEnums"
                    :items="subjectEnums"
                    label="전문 분야"
                    multiple
                ></v-select>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="dialog = false">취소</v-btn>
          <v-btn color="blue darken-1" text @click="registerHospital">저장</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
export default {
  name: "HospitalManagement",
  data() {
    return {
      hospital: {
        name: "",
        introduction: "",
        imageUrl: "",
        latitude: null,
        longitude: null,
        address: "",
        phoneNumber: "",
        speciesEnums: [],
        subjectEnums: []
      },
      dialog: false,
      speciesEnums: ['강아지', '고양이', '기타'],  // 예시입니다. 실제 값을 기입해주세요.
      subjectEnums: ['내과', '외과', '정형외과'],  // 예시입니다. 실제 값을 기입해주세요.
    };
  },
  mounted() {
    // 카카오 주소 검색 위젯을 로드합니다.
    const script = document.createElement('script');
    script.src = '//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
    document.head.appendChild(script);
  },
  methods: {
    handleFileChange(event) {
      const file = event.target.files[0];
      if (file) {
        // 이미지 파일을 URL로 변환하여 미리보기를 생성
        const reader = new FileReader();
        reader.onload = (e) => {
          this.hospital.imageUrl = e.target.result;
          console.log(this.hospital.imageUrl)
        };
        reader.readAsDataURL(file);
      }
    },
    registerHospital() {
      // 병원 등록 로직
      console.log('병원 등록:', this.hospital);
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
}
</script>

<style scoped>
.hospital-management-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
}
</style>
