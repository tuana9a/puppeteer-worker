class InvalidJobError extends Error {
  constructor(job) {
    super(`Inavlid Job: ${job}`);
  }
}

module.exports = InvalidJobError;
