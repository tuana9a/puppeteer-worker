import {
  LaunchOptions,
  BrowserLaunchArgumentOptions,
  BrowserConnectOptions,
} from "puppeteer";

class Config {
  tmpDir: string = "./tmp/";

  logDest: string = "cs";
  logDir: string = "./logs/";

  secret: string = undefined;
  accessToken: string = undefined;

  maxTry: Number = 10;

  jobDir: string = "./jobs/";
  jobImportPrefix: string = "";

  httpWorkerPullConfigUrl: string = undefined;
  repeatPollJobsAfter: Number = 5000;

  rabbitmqConnectionString: string;

  puppeteerMode: string = "default";
  puppeteerLaunchOption: LaunchOptions &
    BrowserLaunchArgumentOptions &
    BrowserConnectOptions & {
      product?: Product;
      extraPrefsFirefox?: Record<string, unknown>;
    };
}

class RabbitMQWorker {
  constructor();

  getWorkerId(): string;

  start(): void;
}

class HttpWorker {
  async downloadJob(url: string, jobDir: string, headers?: any): void;
  async start(): void;
}

export class WorkerController {
  constructor(_config?: Config);
  loadConfig(_config?: Config): void;
  prepareWorkspace(): void;
  async boot(): void;
  async start(): void;
  async stop(): void;
  rabbit(): RabbitMQWorker;
  http(): HttpWorker;
  getConfig(): Config;
}

export async function launch(_config: Config): Promise<WorkerController>;
