const nanioc = require("@tuana9a/nanioc");

const Loop = require("./common/loop");
const JobRunner = require("./controllers/job-runner");
const Logger = require("./common/logger");
const DateTimeUtils = require("./common/datetime.utils");
const JobValidation = require("./common/job.validatation");
const Config = require("./common/config");
const PuppeteerClient = require("./controllers/puppeteer-client");
const HttpPollJobsService = require("./controllers/http-poll-jobs.service");
const JobTemplateDb = require("./controllers/job-template.db");
const PuppeteerWorker = require("./puppeteer-worker");

function launch(_config) {
  const ioc = new nanioc.IOCContainer({
    ignoreMissingBean: true,
    getter: true,
  });
  ioc.addBean(Logger, "logger");
  ioc.addBean(DateTimeUtils, "datetimeUtils");
  ioc.addBean(JobValidation, "jobValidation");
  ioc.addBean(Config, "config");
  ioc.addBean(PuppeteerClient, "puppeteerClient");
  ioc.addBean(JobRunner, "jobRunner");
  ioc.addBean(HttpPollJobsService, "httpPollJobsService");
  ioc.addBean(JobTemplateDb, "jobTemplateDb");
  ioc.addBean(Loop, "loop");
  ioc.addBean(PuppeteerWorker, "puppeteerWorker");
  ioc.di();
  const puppeteerWorker = ioc.getBean("puppeteerWorker").getInstance();
  puppeteerWorker.loadConfig(_config);
  return puppeteerWorker;
}

module.exports.PuppeteerWorker = PuppeteerWorker;
module.exports.launch = launch;
