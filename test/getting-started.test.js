const { PuppeteerWorker } = require("../src");

new PuppeteerWorker().start({
  tmpDir: "./.tmp/", // tmp dir for storing things like jobs files
  logDest: "cs", // "fs" or "cs"
  logDir: "./logs/",
  secret: "yoursecret",
  jobDir: "./.tmp/",
  jobImportPrefix: "../../", // this is complicated, the relative path from job-template.db.js
  jobBaseUrl: "http://localhost:8080/api/jobs",
  jobAccessToken: "yoursecret",
  jobPollUrl: "http://localhost:8080/api/jobs/poll",
  jobPollRepeatAfter: 5_000, // 5 seconds
  jobInfoUrl: "http://localhost:8080/api/jobs/info",
  jobSubmitUrl: "http://localhost:8080/api/jobs/result",
  jobMaxTryCount: 10,
  puppeteerMode: "headless", // "headless" or "visible"
});
