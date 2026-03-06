const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  
  console.log("Navigating to http://localhost:3000...");
  await page.goto('http://localhost:3000');
  
  // Wait for React to hydrate
  await new Promise(r => setTimeout(r, 2000));
  
  // Check initial state
  const initialTheme = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
  console.log("Initial data-theme:", initialTheme);
  
  // Find and click the toggle button
  console.log("Clicking High Contrast Toggle...");
  await page.click('button[title="Enable High Contrast"]');
  
  // Wait a moment for Zustand and CSS to update
  await new Promise(r => setTimeout(r, 1000));
  
  // Check new state
  const newTheme = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
  console.log("New data-theme:", newTheme);
  
  // Check a specific CSS variable value
  const bgVar = await page.evaluate(() => {
    const root = document.querySelector(':root');
    return getComputedStyle(root).getPropertyValue('--color-space-950');
  });
  console.log("Background --color-space-950 is now:", bgVar);
  
  await browser.close();
})();
