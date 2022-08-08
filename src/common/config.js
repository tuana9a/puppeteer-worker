/* eslint-disable global-require */
/* eslint-disable import/no-dynamic-require */
/* eslint-disable array-bracket-spacing */
const fs = require("fs");

const ppLaunchOptions = new Map();
ppLaunchOptions.set("default", {
  // default run in headless mode
  slowMo: 10,
  defaultViewport: {
    width: 1920,
    height: 1080,
  },
});
ppLaunchOptions.set("headless", {
  slowMo: 10,
  defaultViewport: {
    width: 1920,
    height: 1080,
  },
});
ppLaunchOptions.set("visible", {
  headless: false,
  slowMo: 10,
  defaultViewport: null,
});
ppLaunchOptions.set("docker", {
  slowMo: 10,
  defaultViewport: {
    width: 1920,
    height: 1080,
  },
  executablePath: "google-chrome-stable",
  args: ["--no-sandbox", "--disable-setuid-sandbox"],
});

class Config {
  constructor(data) {
    if (data) {
      for (const [key, value] of Object.entries(data)) {
        this[key] = value;
      }
    }
  }

  loadFromEnv(env) {
    // start assign value
    this.tmp = {};
    this.tmp.dir = "./tmp/";

    // config logging
    this.log = {};
    this.log.dest = env.LOG_DESTINATION || "cs";
    this.log.dir = "./logs/";

    // security
    this.security = {};
    this.security.secret = env.SECRET || "";

    // poll jobs
    this.repeatPollJobsAfter = env.REPEAT_POLL_JOBS_AFFER || 3000; // default 3s repeat process
    this.repeatPollJobsAfter = parseInt(this.repeatPollJobsAfter);
    this.httpPollJobsUrl = env.HTTP_POLL_JOBS_URL;
    this.httpPollJobsAccessToken = env.HTTP_POLL_JOBS_ACCESS_TOKEN;
    this.httpSubmitResultUrl = env.HTTP_SUBMIT_RESULT_URL;

    this.maxTryCount = env.MAX_TRY_COUNT || 10;
    this.maxTryCount = parseInt(this.maxTryCount);

    this.jobMappers = new Map();
    this.jobConfig = env.JOB_CONF || env.JOB_CONFIG;

    // puppeteer
    this.puppeteer = {};
    const defaultLaunchOption = ppLaunchOptions.get("default");
    const launchOption = ppLaunchOptions.get(env.PUPPETEER_MODE);
    this.puppeteer.launchOption = launchOption || defaultLaunchOption;
  }

  loadJobConfig() {
    const config = JSON.parse(fs.readFileSync(this.jobConfig, { flag: "r" }));
    const mappers = this.jobMappers;
    const configMappers = config.mappers;
    for (const key of Object.keys(configMappers)) {
      const modulePath = configMappers[key];
      const module = require(modulePath);
      for (const subKey of Object.keys(module)) {
        mappers.set(`${key}/${subKey}`, module[subKey]);
      }
    }
  }

  getJobMappers() {
    return this.jobMappers;
  }
}

module.exports = Config;
