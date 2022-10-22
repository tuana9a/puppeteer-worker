const fs = require("fs");

module.exports.ensureDirExists = (dir) => {
  if (!dir) return;
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
};

module.exports.toPrettyErr = (err) => ({
  name: err.name,
  message: err.message,
  stack: err.stack.split("\n"),
});
