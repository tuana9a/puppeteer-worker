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
  // If,
  BreakPoint,
  // GetTextContent,
  Job,
} = require("puppeteer-worker-job-builder");

const supplier = () => new Job({
  name: "TestLoop2",
  actions: [
    For([
      ["https://youtube.com", "https://twitter.com"],
      ["https://facebook.com", "https://reddit.com"],
    ]).Each([
      (x) => For(x).Each([
        (x1) => GoTo(x1),
        WaitForTimeout(1000),
        BreakPoint(), // Only youtube and facebook is logged
        (x1) => ScreenShot(null, `./tmp/${x1.replace(/\W+/g, "_")}.png`, "png"),
      ]),
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

  job.params = {};
  job.libs = {};

  const output = await puppeteerWorker.do(job);
  console.log(JSON.stringify(output, null, 2));
}

main();
