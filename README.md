# 🎯 Costco Sniper

コストコ特化型パーソナライズ＆ソーシャルトレンド追跡アプリ

## コンセプト

「すべてのチラシを、あなた専用の1枚に」

監視キーワードに一致する商品の値下げ・バズをリアルタイム検知し、
「今、買うべき商品」だけを抽出（スナイプ）する究極の時短・節約ツール。

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
