const Config = require("../../src/common/config");
const configUtils = require("../../src/common/config.utils");

describe("test config", () => {
  test("should match default value", () => {
    const config = new Config();
    expect(config.toObj()).toEqual({
      tmpDir: "./.tmp/",
      logDest: "cs",
      logDir: "./logs/",
      secret: undefined,
      jobDir: "./.tmp/",
      accessToken: undefined,
      controlPlaneUrl: undefined,
      jobImportPrefix: "",
      repeatPollJobsAfter: 5000,
      maxTry: 10,
      puppeteerMode: "default",
      puppeteerLaunchOption: {
        defaultViewport: {
          width: 1920,
          height: 1080,
        },
        slowMo: 10,
      },
    });
  });

  test("should match updated value", () => {
    const config = new Config();
    configUtils.updateFromObject(config, {
      tmpDir: ".tmp/",
      secret: "iloveyou",
      maxTry: 11,
      puppeteerMode: "visible",
    });
    expect(config.toObj()).toEqual({
      tmpDir: ".tmp/",
      logDest: "cs",
      logDir: "./logs/",
      secret: "iloveyou",
      jobDir: "./.tmp/",
      accessToken: undefined,
      controlPlaneUrl: undefined,
      jobImportPrefix: "",
      repeatPollJobsAfter: 5000,
      maxTry: 11,
      puppeteerMode: "visible",
      puppeteerLaunchOption: {
        headless: false,
        slowMo: 10,
        defaultViewport: null,
      },
    });
  });
});
