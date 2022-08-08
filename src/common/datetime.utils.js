class DateTimeUtils {
  getDate(date = new Date()) {
    const y = date.getFullYear();
    const m = date.getMonth() + 1; // 0 -> 11
    const d = date.getDate();
    return `${y}-${m > 9 ? m : `0${m}`}-${d > 9 ? d : `0${d}`}`;
  }

  getTime(date = new Date()) {
    const h = date.getHours();
    const m = date.getMinutes();
    const s = date.getSeconds();
    return `${h > 9 ? h : `0${h}`}:${m > 9 ? m : `0${m}`}:${
      s > 9 ? s : `0${s}`
    }`;
  }

  getFull(date = new Date()) {
    return `${this.getDate(date)} ${this.getTime(date)}`;
  }
}
module.exports = DateTimeUtils;
