const _axios = require("axios");
const path = require("path");
const { toErr } = require("../errors/InvalidJobError");

const downloadFile = require("../common/downloadFile");

const axios = _axios.default.create();

class HttpWorker {
  config;

  loop;

  logger;

  doJob;

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

      await downloadFile(
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
    const doJob = this.getDoJob();

    const httpWorkerConfig = await axios.get(config.httpWorkerPullConfigUrl, {
      headers: {
        Authorization: config.accessToken,
      },
    }).then((res) => res.data);

    const { pollJobUrl, submitJobResultUrl, repeatPollJobsAfter } = httpWorkerConfig;

    loop.infinity(async () => {
      const job = await axios.get(pollJobUrl, { headers: { Authorization: config.accessToken } })
        .then((res) => res.data)
        .catch((err) => logger.error(err));

      if (!job) return;

      try {
        const logs = await doJob.do(job);
        axios.post(submitJobResultUrl, JSON.stringify({ data: logs }), {
          headers: {
            "Content-Type": "application/json",
            Authorization: config.accessToken,
          },
        }).catch((err) => logger.error(err));
      } catch (err) {
        logger.error(err);
        axios.post(submitJobResultUrl, JSON.stringify({ err: toErr(err) }), {
          headers: {
            "Content-Type": "application/json",
            Authorization: config.accessToken,
          },
        }).catch((err1) => logger.error(err1));
      }
    }, repeatPollJobsAfter);
  }
}

module.exports = HttpWorker;
