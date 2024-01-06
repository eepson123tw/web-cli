// serverRoutes.js
const fileOperations = require("../utils/fileOperations");
const fs = require("fs");
const path = require("path");
const handleGetJson = (req, res, jsonFileName) => {
  fileOperations.readJsonFile(jsonFileName, (error, data) => {
    if (error) {
      res.writeHead(500);
      res.end("Server Error");
      return;
    }
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(data));
  });
};
const handlePostJson = (req, res, jsonFileName) => {
  let body = "";
  req.on("data", (chunk) => {
    body += chunk.toString();
  });
  req.on("end", () => {
    try {
      const postData = JSON.parse(body);
      fileOperations.readJsonFile(jsonFileName, (readError, data) => {
        if (readError) {
          res.writeHead(500);
          res.end("Server Error: Unable to read file");
          return;
        }
        const updatedData = { ...data, ...postData };
        fileOperations.writeJsonFile(
          jsonFileName,
          updatedData,
          (writeError) => {
            if (writeError) {
              res.writeHead(500);
              res.end("Server Error: Unable to write file");
              return;
            }
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify(updatedData));
          }
        );
      });
    } catch (parseError) {
      res.writeHead(400);
      res.end("Invalid JSON format");
    }
  });
};
const handleStaticFiles = (req, res, filePath) => {
  // Simple path normalization to prevent directory traversal
  const safePath = path.normalize(filePath).replace(/^(\.\.[\/\\])+/, "");
  const fullPath = path.join(__dirname, "..", safePath);
  fs.readFile(fullPath, (error, data) => {
    if (error) {
      res.writeHead(404);
      res.end("Not Found");
      return;
    }
    // Determine content type by file extension
    let contentType = "text/plain";
    if (fullPath.endsWith(".html")) {
      contentType = "text/html";
    } else if (fullPath.endsWith(".js")) {
      contentType = "application/javascript";
    } else if (fullPath.endsWith(".css")) {
      contentType = "text/css";
    }

    res.writeHead(200, { "Content-Type": contentType });
    res.end(data);
  });
};

module.exports = { handleGetJson, handlePostJson, handleStaticFiles };
