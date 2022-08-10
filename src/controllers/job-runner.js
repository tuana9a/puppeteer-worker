const fs = require("fs");
const axios = require("axios");
const FormData = require("form-data");
const errors = require("../common/errors");

const _axios = axios.default.create();

class JobRunner {
  jobValidation;

  logger;

  getJobValidation() {
    return this.jobValidation;
  }

  getLogger() {
    return this.logger;
  }

  async run({ id, tasks, page, input, ctx: extraCtx }) {
    const jobValidation = this.getJobValidation();
    const logger = this.getLogger();

    // đảm bảo là có job, nếu không thì lỗi chưa check ở tiền xử lý
    if (!jobValidation.isValidTasks(tasks)) {
      throw new errors.InvalidTaskError(id);
    }

    // prepare opt
    const ctx = {
      ...extraCtx,
      input,
      page,
      fs,
      axios: _axios,
      FormData,
    };

    const result = {
      name: id,
      input: input,
      logs: [],
      isCompleted: true,
      created: Date.now(),
    };

    for (const task of tasks) {
      let output = { messages: [] };

      try {
        output = await task.run(ctx);
      } catch (err) {
        logger.error(err);
        output.isServerError = true;
        output.messages.push({
          name: err.name,
          message: err.message,
          stack: err.stack.split("\n"),
        });
      }

      const logRecord = {
        task: task.run.name,
        output,
        at: Date.now(),
      };

      result.logs.push(logRecord);

      // check xem có cần add lịch sử không
      if (task.needToLog) {
        logger.info(`output: ${JSON.stringify(logRecord, null, 2)}`);
      }

      // check xem có break không ?
      if (task.breaker) {
        if (task.breaker(output)) {
          logRecord.breaker = { name: task.breaker.name, isBreak: true };
          result.isCompleted = false;
          break;
        }
      }
    }

    return result;
  }
}

module.exports = JobRunner;
