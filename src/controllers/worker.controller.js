const { PuppeteerDisconnectedError } = require("../common/errors");
const configUtils = require("../utils/config.utils");
const { ensureDirExists } = require("../utils/other.utils");

class WorkerController {
  logger;

  config;

  puppeteerClient;

  jobTemplateDb;

  httpWorker;

  rabbitWorker;

  loadConfig(_config) {
    if (_config) {
      const config = this.getConfig();
      if (_config.configFile) {
        configUtils.updateFromFile(config, _config.configFile);
      }
      configUtils.updateFromObject(config, _config);
      configUtils.setDefaultIfFalsy(config);
    }
  }

  prepareWorkspace() {
    const config = this.getConfig();
    ensureDirExists(config.tmpDir);
    ensureDirExists(config.logDir);
    ensureDirExists(config.jobDir);
  }

  async boot() {
    const config = this.getConfig();
    const logger = this.getLogger();
    const puppeteerClient = this.getPuppeteerClient();
    const jobTemplateDb = this.getJobTemplateDb();

    logger.use(config.logDest);
    logger.setLogDir(config.logDir);
    logger.info(config.toString());

    jobTemplateDb.loadFromDir(config.jobDir, config.jobImportPrefix);

    const onPuppeteerDisconnected = () => {
      logger.error(new PuppeteerDisconnectedError());
      setTimeout(() => process.exit(0), 100);
    };
    await puppeteerClient.launch(config.puppeteerLaunchOption, onPuppeteerDisconnected);
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

  async stop() {
    await this.getPuppeteerClient().getBrowser().close();
    setTimeout(() => process.exit(0), 1000);
  }
}

module.exports = WorkerController;
