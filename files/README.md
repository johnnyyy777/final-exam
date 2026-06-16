# 💰 MoneyFlow 個人記帳系統

一個具備完整安全性的 SPA 記帳 Web App，支援使用者驗證、資料隔離與雲端部署。

## 🚀 本地開發

```bash
# 1. 安裝套件
npm install

# 2. 建立 .env 檔（複製範本）
cp .env.example .env
# 填入你的 MONGODB_URI 與 SESSION_SECRET

# 3. 啟動伺服器
npm start
# 開啟 http://localhost:3000
```

## ☁️ Render 部署步驟

1. 將專案推送到 GitHub
2. 前往 [render.com](https://render.com) → New → Web Service
3. 連接你的 GitHub 倉庫
4. 設定環境變數：
   - `MONGODB_URI` → 你的 MongoDB Atlas 連線字串
   - `SESSION_SECRET` → 任意隨機字串（或讓 Render 自動生成）
5. Build Command: `npm install`
6. Start Command: `npm start`
7. 點擊 Deploy！

## 🔐 安全特性

- 密碼以 **bcrypt（cost=10）** 加密儲存，MongoDB 中顯示 `$2b$10$...`
- Session 儲存在 MongoDB（connect-mongo），避免記憶體洩漏
- 所有 `/api/accounts` 路由由 `requireAuth` 中介層保護
- 使用者只能查詢/刪除自己的資料（userId 過濾）

## 📁 專案結構

```
├── server.js          # Express 主程式
├── models/
│   ├── User.js        # 使用者模型（含 bcrypt）
│   └── Account.js     # 記帳模型（含分類）
├── routes/
│   ├── auth.js        # 註冊/登入/登出 API
│   └── accounts.js    # 記帳 CRUD API
├── middleware/
│   └── auth.js        # 未登入攔截（401）
├── public/
│   └── index.html     # 前端 SPA
├── .env.example       # 環境變數範本
├── .gitignore         # 排除 .env, node_modules
└── render.yaml        # Render 部署設定
```
