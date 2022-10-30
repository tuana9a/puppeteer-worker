const config = require("../common/config");
const ensureDirExists = require("../common/ensureDirExists");
const InvalidWorkerTypeError = require("../errors/InvalidWorkerTypeError");
const logger = require("../loggers/logger");

class WorkerController {
  jobTemplateDb;

  httpWorker;

  rabbitWorker;

  standaloneWorker;

  puppeteerClient;

  loadConfig(_config) {
    if (_config) {
      if (_config.configFile) {
        config.updateFromFile(_config.configFile);
      }
      config.updateFromObject(_config);
      config.setDefaultIfFalsy();
      logger.use(config.logDest);
      logger.info(config.toString());
    }
  }

  prepareWorkDirs() {
    ensureDirExists(config.tmpDir);
    ensureDirExists(config.logDir);
  }

  prepareJobTemplate() {
    const jobTemplateDb = this.getJobTemplateDb();
    jobTemplateDb.loadFromDir(config.jobDir);
  }

  puppeteer() {
    return this.puppeteerClient;
  }

  auto() {
    if (!this[config.workerType]) {
      throw new InvalidWorkerTypeError(config.workerType);
    }
    return this[config.workerType]();
  }

  rabbit() {
    return this.getRabbitWorker();
  }

  http() {
    return this.getHttpWorker();
  }

  standalone() {
    return this.getStandaloneWorker();
  }

  exit() {
    setTimeout(() => process.exit(0), 100);
  }
}

module.exports = WorkerController;
