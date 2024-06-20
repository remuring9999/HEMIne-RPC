const fs = require("fs");
const path = require("path");
const { ipcRenderer } = require("electron");
const ipc = ipcRenderer;

const btnMin = document.getElementById("min");
const btnClose = document.getElementById("close");

btnMin.addEventListener("click", () => {
  ipc.send("minimizeApp");
});

btnClose.addEventListener("click", () => {
  ipc.send("closeApp");
});

const css = fs.readFileSync(path.resolve(__dirname, "process.css"), "utf8");
window.addEventListener("DOMContentLoaded", () => {
  const style = document.createElement("style");
  style.textContent = css;
  document.head.append(style);
});
