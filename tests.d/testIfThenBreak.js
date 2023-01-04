const puppeteer = require("puppeteer-core");
const PuppeteerWorker = require("../dist/PuppeteerWorker").default;
const {
  For,
  // BringToFront,
  GoTo,
  WaitForTimeout,
  // TypeIn,
  // Click,
  // GetValueFromParams,
  ScreenShot,
  If,
  BreakPoint,
  // GetTextContent,
  Job,
  IsEqual,
  CurrentUrl,
  Break,
} = require("puppeteer-worker-job-builder");

const supplier = () => new Job({
  name: "TestIfThenBreak",
  actions: [
    GoTo("https://genpasswd1.tuana9a.com/"),
    WaitForTimeout(1000),
    If(true).Then([
      Break(),
    ]),
    // No ScreenShot taken
    ScreenShot(null, "./tmp/I-am-invisible.png", "png")
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

  job.params = {};
  job.libs = {};

  const output = await puppeteerWorker.do(job);
  console.log(JSON.stringify(output, null, 2));
}

main();