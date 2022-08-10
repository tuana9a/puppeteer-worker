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
const JobManager = require("./controllers/job-manager");
const HttpPollJobsService = require("./controllers/http-poll-jobs.service");
const JobTemplateDb = require("./controllers/job-template.db");

require("dotenv").config();

async function main() {
  const ioc = new nanioc.IOCContainer();
  ioc.addBean(Logger, "logger");
  ioc.addBean(DateTimeUtils, "datetimeUtils");
  ioc.addBean(JobValidation, "jobValidation");
  ioc.addBean(Config, "config");
  ioc.addBean(PuppeteerManager, "puppeteerManager");
  ioc.addBean(JobRunner, "jobRunner");
  ioc.addBean(JobManager, "jobManager");
  ioc.addBean(HttpPollJobsService, "httpPollJobsService");
  ioc.addBean(JobTemplateDb, "jobTemplateDb");
  ioc.addBean(Loop, "loop");
  ioc.di();

  const config = ioc.getBean("config").getInstance();
  config.loadFromEnv(process.env);

  const logger = ioc.getBean("logger").getInstance();
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

  const puppeteerManager = ioc.getBean("puppeteerManager").getInstance();
  await puppeteerManager.launch(config.puppeteer.launchOption);

  const jobManager = ioc.getBean("jobManager").getInstance();
  // TODO: need to support multiplte way to get the jobs
  const jobService = ioc.getBean("httpPollJobsService").getInstance();
  const jobRunner = ioc.getBean("jobRunner").getInstance();
  const jobTemplateDb = ioc.getBean("jobTemplateDb").getInstance();

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
      logger.error(err);
    }
  }

  jobTemplateDb.loadFromDir(config.job.dir, config.job.import.prefix);

  jobManager.setJobService(jobService);
  jobManager.registerHandler(async (body) => {
    try {
      const jobId = body.id;
      const jobInput = body.input;
      const jobCtx = body.ctx;
      const job = jobTemplateDb.get(jobId);

      logger.info(
        `Doing job: id="${jobId}" input="${JSON.stringify(jobInput)}" ctx="${JSON.stringify(jobCtx)}"`,
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
      logger.error(err);
      return { success: false, err: err.message };
    }
  });

  jobManager.start();
}

main();
