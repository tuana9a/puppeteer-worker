const options = require("./puppeteer-launch-options");

class Config {
  constructor() {
    this.workerId = undefined;
    this.workerType = "http";
    this.tmpDir = "./tmp/";

    this.logDest = "cs";
    this.logDir = "./logs/";

    this.secret = undefined;
    this.accessToken = undefined;
    this.maxTry = 10;

    this.jobDir = "./jobs/";
    this.jobImportPrefix = "";

    this.httpWorkerPullConfigUrl = undefined;
    this.repeatPollJobsAfter = 5000;

    this.rabbitmqConnectionString = undefined;

    this.puppeteerMode = "default";
    this.puppeteerLaunchOption = options.get(this.puppeteerMode);
  }

  toObj() {
    return {
      ...this,
    };
  }

  toString() {
    const output = ["Config: "];
    for (const key of Object.keys(this)) {
      const value = this[key];
      output.push(`${key}=${JSON.stringify(value, null, 2)}`);
    }
    return output.join("\n");
  }
}

module.exports = Config;
