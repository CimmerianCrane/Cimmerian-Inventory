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
      responses.push({ method: resp.request().method(), url: u, status: resp.status(), body: body.substring(0, 5000) });
    } catch (e) {}
  }
});

await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });
await page.waitForSelector('input[type="email"]', { timeout: 5000 });
await page.type('input[type="email"]', 'info1@cimmeriancrane.com');
await page.type('input[type="password"]', 'Ytrtretre123!');
await page.click('button[type="submit"]');
await new Promise(r => setTimeout(r, 3000));

// Run schema/policy investigation from the page
const results = await page.evaluate(async () => {
  const out = {};
  const mod = await import('/src/lib/supabase.js');
  const supabase = mod.supabase;

  // 1. Get full schema of parts by trying to query various columns
  const candidateColumns = [
    'id', 'part_name', 'part_number', 'category', 'quantity', 'min_stock',
    'supplier', 'location', 'notes', 'created_at', 'updated_at',
    'created_by', 'owner_id', 'tenant_id', 'org_id', 'company_id',
    'is_public', 'is_private', 'shared'
  ];
  out.existingColumns = [];
  for (const col of candidateColumns) {
    const r = await supabase.from('parts').select(col).limit(1);
    if (!r.error) out.existingColumns.push(col);
  }

  // 2. Try to query pg_policies to see RLS policies (usually restricted)
  try {
    const policiesQuery = await supabase.rpc('get_policies', { table_name: 'parts' });
    out.policiesQuery = policiesQuery;
  } catch (e) {
    out.policiesQuery = { error: e.message };
  }

  // 3. Try inserting a test row that SHOULD be visible
  const ins = await supabase
    .from('parts')
    .insert([{
      part_name: 'DEBUG_VISIBLE_TEST_' + Date.now(),
      part_number: 'DBG-' + Date.now(),
      quantity: 1,
      min_stock: 0,
    }])
    .select();
  out.insertError = ins.error?.message;
  out.insertedRow = ins.data?.[0];

  // 4. Re-query and see if this row is visible
  if (ins.data?.[0]?.id) {
    const reread = await supabase
      .from('parts')
      .select('*')
      .eq('id', ins.data[0].id);
    out.rereadError = reread.error?.message;
    out.rereadData = reread.data;

    // Cleanup
    await supabase.from('parts').delete().eq('id', ins.data[0].id);
  }

  // 5. Query all parts with count
  const allWithCount = await supabase
    .from('parts')
    .select('*', { count: 'exact' })
    .limit(1);
  out.allCount = allWithCount.count;
  out.allError = allWithCount.error?.message;

  return out;
});

console.log('=== INVESTIGATION RESULTS ===');
console.log(JSON.stringify(results, null, 2));

console.log('\n=== RAW RESPONSES (last 20) ===');
for (const r of responses.slice(-20)) {
  console.log(`${r.method} ${r.status} ${r.url}`);
  if (r.body && r.status >= 400) console.log(`  Body: ${r.body}`);
}

await browser.close();
console.log('Done');