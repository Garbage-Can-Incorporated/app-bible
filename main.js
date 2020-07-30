const {app, BrowserWindow, Tray, Menu} = require('electron');
const path = require('path');
const url = require('url');

const ipcFavorite = require('./handlers/ipc-favorite');
const ipcAlarm = require('./handlers/ipc-alarm');
const ipcSearch = require('./handlers/ipc-search');

let win;

app.commandLine.appendSwitch('enable-speech-dispatcher');

const createWindow = () => {
  const {screen} = require('electron');
  let iconPath;

  if (process.platform === 'win32') {
    iconPath = path
        .join(__dirname, '/src/assets/ico/favicon32x32.ico');
  }

  if (process.platform === 'linux') {
    iconPath = path
        .join(__dirname, '/src/assets/imgs/icon192x192.png');
  }

  if (process.platform === 'darwin') {
    iconPath = path
        .join(__dirname, '/src/assets/icns/favicon32x32.icns');
  }

  win = new BrowserWindow({
    icon: iconPath,
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

  const tray = new Tray(iconPath);
  tray.setTitle(`Ev'ryWord`);
  tray.setToolTip(`Ev'ryWord`);
  const trayMenu = Menu.buildFromTemplate([
    {
      type: 'normal',
      role: 'click',
      label: 'quit',
      click: (mt, win, _) => {
        win.close();
      },
    },
  ]);
  tray.setContextMenu(trayMenu);

  let {
    // width: displayWidth,
    height: displayHeight,
  } = screen
      .getPrimaryDisplay()
      .size;

  if (process.platform === 'linux') {
    displayHeight -= 28;
  }

  win.setMinimumSize(768, displayHeight);
  win.setMaximumSize(992, displayHeight);
  win.minimize();
  win.hide();

  win.loadURL(
      url.format({
        pathname: path.join(__dirname, `/dist/app-bible/index.html`),
        protocol: 'file:',
        slashes: true,
      })
  ).then(() => {
    // workaround for speech synthesis voices
    win.webContents.reload();
    win.loadURL(
        url.format({
          pathname: path.join(__dirname, `/dist/app-bible/index.html`),
          protocol: 'file:',
          slashes: true,
        })
    ).then(() => win.show());
  });


  // The following is optional and will open the DevTools:
  win.webContents.openDevTools();

  win.once('ready-to-show', () => {
    ipcFavorite();
    ipcAlarm();
    ipcSearch();
  });

  win.on('window-all-closed', app.quit);

  win.on('closed', () => {
    win = null;
    tray.destroy();
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
