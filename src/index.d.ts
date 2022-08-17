import {
  LaunchOptions,
  BrowserLaunchArgumentOptions,
  BrowserConnectOptions,
} from "puppeteer";

class Config {
  tmpDir: String = "./.tmp/";

  logDest: String = "cs";
  logDir: String = "./logs/";

  secret: String = undefined;
  accessToken: String = undefined;

  maxTry: Number = 10;

  jobDir: String = "./.tmp/";
  jobImportPrefix: String = "";

  controlPlaneUrl: String = undefined;
  repeatPollJobsAfter: Number = 5000;

  puppeteerMode: String = "default";
  puppeteerLaunchOption: LaunchOptions &
    BrowserLaunchArgumentOptions &
    BrowserConnectOptions & {
      product?: Product;
      extraPrefsFirefox?: Record<string, unknown>;
    };
}

export class PuppeteerWorker {
  constructor(__config?: Config);
  async start(__config?: Config): void;
  getConfig(): Config;
}
