"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var path = require("path");
var electron_1 = require("electron");
var isDev = require("electron-is-dev");
var keytar = require("keytar");
var url = require("url");
var discord_rpc_1 = require("@remuring/discord-rpc");
var Auth_1 = require("./Auth");
var socket_io_client_1 = require("socket.io-client");
var package_json_1 = require("../package.json");
var BASE_URL = "http://localhost:3000";
var ipc = electron_1.ipcMain;
var mainWindow;
var childWindow;
var connectionWindow;
var connectionWindowEnabled = false;
var RPCClient;
var SocketClientId = null;
function createMainWindow() {
    mainWindow = new electron_1.BrowserWindow({
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
            preload: path.join(__dirname, "preload.js")
        }
    });
    if (isDev) {
        mainWindow.loadURL(BASE_URL);
    }
    else {
        mainWindow.loadFile(path.join(__dirname, "../build/index.html"));
    }
    childWindow = new electron_1.BrowserWindow({
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
            preload: path.join(__dirname, "preload.js")
        }
    });
    connectionWindow = new electron_1.BrowserWindow({
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
            preload: path.join(__dirname, "preload.js")
        }
    });
    mainWindow.once("ready-to-show", function () {
        mainWindow === null || mainWindow === void 0 ? void 0 : mainWindow.show();
        login();
        setTimeout(function () {
            mainWindow === null || mainWindow === void 0 ? void 0 : mainWindow.setAlwaysOnTop(false);
        }, 1000);
    });
    mainWindow.on("closed", function () {
        mainWindow = null;
    });
    if (process.platform == "win32") {
        electron_1.app.setAppUserModelId("HEMIne");
    }
}
var socket = (0, socket_io_client_1.io)("http://localhost:5000", {
    autoConnect: false,
    transports: ["websocket"],
    extraHeaders: {
        Authorization: "".concat(Crypto(generateKey())),
        "User-Agent": "HEMIne/".concat(package_json_1.version, " (Electron)")
    }
});
function receiveTokens(session, tokens) {
    var _this = this;
    if (session.result) {
        childWindow === null || childWindow === void 0 ? void 0 : childWindow.close();
        childWindow = null;
        session.getIdentify(tokens.accessToken).then(function (user) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (user === null) {
                            loginFailed();
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, keytar.setPassword("discord", "userId", user.id)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, keytar.setPassword("discord", "accessToken", tokens.accessToken)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, keytar.setPassword("discord", "refreshToken", tokens.refreshToken)];
                    case 3:
                        _a.sent();
                        mainWindow === null || mainWindow === void 0 ? void 0 : mainWindow.webContents.send("LOGIN_SUCCESS", user);
                        return [2 /*return*/];
                }
            });
        }); });
    }
    else {
        loginFailed();
        return;
    }
}
function loginFailed() {
    new electron_1.Notification({
        title: "HEMIne Authentication",
        body: "Discord 로그인에 실패했어요! 다시 시도해주세요!"
    }).show();
    if (isDev) {
        childWindow === null || childWindow === void 0 ? void 0 : childWindow.loadURL(BASE_URL + "#login");
    }
    else {
        childWindow === null || childWindow === void 0 ? void 0 : childWindow.loadURL(url.format({
            pathname: path.join(__dirname, "../build/index.html"),
            protocol: "file:",
            slashes: true,
            hash: "/login"
        }));
    }
    return;
}
function isNotLogin() {
    if (isDev) {
        childWindow === null || childWindow === void 0 ? void 0 : childWindow.loadURL(BASE_URL + "#login");
    }
    else {
        childWindow === null || childWindow === void 0 ? void 0 : childWindow.loadURL(url.format({
            pathname: path.join(__dirname, "../build/index.html"),
            protocol: "file:",
            slashes: true,
            hash: "/login"
        }));
    }
    new electron_1.Notification({
        title: "HEMIne Authentication",
        body: "Discord에 로그인되지 않았어요! 로그인을 진행해주세요!"
    }).show();
    childWindow === null || childWindow === void 0 ? void 0 : childWindow.once("ready-to-show", function () {
        childWindow === null || childWindow === void 0 ? void 0 : childWindow.show();
    });
    return;
}
function login() {
    var _this = this;
    keytar.findCredentials("discord").then(function (credentials) { return __awaiter(_this, void 0, void 0, function () {
        var token, auth, refreshToken, userData;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!(credentials.length === 0)) return [3 /*break*/, 1];
                    isNotLogin();
                    childWindow === null || childWindow === void 0 ? void 0 : childWindow.once("ready-to-show", function () {
                        childWindow === null || childWindow === void 0 ? void 0 : childWindow.show();
                    });
                    return [3 /*break*/, 9];
                case 1: return [4 /*yield*/, keytar.getPassword("discord", "refreshToken")];
                case 2:
                    token = _a.sent();
                    auth = new Auth_1.AuthClient(receiveTokens, "1212287206702583829", "7plMXfI4PuvxMG-EVxZx7fyyJTZ1eH5i", "http://localhost:205/auth/discord/callback", 205);
                    auth._server.close();
                    return [4 /*yield*/, auth.refreshToken(token)];
                case 3:
                    refreshToken = _a.sent();
                    if (refreshToken === null) {
                        isNotLogin();
                        childWindow === null || childWindow === void 0 ? void 0 : childWindow.once("ready-to-show", function () {
                            childWindow === null || childWindow === void 0 ? void 0 : childWindow.show();
                        });
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, auth.getIdentify(refreshToken.access_token)];
                case 4:
                    userData = _a.sent();
                    if (userData == null) {
                        isNotLogin();
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, keytar.deletePassword("discord", "accessToken")];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, keytar.deletePassword("discord", "refreshToken")];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, keytar.setPassword("discord", "accessToken", refreshToken.access_token)];
                case 7:
                    _a.sent();
                    return [4 /*yield*/, keytar.setPassword("discord", "refreshToken", refreshToken.refresh_token)];
                case 8:
                    _a.sent();
                    mainWindow === null || mainWindow === void 0 ? void 0 : mainWindow.webContents.send("LOGIN_SUCCESS", userData);
                    return [2 /*return*/];
                case 9: return [2 /*return*/];
            }
        });
    }); });
}
ipc.on("APP_MINIMIZE", function () {
    mainWindow === null || mainWindow === void 0 ? void 0 : mainWindow.minimize();
});
ipc.on("APP_MAXIMIZE", function () {
    if (mainWindow === null || mainWindow === void 0 ? void 0 : mainWindow.isMaximized()) {
        mainWindow === null || mainWindow === void 0 ? void 0 : mainWindow.restore();
    }
    else {
        mainWindow === null || mainWindow === void 0 ? void 0 : mainWindow.maximize();
    }
});
ipc.on("APP_CLOSE", function () {
    mainWindow === null || mainWindow === void 0 ? void 0 : mainWindow.close();
});
/**
 * @description Discord 로그인창열기
 */
ipc.on("PAGE_LOGIN_OPEN", function () {
    if (childWindow) {
        childWindow.setSize(1020, 950);
        childWindow.center();
        var auth = new Auth_1.AuthClient(receiveTokens, "1212287206702583829", "7plMXfI4PuvxMG-EVxZx7fyyJTZ1eH5i", "http://localhost:205/auth/discord/callback", 205);
        childWindow.loadURL(auth.getAuthURL());
    }
    else {
        return;
    }
});
/**
 * @description Discord 정보창열기
 * @param {Boolean} data Discord RPC 연결여부
 */
ipc.on("PAGE_CONNECTION_OPEN", function (_event, data) {
    if (connectionWindowEnabled) {
        connectionWindow === null || connectionWindow === void 0 ? void 0 : connectionWindow.webContents.send("RPC_IS_CONNECTED", data);
        connectionWindow === null || connectionWindow === void 0 ? void 0 : connectionWindow.webContents.send("WS_IS_CONNECTED", SocketClientId ? true : false);
        connectionWindow === null || connectionWindow === void 0 ? void 0 : connectionWindow.show();
        return;
    }
    if (isDev) {
        connectionWindow === null || connectionWindow === void 0 ? void 0 : connectionWindow.loadURL(BASE_URL + "#connection");
    }
    else {
        connectionWindow === null || connectionWindow === void 0 ? void 0 : connectionWindow.loadURL(url.format({
            pathname: path.join(__dirname, "../build/index.html"),
            protocol: "file:",
            slashes: true,
            hash: "/connection"
        }));
    }
    connectionWindow === null || connectionWindow === void 0 ? void 0 : connectionWindow.once("ready-to-show", function () {
        connectionWindow === null || connectionWindow === void 0 ? void 0 : connectionWindow.show();
        connectionWindowEnabled = true;
        connectionWindow === null || connectionWindow === void 0 ? void 0 : connectionWindow.webContents.send("RPC_IS_CONNECTED", RPCClient ? true : false);
        connectionWindow === null || connectionWindow === void 0 ? void 0 : connectionWindow.webContents.send("WS_IS_CONNECTED", SocketClientId ? true : false);
    });
});
/**
 * @description Discord RPC 연결여부
 */
ipc.on("IS_PRC_CONNECTED", function () {
    if (RPCClient) {
        return connectionWindow === null || connectionWindow === void 0 ? void 0 : connectionWindow.webContents.send("RPC_IS_CONNECTED", true);
    }
    else {
        return connectionWindow === null || connectionWindow === void 0 ? void 0 : connectionWindow.webContents.send("RPC_IS_CONNECTED", false);
    }
});
/**
 * @description Discord RPC 연결
 * @param {object} data Discord User Object
 */
ipc.on("RPC_CONNECT", function (_event, data) { return __awaiter(void 0, void 0, void 0, function () {
    var accessToken, RPC, retryCount, attemptLogin;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (RPCClient)
                    return [2 /*return*/];
                return [4 /*yield*/, keytar.getPassword("discord", "accessToken")];
            case 1:
                accessToken = _a.sent();
                if (!accessToken)
                    return [2 /*return*/, isNotLogin()];
                RPC = new discord_rpc_1.Client({ transport: "ipc" });
                RPC.on("VOICE_CHANNEL_SELECT", function (data) { return __awaiter(void 0, void 0, void 0, function () {
                    var _a, _b;
                    return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0: return [4 /*yield*/, socket.emit("UNSET_USER")];
                            case 1:
                                _c.sent();
                                if (!!data.channel_id) return [3 /*break*/, 3];
                                return [4 /*yield*/, socket.emit("SET_USER", { userId: (_a = RPC.user) === null || _a === void 0 ? void 0 : _a.id })];
                            case 2:
                                _c.sent();
                                return [2 /*return*/];
                            case 3:
                                socket.emit("SET_USER", { userId: (_b = RPC.user) === null || _b === void 0 ? void 0 : _b.id, guildId: data.guild_id });
                                return [2 /*return*/];
                        }
                    });
                }); });
                RPC.on("ready", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var Credentials, _i, Credentials_1, credential, voiceChannel;
                    var _a, _b, _c, _d;
                    return __generator(this, function (_e) {
                        switch (_e.label) {
                            case 0:
                                if (!(((_a = RPC.user) === null || _a === void 0 ? void 0 : _a.id) !== data.id)) return [3 /*break*/, 6];
                                if (((_b = RPC.user) === null || _b === void 0 ? void 0 : _b.id) == undefined || ((_c = RPC.user) === null || _c === void 0 ? void 0 : _c.id) == null)
                                    return [2 /*return*/];
                                new electron_1.Notification({
                                    title: "HEMIne Authentication",
                                    body: "올바르지 않은 Discord 계정입니다!"
                                }).show();
                                return [4 /*yield*/, keytar.findCredentials("discord")];
                            case 1:
                                Credentials = _e.sent();
                                _i = 0, Credentials_1 = Credentials;
                                _e.label = 2;
                            case 2:
                                if (!(_i < Credentials_1.length)) return [3 /*break*/, 5];
                                credential = Credentials_1[_i];
                                return [4 /*yield*/, keytar.deletePassword("discord", credential.account)];
                            case 3:
                                _e.sent();
                                _e.label = 4;
                            case 4:
                                _i++;
                                return [3 /*break*/, 2];
                            case 5:
                                electron_1.app.quit();
                                _e.label = 6;
                            case 6: return [4 /*yield*/, RPC.getSelectedVoiceChannel()];
                            case 7:
                                voiceChannel = _e.sent();
                                if (voiceChannel) {
                                    socket.emit("SET_USER", {
                                        userId: (_d = RPC.user) === null || _d === void 0 ? void 0 : _d.id,
                                        guildId: voiceChannel.guild_id
                                    });
                                }
                                RPC.subscribe("VOICE_CHANNEL_SELECT", function () { });
                                mainWindow === null || mainWindow === void 0 ? void 0 : mainWindow.webContents.send("RPC_CONNECT_SUCCESS");
                                connectionWindow === null || connectionWindow === void 0 ? void 0 : connectionWindow.webContents.send("RPC_IS_CONNECTED", true);
                                return [2 /*return*/];
                        }
                    });
                }); });
                retryCount = 0;
                attemptLogin = function () { return __awaiter(void 0, void 0, void 0, function () {
                    var error_1;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                _a.trys.push([0, 2, , 3]);
                                return [4 /*yield*/, RPC.login({
                                        clientId: "1212287206702583829",
                                        scopes: ["rpc", "rpc.voice.read"],
                                        accessToken: accessToken
                                    })];
                            case 1:
                                _a.sent();
                                RPCClient = RPC;
                                return [3 /*break*/, 3];
                            case 2:
                                error_1 = _a.sent();
                                if (retryCount < 5) {
                                    retryCount++;
                                    mainWindow === null || mainWindow === void 0 ? void 0 : mainWindow.webContents.send("RPC_CONNECT_ERROR", {
                                        message: "Discord Client \uC5F0\uACB0\uC5D0 \uC2E4\uD328\uD588\uB2E4\uB124\n5\uCD08 \uD6C4 \uB2E4\uC2DC \uC2DC\uB3C4\uD55C\uB2E4\uB124\n\uC2DC\uB3C4 \uD69F\uC218 : ".concat(retryCount, "/5"),
                                        error: error_1.message
                                    });
                                    setTimeout(attemptLogin, 5000);
                                }
                                else {
                                    new electron_1.Notification({
                                        title: "HEMIne",
                                        body: "Discord RPC 연결에 실패했어요!"
                                    }).show();
                                    electron_1.app.quit();
                                    return [2 /*return*/];
                                }
                                return [3 /*break*/, 3];
                            case 3: return [2 /*return*/];
                        }
                    });
                }); };
                return [4 /*yield*/, attemptLogin()];
            case 2:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
/**
 * @description Discord RPC 연결 해제
 */
ipc.on("RPC_DISCONNECT", function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        if (!RPCClient)
            return [2 /*return*/];
        RPCClient === null || RPCClient === void 0 ? void 0 : RPCClient.destroy();
        RPCClient = null;
        connectionWindow === null || connectionWindow === void 0 ? void 0 : connectionWindow.webContents.send("RPC_IS_CONNECTED", false);
        mainWindow === null || mainWindow === void 0 ? void 0 : mainWindow.webContents.send("RPC_DISCONNECTED");
        return [2 /*return*/];
    });
}); });
/**
 * @description 클라이언트 로그아웃
 */
ipc.on("APP_LOGOUT", function () { return __awaiter(void 0, void 0, void 0, function () {
    var Credentials, _i, Credentials_2, credential;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, keytar.findCredentials("discord")];
            case 1:
                Credentials = _a.sent();
                _i = 0, Credentials_2 = Credentials;
                _a.label = 2;
            case 2:
                if (!(_i < Credentials_2.length)) return [3 /*break*/, 5];
                credential = Credentials_2[_i];
                return [4 /*yield*/, keytar.deletePassword("discord", credential.account)];
            case 3:
                _a.sent();
                _a.label = 4;
            case 4:
                _i++;
                return [3 /*break*/, 2];
            case 5:
                new electron_1.Notification({
                    title: "HEMIne Authentication",
                    body: "로그아웃되었어요! 앱을 재시작해주세요!"
                }).show();
                electron_1.app.quit();
                return [2 /*return*/];
        }
    });
}); });
/**
 * @description HEMIne WS 연결
 */
ipc.on("WS_CONNECT", function () {
    socket.connect();
    socket.on("PLAYER_DATA", function (json) { return __awaiter(void 0, void 0, void 0, function () {
        var voiceChannel, startTime, endTime;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if ((json === null || json === void 0 ? void 0 : json.data) == null) {
                        RPCClient === null || RPCClient === void 0 ? void 0 : RPCClient.clearActivity();
                        mainWindow === null || mainWindow === void 0 ? void 0 : mainWindow.webContents.send("SONG_DATA", null);
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, (RPCClient === null || RPCClient === void 0 ? void 0 : RPCClient.getSelectedVoiceChannel())];
                case 1:
                    voiceChannel = _b.sent();
                    if (voiceChannel) {
                        console.log("음성채널 감지");
                        console.log(voiceChannel.voice_states);
                        if ((_a = voiceChannel.voice_states) === null || _a === void 0 ? void 0 : _a.find(function (v) { return v.user.id == "1212287206702583829"; })) {
                            startTime = new Date().getTime() - json.data.Player.current.position;
                            endTime = startTime + json.data.Player.current.length;
                            RPCClient === null || RPCClient === void 0 ? void 0 : RPCClient.setActivity({
                                details: json.data.Player.current.title,
                                state: json.data.Player.current.author,
                                largeImageKey: json.data.Player.current.thumbnail,
                                largeImageText: json.data.Player.isPaused ? "일시정지" : "듣는중",
                                smallImageKey: "https://cdn.discordapp.com/avatars/1212287206702583829/010e224a684ca1097d51ce9fd566fa94.png",
                                smallImageText: "햄이네 HEMIne",
                                startTimestamp: startTime,
                                endTimestamp: endTime
                            });
                            mainWindow === null || mainWindow === void 0 ? void 0 : mainWindow.webContents.send("SONG_DATA", json);
                        }
                        else {
                            RPCClient === null || RPCClient === void 0 ? void 0 : RPCClient.clearActivity();
                            mainWindow === null || mainWindow === void 0 ? void 0 : mainWindow.webContents.send("SONG_DATA", null);
                            return [2 /*return*/];
                        }
                    }
                    else {
                        RPCClient === null || RPCClient === void 0 ? void 0 : RPCClient.clearActivity();
                        mainWindow === null || mainWindow === void 0 ? void 0 : mainWindow.webContents.send("SONG_DATA", null);
                        return [2 /*return*/];
                    }
                    return [2 /*return*/];
            }
        });
    }); });
    socket.on("connect", function () {
        SocketClientId = socket.id;
        mainWindow === null || mainWindow === void 0 ? void 0 : mainWindow.webContents.send("WS_CONNECTED");
        new electron_1.Notification({
            title: "HEMIne",
            body: "HEMIne 서버와 연결되었어요!"
        }).show();
    });
    socket.on("disconnect", function () {
        mainWindow === null || mainWindow === void 0 ? void 0 : mainWindow.webContents.send("WS_DISCONNECTED");
        new electron_1.Notification({
            title: "HEMIne",
            body: "HEMIne 서버로부터 연결이 끊어졌습니다. 기능을 사용할 수 없습니다."
        }).show();
        electron_1.app.quit();
    });
    socket.on("connect_error", function () {
        mainWindow === null || mainWindow === void 0 ? void 0 : mainWindow.webContents.send("WS_DISCONNECTED");
        new electron_1.Notification({
            title: "HEMIne",
            body: "HEMIne 서버와 연결할 수 없습니다. 기능을 사용할 수 없습니다."
        }).show();
        electron_1.app.quit();
    });
    socket.on("connect_timeout", function () {
        mainWindow === null || mainWindow === void 0 ? void 0 : mainWindow.webContents.send("WS_DISCONNECTED");
        new electron_1.Notification({
            title: "HEMIne",
            body: "HEMIne 서버 연결이 시간 초과되었습니다. 다시 시도해주세요."
        }).show();
    });
});
/**
 * @description HEMIne WS 연결 여부
 */
ipc.on("WS_IS_CONNECTED", function () {
    if (!SocketClientId) {
        connectionWindow === null || connectionWindow === void 0 ? void 0 : connectionWindow.webContents.send("WS_IS_CONNECTED", false);
        return;
    }
    else {
        connectionWindow === null || connectionWindow === void 0 ? void 0 : connectionWindow.webContents.send("WS_IS_CONNECTED", true);
    }
});
function EncodeBase64(data) {
    return Buffer.from(data).toString("base64");
}
function Xor(str, key) {
    var result = "";
    for (var i = 0; i < str.length; i++) {
        result += String.fromCharCode(str.charCodeAt(i) ^ key.charCodeAt(i % key.length));
    }
    return result;
}
function Crypto(string) {
    var encrypted = [];
    var firstBase64 = EncodeBase64(string);
    var Second_Xor = Xor(firstBase64, "Remuring");
    var EecodeData64 = EncodeBase64(Second_Xor);
    for (var i = 0; i < 10; i++) {
        EecodeData64 = EncodeBase64(EecodeData64);
        encrypted.push(EecodeData64);
    }
    var returnData = encrypted[encrypted.length - 1];
    return "Remuring{'".concat(returnData, "'}");
}
function generateKey() {
    var date = new Date();
    var string = "".concat(date.getFullYear(), "-").concat(date.getMonth() + 1, "-").concat(date.getDate());
    var newDate = new Date(string);
    var key = newDate.getTime().toString();
    return key;
}
ipc.on("PAGE_CONNECTION_CLOSE", function () {
    connectionWindow === null || connectionWindow === void 0 ? void 0 : connectionWindow.hide();
});
electron_1.app.on("ready", function () {
    createMainWindow();
});
electron_1.app.on("window-all-closed", function () {
    electron_1.app.quit();
});
electron_1.app.on("activate", function () {
    if (mainWindow === null) {
        createMainWindow();
    }
});
