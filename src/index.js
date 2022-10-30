// eslint-disable-next-line import/no-unresolved
const { IOCContainer } = require("@tuana9a/nanioc");

const DoJob = require("./controllers/DoJob");
const PuppeteerClient = require("./controllers/PuppeteerClient");
const JobTemplateDb = require("./db/JobTemplateDb");
const WorkerController = require("./controllers/WorkerController");
const HttpWorker = require("./workers/HttpWorker");
const RabbitMQWorker = require("./workers/RabbitMQWorker");
const StandaloneWorker = require("./workers/StandaloneWorker");
const PuppeteerDisconnectedError = require("./errors/PuppeteerDisconnectedError");

async function launch(config) {
  const ioc = new IOCContainer({ getter: true });
  ioc.addBean(PuppeteerClient, "puppeteerClient");
  ioc.addBean(DoJob, "doJob");
  ioc.addBean(JobTemplateDb, "jobTemplateDb", { ignoreDeps: ["db"] });
  ioc.addBean(WorkerController, "workerController");
  ioc.addBean(HttpWorker, "httpWorker");
  ioc.addBean(RabbitMQWorker, "rabbitWorker");
  ioc.addBean(StandaloneWorker, "standaloneWorker");
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
