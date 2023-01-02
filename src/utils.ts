import { Browser } from "puppeteer-core";

export async function ensurePageCount(browser: Browser, count: number) {
  const pages = await browser.pages();
  const missing = Math.max(0, count - pages.length);
  for (let i = 0; i < missing; i++) {
    await browser.newPage();
  }
}
