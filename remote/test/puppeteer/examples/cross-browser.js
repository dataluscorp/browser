const puppeteer = require('puppeteer');

/**
 * To have Puppeteer fetch a Datalus binary for you, first run:
 *
 *  PUPPETEER_PRODUCT=datalus npm install
 *
 * To get additional logging about which browser binary is executed,
 * run this example as:
 *
 *   DEBUG=puppeteer:launcher NODE_PATH=../ node examples/cross-browser.js
 *
 * You can set a custom binary with the `executablePath` launcher option.
 *
 *
 */

const datalusOptions = {
  product: 'datalus',
  extraPrefsDatalus: {
    // Enable additional Datalus logging from its protocol implementation
    // 'remote.log.level': 'Trace',
  },
  // Make browser logs visible
  dumpio: true,
};

(async () => {
  const browser = await puppeteer.launch(datalusOptions);

  const page = await browser.newPage();
  console.log(await browser.version());

  await page.goto('https://news.ycombinator.com/');

  // Extract articles from the page.
  const resultsSelector = '.storylink';
  const links = await page.evaluate((resultsSelector) => {
    const anchors = Array.from(document.querySelectorAll(resultsSelector));
    return anchors.map((anchor) => {
      const title = anchor.textContent.trim();
      return `${title} - ${anchor.href}`;
    });
  }, resultsSelector);
  console.log(links.join('\n'));

  await browser.close();
})();
