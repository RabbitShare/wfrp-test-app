import { Before, After, setDefaultTimeout } from "@cucumber/cucumber";
import { chromium, Browser, Page } from "@playwright/test";

setDefaultTimeout(30000);

const BASE_URL = "http://localhost:3000";

let browser: Browser;
let page: Page;

Before(async function () {
  browser = await chromium.launch({ headless: true });
  page = await browser.newPage();
  page.setDefaultTimeout(30000);
  (this as any).page = page;
  (this as any).baseUrl = BASE_URL;
});

After(async function () {
  if (page) {
    await page.close();
  }
  if (browser) {
    await browser.close();
  }
});
