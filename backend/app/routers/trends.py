"""トレンド API ルーター"""

from __future__ import annotations

import json
from pathlib import Path
from typing import Optional

from fastapi import APIRouter, Query

from ..models import Product, ProductTrend, ProductWithTrend

router = APIRouter(prefix="/api/trends", tags=["trends"])

_DATA_PATH = Path(__file__).resolve().parent.parent / "data" / "mock_data.json"


def _load_data() -> tuple[list[Product], dict[str, ProductTrend]]:
    with open(_DATA_PATH, encoding="utf-8") as f:
        data = json.load(f)
    products = [Product(**p) for p in data["products"]]
    trends = {
        pid: ProductTrend(**t) for pid, t in data["trends"].items()
    }
    return products, trends


# ─── エンドポイント ───────────────────────────────────────
@router.get("", summary="トレンドランキング")
def list_trends(
    limit: int = Query(10, ge=1, le=50, description="取得件数"),
) -> list[ProductWithTrend]:
    products, trends = _load_data()
    product_map = {p.id: p for p in products}

    ranked = sorted(trends.values(), key=lambda t: t.score, reverse=True)
    results: list[ProductWithTrend] = []

    for trend in ranked[:limit]:
        product = product_map.get(trend.product_id)
        if product:
            results.append(ProductWithTrend(product=product, trend=trend))

    return results


@router.get("/hot", summary="急上昇商品")
def hot_products(
    threshold: float = Query(
        75.0, description="急上昇判定の閾値スコア"
    ),
) -> list[ProductWithTrend]:
    products, trends = _load_data()
    product_map = {p.id: p for p in products}

    hot = [t for t in trends.values() if t.score >= threshold]
    hot.sort(key=lambda t: t.score, reverse=True)

    return [
        ProductWithTrend(
            product=product_map[t.product_id], trend=t
        )
        for t in hot
        if t.product_id in product_map
    ]


@router.get("/{product_id}/history", summary="トレンド推移データ")
def trend_history(product_id: str) -> Optional[ProductTrend]:
    _, trends = _load_data()
    return trends.get(product_id)
