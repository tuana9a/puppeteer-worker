# puppeteer-worker

a simple [puppeteer](https://github.com/puppeteer/puppeteer) worker run automation task on web

# Installing

Using npm:

```bash
npm install puppeteer-worker
```

# Basic Usage

```js
const { launch } = require("puppeteer-worker");

const workerController = launch({
  // tmpDir: "./tmp/", // tmp dir for storing things
  // logDest: "cs", // log destinantion can be file or console: "fs", "cs"
  // logDir: "./logs/", log directory
  // secret: "tuana9a", // worker secret
  // accessToken: "tuana9a", // control plane access token
  // maxTry: 10,
  // jobDir: "./jobs/", // job dir default is equal to tmpDir
  // jobImportPrefix: "../../", // relative path from job-template.db.js
  // httpWorkerPullConfigUrl: "http://localhost:8080/api/jobs",
  // repeatPollJobsAfter: 5000, // 5 seconds
  // puppeteerMode: "headless", // "default", "headless", "visible", "docker"
});

workerController.http().start();
```

start with bash

```bash
./node_modules/.bin/puppeteer-worker
```

see help for details

```bash
./node_modules/.bin/puppeteer-worker --help
```

# **Related**

For `config.jobImportPrefix` see [troubleshooting](./troubleshooting.md#configjobimportprefix-explaination)

[puppeteer-worker-job-builder](https://github.com/tuana9a/puppeteer-worker-job-builder)
