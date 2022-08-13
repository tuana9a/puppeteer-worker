const fs = require("fs");

class Logger {
  static _ignoreDeps = ["logDir", "handler", "handlers"];

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
   * @param {LogObject} object
   */
  _cs(object) {
    const now = new Date();
    let { data } = object;
    if (typeof data === "object") {
      data = JSON.stringify(data);
    }
    const record = `${this.datetimeUtils.getFull(now)} [${
      object.type
    }] ${data}\n`;
    // eslint-disable-next-line no-console
    console.log(record);
  }

  /**
   * @param {LogObject} object
   */
  _fs(object) {
    const now = new Date();
    let { data } = object;
    if (typeof data === "object") {
      data = JSON.stringify(data);
    }
    const record = `${this.datetimeUtils.getFull(now)} [${
      object.type
    }] ${data}\n`;
    const filepath = `${this.logDir + this.datetimeUtils.getDate(now)}.log`;
    fs.appendFileSync(filepath, record);
  }

  /**
   * @param {String} handlerName
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
  error(err, at = null) {
    this.log({ type: "ERROR", data: at });
    this.log({ type: "ERROR", data: err.stack });
  }

  /**
   * @param {LogObject} object
   */
  log(object) {
    if (this.handler) {
      this.handler(object);
    }
  }
}

module.exports = Logger;
