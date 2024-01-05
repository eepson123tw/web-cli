# JSON 編輯器

這是一個簡易的 JSON 編輯器，它可以讓您在網頁上直接查看、編輯和更新 JSON 檔案的內容。

## 功能

- **查看 JSON 數據**：在網頁上清晰顯示當前 JSON 檔案內容。
- **編輯 JSON 數據**：直接在網頁上的文本區域中編輯 JSON 數據。
- **更新 JSON 數據**：通過按鈕提交您的更改，並實時更新顯示的 JSON 數據。

## 如何使用

1. **啟動服務器**：運行 `index.js` 來啟動您的 JSON 編輯器服務器。

   ```bash
   web-cli --json <路徑/至/您的/json檔案> --port <指定端口號>
   ```

2. **查看和編輯 JSON**：在瀏覽器中訪問 `http://localhost:<指定端口號>` 來開啟 JSON 編輯器。

3. **更新 JSON**：在文本區域中修改 JSON 數據後，點擊 "Update JSON" 按鈕來提交更改。

## 配置

您可以通過命令行參數來配置 JSON 編輯器：

- `--json`：指定要編輯的 JSON 檔案的路徑。
- `--port`：指定服務器監聽的端口號。

例如：

```bash
web-cli --json ./data/log.json --port 8080
```
