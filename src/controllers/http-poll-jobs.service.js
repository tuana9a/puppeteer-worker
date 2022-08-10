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
      try {
        const response = await _axios
          .get(config.job.poll.url, {
            headers: {
              Authorization: `Bearer ${config.job.accessToken}`,
            },
          })
          .then((res) => res.data);

        const jobs = response.data;

        for (const job of jobs) {
          const result = await handler(job);

          logger.info(result);

          if (config.job.submit.url) {
            _axios
              .post(config.job.submit.url, JSON.stringify(result), {
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${config.job.accessToken}`,
                },
              })
              .catch((err) => logger.error(err));
          }
        }
      } catch (err) {
        logger.error(err);
      }
    }, config.job.poll.repeatAfter);
  }
}

module.exports = HttpPollJobsService;
