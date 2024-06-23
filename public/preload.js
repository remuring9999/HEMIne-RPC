const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electron", {
  ipcSend: (channel, data) => ipcRenderer.send(channel, data),
  ipcReceive: (channel, listener) => {
    ipcRenderer.on(channel, (event, ...args) => listener(...args));
  },
});
