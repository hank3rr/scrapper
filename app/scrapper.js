const { formatData } = require("./helpers")

const enums = {
    NO_SPECIFIC_THREAT: "no specific threat"
}

function scrapeForMalwares (browserContextInstance, urlsList) {
    const promises = [];
    urlsList.forEach(async (urlConfig) => {
        for (let pageNo = urlConfig.pageLimitStart; pageNo < urlConfig.pageLimit; pageNo++) {
            promises.push(new Promise(async(resolve, reject) => {
                try {   
                    setTimeout(async() => {
                        console.log("visiting URL: " + urlConfig.url + `?page=${pageNo}`);
                        const page = await browserContextInstance.newPage();
                        await page.goto(urlConfig.url + `?page=${pageNo}`, { waitUntil: 'domcontentloaded', timeout: 300000 });
                      
                        const data = await page.$$eval(urlConfig.elementsLocator.mainContent, (rows) => {
                            return rows.map((row) => {
                            const cells = row.querySelectorAll(urlConfig.elementsLocator.tableElements);
                            
                            return Array.from(cells, (cells) => cells.textContent.trim());
                            });
                        });
                        // console.log(data);
        
                        if (urlConfig.hasSubPaths) await scrapeSubPages(browserContextInstance, data, urlConfig);
                        resolve();
                    }, urlConfig.pageCallDelayInMs)
                } catch (err) {
                    reject(err);
                }
            }))
        }
        
    });

    return Promise.allSettled(promises);   
     
}


function scrapeSubPages (browserContextInstance, data, urlConfig) {
    const promises = [];
    data.forEach((row) => {
        promises.push(new Promise(async (resolve, reject) => {
            try {
                if (!row.includes(enums.NO_SPECIFIC_THREAT)) {
                    setTimeout(async () => {
                        const id = row[urlConfig.subPathIdIndex].split(" ").pop();
                    
                        console.log("visiting URL: " + urlConfig.subUrl + `/${id}`);
                        const page = await browserContextInstance.newPage();
                        await page.goto(urlConfig.subUrl + `/${id}`, { waitUntil: 'domcontentloaded', timeout: 300000 });
                      
                        const data = await page.$$eval(urlConfig.elementsLocator.subPageContent, (rows) => {
                            return rows.map((row) => {
                            const cells = row.querySelectorAll(urlConfig.elementsLocator.tableElements);
                            
                            return Array.from(cells, (cells) => cells.textContent.trim());
                            });
                        });
                        // console.log(data);
                        formatData(urlConfig, data, enums);
                        resolve();
                    }, urlConfig.pageCallDelayInMs)
                } else {
                    reject();
                }
            } catch (err) {
                reject(err);
            }
        }))
    });

    return Promise.allSettled(promises);
} 
module.exports = { scrapeForMalwares };