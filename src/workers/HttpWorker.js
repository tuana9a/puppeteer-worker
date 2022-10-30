const _axios = require("axios");
const path = require("path");
const downloadFile = require("../common/downloadFile");
const toPrettyErr = require("../common/toPrettyErr");
const loop = require("../common/loop");
const logger = require("../loggers/logger");
const config = require("../common/config");

const axios = _axios.default.create();

class HttpWorker {
  doJob;

  async downloadJobs(url, jobDir, headers = {}) {
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
        const body = { id: job.id, workerId: config.workerId, logs: logs };
        axios.post(submitJobResultUrl, JSON.stringify(body), {
          headers: {
            "Content-Type": "application/json",
            Authorization: config.accessToken,
          },
        }).catch((err) => logger.error(err));
      } catch (err) {
        logger.error(err);
        const body = { workerId: config.workerId, err: toPrettyErr(err) };
        axios.post(submitJobResultUrl, JSON.stringify(body), {
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
