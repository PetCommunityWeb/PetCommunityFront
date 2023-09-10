<template>
  <div>
    <v-row align="center" no-gutters>
      <!-- 사진 올리기 버튼 -->
      <v-col cols="auto">
        <v-btn @click="dialog = true">사진 올리기</v-btn>
      </v-col>

      <!-- 조회 순서 선택 드롭다운 -->
      <v-col cols="auto" class="ml-auto">
        <v-select
            :items="['날짜순', '좋아요순']"
            label="정렬"
            v-model="sortOrder"
            dense
            outlined
            class="sort-select"
            @change="changeSortOrder"
        ></v-select>
      </v-col>
    </v-row>

    <!-- 피드 목록 표시 -->
    <v-row class="feed-list">
      <v-col v-for="feed in feeds" :key="feed.id" cols="12" md="4" class="feed-item">
        <v-card>
          <v-card-title>
            <v-icon left>mdi-account</v-icon> {{ feed.username }}
          </v-card-title>

          <!-- feed의 이미지를 클릭하면 상세 모달 열기 -->
          <v-img
              :src="feed.imageUrl"
              max-height="300px"
              class="my-3"
              @click="showFeedDetail(feed.id)"
          ></v-img>

          <v-card-subtitle>{{ feed.title }}</v-card-subtitle>
          <v-card-text>{{ feed.content }}</v-card-text>

          <v-card-actions>
            <v-btn>
              <v-icon left color = "red">mdi-heart</v-icon> {{ feed.likeCount }}
            </v-btn>
            <v-btn>
              <v-icon left color = "grey">mdi-comment-outline</v-icon> {{ feed.commentCount }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <!-- 피드 상세 정보를 보여주는 모달 -->
    <v-dialog v-model="feedDetailDialog" max-width="900px">
      <v-card>
        <v-row>
          <!-- Left side: Feed Detail -->
          <v-col cols="6">
            <v-card-title>
              {{ feedDetail.username }}
              <v-card-actions class="d-flex justify-end">
                <!-- 피드 수정 -->
                <v-btn icon @click="openEditFeedModal">
                  <v-icon>mdi-pencil</v-icon>
                </v-btn>
                <!-- 피드 삭제 -->
                <v-btn icon @click="deleteFeed(feedDetail.id)">
                  <v-icon color="red">mdi-delete</v-icon>
                </v-btn>
              </v-card-actions>
            </v-card-title>
            <v-img :src="feedDetail.imageUrl" max-height="300px" class="my-3 detailed-image"></v-img>
            <v-card-subtitle>{{ feedDetail.title }}</v-card-subtitle>
            <v-card-text>{{ feedDetail.content }}</v-card-text>
            <!-- 좋아요 버튼 -->
            <v-btn color="primary" class="mt-3" @click="postLike(feedDetail.id)">
              <v-icon left>mdi-heart</v-icon> 좋아요 {{ feedDetail.likeCount }}
            </v-btn>
          </v-col>

          <!-- Right side: Comments Section -->
          <v-col cols="6">
            <v-divider></v-divider>
            <v-list dense>
              <v-list-item-group v-for="comment in feedDetail.comments" :key="comment.id">
                <v-list-item-content class="comment-item">
                  <v-list-item-title>
                    <v-icon small left>mdi-account-outline</v-icon>
                    {{ comment.username }}
                    <v-btn icon small @click="startEditingComment(comment.id, comment.content)">
                      <v-icon>mdi-pencil-circle</v-icon>
                    </v-btn>
                    <v-btn icon small class="ml-auto" @click="deleteComment(comment.id)">
                      <v-icon color="red">mdi-close</v-icon>
                    </v-btn>
                  </v-list-item-title>
                  <v-list-item-subtitle>{{ comment.content }}</v-list-item-subtitle>
                </v-list-item-content>
                <v-divider></v-divider>
              </v-list-item-group>
            </v-list>

            <v-textarea
                v-if="editingCommentId"
                label="댓글을 편집해 주세요"
                v-model="newCommentContent"
                class="mt-3"
                rows="2"
            ></v-textarea>
            <v-btn v-if="editingCommentId" text color="primary" @click="editComment">저장</v-btn>

            <v-textarea
                v-else
                label="댓글을 작성해 주세요"
                v-model="newCommentContent"
                class="mt-3"
                rows="2"
            ></v-textarea>
            <v-btn text color="primary" @click="postComment(feedDetail.id)">확인</v-btn>
          </v-col>
        </v-row>

        <!-- 피드 수정을 위한 모달 -->
        <v-dialog v-model="editFeedDialog" max-width="600px">
          <v-card>
            <v-card-title>피드 수정</v-card-title>
            <v-card-text>
              <v-text-field
                  label="제목을 수정하세요"
                  v-model="editTitle"
              ></v-text-field>

              <v-textarea
                  label="내용을 수정하세요"
                  v-model="editContent"
                  rows="3"
                  auto-grow
              ></v-textarea>

              <v-file-input label="사진 변경" accept="image/*" v-model="editSelectedImage"></v-file-input>
            </v-card-text>
            <v-card-actions>
              <v-btn text @click="editFeedDialog = false">취소</v-btn>
              <v-btn text color="primary" @click="editFeed">수정</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <!-- Close Button -->
        <v-card-actions>
          <v-btn text @click="feedDetailDialog = false">닫기</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Vuetify의 v-dialog를 사용한 모달 -->
    <v-dialog v-model="dialog" max-width="600px">
      <v-card>
        <v-card-title>사진 업로드</v-card-title>
        <v-card-text>
          <!-- 제목 입력 -->
          <v-text-field
              label="제목을 입력하세요"
              v-model="title"
          ></v-text-field>

          <!-- 설명 입력 -->
          <v-textarea
              label="내용을 입력하세요"
              v-model="content"
              rows="3"
              auto-grow
          ></v-textarea>

          <!-- 사진 선택 -->
          <v-file-input label="사진 등록" accept="image/*" v-model="selectedImage"></v-file-input>
        </v-card-text>
        <v-card-actions>
          <v-btn text @click="dialog = false">취소</v-btn>
          <v-btn text color="primary" @click="uploadImage">업로드</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import FeedBoardScript from '../methods/FeedBoard.js';  // 분리된 js 파일을 import 합니다.
export default FeedBoardScript;  // import된 스크립트를 export 합니다.
</script>

<style src="../styles/FeedBoardStyle.css" scoped></style>