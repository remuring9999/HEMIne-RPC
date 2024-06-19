const fs = require("fs");
const path = require("path");

const css = fs.readFileSync(path.resolve(__dirname, "process.css"), "utf8");
window.addEventListener("DOMContentLoaded", () => {
  const style = document.createElement("style");
  style.textContent = css;
  document.head.append(style);
});
