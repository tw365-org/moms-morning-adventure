# 媽媽的晨光冒險

一段陪媽媽和小狐狸走過晨光小徑的短篇瀏覽器遊戲。可以慢慢探索、使用行動卡，也可以隨時停下來休息。

[正體中文](#正體中文) · [English](#english) · [日本語](#日本語)

## 正體中文

### 關於

《晨光啟程》是一款短篇橫向探索遊戲。媽媽和迷路的小狐狸一起走過奇幻小徑，找回用品、互相幫忙，最後在林間空地休息。沒有倒數計時，也不會因為選錯卡牌而失敗。

### 本機預覽

遊戲使用瀏覽器原生 ES modules。請在專案根目錄啟動本機靜態 HTTP 伺服器，再開啟伺服器網址；直接以 `file://` 開啟 `index.html` 無法載入模組。

```sh
python -m http.server 8000
```

接著前往 `http://localhost:8000`。專案不需要安裝套件或執行建置流程。

### 操作方式

- 電腦：左右方向鍵或 A／D 移動，空白鍵跳躍；滑鼠選擇卡牌。
- 手機／平板：使用畫面下方的左右與跳躍按鈕，點選事件選項。
- 右上角可暫停、調整聲音、重新開始或清除本機進度。

### 專案結構

- `index.html`、`styles.css`：頁面結構與樣式。
- `src/main.js`：建立模組並連接遊戲功能。
- `src/content.js`：卡牌、事件和關卡配置。
- `src/state.js`：遊戲初始狀態與本機存檔。
- `src/engine.js`：移動、關卡流程和事件處理。
- `src/renderer.js`：Canvas 場景繪製。
- `src/ui.js`：卡牌、進度和對話框介面。
- `src/audio.js`、`src/input.js`：聲音、鍵盤和觸控輸入。

### 存檔與隱私

進度和聲音設定只存在目前瀏覽器的 `localStorage`。遊戲不使用後端、不載入外部資源，也不傳送個人資料。

### 署名

製作：中揚資訊　·　共同創作與發表協作：OpenAI Codex（GPT-6）

## English

### About

*Morning Path* is a short browser game about a mother and a lost little fox taking a quiet walk through a fantasy forest. They find a few forgotten things, help each other along the way, and rest in a clearing. There is no timer, and no card choice can end the journey.

### Run locally

The game uses native browser ES modules. Start a static HTTP server from the project root, then open its local URL. Opening `index.html` directly with `file://` will not load the modules.

```sh
python -m http.server 8000
```

Visit `http://localhost:8000`. No package installation or build step is required.

### Controls

- Desktop: Left and Right Arrow keys or A/D to move; Space to jump; use the mouse for cards.
- Mobile and tablet: use the on-screen movement and jump buttons, then tap event choices.
- Pause to adjust sound, restart, or clear local progress.

### Privacy

Progress and sound settings stay in this browser's `localStorage`. The game has no backend, external runtime assets, or personal data collection.

### Credits

Made by 中揚資訊 · Co-created and presented with OpenAI Codex (GPT-6).

## 日本語

### このゲームについて

『朝の小径』は、お母さんと迷子の小さなキツネが、森の小径をゆっくり歩く短編ブラウザーゲームです。忘れ物を探したり、お互いに助け合ったりしながら、最後は木立の中でひと休みします。制限時間はなく、カードの選択でゲームオーバーになることもありません。

### ローカルで遊ぶ

ブラウザー標準の ES modules を使っています。プロジェクトのルートで静的 HTTP サーバーを起動して、そのローカル URL を開いてください。`file://` で `index.html` を直接開くと、モジュールを読み込めません。

```sh
python -m http.server 8000
```

`http://localhost:8000` にアクセスしてください。パッケージのインストールやビルドは不要です。

### 操作方法

- パソコン：左右矢印キーまたは A／D で移動、スペースキーでジャンプ。カードはマウスで選びます。
- スマートフォン／タブレット：画面上の移動・ジャンプボタンとイベント選択肢をタップします。
- 一時停止メニューから音声の調整、最初からの再開、ローカルデータの削除ができます。

### プライバシー

進行状況と音声設定は、このブラウザーの `localStorage` に保存されます。バックエンドや外部アセットは使わず、個人情報も収集しません。

### クレジット

制作：中揚資訊 · OpenAI Codex（GPT-6）と共同制作・発表
