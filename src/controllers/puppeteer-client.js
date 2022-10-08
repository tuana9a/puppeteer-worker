const puppeteer = require("puppeteer");

class PuppeteerClient {
  /**
   * @param {puppeteer.LaunchOptions} launchOption
   */
  async launch(launchOption, onDisconnect = null) {
    this.browser = await puppeteer.launch(launchOption);
    if (onDisconnect) {
      this.browser.on("disconnected", onDisconnect);
    }
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
