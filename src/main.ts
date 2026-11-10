import { app, BrowserWindow, dialog, ipcMain } from "electron";
import fs from "node:fs";
import path from "node:path";
import started from "electron-squirrel-startup";
import { spawn } from "child_process";
import { ChildProcessByStdio } from "node:child_process";
import { Readable } from "node:stream";

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (started) {
  app.quit();
}

let apiProcess: ChildProcessByStdio<null, Readable, Readable> | null;

const API_URL = "http://127.0.0.1:5189";
const API_EXE_NAME = "api-service.exe";

function getApiExecutablePath(): string {
  if (app.isPackaged) {
    return path.join(process.resourcesPath, "backend", API_EXE_NAME);
  }

  // Forge outputs main to .vite/build; project root is two levels up.
  return path.join(
    __dirname,
    "..",
    "..",
    "backend",
    "api-service",
    "publish",
    API_EXE_NAME,
  );
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
    //titleBarStyle: "hidden",
  });
  mainWindow.removeMenu();

  // and load the index.html of the app.
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(
      path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`),
    );
  }

  // Open the DevTools.
  // mainWindow.webContents.openDevTools();
};

function startApi(): void {
  if (apiProcess) {
    return;
  }

  const apiPath = getApiExecutablePath();

  if (!fs.existsSync(apiPath)) {
    throw new Error(
      `API executable not found at ${apiPath}. Run "npm run build:api" first.`,
    );
  }

  const apiDir = path.dirname(apiPath);

  apiProcess = spawn(apiPath, ["--urls", API_URL], {
    cwd: apiDir,
    windowsHide: true,
    stdio: ["ignore", "pipe", "pipe"],
    env: {
      ...process.env,
      ASPNETCORE_ENVIRONMENT: "Production",
    },
  });

  apiProcess.stdout.on("data", (data) => {
    console.log(`API: ${data}`);
  });

  apiProcess.stderr.on("data", (data) => {
    console.error(`API Error: ${data}`);
  });

  apiProcess.on("error", (error) => {
    console.error("Unable to start API:", error);
  });

  apiProcess.on("exit", (code) => {
    console.log(`API exited with code ${code}`);
  });
}

function stopApi() {
  if (apiProcess) {
    apiProcess.kill();
    apiProcess = null;
  }
}

async function waitForApi() {
  const maxAttempts = 30;

  for (let i = 0; i < maxAttempts; i++) {
    try {
      const response = await fetch(`${API_URL}/health`);

      if (response.ok) {
        console.log("API is ready");
        return;
      }
    } catch {
      // API is still starting
    }

    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  throw new Error("The .NET API failed to start.");
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
ipcMain.on("close-window", (event) => {
  BrowserWindow.fromWebContents(event.sender)?.close();
});

async function bootstrap(): Promise<void> {
  try {
    startApi();
    await waitForApi();
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to start the API.";
    console.error(message);
    dialog.showErrorBox("API failed to start", message);
  }

  createWindow();
}

app.whenReady().then(async () => {
  await bootstrap();

  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  app.on("activate", async () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      await bootstrap();
    }
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("will-quit", () => {
  stopApi();
});

ipcMain.handle("weather:get", async () => {
  const response = await fetch(`${API_URL}/WeatherForecast`);

  if (!response.ok) {
    throw new Error("Failed to retrieve weather forecast");
  }

  return await response.json();
});

ipcMain.handle("musicdb:getReturnString", async (_event, str: string) => {
  const response = await fetch(
    `${API_URL}/MusicDB?str=${encodeURIComponent(str)}`,
  );

  if (!response.ok) {
    throw new Error("Failed to call GetReturnString");
  }

  return await response.text();
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
