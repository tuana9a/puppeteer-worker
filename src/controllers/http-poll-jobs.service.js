const _axios = require("axios");

const axios = _axios.default.create();

class HttpPollJobsService {
  config;

  loop;

  logger;

  async start(handler) {
    const config = this.getConfig();
    const loop = this.getLoop();
    const logger = this.getLogger();

    loop.infinity(async () => {
      const baseErrAt = `${HttpPollJobsService.name}.${this.start.name} > loop.${loop.infinity.name}`;
      const response = await axios
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
          logger.error(err, `${baseErrAt} > poll-jobs`);
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
          logger.error(
            err,
            `${baseErrAt} > for const job of jobs > handler(job)`,
          );
        }

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
                Authorization: `Bearer ${config.accessToken}`,
              },
            },
          )
          .catch((err) => logger.error(err, `${baseErrAt} > submit-result`));
      }
    }, config.repeatPollJobsAfter);
  }
}

module.exports = HttpPollJobsService;
