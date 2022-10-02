const _axios = require("axios");
const path = require("path");

const errors = require("../common/errors");
const downloadUtils = require("../utils/download.utils");

const axios = _axios.default.create();

class HttpWorker {
  constructor({
    config,
    loop,
    logger,
    puppeteerClient,
    jobTemplateDb,
    jobRunner,
  }) {
    this.config = config;
    this.loop = loop;
    this.logger = logger;
    this.ppClient = puppeteerClient;
    this.infos = [];
    this.jobTemplateDb = jobTemplateDb;
    this.jobRunner = jobRunner;
  }

  /**
   * { data: [jobs here...] }
   * @param {string} url
   * @param {*} headers
   */
  async downloadInfos(url, headers = {}) {
    const response = await axios
      .get(url, {
        headers: headers,
      })
      .then((res) => res.data);
    this.infos = response.data;
  }

  async downloadJobsFromInfos(jobDir, headers = {}) {
    const logger = this.getLogger();
    for (const info of this.infos) {
      const { key, downloadUrl, fileName } = info;
      logger.info(`job "${key}" downloading`);

      await downloadUtils.downloadFile(
        downloadUrl,
        path.join(jobDir, fileName),
        {
          headers: headers,
        },
      );

      logger.info(`job "${key}" downloaded`);
    }
  }

  async start() {
    const { config, loop, logger, jobTemplateDb, ppClient, jobRunner } = this;

    loop.infinity(async () => {
      const baseErrAt = `${HttpWorker.name}.${this.start.name} > loop.${loop.infinity.name}`;
      const response = await axios
        .post(
          config.controlPlaneUrl,
          {
            cmd: "poll-job",
          },
          {
            headers: {
              Authorization: config.accessToken,
            },
          },
        )
        .then((res) => res.data)
        .catch((err) => {
          logger.error(err, `${baseErrAt} > poll-jobs`);
          return { data: [] };
        });

      const jobInfos = response.data;

      for (const jobInfo of jobInfos) {
        let result = null;
        try {
          const jobId = jobInfo.id;
          const jobInput = jobInfo.input;
          const jobCtx = jobInfo.ctx;
          const job = jobTemplateDb.get(jobId);

          logger.info(
            `Doing job: id="${jobId}" input="${JSON.stringify(
              jobInput,
            )}" ctx="${JSON.stringify(jobCtx)}"`,
          );

          if (!job) {
            const msg = `Job not found "${jobId}"`;
            logger.warn(msg);
            result = { success: false, msg: msg };
          }

          const page = await ppClient.getFirstPage();

          if (!page) {
            throw new errors.CanNotGetPage();
          }

          const jobTasks = job.tasks;
          result = await jobRunner.run({
            id: jobId,
            tasks: jobTasks,
            page,
            input: jobInput,
            ctx: jobCtx,
          });

          result = { success: true, result: result };
        } catch (err) {
          result = {
            success: false,
            err: { message: err.message, stack: err.stack },
          };
          logger.error(
            err,
            `${baseErrAt} > for const job of jobs > handler(job)`,
          );
        }

        logger.info(result);

        axios
          .post(
            config.controlPlaneUrl,
            JSON.stringify({
              cmd: "submit-result",
              result: result,
            }),
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: config.accessToken,
              },
            },
          )
          .catch((err) => logger.error(err, `${baseErrAt} > submit-result`));
      }
    }, config.repeatPollJobsAfter);
  }
}

module.exports = HttpWorker;
