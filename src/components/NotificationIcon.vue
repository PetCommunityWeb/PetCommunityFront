<template>
  <div style="position: relative;"> <!-- 1번 조치: 알림 아이콘을 포함한 부모 요소에 position: relative를 추가합니다. -->
    <!-- Notification icon -->
    <v-icon @click="toggleNotifications">mdi-bell</v-icon>
    <!-- Display unread notifications count -->
    <span v-if="unreadCount" class="unread-badge">{{ unreadCount }}</span>
    <!-- Dropdown menu for notifications -->
    <div v-if="showNotifications" class="notifications-dropdown">
      <v-alert v-if="notifications.length === 0" type="info" outlined>
        새로운 알림이 없습니다
      </v-alert>

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
      notifications: [],
      unreadCount: 0 // 안 읽은 알림의 수를 저장할 변수
    }
  },
  mounted() {
    this.fetchNotifications();
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
          this.unreadCount = this.notifications.filter(n => !n.read).length;
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
            this.fetchNotifications();
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
            this.fetchNotifications();
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
  /* 기존 스타일 유지 */
  display: block;
  position: absolute;   /* 2번 조치: position을 absolute로 설정합니다. */
  top: 100%;           /* 2번 조치: 알림 아이콘 바로 아래에 나타나도록 top 값을 조정합니다. */
  left: 0;            /* 만약 오른쪽 정렬을 유지하고 싶다면 right 값을 0으로 설정합니다. */
  width: 300px;
  border: 1px solid #ccc;
  background-color: white;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
}

.notification-item {
  padding: 10px;
  border-bottom: 1px solid #eee;
}
.unread-badge {
  position: absolute;
  top: 0;
  right: 0;
  background-color: red;
  color: white;
  border-radius: 50%;
  padding: 2px 6px;
  font-size: 12px;
  font-weight: bold;
  transform: translate(50%, -50%);
}
.read {
  color: #aaa;  /* 연한 색으로 변경 */
}
/* 액션 아이콘과 문구 스타일 */
.notification-item div {
  display: inline-block;
  margin-left: 10px;
}
.notifications-dropdown > .v-alert {
  margin: 0; /* 기본 마진 제거 */
  border-radius: 0; /* 모서리 둥글게 하는 스타일 제거 */
  box-shadow: none; /* 기본 그림자 제거 */
}
</style>
