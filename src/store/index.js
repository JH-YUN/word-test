import Vue from 'vue';
import Vuex from 'vuex';
import { ipcRenderer } from "electron";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    excelPath: null,
  },
  mutations: {
    setExcelPath(state, path) {
      state.excelPath = path;
    },
  },
  actions: {
  },
  modules: {
  },
});
