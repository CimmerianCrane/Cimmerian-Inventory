import puppeteer from 'puppeteer';
import { mkdirSync } from 'fs';

const url = 'http://localhost:5173';
const outputDir = './temporary screenshots';
mkdirSync(outputDir, { recursive: true });

const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });

page.on('console', msg => console.log('[BROWSER]', msg.type(), msg.text()));
page.on('pageerror', err => console.log('[PAGEERROR]', err.message));
page.on('requestfailed', req => console.log('[REQFAIL]', req.url(), req.failure()?.errorText));
page.on('response', resp => {
  if (resp.url().includes('supabase') || resp.url().includes('rest')) {
    console.log('[SUPABASE RESP]', resp.status(), resp.url());
  }
});

await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });
await page.waitForSelector('input[type="email"]', { timeout: 5000 });
await page.type('input[type="email"]', 'info1@cimmeriancrane.com');
await page.type('input[type="password"]', 'Ytrtretre123!');
await page.click('button[type="submit"]');
await new Promise(r => setTimeout(r, 3000));

// Click Add Part button
const buttons = await page.$$('button');
for (const btn of buttons) {
  const text = await page.evaluate(el => el.innerText, btn);
  if (text.includes('Add Part')) {
    await btn.click();
    break;
  }
}

await new Promise(r => setTimeout(r, 1000));
await page.screenshot({ path: `${outputDir}/debug-4-modal-open.png`, fullPage: true });

// Fill in part name
await page.waitForSelector('input[name="part_name"]', { timeout: 5000 });
await page.type('input[name="part_name"]', 'TEST_PART_DEBUG');

// Fill in part number
await page.type('input[name="part_number"]', 'TEST-001');

// Select first category from dropdown
await page.evaluate(() => {
  const sel = document.querySelector('select[name="category"]');
  if (sel && sel.options.length > 1) {
    sel.value = sel.options[1].value;
    sel.dispatchEvent(new Event('change', { bubbles: true }));
  }
});

// Set quantity
await page.evaluate(() => {
  const input = document.querySelector('input[name="quantity"]');
  if (input) {
    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
    nativeInputValueSetter.call(input, '5');
    input.dispatchEvent(new Event('input', { bubbles: true }));
  }
});

await page.screenshot({ path: `${outputDir}/debug-5-modal-filled.png`, fullPage: true });

// Click submit (Add Part button in modal)
const modalButtons = await page.$$('button[type="submit"]');
console.log('Submit buttons found:', modalButtons.length);
for (const btn of modalButtons) {
  await btn.click();
}

await new Promise(r => setTimeout(r, 2000));
await page.screenshot({ path: `${outputDir}/debug-6-after-save.png`, fullPage: true });

// Check what's on the page now
const afterSave = await page.evaluate(() => {
  return {
    bodyText: document.body.innerText.substring(0, 3000),
    tableRows: document.querySelectorAll('tbody tr').length,
    cardCount: document.querySelectorAll('.md\\:hidden > div').length,
  };
});
console.log('AFTER SAVE:', JSON.stringify(afterSave, null, 2));

await browser.close();
console.log('Done');