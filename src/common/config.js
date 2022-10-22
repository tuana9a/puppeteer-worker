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
    this.jobImportPrefix = undefined;

    this.httpWorkerPullConfigUrl = undefined;
    this.repeatPollJobsAfter = undefined;

    this.rabbitmqConnectionString = undefined;

    this.puppeteerMode = undefined;
    this.puppeteerLaunchOption = undefined;
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
