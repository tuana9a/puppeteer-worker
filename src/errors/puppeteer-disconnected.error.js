class PuppeteerDisconnectedError extends Error {
  constructor() {
    super("Puppeteer is disconnected");
  }
}

module.exports = PuppeteerDisconnectedError;
