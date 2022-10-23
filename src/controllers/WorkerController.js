const ensureDirExists = require("../common/ensureDirExists");

class WorkerController {
  logger;

  config;

  jobTemplateDb;

  httpWorker;

  rabbitWorker;

  puppeteerClient;

  loadConfig(_config) {
    if (_config) {
      const logger = this.getLogger();
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
    ensureDirExists(config.jobDir);
  }

  prepareJobTemplate() {
    const config = this.getConfig();
    const jobTemplateDb = this.getJobTemplateDb();
    jobTemplateDb.loadFromDir(config.jobDir, config.jobImportPrefix);
  }

  puppeteer() {
    return this.puppeteerClient;
  }

  auto() {
    return this[this.config.workerType]();
  }

  rabbit() {
    return this.getRabbitWorker();
  }

  http() {
    return this.getHttpWorker();
  }

  exit() {
    setTimeout(() => process.exit(0), 100);
  }
}

module.exports = WorkerController;
