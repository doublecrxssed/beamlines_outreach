import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  await page.goto('http://localhost:3000/en');
  
  // Click MS
  console.log("Clicking MS...");
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const msButton = buttons.find(b => b.textContent.trim() === 'MS');
    if (msButton) msButton.click();
  });
  
  await new Promise(r => setTimeout(r, 2000));
  console.log("URL 1:", page.url());
  
  // Click FR
  console.log("Clicking FR...");
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const frButton = buttons.find(b => b.textContent.trim() === 'FR');
    if (frButton) frButton.click();
  });
  
  await new Promise(r => setTimeout(r, 2000));
  console.log("URL 2:", page.url());
  
  await browser.close();
  process.exit(0);
})();
