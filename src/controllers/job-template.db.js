/* eslint-disable global-require */
/* eslint-disable import/no-dynamic-require */
const fs = require("fs");
const path = require("path");
const axios = require("axios");

const downloadUtils = require("../common/download.utils");

const _axios = axios.default.create();

class JobTemplateDb {
  static _ignoreDeps = ["db"];

  db;

  logger;

  constructor() {
    this.db = new Map();
  }

  getDb() {
    return this.db;
  }

  getLogger() {
    return this.logger;
  }

  async download(url, out, axiosConfig = {}) {
    return downloadUtils.downloadFile(url, out, axiosConfig);
  }

  async downloadFromInfo(url, outDir, axiosConfig = {}) {
    const logger = this.getLogger();
    const response = await _axios.get(url, axiosConfig).then((res) => res.data);
    const jobInfos = response.data;

    for (const info of jobInfos) {
      const { key, downloadUrl, fileName } = info;
      logger.info(`downloading job: "${key}"`);
      await this.download(
        downloadUrl,
        path.join(outDir, fileName),
        axiosConfig,
      );
    }
  }

  loadFromFile(modulePath, jobKey, importPrefix = "") {
    const db = this.getDb();
    const logger = this.getLogger();
    const module = require(path.join(importPrefix, modulePath));
    for (const subKey of Object.keys(module)) {
      const jobId = `${jobKey}/${subKey}`;
      db.set(jobId, module[subKey]);
      logger.info(`Loaded job: "${jobId}"`);
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
