const {app, BrowserWindow} = require('electron');
const path = require('path');
const url = require('url');

const ipcFavorite = require('./handlers/ipc-favorite');
const ipcAlarm = require('./handlers/ipc-alarm');

let win;

const createWindow = () => {
  const {screen} = require('electron');

  win = new BrowserWindow({
    frame: false,
    center: true,
    moveable: true,
    resizable: true,
    autoHideMenuBar: true,
    titleBarStyle:
      process.platform !== 'darwin' ?
        'hiddenInset' :
        'customButtonsOnHover',
    webPreferences: {
      experimentalFeatures: true,
      nodeIntegration: true,
    },
  });

  const {
    // width: displayWidth,
    height: displayHeight,
  } = screen
      .getPrimaryDisplay()
      .size;

  win.setMinimumSize(768, displayHeight - 30);
  win.setMaximumSize(992, displayHeight);

  win.loadURL(
      url.format({
        pathname: path.join(__dirname, `/dist/app-bible/index.html`),
        protocol: 'file:',
        slashes: true,
      })
  );

  // The following is optional and will open the DevTools:
  win.webContents.openDevTools();

  win.once('show', () => {
    ipcFavorite();
    ipcAlarm();
  });

  win.on('window-all-closed', app.quit);

  win.on('closed', () => {
    win = null;
  });
};

app.on('ready', createWindow);

// on macOS, closing the window doesn't quit the app
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// initialize the app's main window
app.on('activate', () => {
  if (win === null) {
    createWindow();
  }
});
