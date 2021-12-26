declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION__: unknown;
    ipcRenderer: Electron.IpcRenderer;
  }
}

export {};
