const puppeteer = require("puppeteer");
const { initializeScrapper } = require("./app/scrapper");

(async () => {
  try {
    const browserInstance = await puppeteer.launch({
      headless: false,
      args: ["--disable-gpu"],
      protocolTimeout: 300000,
    });

    const browserContext = await browserInstance.createBrowserContext();

    await initializeScrapper(browserContext);
    await browserContext.close();
    await browserInstance.close();
  } catch (err) {
    console.error(err);
  }
})();
