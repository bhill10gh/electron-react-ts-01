// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import { contextBridge, ipcRenderer } from "electron";

export interface FileResult {
  filePath: string;
  content: string;
}

contextBridge.exposeInMainWorld("electronAPI", {
  closeWindow: () => ipcRenderer.send("close-window"),
  getWeather: () => ipcRenderer.invoke("weather:get"),
  getReturnString: (str: string) =>
    ipcRenderer.invoke("musicdb:getReturnString", str),
  findSong: (search: string) => ipcRenderer.invoke("musicdb:findSong", search),
  findArtistSongs: (search: string) =>
    ipcRenderer.invoke("musicdb:findArtistSongs", search),
  searchSongs: (filters: {
    songTitle?: string;
    artistName?: string;
    genre?: string;
  }) => ipcRenderer.invoke("musicdb:searchSongs", filters),
  openFile: (): Promise<FileResult | null> =>
    ipcRenderer.invoke("dialog:openFile"),
  openAudioFile: (): Promise<string | null> =>
    ipcRenderer.invoke("dialog:openAudio"),
  openVideo: (): Promise<string | null> =>
    ipcRenderer.invoke("dialog:openVideo"),
  getZoomPercent: (): Promise<number> => ipcRenderer.invoke("zoom:getPercent"),
  zoomIn: (): Promise<number> => ipcRenderer.invoke("zoom:in"),
  zoomOut: (): Promise<number> => ipcRenderer.invoke("zoom:out"),
  zoomReset: (): Promise<number> => ipcRenderer.invoke("zoom:reset"),
});
