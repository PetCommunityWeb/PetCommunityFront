// src/store/modules/user.js

const state = {
    username: "null", // 초기값을 null로 설정
    // 다른 사용자 정보도 추가 가능
};

const mutations = {
    SET_USERNAME(state, username) {
        state.username = username;
    },
    // 다른 mutation들도 필요하다면 추가 가능
};

const actions = {
    setUsername({ commit }, username) {
        commit('SET_USERNAME', username);
    },
    // 다른 actions들도 필요하다면 추가 가능
};

export default {
    state,
    mutations,
    actions,
};
