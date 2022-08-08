class JobManager {
  static _ignoreDeps = ["handler", "service"];

  service;

  handler;

  getJobService() {
    return this.service;
  }

  setJobService(jobService) {
    this.service = jobService;
  }

  registerHandler(handler) {
    this.handler = handler;
  }

  getJobHandler() {
    return this.handler;
  }

  async start() {
    const jobHandler = this.getJobHandler();
    const jobService = this.getJobService();
    jobService.start(jobHandler);
  }
}

module.exports = JobManager;
