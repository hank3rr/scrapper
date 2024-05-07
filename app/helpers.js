const { exportCsv } = require("./csv-generator");
const fs = require("fs");

function formatDataFromScrapper1(rawData) {
  const formattedData = [];
  rawData.forEach((data) => {
    const length = data.length;
    const topicAndTags = data[0]
      .split("\n")
      .map((str) => str.trim())
      .filter((str) => str);
    formattedData.push({
      topic: topicAndTags[0],
      replies: data[length - 3],
      views: data[length - 2],
      last_activity: data[length - 1],
      tags: topicAndTags.slice(1),
    });
  });
  // console.log(formattedData)
  const csvData = exportCsv(formattedData);
  fs.appendFile("forumReports.csv", csvData, (err) => {
    if (err) {
      console.error("Error appending to CSV:", err);
    }
  });
  return;
}

module.exports = { formatDataFromScrapper1 };
