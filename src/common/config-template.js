const defaultConfig = {
  tmpDir: "./.tmp/",
  logDest: "cs",
  logDir: "./logs/",
  secret: "yoursecret",

  jobDir: "./.tmp/",
  jobImportPrefix: "../../",
  jobBaseUrl: "http://localhost:8080/api/jobs",
  jobAccessToken: "yoursecret",

  jobPollUrl: "http://localhost:8080/api/jobs/poll",
  jobPollRepeatAfter: 5000,

  jobInfoUrl: "http://localhost:8080/api/jobs/info",
  jobSubmitUrl: "http://localhost:8080/api/jobs/result",
  jobMaxTryCount: 10,

  puppeteerMode: "headless",
};

module.exports = defaultConfig;
