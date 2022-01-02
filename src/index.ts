import { app, BrowserWindow, ipcMain, Menu, screen, Tray, nativeImage } from 'electron';
import isDev from 'electron-is-dev';
import Store from 'electron-store';
import path from 'path';

declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

if (require('electron-squirrel-startup')) {
  app.quit();
}

let tray: Tray = undefined;
let win: BrowserWindow = undefined;
const store = new Store();
let closeTime = +new Date();

const getWindowPosition = () => {
  const windowBounds = win.getBounds();
  const trayBounds = tray.getBounds();

  let x = Math.round(trayBounds.x + trayBounds.width / 2 - windowBounds.width / 2);

  const screenWidth = screen.getPrimaryDisplay().workAreaSize.width;
  const screenHeight = screen.getPrimaryDisplay().workAreaSize.height;

  x = Math.max(3, Math.min(x, screenWidth - windowBounds.width - 3));

  let y;

  if (trayBounds.y > screenHeight / 2) {
    y = Math.round(trayBounds.y - windowBounds.height);
  } else {
    y = Math.round(trayBounds.y + trayBounds.height);
  }

  return { x: x, y: y };
};

const getIcon = (iconFileName: string): Electron.NativeImage => {
  const img = `icons/${iconFileName}`;
  const imgPath = isDev ? path.join(__dirname, `../../src/${img}`) : path.join(__dirname, `./${img}`);
  const image = nativeImage.createFromPath(imgPath);
  return image.resize({ width: 16, height: 16 });
};

const createWindow = (): void => {
  win = new BrowserWindow({
    width: 370,
    height: 122,
    show: false,
    frame: false,
    fullscreenable: false,
    resizable: false,
    transparent: true,
    skipTaskbar: true,
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
      nodeIntegration: true,
      contextIsolation: false,
      backgroundThrottling: false,
    },
    icon: getIcon('time-on.png'),
  });

  win.setAlwaysOnTop(true, 'normal');

  win.setMenuBarVisibility(false);

  win.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  if (isDev) {
    win.webContents.openDevTools({
      mode: 'detach',
    });
  }

  win.on('blur', () => {
    win.webContents.send('blur');
  });

  win.on('hide', () => {
    closeTime = +new Date();
  });

  win.on('closed', () => {
    win = null;
  });
};

const showWindow = ({ withFocus = true }: { withFocus?: boolean } = {}) => {
  const position = getWindowPosition();
  win.setPosition(position.x, position.y, false);
  win.showInactive();
  if (withFocus) {
    win.focus();
  }
};

const createTray = () => {
  tray = new Tray(getIcon('time-off.png'));
  tray.on('click', function () {
    if (win.isVisible()) {
      win.webContents.send('blur');
    } else {
      if (+new Date() - closeTime > 200) {
        showWindow();
      }
    }
  });

  const contextMenu = Menu.buildFromTemplate([{ label: 'Exit', type: 'normal', role: 'quit' }]);
  tray.on('right-click', function () {
    tray.popUpContextMenu(contextMenu);
  });
};

app.on('ready', () => {
  try {
    createTray();
    createWindow();
  } catch (e) {
    console.log(e);
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

ipcMain.on('hideWindow', () => {
  win.hide();
});

ipcMain.on('showWindow', () => {
  showWindow({ withFocus: false });
});

ipcMain.handle('getStoreValue', (event, key) => {
  return store.get(key);
});

ipcMain.handle('setStoreValue', (event, { key, value }) => {
  return store.set(key, value);
});

ipcMain.on('startTimer', () => {
  tray.setImage(getIcon('time-on.png'));
});

ipcMain.on('stopTimer', () => {
  tray.setImage(getIcon('time-off.png'));
});

ipcMain.on('startChill', () => {
  tray.setImage(getIcon('time-idle.png'));
});

ipcMain.on('updateTimerString', (e, val) => {
  tray.setToolTip(val);
});
