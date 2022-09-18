const fs = require("fs");
const path = require("path");
const _axios = require("axios");
const errors = require("./common/errors");
const configUtils = require("./common/config.utils");
const downloadUtils = require("./common/download.utils");

const axios = _axios.default.create();

class PuppeteerWorker {
  logger;

  config;

  puppeteerClient;

  httpPollJobsService;

  jobTemplateDb;

  jobRunner;

  constructor(_config) {
    // eslint-disable-next-line no-console
    console.warn(
      "init PuppeteerWorker with _config at constructor will not be used in puppeteer-worker >= 2.0.0 and will be removed in the future.\nUse require('puppeteer-worker').launch(opts) instead\n",
    );
  }

  loadConfig(_config) {
    if (_config) {
      const config = this.getConfig();
      configUtils.updateFromObject(config, _config);
    }
  }

  async start(_config) {
    const config = this.getConfig();
    const logger = this.getLogger();
    const puppeteerClient = this.getPuppeteerClient();
    // TODO: need to support multiple way to get the jobs
    const jobService = this.getHttpPollJobsService();
    const jobRunner = this.getJobRunner();
    const jobTemplateDb = this.getJobTemplateDb();

    if (_config) {
      // re-update if override
      configUtils.updateFromObject(config, _config);
    }
    logger.use(config.logDest);
    logger.setLogDir(config.logDir);

    if (!fs.existsSync(config.tmpDir)) {
      fs.mkdirSync(config.tmpDir);
    }

    if (!fs.existsSync(config.logDir)) {
      fs.mkdirSync(config.logDir);
    }

    if (!fs.existsSync(config.jobDir)) {
      fs.mkdirSync(config.jobDir);
    }

    logger.info(config);

    await puppeteerClient.launch(config.puppeteerLaunchOption, () => {
      logger.error(new errors.PuppeteerDisconnected());
      setTimeout(() => process.exit(0), 1000);
    });

    try {
      const response = await axios
        .post(
          config.controlPlaneUrl,
          { cmd: "get-job-info" },
          {
            headers: {
              Authorization: `Bearer ${config.accessToken}`,
            },
          },
        )
        .then((res) => res.data);
      const infos = response.data;

      for (const info of infos) {
        const { key, downloadUrl, fileName } = info;
        logger.info(`job "${key}" downloading`);

        await downloadUtils.downloadFile(
          downloadUrl,
          path.join(config.jobDir, fileName),
          {
            headers: {
              Authorization: `Bearer ${config.accessToken}`,
            },
          },
        );

        logger.info(`job "${key}" downloaded`);
      }
    } catch (err) {
      logger.error(
        err,
        `${PuppeteerWorker.name}.${this.start.name} > download-info`,
      );
    }

    jobTemplateDb.loadFromDir(config.jobDir, config.jobImportPrefix);

    jobService.start(async (body) => {
      try {
        const jobId = body.id;
        const jobInput = body.input;
        const jobCtx = body.ctx;
        const job = jobTemplateDb.get(jobId);

        logger.info(
          `Doing job: id="${jobId}" input="${JSON.stringify(
            jobInput,
          )}" ctx="${JSON.stringify(jobCtx)}"`,
        );

        if (!job) {
          const msg = `Job not found "${jobId}"`;
          logger.warn(msg);
          return { success: false, msg: msg };
        }

        const page = await puppeteerClient.getPageByIndex(0);

        if (!page) {
          throw new errors.CanNotGetPage();
        }

        const jobTasks = job.tasks;
        const result = await jobRunner.run({
          id: jobId,
          tasks: jobTasks,
          page,
          input: jobInput,
          ctx: jobCtx,
        });

        return { success: true, result: result };
      } catch (err) {
        logger.error(
          err,
          `${PuppeteerWorker.name}.${this.start.name} > jobService.start > callback`,
        );
        return { success: false, err: err.message };
      }
    });
  }

  async stop() {
    const puppeteerClient = this.getPuppeteerClient();
    const browser = puppeteerClient.getBrowser();
    await browser.close();
    setTimeout(() => process.exit(0), 1000);
  }
}

module.exports = PuppeteerWorker;
