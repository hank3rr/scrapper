const { formatDataFromScrapper1 } = require("./helpers");

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

      async function scrapeData() {
        const data = await page.$$eval("table tbody tr", (rows) => {
          return rows.map((row) => {
            const cells = row.querySelectorAll("td, th");

            return Array.from(cells, (cells) => cells.textContent.trim());
          });
        });

        //   console.log(data);
        formatDataFromScrapper1(data);
      }
      resolve();
    });

  return scrapeWebsitesSequentially([scrapper1]);
}

module.exports = { initializeScrapper };
