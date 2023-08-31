<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" md="6">
        <v-card>
          <v-card-title>
            {{ roomName }}
          </v-card-title>
          <v-card-text>
            <v-list two-line style="max-height: 300px; overflow-y: auto;" ref="messageList">
              <v-list-item v-for="message in messages" :key="message.messageId" :class="messageClass(message.sender)">
                <v-list-item-content>
                  <v-list-item-title>
                    <span class="message-sender">{{ message.sender }}</span>
                    {{ message.message }}
                  </v-list-item-title>
                  <v-list-item-subtitle>{{ message.time }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-card-text>
          <v-card-actions>
            <v-text-field
                v-model="newMessage"
                label="New message"
                @keyup.enter="sendMessage"
                outlined
                clearable
            ></v-text-field>
            <v-btn @click="sendMessage" color="blue darken-2" text>Send</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from "@/axios/axios-instance";
import {mapState} from 'vuex';

export default {
  data() {
    return {
      roomName: '',
      messages: [],
      newMessage: '',
      webSocket: null,
    };
  },
  computed: {
    ...mapState({
      username: state => state.username // Vuex 저장소의 username 상태를 가져옵니다.
    })
  },
  methods: {
    messageClass(sender) {
      console.log(sender)
      return sender === this.username ? 'my-message' : 'other-message';
    },
    fetchData() {
      return axios.get(`/chat?uuid=${this.$route.params.uuid}`).then(response => {
        this.roomName = response.data.roomName;
        this.messages = response.data.chatMessages;
      });
    },
    connectWebSocket() {
      this.webSocket = new WebSocket(`ws://pet-community-api.net:443/ws/chat?uuid=${this.$route.params.uuid}`);

      this.webSocket.onopen = () => {
        console.log("WebSocket connection opened");
      };

      this.webSocket.onmessage = this.onWebSocketMessage;

      this.webSocket.onclose = (event) => {
        if (event.wasClean) {
          console.log(`Closed cleanly, code=${event.code}, reason=${event.reason}`);
        } else {
          // e.g. server process killed or network down, event.code is usually 1006 in this case
          console.error('WebSocket connection died');
          // Optional: 재연결 로직을 추가합니다.
          setTimeout(() => {
            this.connectWebSocket();
          }, 1000); // 1초 후 재연결 시도
        }
      };
      this.webSocket.onerror = (error) => {
        console.error(`WebSocket Error: ${error}`);
      };
    },
    onWebSocketMessage(event) {
      const receivedMessageDto = JSON.parse(event.data);
      console.log("Received Message:", receivedMessageDto);  // 로그 추가

      if (receivedMessageDto.roomId === this.$route.params.uuid && receivedMessageDto.sender !== this.username) {
        this.addMessageToChat(receivedMessageDto);
      }
      // Vue의 DOM 업데이트가 완료된 후에 scrollToBottom 메소드를 호출
      this.$nextTick(() => {
        this.scrollToBottom();
      });
    },
    addMessageToChat(messageDto) {
      this.messages.push({
        sender: messageDto.sender,  // 이 부분을 추가하세요.
        message: messageDto.message,
        time: messageDto.time || new Date().toISOString(),
        messageId: Date.now()
      });
    },
    sendMessage() {
      if (this.webSocket && this.newMessage.trim() !== '') {
        const messageDto = {
          type: 'TALK',
          roomId: this.$route.params.uuid,
          sender: this.username,
          message: this.newMessage
        };

        this.webSocket.send(JSON.stringify(messageDto));
        this.addMessageToChat(messageDto);
        this.newMessage = '';
      }
    },
    scrollToBottom() {
      const chatContainer = document.querySelector('.v-list');
      chatContainer.scrollTop = chatContainer.scrollHeight;
    },
  },
  mounted() {
    this.fetchData().then(() => {
      this.scrollToBottom();
    });
    this.connectWebSocket();
  },
  beforeDestroy() {
    if (this.webSocket) {
      this.webSocket.close();
    }
  }
};
</script>
<style>
.my-message {
  background-color: yellow;
  margin-left: auto;
  border-radius: 10px 0 10px 10px;
// 예: 오른쪽 상단 모서리를 둥글게
}

.other-message {
  background-color: gray;
  margin-right: auto;
  border-radius: 0 10px 10px 10px;
// 예: 왼쪽 상단 모서리를 둥글게
}

.message-sender {
  font-weight: bold;
  margin-right: 5px;
}
</style>
