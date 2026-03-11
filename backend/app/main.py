"""CostcoTrendTracker — FastAPI メインアプリケーション"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .routers import favorites, products, trends

app = FastAPI(
    title="CostcoTrendTracker API",
    description="コストコ特化型パーソナライズ＆ソーシャルトレンド追跡 API",
    version="0.1.0",
)

# ─── CORS 設定 ────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── ルーター登録 ─────────────────────────────────────────
app.include_router(products.router)
app.include_router(trends.router)
app.include_router(favorites.router)


# ─── ダッシュボード統合 API ───────────────────────────────
@app.get("/api/dashboard", tags=["dashboard"], summary="ダッシュボードデータ")
def get_dashboard():
    """ダッシュボード表示に必要な全データをまとめて返す"""
    import json
    from pathlib import Path

    from .models import (
        DashboardData,
        Notification,
        Product,
        ProductTrend,
        ProductWithTrend,
    )

    data_path = (
        Path(__file__).resolve().parent / "data" / "mock_data.json"
    )
    with open(data_path, encoding="utf-8") as f:
        data = json.load(f)

    all_products = [Product(**p) for p in data["products"]]
    all_trends = {
        pid: ProductTrend(**t) for pid, t in data["trends"].items()
    }
    notifications = [
        Notification(**n) for n in data.get("notifications", [])
    ]

    product_map = {p.id: p for p in all_products}
    categories = list({p.category.value for p in all_products})

    # 急上昇（スコア >= 80）
    hot = [
        ProductWithTrend(
            product=product_map[t.product_id], trend=t
        )
        for t in sorted(
            all_trends.values(), key=lambda x: x.score, reverse=True
        )
        if t.score >= 80 and t.product_id in product_map
    ]

    # 上昇中（55 <= スコア < 80）
    trending = [
        ProductWithTrend(
            product=product_map[t.product_id], trend=t
        )
        for t in sorted(
            all_trends.values(), key=lambda x: x.score, reverse=True
        )
        if 55 <= t.score < 80 and t.product_id in product_map
    ]

    return DashboardData(
        hot_products=hot,
        trending_products=trending,
        categories=sorted(categories),
        total_products=len(all_products),
        notifications=[n for n in notifications if not n.is_read],
    )


@app.get("/", tags=["root"])
def root():
    return {
        "app": "CostcoTrendTracker API",
        "version": "0.1.0",
        "docs": "/docs",
    }
