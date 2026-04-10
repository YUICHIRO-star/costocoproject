"""Costco Sniper — FastAPI メインアプリケーション"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .routers import favorites, price_history, products, trends, watchlist

app = FastAPI(
    title="Costco Sniper API",
    description="コストコ特化型パーソナライズ＆ソーシャルトレンド追跡 API",
    version="0.2.0",
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
app.include_router(watchlist.router)
app.include_router(price_history.router)


# ─── Sniper ダッシュボード統合 API ────────────────────────
@app.get("/api/dashboard", tags=["dashboard"], summary="Sniperダッシュボード")
def get_sniper_dashboard():
    """ダッシュボード表示に必要な全データをまとめて返す"""
    import json
    from datetime import datetime
    from pathlib import Path

    from .models import (
        Notification,
        Product,
        ProductStatus,
        ProductTrend,
        ProductWithStatus,
        ProductWithTrend,
        SniperDashboard,
        WatchItem,
        WatchItemStatus,
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
    watch_items = [
        WatchItem(**w) for w in data.get("watchlist", [])
    ]

    product_map = {p.id: p for p in all_products}

    def _calc_remaining(sale_ends_at):
        if not sale_ends_at:
            return None
        now = datetime.now()
        diff = sale_ends_at - now
        if diff.total_seconds() <= 0:
            return "終了"
        days = diff.days
        hours = diff.seconds // 3600
        if days > 0:
            return f"あと{days}日{hours}時間"
        return f"あと{hours}時間"

    def _get_status(product, trend):
        is_sale = product.is_sale and product.sale_price is not None
        is_buzz = trend is not None and trend.score >= 70
        if is_sale and is_buzz:
            return ProductStatus.SALE_AND_BUZZ
        elif is_sale:
            return ProductStatus.ON_SALE
        elif is_buzz:
            return ProductStatus.BUZZING
        return ProductStatus.NORMAL

    # 監視リストのステータス
    watchlist_alerts: list[WatchItemStatus] = []
    for watch in watch_items:
        matched: list[ProductWithStatus] = []
        for pid in watch.matched_product_ids:
            product = product_map.get(pid)
            if not product:
                continue
            trend = all_trends.get(pid)
            status = _get_status(product, trend)
            remaining = _calc_remaining(product.sale_ends_at)
            matched.append(
                ProductWithStatus(
                    product=product,
                    status=status,
                    trend=trend,
                    sale_remaining=remaining,
                )
            )
        watchlist_alerts.append(
            WatchItemStatus(watch=watch, matched_products=matched)
        )

    # バズ商品（スコア >= 70）
    buzz = [
        ProductWithTrend(product=product_map[t.product_id], trend=t)
        for t in sorted(
            all_trends.values(), key=lambda x: x.score, reverse=True
        )
        if t.score >= 70 and t.product_id in product_map
    ]

    # セール中の商品
    sales = [
        ProductWithTrend(
            product=p,
            trend=all_trends.get(p.id),
        )
        for p in all_products
        if p.is_sale and p.sale_price is not None
    ]

    # トレンドランキング（上位8）
    trending = [
        ProductWithTrend(product=product_map[t.product_id], trend=t)
        for t in sorted(
            all_trends.values(), key=lambda x: x.score, reverse=True
        )[:8]
        if t.product_id in product_map
    ]

    active_sales = sum(1 for p in all_products if p.is_sale)
    unread = [n for n in notifications if not n.is_read]

    return SniperDashboard(
        watchlist_alerts=watchlist_alerts,
        buzz_products=buzz,
        sale_products=sales,
        trending=trending,
        total_products=len(all_products),
        active_sales=active_sales,
        watching_keywords=len(watch_items),
        unread_notifications=len(unread),
        notifications=unread,
    )


@app.get("/", tags=["root"])
def root():
    return {
        "app": "Costco Sniper API",
        "version": "0.2.0",
        "docs": "/docs",
    }
