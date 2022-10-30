const fs = require("fs");

const options = require("./PuppeteerLaunchOptions");

class Config {
  constructor() {
    this.configFile = undefined;

    this.workerId = undefined;
    this.workerType = undefined;
    this.tmpDir = undefined;

    this.logDest = undefined;
    this.logDir = undefined;

    this.secret = undefined;
    this.accessToken = undefined;
    this.maxTry = undefined;

    this.jobDir = undefined;
    this.scheduleDir = undefined;

    this.httpWorkerPullConfigUrl = undefined;

    this.rabbitmqConnectionString = undefined;

    this.puppeteerMode = undefined;
    this.puppeteerLaunchOption = undefined;
  }

  toSimpleObject() {
    return {
      ...this,
    };
  }

  toString() {
    const output = ["Config: "];
    for (const key of Object.keys(this)) {
      const value = this[key];
      output.push(`${key} = ${JSON.stringify(value, null, 2)}`);
    }
    return output.join("\n");
  }

  updateFromObject(object) {
    if (object) {
      for (const key of Object.keys(this)) {
        const newValue = object[key];
        if (newValue !== undefined && newValue !== null) {
          this[key] = newValue;
        }
      }
      this.maxTry = parseInt(this.maxTry);
      this.puppeteerLaunchOption = options.get(this.puppeteerMode);
    }
    return this;
  }

  updateFromFile(filepath) {
    const data = fs.readFileSync(filepath, { flag: "r", encoding: "utf-8" });
    const object = JSON.parse(data);
    this.updateFromObject(object);
    return this;
  }

  setDefaultIfFalsy() {
    this.workerId = this.workerId || process.env.WORKER_ID || `worker${Date.now()}`;
    this.workerType = this.workerType || process.env.WORKER_TYPE || "http";
    this.rabbitmqConnectionString = this.rabbitmqConnectionString || process.env.RABBITMQ_CONNECTION_STRING;
    this.tmpDir = this.tmpDir || "./tmp/";
    this.jobDir = this.jobDir || process.env.JOB_DIR || process.env.JOBS_DIR || "./jobs/";
    this.scheduleDir = this.scheduleDir || process.env.SCHEDULE_DIR || "./schedules/";
    this.logDir = this.logDir || "./logs/";
    this.logDest = this.logDest || "cs";
    this.maxTry = parseInt(this.maxTry) || 10;
    this.puppeteerMode = this.puppeteerMode || process.env.PUPPETEER_MODE || "default";
    this.puppeteerLaunchOption = options.get(this.puppeteerMode);
    return this;
  }
}

const config = new Config();

module.exports = config;
