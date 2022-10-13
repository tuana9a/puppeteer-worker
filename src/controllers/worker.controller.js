const { PuppeteerDisconnectedError } = require("../common/errors");
const configUtils = require("../utils/config.utils");
const otherUtils = require("../utils/other.utils");

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
      configUtils.updateFromObject(config, _config);
    }
  }

  prepareWorkspace() {
    const config = this.getConfig();
    otherUtils.ensureDirExists(config.tmpDir);
    otherUtils.ensureDirExists(config.logDir);
    otherUtils.ensureDirExists(config.jobDir);
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
