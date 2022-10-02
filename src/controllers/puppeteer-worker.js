const errors = require("../common/errors");
const configUtils = require("../utils/config.utils");
const otherUtils = require("../utils/other.utils");
const RabbitMQWorker = require("./rabbitmq-worker");
const HttpWorker = require("./http-worker");

class PuppeteerWorker {
  logger;

  config;

  puppeteerClient;

  jobTemplateDb;

  jobRunner;

  loop;

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
    logger.info(config);

    jobTemplateDb.loadFromDir(config.jobDir, config.jobImportPrefix);

    await puppeteerClient.launch(config.puppeteerLaunchOption, () => {
      logger.error(new errors.PuppeteerDisconnected());
      setTimeout(() => process.exit(0), 1000);
    });
  }

  amqp() {
    const config = this.getConfig();
    const logger = this.getLogger();
    const puppeteerClient = this.getPuppeteerClient();
    const jobTemplateDb = this.getJobTemplateDb();
    const jobRunner = this.getJobRunner();
    this.worker = new RabbitMQWorker({
      config,
      logger,
      jobTemplateDb,
      jobRunner,
      puppeteerClient,
    });
    return this;
  }

  http() {
    const config = this.getConfig();
    const logger = this.getLogger();
    const loop = this.getLoop();
    const puppeteerClient = this.getPuppeteerClient();
    const jobTemplateDb = this.getJobTemplateDb();
    const jobRunner = this.getJobRunner();
    this.worker = new HttpWorker({
      config,
      logger,
      loop,
      jobTemplateDb,
      jobRunner,
      puppeteerClient,
    });
    return this;
  }

  start() {
    this.worker.start();
  }

  async stop() {
    await this.getPuppeteerClient().getBrowser().close();
    setTimeout(() => process.exit(0), 1000);
  }
}

module.exports = PuppeteerWorker;
