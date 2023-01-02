const puppeteer = require("puppeteer-core");
const PuppeteerWorker = require("../dist/PuppeteerWorker").default;
const {
  For,
  BringToFront,
  GoTo,
  WaitForTimeout,
  TypeIn,
  Click,
  GetValueFromParams,
  ScreenShot,
  If,
  BreakPoint,
  GetTextContent,
  Job,
  SetVars,
} = require("puppeteer-worker-job-builder");

const supplier = () => new Job({
  name: "testSetVars",
  actions: [
    SetVars(x => (x.urls = [])),
    For(GetValueFromParams((x) => x.urls)).Each([
      (x) => GoTo(x),
      WaitForTimeout(1000),
      (x) => ScreenShot(null, `./tmp/${x.replace(/\W+/g, "_")}.png`, "png"),
      (x) => If(GetValueFromParams(x => x)).Then([
        SetVars(x1 => x1.urls.push(x))
      ])
    ]),
  ],
});

async function main() {
  const browser = await puppeteer.launch({
    "slowMo": 10,
    headless: false,
    defaultViewport: null,
    // "defaultViewport": {
    //   "width": 1920,
    //   "height": 1080
    // },
    "executablePath": "google-chrome-stable"
  });

  const puppeteerWorker = new PuppeteerWorker(browser);

  let job = supplier();

  job.params = { urls: ["https://twitter.com", "https://tuana9a.cronitorstatus.com/"] };
  job.libs = {};

  const output = await puppeteerWorker.do(job);
  console.log(JSON.stringify(output, null, 2));
}

main();