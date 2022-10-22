const configUtils = require("../utils/config.utils");
const { ensureDirExists } = require("../utils/other.utils");

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
        configUtils.updateFromFile(config, _config.configFile);
      }
      configUtils.updateFromObject(config, _config);
      configUtils.setDefaultIfFalsy(config);
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
