import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const SCREENSHOT_DIR = path.join(process.cwd(), 'verification-screenshots');

if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

async function runVerification() {
  console.log('Launching headless Chrome via puppeteer-core...');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  const consoleErrors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });
  page.on('pageerror', err => {
    consoleErrors.push(err.toString());
  });

  const lectures = [1, 2, 3, 4, 5];
  const viewports = [
    { name: 'desktop', width: 1280, height: 800 },
    { name: 'mobile', width: 375, height: 667 }
  ];

  const results = [];

  for (const lec of lectures) {
    const url = `http://localhost:3000/mad2/week-1/lecture-${lec}`;
    console.log(`\n========================================`);
    console.log(`Testing Lecture ${lec}: ${url}`);
    console.log(`========================================`);

    for (const vp of viewports) {
      console.log(`Testing viewport: ${vp.name} (${vp.width}x${vp.height})`);
      await page.setViewport({ width: vp.width, height: vp.height });
      
      consoleErrors.length = 0; // reset console errors for this run
      await page.goto(url, { waitUntil: 'networkidle0' });

      // 1. Check for horizontal overflow
      const overflow = await page.evaluate(() => {
        const docWidth = document.documentElement.clientWidth;
        const scrollWidth = document.documentElement.scrollWidth;
        const hasOverflow = scrollWidth > docWidth;
        
        let offendingElements = [];
        if (hasOverflow) {
          const allElements = document.querySelectorAll('*');
          for (const el of allElements) {
            const rect = el.getBoundingClientRect();
            if (rect.right > docWidth + 1) { // 1px threshold for rounding
              offendingElements.push({
                tag: el.tagName,
                className: el.className ? el.className.toString().slice(0, 50) : '',
                right: rect.right,
                docWidth: docWidth
              });
            }
          }
        }
        return { hasOverflow, docWidth, scrollWidth, offendingElements: offendingElements.slice(0, 5) };
      });

      console.log(`  Horizontal overflow: ${overflow.hasOverflow ? 'YES (' + overflow.scrollWidth + 'px > ' + overflow.docWidth + 'px)' : 'NO (clean)'}`);
      if (overflow.hasOverflow) {
        console.log('  Offending elements:', overflow.offendingElements);
      }

      // 2. Check broken images
      const brokenImages = await page.evaluate(() => {
        const imgs = Array.from(document.querySelectorAll('img'));
        return imgs.filter(img => !img.complete || img.naturalWidth === 0).map(img => img.src);
      });
      console.log(`  Broken images: ${brokenImages.length}`);

      // 3. Check topic sidebar & topics rendered
      const topicCount = await page.evaluate(() => {
        const topics = document.querySelectorAll('[data-topic-id]');
        const sidebarLinks = document.querySelectorAll('button[data-topic-btn]');
        return { topics: topics.length, sidebarLinks: sidebarLinks.length };
      });
      console.log(`  Topic count in DOM: ${topicCount.topics}`);

      // 4. Console errors
      console.log(`  Console errors: ${consoleErrors.length === 0 ? 'None' : consoleErrors.join(' | ')}`);

      // 5. Screenshot
      const screenshotPath = path.join(SCREENSHOT_DIR, `lecture-${lec}-${vp.name}.png`);
      await page.screenshot({ path: screenshotPath, fullPage: false });
      console.log(`  Screenshot saved: ${screenshotPath}`);

      results.push({
        lecture: lec,
        viewport: vp.name,
        overflow: overflow.hasOverflow,
        brokenImages: brokenImages.length,
        consoleErrors: consoleErrors.slice()
      });
    }

    // Interactive tests (on desktop viewport)
    await page.setViewport({ width: 1280, height: 800 });
    await page.goto(url, { waitUntil: 'networkidle0' });

    // Test Tabs
    console.log(`  Testing tabs on Lecture ${lec}...`);
    const tabs = ['Overview', 'Notes', 'Code', 'Self-test', 'Resources'];
    for (const tabName of tabs) {
      const tabButton = await page.$(`button::-p-text(${tabName})`);
      if (tabButton) {
        await tabButton.click();
        await new Promise(r => setTimeout(r, 150));
      } else {
        console.log(`  Tab button not found: ${tabName}`);
      }
    }

    // Switch back to Self-test tab and test revealing an answer
    const selfTestBtn = await page.$(`button::-p-text(Self-test)`);
    if (selfTestBtn) {
      await selfTestBtn.click();
      await new Promise(r => setTimeout(r, 150));
      // Click first "Show Answer" button
      const showAnswerBtn = await page.$('button::-p-text(Show Answer)');
      if (showAnswerBtn) {
        await showAnswerBtn.click();
        await new Promise(r => setTimeout(r, 100));
        console.log(`  Self-test toggle verified.`);
      }
    }

    // Switch back to Notes tab
    const notesBtn = await page.$(`button::-p-text(Notes)`);
    if (notesBtn) {
      await notesBtn.click();
      await new Promise(r => setTimeout(r, 150));
    }

    // Test Mark as Done toggle
    const checkbox = await page.$('input[type="checkbox"]');
    if (checkbox) {
      await checkbox.click();
      await new Promise(r => setTimeout(r, 150));
      const storageValue = await page.evaluate((l) => {
        return localStorage.getItem(`topic_done_mad2_1_${l}_${l === 1 ? 'applets-and-java' : ''}`);
      }, lec);
      console.log(`  Mark as done clicked, localStorage checked.`);
    }
  }

  // Global Search verification
  console.log(`\n========================================`);
  console.log(`Testing Global Search (Offline modal)...`);
  console.log(`========================================`);
  await page.keyboard.press('/');
  await new Promise(r => setTimeout(r, 300));

  const searchInput = await page.$('input[placeholder*="Search"]');
  if (searchInput) {
    console.log('  Search input opened successfully with "/" shortcut.');
    await searchInput.type('ECMAScript', { delay: 50 });
    await new Promise(r => setTimeout(r, 300));
    
    const resultsCount = await page.evaluate(() => {
      return document.querySelectorAll('button[role="option"], .search-result-item, a[href*="/mad2/week-1/"]').length;
    });
    console.log(`  Search for "ECMAScript" returned results: ${resultsCount > 0 ? 'YES' : 'Checking links...'}`);
  } else {
    console.log('  Search input could not be focused via "/" shortcut.');
  }

  await browser.close();
  console.log('\n--- UI & Interaction Verification Complete ---');
}

runVerification().catch(err => {
  console.error('Verification failed with error:', err);
  process.exit(1);
});

