/* eslint-disable global-require */
/* eslint-disable import/no-dynamic-require */
const fs = require("fs");
const path = require("path");
const JobDirNotExistsError = require("../errors/JobDirNotExistError");
const logger = require("../loggers/logger");

class JobTemplateDb {
  db;

  constructor() {
    this.db = new Map();
  }

  getDb() {
    return this.db;
  }

  /**
   * if you has trouble in importing module see https://github.com/tuana9a/puppeteer-worker/blob/main/TROUBLESHOOTING.md
   * @param {string} filepath
   * @param {string} jobName
   * @param {string} importPrefix
   */
  loadFromFile(filepath, jobName) {
    const db = this.getDb();
    try {
      const jobTemplate = require(filepath);
      db.set(jobName, jobTemplate);
      logger.info(`Job: loaded: "${jobName}" -> "${filepath}"`);
    } catch (err) {
      logger.error(err);
    }
  }

  loadFromDir(rootPath) {
    const lengthOfJs = ".js".length;
    if (!fs.existsSync(rootPath)) {
      throw new JobDirNotExistsError(rootPath);
    }
    const files = fs.readdirSync(rootPath).filter((x) => x.endsWith(".js"));
    for (const filepath of files) {
      const absoluteFilepath = path.resolve(rootPath, filepath);
      const jobName = filepath.slice(0, -(lengthOfJs));
      this.loadFromFile(absoluteFilepath, jobName);
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
