import {
  app, protocol, BrowserWindow, ipcMain, dialog
} from 'electron';
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib';
import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer';
import XLSX from 'xlsx';
// import { fs } from 'fs';

const fs = require('fs');
const path = require('path');

const isDevelopment = process.env.NODE_ENV !== 'production';

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } },
]);

async function createWindow() {
  // Create the browser window.
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      // Use pluginOptions.nodeIntegration, leave this alone
      // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
      // nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION,
      webSecurity: false,
      nodeIntegration: true,
      nodeIntegrationInWorker: true,
    },
  });

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL);
    if (!process.env.IS_TEST) win.webContents.openDevTools();
  } else {
    createProtocol('app');
    // Load the index.html when not in development
    win.loadURL('app://./index.html');
  }
}

// async function testRead() {
//   const test = XLSX.readFile('C:/project/word-test/public/test.xlsx');
//   console.log(test);
// }

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    try {
      await installExtension(VUEJS_DEVTOOLS);
    } catch (e) {
      console.error('Vue Devtools failed to install:', e.toString());
    }
  }
  createWindow();
});
ipcMain.on('save-word-excel-path', (event, arg) => {
  const wordPath = arg;
  const result = {};
  event.sender.send('setting-save-result', '');
});
ipcMain.on('asynchronous-messag', (event, arg) => {
  console.log(arg); // "ping" 출력
  // event.reply('asynchronous-reply', 'pong');
  event.sender.send('asynchronous-reply', 'async pong');
});
ipcMain.on('set-word-excel-path', (event, arg) => {
  const excelPath = dialog.showOpenDialogSync({ properties: ['openDirectory'] });
  // event.sender.send('excel-path', excelPath);
  event.returnValue = excelPath;
});
ipcMain.on('get-word-excel-list', (event, arg) => {
  console.log(__static);
  const res = {};
  const extensions = ['.xls', '.xlsx'];
  console.log(arg);
  // fs.readdir(arg, 'utf8', (err, files) => {
  //   if (err) {
  //     res.error = true;
  //     res.msg = err;
  //     res.files = null;
  //   } else {
  //     const excels = files.filter((fileName) => extensions.indexOf(path.extname(fileName).toLowerCase()) > 0);
  //     res.error = false;
  //     res.files = excels;
  //   }
  //   event.returnValue = res;
  // });
});


// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', (data) => {
      if (data === 'graceful-exit') {
        app.quit();
      }
    });
  } else {
    process.on('SIGTERM', () => {
      app.quit();
    });
  }
}
