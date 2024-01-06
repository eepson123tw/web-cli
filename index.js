#!/usr/bin/env node
// @ts-nocheck

const http = require("http");
const url = require("url");
const jsonRoutes = require("./routes/jsonRoutes");

const args = process.argv;
const JSON_OPTION = "--json";
const PORT_OPTION = "--port";

const jsonOptionIndex = args.findIndex((arg) => arg === JSON_OPTION);
const portOptionIndex = args.findIndex((arg) => arg === PORT_OPTION);

const jsonFileName =
  jsonOptionIndex > -1 ? args[jsonOptionIndex + 1] : "data.json";
const port =
  portOptionIndex > -1 ? parseInt(args[portOptionIndex + 1], 10) : 3000;

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url);

  if (parsedUrl.pathname === "/" && req.method === "GET") {
    // 為 root 提供 UI 的 index.html
    jsonRoutes.handleStaticFiles(req, res, "./public/index.html");
  } else if (parsedUrl.pathname === "/data" && req.method === "GET") {
    // 處理獲取 JSON 數據的 GET 請求
    jsonRoutes.handleGetJson(req, res, jsonFileName);
  } else if (parsedUrl.pathname === "/data" && req.method === "POST") {
    // 處理更新 JSON 數據的 POST 請求
    jsonRoutes.handlePostJson(req, res, jsonFileName);
  } else {
    // 靜態文件
    const staticFilePath = "./public" + parsedUrl.pathname;
    jsonRoutes.handleStaticFiles(req, res, staticFilePath);
  }
});

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
