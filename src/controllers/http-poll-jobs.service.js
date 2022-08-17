const axios = require("axios");

const _axios = axios.default.create();

class HttpPollJobsService {
  config;

  loop;

  logger;

  getConfig() {
    return this.config;
  }

  getLoop() {
    return this.loop;
  }

  getLogger() {
    return this.logger;
  }

  async start(handler) {
    const config = this.getConfig();
    const loop = this.getLoop();
    const logger = this.getLogger();

    loop.infinity(async () => {
      const baseErrAt = "httpPollJobService.start > loop.infinity";
      const response = await _axios
        .post(
          config.controlPlaneUrl,
          {
            cmd: "poll-job",
          },
          {
            headers: {
              Authorization: `Bearer ${config.accessToken}`,
            },
          },
        )
        .then((res) => res.data)
        .catch((err) => {
          logger.error(err, `${baseErrAt} > get jobs`);
          return { data: [] };
        });

      const jobs = response.data;

      for (const job of jobs) {
        let result = null;
        try {
          result = await handler(job);

          logger.info(result);
        } catch (err) {
          result = {
            success: false,
            err: { message: err.message, stack: err.stack },
          };
          logger.error(err, `${baseErrAt} > for : jobs > handler(job)`);
        }

        _axios
          .post(
            config.controlPlaneUrl,
            JSON.stringify({
              cmd: "submit-result",
              result: result,
            }),
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${config.accessToken}`,
              },
            },
          )
          .catch((err) => logger.error(err, `${baseErrAt} > post result`));
      }
    }, config.repeatPollJobsAfter);
  }
}

module.exports = HttpPollJobsService;
