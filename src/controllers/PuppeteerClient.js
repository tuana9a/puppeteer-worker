const puppeteer = require("puppeteer");

class PuppeteerClient {
  config;

  async launch() {
    this.browser = await puppeteer.launch(this.config.puppeteerLaunchOption);
    return this;
  }

  onDisconnect(handler) {
    this.browser.on("disconnected", handler);
    return this;
  }

  getBrowser() {
    return this.browser;
  }

  async getPageByIndex(index) {
    const pages = await this.browser.pages();
    return pages[index];
  }

  async getFirstPage() {
    return this.getPageByIndex(0);
  }
}

module.exports = PuppeteerClient;
