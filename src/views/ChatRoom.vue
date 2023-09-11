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
                            <v-list-item v-for="message in messages" :key="message.messageId"
                                         :class="messageClass(message.sender)">
                                <v-avatar size="30" class="mr-3">
                                    <img :src="message.profileUrl" :alt="message.sender">
                                </v-avatar>
                                <v-list-item-content>
                                    <v-list-item-title>
                                        <span class="message-sender">{{ message.sender }}</span>
                                        {{ message.message }}
                                    </v-list-item-title>
                                    <v-list-item-subtitle>{{ formatDate(message.time) }}</v-list-item-subtitle>
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
            return sender === this.username ? 'my-message' : 'other-message';
        },
        fetchData() {
            return axios.get(`/chat?uuid=${this.$route.params.uuid}`).then(response => {
                this.roomName = response.data.roomName;
                this.messages = response.data.chatMessages;
            });
        },
        connectWebSocket() {
            this.webSocket = new WebSocket(`wss://pet-community-api.net:443/ws/chat?uuid=${this.$route.params.uuid}`);
            // this.webSocket = new WebSocket(`ws://localhost:8080/ws/chat?uuid=${this.$route.params.uuid}`);
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
            // 현재 시간을 UTC로 가져옴
            const koreaTime = new Date();
            // 원하는 형식으로 날짜와 시간을 형식화합니다.
            const koreaTimeString = koreaTime.toString(); // "Fri Sep 01 2023 12:50:55 GMT+0900 (한국 표준시)" 형식을 가정
            // 메시지를 배열에 추가합니다.
            this.messages.push({
                sender: messageDto.sender,
                message: messageDto.message,
                profileUrl: messageDto.profileUrl,
                time: koreaTimeString, // 형식화된 시간을 사용
                messageId: Date.now()
            });
        },
        formatDate(dateString) {
            const date = new Date(dateString);
            console.log(date, typeof (date));
            const month = date.getMonth() + 1; // 0-11에서 1-12로 변환
            const day = date.getDate();
            const hours = date.getHours();
            const minutes = date.getMinutes();
            return `${month}월 ${day}일 ${hours}시 ${minutes}분`;
        },
        sendMessage() {
            if (this.webSocket && this.newMessage.trim() !== '') {
                const messageDto = {
                    type: 'TALK',
                    roomId: this.$route.params.uuid,
                    sender: this.username,
                    message: this.newMessage,
                    profileUrl: this.$store.state.imageUrl  // Vuex에서 imageUrl 가져오기
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
