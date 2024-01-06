const fs = require("fs");

const readJsonFile = (filePath, callback) => {
  fs.readFile(filePath, "utf8", (error, data) => {
    if (error) {
      callback(error, null);
      return;
    }
    try {
      const jsonData = JSON.parse(data);
      callback(null, jsonData);
    } catch (parseError) {
      callback(parseError, null);
    }
  });
};

const writeJsonFile = (filePath, jsonData, callback) => {
  const dataString = JSON.stringify(jsonData, null, 2);
  fs.writeFile(filePath, dataString, "utf8", callback);
};

module.exports = { readJsonFile, writeJsonFile };
