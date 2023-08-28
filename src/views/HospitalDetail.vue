<template>
  <div class="hospital-detail"> <!-- fill-height 추가 -->
    <v-row no-gutters class="fill-height">
      <v-col cols="6" class="d-flex justify-center align-center"> <!-- d-flex 추가 -->
        <v-card cols="6">
          <v-img :src="hospital.imageUrl" alt="Hospital Image" height="300" width="500"></v-img>
          <v-card-title>{{ hospital.name }}</v-card-title>
          <v-card-subtitle>{{ hospital.address }}</v-card-subtitle>
          <v-card-text>
            <p>{{ hospital.introduction }}</p>
            <p><strong>전화번호:</strong> {{ hospital.phoneNumber }}</p>
          </v-card-text>
          <v-card-actions v-if="isOwner">
            <v-btn @click="openAppointmentModal">병원 관리</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
      <v-col cols="12"> <!-- d-flex 추가 -->
        <v-card class="border-box fill-height"> <!-- Additional container v-card -->

          <v-row class="fill-height">
            <!-- Date Picker Card -->
            <v-col cols="6"> <!-- d-flex 추가 -->
              <v-card class="border-box fill-height">
                <v-date-picker width="100%" v-model="selectedDate" @input="fetchAvailableTimes"></v-date-picker>
              </v-card>
            </v-col>

            <!-- Appointment Slots Card -->
            <v-col cols="6">
              <v-card class="flex-container">
                <div class="flex-child slot-list-container">
                  <v-list>
                    <v-list-item-group v-if="availableSlots.length">
                      <v-list-item v-for="slot in availableSlots" :key="slot.slotId">
                        <v-list-item-content>
                          <v-list-item-title>{{ slot.startTime }}</v-list-item-title>
                          <v-list-item-subtitle v-if="slot.reserved">이미 예약됨</v-list-item-subtitle>
                        </v-list-item-content>
                        <v-list-item-action v-if="!isOwner && !slot.reserved">
                          <v-btn @click="reservate(slot)">예약하기</v-btn>
                        </v-list-item-action>
                      </v-list-item>
                    </v-list-item-group>
                  </v-list>
                  <v-row class="mt-4" v-if="isOwner">
                    <v-col>
                      <v-select v-model="selectedHour" :items="hours" label="시간 선택"></v-select>
                    </v-col>
                    <v-col>
                      <v-select v-model="selectedMinute" :items="minutes" label="분 선택"></v-select>
                    </v-col>
                    <v-col>
                      <v-btn @click="addAppointmentSlot">저장</v-btn>
                    </v-col>
                  </v-row>
                </div>
              </v-card>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>

    <v-dialog v-model="appointmentDialog" max-width="400px">
      <v-card>
        <v-card-title>병원 관리</v-card-title>
        <v-card-actions>
          <v-btn @click="openEditHospital">병원 수정</v-btn>
          <v-btn @click="deleteHospital">병원 삭제</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="editHospitalDialog" max-width="600px">
      <v-card>
        <v-card-title>병원 정보 수정</v-card-title>
        <v-card-text>
          <v-text-field label="병원 이름" v-model="editHospitalData.name"></v-text-field>
          <v-text-field label="소개" v-model="editHospitalData.introduction" multiline></v-text-field>
          <v-file-input label="이미지 선택" @change="handleFileChange" accept="image/*"></v-file-input>
          <img :src="editHospitalData.imageUrl" v-if="editHospitalData.imageUrl" alt="Selected Image" width="100%"/>
          <v-text-field label="병원 주소" v-model="editHospitalData.address"></v-text-field>
          <v-text-field label="전화번호" v-model="editHospitalData.phoneNumber"></v-text-field>
          <v-select
              v-model="editHospitalData.speciesEnums"
              :items="speciesEnums"
              label="동물 종류"
              multiple
          ></v-select>
          <v-select
              v-model="editHospitalData.subjectEnums"
              :items="subjectEnums"
              label="전문 분야"
              multiple
          ></v-select>
          <!-- 추가적인 필드를 이곳에 추가하실 수 있습니다. -->
        </v-card-text>
        <v-card-actions>
          <v-btn @click="updateHospital">저장</v-btn>
          <v-btn @click="editHospitalDialog = false">취소</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import axios from "@/axios/axios-instance";
import {mapState} from "vuex";
import hospitalMixin from "@/mixins/hospitalMixin";

export default {
  name: "HospitalDetail",
  mixins: [hospitalMixin],
  data() {
    return {
      hospital: {},
      editHospitalData: {},
      isOwner: false,
      appointmentDialog: false,
      editHospitalDialog: false,
      selectedHour: null,       // 선택된 시간을 저장
      selectedMinute: null,
      isTimePickerOpen: false,
      selectedDate: new Date().toISOString().substr(0, 10),
      isBookingManagerOpen: false, // 예약관리 UI를 토글하기 위한 변수
      availableSlots: [], // 해당 날짜에 대한 사용 가능한 예약 시간을 저장하기 위한 배열
      hours: Array.from({length: 24}, (_, i) => i.toString()),
      minutes: ['0', '10', '20', '30', '40', '50'],
      speciesEnums: ['강아지', '고양이', '기타'],  // 예시입니다. 실제 값을 기입해주세요.
      subjectEnums: ['내과', '외과', '정형외과'],
    };
  },
  mounted() {
    this.created()
  },
  computed: {
    ...mapState(["email"])
  },
  watch: {
    hospital(newVal) {
      console.log(newVal.ownerEmail)
      console.log(this.email)
      if (newVal.ownerEmail && newVal.ownerEmail === this.email) {
        this.isOwner = true;
      }
      this.editHospitalData = {...newVal};
    }
  },
  methods: {
    async reservate(slot) {
      console.log(slot)
      const requestData = {
        hospitalId: slot.hospitalId,
        date: slot.date,
        startTime: slot.startTime
      };
      console.log(requestData)
      try {
        await axios.post('/reservations', requestData)
      } catch (error) {
        console.error('API 요청 중 오류 발생:', error);
        alert('예약 중 오류 발생');
      }
    },
    async fetchAvailableTimes() {
      try {
        const response = await axios.get('/reservation-slot', {
          params: {
            hospitalId: this.hospital.id,
            date: this.selectedDate
          }
        });
        this.availableSlots = response.data;
      } catch (error) {
        console.error("Failed to fetch available slots:", error);
      }
    },
    openEditHospital() {
      this.appointmentDialog = false;
      this.editHospitalDialog = true;
    },
    async updateHospital() {
      try {
        await axios.put(`/hospitals/${this.hospital.id}`, this.editHospitalData);
        this.hospital = {...this.editHospitalData};
        this.editHospitalDialog = false;
        // 성공 알림 또는 리프레시 로직 추가
      } catch (error) {
        console.error("Failed to update hospital:", error);
      }
    },
    async deleteHospital() {
      try {
        await axios.delete(`/hospitals/${this.hospital.id}`);
        // 성공 후 리디렉션 또는 알림 표시
        await this.$router.push("/")
      } catch (error) {
        console.error("Failed to delete hospital:", error);
      }
    },
    async created() {
      const hospitalId = this.$route.params.id;
      try {
        const response = await axios.get(`/hospitals/${hospitalId}`);
        this.hospital = response.data;
      } catch (error) {
        console.error("Failed to fetch hospital details:", error);
        // 에러 처리를 적절하게 하세요. 예: 사용자에게 오류 메시지 표시
      }
    },
    openAppointmentModal() {
      this.appointmentDialog = true;
    },
    async addAppointmentSlot() {
      if (!this.selectedHour || !this.selectedMinute) {
        alert("시간과 분을 모두 선택해주세요.");
        return;
      }
      // 선택된 시간과 분으로 LocalTime 객체를 만듭니다.
      const paddedHour = String(this.selectedHour).padStart(2, '0');
      const paddedMinute = String(this.selectedMinute).padStart(2, '0');
      const startTime = `${paddedHour}:${paddedMinute}`;      // 백엔드에 POST 요청을 보낼 데이터를 구성합니다.
      const requestData = {
        hospitalId: this.hospital.id,
        date: this.selectedDate,
        startTime: startTime
      };
      try {
        await axios.post("/reservation-slot", requestData);
        await this.fetchAvailableTimes();  // 새로운 예약 슬롯을 추가한 후 사용 가능한 예약 슬롯 목록을 갱신
      } catch (error) {
        console.error("Failed to add appointment slot:", error);
      }
    },
  }
};
</script>

<style scoped>
.fill-height {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center; /* 여기 추가 */
  align-items: center; /* 여기 추가 */
}

.slot-list-container {
  overflow-y: hidden;
  padding-right: 10px;
  flex-grow: 1; /* 이 스타일을 통해 남은 공간을 모두 차지하도록 설정 */
}

.flex-container {
  display: flex;
  flex-direction: column;
  height: 100%; /* Ensure card expands fully if needed */
}

.flex-child {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.slot-list-container {
  overflow-y: auto;
  padding-right: 10px;
}
</style>
