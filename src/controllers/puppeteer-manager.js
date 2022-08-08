const puppeteer = require("puppeteer");

class PuppeteerManager {
  logger;

  getLogger() {
    return this.logger;
  }

  /**
   * @param {puppeteer.LaunchOptions} launchOption
   */
  async launch(launchOption) {
    this.browser = await puppeteer.launch(launchOption);
    const logger = this.getLogger();
    this.browser.on("disconnected", () => {
      logger.error(new Error("puppeteer browser disconnected"));
      setTimeout(() => process.exit(0), 1000);
    });
    return this;
  }

  getBrowser() {
    return this.browser;
  }

  async getPageByIndex(index) {
    const tabs = await this.browser.pages();
    return tabs[index];
  }
}

module.exports = PuppeteerManager;
