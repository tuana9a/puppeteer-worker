const puppeteer = require("puppeteer-core");
const PuppeteerWorker = require("../dist/PuppeteerWorker").default;
const {
  For,
  // BringToFront,
  GoTo,
  WaitForTimeout,
  // TypeIn,
  // Click,
  GetValueFromParams,
  ScreenShot,
  // If,
  // BreakPoint,
  // GetTextContent,
  Job,
  If,
  IsEqual,
  IsStrictEqual,
} = require("puppeteer-worker-job-builder");

const supplier = () => new Job({
  name: "TestIsEqual",
  actions: [
    For(GetValueFromParams((params) => params.urls)).Each([
      (url) => GoTo(url),
      WaitForTimeout(1000),
      (url) => If(url == "https://genpasswd1.tuana9a.com").Then([
        ScreenShot(null, `./tmp/${url.replace(/\W+/g, "_")}.png`, "png"),
      ]),
      (url) => If(IsEqual(url, "https://genpasswd2.tuana9a.com")).Then([
        ScreenShot(null, `./tmp/${url.replace(/\W+/g, "_")}.png`, "png"),
      ]),
      (url) => If(IsStrictEqual(url, "https://genpasswd3.tuana9a.com")).Then([
        ScreenShot(null, `./tmp/${url.replace(/\W+/g, "_")}.png`, "png"),
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

  job.params = {
    urls: [
      "https://genpasswd.tuana9a.com",
      "https://genpasswd1.tuana9a.com",
      "https://genpasswd2.tuana9a.com",
      "https://genpasswd3.tuana9a.com",
    ]
  };
  job.libs = {};

  const output = await puppeteerWorker.do(job);
  console.log(JSON.stringify(output, null, 2));
}

main();