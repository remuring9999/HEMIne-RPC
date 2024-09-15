import * as path from "path";
import {
  app,
  BrowserWindow,
  Notification,
  ipcMain,
  globalShortcut,
} from "electron";
import * as isDev from "electron-is-dev";
import * as keytar from "keytar";
import * as url from "url";
import { Client } from "@remuring/discord-rpc";
import { AuthClient } from "./Auth";
import { io } from "socket.io-client";
import { version } from "../package.json";

const BASE_URL = "http://localhost:3000";
const ipc = ipcMain;

let mainWindow: BrowserWindow | null;
let childWindow: BrowserWindow | null;
let connectionWindow: BrowserWindow | null;
let connectionWindowEnabled = false;
let RPCClient: Client | null;
let SocketClientId: string | null = null;

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
      devTools: !app.isPackaged,
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
      devTools: !app.isPackaged,
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
      devTools: !app.isPackaged,
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

  globalShortcut.register("CommandOrControl+R", () => {});

  globalShortcut.register("F5", () => {});

  globalShortcut.register("F12", () => {});
  globalShortcut.register("CommandOrControl+Shift+I", () => {});
  globalShortcut.register("CommandOrControl+Shift+J", () => {});
  globalShortcut.register("CommandOrControl+Shift+C", () => {});
  globalShortcut.register("CommandOrControl+Shift+K", () => {});
  globalShortcut.register("CommandOrControl+Shift+U", () => {});

  if (process.platform == "win32") {
    app.setAppUserModelId("HEMIne");
  }
}

const socket = io("", {
  autoConnect: false,
  transports: ["websocket"],
  extraHeaders: {
    Authorization: `asdf`,
    "User-Agent": `HEMIne/${version} (Electron)`,
  },
});

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

      mainWindow?.webContents.send("LOGIN_SUCCESS", user);

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

      const auth = new AuthClient(receiveTokens, "", "", "", 205);
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

      mainWindow?.webContents.send("LOGIN_SUCCESS", userData);

      return;
    }
  });
}

ipc.on("APP_MINIMIZE", () => {
  mainWindow?.minimize();
});

ipc.on("APP_MAXIMIZE", () => {
  if (mainWindow?.isMaximized()) {
    mainWindow?.restore();
  } else {
    mainWindow?.maximize();
  }
});

ipc.on("APP_CLOSE", () => {
  mainWindow?.close();
});

/**
 * @description Discord 로그인창열기
 */
ipc.on("PAGE_LOGIN_OPEN", () => {
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
ipc.on("PAGE_CONNECTION_OPEN", (_event, data) => {
  if (connectionWindowEnabled) {
    connectionWindow?.webContents.send("RPC_IS_CONNECTED", data);
    connectionWindow?.webContents.send(
      "WS_IS_CONNECTED",
      SocketClientId ? true : false
    );
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
    connectionWindow?.webContents.send(
      "RPC_IS_CONNECTED",
      RPCClient ? true : false
    );
    connectionWindow?.webContents.send(
      "WS_IS_CONNECTED",
      SocketClientId ? true : false
    );
  });
});

/**
 * @description Discord RPC 연결여부
 */
ipc.on("IS_PRC_CONNECTED", () => {
  if (RPCClient) {
    return connectionWindow?.webContents.send("RPC_IS_CONNECTED", true);
  } else {
    return connectionWindow?.webContents.send("RPC_IS_CONNECTED", false);
  }
});

/**
 * @description Discord RPC 연결
 * @param {object} data Discord User Object
 */
ipc.on("RPC_CONNECT", async (_event, data) => {
  if (RPCClient) return;
  const accessToken = await keytar.getPassword("discord", "accessToken");
  if (!accessToken) return isNotLogin();

  const RPC = new Client({ transport: "ipc" });

  RPC.on("VOICE_CHANNEL_SELECT", async (data) => {
    await socket.emit("UNSET_USER");
    if (!data.channel_id) {
      await socket.emit("SET_USER", { userId: RPC.user?.id });
      return;
    }
    socket.emit("SET_USER", { userId: RPC.user?.id, guildId: data.guild_id });
  });

  RPC.on("ready", async () => {
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

    const voiceChannel = await RPC.getSelectedVoiceChannel();
    if (voiceChannel) {
      socket.emit("SET_USER", {
        userId: RPC.user?.id,
        guildId: voiceChannel.guild_id,
      });
    }

    RPC.subscribe("VOICE_CHANNEL_SELECT", () => {});

    mainWindow?.webContents.send("RPC_CONNECT_SUCCESS");
    connectionWindow?.webContents.send("RPC_IS_CONNECTED", true);
  });

  let retryCount = 0;

  const attemptLogin = async () => {
    try {
      await RPC.login({
        clientId: "",
        scopes: ["rpc", "rpc.voice.read"],
        accessToken: accessToken,
      });

      RPCClient = RPC;
    } catch (error: any) {
      if (retryCount < 5) {
        retryCount++;
        mainWindow?.webContents.send("RPC_CONNECT_ERROR", {
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
ipc.on("RPC_DISCONNECT", async () => {
  if (!RPCClient) return;
  RPCClient?.destroy();
  RPCClient = null;
  connectionWindow?.webContents.send("RPC_IS_CONNECTED", false);
  mainWindow?.webContents.send("RPC_DISCONNECTED");
  return;
});

/**
 * @description 클라이언트 로그아웃
 */
ipc.on("APP_LOGOUT", async () => {
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

/**
 * @description HEMIne WS 연결
 */
ipc.on("WS_CONNECT", () => {
  socket.connect();

  socket.on("PLAYER_DATA", async (json: PlayerData | null) => {
    if (json?.data == null) {
      RPCClient?.clearActivity();
      mainWindow?.webContents.send("SONG_DATA", null);
      return;
    }

    const voiceChannel = await RPCClient?.getSelectedVoiceChannel();
    if (voiceChannel) {
      if (voiceChannel.voice_states?.find((v) => v.user.id == "")) {
        let startTime =
          new Date().getTime() - json.data.Player.current.position;
        let endTime = startTime + json.data.Player.current.length;

        RPCClient?.setActivity({
          details: json.data.Player.current.title,
          state: json.data.Player.current.author,
          largeImageKey: json.data.Player.current.thumbnail,
          largeImageText: json.data.Player.isPaused ? "일시정지" : "듣는중",
          smallImageKey: "",
          smallImageText: "햄이네 HEMIne",
          startTimestamp: startTime,
          endTimestamp: endTime,
        });

        mainWindow?.webContents.send("SONG_DATA", json);
      } else {
        RPCClient?.clearActivity();
        mainWindow?.webContents.send("SONG_DATA", null);
        return;
      }
    } else {
      RPCClient?.clearActivity();
      mainWindow?.webContents.send("SONG_DATA", null);
      return;
    }
  });

  socket.on("connect", () => {
    SocketClientId = socket.id as string;
    mainWindow?.webContents.send("WS_CONNECTED");
    new Notification({
      title: "HEMIne",
      body: "HEMIne 서버와 연결되었어요!",
    }).show();
  });

  socket.on("disconnect", () => {
    mainWindow?.webContents.send("WS_DISCONNECTED");
    new Notification({
      title: "HEMIne",
      body: "HEMIne 서버로부터 연결이 끊어졌습니다. 기능을 사용할 수 없습니다.",
    }).show();

    app.quit();
  });

  socket.on("connect_error", () => {
    mainWindow?.webContents.send("WS_DISCONNECTED");
    new Notification({
      title: "HEMIne",
      body: "HEMIne 서버와 연결할 수 없습니다. 기능을 사용할 수 없습니다.",
    }).show();

    app.quit();
  });

  socket.on("connect_timeout", () => {
    mainWindow?.webContents.send("WS_DISCONNECTED");
    new Notification({
      title: "HEMIne",
      body: "HEMIne 서버 연결이 시간 초과되었습니다. 다시 시도해주세요.",
    }).show();
  });
});

/**
 * @description HEMIne WS 연결 여부
 */
ipc.on("WS_IS_CONNECTED", () => {
  if (!SocketClientId) {
    connectionWindow?.webContents.send("WS_IS_CONNECTED", false);
    return;
  } else {
    connectionWindow?.webContents.send("WS_IS_CONNECTED", true);
  }
});

ipc.on("PAGE_CONNECTION_CLOSE", () => {
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

interface PlayerData {
  data: {
    guildId: string;
    userId: string;
    voiceChannelId: string;
    textChannelId: string;
    Player: {
      current: {
        title: string;
        thumbnail: string;
        position: number;
        author: string;
        length: number;
      };
      isPlaying: boolean;
      isPaused: boolean;
    };
  };
}
