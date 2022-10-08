const _axios = require("axios");
const path = require("path");

const downloadUtils = require("../utils/download.utils");

const axios = _axios.default.create();

class HttpWorker {
  config;

  loop;

  logger;

  jobTemplateDb;

  jobRunner;

  async downloadJobs(url, jobDir, headers = {}) {
    const logger = this.getLogger();

    const response = await axios
      .get(url, {
        headers: headers,
      })
      .then((res) => res.data);

    const infos = response.data;

    for (const info of infos) {
      const { key, downloadUrl, fileName } = info;
      logger.info(`Downloading Job: ${key}`);

      await downloadUtils.downloadFile(
        downloadUrl,
        path.join(jobDir, fileName),
        {
          headers: headers,
        },
      );
    }
  }

  async start() {
    const config = this.getConfig();
    const loop = this.getLoop();
    const logger = this.getLogger();
    const jobTemplateDb = this.getJobTemplateDb();
    const jobRunner = this.getJobRunner();

    const httpWorkerConfig = await axios.get(config.httpWorkerPullConfigUrl, {
      headers: {
        Authorization: config.accessToken,
      },
    }).then((res) => res.data);

    const { pollJobUrl, submitJobResultUrl } = httpWorkerConfig;

    loop.infinity(async () => {
      const job = await axios.get(pollJobUrl, { headers: { Authorization: config.accessToken } })
        .then((res) => res.data)
        .catch((err) => logger.error(err));

      if (!job) {
        return;
      }

      let logs = [];
      try {
        const params = job.input || job.params;
        const mJob = jobTemplateDb.get(job.id);

        logger.info(`Doing Job: id: "${job.id}" params: "${JSON.stringify(params)}"`);

        if (!mJob) {
          logger.warn(`Job not found ${job.id}`);
        }

        logs = await jobRunner.run(mJob, params);
      } catch (err) {
        logger.error(err);
      }

      axios.post(submitJobResultUrl, JSON.stringify({ data: logs }), {
        headers: {
          "Content-Type": "application/json",
          Authorization: config.accessToken,
        },
      }).catch((err) => logger.error(err));
    }, config.repeatPollJobsAfter);
  }
}

module.exports = HttpWorker;
