const fs = require("fs");

const Config = require("./config");
const options = require("./puppeteer-launch-options");

function updateFromObject(source, object) {
  const config = source || new Config();

  if (object) {
    for (const key of Object.keys(config)) {
      if (object[key]) {
        config[key] = object[key];
      }
    }
    config.maxTry = parseInt(config.maxTry);
    config.repeatPollJobsAfter = parseInt(config.repeatPollJobsAfter);
    config.puppeteerLaunchOption = options.get(config.puppeteerMode);
  }

  return config;
}

function updateFromFile(source, filepath) {
  const data = fs.readFileSync(filepath, { flag: "r", encoding: "utf-8" });
  const object = JSON.parse(data);
  return updateFromObject(source, object);
}

module.exports = {
  updateFromObject: updateFromObject,
  updateFromFile: updateFromFile,
};
