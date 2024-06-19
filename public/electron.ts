import * as path from "path";
import { app, BrowserWindow } from "electron";
import * as isDev from "electron-is-dev";
import * as keytar from "keytar";

const BASE_URL = "http://localhost:3000";

let mainWindow: BrowserWindow | null;
let childWindow: BrowserWindow | null;

function createMainWindow(): void {
  mainWindow = new BrowserWindow({
    width: 470,
    height: 750,
    center: true,
    // frame: false,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: true,
      preload: path.join(__dirname, "preload.js"),
    },
  });

  childWindow = new BrowserWindow({
    parent: mainWindow,
    show: false,
    width: 1260,
    height: 700,
    modal: true,
    center: true,
    frame: false,
    resizable: false,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: true,
      preload: path.join(__dirname, "preload.js"),
    },
  });

  mainWindow.once("ready-to-show", () => {
    mainWindow?.show();
  });

  if (isDev) {
    mainWindow.loadURL(BASE_URL);

    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, "../build/index.html"));
  }

  mainWindow.on("closed", (): void => {
    mainWindow = null;
  });

  keytar.findCredentials("discord").then((credentials) => {
    if (credentials.length === 0) {
      childWindow?.loadURL("http://localhost:3000/login");

      childWindow?.once("ready-to-show", () => {
        childWindow?.show();
      });
    }
  });
}

app.on("ready", (): void => {
  createMainWindow();
});

app.on("window-all-closed", (): void => {
  app.quit();
});

app.on("activate", (): void => {
  if (mainWindow === null) {
    createMainWindow();
  }
});
