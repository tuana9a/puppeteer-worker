/* eslint-disable no-param-reassign */

const fs = require("fs");

const options = require("../common/puppeteer-launch-options");

module.exports.updateFromObject = (source, object) => {
  const config = source;

  if (object) {
    for (const key of Object.keys(config)) {
      const newValue = object[key];
      if (newValue !== undefined && newValue !== null) {
        config[key] = newValue;
      }
    }
    config.maxTry = parseInt(config.maxTry);
    config.repeatPollJobsAfter = parseInt(config.repeatPollJobsAfter);
    config.puppeteerLaunchOption = options.get(config.puppeteerMode);
  }

  return config;
};

module.exports.updateFromFile = (source, filepath) => {
  const data = fs.readFileSync(filepath, { flag: "r", encoding: "utf-8" });
  const object = JSON.parse(data);
  const config = source;

  if (object) {
    for (const key of Object.keys(config)) {
      const newValue = object[key];
      if (newValue !== undefined && newValue !== null) {
        config[key] = newValue;
      }
    }
    config.maxTry = parseInt(config.maxTry);
    config.repeatPollJobsAfter = parseInt(config.repeatPollJobsAfter);
    config.puppeteerLaunchOption = options.get(config.puppeteerMode);
  }

  return config;
};

module.exports.setDefaultIfFalsy = (config) => {
  config.workerId = config.workerId || process.env.WORKER_ID || `worker${Date.now()}`;
  config.workerType = config.workerType || process.env.WORKER_TYPE || "http";
  config.rabbitmqConnectionString = config.rabbitmqConnectionString || process.env.RABBITMQ_CONNECTION_STRING;
  config.tmpDir = config.tmpDir || "./tmp/";
  config.jobDir = config.jobDir || process.env.JOB_DIR || process.env.JOBS_DIR || "./jobs/";
  config.jobImportPrefix = config.jobImportPrefix || "../../";
  config.logDir = config.logDir || "./logs/";
  config.logDest = config.logDest || "cs";
  config.maxTry = parseInt(config.maxTry) || 10;
  config.repeatPollJobsAfter = parseInt(config.repeatPollJobsAfter) || 5000;
  config.puppeteerMode = config.puppeteerMode || process.env.PUPPETEER_MODE || "default";
  config.puppeteerLaunchOption = options.get(config.puppeteerMode);
};
