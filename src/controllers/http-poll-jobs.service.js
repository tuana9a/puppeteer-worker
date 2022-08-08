const axios = require("axios");

const axiosInstance = axios.default.create();

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
        const response = await axiosInstance
          .get(config.httpPollJobsUrl, {
            headers: {
              Authorization: `Bearer ${config.httpPollJobsAccessToken}`,
            },
          })
          .then((data) => data.data);

        const jobs = response.data;

        for (const job of jobs) {
          const result = await handler(job);

          logger.info(result);

          if (config.httpSubmitResultUrl) {
            axiosInstance
              .post(config.httpSubmitResultUrl, JSON.stringify(result), {
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${config.httpPollJobsAccessToken}`,
                },
              })
              .catch((err) => logger.error(err));
          }
        }
      } catch (err) {
        logger.error(err);
      }
    }, config.repeatPollJobsAfter);
  }
}

module.exports = HttpPollJobsService;
