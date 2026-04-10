"""監視リスト（Watchlist）API ルーター"""

from __future__ import annotations

import json
import uuid
from datetime import datetime
from pathlib import Path

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from ..models import (
    Product,
    ProductStatus,
    ProductTrend,
    ProductWithStatus,
    WatchItem,
    WatchItemStatus,
)

router = APIRouter(prefix="/api/watchlist", tags=["watchlist"])

_DATA_PATH = Path(__file__).resolve().parent.parent / "data" / "mock_data.json"

# ─── インメモリストア ─────────────────────────────────────
_watchlist: list[WatchItem] = []
_initialized = False


def _init_store():
    global _watchlist, _initialized
    if _initialized:
        return
    with open(_DATA_PATH, encoding="utf-8") as f:
        data = json.load(f)
    _watchlist = [WatchItem(**w) for w in data.get("watchlist", [])]
    _initialized = True


def _load_data():
    with open(_DATA_PATH, encoding="utf-8") as f:
        data = json.load(f)
    products = [Product(**p) for p in data["products"]]
    trends = {
        pid: ProductTrend(**t) for pid, t in data["trends"].items()
    }
    return products, trends


def _calc_remaining(sale_ends_at: datetime | None) -> str | None:
    """セール終了までの残り時間を計算"""
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
    elif hours > 0:
        minutes = (diff.seconds % 3600) // 60
        return f"あと{hours}時間{minutes}分"
    else:
        minutes = diff.seconds // 60
        return f"あと{minutes}分"


def _get_product_status(product: Product, trend: ProductTrend | None) -> ProductStatus:
    """商品のステータスを判定"""
    is_sale = product.is_sale and product.sale_price is not None
    is_buzz = trend is not None and trend.score >= 70

    if is_sale and is_buzz:
        return ProductStatus.SALE_AND_BUZZ
    elif is_sale:
        return ProductStatus.ON_SALE
    elif is_buzz:
        return ProductStatus.BUZZING
    return ProductStatus.NORMAL


# ─── リクエストモデル ─────────────────────────────────────
class AddWatchRequest(BaseModel):
    keyword: str
    notify_on_sale: bool = True
    notify_on_restock: bool = True
    notify_on_buzz: bool = True


# ─── エンドポイント ───────────────────────────────────────
@router.get("", summary="監視リスト一覧（ステータス付き）")
def list_watchlist() -> list[WatchItemStatus]:
    _init_store()
    products, trends = _load_data()
    product_map = {p.id: p for p in products}

    results: list[WatchItemStatus] = []
    for watch in _watchlist:
        matched: list[ProductWithStatus] = []
        for pid in watch.matched_product_ids:
            product = product_map.get(pid)
            if not product:
                continue
            trend = trends.get(pid)
            status = _get_product_status(product, trend)
            remaining = _calc_remaining(product.sale_ends_at)

            matched.append(
                ProductWithStatus(
                    product=product,
                    status=status,
                    trend=trend,
                    sale_remaining=remaining,
                )
            )
        results.append(WatchItemStatus(watch=watch, matched_products=matched))

    return results


@router.post("", summary="監視キーワード追加", status_code=201)
def add_watch(req: AddWatchRequest) -> WatchItem:
    _init_store()
    products, _ = _load_data()

    # 重複チェック
    for w in _watchlist:
        if w.keyword == req.keyword:
            raise HTTPException(
                status_code=409,
                detail=f"「{req.keyword}」は既に監視リストに登録されています",
            )

    # キーワードにマッチする商品を自動検索
    kw = req.keyword.lower()
    matched_ids = [
        p.id for p in products
        if kw in p.name.lower()
        or kw in p.brand.lower()
        or (p.name_en and kw in p.name_en.lower())
        or any(kw in tag.lower() for tag in p.tags)
    ]

    watch = WatchItem(
        id=f"watch_{uuid.uuid4().hex[:8]}",
        keyword=req.keyword,
        matched_product_ids=matched_ids,
        notify_on_sale=req.notify_on_sale,
        notify_on_restock=req.notify_on_restock,
        notify_on_buzz=req.notify_on_buzz,
        created_at=datetime.now(),
    )
    _watchlist.append(watch)
    return watch


@router.delete("/{watch_id}", summary="監視キーワード削除")
def delete_watch(watch_id: str) -> dict:
    _init_store()
    for i, w in enumerate(_watchlist):
        if w.id == watch_id:
            _watchlist.pop(i)
            return {"message": "監視キーワードを削除しました", "id": watch_id}
    raise HTTPException(status_code=404, detail="監視アイテムが見つかりません")


@router.get("/alerts", summary="監視商品のアラート一覧")
def get_alerts() -> list[ProductWithStatus]:
    """監視リストの中でセール中またはバズ中の商品だけを返す"""
    _init_store()
    products, trends = _load_data()
    product_map = {p.id: p for p in products}

    alerts: list[ProductWithStatus] = []
    seen_ids: set[str] = set()

    for watch in _watchlist:
        for pid in watch.matched_product_ids:
            if pid in seen_ids:
                continue
            product = product_map.get(pid)
            if not product:
                continue
            trend = trends.get(pid)
            status = _get_product_status(product, trend)
            if status != ProductStatus.NORMAL:
                remaining = _calc_remaining(product.sale_ends_at)
                alerts.append(
                    ProductWithStatus(
                        product=product,
                        status=status,
                        trend=trend,
                        sale_remaining=remaining,
                    )
                )
                seen_ids.add(pid)

    return alerts
