import {
  LaunchOptions,
  BrowserLaunchArgumentOptions,
  BrowserConnectOptions,
  Browser,
  Page
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
  scheduleDir: string;

  httpWorkerPullConfigUrl: string;

  rabbitmqConnectionString: string;

  puppeteerMode: string;
  puppeteerLaunchOption: LaunchOptions &
    BrowserLaunchArgumentOptions &
    BrowserConnectOptions & {
      product?: Product;
      extraPrefsFirefox?: Record<string, unknown>;
    };
}

class PuppeteerClient {
  config: Config;

  async launch(): Promise<PuppeteerClient>;

  onDisconnect(handler: Function): PuppeteerClient;

  getBrowser(): Browser;

  async getPageByIndex(index: number): Promise<Page>;

  async getFistPage(): Promise<Page>;
}

class RabbitMQWorker {
  start(): void;
}

class HttpWorker {
  async downloadJob(url: string, jobDir: string, headers?: any): Promise<void>;
  async start(): Promise<void>;
}

class StandaloneWorker {
  async start(): Promise<void>;
}

class WorkerController {
  loadConfig(_config?: Config): void;
  prepareWorkDirs(): void;
  prepareJobTemplate(): void;
  exit(): void;
  puppeteer(): PuppeteerClient;
  rabbit(): RabbitMQWorker;
  http(): HttpWorker;
  standalone(): StandaloneWorker;
  auto(): RabbitMQWorker | HttpWorker | StandaloneWorker;
  getConfig(): Config;
}

export async function launch(config: Config): Promise<WorkerController>;
