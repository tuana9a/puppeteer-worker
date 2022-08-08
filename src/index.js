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
  ioc.addBean(Loop, "loop");
  ioc.di();

  const config = ioc.getBean("config").getInstance();
  const logger = ioc.getBean("logger").getInstance();
  const puppeteerManager = ioc.getBean("puppeteerManager").getInstance();
  const jobManager = ioc.getBean("jobManager").getInstance();
  // TODO: need to support multiplte way to get the jobs
  const jobService = ioc.getBean("httpPollJobsService").getInstance();
  const jobRunner = ioc.getBean("jobRunner").getInstance();

  config.loadFromEnv(process.env);
  config.loadJobConfig();

  logger.use(config.log.dest);
  logger.info(config);
  logger.info(process.env);

  await puppeteerManager.launch(config.puppeteer.launchOption);

  jobManager.setJobService(jobService);
  jobManager.registerHandler(async (body) => {
    try {
      const jobMappers = config.getJobMappers();
      const jobId = body.id;
      const jobInput = body.input;
      const jobCtx = body.ctx;
      const job = jobMappers.get(jobId);

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
      return { success: false, err: err };
    }
  });

  jobManager.start();
}

main();
