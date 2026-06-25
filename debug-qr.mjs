import puppeteer from 'puppeteer';
import { mkdirSync } from 'fs';

const url = 'http://localhost:5173';
const outputDir = './temporary screenshots';
mkdirSync(outputDir, { recursive: true });

const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--use-fake-ui-for-media-stream', '--use-fake-device-for-media-stream'] });
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });

page.on('console', msg => console.log('[BROWSER]', msg.type(), msg.text()));
page.on('pageerror', err => console.log('[PAGEERROR]', err.message));

await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });
await page.waitForSelector('input[type="email"]', { timeout: 5000 });
await page.type('input[type="email"]', 'info1@cimmeriancrane.com');
await page.type('input[type="password"]', 'Ytrtretre123!');
await page.click('button[type="submit"]');
await new Promise(r => setTimeout(r, 3000));

// Screenshot 1: dashboard with new Scan QR button
await page.screenshot({ path: `${outputDir}/qr-1-dashboard.png`, fullPage: true });
console.log('Saved qr-1-dashboard.png');

// Find the first row's view (eye) icon button
const viewButtons = await page.$$('button[title="View details & QR"]');
console.log('View buttons found:', viewButtons.length);
if (viewButtons.length > 0) {
  await viewButtons[0].click();
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: `${outputDir}/qr-2-detail-modal.png`, fullPage: true });
  console.log('Saved qr-2-detail-modal.png');

  // Click Print Label
  const printBtn = await page.evaluateHandle(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    return btns.find(b => b.textContent.includes('Print Label'));
  });
  if (printBtn) {
    await printBtn.asElement()?.click();
    // Wait for printingPart state to mount the print label
    await new Promise(r => setTimeout(r, 600));
    // Set print media emulation then screenshot
    await page.emulateMediaType('print');
    await new Promise(r => setTimeout(r, 500));
    await page.screenshot({ path: `${outputDir}/qr-3-print-label.png`, fullPage: true });
    console.log('Saved qr-3-print-label.png (print media)');
    await page.emulateMediaType('screen');
    await new Promise(r => setTimeout(r, 300));
  }

  // Close detail modal
  await page.keyboard.press('Escape');
  await new Promise(r => setTimeout(r, 500));
}

// Find Scan QR button
const scanBtn = await page.evaluateHandle(() => {
  const btns = Array.from(document.querySelectorAll('button'));
  return btns.find(b => /scan qr/i.test(b.textContent));
});
if (scanBtn) {
  await scanBtn.asElement()?.click();
  await new Promise(r => setTimeout(r, 1500));
  await page.screenshot({ path: `${outputDir}/qr-4-scanner.png`, fullPage: true });
  console.log('Saved qr-4-scanner.png');
}

await browser.close();
console.log('Done');