const config = require("../../src/common/config");

describe("test config", () => {
  test("should match default value", () => {
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
      scheduleDir: "./schedules/",
      accessToken: undefined,
      httpWorkerPullConfigUrl: undefined,
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
    config.updateFromObject({
      tmpDir: "otherTmpDir",
      secret: "iloveyou",
      maxTry: 11,
      puppeteerMode: "visible",
    });
    expect(config.toSimpleObject()).toEqual({
      workerType: "http",
      workerId: expect.any(String),
      configFile: undefined,
      tmpDir: "otherTmpDir",
      logDest: "cs",
      logDir: "./logs/",
      secret: "iloveyou",
      jobDir: "./jobs/",
      scheduleDir: "./schedules/",
      accessToken: undefined,
      httpWorkerPullConfigUrl: undefined,
      rabbitmqConnectionString: undefined,
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
