import { Job, DoingInfo, Context } from "puppeteer-worker-job-builder/v1";
import RunContext from "./RunContext";

export default class PuppeteerWorker {
  async do(job: Job, ctx: {
    page: any;

    libs: any;

    params: any;

    // eslint-disable-next-line no-unused-vars
    onDoing?: (info: DoingInfo) => Promise<any>;
  }) {
    const context = new Context({
      jobName: job.name,
      page: ctx.page,
      libs: ctx.libs,
      params: ctx.params,
      _onDoing: ctx.onDoing || (() => null),
      currentStepIdx: 0,
      currentNestingLevel: 0,
      isBreak: false,
      logs: [],
      outputs: [],
      runContext: RunContext,
      stacks: Array.from(job.actions).reverse(),
      actionsToDestroy: [],
    });
    const logs = await RunContext(context);
    return logs;
  }
}
