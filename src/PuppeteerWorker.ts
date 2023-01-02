import { Browser } from "puppeteer-core";
import { Context, Job, OnDoing } from "puppeteer-worker-job-builder";
import runContext from "./runContext";

export default class PuppeteerWorker {
  constructor(private browser?: Browser) { }

  setBrowser(browser: Browser) {
    this.browser = browser;
  }

  getBrowser() {
    return this.browser;
  }

  async getPage(index: number) {
    const pages = await this.browser.pages();
    return pages[index];
  }

  async getFirstPage() {
    return this.getPage(0);
  }

  async do(job: Job, opts: { pageIndex?: number; onDoing?: OnDoing } = { pageIndex: 0, onDoing: () => null }) {
    const page = await this.getPage(opts?.pageIndex || 0);
    const context = new Context({
      job: job.name,
      page: page,
      libs: job.libs,
      params: job.params,
      currentStepIdx: 0,
      currentNestingLevel: 0,
      isBreak: false,
      logs: [],
      runContext: runContext,
      stacks: Array.from(job.actions).reverse(),
      doing: opts?.onDoing,
    });
    await runContext(context);
    const { logs, vars } = context;
    return { logs, vars };
  }
}
