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
Object.defineProperty(exports, "__esModule", { value: true });
var path = require("path");
var electron_1 = require("electron");
var isDev = require("electron-is-dev");
var keytar = require("keytar");
var url = require("url");
var Auth_1 = require("./Auth");
var BASE_URL = "http://localhost:3000";
var ipc = electron_1.ipcMain;
var mainWindow;
var childWindow;
var connectionWindow;
var loadingWindow;
var connectionWindowEnabled = false;
function createMainWindow() {
    var _this = this;
    loadingWindow = new electron_1.BrowserWindow({
        width: 400,
        height: 300,
        frame: false,
        transparent: true,
        alwaysOnTop: true,
    });
    loadingWindow.loadFile(path.join(__dirname, "preload.html"));
    mainWindow = new electron_1.BrowserWindow({
        show: false,
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
            preload: path.join(__dirname, "preload.js"),
        },
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
            preload: path.join(__dirname, "preload.js"),
        },
    });
    mainWindow.once("ready-to-show", function () {
        loadingWindow === null || loadingWindow === void 0 ? void 0 : loadingWindow.close();
        mainWindow === null || mainWindow === void 0 ? void 0 : mainWindow.show();
    });
    mainWindow.on("closed", function () {
        mainWindow = null;
    });
    if (process.platform == "win32") {
        electron_1.app.setAppUserModelId("HEMIne");
    }
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
                    new electron_1.Notification({
                        title: "HEMIne Authentication",
                        body: "Discord에 로그인되었어요!",
                    }).show();
                    mainWindow === null || mainWindow === void 0 ? void 0 : mainWindow.webContents.send("login", userData);
                    return [2 /*return*/];
                case 9: return [2 /*return*/];
            }
        });
    }); });
}
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
                        new electron_1.Notification({
                            title: "HEMIne Authentication",
                            body: "Discord 로그인에 성공했어요!",
                        }).show();
                        mainWindow === null || mainWindow === void 0 ? void 0 : mainWindow.webContents.send("login", user);
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
        body: "Discord 로그인에 실패했어요! 다시 시도해주세요!",
    }).show();
    if (isDev) {
        childWindow === null || childWindow === void 0 ? void 0 : childWindow.loadURL(BASE_URL + "#login");
    }
    else {
        childWindow === null || childWindow === void 0 ? void 0 : childWindow.loadURL(url.format({
            pathname: path.join(__dirname, "../build/index.html"),
            protocol: "file:",
            slashes: true,
            hash: "/login",
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
            hash: "/login",
        }));
    }
    new electron_1.Notification({
        title: "HEMIne Authentication",
        body: "Discord에 로그인되지 않았어요! 로그인을 진행해주세요!",
    }).show();
    childWindow === null || childWindow === void 0 ? void 0 : childWindow.once("ready-to-show", function () {
        childWindow === null || childWindow === void 0 ? void 0 : childWindow.show();
    });
    return;
}
ipc.on("minimizeApp", function () {
    mainWindow === null || mainWindow === void 0 ? void 0 : mainWindow.minimize();
});
ipc.on("maximizeApp", function () {
    if (mainWindow === null || mainWindow === void 0 ? void 0 : mainWindow.isMaximized()) {
        mainWindow === null || mainWindow === void 0 ? void 0 : mainWindow.restore();
    }
    else {
        mainWindow === null || mainWindow === void 0 ? void 0 : mainWindow.maximize();
    }
});
ipc.on("closeApp", function () {
    mainWindow === null || mainWindow === void 0 ? void 0 : mainWindow.close();
});
ipc.on("login", function () {
    if (childWindow) {
        childWindow.setSize(850, 950);
        childWindow.center();
        var auth = new Auth_1.AuthClient(receiveTokens, "1212287206702583829", "7plMXfI4PuvxMG-EVxZx7fyyJTZ1eH5i", "http://localhost:205/auth/discord/callback", 205);
        childWindow.loadURL(auth.getAuthURL());
    }
    else {
        return;
    }
});
ipc.on("openConnection", function (_event, user) {
    if (connectionWindowEnabled) {
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
            hash: "/connection",
        }));
    }
    connectionWindow === null || connectionWindow === void 0 ? void 0 : connectionWindow.once("ready-to-show", function () {
        connectionWindow === null || connectionWindow === void 0 ? void 0 : connectionWindow.show();
        connectionWindow === null || connectionWindow === void 0 ? void 0 : connectionWindow.webContents.send("userData", user);
        connectionWindowEnabled = true;
    });
});
ipc.on("CloseConnection", function () {
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
