import axios from "@/axios/axios-instance";
import AWS from 'aws-sdk';

export default {
    name: "FeedBoard",
    data() {
        return {
            dialog: false,
            feedDetailDialog: false,
            title: '',
            content: '',
            selectedImage: null,
            feeds: [],  // 피드 목록 저장용
            feedDetail: {},  // 선택된 피드의 상세 정보
            newCommentContent: '', // 사용자가 작성할 댓글 내용
            editingCommentId: null, // 현재 수정 중인 댓글의 ID
            editFeedDialog: false,
            editTitle: '',
            editContent: '',
            editSelectedImage: null,
            sortOrder: '날짜순',  // 이것은 기본 값으로 '날짜순'으로 설정됩니다.
        };
    },
    methods: {
        // S3에 사진 업로드
        async uploadImageToS3(file) {
            AWS.config.update({
                accessKeyId: process.env.VUE_APP_AWS_ACCESS_KEY,
                secretAccessKey: process.env.VUE_APP_AWS_SECRET_KEY,
                region: process.env.VUE_APP_AWS_REGION,
            });
            const s3 = new AWS.S3();
            const params = {
                Bucket: process.env.VUE_APP_AWS_BUCKET,
                Key: file.name, // 파일 이름
                Body: file, // 실제 파일 객체
                ACL: 'public-read' // 파일이 공개적으로 읽을 수 있도록 설정
            };

            try {
                const result = await s3.upload(params).promise();
                return result.Location; // 업로드된 이미지의 URL 반환
            } catch (error) {
                console.error("S3 Upload Error:", error);
            }
        },

        // feed 생성 및 백에 request 전달
        async uploadImage() {
            if (this.selectedImage) {
                const imageUrl = await this.uploadImageToS3(this.selectedImage);
                const data = {
                    title: this.title,
                    content: this.content,
                    imageUrl: imageUrl // S3에서 반환한 URL
                };
                try {
                    const response = await axios.post("/feeds", data);
                    // 서버에서 반환된 새로운 피드 데이터를 클라이언트의 상태에 추가
                    this.feeds.push(response.data);
                    this.dialog = false;
                    // eslint-disable-next-line no-empty
                } catch (error) {
                }
            }
        },

        // 전체 피드 불러오기
        async fetchFeeds() {
            try {
                const response = await axios.get("/feeds");
                this.feeds = response.data;
                // eslint-disable-next-line no-empty
            } catch (error) {
            }
        },

        async fetchFeedsByLikes() {
            try {
                const response = await axios.get('/feeds/like');
                this.feeds = response.data;
                // eslint-disable-next-line no-empty
            } catch (error) {
            }
        },
        changeSortOrder() {
            if (this.sortOrder === '날짜순') {
                this.fetchFeeds();
            } else if (this.sortOrder === '좋아요순') {
                this.fetchFeedsByLikes();
            }
        },
        // 상세 피드 불러오기
        async showFeedDetail(id) {
            try {
                const response = await axios.get(`/feeds/${id}`);
                this.feedDetail = response.data;
                this.feedDetailDialog = true; // 모달 열기
                // eslint-disable-next-line no-empty
            } catch (error) {
            }
        },

        // 댓글 작성
        async postComment(feedId) {
            // 댓글 내용이 없는 경우
            if (!this.newCommentContent.trim()) {
                alert('댓글 내용을 입력해주세요.');
                return;
            }
            const data = {
                content: this.newCommentContent,
            };
            try {
                const response = await axios.post(`/comments/${feedId}`, data);
                const newComment = {
                    content: this.newCommentContent,
                    username: response.data.username
                };
                this.feedDetail.comments.push(newComment);
                this.newCommentContent = ''; // 댓글 입력 초기화
                this.fetchFeeds(); // 컴포넌트가 생성될 때 피드를 로드
                this.showFeedDetail(feedId);
                // eslint-disable-next-line no-empty
            } catch (error) {
            }
        },

        // feed 좋아요
        async postLike(feedId) {
            try {
                const response = await axios.post(`/feeds/${feedId}/likes`);
                // 직접 likeCount 증가 or 감소
                if (response.data.msg === "성공") {
                    this.feedDetail.likeCount += 1;
                    // this.fetchFeeds(); // 컴포넌트가 생성될 때 피드를 로드
                }
                else if (response.data.msg === "취소") {
                    this.feedDetail.likeCount -= 1;
                    // this.fetchFeeds(); // 컴포넌트가 생성될 때 피드를 로드
                }
                else {
                    alert(response.data.msg);
                }
                // sortOrder에 따라 피드를 로드
                if (this.sortOrder === '날짜순') {
                    this.fetchFeeds();
                } else if (this.sortOrder === '좋아요순') {
                    this.fetchFeedsByLikes();
                }
                // this.showFeedDetail(feedId);  // 좋아요 후 피드 상세 정보 다시 로드
                // eslint-disable-next-line no-empty
            } catch (error) {

            }
        },

        // 피드 수정 모달 열기
        openEditFeedModal() {
            this.editFeedDialog = true;
            this.editTitle = this.feedDetail.title;
            this.editContent = this.feedDetail.content;
        },

        // 피드 수정 로직
        async editFeed() {
            if (this.editSelectedImage) {
                const imageUrl = await this.uploadImageToS3(this.editSelectedImage);
                const data = {
                    title: this.editTitle,
                    content: this.editContent,
                    imageUrl: imageUrl
                };
                try {
                    const response = await axios.put(`/feeds/${this.feedDetail.id}`, data);
                    if (response.data.statusCode === 200) {
                        this.feedDetail = response.data;
                        this.fetchFeeds(); // 피드 목록 갱신
                        this.editFeedDialog = false;
                        this.feedDetailDialog = false; // 모달 열기
                    }
                    else {
                        alert(response.data.msg);
                    }
                    // eslint-disable-next-line no-empty
                } catch (error) {
                }
            }
        },

        // feed 삭제
        async deleteFeed(feedId) {
            try {
                const response = await axios.delete(`/feeds/${feedId}`);
                if (response.data.statusCode === 200) {
                    this.feedDetailDialog = false;
                    this.feeds = this.feeds.filter(feed => feed.id !== feedId); // 목록에서 해당 피드 제거
                }
                else {
                    alert(response.data.msg);
                    this.feedDetailDialog = false;
                }
                // eslint-disable-next-line no-empty
            } catch (error) {
            }
        },

        // 댓글 삭제
        async deleteComment(commentId) {
            try {
                const response = await axios.delete(`/comments/${commentId}`);
                if (response.data.statusCode === 200) {
                    this.feedDetail.comments = this.feedDetail.comments.filter(comment => comment.id !== commentId);
                    this.fetchFeeds(); // 컴포넌트가 생성될 때 피드를 로드
                }
                else {
                    alert(response.data.msg);
                }
                // eslint-disable-next-line no-empty
            } catch (error) {
            }
        },

        // 댓글 수정 모드 시작
        startEditingComment(id, content) {
            this.editingCommentId = id;
            this.newCommentContent = content;
        },

        // 댓글 수정 완료 및 서버에 전송
        async editComment() {
            if (!this.newCommentContent.trim()) {
                alert('댓글 내용을 입력해주세요.');
                return;
            }

            const data = {
                content: this.newCommentContent,
            };

            try {
                const response = await axios.put(`/comments/${this.editingCommentId}`, data);
                if (response.data.statusCode === 200) {
                    const comment = this.feedDetail.comments.find(comment => comment.id === this.editingCommentId);
                    if (comment) {
                        // 찾은 댓글의 content 값을 수정하여 업데이트
                        comment.content = this.newCommentContent;
                    }
                }
                else {
                    alert(response.data.msg);
                }
                this.editingCommentId = null; // 수정 모드 종료
                this.newCommentContent = ''; // 댓글 입력 초기화
                // eslint-disable-next-line no-empty
            } catch (error) {
            }
        },
    },
    created() {
        this.fetchFeeds(); // 컴포넌트가 생성될 때 피드를 로드
    }
}