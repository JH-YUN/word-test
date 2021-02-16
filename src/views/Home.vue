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

      <v-card v-if="!isShowPathDialog" class="m-5">
        <v-card-title>테스트할 단어 모음을 선택해주세요.</v-card-title>
        <v-simple-table>
          <thead>
            <tr>
              <th>선택</th>
              <th>파일명</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(excel, index) in wordExcelList" :key="index" @click="addWordExcel(excel)">
                <td><input type="checkbox" :value="excel" v-model="selectedExcels"></td>
                <td>{{excel}}</td>
            </tr>
          </tbody>
        </v-simple-table>
        <v-card-actions class="d-flex justify-end">
          <v-btn text depressed color="primary" @click="startTest()">시험시작</v-btn>
        </v-card-actions>
      </v-card>
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
      selectedExcels: [],
      isShowPathDialog: true,
      tempWordPath: '',
    };
  },
  computed: {
    wordPath() {
      return this.$store.state.excelPath;
    },
  },
  methods: {
    test(el) {
      console.log(el);
      console.log(this.$refs.inputTest);
    },
    checkExcelPath() {
      if (this.wordPath === null) {
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
      const result = ipcRenderer.sendSync("get-word-excel-list", this.wordPath);
      if(result.error) {
        alert('폴더를 가져오는데 실패했습니다.');
        this.isShowPathDialog = true;
      } else {
        this.wordExcelList = result.files;
      }
    },
    addWordExcel(excel) {
      const i = this.selectedExcels.indexOf(excel);
      if (i > -1) {
        this.selectedExcels.splice(i, 1);
      } else {
        this.selectedExcels.push(excel);
      }
    },
    startTest() {

    },
  }
};
</script>
