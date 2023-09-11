import store from "@/store";  // 경로는 실제 store 파일의 위치에 따라 다를 수 있습니다.

export function checkAuthAndAlert() {
    // store의 role 값을 확인
    const userRole = store.state.role;

    // role 값이 없다면 (즉, 로그인하지 않았다면) alert 표시
    if (!userRole) {
        alert("로그인이 필요합니다");
        return false;
    }
    return true;
}