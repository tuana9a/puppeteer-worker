class InvalidJobError extends Error {
  constructor(job) {
    super(`Invalid Job: ${job}`);
  }
}

module.exports = InvalidJobError;
