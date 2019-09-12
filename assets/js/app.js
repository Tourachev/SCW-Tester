// Modules
const {app, BrowserWindow, ipcMain, ipcRenderer} = require('electron');
const path = require('path');
const ejse = require('ejs-electron');
const packager = require('electron-packager');
const sqlite = require('sqlite3');

// packager({
//     dir: './',
//     overwrite: true,
//     asar: true,
//     platform: 'win32',
//     arch: 'ia32',
//     prune: true,
//     out: 'release-builds-folder',
//     executableName: 'my-app',
//     icon: 'icon/myicon.ico',

//     afterCopy: [(buildPath, electronVersion, platform, arch, callback) => {

//     rebuild.rebuild({ buildPath, electronVersion, arch })

//       .then(() => callback())

//       .catch((error) => callback(error));

//   }],

// })

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow
let secWindow

//Listening for request
ipcMain.on('acceptPrivacyAct', () => {
  secWindow.close();
})
ipcMain.on('declinePrivacyAct', () => {
  app.quit();
})

ipcMain.on('generate', () => {
  let result = knex.select().from("test_bank")
  result.then(function(rows){
    mainWindow.webContents.send("resultSent",rows);
  })
})

var dbAddress = path.join(app.getAppPath(), 'assets', 'db', 'database.db');

const knex = require('knex')({
  client: 'sqlite3',
  connection:{
    filename: dbAddress
  }
});


// Create a new BrowserWindow when `app` is ready
function createWindow () {

  mainWindow = new BrowserWindow({
    show: false,
    width: 1000, height: 800,
    minWidth: 1000, minHeight:500,
    titleBarStyle: 'hidden',
    icon: '../img/icon.png',
    webPreferences: {
      sandbox: false,
      nodeIntegration: true }
  })

  secWindow = new BrowserWindow({
    show: false,
    alwaysOnTop:true,
    width: 600, height: 750,
    resizable: false,
    titleBarStyle: 'hidden',
    parent:mainWindow,
    modal:true,
    webPreferences: { 
       nodeIntegration: true }
  })


  // Load index.html into the new BrowserWindow

  secWindow.loadFile('views/privacyact.ejs')
  secWindow.once("ready-to-show",()=> {secWindow.show() })
    
  mainWindow.loadFile('views/index.ejs')
  mainWindow.once("ready-to-show",()=> {mainWindow.show() })



  // Open DevTools - Remove for PRODUCTION!
  //mainWindow.webContents.openDevTools();

  // Listen for window being closed
  mainWindow.on('closed',  () => {
    mainWindow = null
  })

  secWindow.on('closed',  () => {
    secWindow = null
  })
}


// Electron `app` is ready
app.on('ready', createWindow)

// Quit when all windows are closed - (Not macOS - Darwin)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

// When app icon is clicked and app is running, (macOS) recreate the BrowserWindow
app.on('activate', () => {
  if (mainWindow === null) createWindow()
})


