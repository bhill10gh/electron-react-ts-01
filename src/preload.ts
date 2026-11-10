// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("electronAPI", {
  closeWindow: () => ipcRenderer.send("close-window"),
  getWeather: () => ipcRenderer.invoke("weather:get"),
  getReturnString: (str: string) =>
    ipcRenderer.invoke("musicdb:getReturnString", str),
});
