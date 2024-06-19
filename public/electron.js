"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var path = require("path");
var electron_1 = require("electron");
var isDev = require("electron-is-dev");
var keytar = require("keytar");
var BASE_URL = "http://localhost:3000";
var mainWindow;
var childWindow;
function createMainWindow() {
    mainWindow = new electron_1.BrowserWindow({
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
            childWindow === null || childWindow === void 0 ? void 0 : childWindow.loadURL("http://localhost:3000/login");
            childWindow === null || childWindow === void 0 ? void 0 : childWindow.once("ready-to-show", function () {
                childWindow === null || childWindow === void 0 ? void 0 : childWindow.show();
            });
        }
    });
}
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
