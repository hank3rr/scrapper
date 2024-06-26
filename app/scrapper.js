const {
  formatDataFromScrapper1,
  formatDataFromScrapper2,
} = require("./helpers");

function scrapeWebsitesSequentially(websitesScraperFnList) {
  let promiseChain = Promise.resolve();

  websitesScraperFnList.forEach((callback) => {
    promiseChain = promiseChain.then(callback);
  });

  return promiseChain
    .then(() => console.log("Scraping has been completed"))
    .catch((error) => console.error("Error during callback execution:", error));
}

function initializeScrapper(browserContextInstance) {
  // For website: https://0x00sec.org/categories
  const scrapper1 = () =>
    new Promise(async (resolve, reject) => {
      const baseUrl = "https://0x00sec.org";
      const page = await browserContextInstance.newPage();
      await page.goto(baseUrl, {
        waitUntil: "domcontentloaded",
        timeout: 300000,
      });

      await page.evaluate(async () => {
        await new Promise((resolve, reject) => {
          const currentDateTime = new Date();
          const timeXMinsFromNow = new Date(
            currentDateTime.getTime() + 3 * 60 * 1000
          );
          let totalHeight = 0;
          const distance = 100;
          const timer = setInterval(async () => {
            const scrollHeight = document.body.scrollHeight;
            window.scrollBy(0, distance);
            totalHeight += distance;

            if (
              totalHeight >= scrollHeight ||
              timeXMinsFromNow - new Date() <= 0
            ) {
              clearInterval(timer);
              resolve();
            }
          }, 500);
        });
      });

      const data = await page.$$eval("table tbody tr", (rows) => {
        return rows.map((row) => {
          const cells = row.querySelectorAll("td, th");

          return Array.from(cells, (cells) => cells.textContent.trim());
        });
      });

      formatDataFromScrapper1(data);
      resolve();
    });

  const scrapper2 = () =>
    new Promise(async (resolve, reject) => {
      const pageLimit = 3;

      for (let pageNo = 1; pageNo <= pageLimit; pageNo++) {
        const baseUrl = `https://www.wilderssecurity.com/forums/security-in-a-world-with-ai.148/page-${pageNo}`;
        const page = await browserContextInstance.newPage();
        await page.goto(baseUrl, {
          waitUntil: "domcontentloaded",
          timeout: 300000,
        });

        const data = await page.$$eval("ol.discussionListItems", (rows) => {
          return rows.map((row) => {
            const cells = row.querySelectorAll("li");

            return Array.from(cells, (cells) => cells.textContent.trim());
          });
        });

        formatDataFromScrapper2(data[0]);
      }
      resolve();
    });
  return scrapeWebsitesSequentially([scrapper1, scrapper2]);
}

module.exports = { initializeScrapper };
