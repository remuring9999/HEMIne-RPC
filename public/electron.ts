import * as path from "path";
import { app, BrowserWindow, Notification, ipcMain } from "electron";
import * as isDev from "electron-is-dev";
import * as keytar from "keytar";
import * as url from "url";
import { Client } from "discord-rpc";
import { AuthClient } from "./Auth";

const BASE_URL = "http://localhost:3000";
const ipc = ipcMain;

let mainWindow: BrowserWindow | null;
let childWindow: BrowserWindow | null;
let connectionWindow: BrowserWindow | null;
let connectionWindowEnabled = false;
let RPCClient: Client | null;

function createMainWindow(): void {
  mainWindow = new BrowserWindow({
    show: false,
    width: 470,
    height: 750,
    center: true,
    frame: false,
    resizable: false,
    alwaysOnTop: true,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: true,
      preload: path.join(__dirname, "preload.js"),
    },
  });

  if (isDev) {
    mainWindow.loadURL(BASE_URL);
  } else {
    mainWindow.loadFile(path.join(__dirname, "../build/index.html"));
  }

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
    login();
    setTimeout(() => {
      mainWindow?.setAlwaysOnTop(false);
    }, 1000);
  });

  mainWindow.on("closed", (): void => {
    mainWindow = null;
  });

  if (process.platform == "win32") {
    app.setAppUserModelId("HEMIne");
  }
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

      mainWindow?.webContents.send("loginSuccess", user);

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

function login() {
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

      mainWindow?.webContents.send("loginSuccess", userData);

      return;
    }
  });
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

/**
 * @description Discord 로그인창열기
 */
ipc.on("loginDirect", () => {
  if (childWindow) {
    childWindow.setSize(1020, 950);
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

/**
 * @description Discord 정보창열기
 * @param {Boolean} data Discord RPC 연결여부
 */
ipc.on("openConnection", (_event, data) => {
  if (connectionWindowEnabled) {
    connectionWindow?.webContents.send("isRPCConnected", data);
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
    connectionWindowEnabled = true;
    connectionWindow?.webContents.send("isRPCConnected", data);
  });
});

/**
 * @description Discord RPC 연결
 * @param {object} data Discord User Object
 */
ipc.on("ConnectRPC", async (_event, data) => {
  if (RPCClient) return;
  const accessToken = await keytar.getPassword("discord", "accessToken");
  if (!accessToken) return isNotLogin();

  const RPC = new Client({ transport: "ipc" });

  RPC.on("ready", async () => {
    RPC.setActivity({
      details: "ㅎㅇ",
      state: "스테이트",
      instance: false,
    });

    if (RPC.user?.id !== data.id) {
      if (RPC.user?.id == undefined || RPC.user?.id == null) return;
      new Notification({
        title: "HEMIne Authentication",
        body: "올바르지 않은 Discord 계정입니다!",
      }).show();

      const Credentials = await keytar.findCredentials("discord");

      for (const credential of Credentials) {
        await keytar.deletePassword("discord", credential.account as string);
      }

      app.quit();
    }

    new Notification({
      title: "HEMIne",
      body: "Discord Client에 연결되었어요!",
    }).show();
  });

  let retryCount = 0;

  const attemptLogin = async () => {
    try {
      await RPC.login({
        clientId: "1212287206702583829",
        scopes: ["rpc", "rpc.voice.read"],
        accessToken: accessToken,
      });

      mainWindow?.webContents.send("ConnectedRPC");
      connectionWindow?.webContents.send("isRPCConnected", true);

      RPCClient = RPC;
    } catch (error: any) {
      if (retryCount < 5) {
        retryCount++;
        mainWindow?.webContents.send("ErrorConnectRPC", {
          message: `Discord Client 연결에 실패했다네\n5초 후 다시 시도한다네\n시도 횟수 : ${retryCount}/5`,
          error: error.message,
        });
        setTimeout(attemptLogin, 5000);
      } else {
        new Notification({
          title: "HEMIne",
          body: "Discord RPC 연결에 실패했어요!",
        }).show();

        app.quit();

        return;
      }
    }
  };

  await attemptLogin();
});

/**
 * @description Discord RPC 연결 해제
 */
ipc.on("RPC_Disconnect", async () => {
  if (!RPCClient) return;
  RPCClient?.destroy();
  RPCClient = null;
  connectionWindow?.webContents.send("isRPCConnected", false);
  mainWindow?.webContents.send("DisconnectedRPC");
  new Notification({
    title: "HEMIne",
    body: "Discord Client와 연결이 해제되었어요!",
  }).show();
  return;
});

/**
 * @description 클라이언트 로그아웃
 */
ipc.on("logout", async () => {
  const Credentials = await keytar.findCredentials("discord");

  for (const credential of Credentials) {
    await keytar.deletePassword("discord", credential.account as string);
  }

  new Notification({
    title: "HEMIne Authentication",
    body: "로그아웃되었어요! 앱을 재시작해주세요!",
  }).show();

  app.quit();
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
