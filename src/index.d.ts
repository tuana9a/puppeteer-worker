class ConfigTemplate {
  tmpDir: String = "./.tmp/";
  logDest: String = "fs";
  logDir: String = "./logs/";
  secret: String = "yoursecret";

  jobDir: String = "./.tmp/";
  jobImportPrefix: "../../";
  jobBaseUrl: String = "http://localhost:8080/api/jobs";
  jobAccessToken: String = "yoursecret";

  jobPollUrl: String = "http://localhost:8080/api/jobs/poll";
  jobPollRepeatAfter: String = 5000;

  jobInfoUrl: String = "http://localhost:8080/api/jobs/info";
  jobSubmitUrl: String = "http://localhost:8080/api/jobs/result";
  jobMaxTryCount: 10;

  puppeteerMode: "headless";
}

export class PuppeteerWorker {
  constructor();
  async start(__config: ConfigTemplate | void): void;
}
