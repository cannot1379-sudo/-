<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/537dcc5d-0704-4ce8-94d6-042a968bafa3

## 專案設定與操作紀錄

1. **套件管理與啟動 (package.json)**
   - 專案已配置好 Vite、React 等相關依賴於 `package.json` 內。
   - 請先確保您的電腦有安裝 **Node.js**。
   - 執行 `npm install` 來安裝所需套件。
   - 執行 `npm run dev` 來啟動本地開發伺服器，預設將在 `http://localhost:3000` 運行。

2. **自動部署 (GitHub Actions)**
   - 已建立 `.github/workflows/deploy.yml`。
   - 當您推播程式碼至 `main` 分支時，會自動觸發 GitHub Actions，進行專案建置 (`npm run build`) 並發布至 GitHub Pages。
   - 請記得在 GitHub Repository 的 Settings > Pages 中，將 Source 設定為 `GitHub Actions`。

3. **版本控制忽略清單 (.gitignore)**
   - 已更新 `.gitignore`，自動忽略 `node_modules`、建置資料夾 (`dist`、`build`)、測試覆蓋率報表、本機暫存檔 (如 `.DS_Store`) 以及環境變數檔案 (`.env`) 等，保護隱私檔及減少不必要檔案的追蹤。

## Run Locally

**Prerequisites:** Node.js

1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key (如果您有使用的話)
3. Run the app:
   `npm run dev`
