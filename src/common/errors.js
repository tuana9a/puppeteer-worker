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

/**
 *
 * @param {Error} err
 */
function toErr(err) {
  return {
    name: err.name,
    message: err.message,
    stack: err.stack.split("\n"),
  };
}

module.exports = { PuppeteerDisconnectedError, JobNotFoundError, InvalidJobRequest, toErr };
