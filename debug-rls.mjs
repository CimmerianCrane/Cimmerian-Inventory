import puppeteer from 'puppeteer';

const url = 'http://localhost:5173';
const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });

const responses = [];
page.on('response', async (resp) => {
  const u = resp.url();
  if (u.includes('supabase.co')) {
    try {
      let body = '';
      try { body = await resp.text(); } catch (e) {}
      responses.push({ method: resp.request().method(), url: u, status: resp.status(), body: body.substring(0, 3000) });
    } catch (e) {}
  }
});

await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });
await page.waitForSelector('input[type="email"]', { timeout: 5000 });
await page.type('input[type="email"]', 'info1@cimmeriancrane.com');
await page.type('input[type="password"]', 'Ytrtretre123!');
await page.click('button[type="submit"]');
await new Promise(r => setTimeout(r, 3000));

// Try to query pg_policies directly
const results = await page.evaluate(async () => {
  const out = {};
  const mod = await import('/src/lib/supabase.js');
  const supabase = mod.supabase;

  // Try direct query on pg_policies
  try {
    const r1 = await supabase.from('pg_policies').select('*').eq('tablename', 'parts');
    out.pg_policies = { error: r1.error?.message, data: r1.data, status: r1.status };
  } catch (e) {
    out.pg_policies = { error: e.message };
  }

  // Try information_schema
  try {
    const r2 = await supabase.from('information_schema.tables').select('*').eq('table_name', 'parts');
    out.info_tables = { error: r2.error?.message, data: r2.data };
  } catch (e) {
    out.info_tables = { error: e.message };
  }

  // Try OpenAPI
  try {
    const r3 = await fetch('https://ksflqphtbrqpmiezjeye.supabase.co/rest/v1/', {
      headers: { apikey: 'eyJhbGciOiJIUzI1NiIs...', authorization: 'Bearer eyJhbGciOiJIUzI1NiIs...' }
    });
    out.openapi_status = r3.status;
  } catch (e) {
    out.openapi_error = e.message;
  }

  // Try to see if there's a `shared` or `user_email` column or something
  const moreCols = ['user_email', 'created_by_email', 'visibility', 'access', 'permissions'];
  out.moreCols = {};
  for (const col of moreCols) {
    const r = await supabase.from('parts').select(col).limit(1);
    out.moreCols[col] = r.error?.message || 'OK';
  }

  return out;
});

console.log('=== RLS CHECK ===');
console.log(JSON.stringify(results, null, 2));

console.log('\n=== RESPONSES (filtered for relevant) ===');
for (const r of responses) {
  if (r.body && (r.body.includes('policy') || r.body.includes('rls') || r.url.includes('pg_'))) {
    console.log(`${r.method} ${r.status} ${r.url}`);
    console.log(`  ${r.body}`);
  }
}

await browser.close();
console.log('Done');