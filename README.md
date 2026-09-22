# INNERVERSE

**Discover the universe within you.**

INNERVERSE 是一個受 Big Five 人格模型啟發的互動人格探索網站。使用者回答 10 道題後，五個人格維度會被轉化成一顆專屬星球，並加入所有參與者共同構成的宇宙。

## 功能

- 10 題互動測驗（O／C／E／A／N 各 2 題，包含反向題）
- 五種人格星球與五維分數
- 依分數生成專屬星球
- 宇宙資料視覺化
- 點擊星球時，同類型星球同步發光
- Google Apps Script + Google Sheets 後端預留
- RWD 手機與桌面版

## 本機預覽

直接開啟 `index.html`，或執行：

```bash
python3 -m http.server 8000
```

瀏覽 `http://localhost:8000`。

## GitHub Pages

到 Repository 的 **Settings → Pages**，在 **Build and deployment** 選擇：

- Source：Deploy from a branch
- Branch：main / root

## Google Sheets 後端

完整後端程式位於 [`backend/Code.gs`](backend/Code.gs)。

1. 建立一份 Google 試算表，從網址複製試算表 ID。
2. 開啟「擴充功能 → Apps Script」。
3. 將 `backend/Code.gs` 全部貼入，並把 `SPREADSHEET_ID` 換成你的 ID。
4. 選擇「部署 → 新部署 → 網頁應用程式」。
5. 執行身分選「我」，存取權選「任何人」。
6. 複製 `/exec` 結尾的 Web App URL。
7. 貼到 `app.js` 第一行的 `API_URL`：

```js
const API_URL = "https://script.google.com/macros/s/你的部署ID/exec";
```

後端未設定時，網站會使用 Local Storage 保存測驗結果，並載入示範星球。

> 本作品用於互動設計與自我探索，並非臨床心理評估。
