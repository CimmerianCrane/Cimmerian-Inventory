import puppeteer from 'puppeteer';
import { mkdirSync } from 'fs';

const url = 'http://localhost:5173';
const outputDir = './temporary screenshots';
mkdirSync(outputDir, { recursive: true });

const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });

const supabaseResponses = [];

page.on('response', async (resp) => {
  const u = resp.url();
  if (u.includes('supabase.co/rest/v1/parts')) {
    try {
      let body = '';
      try {
        body = await resp.text();
      } catch (e) {}
      supabaseResponses.push({
        method: resp.request().method(),
        url: u,
        status: resp.status(),
        body: body.substring(0, 3000),
      });
    } catch (e) {}
  }
});

page.on('console', msg => {
  if (msg.type() === 'error') console.log('[BROWSER ERROR]', msg.text());
});

await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });
await page.waitForSelector('input[type="email"]', { timeout: 5000 });
await page.type('input[type="email"]', 'info1@cimmeriancrane.com');
await page.type('input[type="password"]', 'Ytrtretre123!');
await page.click('button[type="submit"]');
await new Promise(r => setTimeout(r, 4000));

console.log('=== SUPABASE RESPONSES ===');
for (const r of supabaseResponses) {
  console.log(`\n${r.method} ${r.status} ${r.url}`);
  console.log(`Body: ${r.body}`);
}

// Now let's try to make a direct API call with the user's session token
const token = await page.evaluate(() => {
  const key = Object.keys(localStorage).find(k => k.includes('supabase') || k.includes('auth'));
  if (!key) return null;
  const data = JSON.parse(localStorage.getItem(key));
  return data?.access_token || data?.currentSession?.access_token || null;
});

console.log('\n=== TOKEN ===');
console.log('Has token:', !!token);

// Test: query directly using fetch from the page
const directQuery = await page.evaluate(async () => {
  const key = Object.keys(localStorage).find(k => k.includes('supabase') || k.includes('auth'));
  if (!key) return { error: 'no auth key' };
  const data = JSON.parse(localStorage.getItem(key));
  const token = data?.access_token || data?.currentSession?.access_token;
  const projectUrl = 'https://ksflqphtbrqpmiezjeye.supabase.co';
  const apikey = data?.currentSession?.access_token ? null : null;

  // Get anon key from window if exposed, else use a fallback
  const supabaseUrl = 'https://ksflqphtbrqpmiezjeye.supabase.co';

  // Query parts with anon access (no auth)
  try {
    const res = await fetch(`${supabaseUrl}/rest/v1/parts?select=*&limit=5`, {
      headers: {
        'apikey': 'placeholder',
        'Authorization': `Bearer ${token}`,
      }
    });
    const text = await res.text();
    return { status: res.status, body: text.substring(0, 2000) };
  } catch (e) {
    return { error: e.message };
  }
});

console.log('\n=== DIRECT QUERY ===');
console.log(JSON.stringify(directQuery, null, 2));

await browser.close();
console.log('Done');