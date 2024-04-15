let isFnCalledOnce = false;

exports.exportCsv = (malwaresList) => {
    const data = [];
    // console.log(malwaresList);
    for (const malware of malwaresList) {
        let row = {
            "Program name": malware.fileName,
            "Target Device": malware.device,
            "Attack Severity": malware.severity,
            "Extension": malware.ext,
          };
          data.push(row);    
        
    }
  
    const csvRows = [];
    const headers = Object.keys(data[0]).length ? Object.keys(data[0]): null;

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