const fs = require("fs");
const _axios = require("axios");
const FormData = require("form-data");
const { Job, ActionPayload, InvalidJobError } = require("puppeteer-worker-job-builder/v1");

const axios = _axios.default.create();

class JobRunner {
  logger;

  puppeteerClient;

  /**
   *
   * @param {Job} job
   * @param {*} params
   * @returns
   */
  async run(job, params) {
    if (!Job.isValidJob(job)) {
      throw new InvalidJobError(job.name);
    }

    const logger = this.getLogger();
    const libs = {
      fs: fs,
      axios: axios,
      FormData: FormData,
    };
    const page = await this.getPuppeteerClient().getFirstPage();
    const payload = ActionPayload.from({
      currentIdx: 0,
      libs: libs,
      outputs: [],
      page: page,
      params: params,
    });
    const logs = [];

    for (const action of job.actions) {
      try {
        const output = await action.withPayload(payload).run();
        payload.outputs[payload.currentIdx] = output;
        logs.push({
          action: action.name,
          output: output,
          at: Date.now(),
        });
        if (action.isBreakPoint()) {
          if (output) {
            const { doWhenBreak } = action;
            if (doWhenBreak) {
              if (doWhenBreak.__isMeAction) {
                const nestedOutput = await doWhenBreak.withPayload(payload).run();
                logs.push({
                  action: action.name,
                  at: Date.now(),
                  output: nestedOutput,
                });
              } else if (Array.isArray(doWhenBreak)) {
                for (const actionWhenBreak of doWhenBreak) {
                  if (actionWhenBreak.__isMeAction) {
                    const nestedOutput = await actionWhenBreak.withPayload(payload).run();
                    logs.push({
                      action: action.name,
                      at: Date.now(),
                      output: nestedOutput,
                    });
                  }
                }
              } else { // function
                const nestedOutput = await doWhenBreak(payload);
                logs.push({
                  action: action.name,
                  at: Date.now(),
                  output: nestedOutput,
                });
              }
            }
            break;
          }
        }
      } catch (err) {
        logs.push({
          action: action.name,
          at: Date.now(),
          err: {
            name: err.name,
            message: err.message,
            stack: err.stack.split("\n"),
          },
        });
        break;
      }
      payload.currentIdx += 1;
    }

    logger.info(logs);
    // logger.info(payload.outputs);

    return logs;
  }
}

module.exports = JobRunner;
