import * as path from "path";
import { app, BrowserWindow, Notification, ipcMain } from "electron";
import * as isDev from "electron-is-dev";
import * as keytar from "keytar";
import * as url from "url";
import { AuthClient } from "../src/Utils/Auth";

const BASE_URL = "http://localhost:3000";
const ipc = ipcMain;

let mainWindow: BrowserWindow | null;
let childWindow: BrowserWindow | null;

function createMainWindow(): void {
  mainWindow = new BrowserWindow({
    width: 470,
    height: 750,
    center: true,
    frame: false,
    resizable: false,
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

  if (process.platform == "win32") {
    app.setAppUserModelId("HEMIne");
  }

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
      if (isDev) {
        childWindow?.loadURL(BASE_URL + "#login");
      } else {
        childWindow?.loadURL(
          url.format({
            pathname: path.join(__dirname, "../build/index.html"),
            protocol: "file:",
            slashes: true,
            hash: "/login",
          })
        );
      }

      new Notification({
        title: "HEMIne Authentication",
        body: "Discord에 로그인되지 않았어요! 로그인을 진행해주세요!",
      }).show();

      childWindow?.once("ready-to-show", () => {
        childWindow?.show();
      });
    }
  });
}

ipc.on("minimizeApp", () => {
  if (childWindow) {
    childWindow?.minimize();
    return;
  }
  mainWindow?.minimize();
});

ipc.on("maximizeApp", () => {
  if (childWindow) {
    if (childWindow?.isMaximized()) {
      childWindow?.restore();
    } else {
      childWindow?.maximize();
    }
    return;
  }
  if (mainWindow?.isMaximized()) {
    mainWindow?.restore();
  } else {
    mainWindow?.maximize();
  }
});

ipc.on("closeApp", () => {
  if (childWindow) {
    childWindow?.close();
    childWindow = null;
    return;
  }
  mainWindow?.close();
  mainWindow = null;
});

ipc.on("login", () => {
  if (childWindow) {
    childWindow.setSize(850, 950);
    childWindow.center();
    const auth = new AuthClient();
    childWindow.loadURL(auth.getAuthURL());
  }
});

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
