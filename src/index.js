// eslint-disable-next-line import/no-unresolved
const { IOCContainer } = require("@tuana9a/nanioc");

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
const { PuppeteerDisconnectedError } = require("./common/errors");

async function launch(config) {
  const ioc = new IOCContainer({ getter: true });
  ioc.addBean(Logger, "logger", { ignoreDeps: ["logDir", "handler", "handlers"] });
  ioc.addBean(DateTimeUtils, "datetimeUtils");
  ioc.addBean(Config, "config", { ignoreDeps: ["__all"] });
  ioc.addBean(PuppeteerClient, "puppeteerClient");
  ioc.addBean(JobRunner, "jobRunner");
  ioc.addBean(JobTemplateDb, "jobTemplateDb", { ignoreDeps: ["db"] });
  ioc.addBean(Loop, "loop");
  ioc.addBean(WorkerController, "workerController");
  ioc.addBean(HttpWorker, "httpWorker");
  ioc.addBean(RabbitMQWorker, "rabbitWorker", { ignoreDeps: ["workerId"] });
  ioc.di();
  const workerController = ioc.getBean("workerController").getInstance();
  workerController.loadConfig(config);
  workerController.prepareWorkDirs();
  workerController.prepareJobTemplate();
  await workerController.puppeteer().launch();
  workerController.puppeteer().onDisconnect(() => console.error(new PuppeteerDisconnectedError()));
  workerController.puppeteer().onDisconnect(() => setTimeout(() => process.exit(0), 100));
  await workerController.auto().start();
  return workerController;
}

module.exports.launch = launch;
