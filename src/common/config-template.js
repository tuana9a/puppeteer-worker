class ConfigTemplate {
  static TEMPLATE = {
    tmpDir: "./.tmp/",
    logDest: "fs",
    logDir: "./logs/",
    secret: "yoursecret",

    jobDir: "./.tmp/",
    jobImportPrefix: "../../",
    jobBaseUrl: "http://localhost:8080/api/jobs",
    jobAccessToken: "yoursecret",

    jobPollUrl: "http://localhost:8080/api/jobs/poll",
    jobPollRepeatAfter: 5000,

    jobInfoUurl: "http://localhost:8080/api/jobs/info",
    jobSubmitUrl: "http://localhost:8080/api/jobs/result",
    jobMaxTryCount: 10,

    puppeteerMode: "headless",
  };
}

module.exports = ConfigTemplate;
