import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  // Intercept console messages
  page.on('console', msg => console.log('BROWSER:', msg.text()));
  
  await page.goto('http://localhost:3000/en');
  
  // Inject a console log into the language switcher logic
  await page.evaluate(() => {
    // find buttons
    const buttons = Array.from(document.querySelectorAll('button'));
    const msButton = buttons.find(b => b.textContent.trim() === 'MS');
    if (msButton) {
        console.log("Found MS button, clicking...");
        msButton.click();
    } else {
        console.log("Not found MS button. Buttons: " + buttons.map(b => b.textContent).join(","));
    }
  });
  
  await page.waitForNavigation({ waitUntil: 'networkidle0' }).catch(() => {});
  console.log("NEW URL:", page.url());
  
  await browser.close();
  process.exit(0);
})();
