# puppeteer-worker

a simple [puppeteer](https://github.com/puppeteer/puppeteer)-worker

# Installing

Using npm:

```bash
npm install puppeteer-worker
```

# Example

basic

```js
const { PuppeteerWorker } = require("puppeteer-worker");

new PuppeteerWorker({
  // tmpDir: "./.tmp/",
  // logDest: "fs",
  // logDir: "./logs/",
  // secret: "yoursecret,

  // jobDir: "./.tmp/",
  // jobImportPrefix: "../../",
  // jobBaseUrl: "http://localhost:8080/api/jobs",
  // jobAccessToken: "yoursecret",

  // jobPollUrl: "http://localhost:8080/api/jobs/poll",
  // jobPollRepeatAfter: 5_000, // 5 seconds

  // jobInfoUurl: "http://localhost:8080/api/jobs/info",
  // jobSubmitUrl: "http://localhost:8080/api/jobs/result",
  // jobMaxTryCount: 10,
  // puppeteerMode: "visible",
}).start();
```
