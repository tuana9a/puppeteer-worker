const fs = require("fs");
const toPrettyErr = require("./toPrettyErr");

class Logger {
  datetimeUtils;

  logDir;

  handler;

  handlers;

  constructor() {
    this.handler = this._cs;
    this.handlers = new Map();
    this.handlers.set("cs", this._cs.bind(this));
    this.handlers.set("fs", this._fs.bind(this));
  }

  /**
   * @param {*} object
   */
  _cs(object) {
    const now = new Date();
    let { data } = object;
    if (typeof data === "object") {
      data = JSON.stringify(data, null, "  ");
    }
    const record = `${this.datetimeUtils.getFull(now)} [${object.type}] ${data}\n`;
    // eslint-disable-next-line no-console
    console.log(record);
  }

  /**
   * @param {*} object
   */
  _fs(object) {
    const now = new Date();
    let { data } = object;
    if (typeof data === "object") {
      data = JSON.stringify(data);
    }
    const record = `${this.datetimeUtils.getFull(now)} [${object.type}] ${data}\n`;
    const filepath = `${this.logDir + this.datetimeUtils.getDate(now)}.log`;
    fs.appendFileSync(filepath, record);
  }

  /**
   * @param {string} handlerName
   */
  use(handlerName) {
    this.handler = this.handlers.get(handlerName);
  }

  setLogDir(logDir) {
    this.logDir = logDir;
  }

  info(data) {
    this.log({ type: "INFO", data });
  }

  warn(data) {
    this.log({ type: "WARN", data });
  }

  /**
   * @param {Error} err
   */
  error(err) {
    this.log({ type: "ERROR", data: toPrettyErr(err) });
  }

  /**
   * @param {*} object
   */
  log(object) {
    if (this.handler) {
      this.handler(object);
    }
  }
}

module.exports = Logger;
