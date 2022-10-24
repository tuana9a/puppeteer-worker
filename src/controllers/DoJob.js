const fs = require("fs");
const _axios = require("axios");
const FormData = require("form-data");

const JobNotFoundError = require("../errors/JobNotFoundError");
const InvalidJobError = require("../errors/InvalidJobError");

const axios = _axios.default.create();

class DoJob {
  logger;

  puppeteerClient;

  jobTemplateDb;

  async do(job) {
    if (!job) {
      throw new InvalidJobError(job);
    }

    const puppeteerClient = this.getPuppeteerClient();
    const jobTemplateDb = this.getJobTemplateDb();
    const jobTemplate = jobTemplateDb.get(job.name);

    if (!jobTemplate) {
      throw new JobNotFoundError(job.name);
    }

    const { params } = job;
    const page = await puppeteerClient.getFirstPage();
    const libs = {
      fs: fs,
      axios: axios,
      FormData: FormData,
    };
    const logs = await jobTemplate({ params, page, libs }).run();

    return logs;
  }
}

module.exports = DoJob;
