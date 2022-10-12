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

class InvalidJobRequest extends Error {
  constructor(jobRequest) {
    super(`Inavlid Job Request: ${jobRequest}`);
  }
}

module.exports = { PuppeteerDisconnectedError, JobNotFoundError, InvalidJobRequest };
