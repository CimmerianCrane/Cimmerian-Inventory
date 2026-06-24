import puppeteer from 'puppeteer';
import { mkdirSync } from 'fs';

const url = 'http://localhost:5173';
const outputDir = './temporary screenshots';
mkdirSync(outputDir, { recursive: true });

const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });

// Capture console logs
page.on('console', msg => console.log('[BROWSER]', msg.type(), msg.text()));
page.on('pageerror', err => console.log('[PAGEERROR]', err.message));

await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });

// Wait for login form
await page.waitForSelector('input[type="email"]', { timeout: 5000 });

// Fill in credentials
await page.type('input[type="email"]', 'info1@cimmeriancrane.com');
await page.type('input[type="password"]', 'Ytrtretre123!');

// Take screenshot before submitting
await page.screenshot({ path: `${outputDir}/debug-1-login-filled.png`, fullPage: true });

// Submit
await page.click('button[type="submit"]');

// Wait for navigation away from login
await new Promise(r => setTimeout(r, 3000));

// Take screenshot after login
await page.screenshot({ path: `${outputDir}/debug-2-after-login.png`, fullPage: true });

// Wait a bit more for any data fetching
await new Promise(r => setTimeout(r, 2000));

// Take another screenshot after data load
await page.screenshot({ path: `${outputDir}/debug-3-dashboard.png`, fullPage: true });

// Check if there's an Add Part button and what's on the page
const pageContent = await page.evaluate(() => {
  return {
    title: document.title,
    bodyText: document.body.innerText.substring(0, 2000),
    hasAddButton: !!document.querySelector('button'),
    buttonTexts: Array.from(document.querySelectorAll('button')).map(b => b.innerText).slice(0, 20),
  };
});

console.log('PAGE CONTENT:', JSON.stringify(pageContent, null, 2));

await browser.close();
console.log('Done');