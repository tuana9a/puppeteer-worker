const ensureDirExists = require("../common/ensureDirExists");
const InvalidWorkerTypeError = require("../errors/InvalidWorkerTypeError");
const logger = require("../loggers/logger");

class WorkerController {
  config;

  jobTemplateDb;

  httpWorker;

  rabbitWorker;

  standaloneWorker;

  puppeteerClient;

  loadConfig(_config) {
    if (_config) {
      const config = this.getConfig();
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
    const config = this.getConfig();
    ensureDirExists(config.tmpDir);
    ensureDirExists(config.logDir);
  }

  prepareJobTemplate() {
    const config = this.getConfig();
    const jobTemplateDb = this.getJobTemplateDb();
    jobTemplateDb.loadFromDir(config.jobDir);
  }

  puppeteer() {
    return this.puppeteerClient;
  }

  auto() {
    if (!this[this.config.workerType]) {
      throw new InvalidWorkerTypeError(this.config.workerType);
    }
    return this[this.config.workerType]();
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
