# puppeteer-worker

a simple [puppeteer](https://github.com/puppeteer/puppeteer)-worker will poll jobs every seconds from server to run then submit result back

# Installing

Using npm:

```bash
npm install puppeteer-worker
```

# Example

basic

```js
const { PuppeteerWorker } = require("puppeteer-worker");

new PuppeteerWorker().start({
  // tmpDir: "./.tmp/", // tmp dir for storing things like jobs files
  // logDest: "cs", // "fs" or "cs"
  // logDir: "./logs/",
  // secret: "yoursecret",
  // jobDir: "./.tmp/",
  // jobImportPrefix: "../../", // this is complicated, the relative path from job-template.db.js
  // jobBaseUrl: "http://localhost:8080/api/jobs",
  // jobAccessToken: "tuana9a@gmail.com",
  // jobPollUrl: "http://localhost:8080/api/jobs/poll",
  // jobPollRepeatAfter: 5_000, // 5 seconds
  // jobInfoUrl: "http://localhost:8080/api/jobs/info",
  // jobSubmitUrl: "http://localhost:8080/api/jobs/result",
  // jobMaxTryCount: 10,
  // puppeteerMode: "headless", // "headless" or "visible"
});
```
