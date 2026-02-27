const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("api", {
    close: () => ipcRenderer.send("close-app"),
    minimize: () => ipcRenderer.send("minimize-app"),
    maximize: () => ipcRenderer.send("maximize-app"),
    openExternal: (url) => ipcRenderer.send("open-external", url),
});
