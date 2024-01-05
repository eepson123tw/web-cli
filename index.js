#!/usr/bin/env node
// @ts-nocheck

const fs = require("fs");
const http = require("http");
const url = require("url");
const querystring = require("querystring");

const args = process.argv;
const JSON_OPTION = "--json";
const PORT_OPTION = "--port";

const jsonOptionIndex = args.findIndex((arg) => arg === JSON_OPTION);
const portOptionIndex = args.findIndex((arg) => arg === PORT_OPTION);

const jsonFileName =
  jsonOptionIndex > -1 ? args[jsonOptionIndex + 1] : "data.json";
const port =
  portOptionIndex > -1 ? parseInt(args[portOptionIndex + 1], 10) : 3000;

function readJsonFile(filePath, callback) {
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
}

function writeJsonFile(filePath, jsonData, callback) {
  const dataString = JSON.stringify(jsonData, null, 2);
  fs.writeFile(filePath, dataString, "utf8", callback);
}

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url);

  if (parsedUrl.pathname === "/") {
    const pathToHtml = `${__dirname}/ui/index.html`;
    fs.readFile(pathToHtml, "utf8", (error, data) => {
      if (error) {
        res.writeHead(500);
        res.end("Server Error: Could not find index.html");
        return;
      }
      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(data);
    });
  } else if (req.method === "GET" && req.url === "/data") {
    readJsonFile(jsonFileName, (error, data) => {
      if (error) {
        res.writeHead(500);
        res.end("Server Error");
        return;
      }
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(data));
    });
  } else if (req.method === "POST" && req.url === "/data") {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });
    req.on("end", () => {
      const postData = JSON.parse(body);
      readJsonFile(jsonFileName, (readError, data) => {
        if (readError) {
          res.writeHead(500);
          res.end("Server Error");
          return;
        }
        const updatedData = { ...data, ...postData };
        writeJsonFile(jsonFileName, updatedData, (writeError) => {
          if (writeError) {
            res.writeHead(500);
            res.end("Server Error");
            return;
          }
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify(updatedData));
        });
      });
    });
  } else if (req.method === "GET" && req.url === "/") {
    // 简单的静态文件服务
    fs.readFile("index.html", "utf8", (error, data) => {
      if (error) {
        res.writeHead(500);
        res.end("Server Error");
        return;
      }
      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(data);
    });
  } else {
    res.writeHead(404);
    res.end("Not Found");
  }
});

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
