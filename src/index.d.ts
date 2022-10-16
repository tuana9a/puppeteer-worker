import {
  LaunchOptions,
  BrowserLaunchArgumentOptions,
  BrowserConnectOptions,
} from "puppeteer";

class Config {
  workerType: string;
  tmpDir: string;

  logDest: string;
  logDir: string;

  secret: string;
  accessToken: string;

  maxTry: Number;

  jobDir: string;
  jobImportPrefix: string;

  httpWorkerPullConfigUrl: string;
  repeatPollJobsAfter: Number;

  rabbitmqConnectionString: string;

  puppeteerMode: string;
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
  auto(): RabbitMQWorker | HttpWorker;
  getConfig(): Config;
}

export async function launch(_config: Config): Promise<WorkerController>;
