# puppeteer-worker

a simple [puppeteer](https://github.com/puppeteer/puppeteer) worker that runs [job](https://github.com/tuana9a/puppeteer-worker-job-builder)

# Installing

Using npm:

```bash
npm install puppeteer-worker
```

# Basic Usage

For `config.jobDir` see [TROUBLESHOOTING](./TROUBLESHOOTING.md)

```js
const { launch } = require("puppeteer-worker");

const workerController = launch({
  // workerType: "http", // "http" or "rabbit"
  // tmpDir: "./tmp/", // tmp dir for storing things
  // logDest: "cs", // log destinantion can be file or console: "fs", "cs"
  // logDir: "./logs/", log directory
  // accessToken: "tuana9a", // control plane access token
  // maxTry: 10,
  // jobDir: "./jobs/", // job dir default is equal to tmpDir
  // httpWorkerPullConfigUrl: "http://localhost:8080/api/jobs",
  // puppeteerMode: "headless", // "default", "headless", "visible", "docker"
  // rabbitmqConnectionString: "amqp://localhost:5672"
});
```

start with bash

```bash
./node_modules/.bin/puppeteer-worker
```

see help for details

```bash
./node_modules/.bin/puppeteer-worker --help
```
