const options = require("./puppeteer-launch-options");

class Config {
  constructor() {
    this.tmpDir = "./.tmp/";

    this.logDest = "cs";
    this.logDir = "./logs/";

    this.secret = undefined;
    this.accessToken = undefined;
    this.maxTry = 10;

    this.jobDir = "./.tmp/";
    this.jobImportPrefix = "";

    this.controlPlaneUrl = undefined;
    this.repeatPollJobsAfter = 5000;

    this.puppeteerMode = "default";
    this.puppeteerLaunchOption = options.get(this.puppeteerMode);
  }

  toObj() {
    return {
      ...this,
    };
  }
}

module.exports = Config;
