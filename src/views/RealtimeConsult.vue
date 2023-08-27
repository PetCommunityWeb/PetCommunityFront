<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-text-field
            v-model="roomName"
            placeholder="채팅방 이름"
            @keyup.enter="createRoom"
        />
        <v-btn @click="createRoom">방 생성</v-btn>
        <v-list>
          <v-list-item-group v-if="rooms.length">
            <v-list-item v-for="room in rooms" :key="room.uuid">
              <v-list-item-content>
                <v-list-item-title @click="enterRoom(room.uuid)">
                  {{ room.roomName }}
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from "@/axios/axios-instance";

export default {
  data() {
    return {
      roomName: '',
      rooms: []
    };
  },
  created() {
    this.fetchRooms();
  },
  methods: {
    async fetchRooms() {
      const response = await axios.get('/chats');
      this.rooms = response.data;
      console.log(this.rooms)
    },
    async createRoom() {
      if (this.roomName.trim() !== '') {
        const response = await axios.post('/chats', {
          name: this.roomName
        });

        // 서버에서 반환된 방 정보를 this.rooms 배열에 추가
        if (response.data && response.data.room) {
          this.rooms.push(response.data.room);
        } else if (response.data) { // 서버에서 방 정보를 직접 반환할 경우
          this.rooms.push(response.data);
        }

        this.roomName = '';
      }
    },
    enterRoom(uuid) {
      console.log(uuid)
      this.$router.push({ name: 'ChatRoom', params: { uuid } });
    }
  }
};
</script>
