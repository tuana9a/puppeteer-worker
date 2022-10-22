const Config = require("../../src/common/Config");

describe("test config", () => {
  test("should match default value", () => {
    const config = new Config();
    config.setDefaultIfFalsy();
    expect(config.toSimpleObject()).toEqual({
      configFile: undefined,
      workerId: expect.any(String),
      workerType: "http",
      tmpDir: "./tmp/",
      logDest: "cs",
      logDir: "./logs/",
      secret: undefined,
      jobDir: "./jobs/",
      accessToken: undefined,
      httpWorkerPullConfigUrl: undefined,
      jobImportPrefix: "../../",
      repeatPollJobsAfter: 5000,
      rabbitmqConnectionString: undefined,
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
    config.updateFromObject({
      tmpDir: "otherTmpDir",
      secret: "iloveyou",
      maxTry: 11,
      puppeteerMode: "visible",
      repeatPollJobsAfter: 5000,
    });
    expect(config.toSimpleObject()).toEqual({
      configFile: undefined,
      tmpDir: "otherTmpDir",
      logDest: undefined,
      logDir: undefined,
      secret: "iloveyou",
      jobDir: undefined,
      accessToken: undefined,
      httpWorkerPullConfigUrl: undefined,
      rabbitmqConnectionString: undefined,
      repeatPollJobsAfter: 5000,
      jobImportPrefix: undefined,
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
