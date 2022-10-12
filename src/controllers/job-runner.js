const fs = require("fs");
const _axios = require("axios");
const FormData = require("form-data");
const { Job, ActionPayload, InvalidJobError, ActionLog } = require("puppeteer-worker-job-builder/v1");

const { JobNotFoundError, InvalidJobRequest } = require("../common/errors");

const axios = _axios.default.create();

class JobRunner {
  logger;

  puppeteerClient;

  jobTemplateDb;

  async run(jobRequest) {
    if (!jobRequest) {
      throw new InvalidJobRequest(jobRequest);
    }

    const logger = this.getLogger();
    const puppeteerClient = this.getPuppeteerClient();
    const jobTemplateDb = this.getJobTemplateDb();
    const job = jobTemplateDb.get(jobRequest.id);

    if (!job) {
      throw new JobNotFoundError(jobRequest.id);
    }

    const params = jobRequest.input || jobRequest.params;

    if (!Job.isValidJob(job)) {
      throw new InvalidJobError(job.name);
    }

    logger.info(`Doing Job: "${job.name}" params: "${JSON.stringify(params)}"`);

    const { actions } = job;
    const page = await puppeteerClient.getFirstPage();
    const payload = new ActionPayload({
      currentIdx: 0,
      libs: {
        fs: fs,
        axios: axios,
        FormData: FormData,
      },
      page: page,
      params: params,
      logs: [],
      actions: actions,
      stacks: Array.from(actions).reverse(),
    });

    let action = payload.stacks.pop();
    while (!payload.isBreak() && Boolean(action)) {
      try {
        await action.withPayload(payload).run();
        action = payload.stacks.pop();
        payload.currentIdx += 1;
      } catch (error) {
        logger.error(error);
        payload.logs.push(new ActionLog({
          action: action.name,
          at: Date.now(),
          err: {
            name: error.name,
            message: error.message,
            stack: error.stack.split("\n"),
          },
        }));
        payload.isBreak = () => true;
        break;
      }
    }

    logger.info(payload.logs);

    return payload.logs;
  }
}

module.exports = JobRunner;
