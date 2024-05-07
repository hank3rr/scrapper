let isFnCalledOnce = false;

exports.exportCsv = (reportList) => {
  const data = [];
  // console.log(malwaresList);
  for (const report of reportList) {
    let row = {
      Topic: report.topic,
      Replies: report.replies,
      Views: report.views,
      "Last Activity": report.last_activity,
      Tags: report.tags,
    };
    data.push(row);
  }

  const csvRows = [];
  const headers = Object.keys(data[0]).length ? Object.keys(data[0]) : null;

  if (!headers) return;

  if (!isFnCalledOnce) {
    csvRows.push(headers.join(",") + "\n");
    isFnCalledOnce = true;
  }

  for (const row of data) {
    const values = headers.map((header, index) => {
      let escaped = ("" + row[header]).replace(/"/g, '\\"');
      return `"${escaped}"`;
    });

    csvRows.push(values.join(",") + "\n");
  }

  return csvRows.join("");
};
