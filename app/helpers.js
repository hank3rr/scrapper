const config = require("./../config.json")
const { exportCsv } = require("./csv-generator");
const fs = require("fs");

async function isTorNetworkEnabled(contextInstance, torUrl) {
    console.log("checking if the browser is using tor network");
    const page = await contextInstance.newPage();
    await page.goto(torUrl);

    const isTorNetwork =  await page.$eval('body', (el) =>
        el.innerHTML.includes('Congratulations. This browser is configured to use Tor')
    );
    console.log("connected to tor network: " + isTorNetwork);
    return isTorNetwork;
}

function formatData (urlConfig, data, enums) {
    const formattedData = [];
    data.forEach((malwareData) => {
        if (!malwareData.includes(enums.NO_SPECIFIC_THREAT)) {
            formattedData.push({
                fileName: malwareData[0],
                device: (config.extensionsAndTargetDevices[malwareData[0].split(".").pop()] ? config.extensionsAndTargetDevices[malwareData[0].split(".").pop()]: config.extensionsAndTargetDevices["default"]),
                severity: urlConfig.severity[malwareData[malwareData.length - 2]],
                ext: malwareData[0].split(".").pop()
            });
        }
    });
    
    // console.log(formattedData)
    const csvData = exportCsv(formattedData);
    fs.appendFile("malwareReports.csv", csvData, (err) => {
        if (err) {
            console.error('Error appending to CSV:', err);
          }
    });
    return;
}

module.exports = { isTorNetworkEnabled, formatData };