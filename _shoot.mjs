import puppeteer from 'puppeteer-core';

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const URL = process.argv[2] || 'http://localhost:5175/';
const theme = process.argv[3] || 'dark';
const selectors = (process.argv[4] || 'origin').split(',');
const w = parseInt(process.argv[5] || '1440', 10);
const h = parseInt(process.argv[6] || '900', 10);
const wheel = parseInt(process.argv[7] || '0', 10); // extra wheel px after centering

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: 'new',
  args: ['--no-sandbox', '--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--hide-scrollbars'],
  defaultViewport: { width: w, height: h, deviceScaleFactor: 1 },
});
const page = await browser.newPage();
await page.evaluateOnNewDocument((t) => {
  localStorage.setItem('theme-storage', JSON.stringify({ state: { theme: t }, version: 0 }));
}, theme);
await page.goto(URL, { waitUntil: 'networkidle2' });
await sleep(1200);

for (const sel of selectors) {
  await page.evaluate((id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ block: 'start', behavior: 'auto' });
  }, sel);
  await sleep(1200);
  await page.screenshot({ path: `/tmp/shots/${sel}-${theme}.png` });
  console.log('shot', `${sel}-${theme}`);

  if (wheel > 0) {
    await page.mouse.move(w / 2, h / 2);
    let done = 0;
    while (done < wheel) { await page.mouse.wheel({ deltaY: 300 }); done += 300; await sleep(60); }
    await sleep(900);
    await page.screenshot({ path: `/tmp/shots/${sel}-${theme}-b.png` });
    console.log('shot', `${sel}-${theme}-b`);
  }
}
await browser.close();
