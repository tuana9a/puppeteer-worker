/* eslint-disable max-classes-per-file */

class PuppeteerDisconnectedError extends Error {
  constructor() {
    super("Puppeteer is disconnected");
  }
}

class JobNotFoundError extends Error {
  constructor(id) {
    super(`Job not found: ${id}`);
  }
}

class InvalidJobError extends Error {
  constructor(job) {
    super(`Inavlid Job: ${job}`);
  }
}

module.exports = {
  PuppeteerDisconnectedError,
  JobNotFoundError,
  InvalidJobError,
};
