const fs = require("fs");

const nanioc = require("@tuana9a/nanioc");
const errors = require("./common/errors");

const Loop = require("./common/loop");
const JobRunner = require("./controllers/job-runner");
const Logger = require("./common/logger");
const DateTimeUtils = require("./common/datetime.utils");
const JobValidation = require("./validations/job.validatation");
const Config = require("./common/config");
const PuppeteerManager = require("./controllers/puppeteer-manager");
const HttpPollJobsService = require("./controllers/http-poll-jobs.service");
const JobTemplateDb = require("./db/job-template.db");
const ConfigTemplate = require("./common/config-template");

class PuppeteerWorker {
  static _ignoreDeps = ["ioc"];

  logger;

  config;

  puppeteerManager;

  httpPollJobsService;

  jobTemplateDb;

  jobRunner;

  constructor() {
    const ioc = new nanioc.IOCContainer();
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

  async start(__config = ConfigTemplate) {
    const config = this.getConfig();
    const logger = this.getLogger();
    const puppeteerManager = this.getPuppeteerManager();
    // TODO: need to support multiple way to get the jobs
    const jobService = this.getHttpPollJobService();
    const jobRunner = this.getJobRunner();
    const jobTemplateDb = this.getJobTemplateDb();

    config.loadFromObject(__config);
    logger.use(config.log.dest);
    logger.setLogDir(config.log.dir);

    // make sure tmp dir exists
    if (!fs.existsSync(config.tmp.dir)) {
      fs.mkdirSync(config.tmp.dir);
    }

    // make sure tmp dir exists
    if (!fs.existsSync(config.log.dir)) {
      fs.mkdirSync(config.log.dir);
    }

    logger.info(config);

    await puppeteerManager.launch(config.puppeteer.launchOption);

    if (config.job.info.url) {
      try {
        await jobTemplateDb.downloadFromInfo(
          config.job.info.url,
          config.job.dir,
          {
            headers: {
              Authorization: `Bearer ${config.job.accessToken}`,
            },
          },
        );
      } catch (err) {
        logger.error(err, "jobTemplateDb.downloadFromInfo");
      }
    }

    jobTemplateDb.loadFromDir(config.job.dir, config.job.import.prefix);

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
}

module.exports.PuppeteerWorker = PuppeteerWorker;
