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
  Break,
} = require("puppeteer-worker-job-builder");

const supplier = () => new Job({
  name: "TestLoopBreaked",
  actions: [
    For([
      ["https://genpasswd1.tuana9a.com", "https://genpasswd2.tuana9a.com"],
      ["https://genpasswd3.tuana9a.com", "https://genpasswd4.tuana9a.com"],
    ]).Each([
      (x) => For(x).Each([
        (x1) => GoTo(x1),
        WaitForTimeout(1000),
        Break(), // Only genpasswd1 and genpasswd3
        // No ScreenShot taken because of break
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
