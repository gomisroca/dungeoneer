import { env } from '@/env';
import puppeteer, { type Browser, type Page } from 'puppeteer';

declare global {
  // eslint-disable-next-line no-var
  var _browser: Browser | null;
}

global._browser = global._browser ?? null;

export const getBrowser = async (): Promise<Browser> => {
  if (!global._browser) {
    console.log('Launching new Puppeteer instance...');
    const launchArgs = JSON.stringify({
      headless: false,
      timeout: 60000,
    });

    global._browser = await puppeteer.connect({
      browserWSEndpoint: `wss://production-sfo.browserless.io?token=${env.BROWSERLESS_TOKEN}&launch=${launchArgs}`,
    });
  }
  return global._browser;
};

export const getPage = async (): Promise<Page> => {
  const browser = await getBrowser();
  return await browser.newPage();
};

export const closeBrowser = async () => {
  if (global._browser) {
    console.log('Closing Puppeteer instance...');
    await global._browser.close();
    global._browser = null;
  }
};
