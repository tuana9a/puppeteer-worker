const fs = require("fs");
const path = require("path");
const ScheduleDirNotExistsError = require("../errors/ScheduleDirNotExistError");

class StandaloneWorker {
  config;

  loop;

  logger;

  doJob;

  async start() {
    const loop = this.getLoop();
    const logger = this.getLogger();
    const doJob = this.getDoJob();
    const dir = this.config.scheduleDir;

    if (!fs.existsSync(dir)) {
      throw new ScheduleDirNotExistsError(dir);
    }

    const files = fs.readdirSync(dir).filter((x) => x.endsWith(".json"));
    const schedules = [];

    for (const filepath of files) {
      const absoluteFilepath = path.resolve(dir, filepath);
      const job = JSON.parse(fs.readFileSync(absoluteFilepath, { flag: "r", encoding: "utf-8" }));
      logger.info(`Schedule: loaded: ${JSON.stringify(job, null, 2)}`);
      schedules.push(job);
    }
    schedules.sort((x1, x2) => x1.timeToStart - x2.timeToStart);

    loop.infinity(async () => {
      const job = schedules[0];

      if (!job) {
        process.exit(0);
      }

      if (Date.now() < job.timeToStart) {
        return;
      }

      schedules.shift();

      try {
        const logs = await doJob.do(job);
        logger.info(logs);
      } catch (err) {
        logger.error(err);
      }
    }, 5000);
  }
}

module.exports = StandaloneWorker;
