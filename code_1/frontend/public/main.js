const electron = require('electron');
const {app} = electron;
const {BrowserWindow} = electron;
// const { spawn } = require('child_process');
// const path = require('path');

let userWindow;

// 启动 Python 后端
// const backendProcess = spawn('python', [path.join(__dirname, 'python', 'backend.py')]);

// // 捕获 Python 后端的输出
// backendProcess.stdout.on('data', (data) => {
//   console.log(`Python Backend Output: ${data}`);
// });

// // 捕获 Python 后端的错误
// backendProcess.stderr.on('data', (data) => {
//   console.error(`Python Backend Error: ${data}`);
// });

// // 在 Electron 应用关闭时终止 Python 后端
// app.on('will-quit', () => {
//   backendProcess.kill();
// });
 
function createWindow() {
  userWindow = new BrowserWindow({width: 1230, height: 700});
  userWindow.loadURL(`file://${__dirname}/index.html`);
  userWindow.on('closed', () => {
    userWindow = null;
  });
}
app.on('ready', createWindow);
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
 
app.on('activate', () => {
  if (userWindow === null) {
    createWindow();
  }
});