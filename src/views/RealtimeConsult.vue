<!--<template>-->
<!--  <div>-->
<!--    <div v-for="message in messages" :key="message.id">-->
<!--      {{ message.text }}-->
<!--    </div>-->
<!--    <input v-model="newMessage" @keyup.enter="sendMessage">-->
<!--    <button @click="sendMessage">Send</button>-->
<!--  </div>-->
<!--</template>-->

<!--<script>-->
<!--import io from "socket.io-client";-->

<!--export default {-->
<!--  name: "RealtimeConsult",-->
<!--  data() {-->
<!--    return {-->
<!--      socket: null,-->
<!--      newMessage: '',-->
<!--      messages: []-->
<!--    };-->
<!--  },-->
<!--  created() {-->
<!--    this.socket = io('http://your-websocket-server-url:port');-->

<!--    this.socket.on('newMessage', (message) => {-->
<!--      this.messages.push(message);-->
<!--    });-->
<!--  },-->
<!--  methods: {-->
<!--    sendMessage() {-->
<!--      if (this.newMessage.trim() !== '') {-->
<!--        this.socket.emit('sendMessage', { text: this.newMessage });-->
<!--        this.newMessage = '';-->
<!--      }-->
<!--    }-->
<!--  }-->
<!--}-->
<!--</script>-->

<!--<style scoped>-->
<!--/* 스타일 추가 */-->
<!--</style>-->
