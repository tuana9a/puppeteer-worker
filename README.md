# puppeteer-worker

a simple [puppeteer](https://github.com/puppeteer/puppeteer) worker will poll jobs every seconds from server to run then submit result back

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
  // tmpDir: "./.tmp/", // tmp dir for storing things
  // logDest: "cs", // log destinantion can be file or console: "fs", "cs"
  // logDir: "./logs/", log directory
  // secret: "tuana9a", // worker secret
  // accessToken: "tuana9a", // control plane access token
  // maxTry: 10,
  // jobDir: "./.tmp/", // job dir default is equal to tmpDir
  // jobImportPrefix: "../../", // relative path from job-template.db.js
  // controlPlaneUrl: "http://localhost:8080/api/jobs",
  // repeatPollJobsAfter: 5000, // 5 seconds
  // puppeteerMode: "headless", // "default", "headless", "visible", "docker"
}).start();
```

start with bash

```bash
./node_modules/.bin/puppeteer-worker
```

see help for details

```bash
./node_modules/.bin/puppeteer-worker --help
```

## **Note**

for config.jobImportPrefix see [troubleshooting](./troubleshooting.md#configjobimportprefix-explaination)
