const nanioc = require("@tuana9a/nanioc");

const Loop = require("./common/loop");
const JobRunner = require("./controllers/job-runner");
const Logger = require("./common/logger");
const DateTimeUtils = require("./utils/datetime.utils");
const Config = require("./common/config");
const PuppeteerClient = require("./controllers/puppeteer-client");
const JobTemplateDb = require("./db/job-template.db");
const WorkerController = require("./controllers/worker.controller");
const HttpWorker = require("./workers/http-worker");
const RabbitMQWorker = require("./workers/rabbitmq-worker");

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
  ioc.addBean(Config, "config", { auto: true, ignoreDeps: ["__all"] });
  ioc.addBean(PuppeteerClient, "puppeteerClient");
  ioc.addBean(JobRunner, "jobRunner", { auto: true });
  ioc.addBean(JobTemplateDb, "jobTemplateDb", {
    auto: true,
    ignoreDeps: ["db"],
  });
  ioc.addBean(Loop, "loop");
  ioc.addBean(WorkerController, "workerController", { auto: true });
  ioc.addBean(HttpWorker, "httpWorker", { auto: true });
  ioc.addBean(RabbitMQWorker, "rabbitWorker", { auto: true, ignoreDeps: "workerId" });
  ioc.di();
  const workerController = ioc.getBean("workerController").getInstance();
  workerController.loadConfig(_config);
  workerController.prepareWorkspace();
  await workerController.boot();
  return workerController;
}

module.exports.WorkerController = WorkerController;
module.exports.launch = launch;
