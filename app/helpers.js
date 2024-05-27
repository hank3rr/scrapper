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

function formatDataFromScrapper2(rawData) {
  const formattedData = [];
  rawData.forEach((data) => {
    const topicAndTags = data
      .split("\n")
      .map((str) => str.trim())
      .filter((str) => str);
    console.log(topicAndTags);
    formattedData.push({
      topic: topicAndTags[0],
      replies: topicAndTags[3].split(":")[1].trim(),
      views: topicAndTags[4].split(":")[1].trim(),
      last_activity: topicAndTags[topicAndTags.length - 1],
      tags: "Artificial Intelligence, Malware",
    });
  });
  // console.log(formattedData)
  const csvData = exportCsv(formattedData);
  fs.appendFile("forumReports-2.csv", csvData, (err) => {
    if (err) {
      console.error("Error appending to CSV:", err);
    }
  });
  return;
}

module.exports = { formatDataFromScrapper1, formatDataFromScrapper2 };
