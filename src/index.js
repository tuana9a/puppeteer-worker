const fs = require("fs");
const path = require("path");
const axios = require("axios");

const nanioc = require("@tuana9a/nanioc");
const errors = require("./common/errors");
const configUtils = require("./common/config.utils");

const Loop = require("./common/loop");
const JobRunner = require("./controllers/job-runner");
const Logger = require("./common/logger");
const DateTimeUtils = require("./common/datetime.utils");
const JobValidation = require("./validations/job.validatation");
const Config = require("./common/config");
const PuppeteerManager = require("./controllers/puppeteer-manager");
const HttpPollJobsService = require("./controllers/http-poll-jobs.service");
const JobTemplateDb = require("./db/job-template.db");
const downloadUtils = require("./common/download.utils");

class PuppeteerWorker {
  logger;

  config;

  puppeteerManager;

  httpPollJobsService;

  jobTemplateDb;

  jobRunner;

  constructor(__config) {
    const ioc = new nanioc.IOCContainer({ ignoreMissingBean: true });
    ioc.addBean(Logger, "logger");
    ioc.addBean(DateTimeUtils, "datetimeUtils");
    ioc.addBean(JobValidation, "jobValidation");
    ioc.addBean(Config, "config");
    ioc.addBean(PuppeteerManager, "puppeteerManager");
    ioc.addBean(JobRunner, "jobRunner");
    ioc.addBean(HttpPollJobsService, "httpPollJobsService");
    ioc.addBean(JobTemplateDb, "jobTemplateDb");
    ioc.addBean(Loop, "loop");
    ioc.addBeanWithoutClass(this, "puppeteerWorker");
    ioc.di();
    if (__config) {
      const config = this.getConfig();
      configUtils.loadFromObject(__config, config);
    }
  }

  getConfig() {
    return this.config;
  }

  getLogger() {
    return this.logger;
  }

  getPuppeteerManager() {
    return this.puppeteerManager;
  }

  getHttpPollJobService() {
    return this.httpPollJobsService;
  }

  getJobTemplateDb() {
    return this.jobTemplateDb;
  }

  getJobRunner() {
    return this.jobRunner;
  }

  async start(__config) {
    const config = this.getConfig();
    const logger = this.getLogger();
    const puppeteerManager = this.getPuppeteerManager();
    // TODO: need to support multiple way to get the jobs
    const jobService = this.getHttpPollJobService();
    const jobRunner = this.getJobRunner();
    const jobTemplateDb = this.getJobTemplateDb();

    if (__config) {
      // re-update if override
      configUtils.loadFromObject(__config, config);
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

    await puppeteerManager.launch(config.puppeteerLaunchOption, () => {
      logger.error(new errors.PuppeteerDisconnected());
      setTimeout(() => process.exit(0), 1000);
    });

    try {
      const _axios = axios.default.create();

      const response = await _axios
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
      logger.error(err, "index.js > download info");
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

        const page = await puppeteerManager.getPageByIndex(0);

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
        logger.error(err, "jobHandler");
        return { success: false, err: err.message };
      }
    });
  }

  async stop() {
    const puppeteerManager = this.getPuppeteerManager();
    const browser = puppeteerManager.getBrowser();
    await browser.close();
    setTimeout(() => process.exit(0), 1000);
  }
}

module.exports.PuppeteerWorker = PuppeteerWorker;
