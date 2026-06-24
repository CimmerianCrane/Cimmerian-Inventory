import puppeteer from 'puppeteer';
import { mkdirSync } from 'fs';

const url = 'http://localhost:5173';
const outputDir = './temporary screenshots';
mkdirSync(outputDir, { recursive: true });

const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });

const responses = [];
page.on('response', async (resp) => {
  const u = resp.url();
  if (u.includes('supabase.co')) {
    try {
      let body = '';
      try {
        body = await resp.text();
      } catch (e) {}
      responses.push({
        method: resp.request().method(),
        url: u,
        status: resp.status(),
        body: body.substring(0, 5000),
      });
    } catch (e) {}
  }
});

await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });
await page.waitForSelector('input[type="email"]', { timeout: 5000 });
await page.type('input[type="email"]', 'info1@cimmeriancrane.com');
await page.type('input[type="password"]', 'Ytrtretre123!');
await page.click('button[type="submit"]');
await new Promise(r => setTimeout(r, 3000));

// Run queries directly from the page context using the Supabase client
const results = await page.evaluate(async () => {
  const out = {};

  // Get access details from localStorage
  const authKey = Object.keys(localStorage).find(k => k.startsWith('sb-') && k.includes('auth-token'));
  if (!authKey) return { error: 'No auth token in localStorage' };
  const session = JSON.parse(localStorage.getItem(authKey));

  // Try to use supabase client from window if exposed
  // Otherwise import the module
  const mod = await import('/src/lib/supabase.js');
  const supabase = mod.supabase;

  // Query: get count of all parts
  const allParts = await supabase
    .from('parts')
    .select('*', { count: 'exact', head: false })
    .order('id', { ascending: true })
    .limit(100);

  out.allPartsCount = allParts.count;
  out.allPartsData = allParts.data;
  out.allPartsError = allParts.error?.message;

  // Query: check if a user_id column exists by selecting it
  const withUserId = await supabase
    .from('parts')
    .select('id, user_id')
    .limit(1);

  out.withUserIdError = withUserId.error?.message;
  out.withUserIdKeys = withUserId.data?.[0] ? Object.keys(withUserId.data[0]) : null;

  // Query: check what columns exist by trying common ones
  const columnsToTest = ['name', 'part_name', 'title', 'description', 'sku'];
  out.columnTests = {};
  for (const col of columnsToTest) {
    const r = await supabase.from('parts').select(col).limit(1);
    out.columnTests[col] = r.error?.message || 'OK';
  }

  // Try inserting with user_id
  const insertWithUserId = await supabase
    .from('parts')
    .insert([{ part_name: 'TEST_DEBUG_X', user_id: session.user.id }])
    .select();

  out.insertWithUserIdError = insertWithUserId.error?.message;
  out.insertWithUserIdData = insertWithUserId.data;

  // Re-query after insert
  const afterInsert = await supabase
    .from('parts')
    .select('*')
    .order('part_name');

  out.afterInsertCount = afterInsert.data?.length;
  out.afterInsertFirstRow = afterInsert.data?.[0];

  // Try to delete the test row
  if (insertWithUserId.data?.[0]?.id) {
    const del = await supabase
      .from('parts')
      .delete()
      .eq('id', insertWithUserId.data[0].id);
    out.deleteError = del.error?.message;
  }

  return out;
});

console.log('=== QUERY RESULTS ===');
console.log(JSON.stringify(results, null, 2));

console.log('\n=== RAW RESPONSES ===');
for (const r of responses) {
  console.log(`\n${r.method} ${r.status} ${r.url}`);
  if (r.body) console.log(`Body: ${r.body}`);
}

await browser.close();
console.log('Done');