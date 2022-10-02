/* eslint-disable global-require */
/* eslint-disable import/no-dynamic-require */
const fs = require("fs");
const path = require("path");

class JobTemplateDb {
  db;

  logger;

  constructor() {
    this.db = new Map();
  }

  getDb() {
    return this.db;
  }

  /**
   * if you has trouble in importing module see https://github.com/tuana9a/puppeteer-worker/blob/main/TROUBLESHOOTING.md#configjobimportprefix-explaination
   * @param {string} modulePath
   * @param {string} jobKey
   * @param {string} importPrefix
   */
  loadFromFile(modulePath, jobKey, importPrefix = "") {
    const db = this.getDb();
    const logger = this.getLogger();
    try {
      const module = require(path.join(importPrefix, modulePath));
      for (const subKey of Object.keys(module)) {
        const jobId = `${jobKey}/${subKey}`;
        db.set(jobId, module[subKey]);
        logger.info(`Loaded job: "${jobId}"`);
      }
    } catch (err) {
      logger.error(err, `${JobTemplateDb.name}.${this.loadFromFile.name}`);
    }
  }

  loadFromDir(rootPath, importPrefix = "") {
    const childPaths = fs
      .readdirSync(rootPath)
      .filter((x) => x.endsWith(".js"));
    for (const childPath of childPaths) {
      const fullChildPath = path.join(rootPath, childPath);
      const lengthOfJs = ".js".length;
      this.loadFromFile(
        fullChildPath,
        childPath.slice(0, -lengthOfJs),
        importPrefix,
      );
    }
  }

  update(name, job) {
    this.db.set(name, job);
  }

  get(name) {
    return this.db.get(name);
  }
}

module.exports = JobTemplateDb;
