const path = require("path");

const rootFolder = path.resolve(__dirname, "..");
const distFolder = path.resolve(rootFolder, "dist");
const srcFolder = path.resolve(rootFolder, "src");
const staticFolder = path.resolve(rootFolder, "static");
const htmlFile = path.resolve(staticFolder, "index.html");

module.exports = {
  rootFolder,
  distFolder,
  srcFolder,
  staticFolder,
  htmlFile,
};
