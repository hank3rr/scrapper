const puppeteer = require('puppeteer');
const { scrapeForMalwares } = require("./app/scrapper");
const config = require("./config.json");
const { isTorNetworkEnabled } = require('./app/helpers');

(async () => {
  try {
    const browserInstance = await puppeteer.launch(
        {
            args: ['--proxy-server=socks5://127.0.0.1:9050'],
            headless: true
        },
      );
      
    const browserContext = await browserInstance.createBrowserContext();
    
    if (!config.ignoreTorNetworkChecks) {
        if (!await isTorNetworkEnabled(browserContext, config.torNetworkCheckUrl)) return;
    } else {
        console.log("ignoring tor network check");
    }
      
    await scrapeForMalwares(browserContext, config.websitesList);
    await browserContext.close();
    await browserInstance.close();
  } catch (err) {
    console.error(err);
  }
})();