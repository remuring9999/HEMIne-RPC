import * as path from "path";
import { app, BrowserWindow, Notification, ipcMain } from "electron";
import * as isDev from "electron-is-dev";
import * as keytar from "keytar";
import * as url from "url";
import { AuthClient } from "./Auth";

const BASE_URL = "http://localhost:3000";
const ipc = ipcMain;

let mainWindow: BrowserWindow | null;
let childWindow: BrowserWindow | null;
let connectionWindow: BrowserWindow | null;
let connectionWindowEnabled = false;

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

  connectionWindow = new BrowserWindow({
    parent: mainWindow,
    show: false,
    width: 660,
    height: 460,
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

  mainWindow.on("closed", (): void => {
    mainWindow = null;
  });

  if (process.platform == "win32") {
    app.setAppUserModelId("HEMIne");
  }

  if (isDev) {
    mainWindow.loadURL(BASE_URL);
  } else {
    mainWindow.loadFile(path.join(__dirname, "../build/index.html"));
  }

  keytar.findCredentials("discord").then(async (credentials) => {
    if (credentials.length === 0) {
      isNotLogin();
      childWindow?.once("ready-to-show", () => {
        childWindow?.show();
      });
    } else {
      const token = await keytar.getPassword("discord", "refreshToken");

      const auth = new AuthClient(
        receiveTokens,
        "1212287206702583829",
        "7plMXfI4PuvxMG-EVxZx7fyyJTZ1eH5i",
        "http://localhost:205/auth/discord/callback",
        205
      );
      auth._server.close();

      const refreshToken = await auth.refreshToken(token);

      if (refreshToken === null) {
        isNotLogin();

        childWindow?.once("ready-to-show", () => {
          childWindow?.show();
        });

        return;
      }

      const userData = await auth.getIdentify(refreshToken.access_token);

      if (userData == null) {
        isNotLogin();
        return;
      }

      await keytar.deletePassword("discord", "accessToken");
      await keytar.deletePassword("discord", "refreshToken");

      await keytar.setPassword(
        "discord",
        "accessToken",
        refreshToken.access_token
      );
      await keytar.setPassword(
        "discord",
        "refreshToken",
        refreshToken.refresh_token
      );

      new Notification({
        title: "HEMIne Authentication",
        body: "Discord에 로그인되었어요!",
      }).show();

      mainWindow?.webContents.send("login", userData);

      return;
    }
  });
}

function receiveTokens(
  session: AuthClient,
  tokens: { accessToken: string; refreshToken: string }
) {
  if (session.result) {
    childWindow?.close();
    childWindow = null;

    session.getIdentify(tokens.accessToken).then(async (user) => {
      if (user === null) {
        loginFailed();
        return;
      }

      await keytar.setPassword("discord", "userId", user.id);
      await keytar.setPassword("discord", "accessToken", tokens.accessToken);
      await keytar.setPassword("discord", "refreshToken", tokens.refreshToken);

      new Notification({
        title: "HEMIne Authentication",
        body: "Discord 로그인에 성공했어요!",
      }).show();

      mainWindow?.webContents.send("login", user);

      return;
    });
  } else {
    loginFailed();
    return;
  }
}

function loginFailed() {
  new Notification({
    title: "HEMIne Authentication",
    body: "Discord 로그인에 실패했어요! 다시 시도해주세요!",
  }).show();

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
  return;
}

function isNotLogin() {
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

  return;
}

ipc.on("minimizeApp", () => {
  mainWindow?.minimize();
});

ipc.on("maximizeApp", () => {
  if (mainWindow?.isMaximized()) {
    mainWindow?.restore();
  } else {
    mainWindow?.maximize();
  }
});

ipc.on("closeApp", () => {
  mainWindow?.close();
});

ipc.on("login", () => {
  if (childWindow) {
    childWindow.setSize(850, 950);
    childWindow.center();
    const auth = new AuthClient(
      receiveTokens,
      "1212287206702583829",
      "7plMXfI4PuvxMG-EVxZx7fyyJTZ1eH5i",
      "http://localhost:205/auth/discord/callback",
      205
    );
    childWindow.loadURL(auth.getAuthURL());
  } else {
    return;
  }
});

ipc.on("openConnection", (_event, user) => {
  if (connectionWindowEnabled) {
    connectionWindow?.show();
    return;
  }
  if (isDev) {
    connectionWindow?.loadURL(BASE_URL + "#connection");
  } else {
    connectionWindow?.loadURL(
      url.format({
        pathname: path.join(__dirname, "../build/index.html"),
        protocol: "file:",
        slashes: true,
        hash: "/connection",
      })
    );
  }

  connectionWindow?.once("ready-to-show", () => {
    connectionWindow?.show();
    connectionWindow?.webContents.send("userData", user);
    connectionWindowEnabled = true;
  });
});

ipc.on("CloseConnection", () => {
  connectionWindow?.hide();
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
