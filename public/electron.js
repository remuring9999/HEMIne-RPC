"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var path = require("path");
var electron_1 = require("electron");
var isDev = require("electron-is-dev");
var keytar = require("keytar");
var url = require("url");
var Auth_1 = require("../src/Utils/Auth");
var BASE_URL = "http://localhost:3000";
var ipc = electron_1.ipcMain;
var mainWindow;
var childWindow;
function createMainWindow() {
    mainWindow = new electron_1.BrowserWindow({
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
    mainWindow.once("ready-to-show", function () {
        mainWindow === null || mainWindow === void 0 ? void 0 : mainWindow.show();
    });
    if (process.platform == "win32") {
        electron_1.app.setAppUserModelId("HEMIne");
    }
    if (isDev) {
        mainWindow.loadURL(BASE_URL);
        mainWindow.webContents.openDevTools();
    }
    else {
        mainWindow.loadFile(path.join(__dirname, "../build/index.html"));
    }
    mainWindow.on("closed", function () {
        mainWindow = null;
    });
    keytar.findCredentials("discord").then(function (credentials) {
        if (credentials.length === 0) {
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
        }
    });
}
ipc.on("minimizeApp", function () {
    if (childWindow) {
        childWindow === null || childWindow === void 0 ? void 0 : childWindow.minimize();
        return;
    }
    mainWindow === null || mainWindow === void 0 ? void 0 : mainWindow.minimize();
});
ipc.on("maximizeApp", function () {
    if (childWindow) {
        if (childWindow === null || childWindow === void 0 ? void 0 : childWindow.isMaximized()) {
            childWindow === null || childWindow === void 0 ? void 0 : childWindow.restore();
        }
        else {
            childWindow === null || childWindow === void 0 ? void 0 : childWindow.maximize();
        }
        return;
    }
    if (mainWindow === null || mainWindow === void 0 ? void 0 : mainWindow.isMaximized()) {
        mainWindow === null || mainWindow === void 0 ? void 0 : mainWindow.restore();
    }
    else {
        mainWindow === null || mainWindow === void 0 ? void 0 : mainWindow.maximize();
    }
});
ipc.on("closeApp", function () {
    if (childWindow) {
        childWindow === null || childWindow === void 0 ? void 0 : childWindow.close();
        childWindow = null;
        return;
    }
    mainWindow === null || mainWindow === void 0 ? void 0 : mainWindow.close();
    mainWindow = null;
});
ipc.on("login", function () {
    if (childWindow) {
        var auth = new Auth_1.AuthClient();
        childWindow.loadURL(auth.getAuthURL());
    }
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
