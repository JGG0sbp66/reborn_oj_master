// store/index.js
import { createStore } from 'vuex';

const store = createStore({
  state: {
    currentQuestionId: null,
  },
  mutations: {
    SET_CURRENT_QUESTION_ID(state, id) {
      state.currentQuestionId = id;
    },
  },
  actions: {
    setCurrentQuestionId({ commit }, id) {
      // 保存到 localStorage
      localStorage.setItem('currentQuestionId', id);
      // 更新 Vuex 状态
      commit('SET_CURRENT_QUESTION_ID', id);
    },
  },
  getters: {
    currentQuestionId: (state) => state.currentQuestionId,
  },
});

export default store;