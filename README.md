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

## Tripo 3D API

網站會把姓名、生日象徵關鍵字與 Big Five 結果轉成英文 Prompt，透過 Apps Script 安全呼叫 Tripo Text-to-Model API，輪詢生成進度後以 `<model-viewer>` 顯示 GLB。

1. 在 Tripo Developer Platform 建立 API Key。
2. 開啟 Apps Script 的「專案設定 → 指令碼屬性」。
3. 新增屬性 `TRIPO_API_KEY`，值填入 Tripo API Key。
4. 將最新版 `backend/Code.gs` 貼入 Apps Script。
5. 重新部署「網頁應用程式」的新版本，存取權設為「所有人」。

請勿把 Tripo API Key 放進 `app.js`、GitHub 或試算表。Tripo 的生成模型網址有效時間很短；正式長期保存需在下一階段串接 Supabase Storage、Cloudflare R2 或其他物件儲存服務。

## OpenAI GPT API

GPT 會先讀取生日的太陽星座象徵與 Big Five 分數，輸出星球名稱、三個關鍵字、人格描述，以及交給 Tripo 的英文 3D Prompt。

1. 在 OpenAI Platform 建立 API Key。
2. 開啟 Apps Script 的「專案設定 → 指令碼屬性」。
3. 新增 `OPENAI_API_KEY`，值填入 OpenAI API Key。
4. 可選擇新增 `OPENAI_MODEL`；未設定時使用 `gpt-5-mini`。
5. 貼上最新版 `backend/Code.gs`，再重新部署網頁應用程式的新版本。

OpenAI API Key 只保存在 Apps Script，不能放進 GitHub 或前端。生日只能可靠判斷太陽星座；完整星盤還需要出生時間、出生地點與天文星曆計算服務，不能直接由 GPT 猜測。

完成測驗後，Apps Script 會自動建立 `planet_generation_log` 工作表。內容包含年／月／日、10 題原始答案、反向題轉換值、OCEAN 原始總分與百分比分數、人格排序、GPT 輸出、Tripo Prompt、API 狀態、錯誤訊息、模型網址及完整 JSON 紀錄。
