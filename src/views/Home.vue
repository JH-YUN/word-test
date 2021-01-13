<template>
  <div class="home">
    <div class="text-center">
      <v-dialog v-model="isShowPathDialog" width="500" :persistent="true">
        <v-card>
          <v-card-title class="headline grey lighten-2">단어를 관리할 폴더를 선택해주세요.</v-card-title>
          <v-spacer></v-spacer>
          <div class="d-flex mx-5">
            <v-input messages="폴더를 선택해주세요">{{tempWordPath}}</v-input>
            <v-btn @click="getWordPath()">선택</v-btn>
          </div>
          <v-divider></v-divider>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" text @click="closePathDialog()">완료</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from "@/components/HelloWorld.vue";

// const XLSX = require('xlsx');
// import fs from 'fs';
// const fs = require('fs');
import path from "path";
import { ipcRenderer } from "electron";
import store from "../store";

// const ipcRenderer = require('electron');

export default {
  name: "Home",
  components: {
    HelloWorld
  },
  created() {},
  mounted() {
    console.log(this.$store.state);
    console.log(store.state);
    // if (!this.checkExcelPath()) {
    //   this.showPathDialog();
    // } else {
    //   this.getWordExcelList();
    // }

    // ipcRenderer.on('asynchronous-reply', (event, arg) => {
    //   console.log(arg); // "pong"이 출력됩니다.
    // })
  },
  data() {
    return {
      wordExcelList: [],
      isShowPathDialog: true,
      tempWordPath: '',
    };
  },
  computed: {
    wordPath() {
      return this.$store.state;
    },
  },
  methods: {
    test(el) {
      console.log(el);
      console.log(this.$refs.inputTest);
    },
    testSheetjs() {},
    checkExcelPath() {
      if (this.wordPath === null) {
        console.log('마운트 패스 없음!');
        return false;
      } else {
        return true;
      }
    },
    showPathDialog() {
      this.isShowPathDialog = true;
    },
    closePathDialog() {
      store.commit('setExcelPath', this.tempWordPath);
      this.isShowPathDialog = false;
      this.getWordExcelList();
    },
    getWordPath() {
      const wordPath = path.join(ipcRenderer.sendSync("set-word-excel-path")[0]);
      if (wordPath !== undefined) {
        this.tempWordPath = wordPath;
      }
    },
    selectExcelFolder() {
      // ipcRenderer.sendSync("set-word-excel-path");
    },
    getWordExcelList() {
      const files = ipcRenderer.sendSync("get-word-excel-list", this.wordPath);
      this.wordExcelList = files;
    }
  }
};
</script>
