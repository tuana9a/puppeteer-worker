const nanioc = require("@tuana9a/nanioc");

const Loop = require("./common/loop");
const JobRunner = require("./controllers/job-runner");
const Logger = require("./common/logger");
const DateTimeUtils = require("./utils/datetime.utils");
const JobValidation = require("./common/job.validatation");
const Config = require("./common/config");
const PuppeteerClient = require("./controllers/puppeteer-client");
const JobTemplateDb = require("./controllers/job-template.db");
const PuppeteerWorker = require("./controllers/puppeteer-worker");

async function launch(_config) {
  const ioc = new nanioc.IOCContainer({
    ignoreMissingBean: true,
    getter: true,
  });
  ioc.addBean(Logger, "logger", {
    auto: true,
    ignoreDeps: ["logDir", "handler", "handlers"],
  });
  ioc.addBean(DateTimeUtils, "datetimeUtils");
  ioc.addBean(JobValidation, "jobValidation");
  ioc.addBean(Config, "config", { auto: true, ignoreDeps: ["__all"] });
  ioc.addBean(PuppeteerClient, "puppeteerClient");
  ioc.addBean(JobRunner, "jobRunner", { auto: true });
  ioc.addBean(JobTemplateDb, "jobTemplateDb", {
    auto: true,
    ignoreDeps: ["db"],
  });
  ioc.addBean(Loop, "loop");
  ioc.addBean(PuppeteerWorker, "puppeteerWorker", { auto: true });
  ioc.di();
  const puppeteerWorker = ioc.getBean("puppeteerWorker").getInstance();
  puppeteerWorker.loadConfig(_config);
  puppeteerWorker.prepareWorkspace();
  await puppeteerWorker.boot();
  return puppeteerWorker;
}

module.exports.PuppeteerWorker = PuppeteerWorker;
module.exports.launch = launch;
