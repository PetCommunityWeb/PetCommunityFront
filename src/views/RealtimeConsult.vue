<template>
    <v-container>
        <h1 style="margin:15px 0 15px 0;" align="center">실시간 상담</h1>
        <p align="center">동물 전문가와 상담을 할 수 있습니다.</p>
        <!--        방 생성-->
        <v-row class="mb-4">
            <v-col cols="12" sm="4" md="3">
                <v-select
                    v-model="selectedDoctor"
                    :items="doctors"
                    item-text="nickname"
                    item-value="id"
                    label="의사 선택"
                    return-object
                >
                <!-- slot을 사용하여 각 항목을 커스텀 렌더링합니다 -->
                <template v-slot:item="{ item }">
                    <div>
                        <!-- 의사의 이미지 -->
                        <v-avatar size="30" class="mr-3">
                            <img :src="item.imageUrl" :alt="item.nickname">
                        </v-avatar>

                        <!-- 의사의 별명 -->
                        <span>{{ item.nickname }}</span>

                        <!-- 의사의 소개 -->
                        <div class="mt-2" style="font-size: 0.8rem; color: grey;">
                            {{ item.introduction }}
                        </div>
                    </div>
                </template>
                </v-select>
            </v-col>
            <v-col cols="12" sm="4" md="3">
                <v-text-field
                    v-model="roomName"
                    placeholder="채팅방 이름"
                    @keyup.enter="createRoom"
                />
            </v-col>
            <v-col cols="12" sm="4" md="3">
                <v-btn @click="createRoom" color="primary">방 생성</v-btn>
            </v-col>
        </v-row>
        <!--방 목록-->
        <h2 align="center" style="margin:15px 0 15px 0;">채팅방 목록</h2>
        <v-row>
            <v-col cols="12" sm="6" md="4" lg="3" v-for="room in rooms" :key="room.uuid">
                <v-card class="mb-3">
                    <v-list-item @click="enterRoom(room.uuid)" class="cursor-pointer">
                        <v-list-item-avatar>
                            <v-icon color="primary">mdi-chat</v-icon>
                        </v-list-item-avatar>
                        <v-list-item-content>
                            <v-list-item-title>{{ room.roomName }}</v-list-item-title>
                        </v-list-item-content>
                        <v-list-item-action>
                          <v-btn icon @click.stop="deleteRoom(room.uuid)">
                            <v-icon color="red">mdi-close</v-icon>
                          </v-btn>
                        </v-list-item-action>
                    </v-list-item>
                </v-card>
            </v-col>
        </v-row>

    </v-container>
</template>

<script>
import axios from "@/axios/axios-instance";
import {mapState} from 'vuex'; // Vuex에서 사용자 정보를 가져오기 위해 필요

export default {
    data() {
        return {
            roomName: '',
            rooms: [],
            doctors: [],     // 의사 목록 저장
            selectedDoctor: null   // 선택된 의사 저장
        };
    },
    computed: {
        ...mapState(['id', 'username']) // Vuex store의 id와 username 상태를 가져옴
    },
    created() {
        if (!this.id || !this.username) {
            this.$router.push('/');
            alert("로그인이 필요합니다.")
            return;
        }
        this.fetchDoctors();   // 의사 목록 불러오기
        this.fetchRooms();
    },
    methods: {
        async fetchRooms() {
            const response = await axios.get('/chats');
            this.rooms = response.data;
            console.log(this.rooms)
        },
        async fetchDoctors() {
            const response = await axios.get('/users/doctors');
            this.doctors = response.data || [];
        },
        async createRoom() {
            if (this.roomName.trim() !== '' && this.selectedDoctor) {
                const response = await axios.post('/chats', {
                    name: this.roomName,
                    doctorId: this.selectedDoctor.id  // 선택된 의사의 ID를 함께 전송
                });
            // 서버에서 반환된 방 정보를 this.rooms 배열에 추가
            if (response.data && response.data.room) {
              this.rooms.push(response.data.room);
            } else if (response.data) { // 서버에서 방 정보를 직접 반환할 경우
              this.rooms.push(response.data);
              await this.fetchRooms();
            }
                this.roomName = '';
                this.selectedDoctor = null;  // 의사 선택 초기화
            }
        },
        enterRoom(uuid) {
            this.$router.push({name: 'ChatRoom', params: {uuid}});
        },
        async deleteRoom(uuid) {
          try {
            await axios.delete(`/chat?uuid=${uuid}`);
            this.fetchRooms();  // 삭제 후 방 목록을 다시 가져옵니다.
            // eslint-disable-next-line no-empty
          } catch (error) {
          }
        }
    }
};
</script>
<style scoped>
.cursor-pointer {
    cursor: pointer;
}

.v-list-item-avatar {
    background-color: #f8f8f8; /* 배경색 지정 */
    border-radius: 50%; /* 원 모양으로 만들기 */
    margin-right: 12px; /* 아이콘과 텍스트 사이 간격 조절 */
}

/* 방 목록 아이콘 색상 스타일 */
.v-icon {
    font-size: 24px; /* 아이콘 크기 조절 */
    color: #007bff; /* 아이콘 색상 지정 */
}
</style>
