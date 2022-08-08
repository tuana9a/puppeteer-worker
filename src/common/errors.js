/* eslint-disable max-classes-per-file */

class InvalidTaskError extends Error {
  constructor(jobName) {
    super(`Invalid task from job "${jobName}"`);
  }
}

module.exports.InvalidTaskError = InvalidTaskError;

class CanNotGetPage extends Error {
  constructor() {
    super("Can not get page");
  }
}

module.exports.CanNotGetPage = CanNotGetPage;
