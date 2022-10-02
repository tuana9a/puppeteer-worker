import {
  LaunchOptions,
  BrowserLaunchArgumentOptions,
  BrowserConnectOptions,
} from "puppeteer";

class Config {
  tmpDir: String = "./tmp/";

  logDest: String = "cs";
  logDir: String = "./logs/";

  secret: String = undefined;
  accessToken: String = undefined;

  maxTry: Number = 10;

  jobDir: String = "./jobs/";
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
  constructor(_config?: Config);
  loadConfig(_config?: Config): void;
  prepareWorkspace(): void;
  async boot(): void;
  async start(): void;
  async stop(): void;
  getConfig(): Config;
}

export async function launch(_config: Config): Promise<PuppeteerWorker>;
