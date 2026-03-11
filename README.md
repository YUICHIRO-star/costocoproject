# 🛒 CostcoTrendTracker

コストコ特化型パーソナライズ＆ソーシャルトレンド追跡アプリ

## 概要

CostcoTrendTracker は、コストコの商品トレンドをSNSのバズ度から可視化し、
ユーザーのお気に入り商品の価格変動や入荷情報をリアルタイムに追跡するプラットフォームです。

## セットアップ

### バックエンド

```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```

API: http://localhost:8000
APIドキュメント: http://localhost:8000/docs

### フロントエンド

```bash
cd frontend
npm install
npm run dev
```

アプリ: http://localhost:5173

## 技術スタック

- **バックエンド**: Python / FastAPI
- **フロントエンド**: React / Vite / Tailwind CSS v4
- **データ**: モックデータ（フェーズ1）→ API連携（フェーズ2以降）
