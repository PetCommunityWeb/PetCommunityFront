<template>
  <v-container class="hospital-management-container">
    <!-- 소유하고 있는 병원 목록 -->
    <h1>병원 관리</h1>
    <div class="my-hospitals-list">
      <v-row class="fill-height">
        <v-col cols="12" md="4" v-for="hospital in myHospitals" :key="hospital.id">
          <router-link :to="`/hospital/${hospital.id}`">
            <v-card>
              <v-img :src="hospital.imageUrl" alt="Hospital Image" height="200px"></v-img>
              <v-card-title>{{ hospital.name }}</v-card-title>
              <v-card-subtitle>{{ hospital.address }}</v-card-subtitle>
              <v-card-text>
                <p>{{ hospital.introduction }}</p>
                <p><strong>전화번호:</strong> {{ hospital.phoneNumber }}</p>
                <!-- 운영 요일을 표시하는 부분 -->
                <p><strong>운영 요일:</strong></p>
                <v-chip-group column>
                  <v-chip v-for="day in getKoreanDays(hospital.operatingDays)" :key="day" small>{{ day }}</v-chip>
                </v-chip-group>
              </v-card-text>
              <v-card-actions>
                <v-chip v-for="species in hospital.speciesEnums" :key="species" small>{{ species }}</v-chip>
                <v-chip v-for="subject in hospital.subjectEnums" :key="subject" small outlined>{{ subject }}</v-chip>
              </v-card-actions>
            </v-card>
          </router-link>
        </v-col>
      </v-row>
    </div>
    <v-btn @click="dialog = true" style="margin-top: 50px">병원 등록하기</v-btn>
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
              <v-col cols="12">
                <v-row>
                  <v-col v-for="day in days" :key="day.value" cols="12" sm="4">
                    <v-checkbox v-model="hospital.operatingDays" :label="day.text" :value="day.value"></v-checkbox>
                  </v-col>
                </v-row>
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
import hospitalMixin from "@/mixins/hospitalMixin";

export default {
  name: "HospitalManagement",
  mixins: [hospitalMixin],
  data() {
    return {
      days: [  // 요일 정보
        { text: '월요일', value: 'MONDAY' },
        { text: '화요일', value: 'TUESDAY' },
        { text: '수요일', value: 'WEDNESDAY' },
        { text: '목요일', value: 'THURSDAY' },
        { text: '금요일', value: 'FRIDAY' },
        { text: '토요일', value: 'SATURDAY' },
        { text: '일요일', value: 'SUNDAY' },
      ],
      hospital: {
        id: "",
        name: "",
        introduction: "",
        imageUrl: "",
        latitude: null,
        longitude: null,
        address: "",
        phoneNumber: "",
        speciesEnums: [],
        subjectEnums: [],
        operatingDays: [],
      },
      dialog: false,
      speciesEnums: ['강아지', '고양이', '기타'],  // 예시입니다. 실제 값을 기입해주세요.
      subjectEnums: ['내과', '외과', '정형외과'],  // 예시입니다. 실제 값을 기입해주세요.
      myHospitals: [],  // 소유한 병원 목록을 저장할 배열
    };
  },
  async mounted() {
    // 카카오 주소 검색 위젯을 로드합니다.
    const script = document.createElement('script');
    script.src = '//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
    document.head.appendChild(script);
    await this.fetchMyHospitals();  // 병원 목록 가져오기
  },
  methods: {
    getKoreanDays(englishDays) {
      return englishDays.map(englishDay => {
        const matchingDay = this.days.find(day => day.value === englishDay);
        return matchingDay ? matchingDay.text : englishDay;
      });
    },
  },
}
</script>

<style>
.hospital-management-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  width: 100%;
}

.my-hospitals-list {
  width: 100%;
  max-width: 1200px;  /* 원하는 최대 폭으로 조정하실 수 있습니다. */
  margin: 0 auto;     /* 중앙 정렬 */
}

.my-hospitals-list ul {
  list-style-type: none;
  padding-left: 0;
}
</style>
