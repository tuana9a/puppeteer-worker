/* eslint-disable array-bracket-spacing */

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
    this.tmp.dir = env.TMP_DIR || "./.tmp/";

    // config logging
    this.log = {};
    this.log.dest = env.LOG_DESTINATION || "cs";
    this.log.dir = env.LOG_DIR || "./logs/";

    // security
    this.security = {};
    this.security.secret = env.SECRET || "";

    // poll jobs
    this.job = {};
    this.job.dir = env.JOB_DIR || this.tmp.dir || "./.tmp/";
    this.job.import = {};
    this.job.import.prefix = env.JOB_IMPORT_PREFIX || "../../";
    this.job.baseUrl = env.JOB_BASE_URL;
    this.job.accessToken = env.JOB_ACCESS_TOKEN;
    this.job.poll = {};
    this.job.poll.url = env.JOB_POLL_URL || `${this.job.baseUrl}/poll`;
    this.job.info = {};
    this.job.info.url = env.JOB_INFO_URL || `${this.job.baseUrl}/info`;
    this.job.poll.repeatAfter = parseInt(env.JOB_REPEAT_POLL_AFFER || 3000); // default 3s repeat process
    this.job.submit = {};
    this.job.submit.url = env.JOB_SUBMIT_URL || `${this.job.baseUrl}/result`;
    this.job.maxTry = {};
    this.job.maxTry.count = parseInt(env.JOB_MAX_TRY_COUNT || 10);

    // puppeteer
    this.puppeteer = {};
    const defaultLaunchOption = ppLaunchOptions.get("default");
    const launchOption = ppLaunchOptions.get(env.PUPPETEER_MODE);
    this.puppeteer.launchOption = launchOption || defaultLaunchOption;
  }
}

module.exports = Config;
