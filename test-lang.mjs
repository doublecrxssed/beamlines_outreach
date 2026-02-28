import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  // Intercept console messages
  page.on('console', msg => console.log('BROWSER:', msg.text()));
  
  await page.goto('http://localhost:3000/en');
  
  await page.evaluate(() => {
    const p = window.location.pathname;
    console.log("pathname:", p);
    const existingLangs = ['en', 'hi', 'ms', 'fr', 'es'];
    const segments = p.split('/');
    if (segments[0] !== '') segments.unshift('');
    console.log("segments:", segments);
    console.log("is existing:", existingLangs.includes(segments[1]));
  });
  
  await browser.close();
  process.exit(0);
})();
