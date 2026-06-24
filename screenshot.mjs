import puppeteer from 'puppeteer';

const url = process.argv[2] || 'http://localhost:5173';
const outputDir = './temporary screenshots';

import { mkdirSync } from 'fs';
mkdirSync(outputDir, { recursive: true });

(async () => {
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });
  await new Promise(r => setTimeout(r, 1000));

  // Auto-increment filename
  let i = 1;
  while (true) {
    const path = `${outputDir}/screenshot-${i}.png`;
    try {
      await page.screenshot({ path, fullPage: true });
      console.log(`Screenshot saved: ${path}`);
      break;
    } catch {
      i++;
    }
  }

  await browser.close();
})();
