<template>
  <div>
    <!-- Notification icon -->
    <v-icon @click="toggleNotifications">mdi-bell</v-icon>
    <!-- Dropdown menu for notifications -->
    <div v-if="showNotifications" class="notifications-dropdown">
      <div v-for="notification in notifications" :key="notification.id" class="notification-item" :class="{ 'read': notification.read }">
        {{ notification.username }} 님 {{ notification.date }}일 {{ notification.startTime | formatTime }}에 {{ notification.hospitalName }} 예약 알려드립니다.

        <!-- ... 아이콘 -->
        <v-icon @click="toggleActions(notification.id)">mdi-dots-horizontal</v-icon>

        <!-- 액션 아이콘 및 문구 (기본적으로 숨겨진 상태) -->
        <div v-if="notification.showActions">
          <v-icon @click="readNotification(notification.id)">mdi-check</v-icon> 읽음처리
          <v-icon @click="deleteNotification(notification.id)">mdi-delete</v-icon> 알림삭제
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from '@/axios/axios-instance';

export default {
  data() {
    return {
      showNotifications: false,
      notifications: []
    }
  },
  filters: {
    formatTime(value) {
      if (!value) return '';
      return value.split(':').slice(0, 2).join(':'); // HH:mm 형식으로 변환
    }
  },
  methods: {
    toggleActions(notificationId) {
      const notification = this.notifications.find(n => n.id === notificationId);
      if (notification) {
        // `showActions` 필드를 추가하여 액션 아이콘 및 문구의 표시 여부를 관리
        notification.showActions = !notification.showActions;
      }
    },
    toggleNotifications() {
      this.showNotifications = !this.showNotifications;
      if (this.showNotifications) {
        this.fetchNotifications();
      }
    },
    fetchNotifications() {
      axios.get('/notifications')
        .then(response => {
          this.notifications = response.data.map(notification => {
            notification.showActions = false;
            return notification;
          });
        })
        .catch(error => {
          console.error("Error fetching notifications:", error);
        });
    },
    readNotification(notificationId) {
      axios.put(`/notifications/${notificationId}`)
          .then(response => {
            console.log(response.data);
            // 알림 상태를 '읽음'으로 변경
            const notification = this.notifications.find(n => n.id === notificationId);
            if (notification) {
              notification.read = true;
            }
          })
          .catch(error => {
            console.error("Error reading notification:", error);
          });
    },

    deleteNotification(notificationId) {
      axios.delete(`/notifications/${notificationId}`)
          .then(response => {
            console.log(response.data);
            // 알림 목록에서 해당 알림 삭제
            this.notifications = this.notifications.filter(n => n.id !== notificationId);
          })
          .catch(error => {
            console.error("Error deleting notification:", error);
          });
    },
  }
}
</script>

<style scoped>
.notifications-dropdown {
  /* Add your dropdown styling here */
  display: block;
  position: absolute;
  top: 25px;
  right: 0;
  width: 300px;
  border: 1px solid #ccc;
  background-color: white;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
}

.notification-item {
  padding: 10px;
  border-bottom: 1px solid #eee;
}

.read {
  color: #aaa;  /* 연한 색으로 변경 */
}
/* 액션 아이콘과 문구 스타일 */
.notification-item div {
  display: inline-block;
  margin-left: 10px;
}
</style>
