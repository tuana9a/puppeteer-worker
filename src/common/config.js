/* eslint-disable array-bracket-spacing */

const ConfigTemplate = require("./config-template");
const options = require("./puppeteer-launch-options");

class Config {
  static _ignoreDeps = ["tmp", "log", "security", "job", "puppeteer"];

  constructor(object) {
    this.tmp = {};
    this.tmp.dir = "./.tmp/";

    this.log = {};
    this.log.dest = "cs";
    this.log.dir = "./logs/";

    this.security = {};
    this.security.secret = "";

    this.job = {};
    this.job.dir = "./.tmp/";
    this.job.import = {};
    this.job.import.prefix = "../../";
    this.job.baseUrl = "";
    this.job.accessToken = "";
    this.job.poll = {};
    this.job.poll.url = `${this.job.baseUrl}/poll`;
    this.job.info = {};
    this.job.info.url = `${this.job.baseUrl}/info`;
    this.job.poll.repeatAfter = 3000;
    this.job.submit = {};
    this.job.submit.url = `${this.job.baseUrl}/result`;
    this.job.maxTry = {};
    this.job.maxTry.count = 10;

    // puppeteer
    this.puppeteer = {};
    this.puppeteer.launchOption = {};

    // load it
    this.loadFromObject(object);
  }

  loadFromEnv(env) {
    this.tmp.dir = env.TMP_DIR || "./.tmp/";

    this.log.dest = env.LOG_DESTINATION || "cs";
    this.log.dir = env.LOG_DIR || "./logs/";

    this.security.secret = env.SECRET || "";

    this.job.dir = env.JOB_DIR || this.tmp.dir || "./.tmp/";
    this.job.import.prefix = env.JOB_IMPORT_PREFIX || "../../";
    this.job.baseUrl = env.JOB_BASE_URL;
    this.job.accessToken = env.JOB_ACCESS_TOKEN;
    this.job.poll.url = env.JOB_POLL_URL || `${this.job.baseUrl}/poll`;
    this.job.info.url = env.JOB_INFO_URL || `${this.job.baseUrl}/info`;
    this.job.poll.repeatAfter = parseInt(env.JOB_POLL_REPEAT_AFFER || 3000); // default 3s repeat process
    this.job.submit.url = env.JOB_SUBMIT_URL || `${this.job.baseUrl}/result`;
    this.job.maxTry.count = parseInt(env.JOB_MAX_TRY_COUNT || 10);

    this.puppeteer.launchOption = options.get(env.PUPPETEER_MODE);
  }

  loadFromObject(object = ConfigTemplate.TEMPLATE) {
    if (!object) {
      return;
    }

    this.tmp.dir = object.tmpDir || "./.tmp/";

    this.log.dest = object.logDest || object.logDestination || "cs";
    this.log.dir = object.logDir || "./logs/";

    this.security.secret = object.secret || "";

    this.job.dir = object.jobDir || this.tmp.dir || "./.tmp/";
    this.job.import.prefix = object.jobImportPregix || "../../";
    this.job.baseUrl = object.jobBaseUrl;
    this.job.accessToken = object.jobAccessToken;
    this.job.poll.url = object.jobPollUrl || `${this.job.baseUrl}/poll`;
    this.job.info.url = object.jobInfoUrl || `${this.job.baseUrl}/info`;
    this.job.poll.repeatAfter = parseInt(object.jobPollRepeatAfter || 3000); // default 3s repeat process
    this.job.submit.url = object.jobSubmitUrl || `${this.job.baseUrl}/result`;
    this.job.maxTry.count = parseInt(object.jobMaxTryCount || 10);

    this.puppeteer.launchOption = options.get(object.puppeteerMode);
  }
}

module.exports = Config;
