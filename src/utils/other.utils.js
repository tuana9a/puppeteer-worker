const fs = require("fs");

module.exports.ensureDirExists = (dir) => {
  if (!dir) return;
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
};
