import { Job, DoingInfo, Context } from "puppeteer-worker-job-builder";
import runContext from "./runContext";

export default class PuppeteerWorker {
  async do(job: Job, ctx: {
    page: any;

    libs: any;

    params: any;

    // eslint-disable-next-line no-unused-vars
    onDoing?: (info: DoingInfo) => Promise<any>;
  }) {
    const context = new Context({
      job: job.name,
      page: ctx.page,
      libs: ctx.libs,
      params: ctx.params,
      currentStepIdx: 0,
      currentNestingLevel: 0,
      isBreak: false,
      logs: [],
      runContext: runContext,
      stacks: Array.from(job.actions).reverse(),
    });
    context.onDoing(ctx.onDoing || (() => null));
    const logs = await runContext(context);
    return logs;
  }
}
