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
   * @param {string} key
   * @param {string} importPrefix
   */
  loadFromFile(modulePath, key, importPrefix = "") {
    const db = this.getDb();
    const logger = this.getLogger();
    try {
      const job = require(path.join(importPrefix, modulePath));
      db.set(key, job);
      logger.info(`Job: Loaded: ${key}`);
    } catch (err) {
      logger.error(err);
    }
  }

  loadFromDir(rootPath, importPrefix = "") {
    const childPaths = fs
      .readdirSync(rootPath)
      .filter((x) => x.endsWith(".js"));
    for (const childPath of childPaths) {
      const _childPath = path.join(rootPath, childPath);
      const lengthOfJs = ".js".length;
      const jobKey = childPath.slice(0, -lengthOfJs);
      this.loadFromFile(_childPath, jobKey, importPrefix);
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
