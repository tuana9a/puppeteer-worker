const puppeteer = require("puppeteer");

class PuppeteerClient {
  /**
   * @param {puppeteerLaunchOptions} launchOption
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
    const tabs = await this.browser.pages();
    return tabs[index];
  }
}

module.exports = PuppeteerClient;
